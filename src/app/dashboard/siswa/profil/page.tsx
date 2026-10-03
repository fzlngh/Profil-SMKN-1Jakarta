import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Topbar, Content } from "@/components/Shell";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { SiswaSignatureCard } from "./SiswaSignatureCard";
import { SiswaPhoneForm } from "./SiswaPhoneForm";
import type { Profile } from "@/lib/types";

export default async function SiswaProfilPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const p = profile as Profile;

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
          <SiswaPhoneForm userId={p.id} currentPhone={p.no_hp} />
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
