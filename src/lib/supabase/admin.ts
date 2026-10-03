import "server-only";
import { createClient } from "@supabase/supabase-js";

// Client dengan Service Role Key — HANYA dipakai di Server Action yang sudah
// memverifikasi bahwa pemanggilnya adalah superadmin. Jangan pernah diimpor
// dari kode yang berjalan di browser.
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
