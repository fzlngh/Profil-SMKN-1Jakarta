"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MegaphoneIcon } from "@/components/MegaphoneIcon";

const announcementItems = [
  {kind:"Mendesak",date:"6 Okt 2026",title:"Pembaruan Data Peserta Didik Wajib Diselesaikan",detail:"Berlaku s/d 12 Okt"},
  {kind:"Info",date:"9 Okt 2026",title:"Jadwal Penilaian Tengah Semester Ganjil 2026/2027"},
  {kind:"Penting",date:"7 Okt 2026",title:"Pengumpulan Berkas Beasiswa Prestasi Diperpanjang"},
  {kind:"Info",date:"4 Okt 2026",title:"Pembagian Seragam Praktik untuk Kelas X"},
  {kind:"Penting",date:"3 Okt 2026",title:"Perubahan Jam Pelajaran Selama Pekan PTS"},
  {kind:"Info",date:"1 Okt 2026",title:"Pendaftaran Ekstrakurikuler Semester Ganjil Dibuka"}
];
const events = [
  ["15","OKT","Penilaian Tengah Semester (PTS) Ganjil","07.30–12.00","Ruang kelas masing-masing"],
  ["19","OKT","Pekan Kompetensi Keahlian & Pameran Karya","08.00–15.00","Lapangan & Aula Utama"],
  ["24","OKT","Pembagian Hasil PTS & Rapat Wali Murid","08.00–11.00","Aula Utama"],
  ["28","OKT","Upacara Hari Sumpah Pemuda","07.00–08.00","Lapangan Upacara"],
  ["30","OKT","Pelatihan Guru: Pembelajaran Berbasis Proyek","09.00–14.00","Ruang Multimedia"],
  ["03","NOV","Uji Kompetensi Keahlian (Gelombang 1)","07.00–15.00","Laboratorium program keahlian"]
];
const galleryItems: [string,string,string][] = [
  ["Kegiatan belajar bersama","Kegiatan","gallery-lecture.jpg"],
  ["Semangat peringatan 17 Agustus","Kegiatan","gallery-banner.jpg"],
  ["Upacara dan kegiatan sekolah","Kegiatan","gallery-school.jpg"],
  ["Prestasi siswa","Prestasi","gallery-award.jpg"],
  ["Pertandingan olahraga","Ekstrakurikuler","gallery-basketball.jpg"],
  ["Pentas seni siswa","Kegiatan","gallery-performance.jpg"],
  ["Pelatihan otomotif","Praktik","gallery-training.jpg"],
  ["Kegiatan bersama warga sekolah","Kegiatan","gallery-community.jpg"],
  ["Praktik di ruang bengkel","Praktik","gallery-workshop.jpg"],
  ["OSIS — galeri satu","Ekstrakurikuler","/images/organizations/archive/01-OSIS/01-galeri-satu.webp"],
  ["OSIS — galeri dua","Ekstrakurikuler","/images/organizations/archive/01-OSIS/02-galeri-dua.webp"],
  ["OSIS — galeri tiga","Ekstrakurikuler","/images/organizations/archive/01-OSIS/03-galeri-tiga.webp"],
  ["OSIS — galeri empat","Ekstrakurikuler","/images/organizations/archive/01-OSIS/04-galeri-empat.webp"],
  ["OSIS — galeri lima","Ekstrakurikuler","/images/organizations/archive/01-OSIS/05-galeri-lima.webp"],
  ["Pramuka — Perjusami","Ekstrakurikuler","/images/organizations/archive/02-Pramuka/01-perjusami-20.jpeg"],
  ["Pramuka — kegiatan satu","Ekstrakurikuler","/images/organizations/archive/02-Pramuka/02-perjusami-1.jpeg"],
  ["Pramuka — kegiatan dua","Ekstrakurikuler","/images/organizations/archive/02-Pramuka/03-perjusami-2.jpeg"],
  ["Pramuka — kegiatan tiga","Ekstrakurikuler","/images/organizations/archive/02-Pramuka/04-perjusami-3.jpeg"],
  ["Pramuka — kegiatan empat","Ekstrakurikuler","/images/organizations/archive/02-Pramuka/05-perjusami-4.jpeg"],
  ["Pramuka — LKP 2024, dokumentasi satu","Ekstrakurikuler","/images/organizations/archive/02-Pramuka/06-LKP-2024-01.jpg"],
  ["Pramuka — LKP 2024, dokumentasi dua","Ekstrakurikuler","/images/organizations/archive/02-Pramuka/07-LKP-2024-02.jpg"],
  ["Rohis — Isra Mikraj 2024, dokumentasi satu","Ekstrakurikuler","/images/organizations/archive/03-Rohis/01-Isra-Mikraj-2024-IMG0252.jpg"],
  ["Rohis — Isra Mikraj 2024, dokumentasi dua","Ekstrakurikuler","/images/organizations/archive/03-Rohis/02-Isra-Mikraj-2024-IMG0295.jpg"],
  ["Rohis — Maulid 2018, dokumentasi satu","Ekstrakurikuler","/images/organizations/archive/03-Rohis/03-Maulid-2018-080551.jpeg"],
  ["Rohis — Maulid 2018, dokumentasi dua","Ekstrakurikuler","/images/organizations/archive/03-Rohis/04-Maulid-2018-063506.jpeg"],
  ["Rohis — Maulid 2018, dokumentasi tiga","Ekstrakurikuler","/images/organizations/archive/03-Rohis/05-Maulid-2018-123646.jpeg"],
  ["Rohis — Maulid 2018, dokumentasi empat","Ekstrakurikuler","/images/organizations/archive/03-Rohis/06-Maulid-2018-123800.jpeg"],
  ["Rohis — Maulid 2018, dokumentasi lima","Ekstrakurikuler","/images/organizations/archive/03-Rohis/07-Maulid-2018-123634.jpeg"],
  ["Wilhelmina Cup 2017 — area turnamen","Kegiatan","/images/organizations/archive/04-Futsal-Voli-event/01-Wilhelmina-Cup-venue-2017.jpeg"],
  ["Wilhelmina Cup 2017 — dokumentasi panitia","Kegiatan","/images/organizations/archive/04-Futsal-Voli-event/02-Wilhelmina-Cup-panitia-2017.jpeg"],
  ["Basket — dokumentasi DBL satu","Ekstrakurikuler","/images/organizations/archive/05-Basket/01-DBL-article-photo-1.jpg"],
  ["Basket — dokumentasi DBL dua","Ekstrakurikuler","/images/organizations/archive/05-Basket/02-DBL-article-photo-2.jpg"],
  ["Silat — Championship V, dokumentasi satu","Ekstrakurikuler","/images/organizations/archive/06-Silat/01-Championship-V-foto-1.jpeg"],
  ["Silat — Championship V, dokumentasi dua","Ekstrakurikuler","/images/organizations/archive/06-Silat/02-Championship-V-foto-2.jpeg"],
  ["Silat — Championship V, foto utama","Ekstrakurikuler","/images/organizations/archive/06-Silat/03-Championship-V-featured.jpeg"],
  ["KIR — dokumentasi satu","Ekstrakurikuler","/images/organizations/archive/07-KIR/01-20240629-WA0006.avif"],
  ["KIR — dokumentasi dua","Ekstrakurikuler","/images/organizations/archive/07-KIR/02-20240629-WA0007.avif"],
  ["KIR — dokumentasi tiga","Ekstrakurikuler","/images/organizations/archive/07-KIR/03-20240629-WA0009.avif"],
  ["KIR — dokumentasi empat","Ekstrakurikuler","/images/organizations/archive/07-KIR/04-20240629-WA0010.avif"],
  ["KIR — dokumentasi lima","Ekstrakurikuler","/images/organizations/archive/07-KIR/05-20240629-WA0011.avif"],
  ["KIR — dokumentasi enam","Ekstrakurikuler","/images/organizations/archive/07-KIR/06-20260215-WA0028.avif"],
  ["KIR — dokumentasi tujuh","Ekstrakurikuler","/images/organizations/archive/07-KIR/07-20251002-WA0055.avif"],
  ["KIR — dokumentasi delapan","Ekstrakurikuler","/images/organizations/archive/07-KIR/08-20240629-WA0003.avif"],
  ["KIR — dokumentasi sembilan","Ekstrakurikuler","/images/organizations/archive/07-KIR/09-20240629-WA0004.avif"],
  ["KIR — Smandu","Ekstrakurikuler","/images/organizations/archive/07-KIR/10-smandu.avif"],
  ["KIR — Universitas Bakrie","Ekstrakurikuler","/images/organizations/archive/07-KIR/11-ubakrie.avif"]
];
const categories = ["Semua","Kegiatan","Praktik","Prestasi","Ekstrakurikuler"];
function PageHero({title,description}:{title:string;description:string}) { return <header className="reference-detail-hero"><div><small className="page-header-path">Beranda / {title}</small><h1>{title}</h1><p className="page-header-description">{description}</p></div></header>; }

