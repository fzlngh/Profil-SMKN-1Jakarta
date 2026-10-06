import Image from "next/image";
import Link from "next/link";

const programs = [
  ["Teknik Pemesinan", "TP", "/images/reference/program-toi-photo.png"],
  ["Desain Gambar Mesin", "DGM", "/images/reference/program-toi-photo.png"],
  ["Teknik Kendaraan Ringan", "TKR", "/images/reference/program-tkr-photo.png"],
  ["Teknik Instalasi Tenaga Listrik", "TITL", "/images/reference/program-toi-photo.png"],
  ["Desain Pemodelan dan Informasi Bangunan", "DPIB", "/images/reference/program-tkr-photo.png"],
  ["Teknik Konstruksi dan Properti", "TKP", "/images/reference/campus.png"],
  ["Teknik Komputer dan Jaringan", "TKJ", "/images/reference/program-tkj-photo.png"],
  ["Sistem Informatika, Jaringan dan Aplikasi", "SIJA", "/images/reference/program-tkj-photo.png"],
  ["Rekayasa Perangkat Lunak", "RPL", "/images/reference/program-rpl-photo.png"],
  ["Desain Komunikasi Visual", "DKV", "/images/reference/program-rpl-photo.png"]
] as const;

export function ProgramDesignedPage() {
  return <div className="reference-subpage program-design-page">
    <section className="program-design-intro reference-wrap"><small>SMK NEGERI 1 JAKARTA · DKI JAKARTA</small><h1>10 Program<br /><em>Keahlian</em></h1><p>Daftar program keahlian SMK Negeri 1 Jakarta.</p><div><a href="#program-list">Jelajahi Program ↓</a><Link href="/kontak">Hubungi Sekolah</Link></div><nav aria-label="Lompat ke program">{programs.map(([title, code]) => <a key={code} href={`#program-${code.toLowerCase()}`}>{code} · {title}</a>)}</nav></section>
    <section className="program-design-overview reference-wrap"><small>PROGRAM KEAHLIAN</small><div><h2>Informasi tiap program</h2><p>Rincian lama pendidikan, kompetensi yang dipelajari, praktik, fasilitas, sertifikasi, dan peluang setelah lulus perlu dikonfirmasi oleh ketua program keahlian. Gambar pada kartu merupakan gambar ilustrasi dari aset mockup.</p><ul><li>Nama program mengikuti daftar yang diminta</li><li>Informasi teknis menunggu konfirmasi sekolah</li><li>Foto ilustrasi, bukan dokumentasi program</li></ul></div></section>
    <section className="program-toolkit"><div className="reference-wrap"><small>INFORMASI PROGRAM</small><h2>Rincian yang perlu dikonfirmasi</h2><div>{["Lama pendidikan", "Kompetensi yang dipelajari", "Kegiatan praktik", "Fasilitas", "Sertifikasi", "Peluang setelah lulus"].map((item, i) => <article key={item}><b>0{i + 1}</b><h3>{item}</h3><p>Belum tersedia · menunggu informasi resmi sekolah.</p></article>)}</div></div></section>
    <section className="program-design-catalogue reference-wrap" id="program-list"><header><small>PROGRAM KEAHLIAN</small><h2>Daftar Program</h2><p>Nama program sesuai daftar yang diminta untuk ditampilkan.</p></header><div className="program-design-cards">{programs.map(([title, code, image]) => <article id={`program-${code.toLowerCase()}`} key={code}><div><Image src={image} alt={`Gambar ilustrasi untuk ${title}`} fill sizes="(max-width: 700px) 90vw, 30vw" /></div><small>{code} · PROGRAM KEAHLIAN</small><h3>{title} ({code}){code === "SIJA" ? ", program 4 tahun" : ""}</h3><p>Informasi program, kegiatan praktik, fasilitas, dan peluang lulusan akan ditambahkan setelah dikonfirmasi sekolah.</p><Link href="/kontak">Tanyakan informasi →</Link></article>)}</div></section>
    <section className="program-design-cta"><div className="reference-wrap"><div><small>INFORMASI PROGRAM</small><h2>Perlu memastikan detail program?</h2><p>Hubungi SMK Negeri 1 Jakarta melalui kanal resmi.</p></div><Link href="/kontak">Hubungi Sekolah →</Link></div></section>
  </div>;
}
