"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CmsPublicItem } from "@/lib/cms-public";

type Props = {
  items: CmsPublicItem[];
  currentPage: number;
  desktopPageSize: number;
  mobilePageSize: number;
  pagePath: string;
  detailPath: string;
  query?: string;
  category?: string;
};

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function pageNumbers(page: number, total: number): (number | "left" | "right")[] {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, "right", total];
  if (page >= total - 2) return [1, "left", total - 2, total - 1, total];
  return [1, "left", page - 1, page, page + 1, "right", total];
}

export function PagedNewsGrid({ items, currentPage, desktopPageSize, mobilePageSize, pagePath, detailPath, query, category }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 620px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const pageSize = isMobile ? mobilePageSize : desktopPageSize;
  const totalPages = Math.ceil(items.length / pageSize);
  const page = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);
  const hrefForPage = (target: number) => {
    const params = new URLSearchParams();
    if (category) params.set("kategori", category);
    if (query) params.set("q", query);
    params.set("page", String(target));
    return `${pagePath}?${params.toString()}`;
  };

  return <>
    <div className="news-card-grid news-grid-3">{visibleItems.map((item) => {
      const slug = encodeURIComponent(item.slug || item.id);
      const excerpt = item.excerpt || item.description || item.subtitle || item.body || "";
      const date = formatDate(item.published_at || item.starts_at || item.created_at);
      return <article className="news-card" key={item.id}>
        <Link className="news-card-image" href={`${detailPath}/${slug}`} aria-label={`Baca ${item.title}`}>
          {item.cover_image_url || item.image_url ? <img src={item.cover_image_url || item.image_url} alt="" loading="lazy" /> : <span aria-hidden="true"><b>▧</b>Foto berita</span>}
        </Link>
        <div className="news-card-content">
          <span className="news-category">{item.author_label || item.category || "Berita sekolah"}</span>
          <h2><Link href={`${detailPath}/${slug}`}>{item.title}</Link></h2>
          <p>{excerpt.length > 180 ? `${excerpt.slice(0,177).trimEnd()}…` : excerpt}</p>
          <footer className="news-card-meta">{date && <time>{date}</time>}<Link className="news-read-link" href={`${detailPath}/${slug}`}>Baca <span aria-hidden="true">→</span></Link></footer>
        </div>
      </article>;
    })}</div>
    {totalPages > 1 && <nav className="news-pagination" aria-label="Halaman berita">
      {page > 1 ? <Link className="news-pagination-arrow" href={hrefForPage(page - 1)} aria-label="Halaman sebelumnya">←</Link> : <span className="news-pagination-arrow is-disabled" aria-hidden="true">←</span>}
      {pageNumbers(page, totalPages).map((number) => typeof number === "number"
        ? <Link key={number} href={hrefForPage(number)} aria-current={number === page ? "page" : undefined} className={number === page ? "is-current" : undefined}>{number}</Link>
        : <span className="news-pagination-ellipsis" key={number}>…</span>)}
      {page < totalPages ? <Link className="news-pagination-arrow" href={hrefForPage(page + 1)} aria-label="Halaman berikutnya">→</Link> : <span className="news-pagination-arrow is-disabled" aria-hidden="true">→</span>}
    </nav>}
  </>;
}
