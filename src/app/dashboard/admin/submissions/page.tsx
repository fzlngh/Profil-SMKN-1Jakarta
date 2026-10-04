import { Topbar, Content } from "@/components/Shell";
import { AdminSubmissionsClient } from "./AdminSubmissionsClient";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

export default async function AdminSubmissionsPage() {
  const { data } = await backendRequest<{
    submissions: PengajuanF01[];
    gurus: Profile[];
    anggotaByPengajuan: Record<string, AnggotaF01[]>;
  }>("/api/admin/submissions");
  if (!data) return null;

  return (
    <>
      <Topbar title="Semua Pengajuan F01" sub="Pantau seluruh berkas di semua tahap" />
      <Content>
        <AdminSubmissionsClient
          submissions={data.submissions}
          gurus={data.gurus}
          anggotaByPengajuan={data.anggotaByPengajuan}
        />
      </Content>
    </>
  );
}
