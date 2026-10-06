export type CmsPublicItem = {
  id: string;
  title: string;
  body?: string;
  excerpt?: string;
  description?: string;
  subtitle?: string;
  slug?: string;
  image_url?: string;
  cover_image_url?: string;
  link_url?: string;
  author_label?: string;
  severity?: string;
  starts_at?: string;
  ends_at?: string;
  location?: string;
};

export type CmsPublicFeed = {
  items: CmsPublicItem[];
  configured: boolean;
  available: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseItems(value: unknown): CmsPublicItem[] | null {
  if (!isRecord(value) || !isRecord(value.data) || !Array.isArray(value.data.items)) return null;
  const items: CmsPublicItem[] = [];
  for (const item of value.data.items) {
    if (!isRecord(item) || typeof item.id !== "string" || typeof item.title !== "string") continue;
    items.push({
      id: item.id,
      title: item.title,
      body: optionalString(item.body),
      excerpt: optionalString(item.excerpt),
      description: optionalString(item.description),
      subtitle: optionalString(item.subtitle),
      slug: optionalString(item.slug),
      image_url: optionalString(item.image_url),
      cover_image_url: optionalString(item.cover_image_url),
      link_url: optionalString(item.link_url),
      author_label: optionalString(item.author_label),
      severity: optionalString(item.severity),
      starts_at: optionalString(item.starts_at),
      ends_at: optionalString(item.ends_at),
      location: optionalString(item.location)
    });
  }
  return items;
}

export async function getCmsPublicFeed(resource: string): Promise<CmsPublicFeed> {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) return { items: [], configured: false, available: false };

  try {
    const response = await fetch(`${baseUrl}/api/public/${resource}?limit=20&offset=0`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3_500)
    });
    if (!response.ok) return { items: [], configured: true, available: false };
    const items = parseItems(await response.json());
    return items
      ? { items, configured: true, available: true }
      : { items: [], configured: true, available: false };
  } catch {
    console.error("cms.public_feed_unavailable", JSON.stringify({ resource }));
    return { items: [], configured: true, available: false };
  }
}
