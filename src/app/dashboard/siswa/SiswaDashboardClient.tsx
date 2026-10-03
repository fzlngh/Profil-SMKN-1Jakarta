"use client";

import { useState, useTransition } from "react";
import type { AnggotaF01, PengajuanF01, Profile } from "@/lib/types";
import { Stepper } from "@/components/Stepper";
import { StatusBadge } from "@/components/Badge";
import { F01Preview } from "@/components/F01Preview";
import { Modal } from "@/components/Modal";
import { SiswaPicker } from "@/components/SiswaPicker";
import { useToast } from "@/components/Toast";
import { createSubmission, resubmitSubmission, type F01Payload } from "@/lib/actions/submissions";
import { fmtDate } from "@/lib/format";
import { downloadF01Pdf } from "@/lib/pdf/generateF01Pdf";

const STAGE_LABEL_ID: Record<string, string> = {
  guru_bk: "Guru BK/BP",
  wali_kelas: "Wali Kelas",
  ka_prodi: "Ka. Program Keahlian"
};

type FormState = Omit<F01Payload, "anggotaIds">;

const emptyForm: FormState = {
  namaPerusahaan: "",
  alamatKantor: "",
  alamatPkl: "",
  kontakNama: "",
  kontakJabatan: "",
  kontakHp: "",
  bulanMulai: "",
  bulanSelesai: "",
  tahun: String(new Date().getFullYear())
};

