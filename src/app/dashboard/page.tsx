import { redirect } from "next/navigation";
import { backendRequest } from "@/lib/backend";
import type { Profile, UserRole } from "@/lib/types";

const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  siswa: "/dashboard/siswa",
  guru_bk: "/dashboard/guru",
  wali_kelas: "/dashboard/guru",
  ka_prodi: "/dashboard/guru",
  superadmin: "/dashboard/admin"
};

export default async function DashboardRedirectPage() {
  const { data: profile } = await backendRequest<Profile>("/api/me");
  if (!profile) redirect("/login");

  redirect(DASHBOARD_BY_ROLE[profile.role]);
}
