import Image from "next/image";

const groups = [
  {
    category: "Organisasi Siswa Intra Sekolah",
    title: "OSIS",
    description: "Menggerakkan kegiatan kesiswaan, kepemimpinan, dan kolaborasi lintas program keahlian.",
    website: "osis.smkn1jakarta.sch.id",
    image: "/images/organizations/osis.jpg"
  },
  {
    category: "Gugus Depan SMKN 1 Jakarta",
    title: "Pramuka",
    description: "Melatih kemandirian, disiplin, dan kepedulian sosial melalui kegiatan kepramukaan.",
    website: "pramuka.smkn1jakarta.sch.id",
    image: "/images/organizations/pramuka.jpg"
  },
  {
    category: "Palang Merah Remaja",
    title: "PMR",
    description: "Pelatihan pertolongan pertama dan kegiatan kemanusiaan bersama siswa.",
    website: "pmr.smkn1jakarta.sch.id",
    image: "/images/organizations/pmr.jpg"
  },
  {
    category: "Pasukan Pengibar Bendera",
    title: "Paskibra",
    description: "Pembinaan baris-berbaris, kedisiplinan, dan cinta tanah air.",
    website: "paskibra.smkn1jakarta.sch.id",
    image: "/images/organizations/paskibra.jpg"
  },
  {
    category: "Kegiatan Keagamaan Siswa",
    title: "Rohis & Kerohanian",
    description: "Pembinaan karakter dan akhlak mulia melalui kegiatan keagamaan.",
    website: "rohis.smkn1jakarta.sch.id",
    image: "/images/organizations/rohis.jpg"
  },
  {
    category: "System Internet of Things",
    title: "SIOT",
    description: "Wadah eksplorasi robotika, pemrograman, dan persiapan kompetisi.",
    website: "robotik.smkn1jakarta.sch.id",
    image: "/images/organizations/siot.jpg"
  },
  {
    category: "Kegiatan Keagamaan Siswa",
    title: "Rohkris & Kerohanian",
    description: "Pembinaan karakter dan akhlak mulia melalui kegiatan keagamaan.",
    website: "rohkris.smkn1jakarta.sch.id",
    image: "/images/organizations/rohkris.jpg"
  },
  {
    category: "Ekstrakurikuler Teknologi",
    title: "ESSA Media",
    description: "Wadah eksplorasi fotografi, videografi, jurnalistik digital, dan pengelolaan media sekolah.",
    website: "essamedia.smkn1jakarta.sch.id",
    image: "/images/organizations/essa-media.jpg"
  },
  {
    category: "Ekstrakurikuler Seni & Budaya",
    title: "BAND",
    description: "Wadah eksplorasi musik, olah vokal, aransemen lagu, dan persiapan tampil dalam berbagai event sekolah.",
    website: "band.smkn1jakarta.sch.id",
    image: "/images/organizations/band.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "FUTSAL",
    description: "Wadah pengembangan teknik dasar futsal, pembentukan fisik, kerja sama tim, dan persiapan Turnamen.",
    website: "futsal.smkn1jakarta.sch.id",
    image: "/images/organizations/futsal.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "Basket",
    description: "Wadah pengembangan teknik bermain basket, strategi tim, dan persiapan kompetisi antarsekolah.",
    website: "basket.smkn1jakarta.sch.id",
    image: "/images/organizations/basket.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "Voli",
    description: "Tempat melatih kerja sama tim, teknik dasar voli, fisik, dan mental bertanding dalam turnamen.",
    website: "voli.smkn1jakarta.sch.id",
    image: "/images/organizations/voli.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "Badminton",
    description: "Wadah mengasah kelincahan, teknik pukulan, ketahanan fisik, dan prestasi di bidang bulu tangkis.",
    website: "badminton.smkn1jakarta.sch.id",
    image: "/images/organizations/badminton.jpg"
  },
  {
    category: "Ekstrakurikuler Bela Diri",
    title: "Karate",
    description: "Tempat mempelajari seni bela diri, kedisiplinan, teknik pertahanan diri, dan mental juara.",
    website: "karate.smkn1jakarta.sch.id",
    image: "/images/organizations/karate.jpg"
  },
  {
    category: "Ekstrakurikuler Bela Diri",
    title: "Silat",
    description: "Wadah melestarikan budaya bela diri tradisional, teknik jurus, dan pembentukan karakter ksatria.",
    website: "silat.smkn1jakarta.sch.id",
    image: "/images/organizations/silat.jpg"
  },
  {
    category: "Karya Ilmiah Remaja",
    title: "KIR",
    description: "Wadah riset ilmiah, inovasi teknologi, dan persiapan kompetisi penelitian.",
    website: "kir.smkn1jakarta.sch.id",
    image: "/images/organizations/kir.jpg"
  }
];

export function OrganizationOverviewPage() {
  return <div className="reference-detail-page organization-overview">
    <header className="reference-detail-hero"><div><small>Beranda　/　Organisasi</small><h1>Organisasi Siswa</h1><p>Wadah pengembangan minat, bakat, dan kepemimpinan peserta didik.</p></div></header>
    <section className="organization-catalog detail-wrap" aria-label="Daftar organisasi siswa">
      <p className="organization-notice"><span aria-hidden="true">↗</span> Setiap organisasi punya website sendiri. Ketuk tombol website untuk membukanya.</p>
      <div>{groups.map((group) => <article key={group.title}>
        <a className="organization-card-link" href={`https://${group.website}`} target="_blank" rel="noopener noreferrer" aria-label={`${group.title}: buka website ${group.website} di tab baru`}>
          <div className="organization-card-photo">
            <Image src={group.image} alt={`Kegiatan ${group.title}`} fill sizes="(max-width: 700px) 92vw, (max-width: 1000px) 44vw, 30vw" />
          </div>
          <section className="organization-card-content">
            <small>{group.category}</small>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
            <span className="organization-open-note"><span aria-hidden="true">♧</span> Terbuka untuk semua program keahlian</span>
            <span className="organization-site-link">
              <span><small>WEBSITE RESMI</small><b>{group.website}</b></span><strong aria-hidden="true">↗</strong>
            </span>
          </section>
        </a>
      </article>)}</div>
    </section>
  </div>;
}
