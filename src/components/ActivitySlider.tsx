"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    src: "/images/activities/individual-study.jpg",
    alt: "Ilustrasi siswa sedang menulis dan belajar di meja",
    title: "Belajar dengan tekun",
    description: "Gambaran umum suasana belajar, bukan dokumentasi kegiatan sekolah."
  },
  {
    src: "/images/activities/classroom-lesson.jpg",
    alt: "Ilustrasi suasana pembelajaran dan diskusi di kelas",
    title: "Bertukar gagasan di kelas",
    description: "Contoh suasana pembelajaran untuk melengkapi profil sekolah."
  },
  {
    src: "/images/activities/project-collaboration.jpg",
    alt: "Ilustrasi sekelompok orang berkolaborasi mengerjakan tugas",
    title: "Mengembangkan ide bersama",
    description: "Ilustrasi kolaborasi; bukan informasi program atau kegiatan resmi."
  },
  {
    src: "/images/activities/library-study.jpg",
    alt: "Ilustrasi pengunjung belajar di antara rak buku",
    title: "Menjelajah pengetahuan",
    description: "Foto ilustrasi suasana belajar, bukan gambaran fasilitas sekolah."
  }
];

export function ActivitySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const showSlide = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  return (
    <div className="activity-slider" role="region" aria-roledescription="carousel" aria-label="Foto ilustrasi kegiatan belajar">
      <div className="activity-slide" role="group" aria-roledescription="slide" aria-label={`Slide ${activeIndex + 1} dari ${slides.length}`}>
        <Image
          className="activity-slide-image"
          src={activeSlide.src}
          alt={activeSlide.alt}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 700px) 88vw, 1160px"
        />
        <div className="activity-slide-shade" aria-hidden="true" />
        <div className="activity-slide-caption" aria-live="polite" aria-atomic="true">
          <span>FOTO ILUSTRASI · BUKAN DOKUMENTASI SEKOLAH</span>
          <h3>{activeSlide.title}</h3>
          <p>{activeSlide.description}</p>
        </div>
      </div>
      <div className="activity-slider-controls">
        <div className="activity-indicators" role="group" aria-label="Pilih foto ilustrasi">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              className={`activity-indicator${index === activeIndex ? " is-active" : ""}`}
              type="button"
              aria-label={`Tampilkan foto ${index + 1}: ${slide.title}`}
              aria-pressed={index === activeIndex}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
        <span className="activity-slide-count" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <div className="activity-arrows">
          <button className="activity-arrow" type="button" aria-label="Foto sebelumnya" onClick={() => showSlide(activeIndex - 1)}>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16.5 10h-12m0 0L9 5.5M4.5 10 9 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="activity-arrow" type="button" aria-label="Foto berikutnya" onClick={() => showSlide(activeIndex + 1)}>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M3.5 10h12m0 0L11 5.5M15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
