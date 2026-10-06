import { publicSections } from "@/lib/public-sections";

export const PUBLIC_NAVIGATION = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Program Keahlian" },
  { href: "/kesiswaan", label: "Kesiswaan" },
  { href: "/osis", label: "OSIS" },
  { href: "/informasi", label: "Berita & PPDB" },
  { href: "/kontak", label: "Hubungi Kami" }
] as const;

export const PUBLIC_KNOWLEDGE_ROUTES = [
  { path: "/", title: "Beranda", summary: "Profil, sejarah, program keahlian, PPDB, dan kontak SMK Negeri 1 Jakarta." },
  { path: "/tentang", title: "Profil dan program keahlian", section: "tentang" },
  { path: "/kegiatan", title: "Kegiatan dan prestasi", section: "kegiatan" },
  { path: "/kesiswaan", title: "Kesiswaan", section: "kesiswaan" },
  { path: "/osis", title: "Organisasi siswa", section: "kesiswaan" },
  { path: "/informasi", title: "Berita dan informasi", section: "informasi" },
  { path: "/ppdb", title: "SPMB / PPDB", section: "ppdb" },
  { path: "/kontak", title: "Kontak dan FAQ", section: "kontak" }
] as const;

// The page and the chatbot share this archived calendar so event names/dates cannot drift.
export const PUBLIC_ORGANIZATION_CALENDAR = [
  { date: "Okt – Nov 2024", title: "LDKS Taruna Tangguh", description: "Latihan Dasar Kepemimpinan Siswa" },
  { date: "Desember 2024", title: "Gelar Karya P5 & Bazar Kewirausahaan", description: "Pameran proyek rekayasa teknologi" },
  { date: "Februari 2025", title: "Bodoet Vocational Cup VII", description: "Pekan kompetisi futsal" },
  { date: "Mei – Juni 2025", title: "E-Piketos Raya & Musyawarah MPK", description: "Sidang umum laporan pertanggungjawaban" }
] as const;

export type PublicKnowledgeDocument = {
  title: string;
  content: string;
  path: string;
};

const stopWords = new Set([
  "ada", "adalah", "akan", "anda", "apa", "apakah", "bagaimana", "berapa", "di", "dan",
  "dari", "dengan", "ini", "itu", "ke", "kapan", "mana", "mengenai", "oleh", "pada",
  "untuk", "saya", "sekolah", "siapa", "tentang", "yang"
]);

function tokenize(text: string) {
  return text.toLocaleLowerCase("id").match(/[\p{L}\p{N}]+/gu)
    ?.filter((word) => word.length > 2 && !stopWords.has(word)) ?? [];
}

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
}

function createCatalog(): PublicKnowledgeDocument[] {
  const docs: PublicKnowledgeDocument[] = [];
  for (const route of PUBLIC_KNOWLEDGE_ROUTES) {
    const section = route.section ? publicSections[route.section] : undefined;
    docs.push({
      title: route.title,
      content: route.summary ?? section?.intro ?? `Informasi publik pada halaman ${route.title}.`,
      path: route.path
    });
    if (!section) continue;

    for (const block of section.blocks) {
      if (block.body) {
        docs.push({
          title: `${route.title} · ${block.title}`,
          content: plainText(block.body),
          path: route.path
        });
      }
      for (const card of block.cards ?? []) {
        docs.push({
          title: `${route.title} · ${block.title} · ${card.title}`,
          content: plainText([card.label, card.description, card.category, card.href].filter(Boolean).join(" · ")),
          path: route.path
        });
      }
    }
  }

  docs.push({
    title: "Navigasi situs publik",
    content: PUBLIC_NAVIGATION.map(({ label, href }) => `${label}: ${href}`).join(" · "),
    path: "/"
  });
  docs.push({
    title: "Kalender organisasi siswa (arsip 2024/2025)",
    content: `Kalender pada halaman /osis ditampilkan sebagai arsip masa bakti 2024/2025, bukan jadwal berjalan. ${PUBLIC_ORGANIZATION_CALENDAR
      .map((event) => `${event.date}: ${event.title} — ${event.description}`)
      .join(". ")} Status pada kalender halaman adalah catatan rencana/selesai historis dan perlu dikonfirmasi untuk informasi terkini.`,
    path: "/osis"
  });
  return docs;
}

const catalog = createCatalog();
const MAX_DOCUMENTS = 6;
const MAX_DOCUMENT_CHARS = 1_100;
const MAX_TOTAL_CHARS = 6_000;

/**
 * Select a small set of repository-backed public page facts for the backend.
 * No site URL is fetched, and admin routes/forms are not part of the catalog.
 */
export function retrievePublicKnowledge(question: string): PublicKnowledgeDocument[] {
  const terms = [...new Set(tokenize(question))];
  if (!terms.length) return [];

  const ranked = catalog.map((document) => {
    const searchable = `${document.title} ${document.content}`.slice(0, 5_000);
    const documentTerms = new Set(tokenize(searchable));
    const score = terms.reduce((sum, term) => sum + Number(documentTerms.has(term)), 0) +
      (searchable.toLocaleLowerCase("id").includes(question.toLocaleLowerCase("id")) ? 2 : 0);
    return { document, score };
  }).filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);

  const selected: PublicKnowledgeDocument[] = [];
  let total = 0;
  for (const { document } of ranked) {
    if (selected.length >= MAX_DOCUMENTS || total >= MAX_TOTAL_CHARS) break;
    const item = {
      title: document.title.slice(0, 200),
      content: document.content.slice(0, Math.min(MAX_DOCUMENT_CHARS, MAX_TOTAL_CHARS - total)),
      path: document.path
    };
    if (!item.content) continue;
    selected.push(item);
    total += item.title.length + item.content.length;
  }
  return selected;
}
