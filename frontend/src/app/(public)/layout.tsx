import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicToolsLazy } from "@/components/PublicToolsLazy";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <div className="notice-bar"><span>SMK NEGERI 1 JAKARTA <i aria-hidden="true">·</i> DKI JAKARTA</span><span className="notice-contact"><a href="tel:+62213813630">(021) 381-3630</a><a href="mailto:smkn1jakarta@gmail.com">smkn1jakarta@gmail.com</a></span></div>
      <PublicHeader />
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <div className="footer-school">
            <Link className="brand footer-brand" href="/"><Image className="brand-logo" src="/logo-sekolah.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} /><span className="brand-name">SMKN 1 JAKARTA</span></Link>
            <p>Sekolah menengah kejuruan negeri di Jalan Budi Utomo, Pasar Baru, Jakarta Pusat.</p><div className="footer-tags"><span>Akreditasi A</span><span>NPSN 20100143</span></div>
          </div>
          <div className="footer-navigation">
            <section className="footer-reference-col"><h2>Kontak &amp; Lokasi</h2><address>Jl. Budi Utomo No. 7, RT 004/RW 008, Pasar Baru, Sawah Besar, Jakarta Pusat, DKI Jakarta 10710<a href="tel:+62213813630">☎ (021) 381-3630</a><a href="mailto:smkn1jakarta@gmail.com">✉ smkn1jakarta@gmail.com</a><span>Fax (021) 350-4091</span></address></section>
            <section className="footer-reference-col"><h2>Tautan Resmi</h2><nav aria-label="Tautan resmi"><a href="https://www.kemdikbud.go.id/" target="_blank" rel="noopener noreferrer">↗ Kemendikbudristek RI</a><a href="https://www.vokasi.kemdikbud.go.id/" target="_blank" rel="noopener noreferrer">↗ Ditjen Pendidikan Vokasi</a><a href="https://disdik.jakarta.go.id/" target="_blank" rel="noopener noreferrer">↗ Disdik DKI Jakarta</a><Link href="/ppdb">↗ Portal PPDB DKI Jakarta</Link><Link href="/kesiswaan">↗ Tracer Study Vokasi</Link></nav></section>
            <section className="footer-reference-col footer-information"><h2>Kanal Informasi</h2><p>Ikuti pembaruan kegiatan akademik, prestasi siswa, dan jadwal pendaftaran melalui kanal multimedia resmi.</p><div className="footer-social" aria-label="Kanal informasi"><a href="https://smkn1jakarta.sch.id/" aria-label="Situs resmi">◉</a><a href="https://www.instagram.com/smkn1jakarta_official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◈</a><a href="https://www.youtube.com/channel/UCFi14lgB6W_QeFtvt9oqTIQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▷</a><a href="https://twitter.com/smkn1_official" target="_blank" rel="noopener noreferrer" aria-label="Twitter">↗</a></div></section>
          </div>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} SMK Negeri 1 Jakarta.</span><div><a href="/tentang">Profil</a><a href="/informasi">Berita</a><a href="/ppdb">SPMB</a><a href="/kontak">Kontak</a><a href="/peta-situs">Peta Situs</a></div></div>
      </footer>
      <PublicToolsLazy />
    </>
  );
}
