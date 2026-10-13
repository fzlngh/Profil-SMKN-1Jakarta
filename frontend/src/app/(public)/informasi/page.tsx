import type { Metadata } from "next";
import { InformationDesignedPage } from "@/components/InformationDesignedPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita Sekolah — SMK Negeri 1 Jakarta",
  description: "Kabar terbaru seputar prestasi, kegiatan, dan perkembangan akademik SMK Negeri 1 Jakarta."
};

export default function NewsPage() {
  return <InformationDesignedPage />;
}
