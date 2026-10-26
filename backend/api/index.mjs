// Entry point used ONLY when this backend is deployed to Vercel as a serverless
// function. Local/VPS/Render/Railway deployments should keep using `server.mjs`
// (which calls app.listen()); Vercel's Node runtime calls the exported Express
// app directly as a (req, res) handler instead, so there must be no .listen()
// call here.
//
// This mirrors server.mjs exactly: it builds REAL Supabase clients from the
// environment and passes them into createApp(). Never export `createApp()`
// with no arguments — that leaves publicClient/serviceClient undefined, and
// every database-touching route (including /api/public/chat) then throws and
// falls back to a generic 503 SERVICE_UNAVAILABLE.
import { createClient } from "@supabase/supabase-js";
import { createApp } from "../src/app.mjs";

const commonOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
};

function buildApp() {
  const required = ["CMS_SUPABASE_URL", "CMS_SUPABASE_ANON_KEY", "CMS_SUPABASE_SERVICE_ROLE_KEY"];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    // Thrown (not process.exit) because a serverless function must fail the
    // request, not kill a process. Vercel's function logs will show exactly
    // which variable is missing from Project Settings > Environment Variables.
    throw new Error(`Backend configuration missing: ${missing.join(", ")}`);
  }

  const publicClient = createClient(
    process.env.CMS_SUPABASE_URL,
    process.env.CMS_SUPABASE_ANON_KEY,
    commonOptions
  );
  const serviceClient = createClient(
    process.env.CMS_SUPABASE_URL,
    process.env.CMS_SUPABASE_SERVICE_ROLE_KEY,
    commonOptions
  );

  return createApp({ publicClient, serviceClient, env: process.env });
}

// Built once per cold start and reused for every invocation handled by that
// same warm instance, exactly like the single `app` instance server.mjs hands
// to app.listen().
const app = buildApp();

export default app;