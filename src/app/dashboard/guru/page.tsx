import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Topbar, Content } from "@/components/Shell";
import { GuruQueueClient } from "./GuruQueueClient";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";
import { STAGE_ROLE } from "@/lib/types";

export default async function GuruPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const p = profile as Profile;

  const stageKey = Object.keys(STAGE_ROLE).find(k => STAGE_ROLE[k as keyof typeof STAGE_ROLE] === p.role);

  const { data: submissions } = await supabase.from("pengajuan_f01").select("*").order("updated_at", { ascending: false });

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
      <Topbar title="Antrian Persetujuan F01" sub="Tinjau dan setujui berkas pengajuan PKL siswa" />
      <Content>
        <GuruQueueClient
          profile={p}
          submissions={(submissions as PengajuanF01[]) || []}
          anggotaByPengajuan={anggotaByPengajuan}
          stageKey={stageKey || ""}
        />
      </Content>
    </>
  );
}
