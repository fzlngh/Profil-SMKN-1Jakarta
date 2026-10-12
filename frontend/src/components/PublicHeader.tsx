"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PUBLIC_NAVIGATION } from "@/lib/public-knowledge";

export function SchoolMark() {
  return <Image className="school-mark" src="/logo-sekolah-transparent.png" alt="" aria-hidden="true" width={44} height={44} unoptimized />;
}

export function PublicHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header site-header-reference">
      <div className="brand-row">
        <Link className="brand" href="/" aria-label="SMK Negeri 1 Jakarta, beranda">
          <SchoolMark />
          <span className="brand-name">SMK Negeri 1 Jakarta</span>
        </Link>
        <Link className="header-chat-button" href="/kontak">
          <span className="header-phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7.2 3.5h2.4l1.2 4-1.8 1.6a14.2 14.2 0 0 0 5.9 5.9l1.6-1.8 4 1.2v2.4a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 5.2 5.7a2 2 0 0 1 2-2.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg></span>
          Hubungi Kami
        </Link>
      </div>
      <div className="nav-shell">
        <nav className="main-nav" aria-label="Navigasi utama">
          {PUBLIC_NAVIGATION.map((l) => <Link key={l.href} href={l.href} aria-current={!l.href.includes("#") && pathname === l.href ? "page" : undefined}>{l.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
