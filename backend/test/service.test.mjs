import test from "node:test";
import assert from "node:assert/strict";
import { CmsService } from "../src/service.mjs";

test("chat analytics return bounded category and outcome aggregates without conversation data", async () => {
  const rows = [
    { category: "academic_agenda", outcome: "resolved", model: "model/one:free", created_at: "2026-06-01T10:00:00.000Z" },
    { category: "news", outcome: "fallback", model: "model/two:free", created_at: "2026-06-01T09:00:00.000Z" },
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
