import { FilteredCards } from "./FilteredCards";
import { InquiryForm } from "./InquiryForm";
import { CmsFeedCards } from "./CmsFeedCards";
import type { PublicSectionData } from "@/lib/public-sections";
import type { CmsPublicFeed } from "@/lib/cms-public";

type PublicFeeds = Partial<Record<"news" | "announcements" | "academic-agenda", CmsPublicFeed>>;

const feedByBlock: Record<string, keyof PublicFeeds> = {
  berita: "news",
  pengumuman: "announcements",
  "agenda-akademik": "academic-agenda"
};

export function PublicSection({ data, feeds = {} }: { data: PublicSectionData; feeds?: PublicFeeds }) {
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
            {feedByBlock[block.id] && feeds[feedByBlock[block.id]]?.configured &&
              !feeds[feedByBlock[block.id]]?.available && (
                <p className="cms-feed-status" role="status">
                  Konten sekolah sementara tidak dapat dimuat. Silakan coba kembali nanti.
                </p>
              )}
            {feedByBlock[block.id] && feeds[feedByBlock[block.id]]?.available &&
              (feeds[feedByBlock[block.id]]?.items.length ? (
                <CmsFeedCards
                  resource={feedByBlock[block.id]}
                  items={feeds[feedByBlock[block.id]]?.items ?? []}
                />
              ) : (
                <p className="cms-feed-status">Belum ada konten yang diterbitkan untuk bagian ini.</p>
              ))}
            {!feedByBlock[block.id] && block.cards && block.categories && <FilteredCards cards={block.cards} categories={block.categories} />}
            {!feedByBlock[block.id] && block.cards && !block.categories && (
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