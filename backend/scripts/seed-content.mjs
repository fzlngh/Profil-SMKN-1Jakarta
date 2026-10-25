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

// Mode --sync (seed jadi sumber tunggal): setelah upsert, hapus baris terbit
// yang slug/titel-nya tidak ada di seed/public-content.json.
const FULL_SYNC = process.argv.includes("--sync");

async function syncBySlug(table, rows) {
  if (!FULL_SYNC) return { table, deleted: 0 };
  const keep = new Set(rows.map((row) => row.slug));
  const { data: existing, error } = await supabase.from(table).select("slug");
  if (error) throw new Error(`${table}: ${error.message}`);
  const stale = (existing ?? []).map((row) => row.slug).filter((slug) => !keep.has(slug));
  if (!stale.length) return { table, deleted: 0 };
  const { error: deleteError } = await supabase.from(table).delete().in("slug", stale);
  if (deleteError) throw new Error(`${table}: ${deleteError.message}`);
  return { table, deleted: stale.length, deletedSlugs: stale };
}

async function syncHeroBanners(rows) {
  if (!FULL_SYNC) return { table: "cms_hero_banners", deleted: 0 };
  const keep = new Set(rows.map((item) => item.title));
  const { data: existing, error } = await supabase.from("cms_hero_banners").select("id,title");
  if (error) throw new Error(`cms_hero_banners: ${error.message}`);
  const staleIds = (existing ?? []).filter((row) => !keep.has(row.title)).map((row) => row.id);
  if (!staleIds.length) return { table: "cms_hero_banners", deleted: 0 };
  const { error: deleteError } = await supabase.from("cms_hero_banners").delete().in("id", staleIds);
  if (deleteError) throw new Error(`cms_hero_banners: ${deleteError.message}`);
  return { table: "cms_hero_banners", deleted: staleIds.length };
}

try {
  const newsRows = (seed.news ?? []).map(newsRow);
  const announcementRows = (seed.announcements ?? []).map(announcementRow);
  const agendaRows = (seed.academic_agenda ?? []).map(agendaRow);
  const heroRows = seed.hero_banners ?? [];

  await upsertBySlug("cms_news", newsRows);
  await upsertBySlug("cms_announcements", announcementRows);
  await upsertBySlug("cms_academic_agenda", agendaRows);
  await seedHeroBanners(heroRows);

  const result = await Promise.all([
    syncBySlug("cms_news", newsRows),
    syncBySlug("cms_announcements", announcementRows),
    syncBySlug("cms_academic_agenda", agendaRows),
    syncHeroBanners(heroRows)
  ]);
  const synced = Object.fromEntries(result.map((entry) => [entry.table, entry]));
  console.log(JSON.stringify({
    event: "seed.completed",
    project: url,
    fullSync: FULL_SYNC,
    news: newsRows.length,
    announcements: announcementRows.length,
    academic_agenda: agendaRows.length,
    hero_banners: heroRows.length,
    removed: result.reduce((total, entry) => total + entry.deleted, 0),
    removedByName: synced
  }));
  if (FULL_SYNC) {
    for (const entry of result) {
      if (entry.deletedSlugs?.length) console.log(entry.table, "removed:", entry.deletedSlugs.join(", "));
    }
  }
} catch (error) {
  console.error(JSON.stringify({ event: "seed.failed", message: error.message }));
  process.exit(1);
}
