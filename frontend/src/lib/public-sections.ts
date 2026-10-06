export type PublicCard = { title: string; description: string; category?: string; label?: string };

export type PublicBlock = {
  id: string;
  title: string;
  body?: string;
  categories?: string[];
  cards?: PublicCard[];
};

export type PublicSectionData = {
  eyebrow: string;
  title: string;
  intro: string;
  blocks: PublicBlock[];
  contactForm?: boolean;
};

const pending = "Menunggu verifikasi sekolah.";

export const publicSections: Record<string, PublicSectionData> = {
  tentang: {
    eyebrow: "TENTANG SEKOLAH",
    title: "Mengenal SMK Negeri 1 Jakarta",
    intro: "Sejarah, program keahlian, fasilitas, pendidik, dan siswa dalam satu halaman.",
    blocks: [
      { id: "sejarah", title: "Sejarah & misi", body: `Riwayat pendirian, visi, misi, dan struktur organisasi. ${pending}` },
      {
        id: "program", title: "Program keahlian",
        body: "Daftar jurusan, kurikulum, dan kemitraan industri akan ditambahkan setelah data resmi tersedia.",
        cards: ["Bidang keahlian", "Kurikulum & praktik", "Kemitraan industri"].map((title) => ({
          title, description: pending, label: "Placeholder · bukan daftar resmi"
        }))
      },
      {
        id: "fasilitas", title: "Fasilitas",
        cards: ["Ruang belajar", "Area praktik", "Layanan siswa"].map((title) => ({
          title, description: pending, label: "Contoh kategori · belum terverifikasi"
        }))
      },
      {
        id: "pendidik", title: "Pendidik & staf",
        categories: ["Semua", "Akademik", "Layanan siswa", "Administrasi"],
        cards: ["Akademik", "Layanan siswa", "Administrasi"].map((category) => ({
          category, title: `Departemen ${category}`, description: pending, label: "Contoh kategori · belum terverifikasi"
        }))
      },
      {
        id: "siswa", title: "Siswa",
        body: `Jumlah siswa per angkatan, cerita, dan karya siswa. ${pending}`,
        cards: [
          { title: "Jumlah siswa per angkatan", description: pending, label: "Belum ada data" },
          { title: "Cerita & karya siswa", description: "Hanya diterbitkan dengan materi dan izin resmi.", label: "Menunggu materi" }
        ]
      }
    ]
  },
  kegiatan: {
    eyebrow: "KEGIATAN & PRESTASI",
    title: "Kegiatan & prestasi sekolah",
    intro: "Agenda, arsip kegiatan, dan capaian warga sekolah.",
    blocks: [
      {
        id: "prestasi", title: "Prestasi",
        categories: ["Semua", "Akademik", "Olahraga", "Ekstrakurikuler"],
        cards: ["Akademik", "Olahraga", "Ekstrakurikuler"].map((category) => ({
          category, title: `Prestasi ${category.toLocaleLowerCase()}`,
          description: "Belum ada capaian terverifikasi.", label: pending
        }))
      },
      {
        id: "agenda", title: "Agenda & arsip",
        categories: ["Semua", "Mendatang", "Arsip"],
        cards: [
          { category: "Mendatang", title: "Agenda mendatang", description: "Belum ada acara yang dikonfirmasi.", label: pending },
          { category: "Arsip", title: "Arsip kegiatan", description: "Belum ada dokumentasi yang dikonfirmasi.", label: "Menunggu materi & persetujuan" }
        ]
      }
    ]
  },
  kesiswaan: {
    eyebrow: "KEHIDUPAN SISWA",
    title: "Kesiswaan",
    intro: "Informasi organisasi, kegiatan pengembangan diri, dan prestasi siswa akan ditampilkan setelah materi sekolah dikonfirmasi.",
    blocks: [
      {
        id: "organisasi",
        title: "Organisasi siswa",
        body: `Informasi organisasi dan kegiatan siswa belum tersedia untuk ditayangkan. ${pending}`
      },
      {
        id: "ekstrakurikuler",
        title: "Ekstrakurikuler",
        cards: [
          { title: "Daftar kegiatan", description: pending, label: "Belum ada daftar terverifikasi" }
        ]
      },
      {
        id: "prestasi",
        title: "Prestasi siswa",
        cards: [
          { title: "Capaian siswa", description: "Belum ada capaian siswa yang dikonfirmasi untuk halaman ini.", label: pending }
        ]
      }
    ]
  },
  informasi: {
    eyebrow: "PUSAT INFORMASI",
    title: "Informasi sekolah",
    intro: "Berita, pengumuman, dan agenda akademik akan ditampilkan setelah sumber konten sekolah tersedia dan terhubung.",
    blocks: [
      {
        id: "berita",
        title: "Berita terbaru",
        cards: [
          { title: "Belum ada berita untuk ditampilkan", description: "Berita sekolah akan muncul di sini setelah konten terverifikasi tersedia.", label: "Belum ada konten terhubung" }
        ]
      },
      {
        id: "pengumuman",
        title: "Pengumuman",
        cards: [
          { title: "Belum ada pengumuman", description: "Periksa kanal resmi sekolah untuk informasi terbaru. Daftar pengumuman pada situs ini belum dikonfigurasi.", label: "Menunggu integrasi CMS" }
        ]
      },
      {
        id: "agenda-akademik",
        title: "Agenda akademik",
        cards: [
          { title: "Belum ada agenda terkonfirmasi", description: "Tanggal dan agenda akademik belum tersedia untuk ditayangkan.", label: pending }
        ]
      }
    ]
  },
  ppdb: {
    eyebrow: "PENERIMAAN PESERTA DIDIK BARU",
    title: "Informasi PPDB",
    intro: "Jadwal, persyaratan, kanal pendaftaran, dan hasil seleksi resmi belum tersedia pada halaman ini. Informasi berikut adalah kerangka panduan, bukan ketentuan resmi.",
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
        title: "Persyaratan & dokumen",
        body: `Daftar dokumen yang diperlukan belum dicantumkan karena persyaratan resmi belum diverifikasi. ${pending}`,
        cards: [
          { title: "Daftar dokumen resmi", description: "Placeholder—belum ada nama atau jenis dokumen yang dapat dipastikan. Lengkapi dokumen hanya berdasarkan pengumuman resmi.", label: "Belum tersedia" }
        ]
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
    title: "Hubungi sekolah",
    intro: "Kontak, alamat, dan jam layanan resmi belum dikonfirmasi. Formulir ini hanya memeriksa kelengkapan di perangkat Anda; pesan tidak dikirim.",
    blocks: [
      { id: "info", title: "Informasi kontak", body: `Alamat, telepon, email, dan jam layanan. ${pending}` },
      {
        id: "peta",
        title: "Peta lokasi",
        body: "Peta dan penanda lokasi belum ditampilkan karena alamat resmi belum diverifikasi. Tidak ada lokasi sementara yang ditetapkan."
      },
      {
        id: "faq",
        title: "Pertanyaan yang sering diajukan",
        cards: [
          { title: "Bagaimana cara memperoleh informasi PPDB?", description: "Jadwal dan kanal informasi PPDB resmi menunggu konfirmasi sekolah.", label: "Jawaban menunggu verifikasi" },
          { title: "Apa saja program keahlian yang tersedia?", description: "Daftar program keahlian resmi belum dicantumkan. Informasi akan diperbarui setelah diverifikasi.", label: "Jawaban menunggu verifikasi" },
          { title: "Bagaimana cara menghubungi sekolah?", description: "Nomor telepon, alamat email, dan jam layanan belum dikonfirmasi pada halaman ini.", label: "Jawaban menunggu verifikasi" }
        ]
      }
    ],
    contactForm: true
  }
};