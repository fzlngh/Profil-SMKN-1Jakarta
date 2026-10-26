"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MegaphoneIcon } from "@/components/MegaphoneIcon";
import { ChatOpenLink } from "@/components/ChatOpenLink";

const programs: [string, string, string, string, string][] = [
  ["Teknik Komputer dan Jaringan", "TKJ", "#0b9b8d", "Pemasangan perangkat, sistem operasi/aplikasi, instalasi dan pengelolaan jaringan komputer.", "/images/programs/tkj-practice-original.jpg"],
  ["Teknik Kendaraan Ringan", "TKR", "#ed4c08", "Mempelajari konversi energi kendaraan, prosedur pemeriksaan, dan pelayanan bengkel.", "/images/programs/tkr-pasted.png"],
  ["Desain Komunikasi Visual", "DKV", "#7734e7", "Menyampaikan pesan secara terarah melalui sketsa, ilustrasi, tipografi, fotografi, dan karya desain.", "/images/programs/dkv-media-production-2024.jpg"],
  ["Rekayasa Perangkat Lunak", "RPL", "#2864ed", "Mempelajari tools pengembangan, basis data, antarmuka, algoritma, dan alur logika perangkat lunak.", "/images/programs/rpl-hackathon-activity.jpg"]
];
const news: [string, string, string, string, string][] = [
  ["Prestasi", "Siswa SMKN 1 Jakarta Raih Juara Nasional Lomba Kompetensi Siswa", "Tim kami berhasil membawa pulang medali setelah melewati tiga babak seleksi.", "8 Okt 2026", "design-v5/news-lks.jpg"],
  ["Kegiatan", "Kunjungan Industri RPL & TKJ ke Perusahaan Teknologi di Jakarta Selatan", "Siswa kelas XI mengamati langsung alur kerja tim pengembang dan infrastruktur jaringan.", "5 Okt 2026", "design-v5/news-industry.jpg"],
  ["Akademik", "Workshop Penguatan Kurikulum bagi Guru Produktif Semua Program", "Guru berbagi praktik penyusunan modul ajar berbasis proyek.", "1 Okt 2026", "design-v5/news-workshop.jpg"]
];
const announcements = [
  ["MENDESAK", "Pembaruan Data Peserta Didik Wajib Diselesaikan", "6 Okt 2026"],
  ["INFO", "Jadwal Penilaian Tengah Semester Ganjil 2026/2027", "9 Okt 2026"],
  ["PENTING", "Pengumpulan Berkas Beasiswa Prestasi Diperpanjang", "7 Okt 2026"]
];
const events = [["15", "OKT", "Penilaian Tengah Semester (PTS) Ganjil", "07.30 – 12.00", "Ruang kelas masing-masing"], ["24", "OKT", "Pembagian Hasil PTS & Rapat Wali Murid", "08.00 – 11.00", "Aula Utama"], ["03", "NOV", "Uji Kompetensi Keahlian (Gelombang 1)", "07.00 – 15.00", "Laboratorium program keahlian"]];
const partners: [string, string, string][] = [
  ["PT Indivara", "TELEKOMUNIKASI", "01_Indivara.webp"],
  ["PT Wisesa Consulting Indonesia", "KONSULTAN", "02_Wisesa_Consulting_Indonesia.png"],
  ["PT Reyterton", "SOFTWARE", "03_Rayterton.png"],
  ["PT Bojong Westplas", "PIPA", "15_Bojong_Westplas_Westpex.png"],
  ["PT Siemens", "ELEKTRIKAL", "16_Siemens.png"],
  ["PT Panasonic", "MANUFAKTUR", "18_Panasonic.png"],
  ["PT AQUA Japan", "ELEKTRONIK", "20_AQUA_Japan.webp"],
  ["Hotel DoubleTree", "PERHOTELAN", "22_DoubleTree_by_Hilton.png"],
  ["Hotel Grand Mercure", "PERHOTELAN", "23_Grand_Mercure.png"],
  ["Hotel Pullman", "PERHOTELAN", "24_Pullman.jpg"],
  ["Hotel Novotel", "PERHOTELAN", "25_Novotel.png"]
];
const organizations: [string, string, string, string][] = [["OSIS", "Organisasi Siswa Intra Sekolah", "blue", "archive/01-OSIS/01-galeri-satu.webp"], ["Pramuka", "Gugus Depan SMKN 1 Jakarta", "green", "pramuka.jpg"], ["Rohis", "Kegiatan keagamaan siswa", "red", "archive/03-Rohis/01-Isra-Mikraj-2024-IMG0252.jpg"], ["KIR", "Kelompok Ilmiah Remaja", "orange", "kir.jpg"]];
const homeFaq = [
  ["Di mana saya dapat melihat pengumuman sekolah?", "Informasi pelaksanaan dan pengumuman sekolah tersedia pada halaman Pengumuman.", "/pelaksanaan", "Lihat Pengumuman"],
  ["Apakah daftar program studi di situs ini merupakan daftar terbaru?", "Informasi yang tersedia pada halaman Program Studi merujuk arsip tahun ajaran 2022/2023. Status program untuk tahun berjalan perlu dikonfirmasi melalui sekolah atau portal SPMB resmi.", "/tentang", "Lihat Program Studi"],
  ["Di mana saya dapat melihat prestasi sekolah?", "Prestasi ditampilkan sebagai arsip dengan tahun capaian sesuai sumber yang tersedia.", "/kegiatan#prestasi", "Lihat Arsip Prestasi"],
  ["Di mana jadwal kegiatan dan pengumuman sekolah ditampilkan?", "Gunakan halaman Agenda untuk jadwal kegiatan, dan halaman Pengumuman untuk informasi resmi sekolah.", "/agenda", "Buka Agenda"]
] as const;
const Arrow = () => <span aria-hidden="true"> →</span>;
export function HomeReferencePage() {
  const programsRef = useRef<HTMLDivElement>(null);
  const [activeProgram, setActiveProgram] = useState(0);
  const [showAllPartners, setShowAllPartners] = useState(false);

  // Hero entrance (GSAP): copy rises with stagger, campus fades, stats follow.
  // Skipped entirely for visitors who prefer reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (reduced.matches) {
        gsap.set([".pixel-hero-copy > *", ".pixel-campus", ".pixel-stats div"], { clearProps: "all" });
      }
    };
    const timeline = gsap.timeline({ defaults: { ease: "power3.out", clearProps: "all" } });
    timeline
      .from(".pixel-hero-copy > *", { opacity: 0, y: 26, duration: 0.7, stagger: 0.09 })
      .from(".pixel-campus", { opacity: 0, scale: 0.97, duration: 0.8 }, "-=0.35")
      .from(".pixel-stats div", { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, "-=0.4");
    reduced.addEventListener?.("change", onChange);
    return () => {
      timeline.kill();
      gsap.set([".pixel-hero-copy > *", ".pixel-campus", ".pixel-stats div"], { clearProps: "all" });
      reduced.removeEventListener?.("change", onChange);
    };
  }, []);

  function moveToProgram(index: number) {
    const track = programsRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".pixel-program-card");
    if (!card) return;
    track.scrollTo({ left: index * (card.offsetWidth + 14), behavior: "smooth" });
    setActiveProgram(index);
  }
  return <div className="pixel-home">
    <section className="pixel-hero"><div className="pixel-hero-inner">
      <div className="pixel-hero-copy"><span className="pixel-pill"><i/> SMK NEGERI 1 JAKARTA　/　TEKNIK</span><h1>Mencetak Teknisi Muda yang <em>Siap Berkarya</em></h1><p>Belajar langsung di bengkel dan laboratorium, terhubung dengan industri mitra, dan siap melangkah ke dunia kerja.</p><div className="pixel-actions"><Link className="pixel-button pixel-gold" href="/tentang">Jelajahi Program Studi <Arrow /></Link><Link className="pixel-button pixel-outline" href="#mitra">Lihat Mitra Industri</Link></div></div>
      <div className="pixel-campus"><div className="pixel-campus-placeholder" role="img" aria-label="Foto gedung sekolah" /><span className="campus-corner corner-tl"/><span className="campus-corner corner-tr"/><span className="campus-corner corner-bl"/><span className="campus-corner corner-br"/><div className="pixel-accreditation"><small>SMKN1-JKT</small><b><i aria-hidden="true"/>Akreditasi A</b></div></div>
      <div className="pixel-stats"><div><b>10</b><span>KOMPETENSI</span></div><div><b>11</b><span>MITRA UNGGULAN</span></div><div><b>1.700+</b><span>PESERTA DIDIK</span></div><div><b>A</b><span>AKREDITASI</span></div></div>
    </div></section>
    <section className="pixel-section pixel-programs" id="program-studi"><div className="pixel-wrap"><header className="pixel-heading"><div><small>[ 01 ]　PROGRAM KEAHLIAN</small><h2>Pilih jalur kompetensimu</h2><p>Program keahlian dengan kurikulum yang selaras kebutuhan industri.</p></div><Link href="/tentang">Lihat semua program <Arrow /></Link></header><div className="pixel-program-grid" ref={programsRef} onScroll={(event)=>{const card=event.currentTarget.querySelector<HTMLElement>(".pixel-program-card");if(card)setActiveProgram(Math.min(3,Math.round(event.currentTarget.scrollLeft/(card.offsetWidth+14))))}}>{programs.map(([title, code, color, body, photo])=><article className="pixel-program-card" key={code} style={{"--accent":color} as React.CSSProperties}><div><span className="program-card-glyph" aria-hidden="true">〈〉</span><i>{code}</i><Image src={photo.startsWith("/") ? photo : `/images/reference/${photo}`} alt="" width={48} height={48}/></div><h3>{title}</h3><p>{body}</p><Link href={`/program/${code.toLowerCase()}`}>Lihat detail program <Arrow /></Link></article>)}</div><div className="pixel-program-dots" role="group" aria-label="Pilih program keahlian">{programs.map(([,code],index)=><button key={code} type="button" aria-label={`Program ${index+1}`} aria-current={activeProgram===index?"true":undefined} onClick={()=>moveToProgram(index)}/>)}</div></div></section>
    <section className="pixel-section pixel-industry" id="mitra"><div className="pixel-wrap"><header className="pixel-heading"><div><small>[ 02 ]　MITRA INDUSTRI</small><h2>Dipercaya dunia usaha dan industri</h2><p>Siswa menjalani praktik kerja lapangan dan terhubung ke peluang kerja bersama perusahaan mitra kami.</p></div><aside><div><b>{partners.length}</b><small>Mitra unggulan</small></div><div><b>550+</b><small>Siswa PKL / tahun</small></div></aside></header><div className={`pixel-partners${showAllPartners ? " is-expanded" : ""}`} id="home-partners-grid">{partners.map(([partner, sector, logo], index)=><article className={index >= 6 ? "partner-extra" : undefined} key={partner}><Image src={`/images/partners/${logo}`} alt={`Logo ${partner}`} width={240} height={100}/><b>{partner}</b><small>{sector}</small></article>)}<Link href="/kontak" className="pixel-partner-cta"><b>Jadi mitra industri</b><small>Hubungi Humas <Arrow /></small></Link></div><button className="pixel-partners-more" type="button" aria-controls="home-partners-grid" aria-expanded={showAllPartners} onClick={() => setShowAllPartners((shown) => !shown)}>{showAllPartners ? "Tampilkan lebih sedikit" : "Lihat semua mitra"}</button><div className="pixel-industry-tags"><small>KERJA SAMA:</small><span>Praktik Kerja Lapangan</span><span>Teaching Factory</span><span>Rekrutmen Lulusan</span><span>Guru Tamu Industri</span></div></div></section>
    <section className="pixel-section pixel-news" id="berita"><div className="pixel-wrap"><header className="pixel-heading"><div><small>[ 03 ]　BERITA TERBARU</small><h2>Kabar dari SMKN 1 Jakarta</h2></div></header><div className="pixel-news-grid">{news.map(([tag,title,summary,date,photo])=><article key={title}><div className="pixel-news-image"><Image src={`/images/reference/${photo}`} alt={title} fill sizes="(max-width: 620px) 85vw, 33vw"/></div><section><small>{tag}</small><h3>{title}</h3><p>{summary}</p><footer>▣ &nbsp;{date}<Link href="/informasi">Baca <Arrow /></Link></footer></section></article>)}</div><Link className="pixel-news-button" href="/informasi">Lihat semua berita <Arrow /></Link></div></section>
    <section className="pixel-section pixel-schedule" id="pengumuman"><div className="pixel-wrap pixel-schedule-grid"><div><header className="pixel-heading"><div><small>[ 04 ]　PENGUMUMAN</small><h2>Info penting</h2></div></header>{announcements.map(([kind,item,date],i)=><Link className={`pixel-announcement tone-${i}`} href="/pengumuman" key={item}><span className="pixel-ann-icon"><MegaphoneIcon /></span><span><small>{kind}　•　{date}</small><b>{item}</b></span><Arrow /></Link>)}</div><div id="agenda"><header className="pixel-heading"><div><small>[ 05 ]　AGENDA AKADEMIK</small><h2>Jadwal terdekat</h2></div></header>{events.map(([day,month,title,time,place])=><article className="pixel-event" key={day}><b><strong>{day}</strong><small>{month}</small></b><span><strong>{title}</strong><small>◷ {time}　◉ {place}</small></span></article>)}</div></div></section>
    <section className="pixel-section pixel-org" id="organisasi"><div className="pixel-wrap"><header className="pixel-heading"><div><small>[ 06 ]　ORGANISASI</small><h2>Wadah berkarya siswa</h2><p>Geser ke samping untuk melihat organisasi siswa.</p></div></header><div className="pixel-org-grid">{organizations.map(([name,desc,tone,photo])=><article key={name}><div className={`org-photo ${tone}`}><Image src={`/images/organizations/${photo}`} alt={`Kegiatan ${name}`} fill sizes="(max-width: 620px) 78vw, 25vw"/></div><b>{name}<small>{desc}</small></b></article>)}</div><Link className="pixel-org-button" href="/organisasi">Lihat semua organisasi <Arrow /></Link></div></section>
    <section className="pixel-gallery pixel-section" id="galeri"><div className="pixel-wrap"><header className="pixel-heading"><div><small>[ 07 ]　GALERI KAMPUS</small><h2>Sekilas kehidupan sekolah</h2></div></header><div className="pixel-gallery-grid">{[["Upacara & kegiatan","gallery-lecture.jpg"],["Semangat 17 Agustus","gallery-banner.jpg"],["Kegiatan sekolah","gallery-school.jpg"],["Prestasi siswa","gallery-award.jpg"]].map(([title,photo])=><article key={title}><Image src={`/images/reference/design-v5/${photo}`} alt={title} fill sizes="(max-width: 620px) 50vw, 25vw"/></article>)}</div><Link className="pixel-gallery-button" href="/galeri">Buka galeri <Arrow /></Link></div></section>
    <section className="pixel-section pixel-faq" id="faq" aria-labelledby="home-faq-title"><div className="pixel-wrap"><header className="pixel-heading"><div><small>[ 08 ]　FAQ</small><h2 id="home-faq-title">Pertanyaan yang sering diajukan</h2><p>Jawaban singkat dan tautan menuju informasi sekolah yang relevan.</p></div><Link href="/kontak">Hubungi sekolah <Arrow /></Link></header><div className="pixel-faq-list">{homeFaq.map(([question,answer,href,label])=><details key={question}><summary>{question}</summary><p>{answer}</p><Link href={href}>{label}<Arrow /></Link></details>)}</div></div></section>
      <section className="pixel-section pixel-cta-section"><div className="pixel-wrap"><div className="pixel-cta pixel-cta-compact"><ChatOpenLink className="pixel-cta-mascot-link" aria-label="Mulai chat dengan Wilhelmina"><Image className="pixel-cta-mascot" src="/mascot.svg" alt="" width={96} height={96} unoptimized/></ChatOpenLink><div className="pixel-cta-content"><small>[ TANYA WILHELBOT ]</small><h2>Ada pertanyaan seputar sekolah?</h2><p className="pixel-cta-mobile-description">Wilhelbot siap menjawab soal program studi, jadwal, dan pengumuman sekolah.</p><p className="pixel-cta-desktop-description">Wilhelbot, asisten virtual SMKN 1 Jakarta, siap menjawab soal program studi, jadwal, dan pengumuman sekolah. Klik ikon bot di pojok kanan bawah kapan saja.</p><nav className="pixel-cta-chips desktop-cta-links" aria-label="Tautan bantuan chatbot"><Link href="/tentang">Info program studi</Link><Link href="/agenda">Jadwal &amp; agenda</Link><Link href="/kontak">Kontak sekolah</Link></nav><ChatOpenLink className="pixel-cta-start">Mulai Chat <Arrow /></ChatOpenLink></div></div></div></section>
  </div>;
}
