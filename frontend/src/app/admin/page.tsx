"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getCmsSupabase } from "@/lib/cms-supabase";

type Resource = "news" | "announcements" | "academic-agenda" | "hero-banners";
type CmsRole = "admin_it" | "editor_guru_staf";
type ContentItem = Record<string, unknown> & { id: string; title: string; is_published?: boolean };
type ChatAnalytics = {
  days: number;
  total: number;
  truncated: boolean;
  categories: Record<string, number>;
  outcomes: Record<string, number>;
  recent: { category: string; outcome: string; model: string | null; created_at: string }[];
};
type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url" | "datetime-local" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

const resources: { id: Resource; label: string; singular: string; icon: string; fields: Field[] }[] = [
  {
    id: "news", label: "Berita", singular: "berita", icon: "01",
    fields: [
      { key: "title", label: "Judul", required: true, placeholder: "Contoh: Siswa Raih Prestasi Nasional" },
      { key: "slug", label: "Slug URL", required: true, placeholder: "siswa-raih-prestasi-nasional" },
      { key: "excerpt", label: "Ringkasan", type: "textarea", placeholder: "Ringkasan singkat untuk kartu berita" },
      { key: "body", label: "Isi berita", type: "textarea", required: true, placeholder: "Tulis isi berita…" },
      { key: "cover_image_url", label: "URL gambar sampul", type: "url", placeholder: "https://…" },
      { key: "author_label", label: "Nama penulis", placeholder: "Humas SMKN 1 Jakarta" }
    ]
  },
  {
    id: "announcements", label: "Pengumuman", singular: "pengumuman", icon: "02",
    fields: [
      { key: "title", label: "Judul", required: true },
      { key: "slug", label: "Slug URL", required: true, placeholder: "penerimaan-peserta-didik-baru" },
      { key: "body", label: "Isi pengumuman", type: "textarea", required: true },
      { key: "severity", label: "Prioritas", type: "select", options: [
        { value: "info", label: "Informasi" }, { value: "important", label: "Penting" }, { value: "urgent", label: "Mendesak" }
      ] },
      { key: "starts_at", label: "Mulai ditampilkan", type: "datetime-local" },
      { key: "ends_at", label: "Berakhir", type: "datetime-local" }
    ]
  },
  {
    id: "academic-agenda", label: "Agenda akademik", singular: "agenda", icon: "03",
    fields: [
      { key: "title", label: "Nama kegiatan", required: true },
      { key: "slug", label: "Slug URL", required: true },
      { key: "description", label: "Deskripsi", type: "textarea" },
      { key: "starts_at", label: "Tanggal dan waktu mulai", type: "datetime-local", required: true },
      { key: "ends_at", label: "Tanggal dan waktu selesai", type: "datetime-local" },
      { key: "location", label: "Lokasi", placeholder: "Aula sekolah" }
    ]
  },
  {
    id: "hero-banners", label: "Hero banner", singular: "banner", icon: "04",
    fields: [
      { key: "title", label: "Judul banner", required: true },
      { key: "subtitle", label: "Subjudul", type: "textarea" },
      { key: "image_url", label: "URL gambar", type: "url", required: true, placeholder: "https://…" },
      { key: "link_url", label: "URL tujuan", type: "url", placeholder: "https://…" },
      { key: "display_order", label: "Urutan tampil", type: "number" }
    ]
  }
];

const navItems = [
  ...resources.map(({ id, label, icon }) => ({ id, label, icon })),
  { id: "analytics" as const, label: "Analitik chatbot", icon: "05" },
  { id: "users" as const, label: "Akses pengguna", icon: "06" }
];

const emptyByResource: Record<Resource, Record<string, string>> = {
  news: { title: "", slug: "", excerpt: "", body: "", cover_image_url: "", author_label: "" },
  announcements: { title: "", slug: "", body: "", severity: "info", starts_at: "", ends_at: "" },
  "academic-agenda": { title: "", slug: "", description: "", starts_at: "", ends_at: "", location: "" },
  "hero-banners": { title: "", subtitle: "", image_url: "", link_url: "", display_order: "0" }
};

function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("URL API CMS belum dikonfigurasi.");
  return `${base}${path}`;
}

