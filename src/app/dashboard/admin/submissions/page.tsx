import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Topbar, Content } from "@/components/Shell";
import { AdminSubmissionsClient } from "./AdminSubmissionsClient";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";

export default async function AdminSubmissionsPage() {
  const supabase = createSupabaseServerClient();
  const { data: subs } = await supabase.from("pengajuan_f01").select("*").order("updated_at", { ascending: false });
  const { data: gurus } = await supabase.from("profiles").select("*").in("role", ["guru_bk", "wali_kelas", "ka_prodi"]);

  const ids = (subs || []).map(s => s.id);
  const { data: anggota } = ids.length
    ? await supabase.from("pengajuan_anggota").select("*").in("pengajuan_id", ids)
    : { data: [] as AnggotaF01[] };

  const anggotaByPengajuan: Record<string, AnggotaF01[]> = {};
  for (const a of (anggota as AnggotaF01[]) || []) {
    (anggotaByPengajuan[a.pengajuan_id] ||= []).push(a);
  }

  return (
    <>
      <Topbar title="Semua Pengajuan F01" sub="Pantau seluruh berkas di semua tahap" />
      <Content>
        <AdminSubmissionsClient
          submissions={(subs as PengajuanF01[]) || []}
          gurus={(gurus as Profile[]) || []}
          anggotaByPengajuan={anggotaByPengajuan}
        />
      </Content>
    </>
  );
}
