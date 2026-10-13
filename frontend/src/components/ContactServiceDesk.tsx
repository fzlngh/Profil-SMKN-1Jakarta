import Link from "next/link";
import { schoolAddress, schoolCoordinates, schoolMapEmbedUrl, schoolMapUrl } from "@/lib/school-location";
export function ContactServiceDesk() {
  return <div className="contact-page">
    <nav className="contact-breadcrumb section-wrap" aria-label="Lokasi halaman">Informasi kontak sekolah</nav>
    <section className="contact-page-hero section-wrap"><p className="eyebrow"><span /> SMK NEGERI 1 JAKARTA · JAKARTA PUSAT</p><h1>Hubungi SMK Negeri 1 Jakarta</h1><p className="contact-page-intro">Untuk informasi umum, hubungi sekolah melalui nomor telepon dan email yang tercantum pada halaman resmi sekolah.</p><a className="contact-hero-action" href="mailto:smkn1jakarta@gmail.com">Kirim email</a></section>
    <section className="contact-channel-grid section-wrap" aria-label="Kanal kontak sekolah">
      <article className="contact-channel-card"><span className="contact-channel-icon">⌖</span><small>ALAMAT SEKOLAH</small><p>{schoolAddress}</p><a href={schoolMapUrl} target="_blank" rel="noreferrer">Lihat peta</a></article>
      <article className="contact-channel-card"><span className="contact-channel-icon">☎</span><small>TELEPON</small><h3>(021) 381-3630</h3><a href="tel:+62213813630">Hubungi sekolah</a></article>
      <article className="contact-channel-card"><span className="contact-channel-icon">✉</span><small>EMAIL</small><p><a href="mailto:smkn1jakarta@gmail.com">smkn1jakarta@gmail.com</a></p><a href="mailto:smkn1jakarta@gmail.com">Kirim email</a></article>
      <article className="contact-channel-card contact-channel-warm"><span className="contact-channel-icon">⌕</span><small>FAKSIMILE</small><h3>(021) 350-4091</h3><p>Nomor faksimile pada halaman Identitas Sekolah.</p></article>
    </section>
    <section className="contact-service-layout section-wrap">
      <div className="contact-form-panel"><p className="eyebrow"><span /> INFORMASI KONTAK</p><h2>Alamat Sekolah</h2><p className="contact-form-intro">SMK Negeri 1 Jakarta berada di Kelurahan Pasar Baru, Kecamatan Sawah Besar, Jakarta Pusat. Koordinat peta: {schoolCoordinates}.</p><p><strong>Telepon:</strong> <a href="tel:+62213813630">021-3813630</a><br /><strong>Fax:</strong> 021-3504091<br /><strong>Email:</strong> <a href="mailto:smkn1jakarta@gmail.com">smkn1jakarta@gmail.com</a><br /><strong>Website:</strong> <a href="https://smkn1jakarta.sch.id/" target="_blank" rel="noreferrer">smkn1jakarta.sch.id</a></p><p>Jam layanan tata usaha, nomor posko SPMB, dan petunjuk akses belum dicantumkan karena belum dikonfirmasi.</p></div>
      <aside className="contact-details-column"><section className="contact-detail-card"><p className="eyebrow"><span /> PETA LOKASI</p><h2>SMK Negeri 1 Jakarta</h2><span className="contact-location-pill">Jl. Budi Utomo No. 7 · Pasar Baru</span><iframe className="contact-map-embed" src={schoolMapEmbedUrl} title="Peta lokasi SMK Negeri 1 Jakarta" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><p className="contact-map-address">{schoolAddress}</p><a href={schoolMapUrl} target="_blank" rel="noreferrer">Buka lokasi di Google Maps</a></section><section className="contact-detail-card contact-hours-card"><p className="eyebrow"><span /> KANAL RESMI</p><h2>Informasi sekolah</h2><p>Untuk informasi tahun ajaran berjalan, periksa situs sekolah dan portal SPMB DKI Jakarta.</p><ul><li><Link href="https://smkn1jakarta.sch.id/">Situs SMK Negeri 1 Jakarta</Link></li><li><Link href="https://spmb.jakarta.go.id/040401/pagu">Portal SPMB DKI Jakarta</Link></li></ul></section></aside>
    </section>
  </div>;
}
