import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.mjs";

const USER_IDS = {
  editor: "11111111-1111-4111-8111-111111111111",
  admin: "22222222-2222-4222-8222-222222222222",
  viewer: "33333333-3333-4333-8333-333333333333"
};
const ITEM_ID = "44444444-4444-4444-8444-444444444444";

function makeApp({
  env = {},
  fetchImpl = async () => { throw new Error("unexpected fetch"); },
  publishedChatContent = [],
  nlpReadFails = false
} = {}) {
  const calls = [];
  const nlpRows = new Map();
  const roles = {
    [USER_IDS.editor]: "editor_guru_staf",
    [USER_IDS.admin]: "admin_it",
    [USER_IDS.viewer]: null
  };
  const service = {
    getRole: async (id) => roles[id] ?? null,
    getPublishedChatContent: async () => publishedChatContent,
    getChatAnalytics: async () => ({
      days: 30,
      total: 2,
      truncated: false,
      categories: { academic_agenda: 1, news: 1 },
      outcomes: { resolved: 1, fallback: 1 },
      recent: [{ category: "academic_agenda", outcome: "resolved", model: "test-model", created_at: "2026-01-01T00:00:00.000Z" }]
    }),
    listPublished: async (resource, options) => ({ items: [{ resource }], total: 1, ...options }),
    getPublished: async (_resource, id) => ({ id, is_published: true }),
    listAdmin: async (resource) => ({ items: [{ resource, draft: true }], total: 1, limit: 50, offset: 0 }),
    createContent: async (resource, payload) => {
      calls.push({ op: "create", resource, payload });
      return { id: ITEM_ID, ...payload };
    },
    updateContent: async (resource, id, payload) => ({ id, resource, ...payload }),
    deleteContent: async (resource, id) => { calls.push({ op: "delete", resource, id }); },
    setUserRole: async (userId, role) => { calls.push({ op: "set-role", userId, role }); },
    recordChatAnalytics: async (row) => { calls.push({ op: "analytics", row }); },
    // Penyimpanan NLP in-memory yang meniru tabel cms_chatbot_nlp_results.
    saveNlpResult: async (result) => {
      const id = `nlp-${nlpRows.size + 1}`;
      nlpRows.set(id, { id, ...structuredClone(result) });
      calls.push({ op: "nlp-save", id });
      return id;
    },
    getNlpResult: async (id) => {
      calls.push({ op: "nlp-get", id });
      if (nlpReadFails || !nlpRows.has(id)) throw new Error("DEPENDENCY_ERROR");
      return nlpRows.get(id);
    },
    purgeExpiredNlpResults: async () => {}
  };
  const publicClient = {
    auth: {
      getUser: async (token) => USER_IDS[token]
        ? { data: { user: { id: USER_IDS[token] } }, error: null }
        : { data: { user: null }, error: new Error("invalid token") }
    }
  };
  const serviceClient = {};
  const app = createApp({
    publicClient,
    serviceClient,
    service,
    fetchImpl,
    env: { FRONTEND_ORIGINS: "http://localhost:3000", ...env }
  });
  return { app, calls, nlpRows };
}

test("health and published content are public with pagination", async () => {
  const { app } = makeApp();
  const health = await request(app).get("/health").expect(200);
  assert.deepEqual(health.body.data, { status: "ok" });
  const response = await request(app)
    .get("/api/public/news?limit=10&offset=5")
    .set("Origin", "http://localhost:3000")
    .expect(200);
  assert.equal(response.body.data.limit, 10);
  assert.equal(response.headers["access-control-allow-origin"], "http://localhost:3000");
});

test("public item reads and authenticated draft listings use the expected route parameters", async () => {
  const { app } = makeApp();
  const publicItem = await request(app).get(`/api/public/news/${ITEM_ID}`).expect(200);
  assert.equal(publicItem.body.data.id, ITEM_ID);
  const drafts = await request(app).get("/api/admin/hero-banners")
    .set("Authorization", "Bearer editor").expect(200);
  assert.equal(drafts.body.data.items[0].resource, "hero-banners");
});

test("admin identity and chatbot analytics are protected and return privacy-safe aggregates", async () => {
  const { app } = makeApp();
  const me = await request(app).get("/api/admin/me")
    .set("Authorization", "Bearer editor").expect(200);
  assert.deepEqual(me.body.data, { userId: USER_IDS.editor, role: "editor_guru_staf" });

  const analytics = await request(app).get("/api/admin/analytics")
    .set("Authorization", "Bearer editor").expect(200);
  assert.equal(analytics.body.data.total, 2);
  assert.equal(analytics.body.data.categories.academic_agenda, 1);
  assert.equal("prompt" in analytics.body.data, false);

  await request(app).get("/api/admin/analytics").expect(401);
  await request(app).get("/api/admin/analytics")
    .set("Authorization", "Bearer viewer").expect(403);
});

