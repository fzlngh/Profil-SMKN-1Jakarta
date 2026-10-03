const ArrowIcon = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    {diagonal ? (
      <path d="M5.5 14.5 14 6m0 0H7m7 0v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M3.5 10h12m0 0-4.5-4.5M15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

const SparkIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="m12 2 1.8 7.1L21 12l-7.2 2.9L12 22l-1.8-7.1L3 12l7.2-2.9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const programs = [
  { number: "01", title: "Teknologi & digital", detail: "Belajar membangun solusi untuk kebutuhan dunia yang terus berubah.", mark: "T" },
  { number: "02", title: "Bisnis & layanan", detail: "Mengembangkan cara berpikir cermat, komunikatif, dan berorientasi solusi.", mark: "B" },
  { number: "03", title: "Kreasi & komunikasi", detail: "Mengubah gagasan menjadi karya yang bermakna dan mudah dipahami.", mark: "K" }
];

const steps = [
  { number: "01", title: "Temukan tempat PKL", detail: "Siswa dan perusahaan menyepakati bidang, lokasi, serta periode praktik." },
  { number: "02", title: "Ajukan formulir F01", detail: "Masuk ke SIM-PKL untuk mengisi data perusahaan dan mengajukan berkas." },
  { number: "03", title: "Persetujuan sekolah", detail: "Pengajuan ditinjau berjenjang oleh Guru BK/BP, Wali Kelas, dan Ka. Program Keahlian." },
  { number: "04", title: "Mulai pengalaman", detail: "Setelah disetujui, siswa siap menjalani praktik sesuai kesepakatan." }
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#beranda" aria-label="SMK Negeri 1 Jakarta, beranda">
          <span className="brand-seal" aria-hidden="true">1</span>
          <span className="brand-name">SMK NEGERI 1 JAKARTA<small>Belajar · Berkarya · Berdampak</small></span>
        </a>
        <nav className="main-nav" aria-label="Navigasi utama">
          <a href="#tentang">Tentang</a>
          <a href="#program">Program</a>
          <a href="#kegiatan">Kegiatan</a>
          <a href="#pkl">Informasi PKL</a>
        </nav>
        <a className="header-cta" href="/login">Portal siswa <ArrowIcon diagonal /></a>
      </header>

      <section className="hero" id="beranda" aria-labelledby="hero-title">
        <div className="hero-photo" role="img" aria-label="Suasana belajar dan kolaborasi di lingkungan sekolah" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow hero-eyebrow"><span /> SEKOLAH MENENGAH KEJURUAN · JAKARTA</div>
          <h1 id="hero-title">Siap berkarya.<br /><em>Siap melangkah.</em></h1>
          <p>Ruang tumbuh untuk generasi yang berani belajar, terampil menghadapi tantangan, dan memberi arti bagi sekitar.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="#pkl">Jelajahi program PKL <ArrowIcon /></a>
            <a className="hero-text-link" href="#tentang">Kenali sekolah <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-caption"><span className="caption-rule" /> SMK NEGERI 1 JAKARTA <span className="caption-dot">·</span> PROFIL SEKOLAH</div>
        <a className="hero-scroll" href="#tentang" aria-label="Gulir ke bagian tentang sekolah">↓</a>
      </section>

      <div className="ticker" aria-label="Tagline sekolah">
        <span>PEMBELAJARAN BERMAKNA</span><i>✳</i><span>KOMPETENSI MASA DEPAN</span><i>✳</i><span>PENGALAMAN DUNIA KERJA</span><i>✳</i><span>JAKARTA</span>
      </div>

      <section className="intro section-wrap" id="tentang">
        <div className="intro-kicker"><span className="section-index">01</span><span>TENTANG SEKOLAH</span></div>
        <div className="intro-main">
          <h2>Tempat belajar<br />yang <em>membuka jalan.</em></h2>
          <div className="intro-copy">
            <p>SMK Negeri 1 Jakarta adalah tempat bagi siswa untuk mengasah keahlian, menemukan potensi, dan menyiapkan langkah berikutnya—di dunia kerja maupun pendidikan lanjutan.</p>
            <a className="underlined-link" href="#cerita">Lihat cerita sekolah <ArrowIcon /></a>
          </div>
        </div>
        <div className="principles">
          <article><span>01 / TERAMPIL</span><h3>Belajar dengan praktik</h3><p>Pengetahuan menjadi lebih berarti saat digunakan untuk menghadapi tantangan nyata.</p></article>
          <article><span>02 / TERBUKA</span><h3>Tumbuh bersama</h3><p>Rasa ingin tahu, kolaborasi, dan sikap saling menghargai jadi bekal untuk terus berkembang.</p></article>
          <article><span>03 / BERDAMPAK</span><h3>Siap mengambil peran</h3><p>Setiap pengalaman adalah kesempatan untuk berkontribusi dan membangun masa depan.</p></article>
        </div>
      </section>

      <section className="program-section" id="program">
        <div className="section-wrap">
          <div className="section-heading">
            <div><div className="eyebrow"><span /> RUANG UNTUK BERTUMBUH</div><h2>Belajar sesuai<br /><em>minat & potensi.</em></h2></div>
            <p>Jelajahi pilihan bidang pembelajaran yang menghubungkan keterampilan, rasa ingin tahu, dan kebutuhan masa depan.</p>
          </div>
          <div className="program-grid">
            {programs.map((program) => (
              <article className="program-card" key={program.number}>
                <div className="program-card-top"><span>{program.number} / BIDANG</span><span className="program-mark">{program.mark}</span></div>
                <h3>{program.title}</h3><p>{program.detail}</p>
                <a href="#pkl" aria-label={`Pelajari pengalaman PKL untuk bidang ${program.title}`}>Lihat pengalaman PKL <ArrowIcon /></a>
              </article>
            ))}
          </div>
          <p className="content-note">Contoh bidang pada halaman ini bersifat ilustratif. Daftar program keahlian resmi perlu dikonfirmasi dan dilengkapi oleh sekolah.</p>
        </div>
      </section>

      <section className="pkl-section" id="pkl">
        <div className="section-wrap pkl-layout">
          <div className="pkl-intro">
            <div className="eyebrow"><span /> PENGALAMAN DUNIA KERJA</div>
            <h2>Belajar di sekolah.<br /><em>Bertumbuh di dunia kerja.</em></h2>
            <p>Praktik Kerja Lapangan (PKL) mempertemukan pembelajaran dengan pengalaman langsung di lingkungan kerja. Siswa mendapat ruang untuk menerapkan keahlian, sementara perusahaan ikut mendukung tumbuhnya talenta muda.</p>
            <div className="pkl-actions">
              <a className="button button-navy" href="/login">Ajukan PKL sebagai siswa <ArrowIcon /></a>
              <a className="underlined-link" href="#kemitraan">Informasi untuk perusahaan <ArrowIcon /></a>
            </div>
            <div className="pkl-reassurance"><SparkIcon /><span>Pengajuan administrasi siswa dilakukan melalui SIM-PKL sekolah.</span></div>
          </div>
          <div className="steps-panel">
            <div className="steps-heading"><span>ALUR PENGAJUAN PKL</span><span>F01</span></div>
            {steps.map((step) => (
              <article className="step-row" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.detail}</p></div>
                <span className="step-check" aria-hidden="true">↗</span>
              </article>
            ))}
            <p className="steps-footnote">Alur persetujuan mengikuti proses administrasi SIM-PKL yang tersedia.</p>
          </div>
        </div>
      </section>

      <section className="partner-section" id="kemitraan">
        <div className="section-wrap partner-inner">
          <div className="partner-symbol" aria-hidden="true"><span>01</span><i /></div>
          <div className="partner-copy">
            <div className="eyebrow"><span /> UNTUK DUNIA USAHA & INDUSTRI</div>
            <h2>Mari buka ruang<br /><em>untuk talenta muda.</em></h2>
            <p>Perusahaan dapat berkolaborasi menyediakan pengalaman belajar yang relevan bagi siswa. Sampaikan rencana kemitraan melalui kanal resmi sekolah.</p>
          </div>
          <div className="partner-action">
            <a className="button button-light" href="#kontak">Lihat informasi kontak <ArrowIcon /></a>
            <span>Informasi penerimaan mitra akan diperbarui oleh sekolah.</span>
          </div>
        </div>
      </section>

      <section className="stories-section section-wrap" id="kegiatan">
        <div className="stories-top">
          <div><div className="eyebrow"><span /> KEHIDUPAN SEKOLAH</div><h2>Belajar tak hanya<br /><em>di dalam kelas.</em></h2></div>
          <a className="underlined-link" href="#cerita">Semua cerita <ArrowIcon /></a>
        </div>
        <div className="story-grid" id="cerita">
          <article className="story-card story-feature">
            <div className="story-image story-image-one" role="img" aria-label="Siswa sedang berkolaborasi dalam kegiatan belajar" />
            <div className="story-meta"><span>KEGIATAN SISWA</span><span>01</span></div>
            <h3>Ide tumbuh saat kita belajar bersama.</h3>
            <p>Proyek, kegiatan, dan kolaborasi memberi ruang untuk mencoba hal baru.</p>
          </article>
          <article className="story-card">
            <div className="story-image story-image-two" role="img" aria-label="Suasana kegiatan praktik dan eksplorasi di sekolah" />
            <div className="story-meta"><span>PEMBELAJARAN</span><span>02</span></div>
            <h3>Rasa ingin tahu jadi langkah pertama.</h3>
            <p>Pengalaman belajar yang dekat dengan kehidupan membuka perspektif baru.</p>
          </article>
          <article className="story-card story-quote">
            <div className="quote-mark">“</div>
            <blockquote>Setiap pengalaman adalah bekal untuk melangkah lebih jauh.</blockquote>
            <span className="quote-caption">CERITA & INFORMASI SEKOLAH</span>
            <div className="quote-decoration" aria-hidden="true">SMK<br />01</div>
          </article>
        </div>
        <p className="content-note">Cerita kegiatan pada halaman ini merupakan contoh konten dan akan diganti dengan kabar terverifikasi dari sekolah.</p>
      </section>

      <section className="contact-strip" id="kontak">
        <div className="section-wrap contact-inner">
          <div><div className="eyebrow"><span /> LANGKAH BERIKUTNYA</div><h2>Ada rencana baik?<br /><em>Mari mulai bersama.</em></h2></div>
          <div className="contact-actions">
            <a className="button button-gold" href="/login">Masuk ke SIM-PKL <ArrowIcon diagonal /></a>
            <span>Kontak resmi sekolah dan informasi penerimaan mitra akan ditambahkan setelah dikonfirmasi.</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <a className="brand footer-brand" href="#beranda">
            <span className="brand-seal" aria-hidden="true">1</span>
            <span className="brand-name">SMK NEGERI 1 JAKARTA<small>Belajar · Berkarya · Berdampak</small></span>
          </a>
          <p>Menyiapkan langkah, membuka kemungkinan.</p>
          <nav aria-label="Navigasi footer"><a href="#tentang">Tentang</a><a href="#program">Program</a><a href="#pkl">PKL</a><a href="/login">SIM-PKL</a></nav>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} SMK Negeri 1 Jakarta</span><span>Informasi profil dan kontak resmi menunggu verifikasi sekolah.</span></div>
      </footer>
    </main>
  );
}
