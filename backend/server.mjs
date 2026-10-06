import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { createApp } from "./src/app.mjs";

const required = ["CMS_SUPABASE_URL", "CMS_SUPABASE_ANON_KEY", "CMS_SUPABASE_SERVICE_ROLE_KEY"];
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) {
  console.error(`Backend configuration missing: ${missing.join(", ")}`);
  process.exit(1);
}

const commonOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
};
const publicClient = createClient(process.env.CMS_SUPABASE_URL, process.env.CMS_SUPABASE_ANON_KEY, commonOptions);
const serviceClient = createClient(process.env.CMS_SUPABASE_URL, process.env.CMS_SUPABASE_SERVICE_ROLE_KEY, commonOptions);
const app = createApp({ publicClient, serviceClient, env: process.env });
const port = Number(process.env.PORT || 4000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PORT must be a valid TCP port.");
  process.exit(1);
}

app.listen(port, () => {
  console.info(JSON.stringify({ event: "server.started", port }));
});
