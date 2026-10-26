import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetailPage } from "@/components/ProgramDetailPage";
import { getProgramDetail, programDetails } from "@/lib/program-details";

export const dynamicParams = false;

export function generateStaticParams() {
  return programDetails.map((program) => ({ code: program.code.toLowerCase() }));
}

export function generateMetadata({ params }: { params: { code: string } }): Metadata {
  const program = getProgramDetail(params.code);
  return program
    ? { title: `${program.title} (${program.code}) — SMK Negeri 1 Jakarta`, description: program.description }
    : {};
}

export default function ProgramDetailRoute({ params }: { params: { code: string } }) {
  const program = getProgramDetail(params.code);
  if (!program) notFound();
  return <ProgramDetailPage program={program} />;
}
