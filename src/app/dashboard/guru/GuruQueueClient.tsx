"use client";

import { useState, useTransition } from "react";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";
import { StatusBadge } from "@/components/Badge";
import { F01Preview } from "@/components/F01Preview";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { approveSubmission, rejectSubmission } from "@/lib/actions/submissions";
import { fmtDate } from "@/lib/format";

function belongsToMe(s: PengajuanF01, role: string, userId: string): boolean {
  if (role === "guru_bk") return s.bk_id === userId;
  if (role === "wali_kelas") return s.wali_kelas_id === userId;
  if (role === "ka_prodi") return s.ka_prodi_id === userId;
  return false;
}

export function GuruQueueClient({
  profile,
  submissions,
  anggotaByPengajuan,
  stageKey
}: {
  profile: Profile;
  submissions: PengajuanF01[];
  anggotaByPengajuan: Record<string, AnggotaF01[]>;
  stageKey: string;
}) {
  const [tab, setTab] = useState<"antrian" | "riwayat">("antrian");
  const [reviewing, setReviewing] = useState<PengajuanF01 | null>(null);

  const queue = submissions.filter(s => s.status === stageKey);
  const history = submissions.filter(s => belongsToMe(s, profile.role, profile.id));
  const list = tab === "antrian" ? queue : history;

  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-4.5">
        <button
          className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border-[1.5px] ${
            tab === "antrian" ? "bg-navy border-navy text-white" : "bg-white border-paper-line text-muted"
          }`}
          onClick={() => setTab("antrian")}
        >
          Menunggu Persetujuan ({queue.length})
        </button>
        <button
          className={`ml-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border-[1.5px] ${
            tab === "riwayat" ? "bg-navy border-navy text-white" : "bg-white border-paper-line text-muted"
          }`}
          onClick={() => setTab("riwayat")}
        >
          Riwayat Diproses ({history.length})
        </button>
      </div>

      {!profile.tanda_tangan_url && (
        <div className="card mb-4" style={{ borderColor: "#B8892B", background: "#F6EEDC" }}>
          <b>Tanda tangan digital belum diunggah.</b> Buka menu <i>Profil &amp; Tanda Tangan</i> agar tanda tangan
          otomatis terpasang saat menyetujui berkas.
        </div>
      )}

      <div className="card">
        {list.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <div className="text-3xl mb-2.5">📋</div>
            <h4 className="text-ink text-[15px] mb-1.5">{tab === "antrian" ? "Tidak ada berkas menunggu" : "Belum ada riwayat"}</h4>
            <p className="text-[13px]">
              {tab === "antrian" ? "Berkas baru dari siswa akan muncul di sini." : "Berkas yang telah Anda proses akan tercatat di sini."}
            </p>
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
                    {s.nama_perusahaan} · diajukan {fmtDate(s.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={s.status} />
                  <button className="btn btn-ghost btn-sm" onClick={() => setReviewing(s)}>
                    Tinjau
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {reviewing && (
        <ReviewModal
          sub={reviewing}
          anggota={anggotaByPengajuan[reviewing.id] || []}
          role={profile.role}
          canAct={reviewing.status === stageKey}
          onClose={() => setReviewing(null)}
        />
      )}
    </div>
  );
}

function ReviewModal({
  sub,
  anggota,
  role,
  canAct,
  onClose
}: {
  sub: PengajuanF01;
  anggota: AnggotaF01[];
  role: string;
  canAct: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const toast = useToast();

  function handleApprove() {
    startTransition(async () => {
      const res = await approveSubmission(sub.id);
      if (res.error) {
        toast(res.error, "err");
        return;
      }
      toast("Berkas disetujui dan diteruskan", "ok");
      onClose();
    });
  }

  function handleReject() {
    if (!note.trim()) {
      toast("Mohon isi catatan penolakan", "err");
      return;
    }
    startTransition(async () => {
      const res = await rejectSubmission(sub.id, note.trim());
      if (res.error) {
        toast(res.error, "err");
        return;
      }
      toast("Berkas ditolak, siswa akan diminta merevisi", "ok");
      onClose();
    });
  }

  return (
    <Modal title={`Tinjau Berkas F01 — ${sub.perwakilan_nama}`} onClose={onClose} footer={<button className="btn btn-ghost" onClick={onClose}>Tutup</button>}>
      <F01Preview sub={sub} anggota={anggota} />
      {canAct && !rejecting && (
        <div className="mt-4 flex gap-2.5 flex-wrap">
          <button className="btn btn-ok" disabled={pending} onClick={handleApprove}>
            Setujui &amp; Teruskan
          </button>
          <button className="btn btn-danger" disabled={pending} onClick={() => setRejecting(true)}>
            Tolak
          </button>
        </div>
      )}
      {canAct && rejecting && (
        <div className="mt-4">
          <label className="field-label">Catatan Penolakan</label>
          <textarea
            className="field-input min-h-[80px]"
            placeholder="Jelaskan alasan penolakan agar siswa dapat memperbaiki berkas..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
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
      {!canAct && (
        <div className="mt-4">
          <StatusBadge status={sub.status} />
        </div>
      )}
    </Modal>
  );
}
