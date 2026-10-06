"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CmsPublicItem } from "@/lib/cms-public";

const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="M3.5 10h12m0 0-4.5-4.5M15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function HomeHero({ banners }: { banners: CmsPublicItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const banner = banners[activeIndex];
  const hasSlides = banners.length > 1;
  const changeSlide = (step: number) => {
    setActiveIndex((index) => (index + step + banners.length) % banners.length);
  };

  return (
    <section className="hero" id="beranda" aria-labelledby="hero-title" aria-roledescription={hasSlides ? "carousel" : undefined}>
      <div className="hero-photo">
        <Image
          src={banner?.image_url || "/images/school-campus-illustration.jpg"}
          alt={banner ? banner.title : "Foto ilustrasi lingkungan sekolah"}
          fill
          priority
          quality={70}
          sizes="100vw"
          unoptimized={Boolean(banner?.image_url)}
        />
      </div>
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="hero-glass">
          <div className="eyebrow hero-eyebrow"><span /> PROFIL SMK NEGERI 1 JAKARTA</div>
          <h1 id="hero-title">{banner ? banner.title : <>Ruang belajar.<br /><em>Ruang bertumbuh.</em></>}</h1>
          <p>{banner?.subtitle || "Mengenal sekolah, lingkungan belajar, program keahlian, dan cerita warganya—dalam satu ruang informasi."}</p>
          <div className="hero-actions">
            <Link className="button button-red" href="/tentang">Jelajahi profil <ArrowIcon /></Link>
            <Link className="hero-text-link" href={banner?.link_url || "/tentang#program"}>{banner?.link_url ? "Selengkapnya" : "Lihat program"} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
      {hasSlides && (
        <div className="hero-carousel-controls" aria-label="Navigasi foto kegiatan">
          <button type="button" onClick={() => changeSlide(-1)} aria-label="Tampilkan foto sebelumnya">←</button>
          <div className="hero-carousel-dots" role="group" aria-label="Pilih foto kegiatan">
            {banners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Tampilkan foto ${index + 1}: ${item.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" onClick={() => changeSlide(1)} aria-label="Tampilkan foto berikutnya">→</button>
          <span className="sr-only" aria-live="polite">{`Foto ${activeIndex + 1} dari ${banners.length}: ${banner?.title}`}</span>
        </div>
      )}
    </section>
  );
}
