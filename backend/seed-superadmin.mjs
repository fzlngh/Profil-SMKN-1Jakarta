// Membuat akun Superadmin pertama di Supabase Auth + tabel profiles.
// Jalankan dengan: npm run seed
// Membutuhkan variabel di backend/.env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD, SEED_SUPERADMIN_NAME

import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDirectory, ".env") });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_SUPERADMIN_EMAIL || "admin@smkn1jkt.sch.id";
const password = process.env.SEED_SUPERADMIN_PASSWORD;
const nama = process.env.SEED_SUPERADMIN_NAME || "Administrator Sistem";

if (!url || !serviceKey || !password || password.length < 4) {
  console.error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and a valid SEED_SUPERADMIN_PASSWORD are required in backend/.env");
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
  console.log("  Password : configured from backend environment");
}

main().catch(err => {
  console.error("Gagal membuat superadmin:", err.message);
  process.exit(1);
});
