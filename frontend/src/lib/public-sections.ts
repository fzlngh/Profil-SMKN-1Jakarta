export type PublicCard = {
  title: string;
  description: string;
  category?: string;
  label?: string;
  href?: string;
};

export type PublicBlock = {
  id: string;
  title: string;
  body?: string;
  categories?: string[];
  cards?: PublicCard[];
  sourceUrl?: string;
  sourceLabel?: string;
};

export type PublicSectionData = {
  eyebrow: string;
  title: string;
  intro: string;
  blocks: PublicBlock[];
  contactForm?: boolean;
};

const pending = "Belum tersedia pada sumber sekolah yang ditinjau.";
const schoolAddress = "Jl. Budi Utomo No. 7 RT.004 RW.008, Kel. Pasar Baru, Kec. Sawah Besar, Jakarta Pusat, DKI Jakarta 10710.";
const archivedProgramLabel = "Arsip 2022/2023 · nama disesuaikan";

export const publicSections: Record<string, PublicSectionData> = {
  tentang: {
    eyebrow: "PROFIL SEKOLAH",
    title: "Mengenal SMK Negeri 1 Jakarta",
    intro: "Informasi identitas, visi dan misi, sejarah, serta kompetensi yang tercantum pada sumber resmi sekolah.",
    blocks: [
      {
        id: "identitas",
        title: "Identitas sekolah",
        sourceUrl: "https://smkn1jakarta.sch.id/identitas-sekolah/",
        sourceLabel: "Halaman Identitas Sekolah",
        cards: [
          { title: "Nama sekolah", description: "SMK Negeri 1 Jakarta", label: "Identitas resmi" },
          { title: "NPSN", description: "20100143", label: "Identitas resmi" },
          { title: "NSS", description: "321016002004", label: "Identitas resmi" },
          { title: "NIS", description: "40056", label: "Identitas resmi" },
          { title: "Status", description: "Negeri", label: "Identitas sekolah" },
          { title: "Alamat", description: schoolAddress, label: "Alamat sekolah" }
        ]
      },
      {
        id: "visi-misi",
        title: "Visi, misi, dan motto",
        sourceUrl: "https://smkn1jakarta.sch.id/visi-dan-misi/",
        sourceLabel: "Halaman Visi dan Misi",
        body: "Visi: “Menjadikan SMK Negeri 1 Jakarta sebagai sekolah pilihan masyarakat dan sebagai pilar bagi dunia usaha dan dunia industri.”",
        cards: [
          { title: "Misi 1", description: "Menerapkan Keterbukaan, Kemitraan dan Pelayanan prima." },
          { title: "Misi 2", description: "Mengembangkan Keunggulan Keterampilan, dan ketelitian dengan mengutamakan Kedisiplinan dan kejujuran yang dilandasi oleh jiwa dan semangat Keimanan, Kreatifitas, Kekeluargaan dan Kepedulian serta kasih sayang terhadap sesama dan lingkungan." },
          { title: "Misi 3", description: "Membangun dan membina jaringan kerjasama dengan dunia usaha dan industri Nasional dan Internasional serta masyarakat luas dalam mengembangkan standart lulusan." },
          { title: "Misi 4", description: "Mewujudkan SMK Negeri 1 Jakarta menjadi Sekolah Bertaraf Internasional." },
          { title: "Motto", description: "SMK NEGERI 1 JAKARTA MENJADI NOMOR SATU, PANUTAN, ACUAN, DAN TELADAN." }
        ]
      },
      {
        id: "sejarah",
        title: "Ringkasan sejarah sekolah",
        sourceUrl: "https://smkn1jakarta.sch.id/sejarah/",
        sourceLabel: "Halaman Sejarah",
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
        id: "program",
        title: "Kompetensi keahlian",
        sourceUrl: "https://smkn1jakarta.sch.id/identitas-sekolah/",
        sourceLabel: "Halaman Identitas Sekolah",
        body: "Daftar berikut berasal dari arsip tahun ajaran 2022/2023 dan bukan konfirmasi pembukaan tahun ini. Portal SPMB DKI 2026/2027 mencatat SMK Negeri 1 memiliki 10 kompetensi, tetapi nama-nama final yang dibuka tahun ajaran tersebut perlu diperiksa langsung pada portal resmi atau dikonfirmasi sekolah. Informasi masa belajar, materi, praktik, fasilitas, sertifikasi, dan peluang lulusan menunggu keterangan ketua program keahlian.",
        cards: [
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
        ].map((title) => ({ title, description: "Nama kompetensi sebagaimana tercantum pada sumber sekolah.", label: archivedProgramLabel }))
      },
      {
        id: "fasilitas",
        title: "Fasilitas",
        body: pending
      },
      {
        id: "pendidik",
        title: "Pendidik dan tenaga kependidikan",
        body: pending
      },
      {
        id: "siswa",
        title: "Informasi siswa",
        body: "Jumlah siswa, karya, dan cerita siswa tidak ditampilkan karena belum ditemukan data terverifikasi beserta tanggal pemutakhirannya."
      }
    ]
  },
  kegiatan: {
    eyebrow: "ARSIP KEGIATAN & PRESTASI",
    title: "Prestasi sekolah",
    intro: "Catatan prestasi berikut berasal dari arsip prestasi pada situs resmi. Tahun pada setiap catatan menunjukkan periode capaian, bukan prestasi terbaru.",
    blocks: [
      {
        id: "prestasi",
        title: "Arsip prestasi",
        sourceUrl: "https://smkn1jakarta.sch.id/prestasi/",
        sourceLabel: "Halaman Prestasi",
        categories: ["Semua", "Akademik", "Non-akademik"],
        cards: [
          {
            category: "Akademik",
            title: "Penerimaan siswa ke perguruan tinggi",
            description: "31 siswa/i diterima melalui SNMPTN 2022; 3 siswa/i melalui SMPTN (Politeknik) 2022; dan 15 siswa/i melalui SBMPTN.",
            label: "Arsip 2022 · Akademik"
          },
          {
            category: "Non-akademik",
            title: "CNC Milling",
            description: "Juara 1 tingkat Provinsi; Juara 7 tingkat Nasional (sumber menulis “CNC Miling” untuk hasil tingkat Nasional).",
            label: "Arsip 2022 · Non-akademik"
          },
          {
            category: "Non-akademik",
            title: "CNC Milling",
            description: "Juara 1 tingkat Provinsi dan Juara 5 tingkat Nasional.",
            label: "Arsip 2020 · Non-akademik"
          },
          {
            category: "Akademik",
            title: "Penerimaan siswa ke perguruan tinggi",
            description: "5 siswa/i diterima di perguruan tinggi melalui jalur SNMPTN.",
            label: "Arsip 2017 · Akademik"
          },
          {
            category: "Non-akademik",
            title: "Plumbing and Heating",
            description: "Juara 1 tingkat Nasional dan Juara 1 tingkat Provinsi.",
            label: "Arsip 2017 · Non-akademik"
          },
          {
            category: "Non-akademik",
            title: "IT Network System Administrasi",
            description: "Juara 1 tingkat Nasional dan Juara 1 tingkat Provinsi.",
            label: "Arsip 2016 · Non-akademik"
          },
          {
            category: "Non-akademik",
            title: "IT Networking",
            description: "Juara 6 tingkat Nasional di Tangerang.",
            label: "Arsip 2015 · Non-akademik"
          },
          {
            category: "Non-akademik",
            title: "IT Networking",
            description: "Juara 6 tingkat Nasional di Palembang.",
            label: "Arsip 2014 · Non-akademik"
          }
        ]
      },
      {
        id: "agenda",
        title: "Kegiatan dan agenda",
        body: "Agenda mendatang dan kegiatan sekolah hanya ditampilkan apabila tanggal serta informasinya sudah diterbitkan melalui CMS sekolah."
      }
    ]
  },
  kesiswaan: {
    eyebrow: "KEHIDUPAN SISWA",
    title: "Kesiswaan",
    intro: "Kanal resmi sekolah dapat diikuti untuk informasi kegiatan siswa yang dipublikasikan.",
    blocks: [
      {
        id: "organisasi",
        title: "Organisasi siswa",
        body: pending
      },
      {
        id: "ekstrakurikuler",
        title: "Ekstrakurikuler",
        body: pending
      },
      {
        id: "prestasi",
        title: "Prestasi siswa",
        body: "Prestasi yang tercatat pada sumber resmi ditampilkan pada halaman arsip prestasi.",
        cards: [
          {
            title: "Lihat arsip prestasi",
            description: "Catatan dilengkapi tahun dan tingkat kompetisi sesuai informasi sumber.",
            href: "/kegiatan#prestasi"
          }
        ]
      }
    ]
  },
  informasi: {
    eyebrow: "PUSAT INFORMASI",
    title: "Informasi sekolah",
    intro: "Berita, pengumuman, dan agenda yang diterbitkan pengelola sekolah ditampilkan dari CMS sekolah.",
    blocks: [
      {
        id: "berita",
        title: "Berita terbaru",
        sourceUrl: "https://smkn1jakarta.sch.id/",
        sourceLabel: "Situs resmi sekolah",
        cards: [
          { title: "Belum ada berita terbaru", description: "Berita terbaru akan muncul di sini setelah diterbitkan melalui CMS sekolah.", label: "Menunggu konten CMS" }
        ]
      },
      {
        id: "pengumuman",
        title: "Pengumuman",
        cards: [
          { title: "Belum ada pengumuman", description: "Pengumuman akan ditampilkan setelah diterbitkan melalui CMS sekolah.", label: "Menunggu konten CMS" }
        ]
      },
      {
        id: "agenda-akademik",
        title: "Agenda akademik",
        cards: [
          { title: "Belum ada agenda terkonfirmasi", description: "Agenda akan ditampilkan setelah tanggal dan informasinya diterbitkan melalui CMS sekolah.", label: "Menunggu konten CMS" }
        ]
      },
      {
        id: "arsip-situs-resmi",
        title: "Arsip berita situs resmi",
        body: "Berita berikut berasal dari situs resmi dan ditampilkan sebagai arsip. Tanggalnya bukan penanda kegiatan terkini.",
        cards: [
          {
            title: "Kiat Untuk Pendidik Berdasarkan Arahan Rasulullah",
            description: "Artikel membahas teladan akhlak dan sikap dalam proses belajar mengajar, dirangkum dari buku karya Dr. Ahmad Irfan.",
            label: "Arsip · 15 Maret 2025",
            href: "https://smkn1jakarta.sch.id/kiat-untuk-pendidik-berdasarkan-arahan-rasulullah/"
          },
          {
            title: "SMKN 1 JUARA UMUM Pramuka Penegak Kwarcab Tingkat Kota Administrasi Jakarta Pusat",
            description: "Berita tentang Lomba Kreativitas Penegak yang berlangsung pada 28 September 2024 di Kantor Pemerintahan Kota Administrasi Jakarta Pusat.",
            label: "Arsip · 1 Oktober 2024",
            href: "https://smkn1jakarta.sch.id/smkn-1-juara-umum-lkp-tingkat-kota-administrasi-jakarta-pusat/"
          },
          {
            title: "SISWA SMKN 1 JAKARTA BERPRESTASI PADA LKS KE -32 DI LAMPUNG",
            description: "Berita sekolah mengenai prestasi siswa pada Lomba Keterampilan Siswa ke-32 di Lampung.",
            label: "Arsip · 26 Agustus 2024",
            href: "https://smkn1jakarta.sch.id/siswa-smkn-1-jakarta-berprestasi-pada-lks-ke-32-di-lampung/"
          }
        ]
      }
    ]
  },
  ppdb: {
    eyebrow: "PENERIMAAN PESERTA DIDIK BARU",
        title: "Informasi SPMB",
    intro: "SPMB SMK Negeri 1 Jakarta mengikuti kebijakan dan jadwal Pemerintah Provinsi DKI Jakarta. Periksa persyaratan, jalur, kuota, dan pengumuman melalui portal resmi untuk tahun ajaran berjalan.",
    blocks: [
      {
        id: "alur",
        title: "Langkah umum",
        body: "Ikuti hanya petunjuk dan jadwal yang diumumkan melalui kanal resmi sekolah atau penyelenggara penerimaan.",
        cards: [
          { title: "Pantau pengumuman resmi", description: "Periksa jadwal dan ketentuan pada kanal resmi sebelum menyiapkan pendaftaran.", label: "Langkah 1 · Panduan umum" },
          { title: "Periksa daftar persyaratan", description: "Daftar dokumen resmi belum dipublikasikan di halaman ini. Jangan menganggap daftar dari sumber lain sebagai persyaratan sekolah.", label: "Langkah 2 · Menunggu verifikasi" },
          { title: "Ikuti kanal pendaftaran yang diumumkan", description: "Tautan dan tata cara pendaftaran resmi belum tersedia. Hindari mengirim dokumen melalui kanal yang belum dikonfirmasi.", label: "Langkah 3 · Menunggu informasi resmi" },
          { title: "Periksa hasil melalui kanal resmi", description: "Waktu dan cara pengumuman hasil seleksi belum dikonfirmasi.", label: "Langkah 4 · Menunggu informasi resmi" }
        ]
      },
      {
        id: "dokumen",
        title: "Persyaratan dan dokumen",
        body: `Daftar dokumen yang diperlukan belum dicantumkan karena persyaratan resmi belum diverifikasi. ${pending}`
      },
      {
        id: "portal-resmi",
        title: "Portal resmi SPMB DKI Jakarta 2026/2027",
        body: "Portal pemerintah mencantumkan SMK Negeri 1 Jakarta dengan 10 kompetensi. Periksa informasi terbaru di portal sebelum mendaftar.",
        cards: [{ title: "SPMB DKI Jakarta", description: "Lihat pagu, kompetensi, jalur, dan pengumuman resmi.", label: "Tahun ajaran 2026/2027", href: "https://spmb.jakarta.go.id/040401/pagu" }]
      },
      {
        id: "hasil-seleksi",
        title: "Hasil seleksi",
        body: `Hasil seleksi, jadwal pengumuman, dan tautan pemeriksaan belum tersedia. ${pending}`
      }
    ]
  },
  kontak: {
    eyebrow: "INFORMASI & PERTANYAAN",
    title: "Hubungi SMK Negeri 1 Jakarta",
    intro: "Alamat dan kanal kontak berikut tercantum pada halaman Identitas Sekolah.",
    blocks: [
      {
        id: "info",
        title: "Informasi kontak",
        sourceUrl: "https://smkn1jakarta.sch.id/identitas-sekolah/",
        sourceLabel: "Halaman Identitas Sekolah",
        cards: [
          { title: "Alamat", description: schoolAddress, label: "Alamat sekolah" },
          { title: "Telepon", description: "(021) 381-3630", label: "Telepon sekolah", href: "tel:+62213813630" },
          { title: "Telepon alternatif", description: "(021) 350-4091", label: "Nomor pada halaman Identitas Sekolah", href: "tel:+62213504091" },
          { title: "Email", description: "smkn1jakarta@gmail.com", label: "Email sekolah", href: "mailto:smkn1jakarta@gmail.com" }
        ]
      },
      {
        id: "peta",
        title: "Alamat sekolah",
        body: "Alamat berikut tercantum pada halaman Identitas Sekolah.",
        cards: [
          {
            title: "Jl. Budi Utomo No. 7",
            description: schoolAddress,
            label: "Pasar Baru · Sawah Besar · Jakarta Pusat"
          }
        ]
      },
      {
        id: "faq",
        title: "Pertanyaan yang sering diajukan",
        cards: [
          { title: "Bagaimana cara memperoleh informasi PPDB?", description: "Ikuti pengumuman di kanal resmi sekolah atau penyelenggara penerimaan." },
          { title: "Apa saja program keahlian yang tersedia?", description: "Daftar pada halaman ini merujuk arsip kompetensi tahun ajaran 2022/2023 dengan sejumlah perubahan nama terbaru. Status program untuk tahun berjalan belum dapat dipastikan." },
          { title: "Bagaimana cara menghubungi sekolah?", description: "Hubungi sekolah melalui nomor telepon atau email yang tercantum pada halaman ini." }
        ]
      }
    ],
    contactForm: true
  }
};
