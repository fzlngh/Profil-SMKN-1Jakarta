import Image from "next/image";

type OrganizationGroup = {
  category: string;
  title: string;
  description: string;
  image: string;
};

const groups: OrganizationGroup[] = [
  {
    category: "Organisasi Siswa Intra Sekolah",
    title: "OSIS",
    description: "Menggerakkan kegiatan kesiswaan, kepemimpinan, dan kolaborasi lintas program keahlian.",
    image: "/images/organizations/archive/01-OSIS/01-galeri-satu.webp"
  },
  {
    category: "Gugus Depan SMKN 1 Jakarta",
    title: "Pramuka",
    description: "Melatih kemandirian, disiplin, dan kepedulian sosial melalui kegiatan kepramukaan.",
    image: "/images/organizations/pramuka.jpg"
  },
  {
    category: "Palang Merah Remaja",
    title: "PMR",
    description: "Pelatihan pertolongan pertama dan kegiatan kemanusiaan bersama siswa.",
    image: "/images/organizations/pmr.jpg"
  },
  {
    category: "Pasukan Pengibar Bendera",
    title: "Paskibra",
    description: "Pembinaan baris-berbaris, kedisiplinan, dan cinta tanah air.",
    image: "/images/organizations/paskibra.jpg"
  },
  {
    category: "Kegiatan Keagamaan Siswa",
    title: "Rohis & Kerohanian",
    description: "Pembinaan karakter dan akhlak mulia melalui kegiatan keagamaan.",
    image: "/images/organizations/archive/03-Rohis/01-Isra-Mikraj-2024-IMG0252.jpg"
  },
  {
    category: "System Internet of Things",
    title: "SIOT",
    description: "Wadah eksplorasi robotika, pemrograman, dan persiapan kompetisi.",
    image: "/images/organizations/siot.jpg"
  },
  {
    category: "Kegiatan Keagamaan Siswa",
    title: "Rohkris & Kerohanian",
    description: "Pembinaan karakter dan akhlak mulia melalui kegiatan keagamaan.",
    image: "/images/organizations/rohkris.jpg"
  },
  {
    category: "Ekstrakurikuler Teknologi",
    title: "ESSA Media",
    description: "Wadah eksplorasi fotografi, videografi, jurnalistik digital, dan pengelolaan media sekolah.",
    image: "/images/organizations/essa-media.jpg"
  },
  {
    category: "Ekstrakurikuler Seni & Budaya",
    title: "BAND",
    description: "Wadah eksplorasi musik, olah vokal, aransemen lagu, dan persiapan tampil dalam berbagai event sekolah.",
    image: "/images/organizations/band.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "FUTSAL",
    description: "Wadah pengembangan teknik dasar futsal, pembentukan fisik, kerja sama tim, dan persiapan Turnamen.",
    image: "/images/organizations/futsal.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "Basket",
    description: "Wadah pengembangan teknik bermain basket, strategi tim, dan persiapan kompetisi antarsekolah.",
    image: "/images/organizations/archive/05-Basket/01-DBL-article-photo-1.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "Voli",
    description: "Tempat melatih kerja sama tim, teknik dasar voli, fisik, dan mental bertanding dalam turnamen.",
    image: "/images/organizations/voli.jpg"
  },
  {
    category: "Ekstrakurikuler Olahraga",
    title: "Badminton",
    description: "Wadah mengasah kelincahan, teknik pukulan, ketahanan fisik, dan prestasi di bidang bulu tangkis.",
    image: "/images/organizations/badminton.jpg"
  },
  {
    category: "Ekstrakurikuler Bela Diri",
    title: "Karate",
    description: "Tempat mempelajari seni bela diri, kedisiplinan, teknik pertahanan diri, dan mental juara.",
    image: "/images/organizations/karate.jpg"
  },
  {
    category: "Ekstrakurikuler Bela Diri",
    title: "Silat",
    description: "Wadah melestarikan budaya bela diri tradisional, teknik jurus, dan pembentukan karakter ksatria.",
    image: "/images/organizations/archive/06-Silat/01-Championship-V-foto-1.jpeg"
  },
  {
    category: "Karya Ilmiah Remaja",
    title: "KIR",
    description: "Wadah riset ilmiah, inovasi teknologi, dan persiapan kompetisi penelitian.",
    image: "/images/organizations/kir.jpg"
  },
  {
    category: "Ekstrakurikuler Bahasa & Sastra",
    title: "English Club",
    description: "Wadah untuk melatih percakapan, kosakata, dan kepercayaan diri berbahasa Inggris melalui kegiatan bersama.",
    image: "/images/reference/design-v5/gallery-lecture.jpg"
  },
  {
    category: "Ekstrakurikuler Seni Pertunjukan",
    title: "Theater",
    description: "Wadah untuk mengembangkan seni peran, ekspresi, dan kerja sama dalam pertunjukan.",
    image: "/images/reference/design-v5/gallery-performance.jpg"
  }
];

export function OrganizationOverviewPage() {
  return <div className="reference-detail-page organization-overview">
    <header className="reference-detail-hero"><div><small className="page-header-path">Beranda　/　Organisasi</small><h1>Organisasi Siswa</h1><p className="page-header-description">Wadah pengembangan minat, bakat, dan kepemimpinan peserta didik.</p></div></header>
    <section className="organization-catalog detail-wrap" aria-label="Daftar organisasi siswa">
      <div>{groups.map((group) => <article key={group.title}>
        <div className="organization-card-link">
          <div className="organization-card-photo">
            <Image src={group.image} alt={`Kegiatan ${group.title}`} fill sizes="(max-width: 700px) 92vw, (max-width: 1000px) 44vw, 30vw" />
          </div>
          <section className="organization-card-content">
            <small>{group.category}</small>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
            <span className="organization-open-note"><span aria-hidden="true">♧</span> Terbuka untuk semua program keahlian</span>
            <span className="organization-site-link">
              <span><small>EKSTRAKURIKULER</small><b>Kegiatan siswa</b></span><strong aria-hidden="true">♧</strong>
            </span>
          </section>
        </div>
      </article>)}</div>
    </section>
  </div>;
}