test("public API rejects untrusted origins and invalid pagination", async () => {
  const { app } = makeApp();
  await request(app).get("/api/public/news").set("Origin", "https://attacker.example").expect(403);
  await request(app).get("/api/public/news?limit=1000").expect(400);
});

test("unverified and unassigned users cannot access CMS writes", async () => {
  const { app } = makeApp();
  const payload = { title: "Berita", slug: "berita", body: "Isi" };
  await request(app).post("/api/admin/news").send(payload).expect(401);
  await request(app).post("/api/admin/news").set("Authorization", "Bearer invalid").send(payload).expect(401);
  await request(app).post("/api/admin/news").set("Authorization", "Bearer viewer").send(payload).expect(403);
});

test("editor can create/update but cannot delete content", async () => {
  const { app, calls } = makeApp();
  const payload = { title: "Kabar sekolah", slug: "kabar-sekolah", body: "Konten terverifikasi", is_published: false };
  const created = await request(app).post("/api/admin/news")
    .set("Authorization", "Bearer editor").send(payload).expect(201);
  assert.equal(created.body.data.title, payload.title);
  await request(app).patch(`/api/admin/news/${ITEM_ID}`)
    .set("Authorization", "Bearer editor").send({ title: "Judul baru" }).expect(200);
  await request(app).delete(`/api/admin/news/${ITEM_ID}`)
    .set("Authorization", "Bearer editor").expect(403);
  assert.equal(calls.filter((call) => call.op === "delete").length, 0);
});

test("content validation rejects unsupported or server-managed properties", async () => {
  const { app } = makeApp();
  await request(app).post("/api/admin/news").set("Authorization", "Bearer editor")
    .send({ title: "x", slug: "x", body: "y", created_at: "2020-01-01T00:00:00Z" })
    .expect(400);
  await request(app).post("/api/admin/news").set("Authorization", "Bearer editor")
    .send({ title: "x", slug: "../x", body: "y" }).expect(400);
});

test("admin can delete content and assign roles but cannot demote self", async () => {
  const { app, calls } = makeApp();
  await request(app).delete(`/api/admin/news/${ITEM_ID}`)
    .set("Authorization", "Bearer admin").expect(204);
  await request(app).put(`/api/admin/users/${USER_IDS.editor}/role`)
    .set("Authorization", "Bearer admin").send({ role: "editor_guru_staf" }).expect(204);
  await request(app).put(`/api/admin/users/${USER_IDS.admin}/role`)
    .set("Authorization", "Bearer admin").send({ role: "editor_guru_staf" }).expect(409);
  assert.equal(calls.some((call) => call.op === "set-role"), true);
});

test("chat uses the second configured model as fallback and records no prompt text", async () => {
  const modelRequests = [];
  const fetchImpl = async (_url, options) => {
    const body = JSON.parse(options.body);
    modelRequests.push(body.model);
    if (body.model === "test-one") return { ok: false, status: 503 };
    return { ok: true, json: async () => ({ choices: [{ message: { content: "Silakan lihat agenda." } }] }) };
  };
  const env = {
    GROQ_API_KEY: "test-key",
    GROQ_BASE_URL: "https://provider.example/v1",
    GROQ_MODEL_1: "test-one",
    GROQ_MODEL_2: "test-two",
    GROQ_MODEL_3: "test-three"
  };
  const { app, calls, nlpRows } = makeApp({
    env,
    fetchImpl,
    publishedChatContent: [{
      resource: "academic-agenda",
      title: "Agenda sekolah hari Jumat",
      description: "Agenda kegiatan sekolah berlangsung hari Jumat.",
      starts_at: "2026-11-06T08:00:00.000Z"
    }]
  });
  const privateQuestion = "Agenda sekolah untuk hari Jumat?";
  const response = await request(app).post("/api/public/chat").send({ message: privateQuestion }).expect(200);
  assert.equal(response.body.data.reply, "Silakan lihat agenda.");
  assert.deepEqual(modelRequests, ["test-one", "test-two"]);
  const analytics = calls.find((call) => call.op === "analytics").row;
  assert.deepEqual(analytics, { category: "academic_agenda", outcome: "fallback", model: "test-two" });
  assert.equal(JSON.stringify(analytics).includes(privateQuestion), false);
  assert.equal(response.body.data.bot, "Wilhel");
  assert.equal(response.body.data.intent, "academic_agenda");
  assert.equal(JSON.stringify([...nlpRows.values()]).includes(privateQuestion), false);
});

