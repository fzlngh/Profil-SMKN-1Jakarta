import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";

const timeline = [
  { year: "1906", label: "KWS DIDIRIKAN", body: "Sekolah didirikan dengan nama Koningin Wilhelmina School (KWS), menurut sejarah yang diterbitkan sekolah." },
  { year: "1946", label: "SEKOLAH TEKNIK MENENGAH", body: "Setelah Indonesia merdeka, nama sekolah berubah menjadi Sekolah Teknik Menengah (STM)." },
  { year: "1979", label: "STM NEGERI 1", body: "STM Negeri 1 ditetapkan melalui keputusan yang dicantumkan pada halaman sejarah sekolah." },
  { year: "1997", label: "SMK NEGERI 1 JAKARTA", body: "Nama SMK Negeri 1 Jakarta digunakan berdasarkan SK Mendikbud No. 0036/O/1997." }
 ] as const;
const featuredPrograms = [
  ["Teknik Pemesinan", "TP", "program-toi-photo.png"],
  ["Desain Gambar Mesin", "DGM", "program-toi-photo.png"],
  ["Teknik Kendaraan Ringan", "TKR", "program-tkr-photo.png"],
  ["Teknik Instalasi Tenaga Listrik", "TITL", "program-toi-photo.png"]
 ] as const;
const Arrow = () => <span aria-hidden="true"> →</span>;

export function HomeReferencePage() {
  return <div className="reference-home">
    <HomeHero />
    <section className="reference-history" aria-labelledby="reference-history-title"><div className="reference-wrap">
      <header className="reference-centered-heading"><h2 id="reference-history-title">SEJARAH <em>BERDIRI</em><br />SMK NEGERI 1 JAKARTA</h2><p>Perjalanan sekolah teknik di Jakarta sejak 1906.</p></header>
      <div className="reference-history-grid">{timeline.map((item, index) => <article className={`reference-milestone milestone-${index + 1}`} key={item.year}><span>{item.year}</span><small>{item.label}</small><p>{item.body}</p></article>)}</div>
      <p className="reference-source-note">Sumber: <a href="https://smkn1jakarta.sch.id/sejarah/">Sejarah SMK Negeri 1 Jakarta</a>. Sekolah menyebut gedungnya pernah digunakan BKR Bagian Laut pada 1945 dan termasuk aset cagar budaya daerah.</p>
    </div></section>
    <section className="reference-strengths" aria-labelledby="strengths-title"><div className="reference-wrap">
      <header className="reference-section-heading"><div><h2 id="strengths-title">INFORMASI<span>.</span></h2><p>Informasi dasar sekolah dan tautan ke kanal resminya.</p></div><Link href="/tentang">LIHAT PROFIL SEKOLAH <Arrow /></Link></header>
      <div className="reference-strength-grid">
        <article className="reference-strength-card"><span className="reference-icon reference-icon-1">01</span><h3>Profil Sekolah</h3><p>NPSN 20100143 · Negeri · Akreditasi A. Jl. Budi Utomo No. 7, Pasar Baru, Jakarta Pusat.</p><Link href="/tentang">SELENGKAPNYA <Arrow /></Link></article>
        <article className="reference-strength-card"><span className="reference-icon reference-icon-2">02</span><h3>SPMB DKI Jakarta</h3><p>Periksa persyaratan, jadwal, kompetensi, dan pengumuman tahun ajaran berjalan pada portal resmi.</p><Link href="https://spmb.jakarta.go.id/040401/pagu" target="_blank" rel="noreferrer">PORTAL SPMB <Arrow /></Link></article>
        <article className="reference-strength-card"><span className="reference-icon reference-icon-3">03</span><h3>Hubungi Sekolah</h3><p>Telepon (021) 381-3630 · smkn1jakarta@gmail.com</p><Link href="/kontak">INFORMASI KONTAK <Arrow /></Link></article>
      </div>
      <div className="reference-service-grid">
        <article className="reference-service-card"><small>VISI SMK NEGERI 1 JAKARTA</small><h3>Sekolah pilihan masyarakat dan pilar dunia usaha dan dunia industri</h3><p>“Menjadikan SMK Negeri 1 Jakarta sebagai sekolah pilihan masyarakat dan sebagai pilar bagi dunia usaha dan dunia industri.”</p><Link href="/tentang#visi-misi">Baca visi dan misi <Arrow /></Link></article>
        <article className="reference-service-card reference-service-warm"><small>BERITA BERTANGGAL DI SITUS RESMI</small><h3>Kiat Untuk Pendidik Berdasarkan Arahan Rasulullah</h3><p>Berita bertanggal 15 Maret 2025. Ditampilkan sebagai arsip, bukan sebagai kabar terbaru 2026.</p><Link href="https://smkn1jakarta.sch.id/kiat-untuk-pendidik-berdasarkan-arahan-rasulullah/" target="_blank" rel="noreferrer">Baca berita <Arrow /></Link></article>
      </div>
    </div></section>
    <section className="reference-programs" aria-labelledby="reference-programs-title"><div className="reference-wrap">
      <header className="reference-section-heading"><div><small>PROGRAM KEAHLIAN</small><h2 id="reference-programs-title">Pilihan Program Keahlian</h2><p>Gambar pada kartu merupakan ilustrasi. Rincian program menunggu konfirmasi sekolah.</p></div><Link className="reference-dark-button" href="/tentang">Semua 10 Program <Arrow /></Link></header>
      <div className="reference-program-grid">{featuredPrograms.map(([title, code, photo]) => <article className="reference-program-card" key={code}><div className="reference-program-image"><Image src={`/images/reference/${photo}`} alt={`Ilustrasi pembelajaran ${title}`} fill sizes="(max-width: 700px) 80vw, 25vw" /></div><div className="reference-program-body"><small>{code}</small><h3>{title} ({code})</h3><p>Informasi kompetensi dan kegiatan praktik menunggu konfirmasi.</p><Link href="/tentang">Informasi program <Arrow /></Link></div></article>)}</div>
    </div></section>
  </div>;
}
