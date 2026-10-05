import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-inter" });
const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap", variable: "--font-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], display: "swap", variable: "--font-mono", preload: false });

export const metadata: Metadata = {
  title: "SMK Negeri 1 Jakarta — Belajar, Berkarya, Berdampak",
  description: "Profil SMK Negeri 1 Jakarta, informasi program pembelajaran, kegiatan sekolah, dan Praktik Kerja Lapangan (PKL)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${serif.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}