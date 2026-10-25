// Katalog statis halaman publik situs (profil, program keahlian, kesiswaan, SPMB, kontak/FAQ).
//
// Chatbot Wilhel sebelumnya hanya membaca 4 tabel CMS (berita, pengumuman, agenda, banner).
// Modul ini menambahkan isi halaman publik statis lain di situs (mis. /tentang, /ppdb, /kontak)
// ke dalam konteks yang dirangking oleh nlp.mjs, sehingga jawaban bisa mencakup SELURUH
// informasi publik di situs — namun tetap hanya dari isi ini, bukan pengetahuan umum lain.
//
// PENTING: konten di bawah ini harus disalin ulang (disinkronkan secara manual) setiap kali
// frontend/src/lib/public-sections.ts atau public-knowledge.ts berubah, karena backend dan
// frontend adalah dua layanan terpisah tanpa paket bersama.

const SCHOOL_ADDRESS =
  "Jl. Budi Utomo No. 7 RT.004 RW.008, Kel. Pasar Baru, Kec. Sawah Besar, Jakarta Pusat, DKI Jakarta 10710.";
const PENDING = "Belum tersedia pada sumber sekolah yang ditinjau.";
const ARCHIVED_PROGRAM_LABEL = "Arsip 2022/2023 · nama disesuaikan";

const PROGRAM_NAMES = [
  "Teknik Pemesinan (TP)",
  "Desain Gambar Mesin (DGM)",
  "Teknik Kendaraan Ringan (TKR)",
  "Teknik Instalasi Tenaga Listrik (TITL)",
  "Desain Pemodelan dan Informasi Bangunan (DPIB)",
  "Teknik Konstruksi dan Properti (TKP)",
  "Teknik Komputer dan Jaringan (TKJ)",
  "Sistem Informatika, Jaringan dan Aplikasi (SIJA), program 4 tahun",
  "Rekayasa Perangkat Lunak (RPL)",
  "Desain Komunikasi Visual (DKV)"
];

