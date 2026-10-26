import Image from "next/image";
import Link from "next/link";
import type { ProgramDetail } from "@/lib/program-details-data/types";
import { ProgramDetailIcon } from "@/components/ProgramDetailIcon";

export function ProgramDetailPage({ program }: { program: ProgramDetail }) {
  return (
    <div className={`program-detail-page program-detail--${program.color}`}>
      <div className="program-detail-breadcrumb">
        <div className="program-detail-wrap">
          <Link href="/tentang#program-list">← Kembali ke Daftar Program Studi</Link>
          <nav aria-label="Breadcrumb">
            <span className="program-detail-breadcrumb-path">
              <span className="program-detail-breadcrumb-text">
                <Link href="/">Beranda</Link>
                <span aria-hidden="true">/</span>
                <Link href="/tentang">Program Studi</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{program.title} ({program.code})</span>
              </span>
            </span>
          </nav>
        </div>
      </div>

      <section className="program-detail-hero">
        <div className="program-detail-wrap program-detail-hero-grid">
          <div className="program-detail-hero-copy">
            <div className="program-detail-badges">
              <span>✦ {program.accreditation}</span>
              <span>Kurikulum Merdeka</span>
            </div>
            <h1>{program.title} <span>{program.accentWord}</span></h1>
            <p>{program.description}</p>
            <div className="program-detail-facts">
              <article>
                <small>DURASI</small>
                <strong>{program.duration}</strong>
                <span>{program.durationSub}</span>
              </article>
              <article>
                <small>KUOTA MASUK</small>
                <strong>{program.capacity}</strong>
                <span>{program.capacitySub}</span>
              </article>
              <article>
                <small>SERAPAN KERJA (SIMULASI)</small>
                <strong>{program.dudiRate}</strong>
                <span>{program.dudiRateSub}</span>
              </article>
            </div>
          </div>

          <figure className="program-detail-hero-image">
            <Image
              src={program.heroImage}
              alt={program.imageAlt || "Foto praktik siswa " + program.title}
              width={program.heroImageDimensions.width}
              height={program.heroImageDimensions.height}
              priority
              sizes="(max-width: 760px) 100vw, 38vw"
              style={{ width: "100%", height: "auto" }}
            />
          </figure>
        </div>
          <div className="program-detail-facts program-detail-facts-mobile">
            <article>
              <small>DURASI</small>
              <strong>{program.duration}</strong>
              <span>{program.durationSub}</span>
            </article>
            <article>
              <small>KUOTA MASUK</small>
              <strong>{program.capacity}</strong>
              <span>{program.capacitySub}</span>
            </article>
            <article>
              <small>SERAPAN KERJA (SIMULASI)</small>
              <strong>{program.dudiRate}</strong>
              <span>{program.dudiRateSub}</span>
            </article>
          </div>
      </section>

      <section className="program-detail-curriculum" id="kompetensi">
        <div className="program-detail-wrap">
          <header className="program-detail-section-heading">
            <span>{program.curriculumTagline}</span>
            <h2>{program.curriculumTitle}</h2>
            <p>{program.curriculumDescription}</p>
          </header>
          <div className="program-detail-learning-grid">
            <div className="program-detail-module-list">
              <h3><ProgramDetailIcon name="building" /> Materi &amp; Keahlian Utama</h3>
              {program.learningModules.map((module, index) => (
                <article className="program-detail-module" key={module.number}>
                  <span className={`program-detail-module-number program-detail-module-number--${index % 3}`}>
                    {module.number}
                  </span>
                  <div className="program-detail-module-content">
                    <div className="program-detail-module-title">
                      <h4>{module.title}</h4>
                    </div>
                    <p>{module.description}</p>
                    <div className="program-detail-tags">
                      {module.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="program-detail-careers">
              <h3><ProgramDetailIcon name="briefcase" /> {program.careerTitle}</h3>
              {program.careerProspects.map((career) => (
                <article className="program-detail-career" key={career.title}>
                  <span className="program-detail-career-icon"><ProgramDetailIcon name={career.icon} /></span>
                  <div>
                    <h4>{career.title}</h4>
                    <p>{career.description}</p>
                  </div>
                </article>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="program-detail-partners">
        <div className="program-detail-wrap">
          <header className="program-detail-section-heading program-detail-section-heading--partners">
            <span>{program.partnersTagline}</span>
            <h2>{program.partnersTitle}</h2>
            <p>{program.partnersDescription}</p>
            {program.partnersNote && <p className="program-detail-partner-note">{program.partnersNote}</p>}
          </header>
          <div className="program-detail-partner-grid">
            {program.partners.map((partner) => (
              <article className="program-detail-partner" key={partner.name}>
                <span className="program-detail-partner-icon"><ProgramDetailIcon name={partner.icon} /></span>
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                <span className="program-detail-partner-focus">
                  <ProgramDetailIcon name="check" />
                  <span>{partner.focus}</span>
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
