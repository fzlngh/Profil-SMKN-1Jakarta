import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const here = dirname(fileURLToPath(import.meta.url));
const seedPath = join(here, "..", "seed", "public-content.json");

const url = process.env.CMS_SUPABASE_URL;
const serviceRoleKey = process.env.CMS_SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error("CMS_SUPABASE_URL dan CMS_SUPABASE_SERVICE_ROLE_KEY wajib diisi di backend/.env");
  process.exit(1);
}

const seed = JSON.parse(await readFile(seedPath, "utf8"));
const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function newsRow(item) {
  return {
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt ?? null,
    body: item.body,
    cover_image_url: item.cover_image_url ?? null,
    author_label: item.author_label ?? null,
    is_published: true,
    published_at: item.published_at ?? new Date().toISOString()
  };
}

function announcementRow(item) {
  return {
    title: item.title,
    slug: item.slug,
    body: item.body,
    severity: item.severity ?? "info",
    starts_at: item.starts_at ?? null,
    ends_at: item.ends_at ?? null,
    is_published: true,
    published_at: item.published_at ?? new Date().toISOString()
  };
}

function agendaRow(item) {
  return {
    title: item.title,
    slug: item.slug,
    description: item.description ?? null,
    starts_at: item.starts_at,
    ends_at: item.ends_at ?? null,
    location: item.location ?? null,
    is_published: true,
    published_at: item.published_at ?? new Date().toISOString()
  };
}

async function upsertBySlug(table, rows) {
  if (!rows.length) return 0;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`${table}: ${error.message}`);
  return rows.length;
}

async function seedHeroBanners(rows) {
  let count = 0;
  for (const item of rows) {
    const { data: existing, error: readError } = await supabase
      .from("cms_hero_banners").select("id").eq("title", item.title).limit(1);
    if (readError) throw new Error(`cms_hero_banners: ${readError.message}`);
    if (existing?.length) continue;
    const { error } = await supabase.from("cms_hero_banners").insert({
      title: item.title,
      subtitle: item.subtitle ?? null,
      image_url: item.image_url,
      link_url: item.link_url ?? null,
      display_order: item.display_order ?? 0,
      is_published: true,
      published_at: item.published_at ?? new Date().toISOString()
    });
    if (error) throw new Error(`cms_hero_banners: ${error.message}`);
    count += 1;
  }
  return count;
}

try {
  const news = await upsertBySlug("cms_news", (seed.news ?? []).map(newsRow));
  const announcements = await upsertBySlug("cms_announcements", (seed.announcements ?? []).map(announcementRow));
  const agenda = await upsertBySlug("cms_academic_agenda", (seed.academic_agenda ?? []).map(agendaRow));
  const hero = await seedHeroBanners(seed.hero_banners ?? []);
  console.log(JSON.stringify({
    event: "seed.completed",
    project: url,
    news,
    announcements,
    academic_agenda: agenda,
    hero_banners: hero
  }));
} catch (error) {
  console.error(JSON.stringify({ event: "seed.failed", message: error.message }));
  process.exit(1);
}
