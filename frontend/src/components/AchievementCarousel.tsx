"use client";

import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type Achievement = {
  award: string;
  title: string;
  description: string;
  year: string;
};

export function AchievementCarousel({ items }: { items: Achievement[] }) {
  return (
    <div className="achievement-carousel" aria-label="Arsip pencapaian siswa">
      <Swiper
        modules={[A11y, Keyboard, Navigation, Pagination]}
        slidesPerView={1.12}
        spaceBetween={12}
        keyboard={{ enabled: true, onlyInViewport: true }}
        navigation={{ nextEl: ".achievement-next", prevEl: ".achievement-prev" }}
        pagination={{ clickable: true, el: ".achievement-pagination" }}
        breakpoints={{
          620: { slidesPerView: 1.6, spaceBetween: 14 },
          900: { slidesPerView: 2.25, spaceBetween: 16 },
          1200: { slidesPerView: 2.8, spaceBetween: 18 }
        }}
        speed={380}
        a11y={{
          prevSlideMessage: "Pencapaian sebelumnya",
          nextSlideMessage: "Pencapaian berikutnya",
          firstSlideMessage: "Ini pencapaian pertama",
          lastSlideMessage: "Ini pencapaian terakhir"
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={`${item.title}-${index}`}>
            <article className="achievement-card">
              <div className="achievement-card-top"><span>{String(index + 1).padStart(2, "0")}</span><time>{item.year}</time></div>
              <strong className="achievement-card-award">{item.award}</strong>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="achievement-carousel-controls">
        <div className="achievement-pagination" aria-label="Pilih pencapaian" />
        <div className="achievement-carousel-buttons">
          <button className="achievement-prev" type="button" aria-label="Pencapaian sebelumnya">←</button>
          <button className="achievement-next" type="button" aria-label="Pencapaian berikutnya">→</button>
        </div>
      </div>
    </div>
  );
}