export function AnnouncementPage({ title = "Pengumuman" }: { title?: string }) {
  const [filter,setFilter]=useState("Semua");
  const [query,setQuery]=useState("");
  const items=useMemo(()=>announcementItems.filter(item=>(filter==="Semua"||item.kind===filter)&&item.title.toLocaleLowerCase("id").includes(query.toLocaleLowerCase("id"))),[filter,query]);
  return <div className="reference-detail-page"><PageHero title={title} description="Informasi resmi untuk peserta didik, orang tua, dan warga sekolah."/><section className="detail-announcements detail-wrap"><div className="urgent-notice"><span><MegaphoneIcon /></span><div><b>MENDESAK</b><strong>Pembaruan data peserta didik wajib diselesaikan sebelum 12 Oktober 2026.</strong></div><small>Berlaku s/d 12 Okt</small></div><div className="detail-controls"><div>{["Semua","Info","Penting","Mendesak"].map(item=><button key={item} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}</div><input aria-label="Cari pengumuman" placeholder="Cari pengumuman..." value={query} onChange={e=>setQuery(e.target.value)}/><span>Menampilkan {items.length} pengumuman</span></div><div className="announcement-list">{items.map(item=><article className={`announcement-row ${item.kind.toLowerCase()}`} key={item.title}><i><MegaphoneIcon /></i><div><small><b>{item.kind}</b> &nbsp; {item.date}</small><h2>{item.title}</h2></div><span>{item.detail??"→"}</span></article>)}</div></section></div>;
}

export function AgendaPage() {
  const [month,setMonth]=useState(9);
  const monthLabels=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const monthCodes=["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"];
  const activeMonth=monthCodes[month];
  const visibleEvents=events.filter(([,mon])=>mon===activeMonth);
  const firstWeekday=new Date(2026,month,1).getDay();
  const daysInMonth=new Date(2026,month+1,0).getDate();
  const eventDays=new Set(visibleEvents.map(([day])=>Number(day)));
  return <div className="reference-detail-page"><PageHero title="Agenda Akademik" description="Kalender kegiatan sekolah sepanjang tahun 2026."/><section className="detail-agenda detail-wrap"><div className="agenda-events"><header><h2>{monthLabels[month]} 2026</h2><div><button aria-label="Bulan sebelumnya" onClick={()=>setMonth(current=>Math.max(0,current-1))} disabled={month===0}>←</button><button aria-label="Bulan berikutnya" onClick={()=>setMonth(current=>Math.min(11,current+1))} disabled={month===11}>→</button></div></header>{visibleEvents.length ? visibleEvents.map(([day,mon,title,time,place])=><article key={`${mon}-${day}`}><b><strong>{day}</strong><small>{mon}</small></b><div><h3>{title}</h3><p>◷ &nbsp;{time} &nbsp; ◉ &nbsp;{place}</p></div></article>) : <p className="agenda-empty">Belum ada agenda untuk bulan ini.</p>}</div><aside className="month-calendar"><h2>{monthLabels[month]} 2026</h2><div className="calendar-days">{["M","S","S","R","K","J","S"].map((d,i)=><b key={i}>{d}</b>)}{Array.from({length:42},(_,i)=>{const date=i-firstWeekday+1;const inMonth=date>0&&date<=daysInMonth;const hasEvent=inMonth&&eventDays.has(date);const isToday=month===9&&date===18;return <span className={`${hasEvent?"has-event":""}${isToday?" is-today":""}`} key={i}>{inMonth?date:""}</span>})}</div><p><i/> Ada agenda <em/> Hari ini</p></aside></section></div>;
}

export function GalleryPage() {
  const [filter,setFilter]=useState("Semua");
  const [showMore,setShowMore]=useState(false);
  const visible=galleryItems.filter(([,kind])=>filter==="Semua"||filter===kind);
  const itemsToShow=showMore?visible:visible.slice(0,9); const columns=Array.from({length:3},(_,column)=>itemsToShow.map((item,index)=>({item,index})).filter(({index})=>index%3===column));
  return <div className="reference-detail-page"><PageHero title="Galeri Sekolah" description="Dokumentasi kegiatan, praktik, dan prestasi siswa."/><section className="detail-gallery detail-wrap"><div className="gallery-filters">{categories.map(item=><button key={item} aria-pressed={filter===item} onClick={()=>{setFilter(item);setShowMore(false)}}>{item}</button>)}</div><div className={`reference-gallery-grid ${filter === "Semua" ? `gallery-all${showMore?" gallery-expanded":""}` : "gallery-filtered"}`}>{columns.map((column,columnIndex)=><div className={`gallery-column gallery-column-${columnIndex+1}`} key={columnIndex}>{column.map(({item,index})=><article className={`gallery-tile tile-${index+1}${index>=6&&!showMore?" gallery-mobile-extra":""}`} key={item[0]}><Image src={item[2].startsWith("/") ? item[2] : `/images/reference/design-v5/${item[2]}`} alt={item[0]} fill priority={index < 3} sizes="(max-width: 600px) 50vw, 33vw" /></article>)}</div>)}</div>{visible.length>itemsToShow.length&&<button className="gallery-more" onClick={()=>setShowMore(true)}>Muat lebih banyak</button>}</section></div>;
}
