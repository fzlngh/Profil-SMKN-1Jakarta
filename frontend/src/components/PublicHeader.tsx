"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PUBLIC_NAVIGATION } from "@/lib/public-knowledge";

export function PublicHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header site-header-reference">
      <div className="brand-row">
        <Link className="brand" href="/" aria-label="SMK Negeri 1 Jakarta, beranda">
          <Image className="brand-logo" src="/logo-sekolah.png" alt="Logo SMK Negeri 1 Jakarta" width={42} height={46} />
          <span className="brand-name">SMK NEGERI 1 JAKARTA</span>
        </Link>
        <button className="header-chat-button" type="button" onClick={() => window.dispatchEvent(new Event("open-school-chat"))}><span aria-hidden="true">◉</span> TANYA ASISTEN</button>
      </div>
      <div className="nav-shell">
        <nav className="main-nav" aria-label="Navigasi utama">
          {PUBLIC_NAVIGATION.map((l) => <Link key={l.href} href={l.href} aria-current={!l.href.includes("#") && pathname === l.href ? "page" : undefined}>{l.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
