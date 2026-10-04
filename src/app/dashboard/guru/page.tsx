import { Topbar, Content } from "@/components/Shell";
import { GuruQueueClient } from "./GuruQueueClient";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

export default async function GuruPage() {
  const { data } = await backendRequest<{
    profile: Profile;
    submissions: PengajuanF01[];
    anggotaByPengajuan: Record<string, AnggotaF01[]>;
    stageKey: string;
  }>("/api/dashboard/approvals");
  if (!data) return null;

  return (
    <>
      <Topbar title="Antrian Persetujuan F01" sub="Tinjau dan setujui berkas pengajuan PKL siswa" />
      <Content>
        <GuruQueueClient
          profile={data.profile}
          submissions={data.submissions}
          anggotaByPengajuan={data.anggotaByPengajuan}
          stageKey={data.stageKey}
        />
      </Content>
    </>
  );
}
