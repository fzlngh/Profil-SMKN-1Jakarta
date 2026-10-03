import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GURU_ROLES = ["guru_bk", "wali_kelas", "ka_prodi", "superadmin"];

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !GURU_ROLES.includes(profile.role)) redirect("/");
  return <>{children}</>;
}
