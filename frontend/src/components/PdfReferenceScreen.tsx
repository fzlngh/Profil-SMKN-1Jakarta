"use client";

import Image from "next/image";

const navigation = [
  { label: "Beranda", href: "/", x: 2.4, w: 7.2 },
  { label: "Program Keahlian", href: "/tentang", x: 10.6, w: 11.2 },
  { label: "Kesiswaan", href: "/kesiswaan", x: 22.3, w: 8.0 },
  { label: "Osis", href: "/osis", x: 30.8, w: 4.4 },
  { label: "Berita & PPDB", href: "/informasi", x: 35.7, w: 10.7 },
  { label: "Hubungi Kami", href: "/kontak", x: 47.1, w: 10.3 }
];

const referencePages = {
  home: { file: "page-02-02.png", height: 5130, alt: "Tampilan beranda SMK Negeri 1 Jakarta sebagaimana di PDF referensi" },
  contact: { file: "page-04-04.png", height: 2319, alt: "Tampilan pusat informasi dan bantuan SMK Negeri 1 Jakarta sebagaimana di PDF referensi" },
  programs: { file: "page-08-08.png", height: 9361, alt: "Tampilan program keahlian SMK Negeri 1 Jakarta sebagaimana di PDF referensi" },
  students: { file: "page-09-09.png", height: 5562, alt: "Tampilan kesiswaan SMK Negeri 1 Jakarta sebagaimana di PDF referensi" },
  organization: { file: "page-10-10.png", height: 4548, alt: "Tampilan organisasi siswa SMK Negeri 1 Jakarta sebagaimana di PDF referensi" },
  news: { file: "page-11-11.png", height: 2466, alt: "Tampilan berita dan PPDB SMK Negeri 1 Jakarta sebagaimana di PDF referensi" }
} as const;

export type PdfReferencePageName = keyof typeof referencePages;

export function PdfReferenceScreen({ page }: { page: PdfReferencePageName }) {
  const reference = referencePages[page];
  return <div className="pdf-reference-screen">
    <Image
      className="pdf-reference-canvas"
      src={`/pdf-reference/${reference.file}`}
      alt={reference.alt}
      width={1280}
      height={reference.height}
      sizes="100vw"
      unoptimized
      priority
    />
    <nav className="pdf-reference-hotspots" aria-label="Navigasi situs">
      {navigation.map((item) => <a key={item.href} href={item.href} aria-label={item.label} style={{ left: `${item.x}%`, width: `${item.w}%` }} />)}
      <button type="button" aria-label="Tanya Wilhel" onClick={() => window.dispatchEvent(new Event("open-school-chat"))} />
    </nav>
  </div>;
}
