import { Topbar, Content } from "@/components/Shell";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { GuruSignatureCard } from "./GuruSignatureCard";
import { ROLE_LABEL, type Profile } from "@/lib/types";
import { backendRequest } from "@/lib/backend";

export default async function GuruProfilPage() {
  const { data: p } = await backendRequest<Profile>("/api/me");
  if (!p) return null;

  return (
    <>
      <Topbar title="Profil & Tanda Tangan" sub="Kelola data akun dan tanda tangan digital" />
      <Content>
        <div className="card">
          <h3 className="text-[16.5px] mb-4">Data Diri</h3>
          <div className="kv">
            <div className="text-muted">Nama Lengkap</div>
            <div className="font-semibold">{p.nama_lengkap}</div>
          </div>
          <div className="kv">
            <div className="text-muted">NIP</div>
            <div className="font-semibold font-mono">{p.nip}</div>
          </div>
          <div className="kv">
            <div className="text-muted">Peran</div>
            <div className="font-semibold">{ROLE_LABEL[p.role]}</div>
          </div>
          <div className="kv">
            <div className="text-muted">Email</div>
            <div className="font-semibold">{p.email}</div>
          </div>
        </div>

        <div className="card mt-4">
          <h3 className="text-[16.5px] mb-4">Tanda Tangan Digital</h3>
          <GuruSignatureCard userId={p.id} currentUrl={p.tanda_tangan_url} />
        </div>

        <div className="card mt-4">
          <h3 className="text-[16.5px] mb-4">Ganti Kata Sandi</h3>
          <ChangePasswordForm />
        </div>
      </Content>
    </>
  );
}
