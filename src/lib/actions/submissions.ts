"use server";

import { revalidatePath } from "next/cache";
import type { Profile } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

export interface F01Payload {
  namaPerusahaan: string;
  alamatKantor: string;
  alamatPkl: string;
  kontakNama: string;
  kontakJabatan: string;
  kontakHp: string;
  bulanMulai: string;
  bulanSelesai: string;
  tahun: string;
  anggotaIds: string[];
}

export async function createSubmission(payload: F01Payload): Promise<{ error?: string }> {
  const result = await backendRequest("/api/submissions", { method: "POST", body: payload });
  if (result.error) return { error: result.error.message };
  revalidatePath("/dashboard/siswa");
  return {};
}

export async function resubmitSubmission(id: string, payload: F01Payload): Promise<{ error?: string }> {
  const result = await backendRequest(`/api/submissions/${encodeURIComponent(id)}/resubmit`, {
    method: "POST",
    body: payload
  });
  if (result.error) return { error: result.error.message };
  revalidatePath("/dashboard/siswa");
  return {};
}

export async function approveSubmission(id: string, signerId?: string): Promise<{ error?: string }> {
  const result = await backendRequest(`/api/submissions/${encodeURIComponent(id)}/approve`, {
    method: "POST",
    body: signerId ? { signerId } : {}
  });
  if (result.error) return { error: result.error.message };
  revalidatePath("/dashboard/guru");
  revalidatePath("/dashboard/admin/submissions");
  return {};
}

export async function rejectSubmission(id: string, note: string, signerId?: string): Promise<{ error?: string }> {
  const result = await backendRequest(`/api/submissions/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    body: signerId ? { note, signerId } : { note }
  });
  if (result.error) return { error: result.error.message };
  revalidatePath("/dashboard/guru");
  revalidatePath("/dashboard/admin/submissions");
  return {};
}

export async function searchSiswaCandidates(query: string, excludeIds: string[]): Promise<{ data?: Profile[]; error?: string }> {
  const params = new URLSearchParams({ q: query });
  if (excludeIds.length) params.set("exclude", excludeIds.join(","));
  const result = await backendRequest<Profile[]>(`/api/students/candidates?${params.toString()}`);
  if (result.error) return { error: result.error.message };
  return { data: result.data || [] };
}
