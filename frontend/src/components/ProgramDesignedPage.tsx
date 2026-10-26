"use client";

import Image from "next/image";
import Link from "next/link";
import { programDetails } from "@/lib/program-details";
import { programs } from "@/lib/programs";

export function ProgramDesignedPage() {
  return <div className="program-reference-page">
    <header className="program-page-hero desktop-program-hero"><div className="program-page-wrap"><span className="program-accent-line" aria-hidden="true"/><small className="program-page-breadcrumb">Beranda / Program Studi</small><h1>Program Studi</h1><p className="program-page-description">{programDetails.length} program keahlian dengan cakupan kompetensi yang beragam.</p><p className="program-page-mobile-description">{programDetails.length} program keahlian selaras kebutuhan industri dan dunia kerja.</p></div></header>
    <section className="program-page-content" id="career"><div className="program-page-wrap program-list" id="program-list">{programDetails.map((program,index)=>{const copy=programs.find((item)=>item.code===program.code) ?? program;return <article className={`program-row ${index%2 ? "reverse" : ""}`} id={`program-${program.code.toLowerCase()}`} key={program.code}>
      <div className={`program-art ${program.color}`}>{program.image ? <Image src={program.image} alt={program.imageAlt || `Kegiatan program ${copy.title}`} fill sizes="(max-width: 700px) 100vw, 34vw" /> : <div className="program-art-placeholder"><strong>{program.code}</strong><span>Kompetensi keahlian</span></div>}</div>
      <div className="program-info"><small className={`program-code ${program.color}`}>{program.code}</small><h2>{copy.title}</h2><p>{copy.description}</p>{copy.tags.length > 0 && <div className={`program-tags ${program.color}`}>{copy.tags.slice(0, 4).map(tag=><span key={tag}>{tag}</span>)}</div>}<p className="program-career"><b>Prospek karier:</b> &nbsp;{copy.career}</p><Link className="program-detail-link" href={`/program/${program.code.toLowerCase()}`}>Lihat detail program <span aria-hidden="true">→</span></Link></div>
    </article>})}
    </div></section>
    <aside className="program-help desktop-program-help program-page-wrap"><div><h2>Masih bingung memilih program?</h2><p>Tanyakan ke asisten virtual untuk membandingkan program studi.</p></div><button type="button" onClick={() => window.dispatchEvent(new Event("open-school-chat"))}>Tanya Chatbot ▢</button></aside>
  </div>;
}
