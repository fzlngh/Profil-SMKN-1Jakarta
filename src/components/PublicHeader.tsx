"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/kontak", label: "Kontak" }
];

export function PublicHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="SMK Negeri 1 Jakarta, beranda">
        <Image className="brand-logo" src="/logo.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} />
        <span className="brand-name">SMK NEGERI 1 JAKARTA<small>PROFIL SEKOLAH · JAKARTA</small></span>
      </Link>
      <nav className="main-nav" aria-label="Navigasi utama">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>{l.label}</Link>
        ))}
      </nav>
      <Link className="header-cta" href="/login">Portal siswa ↗</Link>
    </header>
  );
}