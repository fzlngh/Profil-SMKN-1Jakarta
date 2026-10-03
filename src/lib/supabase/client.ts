"use client";

import { createBrowserClient } from "@supabase/ssr";

// Client Supabase untuk dipakai di Client Component (browser).
// Dipakai a.l. untuk unggah tanda tangan langsung ke Storage.
// Catatan: sengaja tidak diparameterisasi dengan tipe Database generated Supabase
// (lihat src/lib/types.ts untuk tipe domain aplikasi) agar tidak perlu menjalankan
// `supabase gen types` di awal setup. Data hasil query di-cast manual ke tipe di
// src/lib/types.ts pada pemanggilnya.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
