import { redirect } from "next/navigation";
import Link from "next/link";
import { getCmsPublicFeed } from "@/lib/cms-public";
import { demoNews } from "@/lib/demo-news";
import { PagedNewsGrid } from "@/components/PagedNewsGrid";

export const revalidate = 60;

function dateLabel(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
function keyFor(item: { slug?: string; id: string }) { return encodeURIComponent(item.slug || item.id); }

export default async function NewsIndexPage({ searchParams }: { searchParams?: { q?: string; kategori?: string; page?: string } }) {
  // Konsistensi: tanpa filter, /berita dialihkan ke halaman utama berita (/informasi).
  if (!searchParams?.q && !searchParams?.kategori) redirect("/informasi");
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
  const [featured, ...allNews] = items;
  const requestedPage = Number.parseInt(searchParams?.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
  return <div className="news-page">
    <header className="news-page-hero"><div className="news-page-wrap"><p className="news-breadcrumb"><Link href="/">Beranda</Link> / Berita</p><h1>Berita Sekolah</h1><span>Kabar terbaru seputar prestasi, kegiatan, dan akademik.</span></div></header>
    <main className="news-page-wrap news-listing">
      <div className="news-tools"><nav className="news-filter" aria-label="Filter kategori berita">{["Semua", "Prestasi", "Kegiatan", "Akademik", "Alumni"].map((name) => <Link key={name} href={name === "Semua" ? (query ? `/berita?q=${encodeURIComponent(query)}` : "/berita") : `/berita?kategori=${encodeURIComponent(name)}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={category === name ? "active" : ""}>{name}</Link>)}</nav><form className="news-search" action="/berita"><label className="sr-only" htmlFor="news-query">Cari berita</label><span aria-hidden="true">⌕</span><input id="news-query" name="q" defaultValue={searchParams?.q || ""} placeholder="Cari berita..."/><button type="submit">Cari</button>{category !== "Semua" && <input type="hidden" name="kategori" value={category}/>}</form></div>
      {usingDemo && <div className="news-demo-notice" role="status">Konten contoh ditampilkan untuk pratinjau UI. Berita akan mengikuti CMS saat konten terbit.</div>}
      {items.length === 0 && <div className="news-empty"><h2>Berita tidak ditemukan</h2><p>Coba kata kunci atau kategori yang berbeda.</p></div>}
      {featured && <>
        <article className="news-card news-card-featured">
          <Link className="news-card-image" href={`/berita/${keyFor(featured)}`} aria-label={`Baca ${featured.title}`}>
            {featured.cover_image_url || featured.image_url ? <img src={featured.cover_image_url || featured.image_url} alt={featured.title} /> : <span>▧<small>Foto berita utama</small></span>}
          </Link>
          <div className="news-card-content"><span className="news-category">BERITA UTAMA</span><h2><Link href={`/berita/${keyFor(featured)}`}>{featured.title}</Link></h2><p>{featured.excerpt || featured.description || featured.subtitle || (featured.body || "").slice(0, 200)}</p><small>{dateLabel(featured.starts_at) || featured.author_label || "Berita sekolah"}</small><Link className="news-read-link" href={`/berita/${keyFor(featured)}`}>Baca selengkapnya <span>→</span></Link></div>
        </article>
        {allNews.length > 0 && <PagedNewsGrid items={allNews} currentPage={page} desktopPageSize={9} mobilePageSize={5} pagePath="/berita" detailPath="/berita" query={searchParams?.q} category={searchParams?.kategori} />}
      </>}
      <div className="news-back-row"><Link href="/">← Kembali ke beranda</Link></div>
    </main>
  </div>;
}
