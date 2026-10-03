export function fmtDate(iso: string | null): string {
  if (!iso) return "……………………";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );
}

export function f01FileName(namaSiswa: string): string {
  const safe = namaSiswa.trim().replace(/\s+/g, "_").replace(/[^\w-]/g, "");
  return `${safe}_surat-F01`;
}

export function tahunPendek(tahun: string): string {
  return String(tahun).slice(-2);
}
