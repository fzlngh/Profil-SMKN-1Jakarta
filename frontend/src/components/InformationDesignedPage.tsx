import Link from "next/link";
import { getCmsPublicFeed, type CmsPublicItem } from "@/lib/cms-public";
import { demoNews } from "@/lib/demo-news";
import { PagedNewsGrid } from "@/components/PagedNewsGrid";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? ""
    : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function newsHref(item: CmsPublicItem) {
  return `/informasi/${encodeURIComponent(item.slug || item.id)}`;
}

function NewsCard({ item, featured = false }: { item: CmsPublicItem; featured?: boolean }) {
  const excerpt = item.excerpt || item.description || item.body || "Berita resmi SMK Negeri 1 Jakarta.";
  const dateValue = item.published_at || item.starts_at || item.created_at;
  const date = formatDate(dateValue);
  return (
    <article className={featured ? "news-card news-card-featured" : "news-card"}>
      <Link className="news-card-image" href={newsHref(item)} aria-label={`Baca ${item.title}`}>
        {item.cover_image_url || item.image_url
          ? <img src={item.cover_image_url || item.image_url} alt="" loading="lazy" />
          : <span aria-hidden="true"><b>▧</b>Foto berita</span>}
      </Link>
      <div className="news-card-content">
        <span className="news-category">{item.category || (featured ? "Berita utama" : "Berita sekolah")}</span>
        <h2><Link href={newsHref(item)}>{item.title}</Link></h2>
        <p>{excerpt.length > 230 ? `${excerpt.slice(0, 227).trimEnd()}…` : excerpt}</p>
        <div className="news-card-meta">{date && <time dateTime={dateValue}>{date}</time>}
          <Link className="news-read-link" href={newsHref(item)}>{featured ? "Baca selengkapnya" : "Baca"} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}

export async function InformationDesignedPage({ searchParams }: { searchParams?: { page?: string } } = {}) {
  const feed = await getCmsPublicFeed("news");
  const items = feed.items.length ? feed.items : demoNews;
  const preferredFeature = items.findIndex((item) => /juara nasional lomba kompetensi siswa/i.test(item.title));
  const featuredIndex = preferredFeature >= 0 ? preferredFeature : 0;
  const featured = items[featuredIndex];
  const allItems = items.filter((_, index) => index !== featuredIndex);
  const requestedPage = Number.parseInt(searchParams?.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
  return <div className="news-page">
    <header className="news-page-hero"><div className="news-page-wrap">
      <p className="news-breadcrumb"><Link href="/">Beranda</Link> / Berita</p>
      <h1>Berita Sekolah</h1>
      <p>Kabar terbaru seputar prestasi, kegiatan, dan akademik.</p>
    </div></header>
    <section className="news-listing news-page-wrap" aria-label="Daftar berita">
      <div className="news-tools"><nav className="news-filter" aria-label="Kategori berita">
        {["Semua", "Prestasi", "Kegiatan", "Akademik", "Alumni"].map((category) => <Link key={category} href={category === "Semua" ? "/informasi" : `/berita?kategori=${encodeURIComponent(category)}`} className={category === "Semua" ? "active" : ""}>{category}</Link>)}
      </nav><form className="news-search" action="/berita"><span aria-hidden="true">⌕</span><input name="q" placeholder="Cari berita..." aria-label="Cari berita"/><button type="submit">Cari</button></form></div>
      {featured ? <>
        <NewsCard item={featured} featured />
        {allItems.length > 0 && <PagedNewsGrid items={allItems} currentPage={page} desktopPageSize={6} mobilePageSize={5} pagePath="/informasi" detailPath="/informasi" />}
      </> : <div className="news-empty" role="status"><span aria-hidden="true">▤</span><h2>Belum ada berita terbit</h2><p>Berita akan tampil di halaman ini setelah diterbitkan oleh pengelola sekolah.</p></div>}
    </section>
  </div>;
}
