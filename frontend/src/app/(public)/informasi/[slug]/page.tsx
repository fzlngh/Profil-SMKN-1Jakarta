import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCmsPublicFeed } from "@/lib/cms-public";
import { demoNews } from "@/lib/demo-news";
import { getNewsImage } from "@/lib/news-images";

type Props = { params: { slug: string } };

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

async function findNews(slug: string) {
  const feed = await getCmsPublicFeed("news");
  return (feed.items.length ? feed.items : demoNews).find((item) => item.slug === slug || item.id === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await findNews(decodeURIComponent(params.slug));
  return item ? { title: `${item.title} — Berita SMK Negeri 1 Jakarta`, description: item.excerpt || item.description } : {};
}

export default async function NewsDetailPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const feed = await getCmsPublicFeed("news");
  const sourceItems = feed.items.length ? feed.items : demoNews;
  const item = sourceItems.find((news) => news.slug === slug || news.id === slug);
  if (!item) notFound();
  const dateValue = item.published_at || item.starts_at || item.created_at;
  const date = formatDate(dateValue);
  const paragraphs = (item.body || item.description || item.excerpt || "Informasi lengkap belum ditambahkan oleh pengelola sekolah.")
    .split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const related = sourceItems.filter((news) => news.id !== item.id).slice(0, 3);

  return <article className="news-detail news-page-wrap">
    <nav className="news-detail-breadcrumb" aria-label="Breadcrumb"><Link href="/">Beranda</Link><span aria-hidden="true">›</span><Link href="/informasi">Berita</Link><span aria-hidden="true">›</span><span aria-current="page">{item.title}</span></nav>
    <header className="news-detail-header">
      <span className="news-category">{item.category || "Berita sekolah"}</span>
      <h1>{item.title}</h1>
      <div className="news-detail-meta">{item.author_label && <span>{item.author_label}</span>}{date && <time dateTime={dateValue}>{date}</time>}</div>
    </header>
    <img className="news-detail-cover" src={getNewsImage(item)} alt={item.title} />
    <div className="news-detail-layout">
      <div className="news-article-body">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {item.link_url && <p><a href={item.link_url} target="_blank" rel="noopener noreferrer">Lihat sumber atau informasi terkait ↗</a></p>}
        <Link className="news-back-link" href="/informasi">← Kembali ke daftar berita</Link>
      </div>
      {related.length > 0 && <aside className="news-related"><h2>Berita terkait</h2>{related.map((news) => { const relatedDate = formatDate(news.published_at || news.starts_at || news.created_at); return <Link key={news.id} href={`/informasi/${encodeURIComponent(news.slug || news.id)}`}><strong>{news.title}</strong>{relatedDate && <time>{relatedDate}</time>}</Link>; })}</aside>}
    </div>
  </article>;
}