async function cmsFetch(path: string, token: string, init: RequestInit = {}) {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error?.message ?? `Permintaan gagal (${response.status}).`;
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

function toInputDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toPayloadValue(field: Field, value: string): string | number | null {
  if (!value.trim()) return null;
  if (field.type === "datetime-local") return new Date(value).toISOString();
  if (field.type === "number") return Number(value);
  return value.trim();
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba kembali.";
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) return "Belum dijadwalkan";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(date);
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [configurationError, setConfigurationError] = useState("");
  const [accessState, setAccessState] = useState<"checking" | "allowed" | "denied">("checking");
  const [accessMessage, setAccessMessage] = useState("");
  const [role, setRole] = useState<CmsRole | null>(null);
  const [active, setActive] = useState<string>("news");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [itemsBusy, setItemsBusy] = useState(false);
  const [itemsError, setItemsError] = useState("");
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isPublished, setIsPublished] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [targetRole, setTargetRole] = useState<CmsRole>("editor_guru_staf");
  const [roleBusy, setRoleBusy] = useState(false);
  const [roleMessage, setRoleMessage] = useState("");
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null);
  const [analyticsBusy, setAnalyticsBusy] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    let supabase: ReturnType<typeof getCmsSupabase>;
    try {
      supabase = getCmsSupabase();
    } catch (error) {
      setConfigurationError(getErrorMessage(error));
      setAuthReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    }).catch((error) => {
      setConfigurationError(getErrorMessage(error));
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setAccessState("checking");
        setRole(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadAccess = useCallback(async (currentSession: Session) => {
    setAccessState("checking");
    setAccessMessage("");
    setRole(null);
    try {
      const result = await cmsFetch("/api/admin/me", currentSession.access_token);
      const currentRole = result?.data?.role;
      if (currentRole === "admin_it" || currentRole === "editor_guru_staf") {
        setRole(currentRole);
        setAccessState("allowed");
      } else {
        setAccessState("denied");
        setAccessMessage("Akun ini belum memiliki peran CMS. Hubungi administrator sekolah.");
      }
    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      setAccessState("denied");
      setAccessMessage(status === 401 || status === 403
        ? "Akun ini belum memiliki akses CMS. Pastikan peran akun sudah ditetapkan."
        : getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    if (session) void loadAccess(session);
  }, [session, loadAccess]);

  const resource = resources.find((entry) => entry.id === active);
  const activeNav = navItems.find((entry) => entry.id === active);

  const loadItems = useCallback(async () => {
    if (!session || !resource) return;
    setItemsBusy(true);
    setItemsError("");
    try {
      const result = await cmsFetch(`/api/admin/${resource.id}?limit=100&offset=0`, session.access_token);
      setItems(result?.data?.items ?? []);
    } catch (error) {
      setItemsError(getErrorMessage(error));
      setItems([]);
    } finally {
      setItemsBusy(false);
    }
  }, [session, resource]);

  useEffect(() => {
    if (accessState === "allowed" && resource) void loadItems();
  }, [accessState, resource, loadItems]);

  const loadAnalytics = useCallback(async () => {
    if (!session) return;
    setAnalyticsBusy(true);
    setAnalyticsError("");
    try {
      const result = await cmsFetch("/api/admin/analytics", session.access_token);
      setAnalytics(result?.data ?? null);
    } catch (error) {
      setAnalytics(null);
      setAnalyticsError(getErrorMessage(error));
    } finally {
      setAnalyticsBusy(false);
    }
  }, [session]);

  useEffect(() => {
    if (accessState === "allowed" && active === "analytics") void loadAnalytics();
  }, [accessState, active, loadAnalytics]);

  const counts = useMemo(() => ({
    total: items.length,
    published: items.filter((item) => item.is_published).length,
    drafts: items.filter((item) => !item.is_published).length
  }), [items]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setLoginBusy(true);
    try {
      const { data, error } = await getCmsSupabase().auth.signInWithPassword({
        email: loginEmail.trim(), password: loginPassword
      });
      if (error) throw error;
      setSession(data.session);
      setLoginPassword("");
    } catch (error) {
      setLoginError(getErrorMessage(error));
    } finally {
      setLoginBusy(false);
    }
  }

  async function signOut() {
    await getCmsSupabase().auth.signOut();
    setSession(null);
    setItems([]);
    setActive("news");
  }

  function navigateTo(section: string) {
    if (section !== active) {
      setValues({});
      setEditing(null);
      setIsPublished(false);
      setNotice("");
    }
    setActive(section);
  }

  function beginCreate() {
    if (!resource) return;
    setEditing(null);
    setValues({ ...emptyByResource[resource.id] });
    setIsPublished(false);
    setFormError("");
    setNotice("");
  }

  function beginEdit(item: ContentItem) {
    if (!resource) return;
    const nextValues = { ...emptyByResource[resource.id] };
    resource.fields.forEach((field) => {
      const value = item[field.key];
      nextValues[field.key] = field.type === "datetime-local"
        ? toInputDate(value)
        : value == null ? "" : String(value);
    });
    setEditing(item);
    setValues(nextValues);
    setIsPublished(Boolean(item.is_published));
    setFormError("");
    setNotice("");
  }

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !resource) return;
    setFormBusy(true);
    setFormError("");
    setNotice("");
    const payload: Record<string, unknown> = {};
    resource.fields.forEach((field) => {
      const value = toPayloadValue(field, values[field.key] ?? "");
      if (value !== null || field.required) payload[field.key] = value;
    });
    payload.is_published = isPublished;
    payload.published_at = isPublished
      ? editing?.published_at ?? new Date().toISOString()
      : null;
    try {
      const path = `/api/admin/${resource.id}${editing ? `/${editing.id}` : ""}`;
      await cmsFetch(path, session.access_token, {
        method: editing ? "PATCH" : "POST", body: JSON.stringify(payload)
      });
      setNotice(`${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} berhasil ${editing ? "diperbarui" : "disimpan"}.`);
      setEditing(null);
      setValues({});
      await loadItems();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setFormBusy(false);
    }
  }

  async function deleteContent(item: ContentItem) {
    if (!session || !resource || role !== "admin_it") return;
    if (!window.confirm(`Hapus "${item.title}" secara permanen? Tindakan ini tidak dapat dibatalkan.`)) return;
    setItemsError("");
    try {
      await cmsFetch(`/api/admin/${resource.id}/${item.id}`, session.access_token, { method: "DELETE" });
      if (editing?.id === item.id) setEditing(null);
      setNotice("Konten berhasil dihapus.");
      await loadItems();
    } catch (error) {
      setItemsError(getErrorMessage(error));
    }
  }

  async function assignRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || role !== "admin_it") return;
    setRoleBusy(true);
    setRoleMessage("");
    try {
      await cmsFetch(`/api/admin/users/${encodeURIComponent(targetUserId.trim())}/role`, session.access_token, {
        method: "PUT", body: JSON.stringify({ role: targetRole })
      });
      setRoleMessage("Peran berhasil diperbarui untuk akun Supabase tersebut.");
      setTargetUserId("");
    } catch (error) {
      setRoleMessage(getErrorMessage(error));
    } finally {
      setRoleBusy(false);
    }
  }

  if (!authReady) return <div className="cms-splash"><span className="cms-mark">S1</span><p>Menyiapkan CMS…</p></div>;

  if (!session) {
    return (
      <main className="cms-login">
        <section className="cms-login-story" aria-label="Informasi CMS">
          <div className="cms-login-top"><span className="cms-mark">S1</span><span>SMKN 1 JAKARTA <i>•</i> DIGITAL OFFICE</span></div>
          <div className="cms-story-copy">
            <p className="cms-eyebrow">PANEL PENGELOLAAN KONTEN</p>
            <h1>Ruang kerja<br /><em>sekolah.</em></h1>
            <p className="cms-story-description">Satu tempat untuk merawat kabar, agenda, dan cerita baik dari SMK Negeri 1 Jakarta.</p>
            <div className="cms-story-note"><span>✳</span><p>“Belajar, berkarya, berdampak.”<small>SMK Negeri 1 Jakarta</small></p></div>
          </div>
          <div className="cms-story-footer"><span>CMS SEKOLAH · 2026</span><span>01 / 01</span></div>
        </section>
        <section className="cms-login-panel">
          <div className="cms-login-card">
            <span className="cms-mobile-mark cms-mark">S1</span>
            <p className="cms-eyebrow">SELAMAT DATANG KEMBALI</p>
            <h2>Masuk ke CMS</h2>
            <p className="cms-muted">Gunakan akun sekolah yang telah diberikan akses CMS.</p>
            {configurationError && <div className="cms-alert cms-alert-error" role="alert">{configurationError} Atur variabel <code>NEXT_PUBLIC_CMS_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY</code>.</div>}
            <form className="cms-form cms-login-form" onSubmit={handleSignIn}>
              <label htmlFor="cms-email">Email sekolah</label>
              <input id="cms-email" type="email" autoComplete="username" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="nama@smkn1jakarta.sch.id" />
              <label htmlFor="cms-password">Kata sandi</label>
              <input id="cms-password" type="password" autoComplete="current-password" required value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Masukkan kata sandi" />
              {loginError && <p className="cms-inline-error" role="alert">{loginError}</p>}
              <button className="cms-button cms-button-primary cms-login-submit" disabled={loginBusy || Boolean(configurationError)} type="submit">
                {loginBusy ? "Memeriksa akses…" : "Masuk ke CMS"} <span aria-hidden="true">↗</span>
              </button>
            </form>
            <div className="cms-login-help"><span className="cms-lock" aria-hidden="true">⌑</span><p>Akses hanya untuk akun dengan peran CMS yang telah ditetapkan.<small>Belum memiliki akses? Hubungi administrator sekolah.</small></p></div>
            <a className="cms-back-link" href="/">← Kembali ke situs sekolah</a>
          </div>
          <span className="cms-login-copyright">© 2026 SMK NEGERI 1 JAKARTA</span>
        </section>
      </main>
    );
  }

  if (accessState === "checking") {
    return <div className="cms-splash"><span className="cms-mark">S1</span><p>Memverifikasi akses dengan server CMS…</p></div>;
  }

  if (accessState === "denied" || !role) {
    return (
      <main className="cms-denied">
        <div className="cms-denied-card">
          <span className="cms-denied-icon" aria-hidden="true">!</span>
          <p className="cms-eyebrow">AKSES BELUM TERSEDIA</p>
          <h1>Akun belum terdaftar</h1>
          <p>{accessMessage || "Akun ini belum mempunyai peran CMS."}</p>
          <div className="cms-denied-actions"><button className="cms-button cms-button-primary" onClick={() => session && void loadAccess(session)}>Coba lagi</button><button className="cms-button cms-button-quiet" onClick={() => void signOut()}>Keluar</button></div>
          <span className="cms-request-hint">Akses CMS dikelola oleh administrator sekolah.</span>
        </div>
      </main>
    );
  }

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <a className="cms-brand" href="/" aria-label="Kembali ke situs sekolah">
          <span className="cms-mark">S1</span><span className="cms-brand-label">SMKN 1 JAKARTA<small>CONTENT STUDIO</small></span>
        </a>
        <div className="cms-workspace-label">WORKSPACE <span>⌄</span></div>
        <nav className="cms-nav" aria-label="Navigasi pengelolaan">
          <p className="cms-nav-caption">KONTEN SEKOLAH</p>
          {navItems.slice(0, 4).map((item) => (
            <button key={item.id} className={`cms-nav-item ${active === item.id ? "is-active" : ""}`} onClick={() => navigateTo(item.id)}>
              <span className="cms-nav-icon">{item.icon}</span>{item.label}{active === item.id && <span className="cms-nav-dot" />}
            </button>
          ))}
          <p className="cms-nav-caption cms-nav-caption-lower">SISTEM</p>
          {navItems.slice(4).map((item) => (
            <button key={item.id} className={`cms-nav-item ${active === item.id ? "is-active" : ""}`} onClick={() => navigateTo(item.id)}>
              <span className="cms-nav-icon">{item.icon}</span>{item.label}{active === item.id && <span className="cms-nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="cms-sidebar-bottom">
          <div className="cms-sidebar-status"><span className="cms-status-dot" />CMS terhubung<small>Supabase Auth · API</small></div>
          <button className="cms-profile" onClick={() => void signOut()} aria-label="Keluar dari CMS">
            <span className="cms-avatar">{session.user.email?.slice(0, 1).toUpperCase() ?? "U"}</span>
            <span className="cms-profile-details">{session.user.email}<small>{role === "admin_it" ? "Administrator" : "Editor konten"}</small></span><span aria-hidden="true">↗</span>
          </button>
        </div>
      </aside>

      <main className="cms-main">
        <header className="cms-topbar">
          <div className="cms-breadcrumb"><span>Workspace</span><span>/</span><strong>{activeNav?.label}</strong></div>
          <div className="cms-topbar-right"><span className="cms-topbar-date">{new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}</span><span className="cms-topbar-avatar">{session.user.email?.slice(0, 1).toUpperCase()}</span></div>
        </header>
        <div className="cms-mobile-header"><a className="cms-brand" href="/"><span className="cms-mark">S1</span><span className="cms-brand-label">SMKN 1 JAKARTA<small>CONTENT STUDIO</small></span></a><button onClick={() => void signOut()}>Keluar ↗</button></div>
        <nav className="cms-mobile-nav" aria-label="Navigasi pengelolaan">
          {navItems.map((item) => <button key={item.id} className={active === item.id ? "is-active" : ""} onClick={() => navigateTo(item.id)}>{item.label}</button>)}
        </nav>
        <div className="cms-content">
          {resource ? (
            <>
              <div className="cms-page-heading">
                <div><p className="cms-eyebrow">PUSAT KONTEN <span> / </span> {resource.label.toUpperCase()}</p><h1>{resource.label}<span>.</span></h1><p>Atur dan perbarui konten yang tampil di situs sekolah.</p></div>
                <button className="cms-button cms-button-primary" onClick={beginCreate}><span aria-hidden="true">＋</span> Tulis {resource.singular}</button>
              </div>
              {notice && <div className="cms-alert cms-alert-success" role="status">{notice}</div>}
              <section className="cms-metrics" aria-label="Ringkasan konten">
                <div className="cms-metric-card"><span>SEMUA KONTEN</span><strong>{counts.total.toString().padStart(2, "0")}</strong><small>entri tersimpan</small></div>
                <div className="cms-metric-card"><span>DITERBITKAN</span><strong>{counts.published.toString().padStart(2, "0")}</strong><small><i className="cms-mini-dot" /> tampil di situs</small></div>
                <div className="cms-metric-card"><span>DRAF</span><strong>{counts.drafts.toString().padStart(2, "0")}</strong><small>belum dipublikasikan</small></div>
                <div className="cms-metric-aside"><span className="cms-spark" aria-hidden="true">↗</span><p>Konten yang baik<br /><em>berdampak.</em></p><small>Kelola dengan cermat.</small></div>
              </section>
              <section className="cms-workarea">
                <div className="cms-list-panel">
                  <div className="cms-section-head"><div><h2>Daftar {resource.label.toLowerCase()}</h2><p>{counts.total} konten di ruang kerja ini</p></div><button className="cms-button cms-button-outline cms-refresh" onClick={() => void loadItems()} disabled={itemsBusy} aria-label="Muat ulang daftar">↻</button></div>
                  {itemsError && <div className="cms-alert cms-alert-error" role="alert">{itemsError}</div>}
                  {itemsBusy ? <div className="cms-empty-state"><span className="cms-loader" />Memuat konten…</div>
                    : items.length === 0 ? <div className="cms-empty-state"><span className="cms-empty-icon">✳</span><strong>Belum ada {resource.singular}.</strong><span>Konten baru akan muncul di sini setelah disimpan.</span><button className="cms-button cms-button-outline" onClick={beginCreate}>Buat konten pertama</button></div>
                      : <div className="cms-item-list">{items.map((item) => (
                        <article className={`cms-content-item ${editing?.id === item.id ? "is-selected" : ""}`} key={item.id}>
                          <button className="cms-item-main" onClick={() => beginEdit(item)}>
                            <span className={`cms-item-thumb cms-thumb-${resource.id}`}>{resource.id === "hero-banners" && typeof item.image_url === "string" ? <img src={item.image_url} alt="" /> : <span>{resource.icon}</span>}</span>
                            <span className="cms-item-copy"><strong>{item.title}</strong><small>{typeof item.slug === "string" ? `/${item.slug}` : formatDate(item.starts_at)}</small></span>
                          </button>
                          <span className={`cms-badge ${item.is_published ? "is-published" : "is-draft"}`}><i />{item.is_published ? "Terbit" : "Draf"}</span>
                          <span className="cms-item-date">{formatDate(item.updated_at ?? item.created_at)}</span>
                          <button className="cms-icon-button" onClick={() => beginEdit(item)} aria-label={`Edit ${item.title}`}>↗</button>
                          {role === "admin_it" && <button className="cms-icon-button cms-delete-button" onClick={() => void deleteContent(item)} aria-label={`Hapus ${item.title}`}>×</button>}
                        </article>
                      ))}</div>}
                </div>

                <section className="cms-editor-panel" aria-label={editing ? "Edit konten" : `Buat ${resource.singular}`}>
                  <div className="cms-editor-heading"><div><span className="cms-editor-kicker">{editing ? "MENGUBAH KONTEN" : "KONTEN BARU"}</span><h2>{editing ? "Perbarui" : "Tulis"} {resource.singular}</h2></div><span className="cms-editor-stamp">S1 / CMS</span></div>
                  <form className="cms-form cms-editor-form" onSubmit={saveContent}>
                    {resource.fields.map((field) => (
                      <div className={`cms-field ${field.type === "textarea" ? "cms-field-wide" : ""}`} key={field.key}>
                        <label htmlFor={`field-${field.key}`}>{field.label}{field.required && <span> *</span>}</label>
                        {field.type === "textarea" ? <textarea id={`field-${field.key}`} required={field.required} value={values[field.key] ?? ""} onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))} rows={field.key === "body" || field.key === "description" ? 5 : 3} placeholder={field.placeholder} />
                          : field.type === "select" ? <select id={`field-${field.key}`} value={values[field.key] ?? ""} onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                            : <input id={`field-${field.key}`} type={field.type ?? "text"} required={field.required} value={values[field.key] ?? ""} onChange={(event) => {
                              const value = event.target.value;
                              setValues((prev) => ({ ...prev, [field.key]: value, ...(field.key === "title" && !editing && !prev.slug ? { slug: slugify(value) } : {}) }));
                            }} placeholder={field.placeholder} min={field.type === "number" ? 0 : undefined} />}
                      </div>
                    ))}
                    <div className="cms-publish-control">
                      <div><strong>{isPublished ? "Siap ditayangkan" : "Simpan sebagai draf"}</strong><small>{isPublished ? "Konten akan tersedia di situs publik." : "Konten hanya terlihat oleh pengelola CMS."}</small></div>
                      <button type="button" className={`cms-toggle ${isPublished ? "is-on" : ""}`} role="switch" aria-checked={isPublished} aria-label="Status publikasi" onClick={() => setIsPublished((published) => !published)}><span /></button>
                    </div>
                    {formError && <div className="cms-alert cms-alert-error" role="alert">{formError}</div>}
                    <div className="cms-form-actions"><button type="button" className="cms-button cms-button-quiet" onClick={beginCreate}>Bersihkan</button><button type="submit" className="cms-button cms-button-primary" disabled={formBusy}>{formBusy ? "Menyimpan…" : editing ? "Simpan perubahan" : "Simpan konten"} <span aria-hidden="true">↗</span></button></div>
                  </form>
                </section>
              </section>
              <footer className="cms-footer"><span>SMKN 1 JAKARTA <b>·</b> CONTENT STUDIO</span><span>CMS SEKOLAH <b>•</b> 2026</span></footer>
            </>
          ) : active === "users" ? (
            <section className="cms-system-page">
              <p className="cms-eyebrow">SISTEM <span> / </span> AKSES PENGGUNA</p><h1>Akses pengguna<span>.</span></h1><p className="cms-system-intro">Tetapkan peran CMS untuk pengguna yang sudah terdaftar di Supabase Auth.</p>
              {role === "admin_it" ? <div className="cms-role-card"><div className="cms-section-head"><div><h2>Tetapkan peran</h2><p>Gunakan UUID pengguna dari Supabase Auth.</p></div><span className="cms-admin-chip">ADMIN ONLY</span></div>
                <form className="cms-form cms-role-form" onSubmit={assignRole}><label htmlFor="target-user-id">ID pengguna (UUID)</label><input id="target-user-id" value={targetUserId} onChange={(event) => setTargetUserId(event.target.value)} required placeholder="00000000-0000-0000-0000-000000000000" /><label htmlFor="target-role">Peran</label><select id="target-role" value={targetRole} onChange={(event) => setTargetRole(event.target.value as CmsRole)}><option value="editor_guru_staf">Editor guru / staf</option><option value="admin_it">Administrator IT</option></select><p className="cms-form-note">Pengguna harus sudah dibuat melalui proses pendaftaran sekolah. Perubahan peran akun Anda sendiri ditolak oleh API.</p>{roleMessage && <div className={`cms-alert ${roleMessage.includes("berhasil") ? "cms-alert-success" : "cms-alert-error"}`} role="status">{roleMessage}</div>}<button className="cms-button cms-button-primary" disabled={roleBusy}>{roleBusy ? "Menyimpan…" : "Simpan peran"} <span aria-hidden="true">↗</span></button></form>
              </div> : <div className="cms-alert cms-alert-info">Pengaturan peran hanya tersedia untuk administrator IT. API tetap memeriksa peran pada setiap permintaan.</div>}
              <div className="cms-role-note"><strong>Peran CMS</strong><p><b>Administrator IT</b> dapat mengelola konten, menghapus konten, dan menetapkan peran. <b>Editor guru / staf</b> dapat membuat dan memperbarui konten.</p></div>
            </section>
          ) : (
            <section className="cms-system-page">
              <p className="cms-eyebrow">SISTEM <span> / </span> ANALITIK CHATBOT</p><h1>Analitik chatbot<span>.</span></h1><p className="cms-system-intro">Pantau kategori dan hasil percakapan tanpa menyimpan isi pesan pengunjung.</p>
              {analyticsError && <div className="cms-alert cms-alert-error" role="alert">{analyticsError}</div>}
              {analyticsBusy ? <div className="cms-empty-state"><span className="cms-loader" />Memuat analitik chatbot…</div>
                : analytics ? (
                  <>
                    <section className="cms-metrics" aria-label="Ringkasan chatbot">
                      <div className="cms-metric-card"><span>PERTANYAAN · 30 HARI</span><strong>{analytics.total.toString().padStart(2, "0")}</strong><small>{analytics.truncated ? "Data dibatasi 1.000 entri" : "Entri analitik anonim"}</small></div>
                      <div className="cms-metric-card"><span>TERJAWAB</span><strong>{(analytics.outcomes.resolved ?? 0).toString().padStart(2, "0")}</strong><small>Model utama</small></div>
                      <div className="cms-metric-card"><span>FALLBACK</span><strong>{(analytics.outcomes.fallback ?? 0).toString().padStart(2, "0")}</strong><small>Model alternatif</small></div>
                    </section>
                    <div className="cms-analytics-unavailable">
                      <span className="cms-analytics-icon" aria-hidden="true">↗</span>
                      <div>
                        <span className="cms-admin-chip">30 HARI TERAKHIR</span>
                        <h2>Kategori pertanyaan</h2>
                        {Object.keys(analytics.categories).length
                          ? <div className="cms-analytics-data">{Object.entries(analytics.categories).map(([category, count]) => <div key={category}><i>•</i>{category.replaceAll("_", " ")}<b>{count} pertanyaan</b></div>)}</div>
                          : <p>Belum ada pertanyaan yang tercatat pada periode ini.</p>}
                        <h2>Aktivitas terbaru</h2>
                        {analytics.recent.length
                          ? <div className="cms-analytics-data">{analytics.recent.map((entry, index) => <div key={`${entry.created_at}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i>{entry.category.replaceAll("_", " ")}<b>{entry.outcome} · {formatDate(entry.created_at)}</b></div>)}</div>
                          : <p>Belum ada aktivitas terbaru.</p>}
                      </div>
                    </div>
                    <p className="cms-analytics-footnote">Analitik tidak memuat isi pertanyaan, jawaban, identitas pengunjung, atau alamat IP.</p>
                  </>
                ) : <button className="cms-button cms-button-outline" onClick={() => void loadAnalytics()}>Coba muat analitik kembali</button>}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
