import { Topbar, Content } from "@/components/Shell";
import { SiswaDashboardClient } from "./SiswaDashboardClient";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

export default async function SiswaPage() {
  const { data } = await backendRequest<{
    profile: Profile;
    submissions: PengajuanF01[];
    anggotaByPengajuan: Record<string, AnggotaF01[]>;
  }>("/api/dashboard/student");
  if (!data) return null;

  return (
    <>
      <Topbar title="Pengajuan Berkas F01" sub="Ajukan dan pantau status berkas Praktek Kerja Lapangan" />
      <Content>
        <SiswaDashboardClient
          profile={data.profile}
          submissions={data.submissions}
          anggotaByPengajuan={data.anggotaByPengajuan}
        />
      </Content>
    </>
  );
}
