import Link from "next/link";
import { CmsFeedCards } from "@/components/CmsFeedCards";
import { HomeHero } from "@/components/HomeHero";
import { getCmsPublicFeed } from "@/lib/cms-public";

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
  { n: "06", label: "AKTIVITAS", title: "Kegiatan & agenda", href: "/kegiatan#agenda" },
  { n: "07", label: "INFORMASI", title: "Berita & pengumuman", href: "/informasi" },
  { n: "08", label: "PENERIMAAN", title: "Informasi PPDB", href: "/ppdb" },
  { n: "09", label: "HUBUNGI KAMI", title: "Pertanyaan & kontak", href: "/kontak#faq" }
];

export default async function HomePage() {
  const [news, announcements, agenda, banners] = await Promise.all([
    getCmsPublicFeed("news"),
    getCmsPublicFeed("announcements"),
    getCmsPublicFeed("academic-agenda"),
    getCmsPublicFeed("hero-banners")
  ]);
  const updates = [
    { title: "Berita terbaru", detail: "Belum ada berita terverifikasi untuk ditampilkan.", href: "/informasi#berita", feed: news, resource: "news" as const },
    { title: "Pengumuman", detail: "Belum ada pengumuman terhubung pada halaman ini.", href: "/informasi#pengumuman", feed: announcements, resource: "announcements" as const },
    { title: "Agenda akademik", detail: "Belum ada agenda akademik terkonfirmasi untuk ditampilkan.", href: "/informasi#agenda-akademik", feed: agenda, resource: "academic-agenda" as const }
  ];

  return (
    <>
      <HomeHero banners={banners.items} />

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

      <section className="home-updates" aria-labelledby="updates-title">
        <div className="section-wrap">
          <div className="eyebrow"><span /> INFORMASI SEKOLAH</div>
          <div className="updates-heading">
            <h2 id="updates-title">Berita &amp; agenda<br /><em>terbaru.</em></h2>
            <p>Berita, pengumuman, dan agenda terbaru yang telah diterbitkan oleh pengelola sekolah.</p>
          </div>
          {updates.map((item) => (
            <section className="home-update-group" key={item.resource} aria-label={item.title}>
              <h3>{item.title}</h3>
              {item.feed.configured && !item.feed.available && <p className="cms-feed-status" role="status">Konten sementara tidak dapat dimuat. Silakan coba kembali nanti.</p>}
              {item.feed.available && item.feed.items.length > 0
                ? <CmsFeedCards resource={item.resource} items={item.feed.items.slice(0, 3)} />
                : !item.feed.configured || item.feed.available
                  ? <div className="public-card-grid"><article className="public-card home-update-card"><span className="public-card-label">Menunggu konten resmi</span><h3>{item.title}</h3><p>{item.detail}</p><Link href={item.href}>Lihat informasi <span aria-hidden="true">→</span></Link></article></div>
                  : null}
            </section>
          ))}
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

    </>
  );
}