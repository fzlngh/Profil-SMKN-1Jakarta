import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import { createApp, validateSubmissionPayload } from "../app.mjs";

const validSubmission = {
  namaPerusahaan: "PT Contoh",
  alamatKantor: "Jakarta",
  alamatPkl: "Jakarta",
  kontakNama: "Kontak",
  kontakJabatan: "HR",
  kontakHp: "0812345678",
  bulanMulai: "Januari",
  bulanSelesai: "Maret",
  tahun: "2026",
  anggotaIds: []
};
const authenticatedUserId = "9b117d04-95bf-4236-a625-41a0cf1d4b01";

function fakeAuthClient(profile, rpcCalls, submissionStatus = "menunggu_bk") {
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: authenticatedUserId } }, error: null })
    },
    from: table => ({
      select() {
        return this;
      },
      eq() {
        return this;
      },
      maybeSingle: async () => ({
        data: table === "profiles" ? profile : { status: submissionStatus },
        error: null
      })
    }),
    rpc: async (name, params) => {
      rpcCalls.push({ name, params });
      return { data: null, error: null };
    }
  };
}

async function startApi(profile, rpcCalls, submissionStatus) {
  const app = createApp({
    env: {
      FRONTEND_ORIGIN: "http://localhost:3000",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "test-anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-key"
    },
    authClientFactory: () => fakeAuthClient(profile, rpcCalls, submissionStatus),
    adminClientFactory: () => ({})
  });
  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: async () => {
      server.close();
      await once(server, "close");
    }
  };
}

test("validates the F01 input shape before RPC dispatch", () => {
  assert.deepEqual(validateSubmissionPayload(validSubmission), validSubmission);
  assert.equal(validateSubmissionPayload({ ...validSubmission, tahun: "26" }), null);
  assert.equal(validateSubmissionPayload({ ...validSubmission, anggotaIds: ["not-a-uuid"] }), null);
  assert.equal(validateSubmissionPayload({ ...validSubmission, namaPerusahaan: " " }), null);
  assert.equal(validateSubmissionPayload({ ...validSubmission, extraField: "ignored" }).extraField, undefined);
});

test("requires an explicit frontend origin and prevents origin-less writes", async () => {
  assert.throws(() => createApp({ env: {} }), /FRONTEND_ORIGIN must be configured/);

  const app = createApp({
    env: {
      FRONTEND_ORIGIN: "http://localhost:3000",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "test-anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-key"
    },
    authClientFactory: () => ({}),
    adminClientFactory: () => ({})
  });

  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const address = server.address();
    const base = `http://127.0.0.1:${address.port}`;
    const health = await fetch(`${base}/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).data.status, "ok");

    const rejectedWrite = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://attacker.example" },
      body: JSON.stringify({ email: "person@example.com", password: "password" })
    });
    assert.equal(rejectedWrite.status, 403);
    assert.equal((await rejectedWrite.json()).error.code, "ORIGIN_FORBIDDEN");

    const trustedPreflight = await fetch(`${base}/api/auth/login`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
      }
    });
    assert.equal(trustedPreflight.status, 204);
    assert.equal(trustedPreflight.headers.get("access-control-allow-origin"), "http://localhost:3000");
    assert.equal(trustedPreflight.headers.get("access-control-allow-credentials"), "true");
  } finally {
    server.close();
    await once(server, "close");
  }
});

test("uses the authenticated database role and ignores client-supplied actor fields", async () => {
  const rpcCalls = [];
  const api = await startApi({ id: authenticatedUserId, role: "siswa" }, rpcCalls);
  try {
    const response = await fetch(`${api.url}/api/submissions`, {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
        Cookie: "sb-test-auth-token=opaque-session"
      },
      body: JSON.stringify({ ...validSubmission, actorId: "attacker", role: "superadmin" })
    });

    assert.equal(response.status, 200);
    assert.equal(rpcCalls.length, 1);
    assert.equal(rpcCalls[0].name, "create_f01");
    assert.equal(rpcCalls[0].params.p_actor_id, undefined);
    assert.equal(rpcCalls[0].params.p_role, undefined);
  } finally {
    await api.close();
  }

  const forbiddenCalls = [];
  const forbiddenApi = await startApi({ id: authenticatedUserId, role: "guru_bk" }, forbiddenCalls);
  try {
    const response = await fetch(`${forbiddenApi.url}/api/submissions`, {
      method: "POST",
      headers: { Origin: "http://localhost:3000", "Content-Type": "application/json" },
      body: JSON.stringify(validSubmission)
    });
    assert.equal(response.status, 403);
    assert.equal(forbiddenCalls.length, 0);
  } finally {
    await forbiddenApi.close();
  }
});

test("blocks approval when the authenticated role does not match the current F01 stage", async () => {
  const rpcCalls = [];
  const api = await startApi({ id: authenticatedUserId, role: "guru_bk" }, rpcCalls, "menunggu_wali_kelas");
  try {
    const response = await fetch(`${api.url}/api/submissions/${authenticatedUserId}/approve`, {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
        Cookie: "sb-test-auth-token=opaque-session"
      },
      body: JSON.stringify({})
    });
    assert.equal(response.status, 403);
    assert.equal((await response.json()).error.code, "FORBIDDEN");
    assert.equal(rpcCalls.length, 0);
  } finally {
    await api.close();
  }
});
