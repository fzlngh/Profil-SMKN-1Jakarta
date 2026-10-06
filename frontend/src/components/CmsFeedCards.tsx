import type { CmsPublicItem } from "@/lib/cms-public";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? ""
    : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function CmsFeedCards({
  resource,
  items
}: {
  resource: "news" | "announcements" | "academic-agenda";
  items: CmsPublicItem[];
}) {
  return (
    <div className="public-card-grid">
      {items.map((item) => {
        const description = item.excerpt || item.description || item.body || "";
        const date = formatDate(item.starts_at);
        return (
          <article className="public-card" key={item.id}>
            <span className="public-card-label">
              {resource === "announcements" ? item.severity || "Pengumuman" : date || item.author_label || "Informasi sekolah"}
            </span>
            {item.cover_image_url && <img className="cms-feed-image" src={item.cover_image_url} alt={item.title} loading="lazy" />}
            <h3>{item.title}</h3>
            <p>{description.length > 260 ? `${description.slice(0, 257).trimEnd()}…` : description}</p>
            {resource === "academic-agenda" && item.location && <p>Lokasi: {item.location}</p>}
            {item.link_url && (
              <a className="public-card-link" href={item.link_url} target="_blank" rel="noopener noreferrer">
                Baca selengkapnya <span aria-hidden="true">↗</span>
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
