import type { CmsPublicItem } from "@/lib/cms-public";

const fallbackPhotos = [
  "/images/reference/design-v5/news-feature.jpg",
  "/images/reference/design-v5/news-industry.jpg",
  "/images/reference/design-v5/news-workshop.jpg",
  "/images/reference/design-v5/news-pentas.jpg",
  "/images/reference/design-v5/news-alumni.jpg",
  "/images/reference/design-v5/news-robotics.jpg"
];

export function getNewsImage(item: CmsPublicItem, index = 0): string {
  const suppliedImage = item.cover_image_url?.trim() || item.image_url?.trim();
  if (suppliedImage) return suppliedImage;

  const description = `${item.title} ${item.category || ""} ${item.author_label || ""}`.toLocaleLowerCase("id-ID");
  if (/robot|teknologi/.test(description)) return "/images/reference/design-v5/news-robotics.jpg";
  if (/prestasi|juara|medali|piala|kompetensi|lks/.test(description)) return "/images/reference/design-v5/news-lks.jpg";
  if (/industri|pkl|kunjungan/.test(description)) return "/images/reference/design-v5/news-industry.jpg";
  if (/basket|futsal|voli|pertandingan|turnamen|\bvs\b/.test(description)) return "/images/reference/design-v5/gallery-basketball.jpg";
  if (/pentas|seni|sumpah pemuda/.test(description)) return "/images/reference/design-v5/news-pentas.jpg";
  if (/alumni|karier/.test(description)) return "/images/reference/design-v5/news-alumni.jpg";
  if (/workshop|guru|akademik/.test(description)) return "/images/reference/design-v5/news-workshop.jpg";
  return fallbackPhotos[Math.abs(index) % fallbackPhotos.length];
}
