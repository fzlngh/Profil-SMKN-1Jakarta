import { Kop } from "@/components/Kop";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white rounded-[10px] overflow-hidden shadow-card">
        <Kop compact />
        <div className="px-8 pb-8 pt-7">
          <div className="text-[20px] font-serif font-semibold mb-1">Masuk ke SIM-PKL</div>
          <div className="text-[13px] text-muted mb-5">Sistem Informasi Administrasi Praktek Kerja Lapangan</div>
          <LoginForm />
          <div className="mt-4 p-3 bg-warn-bg border border-[#E4D3A8] rounded-lg text-[11.5px] text-[#6b5220] leading-relaxed">
            <b>Kata sandi awal:</b> siswa menggunakan NIS, guru menggunakan NIP sebagai kata sandi (dapat diganti
            setelah masuk).
          </div>
        </div>
      </div>
    </div>
  );
}
