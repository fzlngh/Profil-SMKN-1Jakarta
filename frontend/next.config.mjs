/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async redirects() {
    return [
      { source: "/program-vokasi", destination: "/tentang#program", permanent: true },
      { source: "/fasilitas", destination: "/tentang#fasilitas", permanent: true },
      { source: "/fakultas", destination: "/tentang#pendidik", permanent: true },
      { source: "/siswa", destination: "/tentang#siswa", permanent: true },
      { source: "/prestasi", destination: "/kegiatan#prestasi", permanent: true }
    ];
  }
};

export default nextConfig;