"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/lib/types";

async function assertSuperadmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Belum masuk / sesi berakhir");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "superadmin") throw new Error("Hanya Superadmin yang dapat melakukan aksi ini");
}

export interface NewUserPayload {
  role: UserRole;
  nama: string;
  email: string;
  nis?: string;
  kelas?: string;
  jurusan?: string;
  nip?: string;
  password?: string; // wajib untuk role superadmin baru, opsional untuk role lain (default: NIS/NIP)
}

export async function createUser(payload: NewUserPayload): Promise<{ error?: string }> {
  try {
    await assertSuperadmin();
  } catch (e: any) {
    return { error: e.message };
  }

  const admin = createSupabaseAdminClient();
  let password = payload.password;
  if (payload.role === "siswa") password = payload.nis;
  else if (payload.role !== "superadmin") password = payload.nip;
  if (!password) return { error: "Kata sandi awal tidak dapat ditentukan (NIS/NIP kosong)" };

  const { data, error } = await admin.auth.admin.createUser({
    email: payload.email,
    password,
    email_confirm: true
  });
  if (error) return { error: error.message };

  const { error: profileErr } = await admin.from("profiles").insert({
    id: data.user.id,
    email: payload.email,
    nama_lengkap: payload.nama,
    role: payload.role,
    nis: payload.role === "siswa" ? payload.nis : null,
    kelas: payload.role === "siswa" ? payload.kelas : null,
    jurusan: payload.role === "siswa" ? payload.jurusan : null,
    nip: payload.role !== "siswa" && payload.role !== "superadmin" ? payload.nip : null
  });
  if (profileErr) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: profileErr.message };
  }

  revalidatePath("/dashboard/admin/users");
  return {};
}

export interface UpdateUserPayload {
  id: string;
  nama: string;
  kelas?: string;
  jurusan?: string;
  nis?: string;
  nip?: string;
  newPassword?: string;
}

export async function updateUser(payload: UpdateUserPayload): Promise<{ error?: string }> {
  try {
    await assertSuperadmin();
  } catch (e: any) {
    return { error: e.message };
  }
  const admin = createSupabaseAdminClient();

  const { error } = await admin
    .from("profiles")
    .update({
      nama_lengkap: payload.nama,
      kelas: payload.kelas,
      jurusan: payload.jurusan,
      nis: payload.nis,
      nip: payload.nip
    })
    .eq("id", payload.id);
  if (error) return { error: error.message };

  if (payload.newPassword) {
    const { error: passErr } = await admin.auth.admin.updateUserById(payload.id, { password: payload.newPassword });
    if (passErr) return { error: passErr.message };
  }

  revalidatePath("/dashboard/admin/users");
  return {};
}

export async function deleteUser(id: string): Promise<{ error?: string }> {
  try {
    await assertSuperadmin();
  } catch (e: any) {
    return { error: e.message };
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/admin/users");
  return {};
}
