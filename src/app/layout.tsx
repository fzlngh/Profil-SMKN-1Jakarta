import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "SMK Negeri 1 Jakarta — Belajar, Berkarya, Berdampak",
  description: "Profil SMK Negeri 1 Jakarta, informasi program pembelajaran, kegiatan sekolah, dan Praktik Kerja Lapangan (PKL)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
