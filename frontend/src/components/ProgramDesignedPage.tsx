"use client";

const programs = [
  { code:"RPL",title:"Rekayasa Perangkat Lunak",description:"Mempelajari pengembangan perangkat lunak mulai dari analisis kebutuhan, perancangan antarmuka, hingga pemrograman aplikasi web dan mobile.",tags:["Pemrograman Web","Aplikasi Mobile","Basis Data","UI/UX"],career:"Software Developer, Web Developer, QA Engineer",color:"blue" },
  { code:"TKJ",title:"Teknik Komputer & Jaringan",description:"Mempelajari perakitan komputer, instalasi dan konfigurasi jaringan, administrasi server, serta dasar keamanan siber.",tags:["Jaringan Komputer","Administrasi Server","Keamanan Siber","Cloud Dasar"],career:"Network Engineer, System Administrator, IT Support",color:"teal" },
  { code:"TKR",title:"Teknik Kendaraan Ringan",description:"Mempelajari perawatan dan perbaikan mesin, sistem kelistrikan, serta sasis kendaraan ringan sesuai standar bengkel modern.",tags:["Mesin Otomotif","Kelistrikan Kendaraan","Sasis & Pemindah Daya","Tune-up"],career:"Mekanik Otomotif, Service Advisor, Teknisi Bengkel",color:"orange" },
  { code:"TOI",title:"Teknik Otomasi Industri",description:"Mempelajari perancangan, pemasangan, dan perawatan sistem kontrol otomatis seperti PLC, pneumatik, dan robotika industri.",tags:["PLC & Kontrol","Sistem Pneumatik","Robotika Dasar","Instrumentasi"],career:"Teknisi Otomasi, Maintenance Engineer, Operator Produksi",color:"violet" }
];

export function ProgramDesignedPage() {
  return <div className="program-reference-page">
    <section className="program-page-hero"><div className="program-page-wrap"><nav className="program-page-breadcrumb" aria-label="Lokasi halaman"><a href="/">Beranda</a><span aria-hidden="true">/</span><span aria-current="page">Program Studi</span></nav><h1>Program Studi</h1><p>Empat program keahlian dengan kurikulum yang selaras kebutuhan industri dan dunia kerja.</p></div></section>
    <section className="program-page-content"><div className="program-page-wrap program-list" id="program-list">{programs.map((program,index)=><article className={`program-row ${index%2 ? "reverse" : ""}`} id={`program-${program.code.toLowerCase()}`} key={program.code}>
      <div className={`program-art ${program.color}`}><span aria-hidden="true">▧</span><small>Foto praktik {program.code}</small></div>
      <div className="program-info"><small className={`program-code ${program.color}`}>{program.code}</small><h2>{program.title}</h2><p>{program.description}</p><div className={`program-tags ${program.color}`}>{program.tags.map(tag=><span key={tag}>{tag}</span>)}</div><p className="program-career"><b>Prospek karier:</b> &nbsp;{program.career}</p><a href="#program-list">Lihat detail program <span aria-hidden="true">→</span></a></div>
    </article>)}
    <aside className="program-help"><div><h2>Masih bingung memilih program?</h2><p>Tanyakan ke asisten virtual untuk membandingkan program studi.</p></div><button type="button" onClick={()=>window.dispatchEvent(new Event("open-school-chat"))}>Tanya Chatbot ▢</button></aside></div></section>
  </div>;
}