const PUBLIC_SECTIONS = {
  tentang: {
    intro: "Informasi identitas, visi dan misi, sejarah, serta kompetensi yang tercantum pada sumber resmi sekolah.",
    blocks: [
      {
        title: "Identitas sekolah",
        cards: [
          { title: "Nama sekolah", description: "SMK Negeri 1 Jakarta", label: "Identitas resmi" },
          { title: "NPSN", description: "20100143", label: "Identitas resmi" },
          { title: "NSS", description: "321016002004", label: "Identitas resmi" },
          { title: "NIS", description: "40056", label: "Identitas resmi" },
          { title: "Status", description: "Negeri", label: "Identitas sekolah" },
          { title: "Alamat", description: SCHOOL_ADDRESS, label: "Alamat sekolah" }
        ]
      },
      {
        title: "Visi, misi, dan motto",
        body: "Visi: \u201cMenjadikan SMK Negeri 1 Jakarta sebagai sekolah pilihan masyarakat dan sebagai pilar bagi dunia usaha dan dunia industri.\u201d",
        cards: [
          { title: "Misi 1", description: "Menerapkan Keterbukaan, Kemitraan dan Pelayanan prima." },
          { title: "Misi 2", description: "Mengembangkan Keunggulan Keterampilan, dan ketelitian dengan mengutamakan Kedisiplinan dan kejujuran yang dilandasi oleh jiwa dan semangat Keimanan, Kreatifitas, Kekeluargaan dan Kepedulian serta kasih sayang terhadap sesama dan lingkungan." },
          { title: "Misi 3", description: "Membangun dan membina jaringan kerjasama dengan dunia usaha dan industri Nasional dan Internasional serta masyarakat luas dalam mengembangkan standart lulusan." },
          { title: "Misi 4", description: "Mewujudkan SMK Negeri 1 Jakarta menjadi Sekolah Bertaraf Internasional." },
          { title: "Motto", description: "SMK NEGERI 1 JAKARTA MENJADI NOMOR SATU, PANUTAN, ACUAN, DAN TELADAN." }
        ]
      },
      {
        title: "Ringkasan sejarah sekolah",
        body: "Berikut ringkasan sejarah berdasarkan keterangan pada situs resmi SMK Negeri 1 Jakarta.",
        cards: [
          { title: "1906 · KWS", description: "Sekolah bermula dengan nama Koningin Wilhelmina School (KWS), menurut keterangan sejarah sekolah." },
          { title: "1946 · STM", description: "Setelah Indonesia merdeka, KWS berganti nama menjadi Sekolah Teknik Menengah (STM)." },
          { title: "1979 · STM Negeri 1", description: "Perubahan menjadi STM Negeri 1 disebut berdasarkan SK Mendikbud Nomor 090/O/1979 tanggal 26 Mei 1979." },
          { title: "1997 · SMK Negeri 1 Jakarta", description: "Nama SMK Negeri 1 Jakarta digunakan berdasarkan SK Mendikbud Nomor 0036/O/1997 tertanggal 7 Maret 1997." },
          { title: "Gedung bersejarah", description: "Situs sekolah menyebut gedung memiliki nilai sejarah dan termasuk aset cagar budaya daerah." }
        ]
      },
      {
        title: "Kompetensi keahlian",
        body: "Daftar berikut berasal dari arsip tahun ajaran 2022/2023 dan bukan konfirmasi pembukaan tahun ini. Portal SPMB DKI 2026/2027 mencatat SMK Negeri 1 memiliki 10 kompetensi, tetapi nama-nama final yang dibuka tahun ajaran tersebut perlu diperiksa langsung pada portal resmi atau dikonfirmasi sekolah. Informasi masa belajar, materi, praktik, fasilitas, sertifikasi, dan peluang lulusan menunggu keterangan ketua program keahlian.",
        cards: PROGRAM_NAMES.map((title) => ({
          title,
          description: "Nama kompetensi sebagaimana tercantum pada sumber sekolah.",
          label: ARCHIVED_PROGRAM_LABEL
        }))
      },
      { title: "Fasilitas", body: PENDING },
      { title: "Pendidik dan tenaga kependidikan", body: PENDING },
      {
        title: "Informasi siswa",
        body: "Jumlah siswa, karya, dan cerita siswa tidak ditampilkan karena belum ditemukan data terverifikasi beserta tanggal pemutakhirannya."
      }
    ]
  },
  kegiatan: {
    intro: "Catatan prestasi berikut berasal dari arsip prestasi pada situs resmi. Tahun pada setiap catatan menunjukkan periode capaian, bukan prestasi terbaru.",
    blocks: [
      {
        title: "Arsip prestasi",
        cards: [
          { title: "Penerimaan siswa ke perguruan tinggi", description: "31 siswa/i diterima melalui SNMPTN 2022; 3 siswa/i melalui SMPTN (Politeknik) 2022; dan 15 siswa/i melalui SBMPTN.", label: "Arsip 2022 · Akademik" },
          { title: "CNC Milling", description: "Juara 1 tingkat Provinsi; Juara 7 tingkat Nasional (sumber menulis \u201cCNC Miling\u201d untuk hasil tingkat Nasional).", label: "Arsip 2022 · Non-akademik" },
          { title: "CNC Milling", description: "Juara 1 tingkat Provinsi dan Juara 5 tingkat Nasional.", label: "Arsip 2020 · Non-akademik" },
          { title: "Penerimaan siswa ke perguruan tinggi", description: "5 siswa/i diterima di perguruan tinggi melalui jalur SNMPTN.", label: "Arsip 2017 · Akademik" },
          { title: "Plumbing and Heating", description: "Juara 1 tingkat Nasional dan Juara 1 tingkat Provinsi.", label: "Arsip 2017 · Non-akademik" },
          { title: "IT Network System Administrasi", description: "Juara 1 tingkat Nasional dan Juara 1 tingkat Provinsi.", label: "Arsip 2016 · Non-akademik" },
          { title: "IT Networking", description: "Juara 6 tingkat Nasional di Tangerang.", label: "Arsip 2015 · Non-akademik" },
          { title: "IT Networking", description: "Juara 6 tingkat Nasional di Palembang.", label: "Arsip 2014 · Non-akademik" }
        ]
      },
      {
        title: "Kegiatan dan agenda",
        body: "Agenda mendatang dan kegiatan sekolah hanya ditampilkan apabila tanggal serta informasinya sudah diterbitkan melalui CMS sekolah."
      }
    ]
  },
  kesiswaan: {
    intro: "Kanal resmi sekolah dapat diikuti untuk informasi kegiatan siswa yang dipublikasikan.",
    blocks: [
      { title: "Organisasi siswa", body: PENDING },
      { title: "Ekstrakurikuler", body: PENDING },
      {
        title: "Prestasi siswa",
        body: "Prestasi yang tercatat pada sumber resmi ditampilkan pada halaman arsip prestasi.",
        cards: [
          { title: "Lihat arsip prestasi", description: "Catatan dilengkapi tahun dan tingkat kompetisi sesuai informasi sumber." }
        ]
      }
    ]
  },
  informasi: {
    intro: "Berita, pengumuman, dan agenda yang diterbitkan pengelola sekolah ditampilkan dari CMS sekolah.",
    blocks: [
      {
        title: "Arsip berita situs resmi",
        body: "Berita berikut berasal dari situs resmi dan ditampilkan sebagai arsip. Tanggalnya bukan penanda kegiatan terkini.",
        cards: [
          { title: "Kiat Untuk Pendidik Berdasarkan Arahan Rasulullah", description: "Artikel membahas teladan akhlak dan sikap dalam proses belajar mengajar, dirangkum dari buku karya Dr. Ahmad Irfan.", label: "Arsip · 15 Maret 2025" },
          { title: "SMKN 1 JUARA UMUM Pramuka Penegak Kwarcab Tingkat Kota Administrasi Jakarta Pusat", description: "Berita tentang Lomba Kreativitas Penegak yang berlangsung pada 28 September 2024 di Kantor Pemerintahan Kota Administrasi Jakarta Pusat.", label: "Arsip · 1 Oktober 2024" },
          { title: "SISWA SMKN 1 JAKARTA BERPRESTASI PADA LKS KE -32 DI LAMPUNG", description: "Berita sekolah mengenai prestasi siswa pada Lomba Keterampilan Siswa ke-32 di Lampung.", label: "Arsip · 26 Agustus 2024" }
        ]
      }
    ]
  },
  ppdb: {
    intro: "SPMB SMK Negeri 1 Jakarta mengikuti kebijakan dan jadwal Pemerintah Provinsi DKI Jakarta. Periksa persyaratan, jalur, kuota, dan pengumuman melalui portal resmi untuk tahun ajaran berjalan.",
    blocks: [
      {
        title: "Langkah umum",
        body: "Ikuti hanya petunjuk dan jadwal yang diumumkan melalui kanal resmi sekolah atau penyelenggara penerimaan.",
        cards: [
          { title: "Pantau pengumuman resmi", description: "Periksa jadwal dan ketentuan pada kanal resmi sebelum menyiapkan pendaftaran.", label: "Langkah 1 · Panduan umum" },
          { title: "Periksa daftar persyaratan", description: "Daftar dokumen resmi belum dipublikasikan di halaman ini. Jangan menganggap daftar dari sumber lain sebagai persyaratan sekolah.", label: "Langkah 2 · Menunggu verifikasi" },
          { title: "Ikuti kanal pendaftaran yang diumumkan", description: "Tautan dan tata cara pendaftaran resmi belum tersedia. Hindari mengirim dokumen melalui kanal yang belum dikonfirmasi.", label: "Langkah 3 · Menunggu informasi resmi" },
          { title: "Periksa hasil melalui kanal resmi", description: "Waktu dan cara pengumuman hasil seleksi belum dikonfirmasi.", label: "Langkah 4 · Menunggu informasi resmi" }
        ]
      },
      { title: "Persyaratan dan dokumen", body: `Daftar dokumen yang diperlukan belum dicantumkan karena persyaratan resmi belum diverifikasi. ${PENDING}` },
      {
        title: "Portal resmi SPMB DKI Jakarta 2026/2027",
        body: "Portal pemerintah mencantumkan SMK Negeri 1 Jakarta dengan 10 kompetensi. Periksa informasi terbaru di portal sebelum mendaftar.",
        cards: [{ title: "SPMB DKI Jakarta", description: "Lihat pagu, kompetensi, jalur, dan pengumuman resmi.", label: "Tahun ajaran 2026/2027" }]
      },
      { title: "Hasil seleksi", body: `Hasil seleksi, jadwal pengumuman, dan tautan pemeriksaan belum tersedia. ${PENDING}` }
    ]
  },
  kontak: {
    intro: "Alamat dan kanal kontak berikut tercantum pada halaman Identitas Sekolah.",
    blocks: [
      {
        title: "Informasi kontak",
        cards: [
          { title: "Alamat", description: SCHOOL_ADDRESS, label: "Alamat sekolah" },
          { title: "Telepon", description: "(021) 381-3630", label: "Telepon sekolah" },
          { title: "Telepon alternatif", description: "(021) 350-4091", label: "Nomor pada halaman Identitas Sekolah" },
          { title: "Email", description: "smkn1jakarta@gmail.com", label: "Email sekolah" }
        ]
      },
      {
        title: "Alamat sekolah",
        body: "Alamat berikut tercantum pada halaman Identitas Sekolah.",
        cards: [{ title: "Jl. Budi Utomo No. 7", description: SCHOOL_ADDRESS, label: "Pasar Baru · Sawah Besar · Jakarta Pusat" }]
      },
      {
        title: "Pertanyaan yang sering diajukan",
        cards: [
          { title: "Bagaimana cara memperoleh informasi PPDB?", description: "Ikuti pengumuman di kanal resmi sekolah atau penyelenggara penerimaan." },
          { title: "Apa saja program keahlian yang tersedia?", description: "Daftar pada halaman ini merujuk arsip kompetensi tahun ajaran 2022/2023 dengan sejumlah perubahan nama terbaru. Status program untuk tahun berjalan belum dapat dipastikan." },
          { title: "Bagaimana cara menghubungi sekolah?", description: "Hubungi sekolah melalui nomor telepon atau email yang tercantum pada halaman ini." }
        ]
      }
    ]
  }
};

