import { z } from "zod";

export const RESOURCE_NAMES = ["news", "announcements", "academic-agenda", "hero-banners"];

export const RESOURCE_TABLES = {
  news: "cms_news",
  announcements: "cms_announcements",
  "academic-agenda": "cms_academic_agenda",
  "hero-banners": "cms_hero_banners"
};

const uuidSchema = z.string().uuid();
const slugSchema = z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const shortText = (max) => z.string().trim().min(1).max(max);
const optionalText = (max) => z.string().trim().max(max).nullable().optional();
const httpUrl = z.string().url().max(2048).refine((value) => {
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
});
const timestamp = z.string().datetime({ offset: true });
const common = {
  is_published: z.boolean().optional(),
  published_at: timestamp.nullable().optional()
};

export const contentSchemas = {
  news: z.object({
    ...common,
    title: shortText(200),
    slug: slugSchema,
    excerpt: optionalText(500),
    body: shortText(50_000),
    cover_image_url: httpUrl.nullable().optional(),
    author_label: optionalText(120)
  }).strict(),
  announcements: z.object({
    ...common,
    title: shortText(200),
    slug: slugSchema,
    body: shortText(20_000),
    severity: z.enum(["info", "important", "urgent"]).optional(),
    starts_at: timestamp.nullable().optional(),
    ends_at: timestamp.nullable().optional()
  }).strict(),
  "academic-agenda": z.object({
    ...common,
    title: shortText(200),
    slug: slugSchema,
    description: optionalText(5_000),
    starts_at: timestamp,
    ends_at: timestamp.nullable().optional(),
    location: optionalText(250)
  }).strict(),
  "hero-banners": z.object({
    ...common,
    title: shortText(200),
    subtitle: optionalText(500),
    image_url: httpUrl,
    link_url: httpUrl.nullable().optional(),
    display_order: z.number().int().min(0).max(10_000).optional()
  }).strict()
};

export function validateContent(resource, payload, { partial = false } = {}) {
  const schema = contentSchemas[resource];
  if (!schema) return { success: false };
  if (partial && (!payload || typeof payload !== "object" || Array.isArray(payload) || !Object.keys(payload).length)) {
    return { success: false };
  }
  return (partial ? schema.partial() : schema).safeParse(payload);
}

export function classifyQuestion(question) {
  const text = question.toLocaleLowerCase("id");
  if (/\b(agenda|jadwal|kegiatan|kalender|acara)\b/.test(text)) return "academic_agenda";
  if (/\b(pengumuman|announcement|informasi terbaru)\b/.test(text)) return "announcement";
  if (/\b(berita|prestasi|artikel|kabar)\b/.test(text)) return "news";
  if (/\b(program|jurusan|keahlian|kurikulum|belajar)\b/.test(text)) return "academic_program";
  if (/\b(alamat|kontak|telepon|email|lokasi|sekolah)\b/.test(text)) return "school_profile";
  return "other";
}

export class CmsService {
  constructor({ publicClient, serviceClient, clock = () => new Date() }) {
    this.publicClient = publicClient;
    this.serviceClient = serviceClient;
    this.clock = clock;
  }

