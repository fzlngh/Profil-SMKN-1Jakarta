import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Format pertanyaan tidak valid." } }, { status: 400 });
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload) ||
    !("message" in payload) ||
    typeof payload.message !== "string" ||
    !payload.message.trim() ||
    payload.message.trim().length > 2_000
  ) {
    return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Pertanyaan wajib diisi (maksimal 2000 karakter)." } }, { status: 400 });
  }

  const backendUrl = process.env.BACKEND_API_URL;
  const frontendOrigin = process.env.FRONTEND_ORIGIN;
  if (!backendUrl || !frontendOrigin) {
    return NextResponse.json({ error: { code: "CHAT_NOT_CONFIGURED", message: "Asisten belum dikonfigurasi." } }, { status: 503 });
  }

  try {
    const response = await fetch(new URL("/api/public/chat", backendUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: frontendOrigin
      },
      body: JSON.stringify({ message: payload.message.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000)
    });
    const body = await response.json();
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ error: { code: "CHAT_UNAVAILABLE", message: "Asisten sedang tidak tersedia. Silakan coba lagi nanti." } }, { status: 502 });
  }
}