export function SiswaDashboardClient({
  profile,
  submissions,
  anggotaByPengajuan
}: {
  profile: Profile;
  submissions: PengajuanF01[];
  anggotaByPengajuan: Record<string, AnggotaF01[]>;
}) {
  const active = submissions.find(s => s.status !== "selesai") || null;
  const done = submissions.filter(s => s.status === "selesai");
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState<PengajuanF01 | null>(null);

  if (!profile.tanda_tangan_url) {
    return (
      <div className="card">
        <h3 className="text-[16.5px] mb-2">Unggah Tanda Tangan Terlebih Dahulu</h3>
        <p className="text-[13.5px] text-muted">
          Sebelum dapat mengajukan berkas F01, unggah tanda tangan digital Anda di menu <b>Profil Saya</b>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {active ? (
        <div className="card">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <h3 className="text-[16.5px]">Status Pengajuan Saat Ini</h3>
            <StatusBadge status={active.status} />
          </div>
          <Stepper sub={active} />
          {active.status === "ditolak" ? (
            <>
              <div className="mt-4 p-3.5 bg-danger-bg rounded-lg text-[13px]">
                <b>Ditolak oleh {STAGE_LABEL_ID[active.reject_stage || "guru_bk"]}:</b> {active.reject_note}
              </div>
              {!editing && (
                <button className="btn btn-primary mt-3.5" onClick={() => setEditing(true)}>
                  Perbaiki &amp; Ajukan Ulang
                </button>
              )}
              {editing && (
                <div className="mt-4">
                  <SubmissionForm
                    profile={profile}
                    initial={{
                      namaPerusahaan: active.nama_perusahaan,
                      alamatKantor: active.alamat_kantor,
                      alamatPkl: active.alamat_pkl,
                      kontakNama: active.kontak_nama,
                      kontakJabatan: active.kontak_jabatan,
                      kontakHp: active.kontak_hp,
                      bulanMulai: active.bulan_mulai,
                      bulanSelesai: active.bulan_selesai,
                      tahun: active.tahun
                    }}
                    initialAnggota={(anggotaByPengajuan[active.id] || [])
                      .filter(a => a.siswa_id !== profile.id)
                      .map(a => ({
                        id: a.siswa_id,
                        email: "",
                        nama_lengkap: a.nama,
                        role: "siswa",
                        nis: a.nis,
                        kelas: a.kelas,
                        jurusan: a.jurusan,
                        no_hp: a.no_hp,
                        nip: null,
                        tanda_tangan_url: a.paraf_url,
                        created_at: "",
                        updated_at: ""
                      }))}
                    editingId={active.id}
                    onDone={() => setEditing(false)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="mt-4">
              <F01Preview sub={active} anggota={anggotaByPengajuan[active.id] || []} />
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h3 className="text-[16.5px] mb-4">Formulir Pengajuan Calon Peserta PKL</h3>
          <SubmissionForm profile={profile} initial={emptyForm} initialAnggota={[]} onDone={() => {}} />
        </div>
      )}

      {done.length > 0 && (
        <div className="card">
          <h3 className="text-[16.5px] mb-4">Berkas F01 Selesai</h3>
          <div className="flex flex-col">
            {done.map(s => (
              <div key={s.id} className="flex items-center justify-between gap-3.5 py-3.5 border-b border-paper-line last:border-none flex-wrap">
                <div>
                  <div className="font-semibold text-[14px]">Diselesaikan {fmtDate(s.finalized_at)}</div>
                  <div className="text-[12px] text-muted mt-0.5">
                    {s.nama_perusahaan} · Periode {s.bulan_mulai} – {s.bulan_selesai} {s.tahun}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => setViewing(s)}>
                    Lihat Berkas
                  </button>
                  <button className="btn btn-gold btn-sm" onClick={() => downloadF01Pdf(s, anggotaByPengajuan[s.id] || [])}>
                    Unduh PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewing && (
        <Modal
          title={`Berkas F01 — ${viewing.perwakilan_nama}`}
          onClose={() => setViewing(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setViewing(null)}>
                Tutup
              </button>
              <button className="btn btn-gold" onClick={() => downloadF01Pdf(viewing, anggotaByPengajuan[viewing.id] || [])}>
                Unduh PDF
              </button>
            </>
          }
        >
          <F01Preview sub={viewing} anggota={anggotaByPengajuan[viewing.id] || []} />
        </Modal>
      )}
    </div>
  );
}

function SubmissionForm({
  profile,
  initial,
  initialAnggota,
  editingId,
  onDone
}: {
  profile: Profile;
  initial: FormState;
  initialAnggota: Profile[];
  editingId?: string;
  onDone: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [anggota, setAnggota] = useState<Profile[]>(initialAnggota);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit() {
    const required: (keyof FormState)[] = [
      "namaPerusahaan",
      "alamatKantor",
      "alamatPkl",
      "kontakNama",
      "kontakJabatan",
      "kontakHp",
      "bulanMulai",
      "bulanSelesai",
      "tahun"
    ];
    for (const key of required) {
      if (!String(form[key]).trim()) {
        toast("Mohon lengkapi seluruh kolom bertanda wajib", "err");
        return;
      }
    }
    const payload: F01Payload = { ...form, anggotaIds: anggota.map(a => a.id) };
    startTransition(async () => {
      const res = editingId ? await resubmitSubmission(editingId, payload) : await createSubmission(payload);
      if (res.error) {
        toast(res.error, "err");
        return;
      }
      toast(editingId ? "Berkas diajukan ulang" : "Berkas F01 berhasil diajukan ke Guru BK/BP", "ok");
      onDone();
    });
  }

  return (
    <div>
      <div className="section-label">Perwakilan Pengaju (Akun Anda)</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="field-label">Nama Lengkap</label>
          <input className="field-input" value={profile.nama_lengkap} disabled />
        </div>
        <div>
          <label className="field-label">NIS</label>
          <input className="field-input" value={profile.nis || ""} disabled />
        </div>
        <div>
          <label className="field-label">Kelas</label>
          <input className="field-input" value={profile.kelas || ""} disabled />
        </div>
        <div>
          <label className="field-label">Jurusan</label>
          <input className="field-input" value={profile.jurusan || ""} disabled />
        </div>
      </div>
      <div className="field-hint mt-2">
        Tanda tangan pada dokumen ("Perwakilan Calon Peserta PKL") akan diambil dari tanda tangan profil Anda sendiri.
      </div>

      <div className="section-label">Siswa Lain dalam Pengajuan Ini</div>
      <SiswaPicker selected={anggota} onChange={setAnggota} excludeId={profile.id} />

      <div className="section-label">Data Perusahaan / Instansi Tujuan</div>
      <div>
        <label className="field-label">Nama Perusahaan</label>
        <input className="field-input" value={form.namaPerusahaan} onChange={e => set("namaPerusahaan", e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3.5">
        <div>
          <label className="field-label">Alamat Kantor</label>
          <textarea className="field-input min-h-[70px]" value={form.alamatKantor} onChange={e => set("alamatKantor", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Alamat Tempat PKL</label>
          <textarea className="field-input min-h-[70px]" value={form.alamatPkl} onChange={e => set("alamatPkl", e.target.value)} />
        </div>
      </div>

      <div className="section-label">Kontak Person Perusahaan</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="field-label">Nama Kontak</label>
          <input className="field-input" value={form.kontakNama} onChange={e => set("kontakNama", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Jabatan</label>
          <input className="field-input" value={form.kontakJabatan} onChange={e => set("kontakJabatan", e.target.value)} />
        </div>
      </div>
      <div className="mt-3.5">
        <label className="field-label">No. HP Kontak</label>
        <input className="field-input" value={form.kontakHp} onChange={e => set("kontakHp", e.target.value)} />
      </div>

      <div className="section-label">Periode PKL</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="field-label">Bulan Mulai</label>
          <input className="field-input" placeholder="cth. Januari" value={form.bulanMulai} onChange={e => set("bulanMulai", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Bulan Selesai</label>
          <input className="field-input" placeholder="cth. Maret" value={form.bulanSelesai} onChange={e => set("bulanSelesai", e.target.value)} />
        </div>
      </div>
      <div className="mt-3.5 max-w-[200px]">
        <label className="field-label">Tahun</label>
        <input className="field-input" value={form.tahun} onChange={e => set("tahun", e.target.value)} />
      </div>

      <button className="btn btn-primary mt-5" disabled={pending} onClick={handleSubmit}>
        {pending ? <span className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" /> : null}
        {editingId ? "Ajukan Ulang Berkas F01" : "Ajukan Berkas F01"}
      </button>
    </div>
  );
}
