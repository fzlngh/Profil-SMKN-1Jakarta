"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Profile, UserRole } from "@/lib/types";
import { ROLE_LABEL } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { createUser, updateUser, deleteUser, type NewUserPayload } from "@/lib/actions/users";

const ROLES: UserRole[] = ["siswa", "guru_bk", "wali_kelas", "ka_prodi", "superadmin"];
const SEED_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SEED_ADMIN_EMAIL || "admin@smkn1jkt.sch.id";

export function UsersClient({ users }: { users: Profile[] }) {
  const [tab, setTab] = useState<UserRole>("siswa");
  const [modalUser, setModalUser] = useState<Profile | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const list = users.filter(u => u.role === tab);

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteUser(deleteTarget.id);
      if (res.error) {
        toast(res.error, "err");
        return;
      }
      toast("Pengguna dihapus", "ok");
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <div />
        <button className="btn btn-primary" onClick={() => setModalUser("new")}>
          + Tambah Pengguna
        </button>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {ROLES.map(r => (
          <button
            key={r}
            onClick={() => setTab(r)}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border-[1.5px] ${
              tab === r ? "bg-navy border-navy text-white" : "bg-white border-paper-line text-muted"
            }`}
          >
            {ROLE_LABEL[r]} ({users.filter(u => u.role === r).length})
          </button>
        ))}
      </div>

      <div className="card">
        {list.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <div className="text-3xl mb-2.5">👥</div>
            <h4 className="text-ink text-[15px] mb-1.5">Belum ada pengguna</h4>
            <p className="text-[13px]">Tambahkan pengguna baru dengan tombol di atas.</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th className="text-left text-[11px] uppercase tracking-wide text-muted pb-2 border-b-2 border-paper-line">Nama</th>
                <th className="text-left text-[11px] uppercase tracking-wide text-muted pb-2 border-b-2 border-paper-line">Email</th>
                <th className="text-left text-[11px] uppercase tracking-wide text-muted pb-2 border-b-2 border-paper-line">
                  {tab === "siswa" ? "NIS / Kelas" : "NIP"}
                </th>
                <th className="border-b-2 border-paper-line" />
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id}>
                  <td className="py-2.5 border-b border-paper-line">{u.nama_lengkap}</td>
                  <td className="py-2.5 border-b border-paper-line">{u.email}</td>
                  <td className="py-2.5 border-b border-paper-line font-mono">
                    {tab === "siswa" ? `${u.nis} · ${u.kelas}/${u.jurusan}` : u.nip || "—"}
                  </td>
                  <td className="py-2.5 border-b border-paper-line text-right whitespace-nowrap">
                    <button className="btn btn-ghost btn-sm" onClick={() => setModalUser(u)}>
                      Ubah
                    </button>
                    {u.email !== SEED_ADMIN_EMAIL && (
                      <button className="btn btn-danger btn-sm ml-1.5" onClick={() => setDeleteTarget(u)}>
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalUser && (
        <UserFormModal
          user={modalUser === "new" ? null : modalUser}
          onClose={() => setModalUser(null)}
          onSaved={() => {
            setModalUser(null);
            router.refresh();
          }}
        />
      )}

      {deleteTarget && (
        <Modal
          title="Hapus Pengguna"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
                Batal
              </button>
              <button className="btn btn-danger" disabled={pending} onClick={handleDelete}>
                Hapus
              </button>
            </>
          }
        >
          <p>
            Yakin ingin menghapus akun <b>{deleteTarget.email}</b>? Tindakan ini tidak dapat dibatalkan.
          </p>
        </Modal>
      )}
    </div>
  );
}

function UserFormModal({ user, onClose, onSaved }: { user: Profile | null; onClose: () => void; onSaved: () => void }) {
  const [role, setRole] = useState<UserRole>(user?.role || "siswa");
  const [nama, setNama] = useState(user?.nama_lengkap || "");
  const [email, setEmail] = useState(user?.email || "");
  const [nis, setNis] = useState(user?.nis || "");
  const [kelas, setKelas] = useState(user?.kelas || "");
  const [jurusan, setJurusan] = useState(user?.jurusan || "");
  const [nip, setNip] = useState(user?.nip || "");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function handleSave() {
    if (!nama.trim() || !email.trim()) {
      toast("Nama dan email wajib diisi", "err");
      return;
    }
    if (role === "siswa" && (!nis.trim() || !kelas.trim() || !jurusan.trim())) {
      toast("Lengkapi NIS, kelas, dan jurusan", "err");
      return;
    }
    if (role !== "siswa" && role !== "superadmin" && !nip.trim()) {
      toast("Lengkapi NIP", "err");
      return;
    }
    if (role === "superadmin" && !user && !password) {
      toast("Kata sandi wajib diisi untuk akun superadmin baru", "err");
      return;
    }

    startTransition(async () => {
      if (user) {
        const res = await updateUser({
          id: user.id,
          nama: nama.trim(),
          kelas: role === "siswa" ? kelas.trim() : undefined,
          jurusan: role === "siswa" ? jurusan.trim() : undefined,
          nis: role === "siswa" ? nis.trim() : undefined,
          nip: role !== "siswa" && role !== "superadmin" ? nip.trim() : undefined,
          newPassword: password || undefined
        });
        if (res.error) {
          toast(res.error, "err");
          return;
        }
      } else {
        const payload: NewUserPayload = {
          role,
          nama: nama.trim(),
          email: email.trim(),
          nis: role === "siswa" ? nis.trim() : undefined,
          kelas: role === "siswa" ? kelas.trim() : undefined,
          jurusan: role === "siswa" ? jurusan.trim() : undefined,
          nip: role !== "siswa" && role !== "superadmin" ? nip.trim() : undefined,
          password: role === "superadmin" ? password : undefined
        };
        const res = await createUser(payload);
        if (res.error) {
          toast(res.error, "err");
          return;
        }
      }
      toast("Data pengguna disimpan", "ok");
      onSaved();
    });
  }

  return (
    <Modal
      title={user ? "Ubah Pengguna" : "Tambah Pengguna"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button className="btn btn-primary" disabled={pending} onClick={handleSave}>
            Simpan
          </button>
        </>
      }
    >
      <div className="mb-3.5">
        <label className="field-label">Peran</label>
        <select className="field-input" value={role} onChange={e => setRole(e.target.value as UserRole)} disabled={!!user}>
          <option value="siswa">Siswa</option>
          <option value="guru_bk">Guru BK/BP</option>
          <option value="wali_kelas">Wali Kelas</option>
          <option value="ka_prodi">Ka. Program Keahlian</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>
      <div className="mb-3.5">
        <label className="field-label">Nama Lengkap</label>
        <input className="field-input" value={nama} onChange={e => setNama(e.target.value)} />
      </div>
      <div className="mb-3.5">
        <label className="field-label">Email</label>
        <input className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!!user} />
      </div>

      {role === "siswa" && (
        <>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div>
              <label className="field-label">NIS</label>
              <input className="field-input font-mono" value={nis} onChange={e => setNis(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Kelas</label>
              <input className="field-input" placeholder="cth. XII" value={kelas} onChange={e => setKelas(e.target.value)} />
            </div>
          </div>
          <div className="mb-3.5">
            <label className="field-label">Jurusan</label>
            <input className="field-input" placeholder="cth. Rekayasa Perangkat Lunak" value={jurusan} onChange={e => setJurusan(e.target.value)} />
          </div>
        </>
      )}

      {role !== "siswa" && role !== "superadmin" && (
        <div className="mb-3.5">
          <label className="field-label">NIP</label>
          <input className="field-input font-mono" value={nip} onChange={e => setNip(e.target.value)} />
        </div>
      )}

      {(role === "superadmin" || user) && (
        <div className="mb-1">
          <label className="field-label">Kata Sandi {user ? "(opsional, ganti)" : ""}</label>
          <input
            className="field-input"
            type="password"
            placeholder={user ? "••••••••" : "wajib diisi"}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      )}
      <div className="field-hint mt-1">
        {user ? "Kosongkan kata sandi untuk mempertahankan kata sandi saat ini." : "Kata sandi awal otomatis mengikuti NIS (siswa) atau NIP (guru), kecuali Superadmin."}
      </div>
    </Modal>
  );
}
