import { STEPS } from "@/lib/constants";
import type { PengajuanF01 } from "@/lib/types";

function currentIndex(sub: PengajuanF01 | null): number {
  if (!sub) return -1;
  switch (sub.status) {
    case "menunggu_bk":
      return 1;
    case "menunggu_wali_kelas":
      return 2;
    case "menunggu_ka_prodi":
      return 3;
    case "selesai":
      return 4;
    default:
      return 0;
  }
}

function rejectedIndex(sub: PengajuanF01): number {
  const map: Record<string, number> = { guru_bk: 1, wali_kelas: 2, ka_prodi: 3 };
  return sub.reject_stage ? map[sub.reject_stage] ?? 1 : 1;
}

export function Stepper({ sub }: { sub: PengajuanF01 | null }) {
  const idx = currentIndex(sub);
  const rejected = sub?.status === "ditolak";
  return (
    <div className="flex items-start overflow-x-auto py-1">
      {STEPS.map((s, i) => {
        let cls = "";
        if (rejected) {
          cls = i === 0 ? "done" : i === rejectedIndex(sub!) ? "rejected" : "";
        } else if (i < idx) cls = "done";
        else if (i === idx) cls = "current";

        const dotClass =
          cls === "done"
            ? "bg-ok text-white border-ok"
            : cls === "current"
            ? "bg-gold text-white border-gold ring-4 ring-gold/20"
            : cls === "rejected"
            ? "bg-danger text-white border-danger"
            : "bg-[#EEECE3] text-muted border-[#EEECE3]";
        const lineClass = cls === "done" || cls === "current" ? "bg-ok" : "bg-[#EEECE3]";
        const lblClass = cls === "done" || cls === "current" || cls === "rejected" ? "text-ink" : "text-muted";

        return (
          <div key={s.key} className="flex flex-col items-center flex-1 min-w-[98px] relative">
            {i > 0 && <div className={`absolute top-[15px] left-[calc(-50%+15px)] w-full h-0.5 z-0 ${lineClass}`} />}
            <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12.5px] font-bold border-2 z-10 ${dotClass}`}>
              {cls === "done" ? "✓" : cls === "rejected" ? "✕" : i + 1}
            </div>
            <div className={`text-[11px] text-center mt-2 font-semibold leading-tight ${lblClass}`}>{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
