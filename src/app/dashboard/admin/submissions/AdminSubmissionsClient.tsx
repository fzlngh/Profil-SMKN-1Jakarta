"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AnggotaF01, PengajuanF01, Profile, SubmissionStatus } from "@/lib/types";
import { STAGE_ROLE, STAGE_LABEL, ROLE_LABEL } from "@/lib/types";
import { StatusBadge } from "@/components/Badge";
import { F01Preview } from "@/components/F01Preview";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { approveSubmission, rejectSubmission } from "@/lib/actions/submissions";
import { fmtDateTime } from "@/lib/format";

const FILTERS: { key: string; label: string; test: (s: PengajuanF01) => boolean }[] = [
  { key: "semua", label: "Semua", test: () => true },
  { key: "menunggu_bk", label: STAGE_LABEL.menunggu_bk, test: s => s.status === "menunggu_bk" },
  { key: "menunggu_wali_kelas", label: STAGE_LABEL.menunggu_wali_kelas, test: s => s.status === "menunggu_wali_kelas" },
  { key: "menunggu_ka_prodi", label: STAGE_LABEL.menunggu_ka_prodi, test: s => s.status === "menunggu_ka_prodi" },
  { key: "selesai", label: "Selesai", test: s => s.status === "selesai" },
  { key: "ditolak", label: "Ditolak", test: s => s.status === "ditolak" }
];

export function AdminSubmissionsClient({
  submissions,
  gurus,
  anggotaByPengajuan
}: {
  submissions: PengajuanF01[];
  gurus: Profile[];
  anggotaByPengajuan: Record<string, AnggotaF01[]>;
}) {
  const [tab, setTab] = useState("semua");
  const [viewing, setViewing] = useState<PengajuanF01 | null>(null);
  const filter = FILTERS.find(f => f.key === tab)!;
  const list = submissions.filter(filter.test);

  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setTab(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border-[1.5px] ${
              tab === f.key ? "bg-navy border-navy text-white" : "bg-white border-paper-line text-muted"
            }`}
          >
            {f.label} ({submissions.filter(f.test).length})
          </button>
        ))}
      </div>

      <div className="card">
        {list.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <div className="text-3xl mb-2.5">📁</div>
            <h4 className="text-ink text-[15px] mb-1.5">Tidak ada berkas</h4>
            <p className="text-[13px]">Belum ada pengajuan pada tahap ini.</p>
          </div>
        ) : (
          list.map(s => {
            const anggota = anggotaByPengajuan[s.id] || [];
            return (
              <div key={s.id} className="flex items-center justify-between gap-3.5 py-3.5 border-b border-paper-line last:border-none flex-wrap">
                <div>
                  <div className="font-semibold text-[14px]">
                    {s.perwakilan_nama} <span className="font-mono text-muted font-normal">({s.perwakilan_nis})</span>
                    {anggota.length > 1 && <span className="text-muted font-normal"> +{anggota.length - 1} siswa lain</span>}
                  </div>
                  <div className="text-[12px] text-muted mt-0.5">
                    {s.nama_perusahaan} · diperbarui {fmtDateTime(s.updated_at)}
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={s.status} />
                  <button className="btn btn-ghost btn-sm" onClick={() => setViewing(s)}>
                    Lihat
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {viewing && (
        <SuperReviewModal sub={viewing} anggota={anggotaByPengajuan[viewing.id] || []} gurus={gurus} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

function SuperReviewModal({
  sub,
  anggota,
  gurus,
  onClose
}: {
  sub: PengajuanF01;
  anggota: AnggotaF01[];
  gurus: Profile[];
  onClose: () => void;
}) {
  const stageRole = STAGE_ROLE[sub.status as SubmissionStatus];
  const candidates = gurus.filter(g => g.role === stageRole);
  const [signerId, setSignerId] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function handleApprove() {
    if (!signerId) {
      toast("Pilih guru yang akan menandatangani", "err");
      return;
    }
    startTransition(async () => {
      const res = await approveSubmission(sub.id, signerId);
      if (res.error) {
        toast(res.error, "err");
        return;
      }
      toast("Berkas disetujui dan diteruskan", "ok");
      onClose();
      router.refresh();
    });
  }

  function handleReject() {
    if (!signerId) {
      toast("Pilih guru atas nama siapa penolakan dilakukan", "err");
      return;
    }
    if (!note.trim()) {
      toast("Mohon isi catatan penolakan", "err");
      return;
    }
    startTransition(async () => {
      const res = await rejectSubmission(sub.id, note.trim(), signerId);
      if (res.error) {
        toast(res.error, "err");
        return;
      }
      toast("Berkas ditolak", "ok");
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal title={`Detail Berkas F01 — ${sub.perwakilan_nama}`} onClose={onClose} footer={<button className="btn btn-ghost" onClick={onClose}>Tutup</button>}>
      <F01Preview sub={sub} anggota={anggota} />
      {stageRole && (
        <div className="mt-5">
          <div className="section-label">Bertindak Sebagai (Superadmin)</div>
          <label className="field-label">Pilih {ROLE_LABEL[stageRole]} untuk menandatangani</label>
          <select className="field-input mb-3" value={signerId} onChange={e => setSignerId(e.target.value)}>
            <option value="">— pilih guru —</option>
            {candidates.map(g => (
              <option key={g.id} value={g.id} disabled={!g.tanda_tangan_url}>
                {g.nama_lengkap} {!g.tanda_tangan_url ? "(belum unggah TTD)" : ""}
              </option>
            ))}
          </select>

          {!rejecting ? (
            <div className="flex gap-2.5 flex-wrap">
              <button className="btn btn-ok" disabled={pending} onClick={handleApprove}>
                Setujui &amp; Teruskan
              </button>
              <button className="btn btn-danger" disabled={pending} onClick={() => setRejecting(true)}>
                Tolak
              </button>
            </div>
          ) : (
            <div>
              <label className="field-label">Catatan Penolakan</label>
              <textarea className="field-input min-h-[80px]" value={note} onChange={e => setNote(e.target.value)} />
              <div className="flex gap-2.5 mt-3">
                <button className="btn btn-ghost" onClick={() => setRejecting(false)}>
                  Batal
                </button>
                <button className="btn btn-danger" disabled={pending} onClick={handleReject}>
                  Tolak Berkas
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
