import type { CareerIcon } from "@/lib/program-details-data/types";

type ProgramDetailIconProps = { name: CareerIcon; className?: string };

export function ProgramDetailIcon({ name, className }: ProgramDetailIconProps) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    focusable: false,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "briefcase":
      return <svg {...common}><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></svg>;
    case "palette":
      return <svg {...common}><path d="M12 3a9 9 0 1 0 0 18h1.3a2.2 2.2 0 0 0 1.5-3.8 1.7 1.7 0 0 1 1.2-2.9H18a3 3 0 0 0 3-3c0-4.6-4-8.3-9-8.3Z" /><circle cx="7.8" cy="10" r=".8" /><circle cx="11" cy="7.2" r=".8" /><circle cx="15" cy="7.7" r=".8" /></svg>;
    case "pen":
      return <svg {...common}><path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" /><path d="m14.8 6.2 3 3M4 20h5" /></svg>;
    case "video":
      return <svg {...common}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /><circle cx="9.5" cy="12" r="2.4" /></svg>;
    case "devices":
    case "screen":
      return <svg {...common}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M6 8h12" /></svg>;
    case "code":
      return <svg {...common}><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>;
    case "cloud":
      return <svg {...common}><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 9.4 4.3 4.3 0 0 0 7 18Z" /><path d="M9 14h6M12 11v6" /></svg>;
    case "building":
      return <svg {...common}><path d="M4 21V3h11v18M15 9h5v12M7 7h2m3 0h1m-6 4h2m3 0h1m-6 4h2m3 0h1M8 21v-3h3v3" /></svg>;
    case "factory":
      return <svg {...common}><path d="M3 21V11l5-3v4l5-4v4l5-3v12H3ZM18 10V4h3v17M7 17h2m3 0h2m3 0h1" /></svg>;
    case "hotel":
      return <svg {...common}><path d="M4 21V4h16v17M4 8h16M7 7v2m5-2v2m5-2v2m-10 3v2m5-2v2m5-2v2M9 21v-4h6v4" /></svg>;
    case "network":
      return <svg {...common}><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="m10.8 7.2-4.5 8.6m6.9-8.6 4.5 8.6M7.5 18h9" /></svg>;
    case "server":
      return <svg {...common}><rect x="4" y="3" width="16" height="7" rx="1.5" /><rect x="4" y="14" width="16" height="7" rx="1.5" /><path d="M8 6.5h.1M11 6.5h5M8 17.5h.1M11 17.5h5" /></svg>;
    case "wrench":
      return <svg {...common}><path d="M14.5 6.2a5 5 0 0 0-6.4 6.4L3.8 17a2.2 2.2 0 0 0 3.1 3.1l4.4-4.4a5 5 0 0 0 6.4-6.4l-3 3-3.3-3.3 3.1-2.8Z" /></svg>;
    case "ruler":
      return <svg {...common}><path d="m4 16 12-12 5 5L9 21l-5-5Z" /><path d="m13 7 2 2m-5 1 2 2m-5 1 2 2m-5 1 2 2" /></svg>;
    case "car":
      return <svg {...common}><path d="m5 11 2-5h10l2 5 2 2v5H3v-5l2-2Z" /><path d="M5 11h14M6 16h.1m11.8 0h.1M8 19v2m8-2v2" /><circle cx="7" cy="16" r="1.4" /><circle cx="17" cy="16" r="1.4" /></svg>;
    case "electric":
      return <svg {...common}><path d="M13 2 5 13h6l-1 9 9-12h-6l1-8Z" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.3 2.3 4.8-5" /></svg>;
    case "check":
      return <svg {...common}><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 14l2 2 4-4" /></svg>;
    case "house":
      return <svg {...common}><path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7" /></svg>;
    case "pipe":
      return <svg {...common}><path d="M4 4v7a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v1M2 4h4m-4 0v4m12 12h4m-4 0v-4" /></svg>;
  }
}