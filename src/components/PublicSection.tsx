"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { PublicTools } from "@/components/PublicTools";
import type { PublicCard, PublicSectionData } from "@/lib/public-sections";

function FilteredCards({ cards, categories }: { cards: PublicCard[]; categories: string[] }) {
  const [selected, setSelected] = useState(categories[0]);
  const shown = cards.filter((card) => selected === categories[0] || card.category === selected);
  return <>
    <div className="filter-row" role="group" aria-label="Filter kategori">
      {categories.map((category) => <button type="button" key={category} aria-pressed={selected === category} className={selected === category ? "filter-chip selected" : "filter-chip"} onClick={() => setSelected(category)}>{category}</button>)}
    </div>
    <div className="public-card-grid" aria-live="polite">{shown.map((card) => <article className="public-card" key={card.title}>
      <span className="public-card-label">{card.label || card.category}</span><h2>{card.title}</h2><p>{card.description}</p>
    </article>)}</div>
  </>;
}

function InquiryForm() {
  const [message, setMessage] = useState("");
  function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Pemeriksaan lokal selesai. Pesan belum dikirim atau disimpan karena formulir ini belum terhubung ke layanan sekolah.");
  }
  return <form className="inquiry-form" onSubmit={validate}>
    <p>Isi formulir untuk memeriksa format pertanyaan. Saat ini tidak ada backend pengiriman.</p>
    <label htmlFor="inquiry-name">Nama <span aria-hidden="true">*</span></label>
    <input id="inquiry-name" name="name" autoComplete="name" required maxLength={100} />
    <label htmlFor="inquiry-email">Email <span aria-hidden="true">*</span></label>
    <input id="inquiry-email" name="email" type="email" autoComplete="email" required maxLength={160} />
    <label htmlFor="inquiry-topic">Topik</label>
    <select id="inquiry-topic" name="topic"><option>Informasi umum</option><option>Informasi PKL</option><option>Kemitraan</option><option>Lainnya</option></select>
    <label htmlFor="inquiry-message">Pesan <span aria-hidden="true">*</span></label>
    <textarea id="inquiry-message" name="message" required minLength={10} maxLength={2000} rows={5} />
    <button className="button button-navy" type="submit">Periksa formulir</button>
    <p className="form-disclaimer">Tidak ada pesan yang dikirim. Kontak resmi menunggu konfirmasi sekolah.</p>
    {message && <p className="form-status" role="status">{message}</p>}
  </form>;
}

export function PublicSection({ data }: { data: PublicSectionData }) {
  return <>
    <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
    <header className="site-header subpage-header">
      <a className="brand" href="/" aria-label="SMK Negeri 1 Jakarta, beranda"><Image className="brand-logo" src="/logo.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} /><span className="brand-name">SMK NEGERI 1 JAKARTA<small>SMKN1Plus · Belajar · Berkarya · Berdampak</small></span></a>
      <nav className="main-nav" aria-label="Navigasi utama">
        <a href="/tentang">Tentang</a><a href="/fakultas">Fakultas & staf</a><a href="/siswa">Siswa</a><a href="/program-vokasi">Program vokasi</a><a href="/prestasi">Prestasi</a><a href="/kegiatan">Kegiatan</a><a href="/kontak">Kontak</a>
      </nav>
      <a className="header-cta" href="/login">Portal siswa ↗</a>
    </header>
    <main id="main-content" className="public-subpage">
    <section className="subpage-hero section-wrap">
      <p className="eyebrow"><span /> {data.eyebrow}</p>
      <h1>{data.title}</h1>
      <p className="subpage-intro">{data.intro}</p>
      <p className="verification-tag">Informasi resmi: menunggu verifikasi sekolah</p>
    </section>
    <div className="subpage-body section-wrap">
      {data.cards && data.categories && <FilteredCards cards={data.cards} categories={data.categories} />}
      {data.cards && !data.categories && <div className="public-card-grid">{data.cards.map((card) => <article className="public-card" key={card.title}><span className="public-card-label">{card.label}</span><h2>{card.title}</h2><p>{card.description}</p></article>)}</div>}
      <div className="subpage-info-grid">{data.sections.map((section, index) => <section className="info-block" key={section.title}><span className="section-index">0{index + 1} / INFORMASI</span><h2>{section.title}</h2><p>{section.body}</p></section>)}</div>
      {data.contactForm && <InquiryForm />}
      <a className="back-home" href="/">← Kembali ke beranda</a>
    </div>
    </main>
    <footer className="site-footer public-footer">
      <div className="section-wrap footer-main"><a className="brand footer-brand" href="/"><Image className="brand-logo" src="/logo.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} /><span className="brand-name">SMK NEGERI 1 JAKARTA<small>Profil SMKN1Plus</small></span></a>
        <nav aria-label="Navigasi footer"><a href="/tentang">Tentang</a><a href="/kegiatan">Kegiatan</a><a href="/kontak">Kontak</a><a href="/login">SIM-PKL</a></nav></div>
      <div className="section-wrap footer-bottom"><span>Informasi resmi menunggu verifikasi sekolah.</span><span>Portal PKL: pengajuan melalui SIM-PKL.</span></div>
    </footer>
    <PublicTools />
  </>;
}
