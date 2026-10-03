import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Topbar, Content } from "@/components/Shell";
import { StatusBadge } from "@/components/Badge";
import { fmtDateTime } from "@/lib/format";
import type { PengajuanF01 } from "@/lib/types";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card !p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted font-bold mb-2">{label}</div>
      <div className="font-serif text-[30px] font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export default async function AdminRingkasanPage() {
  const supabase = createSupabaseServerClient();
  const { data: subsData } = await supabase.from("pengajuan_f01").select("*").order("updated_at", { ascending: false });
  const subs = (subsData as PengajuanF01[]) || [];
  const { data: usersData } = await supabase.from("profiles").select("role");
  const users = usersData || [];

  const cnt = (k: string) => subs.filter(s => s.status === k).length;
  const students = users.filter(u => u.role === "siswa").length;
  const gurus = users.filter(u => !["siswa", "superadmin"].includes(u.role)).length;
  const admins = users.filter(u => u.role === "superadmin").length;

  return (
    <>
      <Topbar title="Ringkasan Sistem" sub="Ikhtisar seluruh proses administrasi PKL" />
      <Content>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard label="Total Pengajuan" value={subs.length} color="#1E3A5F" />
          <StatCard label="Menunggu Persetujuan" value={cnt("menunggu_bk") + cnt("menunggu_wali_kelas") + cnt("menunggu_ka_prodi")} color="#B8892B" />
          <StatCard label="Selesai" value={cnt("selesai")} color="#2F6B4F" />
          <StatCard label="Ditolak" value={cnt("ditolak")} color="#A23B3B" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4.5">
          <div className="card">
            <h3 className="text-[16.5px] mb-4">Ringkasan Tahapan</h3>
            <div className="kv">
              <div className="text-muted">Menunggu Guru BK/BP</div>
              <div className="font-semibold">{cnt("menunggu_bk")}</div>
            </div>
            <div className="kv">
              <div className="text-muted">Menunggu Wali Kelas</div>
              <div className="font-semibold">{cnt("menunggu_wali_kelas")}</div>
            </div>
            <div className="kv">
              <div className="text-muted">Menunggu Ka. Program Keahlian</div>
              <div className="font-semibold">{cnt("menunggu_ka_prodi")}</div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-[16.5px] mb-4">Pengguna Terdaftar</h3>
            <div className="kv">
              <div className="text-muted">Siswa</div>
              <div className="font-semibold">{students}</div>
            </div>
            <div className="kv">
              <div className="text-muted">Guru (BK/Wali/Ka. Prodi)</div>
              <div className="font-semibold">{gurus}</div>
            </div>
            <div className="kv">
              <div className="text-muted">Superadmin</div>
              <div className="font-semibold">{admins}</div>
            </div>
          </div>
        </div>

        <div className="card mt-4.5">
          <h3 className="text-[16.5px] mb-4">Aktivitas Terbaru</h3>
          {subs.length === 0 ? (
            <div className="text-center py-8 text-muted text-[13px]">Belum ada aktivitas</div>
          ) : (
            subs.slice(0, 8).map(s => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-3 border-b border-paper-line last:border-none">
                <div>
                  <div className="font-semibold text-[14px]">{s.perwakilan_nama}</div>
                  <div className="text-[12px] text-muted mt-0.5">{fmtDateTime(s.updated_at)}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))
          )}
        </div>
      </Content>
    </>
  );
}
