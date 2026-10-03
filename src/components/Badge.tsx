import type { SubmissionStatus } from "@/lib/types";
import { STAGE_LABEL } from "@/lib/types";

export function statusLabel(status: SubmissionStatus, rejectStageLabel?: string | null): string {
  if (status === "ditolak") return "Ditolak — perlu revisi";
  if (status === "selesai") return "Selesai";
  return "Menunggu " + STAGE_LABEL[status];
}

export function badgeClassFor(status: SubmissionStatus): string {
  if (status === "selesai") return "badge-ok";
  if (status === "ditolak") return "badge-danger";
  return "badge-warn";
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return <span className={`badge ${badgeClassFor(status)}`}>{statusLabel(status)}</span>;
}
