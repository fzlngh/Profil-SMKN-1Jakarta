import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatOpenLink } from "@/components/ChatOpenLink";
import { getCmsPublicFeed } from "@/lib/cms-public";
import { demoNews } from "@/lib/demo-news";
import { getNewsImage } from "@/lib/news-images";

type Props = { params: { slug: string } };
function renderArticleParagraph(paragraph: string) {
  const parts = paragraph.split(/(https?:\/\/[^\s<>]+)/gi);
  return parts.map((part, index) => {
    if (!/^https?:\/\//i.test(part)) return part;
    const punctuation = part.match(/[.,!?;:)\]}]+$/)?.[0] || "";
    const url = punctuation ? part.slice(0, -punctuation.length) : part;
    return <Fragment key={index}><a className="news-article-source-link" href={url} target="_blank" rel="noopener noreferrer" style={{ overflowWrap: "anywhere", wordBreak: "break-all" }}>{url}</a>{punctuation}</Fragment>;
  });
}

function formatDate(value?: string, short = false) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? ""
    : new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: short ? "short" : "long",
        year: "numeric"
      }).format(date);
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
      <div className="news-detail-meta">
        {item.author_label && <span className="news-detail-author"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5.5 6a5.5 5.5 0 0 0-11 0" /></svg>{item.author_label}</span>}
        {date && <time dateTime={dateValue}><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3.5" width="12" height="11" rx="1.5"/><path d="M5 2v3M11 2v3M2 7h12"/></svg>{date}</time>}
      </div>
    </header>
    <div className="news-detail-layout">
      <div className="news-detail-main">
        <img className="news-detail-cover" src={getNewsImage(item)} alt={item.title} />
        <div className="news-article-body">
          {paragraphs.map((paragraph, index) => <p key={index}>{renderArticleParagraph(paragraph)}</p>)}
          {item.link_url && <p><a href={item.link_url} target="_blank" rel="noopener noreferrer">Lihat sumber atau informasi terkait ↗</a></p>}
          <Link className="news-back-link" href="/informasi">← Kembali ke daftar berita</Link>
        </div>
      </div>
      <aside className="news-detail-sidebar">
        {related.length > 0 && <section className="news-related" aria-labelledby="news-related-title"><h2 id="news-related-title">Berita terkait</h2>{related.map((news) => { const relatedDate = formatDate(news.published_at || news.starts_at || news.created_at, true); return <Link key={news.id} href={`/informasi/${encodeURIComponent(news.slug || news.id)}`}><strong>{news.title}</strong>{relatedDate && <time>{relatedDate}</time>}</Link>; })}</section>}
        <ChatOpenLink className="news-detail-chat" aria-label="Tanya WilhelBot">
          <span className="news-detail-chat-avatar" aria-hidden="true"><img src="/mascot.svg" alt="" /></span>
          <span className="news-detail-chat-copy"><strong>Bingung memilih? Tanya WilhelBot</strong><small>Asisten virtual siap membantu.</small></span>
          <span className="news-detail-chat-arrow" aria-hidden="true">→</span>
        </ChatOpenLink>
      </aside>
    </div>
  </article>;
}
