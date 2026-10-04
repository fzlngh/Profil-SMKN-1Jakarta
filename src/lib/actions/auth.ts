"use server";

import { backendRequest } from "@/lib/backend";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email dan kata sandi wajib diisi" };

  const result = await backendRequest("/api/auth/login", { method: "POST", body: { email, password } });
  if (result.error) return { error: result.error.message };
  return {};
}

export async function signOut() {
  await backendRequest("/api/auth/logout", { method: "POST" });
  redirect("/login");
}

export async function changePassword(newPassword: string): Promise<{ error?: string }> {
  if (newPassword.length < 4) return { error: "Kata sandi minimal 4 karakter" };
  const result = await backendRequest("/api/auth/change-password", {
    method: "POST",
    body: { password: newPassword }
  });
  if (result.error) return { error: result.error.message };
  return {};
}

export async function updateMyProfile(payload: { noHp?: string; signatureUrl?: string }): Promise<{ error?: string }> {
  const result = await backendRequest("/api/me/profile", { method: "PATCH", body: payload });
  if (result.error) return { error: result.error.message };
  return {};
}
