// Tahap NLP chatbot Wilhel.
//
// Modul ini berjalan lokal (tanpa pemanggilan jaringan) dan deterministik. Outputnya
// (intent, entitas, keyword, rujukan dokumen, dan konteks terpilih) disimpan ke database
// oleh service layer; LLM kemudian mengambil hasil tersebut dari database.
// Teks mentah pertanyaan sengaja TIDAK menjadi bagian dari output.

export const NLP_VERSION = "wilhel-nlp-1";
export const INTENTS = [
  "academic_agenda", "announcement", "news", "academic_program", "school_profile", "other"
];

export const MAX_CONTEXT_CHARS = 7_000;
const MAX_DOCUMENTS = 5;
const MAX_DOCUMENT_CHARS = 1_600;
const MAX_KEYWORDS = 30;
const MAX_ENTITY_VALUES = 10;

const STOP_WORDS = new Set([
  "ada", "adalah", "akan", "anda", "apa", "apakah", "bagaimana", "berapa", "di", "dan",
  "dari", "dengan", "hari", "ini", "itu", "jadi", "ke", "kapan", "karena", "mana", "mau",
  "mengenai", "menurut", "oleh", "pada", "untuk", "saya", "sekolah", "siapa", "tentang",
  "terkait", "yang", "the", "what", "when", "where", "who", "how", "is", "are", "do"
]);

const RELATED_TERMS = [
  ["agenda", "jadwal", "kalender", "kegiatan", "acara"],
  ["pengumuman", "informasi", "info"],
  ["berita", "prestasi", "artikel", "kabar"],
  ["program", "jurusan", "keahlian", "kompetensi"]
];

// Bobot leksikon per intent. Urutan kunci menjadi tie-breaker (agenda lebih diutamakan).
const INTENT_LEXICON = {
  academic_agenda: {
    agenda: 3, jadwal: 3, kalender: 3, kegiatan: 2, acara: 2, ujian: 2, asesmen: 2,
    libur: 2, tanggal: 1, pelaksanaan: 1, kapan: 1
  },
  announcement: {
    pengumuman: 4, announcement: 4, "informasi terbaru": 4, edaran: 2, himbauan: 2,
    terbaru: 1, penting: 1, info: 1
  },
  news: {
    berita: 4, prestasi: 3, artikel: 3, kabar: 3, juara: 2, lomba: 2, penghargaan: 2, raih: 1
  },
  academic_program: {
    jurusan: 4, keahlian: 3, kompetensi: 3, kurikulum: 3, program: 2, prodi: 3,
    tkj: 3, rpl: 3, tkr: 3, toi: 3, pendaftaran: 2, ppdb: 2, spmb: 2, belajar: 1
  },
  school_profile: {
    alamat: 4, kontak: 4, telepon: 3, email: 3, lokasi: 3, visi: 3, misi: 3, profil: 3,
    sejarah: 3, fasilitas: 2, kepala: 2, sekolah: 1
  }
};

const WEEKDAYS = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
const MONTHS = [
  "januari", "februari", "maret", "april", "mei", "juni",
  "juli", "agustus", "september", "oktober", "november", "desember"
];
const PROGRAMS = [
  { code: "tkj", patterns: [/\btkj\b/, /teknik komputer (?:dan )?jaringan/] },
  { code: "rpl", patterns: [/\brpl\b/, /rekayasa perangkat lunak/] },
  { code: "tkr", patterns: [/\btkr\b/, /teknik kendaraan ringan/] },
  { code: "toi", patterns: [/\btoi\b/, /teknik otomasi industri/] }
];

