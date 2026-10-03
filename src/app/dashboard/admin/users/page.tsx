import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Topbar, Content } from "@/components/Shell";
import { UsersClient } from "./UsersClient";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const supabase = createSupabaseServerClient();
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <>
      <Topbar title="Kelola Pengguna" sub="Data siswa dan guru pada sistem" />
      <Content>
        <UsersClient users={(users as Profile[]) || []} />
      </Content>
    </>
  );
}
