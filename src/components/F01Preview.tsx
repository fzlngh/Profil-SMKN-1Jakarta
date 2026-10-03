import { SCHOOL } from "@/lib/constants";
import { fmtDate, tahunPendek } from "@/lib/format";
import type { AnggotaF01, PengajuanF01 } from "@/lib/types";
import Image from "next/image";

function SigCell({
  role,
  nama,
  idLabel,
  ttdUrl
}: {
  role: string;
  nama?: string | null;
  idLabel?: string | null;
  ttdUrl?: string | null;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="font-bold mb-2 text-[12px]">{role}</div>
      {ttdUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ttdUrl} alt="tanda tangan" className="h-[52px] object-contain mb-0.5" />
      ) : (
        <div className="w-[130px] border-b border-black h-[44px] mb-1" />
      )}
      <div className="font-bold underline text-[12px]">{nama || "\u00A0"}</div>
      <div className="text-[11px] mt-0.5">{idLabel || "-"}</div>
    </div>
  );
}

export function F01Preview({ sub, anggota }: { sub: PengajuanF01; anggota: AnggotaF01[] }) {
  const tglText = sub.finalized_at ? fmtDate(sub.finalized_at) : "……………………";
  const rows = [...anggota].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="bg-white border border-black rounded-lg overflow-hidden">
      <div className="h-[3px] bg-black" />
      <div className="flex items-center gap-4 px-6 py-4 border-b border-black">
        <Image src={SCHOOL.logo} alt="logo" width={48} height={52} />
        <div className="flex-1 text-center">
          <div className="text-[11.5px] font-semibold uppercase tracking-wide text-black">{SCHOOL.prov}</div>
          <h2 className="text-[14.5px]">{SCHOOL.name}</h2>
          <div className="text-[10.5px] text-muted mt-0.5">{SCHOOL.addr}</div>
        </div>
      </div>

      <div className="px-7 py-6 text-[12.5px]">
        <div className="text-center font-bold underline text-[14px] mb-5">
          FORMULIR PENGAJUAN CALON PESERTA PRAKTEK KERJA LAPANGAN
        </div>

        <table className="w-full border-collapse mb-1.5 [&_td]:border [&_th]:border [&_td]:border-black [&_th]:border-black [&_td]:p-2 [&_th]:p-2">
          <thead>
            <tr className="bg-[#EDEDED]">
              <th className="w-[26px]">No</th>
              <th>Nama Siswa/i</th>
              <th className="w-[90px]">NIS</th>
              <th>Kelas / Jurusan</th>
              <th className="w-[100px]">No. HP</th>
              <th className="w-[70px]">Paraf</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={a.id}>
                <td className="text-center">{i + 1}</td>
                <td className="font-bold">{a.nama}</td>
                <td className="font-mono text-center">{a.nis}</td>
                <td>
                  {a.kelas} / {a.jurusan}
                </td>
                <td className="font-mono">{a.no_hp || "-"}</td>
                <td className="text-center">
                  {a.paraf_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.paraf_url} alt="paraf" className="h-[30px] mx-auto object-contain" />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full border-collapse mb-1.5 [&_td]:border [&_th]:border [&_td]:border-black [&_th]:border-black [&_td]:p-2 [&_th]:p-2 [&_th]:text-left">
          <tbody>
            <tr>
              <th colSpan={2}>Nama Perusahaan</th>
              <td colSpan={3}>{sub.nama_perusahaan}</td>
            </tr>
            <tr>
              <th colSpan={2}>Alamat Kantor</th>
              <td colSpan={3}>{sub.alamat_kantor}</td>
            </tr>
            <tr>
              <th colSpan={2}>Alamat Tempat PKL</th>
              <td colSpan={3}>{sub.alamat_pkl}</td>
            </tr>
            <tr>
              <th rowSpan={3} className="w-[26px]">
                &nbsp;
              </th>
              <th>Nama Kontak</th>
              <td colSpan={3}>{sub.kontak_nama}</td>
            </tr>
            <tr>
              <th>Jabatan</th>
              <td colSpan={3}>{sub.kontak_jabatan}</td>
            </tr>
            <tr>
              <th>No. HP</th>
              <td colSpan={3} className="font-mono">
                {sub.kontak_hp}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>PKL untuk Bulan</th>
              <td colSpan={3}>
                {sub.bulan_mulai} s.d {sub.bulan_selesai} 20{tahunPendek(sub.tahun)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-right text-[12px] mb-2 pr-2 mt-4">Jakarta, {tglText}</div>
        <div className="text-[12px] mb-1">Mengetahui,</div>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <SigCell role="Ka. Program Keahlian" nama={sub.ka_nama} idLabel={sub.ka_nip ? "NIP. " + sub.ka_nip : null} ttdUrl={sub.ka_ttd_url} />
          <SigCell role="Wali Kelas" nama={sub.wali_nama} idLabel={sub.wali_nip ? "NIP. " + sub.wali_nip : null} ttdUrl={sub.wali_ttd_url} />
          <SigCell role="Guru BK/BP" nama={sub.bk_nama} idLabel={sub.bk_nip ? "NIP. " + sub.bk_nip : null} ttdUrl={sub.bk_ttd_url} />
          <SigCell
            role="Perwakilan Calon Peserta PKL"
            nama={sub.perwakilan_nama}
            idLabel={"NIS. " + sub.perwakilan_nis}
            ttdUrl={sub.perwakilan_ttd_url}
          />
        </div>
      </div>
    </div>
  );
}