import test from "node:test";
import assert from "node:assert/strict";
import { CmsService } from "../src/service.mjs";

test("chat analytics return bounded category and outcome aggregates without conversation data", async () => {
  const rows = [
    { category: "academic_agenda", outcome: "resolved", model: "llama-3.3-70b-versatile", created_at: "2026-06-01T10:00:00.000Z" },
    { category: "news", outcome: "fallback", model: "llama-3.1-8b-instant", created_at: "2026-06-01T09:00:00.000Z" },
    { category: "academic_agenda", outcome: "unavailable", model: null, created_at: "2026-06-01T08:00:00.000Z" }
  ];
  const queryCalls = [];
  const query = {
    select: (...args) => { queryCalls.push(["select", ...args]); return query; },
    gte: (...args) => { queryCalls.push(["gte", ...args]); return query; },
    order: (...args) => { queryCalls.push(["order", ...args]); return query; },
    limit: (value) => { queryCalls.push(["limit", value]); return Promise.resolve({ data: rows, error: null }); }
  };
  const serviceClient = { from: (table) => { queryCalls.push(["from", table]); return query; } };
  const service = new CmsService({
    publicClient: {},
    serviceClient,
    clock: () => new Date("2026-06-30T12:00:00.000Z")
  });

  const result = await service.getChatAnalytics({ days: 30, limit: 2 });
  assert.equal(result.total, 3);
  assert.deepEqual(result.categories, { academic_agenda: 2, news: 1 });
  assert.deepEqual(result.outcomes, { resolved: 1, fallback: 1, unavailable: 1 });
  assert.equal(result.recent.length, 2);
  assert.equal(result.truncated, false);
  assert.deepEqual(queryCalls.at(-1), ["limit", 1_000]);
  assert.equal(JSON.stringify(result).includes("prompt"), false);
});

test("chat retrieval queries only bounded published content through the public client", async () => {
  const calls = [];
  const publicClient = {
    from: (table) => {
      const query = {
        select: (columns) => { calls.push({ table, select: columns }); return query; },
        eq: (...args) => { calls.push({ table, eq: args }); return query; },
        or: (...args) => { calls.push({ table, or: args }); return query; },
        order: (...args) => { calls.push({ table, order: args }); return query; },
        limit: (value) => {
          calls.push({ table, limit: value });
          return Promise.resolve({ data: [], error: null });
        }
      };
      return query;
    }
  };
  const service = new CmsService({
    publicClient,
    serviceClient: { from: () => { throw new Error("chat must not query the service-role client"); } },
    clock: () => new Date("2026-06-30T12:00:00.000Z")
  });

  assert.deepEqual(await service.getPublishedChatContent(), []);
  assert.deepEqual([...new Set(calls.map((call) => call.table))].sort(), [
    "cms_academic_agenda", "cms_announcements", "cms_hero_banners", "cms_news"
  ]);
  for (const table of ["cms_news", "cms_announcements", "cms_academic_agenda", "cms_hero_banners"]) {
    assert.ok(calls.some((call) => call.table === table && call.eq?.[0] === "is_published" && call.eq[1] === true));
    assert.ok(calls.some((call) => call.table === table && call.limit === 10));
  }
  assert.ok(calls.some((call) => call.table === "cms_announcements" && call.or?.[0].startsWith("starts_at.is.null")));
  assert.ok(calls.some((call) => call.table === "cms_academic_agenda" && call.or?.[0].startsWith("ends_at.is.null")));
});

test("NLP results are inserted, read back unexpired, and purged through the service-role client only", async () => {
  const log = [];
  const builder = (name) => {
    const chain = {
      insert: (row) => { log.push({ name, op: "insert", row }); return chain; },
      select: (cols) => { log.push({ name, op: "select", cols }); return chain; },
      single: async () => ({ data: { id: "11111111-1111-4111-8111-111111111111" }, error: null }),
      eq: (col, value) => { log.push({ name, op: "eq", col, value }); return chain; },
      gt: (col, value) => { log.push({ name, op: "gt", col, value }); return chain; },
      lt: (col, value) => { log.push({ name, op: "lt", col, value }); return chain; },
      delete: () => { log.push({ name, op: "delete" }); return chain; },
      maybeSingle: async () => ({ data: { id: "x", intent: "news", context: "[BERITA] a" }, error: null }),
      then: (resolve) => resolve({ error: null })
    };
    return chain;
  };
  const now = new Date("2026-10-12T00:00:00.000Z");
  const service = new CmsService({
    publicClient: { from: () => { throw new Error("NLP storage must not use the public client"); } },
    serviceClient: { from: builder },
    clock: () => now
  });
  const id = await service.saveNlpResult({
    intent: "news", confidence: 0.5, keywords: ["berita"], entities: {}, matched_refs: [],
    context: "[BERITA] a", nlp_version: "wilhel-nlp-1"
  });
  assert.equal(id, "11111111-1111-4111-8111-111111111111");
  const insert = log.find((entry) => entry.op === "insert");
  assert.equal(insert.name, "cms_chatbot_nlp_results");
  assert.equal(insert.row.expires_at, "2026-10-13T00:00:00.000Z");
  assert.equal("question" in insert.row || "message" in insert.row, false);

  const stored = await service.getNlpResult(id);
  assert.equal(stored.intent, "news");
  assert.ok(log.some((entry) => entry.op === "gt" && entry.col === "expires_at"));

  await service.purgeExpiredNlpResults();
  assert.ok(log.some((entry) => entry.op === "lt" && entry.col === "expires_at"));
});
