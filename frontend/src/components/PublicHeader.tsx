"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { PUBLIC_NAVIGATION } from "@/lib/public-knowledge";
import { ChatOpenLink } from "@/components/ChatOpenLink";

export function SchoolMark() {
  return <Image className="school-mark" src="/logo-sekolah-transparent.png" alt="" aria-hidden="true" width={44} height={44} unoptimized />;
}

export function PublicHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => setPortalReady(true), []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return (
    <>
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
        <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>
      <div className="nav-shell">
        <nav className="main-nav" aria-label="Navigasi utama">
          {PUBLIC_NAVIGATION.map((l) => <Link key={l.href} href={l.href} aria-current={!l.href.includes("#") && pathname === l.href ? "page" : undefined}>{l.label}</Link>)}
        </nav>
      </div>
    </header>
    {portalReady && createPortal(<>
      <button className={`mobile-menu-backdrop${menuOpen ? " is-open" : ""}`} type="button" aria-label="Tutup menu" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu} />
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobile-navigation" aria-hidden={!menuOpen} role="dialog" aria-modal={menuOpen || undefined} aria-label="Menu navigasi">
        <div className="mobile-menu-top"><div className="mobile-menu-brand"><SchoolMark /><span>SMK Negeri 1 Jakarta<small>SEKOLAH KEJURUAN</small></span></div><button type="button" aria-label="Tutup menu" onClick={closeMenu}>×</button></div>
        <nav aria-label="Navigasi mobile">
          {PUBLIC_NAVIGATION.map((item, index) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={closeMenu}><small>{String(index + 1).padStart(2, "0")}</small><span>{item.label}</span></Link>)}
        </nav>
        <div className="mobile-menu-actions">
          <ChatOpenLink className="mobile-menu-chat" onClick={closeMenu}><span>Tanya WilhelBot<small>Asisten virtual · online 24/7</small></span><b aria-hidden="true">›</b></ChatOpenLink>
          <Link className="mobile-menu-contact" href="/kontak" onClick={closeMenu}>Hubungi Kami　☎</Link>
          <small className="mobile-menu-contact-details">(021) 381-3630　/　SMKN1JAKARTA@GMAIL.COM</small>
        </div>
      </div>
    </>, document.body)}
    </>
  );
}