  async getRole(userId) {
    const { data, error } = await this.serviceClient
      .from("cms_user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error("DEPENDENCY_ERROR");
    return data?.role ?? null;
  }

  async getChatAnalytics({ days = 30, limit = 20 } = {}) {
    const since = new Date(this.clock().getTime() - days * 24 * 60 * 60 * 1_000).toISOString();
    const { data, error } = await this.serviceClient
      .from("cms_chatbot_analytics")
      .select("category,outcome,model,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1_000);
    if (error) throw new Error("DEPENDENCY_ERROR");

    const categoryCounts = {};
    const outcomeCounts = {};
    for (const row of data ?? []) {
      categoryCounts[row.category] = (categoryCounts[row.category] ?? 0) + 1;
      outcomeCounts[row.outcome] = (outcomeCounts[row.outcome] ?? 0) + 1;
    }
    return {
      days,
      total: data?.length ?? 0,
      truncated: (data?.length ?? 0) === 1_000,
      categories: categoryCounts,
      outcomes: outcomeCounts,
      recent: (data ?? []).slice(0, limit)
    };
  }

  async listPublished(resource, { limit = 20, offset = 0 } = {}) {
    const table = RESOURCE_TABLES[resource];
    if (!table) throw new Error("NOT_FOUND");
    const now = this.clock().toISOString();
    let query = this.publicClient.from(table).select("*", { count: "exact" })
      .eq("is_published", true)
      .or(`published_at.is.null,published_at.lte.${now}`);
    if (resource === "announcements") {
      query = query.or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gte.${now}`);
    }
    if (resource === "academic-agenda") {
      query = query.or(`ends_at.is.null,ends_at.gte.${now}`).order("starts_at", { ascending: true });
    } else if (resource === "hero-banners") {
      query = query.order("display_order", { ascending: true }).order("created_at", { ascending: false });
    } else {
      query = query.order("published_at", { ascending: false, nullsFirst: false });
    }
    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error) throw new Error("DEPENDENCY_ERROR");
    return { items: data ?? [], total: count ?? 0, limit, offset };
  }

  async getPublished(resource, id) {
    const table = RESOURCE_TABLES[resource];
    if (!table) throw new Error("NOT_FOUND");
    const now = this.clock().toISOString();
    let query = this.publicClient.from(table).select("*")
      .eq("id", id)
      .eq("is_published", true)
      .or(`published_at.is.null,published_at.lte.${now}`);
    if (resource === "announcements") {
      query = query.or(`starts_at.is.null,starts_at.lte.${now}`).or(`ends_at.is.null,ends_at.gte.${now}`);
    } else if (resource === "academic-agenda") {
      query = query.or(`ends_at.is.null,ends_at.gte.${now}`);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error("DEPENDENCY_ERROR");
    if (!data) throw new Error("NOT_FOUND");
    return data;
  }

  async listAdmin(resource, { limit = 50, offset = 0 } = {}) {
    const table = RESOURCE_TABLES[resource];
    if (!table) throw new Error("NOT_FOUND");
    const { data, error, count } = await this.serviceClient.from(table).select("*", { count: "exact" })
      .order("updated_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) throw new Error("DEPENDENCY_ERROR");
    return { items: data ?? [], total: count ?? 0, limit, offset };
  }

  async createContent(resource, payload) {
    const table = RESOURCE_TABLES[resource];
    const { data, error } = await this.serviceClient.from(table).insert(payload).select("*").single();
    if (error) throw mapDatabaseError(error);
    return data;
  }

  async updateContent(resource, id, payload) {
    const table = RESOURCE_TABLES[resource];
    const { data, error } = await this.serviceClient.from(table).update(payload).eq("id", id).select("*").maybeSingle();
    if (error) throw mapDatabaseError(error);
    if (!data) throw new Error("NOT_FOUND");
    return data;
  }

  async deleteContent(resource, id) {
    const table = RESOURCE_TABLES[resource];
    const { data, error } = await this.serviceClient.from(table).delete().eq("id", id).select("id").maybeSingle();
    if (error) throw new Error("DEPENDENCY_ERROR");
    if (!data) throw new Error("NOT_FOUND");
  }

  async setUserRole(userId, role) {
    const { data: userResult, error: userError } = await this.serviceClient.auth.admin.getUserById(userId);
    if (userError || !userResult?.user) throw new Error("NOT_FOUND");
    const { error } = await this.serviceClient.from("cms_user_roles").upsert({
      user_id: userId,
      role,
      updated_at: this.clock().toISOString()
    }, { onConflict: "user_id" });
    if (error) throw new Error("DEPENDENCY_ERROR");
  }

  async recordChatAnalytics({ category, outcome, model }) {
    const { error } = await this.serviceClient.from("cms_chatbot_analytics").insert({
      category,
      outcome,
      model
    });
    if (error) throw new Error("DEPENDENCY_ERROR");
  }
}

function mapDatabaseError(error) {
  if (error?.code === "23505") return new Error("CONFLICT");
  if (error?.code === "23503" || error?.code === "23514" || error?.code === "22P02") {
    return new Error("INVALID_INPUT");
  }
  return new Error("DEPENDENCY_ERROR");
}
