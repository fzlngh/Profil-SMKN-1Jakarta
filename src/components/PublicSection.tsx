import { FilteredCards } from "./FilteredCards";
import { InquiryForm } from "./InquiryForm";
import type { PublicSectionData } from "@/lib/public-sections";

export function PublicSection({ data }: { data: PublicSectionData }) {
  return (
    <div className="public-subpage">
      <section className="subpage-hero section-wrap">
        <p className="eyebrow"><span /> {data.eyebrow}</p>
        <h1>{data.title}</h1>
        <p className="subpage-intro">{data.intro}</p>
      </section>

      {data.blocks.length > 1 && (
        <div className="page-tabs">
          <nav className="section-wrap" aria-label="Lompat ke bagian">
            {data.blocks.map((b) => <a key={b.id} href={`#${b.id}`}>{b.title}</a>)}
          </nav>
        </div>
      )}

      <div className="subpage-body section-wrap">
        {data.blocks.map((block) => (
          <section className="page-block" id={block.id} key={block.id}>
            <h2>{block.title}</h2>
            {block.body && <p>{block.body}</p>}
            {block.cards && block.categories && <FilteredCards cards={block.cards} categories={block.categories} />}
            {block.cards && !block.categories && (
              <div className="public-card-grid">
                {block.cards.map((card) => (
                  <article className="public-card" key={card.title}>
                    <span className="public-card-label">{card.label}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
        {data.contactForm && <InquiryForm />}
      </div>
    </div>
  );
}