"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("#main-content");
    if (!main) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [...main.querySelectorAll<HTMLElement>(
      [
        ":scope > section:not(.student-design-hero):not(.reference-hero)",
        ":scope > div > section:not(.student-design-hero):not(.reference-hero)",
        ".faq-reference-grid > section",
        ".pixel-program-card, .pixel-news-grid > article, .pixel-announcement, .pixel-event",
        ".program-row, .announcement-row, .agenda-events article, .gallery-tile",
        ".organization-catalog article, .organization-card, .news-card",
        "main table thead, main table tbody tr",
        "main img"
      ].join(", ")
    )];

    if (reduceMotion || !("IntersectionObserver" in window)) return;

    main.classList.add("scroll-reveal-enabled");
    targets.forEach((target, index) => {
      target.style.setProperty("--scroll-reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
      target.classList.add("scroll-reveal-item");
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      main.classList.remove("scroll-reveal-enabled");
      targets.forEach((target) => {
        target.classList.remove("scroll-reveal-item", "is-visible");
        target.style.removeProperty("--scroll-reveal-delay");
      });
    };
  }, [pathname]);

  return null;
}
