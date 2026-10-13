import Link from "next/link";

const groups = [
  ["Organisasi Siswa Intra Sekolah","OSIS","Menggerakkan kegiatan kesiswaan, kepemimpinan, dan kolaborasi lintas program keahlian.","blue"],
  ["Gugus Depan SMKN 1 Jakarta","Pramuka","Melatih kemandirian, disiplin, dan kepedulian sosial melalui kegiatan kepramukaan.","green"],
  ["Palang Merah Remaja","PMR","Pelatihan pertolongan pertama dan kegiatan kemanusiaan bersama siswa.","red"],
  ["Pasukan Pengibar Bendera","Paskibra","Pembinaan baris-berbaris, kedisiplinan, dan cinta tanah air.","orange"],
  ["Kegiatan Keagamaan Siswa","Rohis & Kerohanian","Pembinaan karakter dan akhlak mulia melalui kegiatan keagamaan.","teal"],
  ["Ekstrakurikuler Teknologi","Klub Robotik & Coding","Wadah eksplorasi robotika, pemrograman, dan persiapan kompetisi.","violet"]
];

export function OrganizationOverviewPage() {
  return <div className="reference-detail-page organization-overview"><header className="reference-detail-hero"><div><small>Beranda / Organisasi</small><h1>Organisasi Siswa</h1><p>Wadah pengembangan minat, bakat, dan kepemimpinan peserta didik SMK Negeri 1 Jakarta.</p></div></header><section className="organization-catalog detail-wrap"><div>{groups.map(([category,title,description,color])=><article key={title}><div className={`organization-art ${color}`}><span>▧</span><small>Foto kegiatan</small></div><section><small>{category}</small><h2>{title}</h2><p>{description}</p><span>♧ &nbsp; Terbuka untuk semua program keahlian</span></section></article>)}</div><p>Informasi kegiatan organisasi mengikuti pengumuman resmi sekolah.</p><Link href="/osis">Informasi OSIS &amp; MPK <span aria-hidden="true">→</span></Link></section></div>;
}
