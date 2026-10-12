import Link from "next/link";
import { notFound } from "next/navigation";
import { getCmsPublicFeed } from "@/lib/cms-public";
import { demoNews } from "@/lib/demo-news";
import { ChatOpenLink } from "@/components/ChatOpenLink";

export const dynamic = "force-dynamic";

function dateLabel(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const feed = await getCmsPublicFeed("news");
  const key = params.slug;
  const sourceItems = feed.items.length ? feed.items : demoNews;
  const item = sourceItems.find((news) => news.id === key || news.slug === key);
  if (!item) {
    if (feed.available) notFound();
    return <main className="news-wrap news-detail"><Link className="news-back" href="/berita">← Kembali ke daftar berita</Link><div className="news-status">Detail berita belum dapat dimuat karena sumber konten tidak tersedia.</div></main>;
  }
  const imageUrl = item.cover_image_url || item.image_url;
  const content = item.body || item.description || item.excerpt || item.subtitle || "Isi berita belum tersedia pada sumber konten.";
  return <main className="news-wrap news-detail">
    <nav className="news-breadcrumb"><Link href="/">Beranda</Link> / <Link href="/berita">Berita</Link> / Detail</nav>
    <Link className="news-back" href="/berita">← Kembali ke daftar berita</Link>
    <div className="news-detail-layout"><article><header className="news-detail-header"><span className="news-category">{item.author_label || "Berita sekolah"}</span><h1>{item.title}</h1><p>{dateLabel(item.starts_at)}</p></header>
      {imageUrl && <figure className="news-detail-cover"><img src={imageUrl} alt={item.title} /></figure>}
      <div className="news-article-body">{content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </article><aside className="news-detail-aside"><section className="news-related"><h2>Berita terkait</h2>{sourceItems.filter((news) => news.id !== item.id).slice(0, 4).map((news) => <Link href={`/berita/${encodeURIComponent(news.slug || news.id)}`} key={news.id}><strong>{news.title}</strong><small>{dateLabel(news.starts_at)}</small></Link>)}</section><section className="news-chat-cta"><span aria-hidden="true">✦</span><h2>Punya pertanyaan?</h2><p>Tanya asisten virtual seputar kegiatan dan prestasi sekolah.</p><ChatOpenLink className="news-chat-action">Mulai Chat ▢</ChatOpenLink></section></aside></div>
    <Link className="news-read-button" href="/berita">← Berita lainnya</Link>
  </main>;
}
