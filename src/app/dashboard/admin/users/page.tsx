import { Topbar, Content } from "@/components/Shell";
import { UsersClient } from "./UsersClient";
import type { Profile } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

export default async function AdminUsersPage() {
  const { data: users } = await backendRequest<Profile[]>("/api/admin/users");
  if (!users) return null;

  return (
    <>
      <Topbar title="Kelola Pengguna" sub="Data siswa dan guru pada sistem" />
      <Content>
        <UsersClient users={users} />
      </Content>
    </>
  );
}
