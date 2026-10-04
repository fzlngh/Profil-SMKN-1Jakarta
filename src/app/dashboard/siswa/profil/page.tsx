import { Topbar, Content } from "@/components/Shell";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { SiswaSignatureCard } from "./SiswaSignatureCard";
import { SiswaPhoneForm } from "./SiswaPhoneForm";
import type { Profile } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

export default async function SiswaProfilPage() {
  const { data: p } = await backendRequest<Profile>("/api/me");
  if (!p) return null;

  return (
    <>
      <Topbar title="Profil Saya" sub="Data akun, tanda tangan, dan kata sandi" />
      <Content>
        <div className="card">
          <h3 className="text-[16.5px] mb-4">Data Diri</h3>
          <div className="kv">
            <div className="text-muted">Nama Lengkap</div>
            <div className="font-semibold">{p.nama_lengkap}</div>
          </div>
          <div className="kv">
            <div className="text-muted">NIS</div>
            <div className="font-semibold font-mono">{p.nis}</div>
          </div>
          <div className="kv">
            <div className="text-muted">Kelas</div>
            <div className="font-semibold">{p.kelas}</div>
          </div>
          <div className="kv">
            <div className="text-muted">Jurusan</div>
            <div className="font-semibold">{p.jurusan}</div>
          </div>
          <div className="kv">
            <div className="text-muted">Email</div>
            <div className="font-semibold">{p.email}</div>
          </div>
          <SiswaPhoneForm currentPhone={p.no_hp} />
        </div>

        <div className="card mt-4">
          <h3 className="text-[16.5px] mb-4">Tanda Tangan Digital</h3>
          <SiswaSignatureCard userId={p.id} currentUrl={p.tanda_tangan_url} />
        </div>

        <div className="card mt-4">
          <h3 className="text-[16.5px] mb-4">Ganti Kata Sandi</h3>
          <ChangePasswordForm />
        </div>
      </Content>
    </>
  );
}
