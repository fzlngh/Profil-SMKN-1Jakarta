import test from "node:test";
import assert from "node:assert/strict";
import { getChatCompletion, getChatConfiguration, retrieveRelevantContent } from "../src/chat.mjs";

const validEnv = {
  OPENROUTER_API_KEY: "test-key",
  OPENROUTER_MODEL_1: "google/gemma-4-26b-a4b-it:free",
  OPENROUTER_MODEL_2: "google/gemma-4-31b-it:free",
  OPENROUTER_MODEL_3: "nvidia/nemotron-3.5-lightning:free"
};

test("chat configuration targets OpenRouter and requires distinct free model IDs", () => {
  const configuration = getChatConfiguration(validEnv);
  assert.equal(configuration.completionUrl, "https://openrouter.ai/api/v1/chat/completions");
  assert.deepEqual(configuration.models, [
    validEnv.OPENROUTER_MODEL_1,
    validEnv.OPENROUTER_MODEL_2,
    validEnv.OPENROUTER_MODEL_3
  ]);
  assert.equal(getChatConfiguration({ ...validEnv, OPENROUTER_API_KEY: "" }), null);
  assert.equal(getChatConfiguration({
    ...validEnv,
    OPENROUTER_MODEL_3: validEnv.OPENROUTER_MODEL_2
  }), null);
});

test("chat completion sends an authenticated OpenRouter request and parses its response", async () => {
  let outgoing;
  const configuration = getChatConfiguration(validEnv);
  const result = await getChatCompletion({
    configuration,
    message: "Halo",
    context: "[BERITA] Informasi resmi yang telah diterbitkan.",
    fetchImpl: async (url, options) => {
      outgoing = { url, options };
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: "  Halo juga.  " } }] })
      };
    }
  });

  assert.equal(outgoing.url, "https://openrouter.ai/api/v1/chat/completions");
  assert.equal(outgoing.options.method, "POST");
  assert.match(outgoing.options.headers.Authorization, /^Bearer /);
  assert.equal(outgoing.options.headers["Content-Type"], "application/json");
  assert.equal(outgoing.options.signal instanceof AbortSignal, true);
  const payload = JSON.parse(outgoing.options.body);
  assert.equal(payload.model, validEnv.OPENROUTER_MODEL_1);
  assert.match(payload.messages[0].content, /KONTEN PUBLIK TERBIT/);
  assert.match(payload.messages[0].content, /Informasi resmi yang telah diterbitkan/);
  assert.deepEqual(payload.messages.at(-1), { role: "user", content: "Halo" });
  assert.equal(payload.stream, false);
  assert.equal(payload.max_tokens, 400);
  assert.deepEqual(result, {
    answer: "Halo juga.",
    model: validEnv.OPENROUTER_MODEL_1
  });
});

test("published-content retrieval returns only matching bounded public snippets", () => {
  const longBody = `${"Informasi umum tentang kegiatan sekolah. ".repeat(80)}Asesmen sekolah dilaksanakan hari Jumat.`;
  const items = [
    {
      resource: "academic-agenda",
      title: "Jadwal Asesmen Sekolah",
      description: "Asesmen berlangsung pada hari Jumat di aula.",
      starts_at: "2026-11-06T08:00:00.000Z"
    },
    { resource: "news", title: "Prestasi Siswa", body: "Tim sekolah meraih penghargaan." },
    { resource: "news", title: "Prompt Injection", body: "x".repeat(8_000) },
    { resource: "news", title: "Jadwal kegiatan", body: longBody }
  ];
  const context = retrieveRelevantContent("Kapan jadwal asesmen hari Jumat?", items);
  assert.match(context, /Jadwal Asesmen Sekolah/);
  assert.doesNotMatch(context, /Prestasi Siswa/);
  assert.match(context, /Asesmen sekolah dilaksanakan hari Jumat/);
  assert.ok(context.length <= 7_000);
  assert.equal(retrieveRelevantContent("Bagaimana cara mendaftar?", []), "");
});

test("free-provider 429 responses are distinguished after trying all fallbacks", async () => {
  const requested = [];
  await assert.rejects(getChatCompletion({
    configuration: getChatConfiguration(validEnv),
    message: "Pertanyaan",
    context: "[PENGUMUMAN] Batas pendaftaran.",
    fetchImpl: async (_url, options) => {
      requested.push(JSON.parse(options.body).model);
      return { ok: false, status: 429 };
    }
  }), { message: "CHAT_PROVIDER_RATE_LIMITED" });
  assert.equal(requested.length, 3);
});

test("provider transport failures fail closed without fabricating an answer", async () => {
  await assert.rejects(getChatCompletion({
    configuration: getChatConfiguration(validEnv),
    message: "Apa jadwal sekolah?",
    context: "[AGENDA] Jadwal kegiatan terbit.",
    fetchImpl: async () => { throw new Error("network unavailable"); }
  }), { message: "CHAT_UNAVAILABLE" });
});
