import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="hero reference-hero" id="beranda" aria-labelledby="hero-title">
      <div className="hero-photo"><Image src="/images/reference/campus.png" alt="Gedung SMK Negeri 1 Jakarta" fill priority sizes="100vw" /></div>
      <div className="hero-content section-wrap">
        <div className="hero-glass">
          <div className="eyebrow hero-eyebrow"><span /> SMK NEGERI 1 JAKARTA · DKI JAKARTA</div>
          <h1 id="hero-title">Selamat Datang di SMK Negeri 1 Jakarta</h1>
          <p className="hero-description">SMK Negeri 1 Jakarta adalah sekolah menengah kejuruan negeri di Jalan Budi Utomo, Pasar Baru, Jakarta Pusat. Sejak berdiri pada 1906, sekolah ini berkomitmen menyiapkan peserta didik dengan keterampilan, disiplin, kejujuran, dan kesiapan untuk berkembang di dunia kerja maupun pendidikan lanjutan.</p>
          <div className="hero-actions">
            <Link className="button button-red" href="/tentang#program">Lihat Program Keahlian</Link>
            <Link className="button button-red" href="/ppdb">Informasi SPMB</Link>
            <Link className="hero-text-link" href="/kontak">Hubungi Sekolah <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
