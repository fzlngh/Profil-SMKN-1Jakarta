"use client";

import { useMemo, useState } from "react";
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
const galleryItems = [
  ["Upacara bendera","Kegiatan"],["Praktik otomotif","Praktik"],["Donor darah PMR","Kegiatan"],
  ["Praktik jaringan","Praktik"],["Lomba kompetensi","Prestasi"],["Pentas seni","Kegiatan"],
  ["Klub robotik","Ekstrakurikuler"],["Perpustakaan","Kegiatan"],["Kunjungan industri","Praktik"]
];
const categories = ["Semua","Kegiatan","Praktik","Prestasi","Ekstrakurikuler"];
function PageHero({title,description}:{title:string;description:string}) { return <header className="reference-detail-hero"><div><small>Beranda / {title}</small><h1>{title}</h1><p>{description}</p></div></header>; }

export function AnnouncementPage() {
  const [filter,setFilter]=useState("Semua");
  const [query,setQuery]=useState("");
  const items=useMemo(()=>announcementItems.filter(item=>(filter==="Semua"||item.kind===filter)&&item.title.toLocaleLowerCase("id").includes(query.toLocaleLowerCase("id"))),[filter,query]);
  return <div className="reference-detail-page"><PageHero title="Pengumuman" description="Informasi resmi untuk peserta didik, orang tua, dan seluruh warga sekolah."/><section className="detail-announcements detail-wrap"><div className="urgent-notice"><span><MegaphoneIcon /></span><div><b>Pengumuman mendesak</b><strong>Pembaruan data peserta didik wajib diselesaikan sebelum 12 Oktober 2026.</strong></div><small>Berlaku s/d 12 Okt</small></div><div className="detail-controls"><div>{["Semua","Info","Penting","Mendesak"].map(item=><button key={item} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}</div><input aria-label="Cari pengumuman" placeholder="Cari pengumuman..." value={query} onChange={e=>setQuery(e.target.value)}/><span>Menampilkan {items.length} pengumuman</span></div><div className="announcement-list">{items.map(item=><article className={`announcement-row ${item.kind.toLowerCase()}`} key={item.title}><i><MegaphoneIcon /></i><div><small><b>{item.kind}</b> &nbsp; {item.date}</small><h2>{item.title}</h2></div><span>{item.detail??"→"}</span></article>)}</div></section></div>;
}

export function AgendaPage() {
  const [month,setMonth]=useState(0);
  const labels=["September 2026","Oktober 2026","November 2026"];
  return <div className="reference-detail-page"><PageHero title="Agenda Akademik" description="Kalender kegiatan belajar, penilaian, dan acara sekolah semester ganjil 2026/2027."/><section className="detail-agenda detail-wrap"><div className="agenda-events"><header><h2>{labels[month+1]}</h2><div><button aria-label="Bulan sebelumnya" onClick={()=>setMonth(Math.max(-1,month-1))}>←</button><button aria-label="Bulan berikutnya" onClick={()=>setMonth(Math.min(1,month+1))}>→</button></div></header>{events.map(([day,mon,title,time,place])=><article key={day}><b><strong>{day}</strong><small>{mon}</small></b><div><h3>{title}</h3><p>◷ &nbsp;{time} &nbsp; ◉ &nbsp;{place}</p></div></article>)}</div><aside className="month-calendar"><h2>Kalender</h2><div className="calendar-days">{["S","S","R","K","J","S","M"].map((d,i)=><b key={i}>{d}</b>)}{Array.from({length:35},(_,i)=>{const date=i-3;return <span className={[10,15,19,24,28,30].includes(date)?"has-event":""} key={i}>{date>0&&date<=31?date:""}</span>})}</div><p><i/> Ada agenda <em/> Hari ini</p></aside></section></div>;
}

export function GalleryPage() {
  const [filter,setFilter]=useState("Semua");
  const visible=galleryItems.filter(([,kind])=>filter==="Semua"||filter===kind);
  return <div className="reference-detail-page"><PageHero title="Galeri Kampus" description="Dokumentasi kegiatan, praktik, dan prestasi siswa SMK Negeri 1 Jakarta."/><section className="detail-gallery detail-wrap"><div className="gallery-filters">{categories.map(item=><button key={item} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}</div><div className="reference-gallery-grid">{visible.map(([item],index)=><article className={`gallery-tile tile-${index%6}`} key={item}><span>▧<small>{item}</small></span></article>)}</div><button className="gallery-more" onClick={()=>setFilter("Semua")}>Muat lebih banyak</button></section></div>;
}
