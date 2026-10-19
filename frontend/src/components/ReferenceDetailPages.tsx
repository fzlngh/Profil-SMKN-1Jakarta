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
  ["Praktik di ruang bengkel","Praktik","gallery-workshop.jpg"]
];
const categories = ["Semua","Kegiatan","Praktik","Prestasi","Ekstrakurikuler"];
function PageHero({title,description}:{title:string;description:string}) { return <header className="reference-detail-hero"><div><small>Beranda / {title}</small><h1>{title}</h1><p>{description}</p></div></header>; }

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
  return <div className="reference-detail-page"><PageHero title="Galeri Kampus" description="Dokumentasi kegiatan, praktik, dan prestasi siswa."/><section className="detail-gallery detail-wrap"><div className="gallery-filters">{categories.map(item=><button key={item} aria-pressed={filter===item} onClick={()=>{setFilter(item);setShowMore(false)}}>{item}</button>)}</div><div className={`reference-gallery-grid ${filter === "Semua" ? `gallery-all${showMore?" gallery-expanded":""}` : "gallery-filtered"}`}>{visible.map(([item,,photo],index)=><article className={`gallery-tile tile-${index%6}${index>=6&&!showMore?" gallery-mobile-extra":""}`} key={item}><Image src={`/images/reference/design-v5/${photo}`} alt={item} fill sizes="(max-width: 600px) 50vw, 33vw" /></article>)}</div>{visible.length>6&&!showMore&&<button className="gallery-more" onClick={()=>setShowMore(true)}>Muat lebih banyak</button>}</section></div>;
}
