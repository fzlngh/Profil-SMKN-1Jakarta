import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { ToastProvider } from "@/components/Toast";
import { backendRequest } from "@/lib/backend";
import type { Profile } from "@/lib/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: profile } = await backendRequest<Profile>("/api/me");
  if (!profile) redirect("/login");

  return (
    <ToastProvider>
      <Shell role={profile.role} nama={profile.nama_lengkap}>
        {children}
      </Shell>
    </ToastProvider>
  );
}