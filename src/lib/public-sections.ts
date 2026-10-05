type PublicCard = { title: string; description: string; category?: string; label?: string };
type PublicSectionData = {
  title: string;
  intro: string;
  eyebrow: string;
  sections: { title: string; body: string }[];
  cards?: PublicCard[];
  categories?: string[];
  contactForm?: boolean;
};

export const publicSections: Record<string, PublicSectionData> = {
  tentang: {
    eyebrow: "TENTANG SEKOLAH",
    title: "Mengenal SMKN1Plus",
    intro: "Ruang informasi profil sekolah. Konten kelembagaan di bawah ini akan dilengkapi setelah mendapat konfirmasi resmi dari sekolah.",
    sections: [
      { title: "Sejarah", body: "Riwayat pendirian, perubahan nama, dan tonggak perkembangan sekolah belum tersedia untuk publikasi. Menunggu verifikasi sekolah." },
      { title: "Misi & arah pendidikan", body: "Pernyataan visi, misi, dan tujuan resmi belum diterima. Ringkasan yang tampil di beranda bersifat pengantar umum, bukan kutipan misi resmi." },
      { title: "Struktur organisasi", body: "Nama pimpinan dan susunan organisasi tidak ditampilkan sebelum dikonfirmasi. Bagan struktur sekolah: menunggu verifikasi sekolah." }
    ]
  },
  fakultas: {
    eyebrow: "PENDIDIK & TENAGA KEPENDIDIKAN",
    title: "Fakultas & staf",
    intro: "Jelajahi direktori berdasarkan departemen. Nama, jabatan, serta bidang di bawah ini adalah contoh antarmuka, bukan data staf sekolah.",
    sections: [{ title: "Direktori resmi", body: "Daftar staf dan pembagian departemen menunggu verifikasi sekolah." }],
    categories: ["Semua", "Akademik", "Layanan siswa", "Administrasi"],
    cards: ["Akademik", "Layanan siswa", "Administrasi"].map((category) => ({
      category,
      title: `Departemen ${category}`,
      description: "Nama staf, jabatan, dan informasi departemen menunggu verifikasi sekolah.",
      label: "Contoh kategori · belum terverifikasi"
    }))
  },
  siswa: {
    eyebrow: "KOMUNITAS SISWA",
    title: "Cerita & profil siswa",
    intro: "Ruang untuk menampilkan karya, pengalaman, dan suara siswa secara bertanggung jawab. Tidak ada nama atau profil siswa nyata yang direka di halaman ini.",
    sections: [{ title: "Suara dari komunitas", body: "Kisah siswa, kutipan, foto, serta persetujuan publikasi akan ditambahkan setelah mendapat materi dan izin resmi." }],
    cards: [
      { title: "Cerita belajar", description: "Slot untuk cerita pengalaman belajar siswa yang telah disunting dan disetujui.", label: "Contoh format · menunggu materi" },
      { title: "Karya siswa", description: "Slot untuk karya/proyek dan konteks pembelajaran, setelah diverifikasi.", label: "Contoh format · menunggu materi" },
      { title: "Profil siswa", description: "Profil hanya diterbitkan dengan persetujuan dan konfirmasi sekolah.", label: "Belum ada profil terverifikasi" }
    ]
  },
  prestasi: {
    eyebrow: "APRESIASI & CAPAIAN",
    title: "Prestasi sekolah",
    intro: "Telusuri ruang capaian berdasarkan kategori. Kami tidak menampilkan nama, penghargaan, tahun, atau hasil yang belum diverifikasi.",
    sections: [{ title: "Catatan editorial", body: "Informasi prestasi resmi akan dilengkapi dengan bukti dan atribusi yang telah dikonfirmasi sekolah." }],
    categories: ["Semua", "Akademik", "Olahraga", "Ekstrakurikuler"],
    cards: ["Akademik", "Olahraga", "Ekstrakurikuler"].map((category) => ({
      category,
      title: `Prestasi ${category.toLocaleLowerCase()}`,
      description: "Belum ada capaian terverifikasi untuk ditampilkan dalam kategori ini.",
      label: "Menunggu verifikasi sekolah"
    }))
  },
  "program-vokasi": {
    eyebrow: "PEMBELAJARAN & KOMPETENSI",
    title: "Program vokasi",
    intro: "Program keahlian resmi belum dikonfirmasi. Kartu berikut merupakan gambaran area konten, bukan pernyataan bahwa bidang tersebut tersedia di sekolah.",
    sections: [{ title: "Pembelajaran terapan", body: "Informasi kurikulum, kompetensi, fasilitas praktik, dan kemitraan industri akan ditambahkan setelah data resmi tersedia." }],
    cards: ["Bidang keahlian", "Kurikulum & praktik", "Kemitraan industri"].map((title) => ({
      title,
      description: "Informasi program vokasi menunggu konfirmasi resmi dari sekolah.",
      label: "Placeholder · bukan daftar resmi"
    }))
  },
  fasilitas: {
    eyebrow: "RUANG BELAJAR",
    title: "Fasilitas sekolah",
    intro: "Ruang untuk informasi fasilitas belajar, praktik, dan layanan. Daftar serta foto faktual belum tersedia untuk publikasi.",
    sections: [{ title: "Fasilitas & akses", body: "Informasi fasilitas, aksesibilitas fisik, jam layanan, dan kapasitas menunggu verifikasi sekolah." }],
    cards: ["Ruang belajar", "Area praktik", "Layanan siswa"].map((title) => ({
      title,
      description: "Rincian fasilitas dan foto menunggu konfirmasi sekolah.",
      label: "Contoh kategori · belum terverifikasi"
    }))
  },
  kegiatan: {
    eyebrow: "KALENDER & GALERI",
    title: "Kegiatan sekolah",
    intro: "Agenda mendatang dan arsip kegiatan ditampilkan terpisah. Belum ada jadwal atau dokumentasi kegiatan terverifikasi.",
    sections: [{ title: "Arsip & galeri", body: "Foto atau rekaman hanya akan dipublikasikan setelah verifikasi materi dan izin pihak terkait." }],
    categories: ["Semua", "Mendatang", "Arsip"],
    cards: [
      { category: "Mendatang", title: "Agenda mendatang", description: "Belum ada acara yang dikonfirmasi untuk publikasi.", label: "Menunggu verifikasi sekolah" },
      { category: "Arsip", title: "Arsip kegiatan", description: "Belum ada dokumentasi kegiatan yang dikonfirmasi.", label: "Menunggu materi & persetujuan" }
    ]
  },
  kontak: {
    eyebrow: "INFORMASI & PERTANYAAN",
    title: "Hubungi sekolah",
    intro: "Kontak, alamat, dan jam layanan resmi belum dikonfirmasi. Formulir ini memeriksa kelengkapan di perangkat Anda saja; pesan tidak dikirim atau disimpan.",
    sections: [{ title: "Informasi kontak", body: "Alamat sekolah, nomor telepon, email, dan jam layanan: menunggu verifikasi sekolah. Belum ada kanal pesan yang terhubung di website ini." }],
    contactForm: true
  }
};

export type { PublicCard, PublicSectionData };
