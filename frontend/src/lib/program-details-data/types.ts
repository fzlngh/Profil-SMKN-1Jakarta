import type { Program, ProgramColor } from "@/lib/programs";

export type CareerIcon =
  | "briefcase"
  | "palette"
  | "pen"
  | "video"
  | "devices"
  | "code"
  | "cloud"
  | "building"
  | "factory"
  | "hotel"
  | "network"
  | "server"
  | "screen"
  | "wrench"
  | "ruler"
  | "car"
  | "electric"
  | "shield"
  | "check"
  | "house"
  | "pipe";

export type ProgramLearningModule = {
  number: string;
  title: string;
  description: string;
  tags: string[];
};

export type ProgramCareerProspect = {
  icon: CareerIcon;
  title: string;
  description: string;
};

export type ProgramPartnerItem = {
  name: string;
  description: string;
  icon: CareerIcon;
  focus: string;
};

export type ProgramDetail = Omit<Program, "facilities" | "skills" | "certifications" | "partnerships" | "stats" | "overview"> & {
  color: ProgramColor;
  accentWord: string;
  heroImage: string;
  heroImageDimensions: { width: number; height: number; };
  durationSub: string;
  accreditationSub: string;
  capacity: string;
  capacitySub: string;
  dudiRate: string;
  dudiRateSub: string;
  curriculumTagline: string;
  curriculumTitle: string;
  curriculumDescription: string;
  learningModules: ProgramLearningModule[];
  careerTagline: string;
  careerTitle: string;
  careerProspects: ProgramCareerProspect[];
  partnersTagline: string;
  partnersTitle: string;
  partnersDescription: string;
  partnersNote: string;
  partners: ProgramPartnerItem[];
};

export type ProgramSourceData = {
  code: string;
  title: string;
  description: string;
  duration: string;
  durationSub: string;
  capacity: string;
  capacitySub: string;
  dudiRate: string;
  partnerNote?: string;
  competencies: Omit<ProgramLearningModule, "number">[];
  careers: { title: string; description: string; icon: CareerIcon }[];
};