const PUBLIC_NAVIGATION = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Program Studi" },
  { href: "/informasi", label: "Berita" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/agenda", label: "Agenda" },
  { href: "/organisasi", label: "Organisasi" },
  { href: "/galeri", label: "Galeri" }
];

const PUBLIC_KNOWLEDGE_ROUTES = [
  { path: "/", title: "Beranda", summary: "Profil, sejarah, program keahlian, PPDB, dan kontak SMK Negeri 1 Jakarta." },
  { path: "/tentang", title: "Profil dan program keahlian", section: "tentang" },
  { path: "/kegiatan", title: "Kegiatan dan prestasi", section: "kegiatan" },
  { path: "/kesiswaan", title: "Kesiswaan", section: "kesiswaan" },
  { path: "/osis", title: "Organisasi siswa", section: "kesiswaan" },
  { path: "/informasi", title: "Berita dan informasi", section: "informasi" },
  { path: "/ppdb", title: "SPMB / PPDB", section: "ppdb" },
  { path: "/kontak", title: "Kontak dan FAQ", section: "kontak" }
];

const PUBLIC_ORGANIZATION_CALENDAR = [
  { date: "Okt – Nov 2024", title: "LDKS Taruna Tangguh", description: "Latihan Dasar Kepemimpinan Siswa" },
  { date: "Desember 2024", title: "Gelar Karya P5 & Bazar Kewirausahaan", description: "Pameran proyek rekayasa teknologi" },
  { date: "Februari 2025", title: "Bodoet Vocational Cup VII", description: "Pekan kompetisi futsal" },
  { date: "Mei – Juni 2025", title: "E-Piketos Raya & Musyawarah MPK", description: "Sidang umum laporan pertanggungjawaban" }
];

