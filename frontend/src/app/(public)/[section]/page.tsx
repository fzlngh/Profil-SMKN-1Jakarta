import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactServiceDesk } from "@/components/ContactServiceDesk";
import { PpdbReferencePage } from "@/components/ReferenceSectionPages";
import { StudentLifeDesignedPage } from "@/components/StudentLifeDesignedPage";
import { InformationDesignedPage } from "@/components/InformationDesignedPage";
import { ProgramDesignedPage } from "@/components/ProgramDesignedPage";
import { OrganizationDesignedPage } from "@/components/OrganizationDesignedPage";
import { PublicSection } from "@/components/PublicSection";
import { publicSections } from "@/lib/public-sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(publicSections).map((section) => ({ section })), { section: "osis" }];
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  const data = publicSections[params.section];
  if (params.section === "osis") return { title: "Organisasi Siswa — SMK Negeri 1 Jakarta", description: "Informasi organisasi siswa." };
  return data ? { title: `${data.title} — SMK Negeri 1 Jakarta`, description: data.intro } : {};
}

export default async function InfoPage({ params }: { params: { section: string } }) {
  const data = publicSections[params.section];
  if (!data && params.section !== "osis") notFound();
  if (params.section === "osis") return <OrganizationDesignedPage />;
  if (params.section === "kontak") return <ContactServiceDesk />;
  if (params.section === "tentang") return <ProgramDesignedPage />;
  if (params.section === "kesiswaan") return <StudentLifeDesignedPage />;
  if (params.section === "ppdb") return <PpdbReferencePage />;
  if (params.section === "informasi") return <InformationDesignedPage />;
  return <PublicSection data={data!} />;
}
