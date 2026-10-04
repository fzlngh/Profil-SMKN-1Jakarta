import { redirect } from "next/navigation";
import { backendRequest } from "@/lib/backend";
import type { Profile } from "@/lib/types";

export default async function SiswaLayout({ children }: { children: React.ReactNode }) {
  const { data: profile } = await backendRequest<Profile>("/api/me");
  if (!profile) redirect("/login");
  if (!profile || (profile.role !== "siswa" && profile.role !== "superadmin")) redirect("/");
  return <>{children}</>;
}
