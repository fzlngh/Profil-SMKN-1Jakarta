import { getProgramByCode } from "@/lib/programs";
import type { ProgramDetail } from "@/lib/program-details-data/types";
import { buildProgramDetail } from "./build-program-detail";
import { programSourceData } from "./catalog";

const programDisplayOrder = ["TKJ", "TKR", "DKV", "TKP", "DGM", "DPIB", "TITL", "TP", "SIJA", "RPL"];

export const programDetails: ProgramDetail[] = programDisplayOrder.map((code) => {
  const source = programSourceData.find((item) => item.code === code);
  if (!source) throw new Error(`Program detail data not found: ${code}`);
  const program = getProgramByCode(source.code);
  if (!program) throw new Error(`Program summary not found for detail page: ${source.code}`);
  return buildProgramDetail(program, source);
});

export function getProgramDetail(code: string): ProgramDetail | null {
  return programDetails.find((program) => program.code.toLowerCase() === code.toLowerCase()) ?? null;
}
