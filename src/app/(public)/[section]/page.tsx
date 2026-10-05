import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSection } from "@/components/PublicSection";
import { publicSections } from "@/lib/public-sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(publicSections).map((section) => ({ section }));
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  const data = publicSections[params.section];
  return data ? { title: `${data.title} — SMK Negeri 1 Jakarta`, description: data.intro } : {};
}

export default function InfoPage({ params }: { params: { section: string } }) {
  const data = publicSections[params.section];
  if (!data) notFound();
  return <PublicSection data={data} />;
}