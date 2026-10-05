import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import { createApp, validateChatPayload, validateSubmissionPayload } from "../app.mjs";

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

const chatEnvironment = {
  FRONTEND_ORIGIN: "http://localhost:3000",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
  OPENROUTER_API_KEY: "openrouter-test-secret",
  OPENROUTER_MODEL_1: "provider/first:free",
  OPENROUTER_MODEL_2: "provider/second:free",
  OPENROUTER_MODEL_3: "provider/third:free"
};

async function startChatApi({ env = chatEnvironment, chatFetch = async () => new Response() } = {}) {
  const app = createApp({
    env,
    authClientFactory: () => ({}),
    adminClientFactory: () => ({}),
    chatFetch
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

test("validates public chat input strictly", () => {
  assert.deepEqual(validateChatPayload({ message: "  PKL  " }), { message: "PKL" });
  assert.equal(validateChatPayload({ message: " " }), null);
  assert.equal(validateChatPayload({ message: "x".repeat(2001) }), null);
  assert.equal(validateChatPayload({ message: "hello\u0000" }), null);
  assert.equal(validateChatPayload({ message: "hello", history: [] }), null);
  assert.equal(validateChatPayload([]), null);
});

test("public chat calls the ordered free-model fallback with only the prompt and submitted question", async () => {
  const requests = [];
  const api = await startChatApi({
    chatFetch: async (url, init) => {
      requests.push({ url, init });
      if (requests.length === 1) return new Response("unavailable", { status: 429 });
      return new Response(JSON.stringify({
        choices: [{ message: { content: "PKL dan pengajuan F01 tersedia melalui SIM-PKL." } }]
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });
  try {
    const response = await fetch(`${api.url}/api/public/chat`, {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
        Cookie: "session-user-secret"
      },
      body: JSON.stringify({ message: "  Bagaimana info PKL?  " })
    });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.reply, "PKL dan pengajuan F01 tersedia melalui SIM-PKL.");
    assert.equal(body.data.model, "provider/second:free");
    assert.equal(requests.length, 2);
    assert.deepEqual(requests.map(({ init }) => JSON.parse(init.body).model), [
      "provider/first:free",
      "provider/second:free"
    ]);
    assert.equal(requests[0].url, "https://openrouter.ai/api/v1/chat/completions");
    assert.equal(requests[0].init.headers.Authorization, "Bearer openrouter-test-secret");
    assert.equal(requests[0].init.headers.Cookie, undefined);
    const sent = JSON.parse(requests[0].init.body);
    assert.deepEqual(Object.keys(sent).sort(), ["max_tokens", "messages", "model", "stream", "temperature"]);
    assert.equal(sent.messages.length, 2);
    assert.equal(sent.messages[1].content, "Bagaimana info PKL?");
    assert.match(sent.messages[0].content, /Program keahlian resmi belum dikonfirmasi/);
    assert.doesNotMatch(requests[0].init.body, /service-role-secret|session-user-secret/);
  } finally {
    await api.close();
  }
});

test("public chat rejects invalid requests and returns safe provider errors", async () => {
  let providerCalls = 0;
  const api = await startChatApi({
    chatFetch: async () => {
      providerCalls += 1;
      return new Response("provider-private-error", { status: 500 });
    }
  });
  try {
    const invalid = await fetch(`${api.url}/api/public/chat`, {
      method: "POST",
      headers: { Origin: "http://localhost:3000", "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hi", prompt: "override" })
    });
    assert.equal(invalid.status, 400);

    const failed = await fetch(`${api.url}/api/public/chat`, {
      method: "POST",
      headers: { Origin: "http://localhost:3000", "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Apa alamat sekolah?" })
    });
    assert.equal(failed.status, 502);
    const failureBody = await failed.text();
    assert.match(failureBody, /CHAT_UNAVAILABLE/);
    assert.doesNotMatch(failureBody, /provider-private-error/);
    assert.equal(providerCalls, 3);
  } finally {
    await api.close();
  }
});

test("public chat reports a safe timeout when every model times out", async () => {
  let providerCalls = 0;
  const api = await startChatApi({
    chatFetch: async () => {
      providerCalls += 1;
      const error = new Error("timeout detail");
      error.name = "TimeoutError";
      throw error;
    }
  });
  try {
    const response = await fetch(`${api.url}/api/public/chat`, {
      method: "POST",
      headers: { Origin: "http://localhost:3000", "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Kapan ada informasi baru?" })
    });
    assert.equal(response.status, 504);
    assert.equal((await response.json()).error.code, "CHAT_TIMEOUT");
    assert.equal(providerCalls, 3);
  } finally {
    await api.close();
  }
});

test("public chat reports missing or non-free model configuration without calling the provider", async () => {
  let providerCalls = 0;
  const api = await startChatApi({
    env: { ...chatEnvironment, OPENROUTER_MODEL_3: "provider/paid-model" },
    chatFetch: async () => {
      providerCalls += 1;
      return new Response();
    }
  });
  try {
    const response = await fetch(`${api.url}/api/public/chat`, {
      method: "POST",
      headers: { Origin: "http://localhost:3000", "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Informasi sekolah?" })
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error.code, "CHAT_NOT_CONFIGURED");
    assert.equal(providerCalls, 0);
  } finally {
    await api.close();
  }
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
