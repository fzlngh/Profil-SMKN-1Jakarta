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
  kontak: {
    eyebrow: "INFORMASI & PERTANYAAN",
    title: "Hubungi sekolah",
    intro: "Kontak, alamat, dan jam layanan resmi belum dikonfirmasi. Formulir ini hanya memeriksa kelengkapan di perangkat Anda; pesan tidak dikirim.",
    blocks: [{ id: "info", title: "Informasi kontak", body: `Alamat, telepon, email, dan jam layanan. ${pending}` }],
    contactForm: true
  }
};