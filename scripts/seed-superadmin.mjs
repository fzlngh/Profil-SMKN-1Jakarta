// Membuat akun Superadmin pertama di Supabase Auth + tabel profiles.
// Jalankan dengan: npm run seed
// Membutuhkan variabel di .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD, SEED_SUPERADMIN_NAME

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const p = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    val = val.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_SUPERADMIN_EMAIL || "admin@smkn1jkt.sch.id";
const password = process.env.SEED_SUPERADMIN_PASSWORD || "admin123";
const nama = process.env.SEED_SUPERADMIN_NAME || "Administrator Sistem";

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  console.log(`Membuat akun superadmin: ${email} ...`);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  let userId;
  if (error) {
    if (error.message.includes("already been registered") || error.status === 422) {
      console.log("Akun sudah ada, mengambil data pengguna...");
      const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
      if (listErr) throw listErr;
      const existing = list.users.find(u => u.email === email);
      if (!existing) throw new Error("Gagal menemukan akun yang sudah ada");
      userId = existing.id;
    } else {
      throw error;
    }
  } else {
    userId = data.user.id;
  }

  const { error: profileErr } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    nama_lengkap: nama,
    role: "superadmin"
  });
  if (profileErr) throw profileErr;

  console.log("Selesai. Superadmin siap digunakan:");
  console.log(`  Email    : ${email}`);
  console.log(`  Password : ${password}`);
}

main().catch(err => {
  console.error("Gagal membuat superadmin:", err.message);
  process.exit(1);
});
