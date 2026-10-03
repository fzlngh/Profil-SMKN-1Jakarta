import Image from "next/image";
import { SCHOOL } from "@/lib/constants";

export function Kop({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bg-white border border-paper-line border-b-0">
      <div className="rule-double" />
      <div className="flex items-center gap-4 px-7 py-5">
        <Image src={SCHOOL.logo} alt="Logo sekolah" width={56} height={61} className="flex-shrink-0" />
        <div className="flex-1 text-center">
          <div className="text-[12.5px] font-semibold uppercase tracking-wide text-navy">{SCHOOL.prov}</div>
          <h2 className={compact ? "text-[15px]" : "text-[17px]"}>{SCHOOL.name}</h2>
          {!compact && <div className="text-[11.5px] text-muted mt-0.5">{SCHOOL.addr}</div>}
        </div>
      </div>
    </div>
  );
}