function plainText(value) {
  return typeof value === "string"
    ? value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"")
      .replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim()
    : "";
}

function buildCatalog() {
  const docs = [];
  for (const route of PUBLIC_KNOWLEDGE_ROUTES) {
    const section = route.section ? PUBLIC_SECTIONS[route.section] : undefined;
    docs.push({
      resource: "public-page",
      slug: route.path,
      title: route.title,
      body: route.summary ?? section?.intro ?? `Informasi publik pada halaman ${route.title}.`
    });
    if (!section) continue;

    for (const block of section.blocks) {
      if (block.body) {
        docs.push({
          resource: "public-page",
          slug: route.path,
          title: `${route.title} · ${block.title}`,
          body: plainText(block.body)
        });
      }
      for (const card of block.cards ?? []) {
        docs.push({
          resource: "public-page",
          slug: route.path,
          title: `${route.title} · ${block.title} · ${card.title}`,
          body: plainText([card.label, card.description, card.category].filter(Boolean).join(" · "))
        });
      }
    }
  }

  docs.push({
    resource: "public-page",
    slug: "/",
    title: "Navigasi situs publik",
    body: PUBLIC_NAVIGATION.map(({ label, href }) => `${label}: ${href}`).join(" · ")
  });
  docs.push({
    resource: "public-page",
    slug: "/osis",
    title: "Kalender organisasi siswa (arsip 2024/2025)",
    body: `Kalender pada halaman /osis ditampilkan sebagai arsip masa bakti 2024/2025, bukan jadwal berjalan. ${PUBLIC_ORGANIZATION_CALENDAR
      .map((event) => `${event.date}: ${event.title} — ${event.description}`)
      .join(". ")} Status pada kalender halaman adalah catatan rencana/selesai historis dan perlu dikonfirmasi untuk informasi terkini.`
  });
  return docs;
}

const STATIC_PUBLIC_KNOWLEDGE = buildCatalog();

// Dipanggil oleh chat.mjs untuk digabung dengan konten CMS sebelum dirangking oleh nlp.mjs.
export function getStaticPublicKnowledge() {
  return STATIC_PUBLIC_KNOWLEDGE;
}
