import Link from "next/link";
import { getCmsPublicFeed, type CmsPublicItem } from "@/lib/cms-public";

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

export async function InformationDesignedPage() {
  const feed = await getCmsPublicFeed("news");
  const [featured, ...items] = feed.items;
  return <div className="news-page">
    <header className="news-page-hero"><div className="news-page-wrap">
      <p className="news-breadcrumb"><Link href="/">Beranda</Link> / Berita</p>
      <h1>Berita Sekolah</h1>
      <p>Kabar terbaru seputar prestasi, kegiatan, dan perkembangan akademik SMK Negeri 1 Jakarta.</p>
    </div></header>
    <section className="news-listing news-page-wrap" aria-label="Daftar berita">
      {featured ? <>
        <NewsCard item={featured} featured />
        {items.length > 0 && <div className="news-card-grid">{items.map((item) => <NewsCard key={item.id} item={item} />)}</div>}
      </> : <div className="news-empty" role="status">
        <span aria-hidden="true">▤</span>
        <h2>{feed.configured && !feed.available ? "Berita belum dapat dimuat" : "Belum ada berita terbit"}</h2>
        <p>{feed.configured && !feed.available ? "Silakan coba beberapa saat lagi." : "Berita akan tampil di halaman ini setelah diterbitkan oleh pengelola sekolah."}</p>
      </div>}
    </section>
  </div>;
}
