"use client";

import { useState } from "react";
import type { PublicCard } from "@/lib/public-sections";

export function FilteredCards({ cards, categories }: { cards: PublicCard[]; categories: string[] }) {
  const [selected, setSelected] = useState(categories[0]);
  const shown = cards.filter((c) => selected === categories[0] || c.category === selected);
  return (
    <>
      <div className="filter-row" role="group" aria-label="Filter kategori">
        {categories.map((cat) => (
          <button type="button" key={cat} aria-pressed={selected === cat}
            className={selected === cat ? "filter-chip selected" : "filter-chip"}
            onClick={() => setSelected(cat)}>{cat}</button>
        ))}
      </div>
      <div className="public-card-grid" aria-live="polite">
        {shown.map((card) => (
          <article className="public-card" key={card.title}>
            <span className="public-card-label">{card.label || card.category}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </>
  );
}