export function tokenize(text) {
  return (text.toLocaleLowerCase("id").match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export function plainText(value) {
  return typeof value === "string"
    ? value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"")
      .replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim()
    : "";
}

// Stemmer ringan bahasa Indonesia, hanya dipakai untuk mencocokkan leksikon intent.
function stem(word) {
  let result = word.replace(/(?:lah|kah|nya|pun)$/, "");
  result = result.replace(/^(?:meng|meny|men|mem|me|peng|pen|pem|per|ber|ter|di|ke|se)/, "");
  result = result.replace(/(?:kan|an|i)$/, "");
  return result.length >= 4 ? result : word;
}

function unique(values, max = MAX_ENTITY_VALUES) {
  return [...new Set(values)].slice(0, max);
}

export function classifyIntent(question) {
  const text = question.toLocaleLowerCase("id");
  const tokens = tokenize(question);
  const forms = new Set([...tokens, ...tokens.map(stem)]);
  const scores = Object.entries(INTENT_LEXICON).map(([intent, lexicon]) => {
    let score = 0;
    for (const [term, weight] of Object.entries(lexicon)) {
      const hit = term.includes(" ") ? text.includes(term) : forms.has(term);
      if (hit) score += weight;
    }
    return { intent, score };
  });
  const total = scores.reduce((sum, entry) => sum + entry.score, 0);
  const best = scores.reduce((top, entry) => (entry.score > top.score ? entry : top), { intent: "other", score: 0 });
  if (!best.score) return { intent: "other", confidence: 0 };
  const confidence = (best.score / total) * Math.min(1, best.score / 4);
  return { intent: best.intent, confidence: Math.round(confidence * 1_000) / 1_000 };
}

export function extractEntities(question) {
  const text = question.toLocaleLowerCase("id");
  const relative = unique([
    ...(text.match(/\b(?:hari ini|besok|lusa|kemarin)\b/g) ?? []),
    ...(text.match(/\b(?:minggu|bulan|tahun) (?:depan|ini|lalu)\b/g) ?? []),
    ...(text.match(/\btahun ajaran\b/g) ?? [])
  ]);
  const withoutRelativeWeek = text.replace(/\bminggu (?:depan|ini|lalu)\b/g, " ");
  const weekdays = unique(WEEKDAYS.filter((day) => new RegExp(`\\b${day}\\b`).test(withoutRelativeWeek))
    .concat(/\bjum'at\b/.test(text) ? ["jumat"] : []));
  const months = unique(MONTHS.filter((month) => new RegExp(`\\b${month}\\b`).test(text)));
  const dates = unique([
    ...(text.match(new RegExp(`\\b\\d{1,2}\\s+(?:${MONTHS.join("|")})(?:\\s+\\d{4})?\\b`, "g")) ?? []),
    ...(text.match(/\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/g) ?? [])
  ]);
  const years = unique(text.match(/\b20\d{2}\b/g) ?? []);
  const programs = PROGRAMS.filter(({ patterns }) => patterns.some((pattern) => pattern.test(text)))
    .map(({ code }) => code);
  return { programs, weekdays, months, dates, years, relative };
}

export function extractKeywords(question) {
  const questionTerms = tokenize(question);
  const expandedTerms = RELATED_TERMS.flatMap((group) =>
    group.some((term) => questionTerms.includes(term)) ? group : []
  );
  return [...new Set([...questionTerms, ...expandedTerms])].slice(0, MAX_KEYWORDS);
}

function documentText(item) {
  return [
    item.title, item.slug, item.excerpt, item.body, item.description, item.subtitle,
    item.severity, item.starts_at, item.ends_at, item.location
  ].map(plainText).filter(Boolean).join(" ");
}

function buildExcerpt(item, terms) {
  const metadata = [
    item.title, item.published_at, item.starts_at, item.ends_at, item.location, item.severity
  ].map(plainText).filter(Boolean).join(" · ");
  const passages = [item.excerpt, item.description, item.subtitle, item.body]
    .map(plainText).filter(Boolean)
    .flatMap((value) => value.split(/(?<=[.!?])\s+|\n+/).map((text) => text.trim()).filter(Boolean))
    .map((text) => {
      const passageTerms = new Set(tokenize(text));
      return {
        text,
        score: terms.reduce((count, term) => count + Number(passageTerms.has(term)), 0)
      };
    })
    .sort((left, right) => right.score - left.score);
  const selected = [];
  let length = metadata.length;
  for (const passage of passages) {
    if (selected.length >= 3 || (selected.length && passage.score === 0)) break;
    const remaining = MAX_DOCUMENT_CHARS - length - (selected.length ? 1 : 2);
    if (remaining <= 0) break;
    const excerpt = passage.text.slice(0, remaining);
    selected.push(excerpt);
    length += excerpt.length + 2;
  }
  return [metadata, ...selected].filter(Boolean).join(": ");
}

const RESOURCE_LABELS = {
  news: "BERITA",
  announcements: "PENGUMUMAN",
  "academic-agenda": "AGENDA",
  "hero-banners": "BANNER"
};

// Meranking konten terbit terhadap keyword dan membangun konteks terbatas + rujukan dokumen.
export function rankPublishedContent(question, items, keywords = extractKeywords(question)) {
  if (!keywords.length || !Array.isArray(items)) return { context: "", refs: [] };
  const normalizedQuestion = keywords.join(" ");
  const ranked = items.map((item) => {
    const text = documentText(item).slice(0, 12_000);
    const normalizedText = text.toLocaleLowerCase("id");
    const documentTerms = new Set(tokenize(text));
    const overlap = keywords.reduce((count, term) => count + Number(documentTerms.has(term)), 0);
    const phraseBonus = normalizedText.includes(normalizedQuestion) ? 2 : 0;
    return { item, score: overlap + phraseBonus };
  }).filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  let context = "";
  const refs = [];
  for (const { item, score } of ranked.slice(0, MAX_DOCUMENTS)) {
    const entry = `[${RESOURCE_LABELS[item.resource] ?? "KONTEN"}] ${buildExcerpt(item, keywords)}`;
    const separator = context ? "\n\n" : "";
    const remaining = MAX_CONTEXT_CHARS - context.length - separator.length;
    if (remaining <= 0) break;
    context += separator + entry.slice(0, remaining);
    refs.push({
      resource: item.resource ?? "unknown",
      slug: typeof item.slug === "string" ? item.slug : null,
      title: plainText(item.title).slice(0, 200),
      score
    });
  }
  return { context, refs };
}

export function retrieveRelevantContent(question, items) {
  return rankPublishedContent(question, items).context;
}

// Pipeline NLP penuh. Hasilnya siap disimpan ke tabel cms_chatbot_nlp_results.
export function analyzeQuestion(question, publishedItems) {
  const { intent, confidence } = classifyIntent(question);
  const keywords = extractKeywords(question);
  const entities = extractEntities(question);
  const { context, refs } = rankPublishedContent(question, publishedItems, keywords);
  return {
    intent,
    confidence,
    keywords,
    entities,
    matched_refs: refs,
    context,
    nlp_version: NLP_VERSION
  };
}
