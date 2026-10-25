import Link from "next/link";
import { PublicHeader, SchoolMark } from "@/components/PublicHeader";
import { PublicToolsLazy } from "@/components/PublicToolsLazy";
import { ChatbotLink } from "@/components/ChatbotLink";
import { ScrollReveal } from "@/components/ScrollReveal";
import { schoolAddress, schoolMapUrl } from "@/lib/school-location";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="public-site-shell">
        <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
        <PublicHeader />
        <div className="notice-bar"><span className="notice-message"><b>INFO</b> PTS Ganjil dimulai 15 Okt · lihat agenda</span><span className="notice-slogan">KOMPETEN / BERKARAKTER / SIAP KERJA</span><span className="notice-arrow" aria-hidden="true">→</span></div>
        <main id="main-content">{children}</main>
        <ScrollReveal />
        <footer className="site-footer">
        <div className="section-wrap footer-main footer-reference-layout">
          <div className="footer-school">
            <Link className="brand footer-brand" href="/"><SchoolMark /><span className="brand-name">SMK Negeri 1 Jakarta<small>Sekolah Menengah Kejuruan</small></span></Link>
            <p>Sekolah kejuruan negeri di Jakarta yang menyiapkan lulusan kompeten, berkarakter, dan siap menghadapi dunia kerja serta industri.</p>
            <address className="footer-contact"><a href={schoolMapUrl} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">⌖</span> {schoolAddress}</a><a href="tel:+62213813630"><span aria-hidden="true">☎</span> (021) 381-3630</a><a href="mailto:smkn1jakarta@gmail.com"><span aria-hidden="true">✉</span> smkn1jakarta@gmail.com</a></address>
          </div>
          <div className="footer-navigation">
            <section className="footer-reference-col"><h2>Jelajahi</h2><nav aria-label="Jelajahi"><Link href="/tentang">Program Studi</Link><Link href="/informasi">Berita</Link><Link href="/pengumuman">Pengumuman</Link><Link href="/agenda">Agenda Akademik</Link></nav></section>
            <section className="footer-reference-col"><h2>Lainnya</h2><nav aria-label="Tautan lainnya"><Link href="/organisasi">Organisasi</Link><Link href="/galeri">Galeri Sekolah</Link><ChatbotLink /></nav></section>
            <section className="footer-reference-col footer-information"><h2>Jam Layanan</h2><p>Senin – Jumat: 07.00 – 16.00</p><p>Sabtu: 07.00 – 12.00</p><p>Minggu &amp; libur: tutup</p></section>
          </div>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} SMK Negeri 1 Jakarta. Hak cipta dilindungi.</span><span>Dibangun oleh tim JOSJIS SMK Negeri 1 Jakarta</span></div>
        </footer>
      </div>
      <PublicToolsLazy />
    </>
  );
}
