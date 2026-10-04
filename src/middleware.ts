import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Menyegarkan sesi Supabase Auth pada setiap request agar cookie session
// tidak kedaluwarsa saat pengguna berpindah halaman.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  const refreshedCookies = new Map<string, { name: string; value: string; options: CookieOptions }>();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value);
            refreshedCookies.set(cookie.name, cookie);
          }
          response = NextResponse.next({ request: { headers: request.headers } });
          for (const cookie of refreshedCookies.values()) {
            response.cookies.set({ name: cookie.name, value: cookie.value, ...cookie.options });
          }
        }
      }
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
