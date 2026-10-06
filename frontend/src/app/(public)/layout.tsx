import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicToolsLazy } from "@/components/PublicToolsLazy";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <div className="notice-bar">Mengenal program, fasilitas, dan kehidupan SMK Negeri 1 Jakarta.</div>
      <PublicHeader />
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <Link className="brand footer-brand" href="/">
            <Image className="brand-logo" src="/logo.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} />
            <span className="brand-name">SMK NEGERI 1 JAKARTA<small>The First to Do The Best</small></span>
          </Link>
          <nav aria-label="Navigasi footer">
            <Link href="/tentang">Tentang</Link>
            <Link href="/tentang#program">Program</Link>
            <Link href="/tentang#fasilitas">Fasilitas</Link>
            <Link href="/tentang#siswa">Siswa</Link>
            <Link href="/kegiatan#prestasi">Prestasi</Link>
            <Link href="/kegiatan">Kegiatan</Link>
            <Link href="/informasi">Informasi</Link>
            <Link href="/ppdb">PPDB</Link>
            <Link href="/kesiswaan">Kesiswaan</Link>
            <Link href="/kontak">Kontak</Link>
          </nav>
        </div>
        <div className="section-wrap footer-bottom">
          <span>© {new Date().getFullYear()} SMK Negeri 1 Jakarta</span>
        </div>
      </footer>
      <PublicToolsLazy />
    </>
  );
}