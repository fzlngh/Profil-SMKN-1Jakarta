"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Profile } from "@/lib/types";

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
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("create_f01", {
    p_nama_perusahaan: payload.namaPerusahaan,
    p_alamat_kantor: payload.alamatKantor,
    p_alamat_pkl: payload.alamatPkl,
    p_kontak_nama: payload.kontakNama,
    p_kontak_jabatan: payload.kontakJabatan,
    p_kontak_hp: payload.kontakHp,
    p_bulan_mulai: payload.bulanMulai,
    p_bulan_selesai: payload.bulanSelesai,
    p_tahun: payload.tahun,
    p_anggota_ids: payload.anggotaIds
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/siswa");
  return {};
}

export async function resubmitSubmission(id: string, payload: F01Payload): Promise<{ error?: string }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("resubmit_f01", {
    p_submission_id: id,
    p_nama_perusahaan: payload.namaPerusahaan,
    p_alamat_kantor: payload.alamatKantor,
    p_alamat_pkl: payload.alamatPkl,
    p_kontak_nama: payload.kontakNama,
    p_kontak_jabatan: payload.kontakJabatan,
    p_kontak_hp: payload.kontakHp,
    p_bulan_mulai: payload.bulanMulai,
    p_bulan_selesai: payload.bulanSelesai,
    p_tahun: payload.tahun,
    p_anggota_ids: payload.anggotaIds
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/siswa");
  return {};
}

export async function approveSubmission(id: string, signerId?: string): Promise<{ error?: string }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("approve_f01", { p_submission_id: id, p_signer_id: signerId ?? null });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/guru");
  revalidatePath("/dashboard/admin/submissions");
  return {};
}

export async function rejectSubmission(id: string, note: string, signerId?: string): Promise<{ error?: string }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("reject_f01", { p_submission_id: id, p_note: note, p_signer_id: signerId ?? null });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/guru");
  revalidatePath("/dashboard/admin/submissions");
  return {};
}

export async function searchSiswaCandidates(query: string, excludeIds: string[]): Promise<{ data?: Profile[]; error?: string }> {
  const supabase = createSupabaseServerClient();
  let q = supabase
    .from("profiles")
    .select("*")
    .eq("role", "siswa")
    .not("tanda_tangan_url", "is", null)
    .limit(8);

  if (query.trim()) {
    q = q.or(`nama_lengkap.ilike.%${query.trim()}%,nis.ilike.%${query.trim()}%`);
  }
  if (excludeIds.length) {
    q = q.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error } = await q;
  if (error) return { error: error.message };
  return { data: data as Profile[] };
}
