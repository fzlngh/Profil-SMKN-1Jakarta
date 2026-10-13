import Link from "next/link";
import { getCmsPublicFeed } from "@/lib/cms-public";
import { demoNews } from "@/lib/demo-news";

export const dynamic = "force-dynamic";

function dateLabel(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
function keyFor(item: { slug?: string; id: string }) { return encodeURIComponent(item.slug || item.id); }

export default async function NewsIndexPage({ searchParams }: { searchParams?: { q?: string; kategori?: string } }) {
  const feed = await getCmsPublicFeed("news");
  const usingDemo = feed.items.length === 0;
  const sourceItems = usingDemo ? demoNews : feed.items;
  const query = (searchParams?.q || "").trim().toLocaleLowerCase("id-ID");
  const category = searchParams?.kategori || "Semua";
  const items = sourceItems.filter((item) => {
    const text = `${item.title} ${item.excerpt || ""} ${item.description || ""} ${item.body || ""}`.toLocaleLowerCase("id-ID");
    const matchesQuery = !query || text.includes(query);
    const matchesCategory = category === "Semua" || (item.author_label || "").toLocaleLowerCase("id-ID").includes(category.toLocaleLowerCase("id-ID"));
    return matchesQuery && matchesCategory;
  });
  return <div className="news-page">
    <header className="news-page-hero"><div className="news-page-wrap"><p className="news-breadcrumb"><Link href="/">Beranda</Link> / Berita</p><h1>Berita Sekolah</h1><span>Kabar terbaru seputar prestasi, kegiatan, dan perkembangan akademik SMK Negeri 1 Jakarta.</span></div></header>
    <main className="news-page-wrap news-listing">
      <div className="news-tools"><nav className="news-filter" aria-label="Filter kategori berita">{["Semua", "Prestasi", "Kegiatan", "Akademik", "Sekolah", "Program"].map((name) => <Link key={name} href={name === "Semua" ? (query ? `/berita?q=${encodeURIComponent(query)}` : "/berita") : `/berita?kategori=${encodeURIComponent(name)}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={category === name ? "active" : ""}>{name}</Link>)}</nav><form className="news-search" action="/berita"><label className="sr-only" htmlFor="news-query">Cari berita</label><span aria-hidden="true">⌕</span><input id="news-query" name="q" defaultValue={searchParams?.q || ""} placeholder="Cari berita..."/><button type="submit">Cari</button>{category !== "Semua" && <input type="hidden" name="kategori" value={category}/>}</form></div>
      {usingDemo && <div className="news-demo-notice" role="status">Konten contoh ditampilkan untuk pratinjau UI. Berita akan mengikuti CMS saat konten terbit.</div>}
      {items.length === 0 && <div className="news-empty"><h2>Berita tidak ditemukan</h2><p>Coba kata kunci atau kategori yang berbeda.</p></div>}
      {items.length > 0 && <>
        <article className="news-card news-card-featured">
          <Link className="news-card-image" href={`/berita/${keyFor(items[0])}`} aria-label={`Baca ${items[0].title}`}>
            {items[0].cover_image_url || items[0].image_url ? <img src={items[0].cover_image_url || items[0].image_url} alt={items[0].title} /> : <span>▧<small>Foto berita utama</small></span>}
          </Link>
          <div className="news-card-content"><span className="news-category">BERITA UTAMA</span><h2><Link href={`/berita/${keyFor(items[0])}`}>{items[0].title}</Link></h2><p>{items[0].excerpt || items[0].description || items[0].subtitle || (items[0].body || "").slice(0, 200)}</p><small>{dateLabel(items[0].starts_at) || items[0].author_label || "Berita sekolah"}</small><Link className="news-read-link" href={`/berita/${keyFor(items[0])}`}>Baca selengkapnya <span>→</span></Link></div>
        </article>
        <div className="news-card-grid">{items.slice(1).map((item, index) => <article className="news-card" key={item.id}>
          <Link className="news-card-image" href={`/berita/${keyFor(item)}`} aria-label={`Baca ${item.title}`}>
            {item.cover_image_url || item.image_url ? <img src={item.cover_image_url || item.image_url} alt={item.title} loading="lazy" /> : <span>▧<small>Foto berita</small></span>}
          </Link><div className="news-card-content"><span className="news-category">{item.author_label || "Berita"}</span><h2><Link href={`/berita/${keyFor(item)}`}>{item.title}</Link></h2><p>{(item.excerpt || item.description || item.subtitle || item.body || "").slice(0, 150)}</p><footer className="news-card-meta"><small>{dateLabel(item.starts_at)}</small><Link className="news-read-link" href={`/berita/${keyFor(item)}`}>Baca →</Link></footer></div>
        </article>)}</div>
      </>}
      <div className="news-back-row"><Link href="/">← Kembali ke beranda</Link></div>
    </main>
  </div>;
}
