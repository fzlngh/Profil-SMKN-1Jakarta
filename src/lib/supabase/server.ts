import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase untuk Server Component / Server Action.
// Terikat pada sesi login pengguna (lewat cookies), sehingga semua query
// tetap tunduk pada Row Level Security di database.
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // dipanggil dari Server Component tanpa akses tulis cookie — aman diabaikan,
            // middleware yang akan menyegarkan sesi.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // lihat catatan di atas
          }
        }
      }
    }
  );
}
