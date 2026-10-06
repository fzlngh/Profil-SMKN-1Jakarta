import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSection } from "@/components/PublicSection";
import { getCmsPublicFeed } from "@/lib/cms-public";
import { publicSections } from "@/lib/public-sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(publicSections).map((section) => ({ section }));
}

export function generateMetadata({ params }: { params: { section: string } }): Metadata {
  const data = publicSections[params.section];
  return data ? { title: `${data.title} — SMK Negeri 1 Jakarta`, description: data.intro } : {};
}

export default async function InfoPage({ params }: { params: { section: string } }) {
  const data = publicSections[params.section];
  if (!data) notFound();
  const feeds = params.section === "informasi"
    ? Object.fromEntries(await Promise.all(
      (["news", "announcements", "academic-agenda"] as const).map(async (resource) => [
        resource,
        await getCmsPublicFeed(resource)
      ])
    ))
    : undefined;
  return <PublicSection data={data} feeds={feeds} />;
}