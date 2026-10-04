import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

type ApiError = { code: string; message: string };
type ApiResponse<T> = { data?: T; error?: ApiError };

export async function backendRequest<T>(
  path: string,
  options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {}
): Promise<{ data?: T; error?: ApiError; status: number }> {
  const cookieStore = cookies();
  const baseUrl = process.env.BACKEND_API_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000");
  const origin = process.env.FRONTEND_ORIGIN;
  if (!baseUrl || !origin) {
    return {
      error: { code: "BACKEND_NOT_CONFIGURED", message: "Layanan backend belum dikonfigurasi." },
      status: 503
    };
  }

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join("; ");
  const headers: Record<string, string> = {
    Accept: "application/json",
    Origin: origin,
    "X-Correlation-ID": randomUUID()
  };
  if (cookieHeader) headers.Cookie = cookieHeader;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  try {
    const response = await fetch(new URL(path, baseUrl), {
      method: options.method || "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(12_000),
      cache: "no-store"
    });

    const responseHeaders = response.headers as Headers & { getSetCookie?: () => string[] };
    const rawSetCookies = responseHeaders.getSetCookie?.() || response.headers.get("set-cookie") || [];
    const parsedCookies = setCookieParser.parse(rawSetCookies);
    for (const parsed of parsedCookies) {
      try {
        cookieStore.set(parsed.name, parsed.value, {
          path: parsed.path || "/",
          expires: parsed.expires,
          maxAge: parsed.maxAge,
          httpOnly: parsed.httpOnly,
          secure: parsed.secure,
          sameSite: parsed.sameSite as "strict" | "lax" | "none" | undefined
        });
      } catch {
        // Server Components cannot write cookies; middleware refreshes them on the next request.
      }
    }

    const result = (await response.json().catch(() => ({}))) as ApiResponse<T>;
    if (!response.ok) {
      return {
        error: result.error || { code: "BACKEND_ERROR", message: "Permintaan tidak dapat diproses." },
        status: response.status
      };
    }
    return { data: result.data, status: response.status };
  } catch {
    return {
      error: { code: "BACKEND_UNAVAILABLE", message: "Layanan backend tidak dapat dijangkau." },
      status: 503
    };
  }
}
