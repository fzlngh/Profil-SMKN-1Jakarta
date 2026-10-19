import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
};

function pageNumbers(page: number, totalPages: number): (number | "ellipsis-left" | "ellipsis-right")[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, "ellipsis-right", totalPages];
  if (page >= totalPages - 2) return [1, "ellipsis-left", totalPages - 2, totalPages - 1, totalPages];
  return [1, "ellipsis-left", page - 1, page, page + 1, "ellipsis-right", totalPages];
}

export function NewsPagination({ page, totalPages, hrefForPage }: Props) {
  if (totalPages <= 1) return null;
  const numbers = pageNumbers(page, totalPages);

  return (
    <nav className="news-pagination" aria-label="Halaman berita">
      {page > 1
        ? <Link className="news-pagination-arrow" href={hrefForPage(page - 1)} aria-label="Halaman sebelumnya">←</Link>
        : <span className="news-pagination-arrow is-disabled" aria-hidden="true">←</span>}
      {numbers.map((number) => typeof number === "number"
        ? <Link key={number} href={hrefForPage(number)} aria-current={number === page ? "page" : undefined} className={number === page ? "is-current" : undefined}>{number}</Link>
        : <span className="news-pagination-ellipsis" key={number}>…</span>)}
      {page < totalPages
        ? <Link className="news-pagination-arrow" href={hrefForPage(page + 1)} aria-label="Halaman berikutnya">→</Link>
        : <span className="news-pagination-arrow is-disabled" aria-hidden="true">→</span>}
    </nav>
  );
}
