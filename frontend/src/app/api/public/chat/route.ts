import "server-only";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatError = { error: { code: string; message: string } };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json<ChatError>({ error: { code, message } }, { status });
}

async function readPayload(request: NextRequest): Promise<unknown> {
  if (!request.body) throw new Error("Missing request body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteLength += value.byteLength;
    if (byteLength > 16_384) {
      await reader.cancel();
      throw new Error("Request body too large");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(body)) as unknown;
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    return errorResponse(503, "CHAT_NOT_CONFIGURED", "Asisten sekolah belum dikonfigurasi.");
  }

  let payload: unknown;
  try {
    payload = await readPayload(request);
  } catch {
    return errorResponse(400, "INVALID_INPUT", "Format pertanyaan tidak valid.");
  }

  if (!isRecord(payload) || Object.keys(payload).length !== 1 || typeof payload.message !== "string" ||
    !payload.message.trim() || payload.message.trim().length > 2_000) {
    return errorResponse(400, "INVALID_INPUT", "Pertanyaan wajib diisi (maksimal 2000 karakter).");
  }

  const message = payload.message.trim();
  try {
    const upstream = await fetch(`${baseUrl}/api/public/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000)
    });
    const body: unknown = await upstream.json();
    return NextResponse.json(body, { status: upstream.status });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return errorResponse(504, "CHAT_TIMEOUT", "Asisten belum merespons. Silakan coba lagi.");
    }
    return errorResponse(502, "CHAT_UNAVAILABLE", "Asisten sekolah sementara tidak dapat dijangkau.");
  }
}
