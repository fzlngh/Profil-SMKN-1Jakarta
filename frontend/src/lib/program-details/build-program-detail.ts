import type { Program } from "@/lib/programs";
import type { ProgramDetail, ProgramSourceData } from "@/lib/program-details-data/types";
import { programPartnerCandidates } from "./catalog";

const programHeroDimensions: Record<string, { width: number; height: number }> = {
  RPL: { width: 1280, height: 959 },
  TKJ: { width: 1280, height: 960 },
  TKR: { width: 1002, height: 768 },
  DKV: { width: 2560, height: 1440 },
  TKP: { width: 1052, height: 592 },
  DGM: { width: 768, height: 1024 },
  DPIB: { width: 952, height: 959 },
  TITL: { width: 1021, height: 768 },
  TP: { width: 1041, height: 545 },
  SIJA: { width: 1024, height: 768 },
};
export function buildProgramDetail(program: Program, source: ProgramSourceData): ProgramDetail {
  const heroImage = program.image || "/images/reference/program-rpl-photo.png";
  return {
    code: source.code,
    title: source.title,
    accentWord: `(${source.code})`,
    description: source.description,
    tags: source.competencies.flatMap((competency) => competency.tags),
    career: source.careers.map((career) => career.title).join(", ") || "Belum dirinci pada sumber jurusan",
    color: program.color,
    image: program.image,
    imageAlt: program.imageAlt || "Foto praktik siswa " + source.title,
    duration: source.duration,
    accreditation: "Akreditasi A (unggul)",
    heroImage,
    heroImageDimensions: programHeroDimensions[source.code] ?? { width: 1280, height: 960 },
    durationSub: source.durationSub,
    accreditationSub: "Akreditasi berlaku untuk sekolah, bukan penilaian terpisah per jurusan.",
    capacity: source.capacity,
    capacitySub: source.capacitySub,
    dudiRate: source.dudiRate,
    dudiRateSub: "Angka dummy/simulasi, bukan data aktual atau hasil survei.",
    curriculumTagline: "PROFIL & KOMPETENSI PROGRAM",
    curriculumTitle: "Kompetensi Keahlian",
    curriculumDescription: source.code === "SIJA"
      ? "Urutan kelas X–XIII merupakan rancangan pembelajaran untuk program empat tahun."
      : "Urutan materi kelas X–XII merupakan rancangan pembelajaran.",
    learningModules: source.competencies.map((competency, index) => ({
      number: competency.title.match(/^Kelas (XIII|XII|XI|X)\s+—\s*/)?.[1] ?? ["X", "XI", "XII", "XIII"][index] ?? String(index + 1),
      ...competency,
      title: competency.title.replace(/^Kelas (?:XIII|XII|XI|X)\s+—\s*/, ""),
    })),
    careerTagline: "PROSPEK KERJA",
    careerTitle: "Prospek Karier Lulusan",
    careerProspects: source.careers.map((career) => ({
      ...career,
    })),
    partnersTagline: "KEMITRAAN DUNIA USAHA & DUNIA INDUSTRI (DUDI)",
    partnersTitle: "Kandidat Mitra Industri & Penyerapan Lulusan",
    partnersDescription: "Kandidat mitra yang relevan dapat mendukung pembelajaran yang selaras dengan kebutuhan industri dan memberi siswa wawasan karier.",
    partnersNote: source.partnerNote ?? "",
    partners: programPartnerCandidates[source.code] ?? [],
  };
}
