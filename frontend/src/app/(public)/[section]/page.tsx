import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactServiceDesk } from "@/components/ContactServiceDesk";
import { PpdbReferencePage } from "@/components/ReferenceSectionPages";
import { StudentLifeDesignedPage } from "@/components/StudentLifeDesignedPage";
import { InformationDesignedPage } from "@/components/InformationDesignedPage";
import { ProgramDesignedPage } from "@/components/ProgramDesignedPage";
import { OrganizationDesignedPage } from "@/components/OrganizationDesignedPage";
import { PublicSection } from "@/components/PublicSection";
import { AgendaPage, AnnouncementPage, GalleryPage } from "@/components/ReferenceDetailPages";
import { OrganizationOverviewPage } from "@/components/OrganizationOverviewPage";
import { publicSections } from "@/lib/public-sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(publicSections).map((section) => ({ section })), ...["osis", "agenda", "pengumuman", "galeri", "organisasi"].map((section) => ({ section }))];
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  const data = publicSections[params.section];
  if (params.section === "tentang") return { title: "Program Studi — SMK Negeri 1 Jakarta", description: "Empat program keahlian dengan kurikulum yang selaras kebutuhan industri dan dunia kerja." };
  if (params.section === "osis") return { title: "Organisasi Siswa — SMK Negeri 1 Jakarta", description: "Informasi organisasi siswa." };
  if (params.section === "agenda") return { title: "Agenda Akademik — SMK Negeri 1 Jakarta", description: "Kalender kegiatan sekolah." };
  if (params.section === "pengumuman") return { title: "Pengumuman — SMK Negeri 1 Jakarta", description: "Informasi resmi sekolah." };
  if (params.section === "galeri") return { title: "Galeri Kampus — SMK Negeri 1 Jakarta", description: "Dokumentasi kegiatan siswa." };
  if (params.section === "organisasi") return { title: "Organisasi Siswa — SMK Negeri 1 Jakarta", description: "Wadah pengembangan minat dan kepemimpinan siswa." };
  return data ? { title: `${data.title} — SMK Negeri 1 Jakarta`, description: data.intro } : {};
}

export default async function InfoPage({ params }: { params: { section: string } }) {
  const data = publicSections[params.section];
  if (!data && !["osis", "agenda", "pengumuman", "galeri", "organisasi"].includes(params.section)) notFound();
  if (params.section === "osis") return <OrganizationDesignedPage />;
  if (params.section === "agenda") return <AgendaPage />;
  if (params.section === "pengumuman") return <AnnouncementPage />;
  if (params.section === "galeri") return <GalleryPage />;
  if (params.section === "organisasi") return <OrganizationOverviewPage />;
  if (params.section === "kontak") return <ContactServiceDesk />;
  if (params.section === "tentang") return <ProgramDesignedPage />;
  if (params.section === "kesiswaan") return <StudentLifeDesignedPage />;
  if (params.section === "ppdb") return <PpdbReferencePage />;
  if (params.section === "informasi") return <InformationDesignedPage />;
  return <PublicSection data={data!} />;
}
