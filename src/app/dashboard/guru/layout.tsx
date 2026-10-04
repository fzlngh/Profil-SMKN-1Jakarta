import { redirect } from "next/navigation";
import { backendRequest } from "@/lib/backend";
import type { Profile } from "@/lib/types";

const GURU_ROLES = ["guru_bk", "wali_kelas", "ka_prodi", "superadmin"];

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const { data: profile } = await backendRequest<Profile>("/api/me");
  if (!profile) redirect("/login");
  if (!profile || !GURU_ROLES.includes(profile.role)) redirect("/");
  return <>{children}</>;
}
