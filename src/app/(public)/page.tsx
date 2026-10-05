import Image from "next/image";
import Link from "next/link";

const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="M3.5 10h12m0 0-4.5-4.5M15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const links = [
  { n: "01", label: "PROGRAM KEAHLIAN", title: "Program keahlian", href: "/tentang#program" },
  { n: "02", label: "SARANA PEMBELAJARAN", title: "Fasilitas", href: "/tentang#fasilitas" },
  { n: "03", label: "PENDIDIK & STAF", title: "Pendidik & tenaga kependidikan", href: "/tentang#pendidik" },
  { n: "04", label: "KEHIDUPAN SISWA", title: "Siswa & komunitas", href: "/tentang#siswa" },
  { n: "05", label: "CAPAIAN", title: "Prestasi & karya", href: "/kegiatan#prestasi" },
  { n: "06", label: "AKTIVITAS", title: "Kegiatan & agenda", href: "/kegiatan#agenda" }
];

export default function HomePage() {
  return (
    <>
      <section className="hero" id="beranda" aria-labelledby="hero-title">
        <div className="hero-photo">
          <Image src="/images/school-campus-illustration.jpg" alt="Foto ilustrasi lingkungan sekolah" fill priority quality={70} sizes="100vw" />
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-glass">
            <div className="eyebrow hero-eyebrow"><span /> PROFIL SMK NEGERI 1 JAKARTA</div>
            <h1 id="hero-title">Ruang belajar.<br /><em>Ruang bertumbuh.</em></h1>
            <p>Mengenal sekolah, lingkungan belajar, program keahlian, dan cerita warganya—dalam satu ruang informasi.</p>
            <div className="hero-actions">
              <Link className="button button-red" href="/tentang">Jelajahi profil <ArrowIcon /></Link>
              <Link className="hero-text-link" href="/tentang#program">Lihat program <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="intro section-wrap" id="profil" aria-labelledby="intro-title">
        <div className="intro-kicker"><span className="section-index">01</span><span>MENGENAL SEKOLAH</span></div>
        <div className="intro-main">
          <h2 id="intro-title">Belajar untuk<br /><em>melangkah lebih jauh.</em></h2>
          <div className="intro-copy">
            <p>SMK Negeri 1 Jakarta hadir sebagai ruang untuk belajar, mengembangkan keterampilan, dan tumbuh bersama.</p>
            <Link className="underlined-link" href="/tentang">Tentang sekolah <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section className="public-links section-wrap" aria-labelledby="explore-title">
        <div className="eyebrow"><span /> JELAJAHI</div>
        <h2 id="explore-title">Kenali sekolah<br /><em>lebih dekat.</em></h2>
        <div className="public-link-grid">
          {links.map((l) => (
            <Link key={l.n} href={l.href}><span>{l.n} / {l.label}</span><strong>{l.title}</strong><i aria-hidden="true">↗</i></Link>
          ))}
        </div>
      </section>

      <section className="portal-section" aria-labelledby="portal-title">
        <div className="section-wrap portal-callout">
          <div><div className="eyebrow"><span /> AKSES SISWA</div><h2 id="portal-title">Sudah memiliki akun<br /><em>portal siswa?</em></h2></div>
          <div className="portal-copy">
            <p>Akses layanan siswa dan SIM-PKL melalui portal khusus.</p>
            <Link className="button button-navy" href="/login">Masuk portal siswa ↗</Link>
          </div>
        </div>
      </section>
    </>
  );
}