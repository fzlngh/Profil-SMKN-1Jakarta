import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Topbar, Content } from "@/components/Shell";
import { SiswaDashboardClient } from "./SiswaDashboardClient";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";

export default async function SiswaPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const { data: submissions } = await supabase
    .from("pengajuan_f01")
    .select("*")
    .eq("created_by", user!.id)
    .order("created_at", { ascending: false });

  const ids = (submissions || []).map(s => s.id);
  const { data: anggota } = ids.length
    ? await supabase.from("pengajuan_anggota").select("*").in("pengajuan_id", ids)
    : { data: [] as AnggotaF01[] };

  const anggotaByPengajuan: Record<string, AnggotaF01[]> = {};
  for (const a of (anggota as AnggotaF01[]) || []) {
    (anggotaByPengajuan[a.pengajuan_id] ||= []).push(a);
  }

  return (
    <>
      <Topbar title="Pengajuan Berkas F01" sub="Ajukan dan pantau status berkas Praktek Kerja Lapangan" />
      <Content>
        <SiswaDashboardClient
          profile={profile as Profile}
          submissions={(submissions as PengajuanF01[]) || []}
          anggotaByPengajuan={anggotaByPengajuan}
        />
      </Content>
    </>
  );
}
