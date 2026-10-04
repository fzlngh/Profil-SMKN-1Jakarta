"use server";

import { revalidatePath } from "next/cache";
import type { UserRole } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

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
  const result = await backendRequest("/api/admin/users", { method: "POST", body: payload });
  if (result.error) return { error: result.error.message };
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
  const { id, ...changes } = payload;
  const result = await backendRequest(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: changes
  });
  if (result.error) return { error: result.error.message };
  revalidatePath("/dashboard/admin/users");
  return {};
}

export async function deleteUser(id: string): Promise<{ error?: string }> {
  const result = await backendRequest(`/api/admin/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (result.error) return { error: result.error.message };
  revalidatePath("/dashboard/admin/users");
  return {};
}
