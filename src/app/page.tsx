import { PublicTools } from "@/components/PublicTools";
import { ActivitySlider } from "@/components/ActivitySlider";
import Image from "next/image";

const ArrowIcon = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    {diagonal ? (
      <path d="M5.5 14.5 14 6m0 0H7m7 0v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M3.5 10h12m0 0-4.5-4.5M15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

const profileLinks = [
  { number: "01", label: "PROGRAM KEAHLIAN", title: "Belajar dengan tujuan", detail: "Kenali pilihan program dan bidang keahlian yang tersedia.", href: "/program-vokasi" },
  { number: "02", label: "FASILITAS SEKOLAH", title: "Ruang untuk berkembang", detail: "Jelajahi ruang belajar dan sarana penunjang kegiatan siswa.", href: "/fasilitas" },
  { number: "03", label: "SISWA & PENDIDIK", title: "Komunitas pembelajar", detail: "Temui cerita siswa serta informasi pendidik dan tenaga kependidikan.", href: "/siswa" },
  { number: "04", label: "PRESTASI", title: "Apresiasi setiap capaian", detail: "Lihat pencapaian dan karya warga sekolah.", href: "/prestasi" }
];

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <header className="site-header">
        <a className="brand" href="#beranda" aria-label="SMK Negeri 1 Jakarta, beranda">
          <Image className="brand-logo" src="/logo.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} priority />
          <span className="brand-name">SMK NEGERI 1 JAKARTA<small>PROFIL SEKOLAH · JAKARTA</small></span>
        </a>
        <nav className="main-nav" aria-label="Navigasi utama">
          <a href="#beranda" aria-current="page">Beranda</a>
          <a href="/tentang">Tentang</a>
          <a href="/program-vokasi">Program</a>
          <a href="/fasilitas">Fasilitas</a>
          <a href="/siswa">Siswa</a>
          <a href="/prestasi">Prestasi</a>
          <a href="/kegiatan">Kegiatan</a>
          <a href="/kontak">Kontak</a>
        </nav>
        <a className="header-cta" href="/login">Portal siswa <ArrowIcon diagonal /></a>
      </header>

      <main id="main-content">
        <section className="hero" id="beranda" aria-labelledby="hero-title">
          <div className="hero-photo" role="img" aria-label="Foto ilustrasi arsitektur lingkungan sekolah" />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="hero-glass">
              <div className="eyebrow hero-eyebrow"><span /> PROFIL SMK NEGERI 1 JAKARTA</div>
              <h1 id="hero-title">Ruang belajar.<br /><em>Ruang bertumbuh.</em></h1>
              <p>Mengenal sekolah, lingkungan belajar, program keahlian, dan cerita warganya—dalam satu ruang informasi.</p>
              <div className="hero-actions">
                <a className="button button-red" href="#profil">Jelajahi profil <ArrowIcon /></a>
                <a className="hero-text-link" href="/program-vokasi">Lihat program <span aria-hidden="true">↗</span></a>
              </div>
              <p className="hero-disclaimer"><span aria-hidden="true">i</span> Informasi profil resmi sedang menunggu verifikasi sekolah.</p>
            </div>
          </div>
          <div className="hero-caption"><span className="caption-rule" /> LINGKUNGAN SEKOLAH <span className="caption-dot">·</span> FOTO ILUSTRASI</div>
          <a className="hero-scroll" href="#profil" aria-label="Gulir ke bagian profil sekolah">↓</a>
        </section>

        <div className="ticker" aria-label="Topik profil sekolah">
          <span>PROFIL SEKOLAH</span><i aria-hidden="true">✳</i><span>PROGRAM KEAHLIAN</span><i aria-hidden="true">✳</i><span>FASILITAS & KEGIATAN</span><i aria-hidden="true">✳</i><span>PRESTASI SISWA</span>
        </div>

        <section className="intro section-wrap" id="profil" aria-labelledby="intro-title">
          <div className="intro-kicker"><span className="section-index">01</span><span>MENGENAL SEKOLAH</span></div>
          <div className="intro-main">
            <h2 id="intro-title">Belajar untuk<br /><em>melangkah lebih jauh.</em></h2>
            <div className="intro-copy">
              <p>SMK Negeri 1 Jakarta hadir sebagai ruang untuk belajar, mengembangkan keterampilan, dan tumbuh bersama. Halaman ini merangkum informasi sekolah yang akan dilengkapi dengan data resmi terverifikasi.</p>
              <a className="underlined-link" href="/tentang">Tentang sekolah <ArrowIcon /></a>
            </div>
          </div>
          <div className="profile-note">
            <span className="note-mark" aria-hidden="true">!</span>
            <div><strong>Catatan verifikasi</strong><p>Rincian profil, program, fasilitas, prestasi, dan kegiatan di halaman ini adalah pengantar. Data resmi belum dikonfirmasi dan tidak ditampilkan sebagai fakta.</p></div>
          </div>
          <div className="principles">
            <article><span>01 / PEMBELAJARAN</span><h3>Keahlian yang terus diasah</h3><p>Jelajahi informasi pembelajaran dan program keahlian yang akan diperbarui oleh sekolah.</p></article>
            <article><span>02 / KOMUNITAS</span><h3>Tumbuh bersama</h3><p>Ruang bagi siswa, pendidik, dan seluruh warga sekolah untuk belajar dan berkarya.</p></article>
            <article><span>03 / PENGEMBANGAN DIRI</span><h3>Berani mencoba hal baru</h3><p>Kegiatan dan pengalaman sekolah membuka kesempatan untuk mengembangkan potensi.</p></article>
          </div>
        </section>

        <section className="program-section" id="program" aria-labelledby="program-title">
          <div className="section-wrap">
            <div className="section-heading">
              <div><div className="eyebrow"><span /> JELAJAHI LINGKUNGAN SEKOLAH</div><h2 id="program-title">Banyak hal untuk<br /><em>dikenal lebih dekat.</em></h2></div>
              <p>Dari pilihan program hingga kehidupan siswa, temukan informasi yang membantu mengenal SMK Negeri 1 Jakarta.</p>
            </div>
            <div className="program-grid">
              {profileLinks.map((item) => (
                <article className="program-card" key={item.number}>
                  <div className="program-card-top"><span>{item.number} / {item.label}</span><span className="program-mark" aria-hidden="true">↗</span></div>
                  <h3>{item.title}</h3><p>{item.detail}</p>
                  <a href={item.href}>Jelajahi informasi <ArrowIcon /></a>
                </article>
              ))}
            </div>
            <p className="content-note">Informasi resmi tentang program dan fasilitas menunggu konfirmasi sekolah.</p>
          </div>
        </section>

        <section className="public-links section-wrap" aria-labelledby="explore-title">
          <div className="eyebrow"><span /> PROFIL & KEHIDUPAN SEKOLAH</div>
          <h2 id="explore-title">Kenali komunitas<br /><em>dan cerita di sekolah.</em></h2>
          <div className="public-link-grid">
            <a href="/fakultas"><span>01 / PENDIDIK & TENAGA KEPENDIDIKAN</span><strong>Pendidik & staf</strong><i aria-hidden="true">↗</i></a>
            <a href="/siswa"><span>02 / KEHIDUPAN SISWA</span><strong>Siswa & komunitas</strong><i aria-hidden="true">↗</i></a>
            <a href="/prestasi"><span>03 / CAPAIAN WARGA SEKOLAH</span><strong>Prestasi & karya</strong><i aria-hidden="true">↗</i></a>
            <a href="/fasilitas"><span>04 / SARANA PEMBELAJARAN</span><strong>Fasilitas</strong><i aria-hidden="true">↗</i></a>
            <a href="/kegiatan"><span>05 / AKTIVITAS SEKOLAH</span><strong>Kegiatan & agenda</strong><i aria-hidden="true">↗</i></a>
            <a href="/kontak"><span>06 / INFORMASI SEKOLAH</span><strong>Hubungi sekolah</strong><i aria-hidden="true">↗</i></a>
          </div>
          <p className="content-note">Nama, profil, fasilitas, agenda, dan capaian resmi akan dipublikasikan setelah diverifikasi.</p>
        </section>

        <section className="stories-section section-wrap" id="kegiatan" aria-labelledby="stories-title">
          <div className="stories-top">
            <div><div className="eyebrow"><span /> CERITA & AKTIVITAS</div><h2 id="stories-title">Sekolah adalah<br /><em>tentang kebersamaan.</em></h2></div>
            <a className="underlined-link" href="/kegiatan">Jelajahi kegiatan <ArrowIcon /></a>
          </div>
          <ActivitySlider />
          <p className="content-note">Foto dan gambaran kegiatan pada bagian ini bersifat ilustratif; dokumentasi serta agenda resmi menunggu verifikasi.</p>
        </section>

        <section className="portal-section" aria-labelledby="portal-title">
          <div className="section-wrap portal-callout">
            <div><div className="eyebrow"><span /> AKSES SISWA</div><h2 id="portal-title">Sudah memiliki akun<br /><em>portal siswa?</em></h2></div>
            <div className="portal-copy"><p>Akses layanan siswa dan SIM-PKL melalui portal khusus. Informasi PKL tersedia sebagai salah satu layanan, bukan fokus profil sekolah.</p><a className="button button-navy" href="/login">Masuk portal siswa <ArrowIcon diagonal /></a></div>
          </div>
        </section>

        <section className="contact-strip" id="kontak">
          <div className="section-wrap contact-inner">
            <div><div className="eyebrow"><span /> INFORMASI & PERTANYAAN</div><h2>Ada yang ingin<br /><em>ditanyakan?</em></h2></div>
            <div className="contact-actions">
              <a className="button button-red" href="/kontak">Hubungi sekolah <ArrowIcon /></a>
              <span>Kanal kontak resmi akan diperbarui setelah informasi sekolah dikonfirmasi.</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <a className="brand footer-brand" href="#beranda">
            <Image className="brand-logo" src="/logo.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} />
            <span className="brand-name">SMK NEGERI 1 JAKARTA<small>PROFIL SEKOLAH · JAKARTA</small></span>
          </a>
          <p>Belajar · Berkarya · Bertumbuh</p>
          <nav aria-label="Navigasi footer"><a href="/tentang">Tentang</a><a href="/program-vokasi">Program</a><a href="/kegiatan">Kegiatan</a><a href="/login">Portal siswa</a></nav>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} SMK Negeri 1 Jakarta</span><span>Konten profil resmi menunggu verifikasi sekolah.</span></div>
      </footer>
      <PublicTools />
    </>
  );
}