test("Wilhel flow: NLP output is saved to the database, then the LLM reads it back from the database", async () => {
  const prompts = [];
  const fetchImpl = async (_url, options) => {
    prompts.push(JSON.parse(options.body).messages[0].content);
    return { ok: true, json: async () => ({ choices: [{ message: { content: "Asesmen hari Jumat." } }] }) };
  };
  const { app, calls, nlpRows } = makeApp({
    env: {
      GROQ_API_KEY: "test-key",
      GROQ_BASE_URL: "https://provider.example/v1",
      GROQ_MODEL_1: "test-one",
      GROQ_MODEL_2: "test-two",
      GROQ_MODEL_3: "test-three"
    },
    fetchImpl,
    publishedChatContent: [{
      resource: "academic-agenda",
      slug: "asesmen-sekolah",
      title: "Jadwal Asesmen Sekolah",
      description: "Asesmen berlangsung pada hari Jumat di aula.",
      starts_at: "2026-11-06T08:00:00.000Z"
    }]
  });
  const response = await request(app).post("/api/public/chat")
    .send({ message: "Kapan jadwal asesmen hari Jumat?" }).expect(200);

  // Urutan: simpan NLP -> baca NLP dari DB -> panggil LLM.
  const ops = calls.map((call) => call.op).filter((op) => op.startsWith("nlp-"));
  assert.deepEqual(ops, ["nlp-save", "nlp-get"]);
  assert.equal(nlpRows.size, 1);
  const stored = [...nlpRows.values()][0];
  assert.equal(stored.intent, "academic_agenda");
  assert.deepEqual(stored.entities.weekdays, ["jumat"]);
  assert.equal(stored.matched_refs[0].slug, "asesmen-sekolah");
  assert.equal("question" in stored || "message" in stored, false);

  // Prompt LLM memuat hasil NLP yang diambil dari DB dan memperkenalkan Wilhel.
  assert.equal(prompts.length, 1);
  assert.match(prompts[0], /Wilhel/);
  assert.match(prompts[0], /HASIL ANALISIS NLP/);
  assert.match(prompts[0], /intent: academic_agenda/);
  assert.match(prompts[0], /weekdays=jumat/);
  assert.match(prompts[0], /Jadwal Asesmen Sekolah/);
  assert.equal(response.body.data.bot, "Wilhel");
});

test("Wilhel fails closed when the NLP result cannot be read back from the database", async () => {
  const { app, calls } = makeApp({
    env: {
      GROQ_API_KEY: "test-key",
      GROQ_BASE_URL: "https://provider.example/v1",
      GROQ_MODEL_1: "test-one",
      GROQ_MODEL_2: "test-two",
      GROQ_MODEL_3: "test-three"
    },
    fetchImpl: async () => { throw new Error("provider must not be called without a stored NLP result"); },
    publishedChatContent: [{ resource: "news", title: "Prestasi Siswa", body: "Tim sekolah juara." }],
    nlpReadFails: true
  });
  const response = await request(app).post("/api/public/chat")
    .send({ message: "Apa prestasi siswa?" }).expect(503);
  assert.equal(response.body.error.code, "SERVICE_UNAVAILABLE");
  assert.equal(calls.find((call) => call.op === "analytics").row.outcome, "unavailable");
});

test("chat answers honestly without calling the provider when no published content matches", async () => {
  const env = {
    GROQ_API_KEY: "test-key",
    GROQ_BASE_URL: "https://provider.example/v1",
    GROQ_MODEL_1: "test-one",
    GROQ_MODEL_2: "test-two",
    GROQ_MODEL_3: "test-three"
  };
  const { app, calls } = makeApp({
    env,
    fetchImpl: async () => { throw new Error("provider must not be called without relevant content"); }
  });
  const response = await request(app).post("/api/public/chat")
    // "Program keahlian" is now answerable from the static public-page catalog (see
    // src/public-knowledge.mjs), so this test uses a topic absent from both the CMS
    // content and that catalog to exercise the genuine no-match path.
    .send({ message: "Apa menu kantin hari ini?" }).expect(200);
  assert.match(response.body.data.reply, /tidak menemukan informasi yang relevan/);
  assert.equal(response.body.data.model, null);
  assert.deepEqual(calls.find((call) => call.op === "analytics").row, {
    category: "other",
    outcome: "unavailable",
    model: null
  });
});

test("chat rejects extra properties and is compatible with the public error contract", async () => {
  const { app } = makeApp();
  const response = await request(app).post("/api/public/chat")
    .send({ message: "Halo", userEmail: "person@example.test" }).expect(400);
  assert.equal(response.body.error.code, "INVALID_INPUT");
  const unavailable = await request(app).post("/api/public/chat").send({ message: "Halo" }).expect(503);
  assert.equal(unavailable.body.error.code, "CHAT_NOT_CONFIGURED");
});
