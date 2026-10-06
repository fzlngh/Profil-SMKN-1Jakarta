import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getCmsSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_CMS_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Konfigurasi Supabase CMS belum tersedia.");
  }

  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  return client;
}
