import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnggotaF01, PengajuanF01 } from "@/lib/types";
import { SCHOOL } from "@/lib/constants";
import { fmtDate, tahunPendek, f01FileName } from "@/lib/format";

interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
}

async function loadImage(url: string): Promise<LoadedImage | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims = await new Promise<{ width: number; height: number }>(resolve => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({ width: 1, height: 1 });
      img.src = dataUrl;
    });
    return { dataUrl, width: dims.width, height: dims.height };
  } catch {
    return null;
  }
}

function fitBox(w: number, h: number, maxW: number, maxH: number) {
  const scale = Math.min(maxW / w, maxH / h, 1);
  return { w: w * scale, h: h * scale };
}

function centerText(doc: jsPDF, text: string, centerX: number, y: number) {
  const width = doc.getTextWidth(text);
  doc.text(text, centerX - width / 2, y);
  return width;
}

export async function generateF01Pdf(sub: PengajuanF01, anggota: AnggotaF01[]): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  doc.setFillColor(0, 0, 0);
  doc.rect(margin, margin, contentWidth, 3, "F");

  const logo = await loadImage(SCHOOL.logo.startsWith("http") ? SCHOOL.logo : window.location.origin + SCHOOL.logo);
  const logoBox = { w: 40, h: 44 };
  if (logo) {
    const fitted = fitBox(logo.width, logo.height, logoBox.w, logoBox.h);
    doc.addImage(logo.dataUrl, "PNG", margin, margin + 14, fitted.w, fitted.h);
  }

  const textLeft = margin + logoBox.w + 14;
  const textCenter = textLeft + (pageWidth - margin - textLeft) / 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  centerText(doc, SCHOOL.prov.toUpperCase(), textCenter, margin + 24);

  doc.setFontSize(13);
  centerText(doc, SCHOOL.name, textCenter, margin + 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  centerText(doc, SCHOOL.addr, textCenter, margin + 53);
  doc.setTextColor(0, 0, 0);

  doc.setDrawColor(0, 0, 0);
  doc.line(margin, margin + 66, pageWidth - margin, margin + 66);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const titleY = margin + 92;
  const title = "FORMULIR PENGAJUAN CALON PESERTA PRAKTEK KERJA LAPANGAN";
  const titleWidth = centerText(doc, title, pageWidth / 2, titleY);
  doc.line(pageWidth / 2 - titleWidth / 2, titleY + 2, pageWidth / 2 + titleWidth / 2, titleY + 2);

  const memberImages = await Promise.all(anggota.map(a => loadImage(a.paraf_url)));
  const sortedIdx = anggota
    .map((a, i) => ({ a, img: memberImages[i] }))
    .sort((x, y) => x.a.urutan - y.a.urutan);

  autoTable(doc, {
    startY: titleY + 16,
    margin: { left: margin, right: margin },
    head: [["No", "Nama Siswa/i", "NIS", "Kelas / Jurusan", "No. HP", "Paraf"]],
    body: sortedIdx.map((_, i) => ["", "", "", "", "", ""]),
    styles: { fontSize: 9, cellPadding: 5, lineColor: [0, 0, 0], lineWidth: 0.6, minCellHeight: 34, valign: "middle", textColor: [0, 0, 0] },
    headStyles: { fillColor: [235, 235, 235], textColor: [0, 0, 0], fontStyle: "bold", halign: "center" },
    columnStyles: {
      0: { cellWidth: 24, halign: "center" },
      1: { cellWidth: 140, fontStyle: "bold" },
      2: { cellWidth: 68, halign: "center" },
      3: { cellWidth: 118 },
      4: { cellWidth: 78 },
      5: { cellWidth: 68, halign: "center" }
    },
    didParseCell: data => {
      if (data.section !== "body") return;
      const row = sortedIdx[data.row.index];
      const col = data.column.index;
      if (col === 0) data.cell.text = [String(data.row.index + 1)];
      if (col === 1) data.cell.text = [row.a.nama];
      if (col === 2) data.cell.text = [row.a.nis];
      if (col === 3) data.cell.text = [`${row.a.kelas} / ${row.a.jurusan}`];
      if (col === 4) data.cell.text = [row.a.no_hp || "-"];
      if (col === 5) data.cell.text = [""];
    },
    didDrawCell: data => {
      if (data.section !== "body" || data.column.index !== 5) return;
      const row = sortedIdx[data.row.index];
      if (!row.img) return;
      const box = fitBox(row.img.width, row.img.height, data.cell.width - 8, data.cell.height - 8);
      const x = data.cell.x + (data.cell.width - box.w) / 2;
      const y = data.cell.y + (data.cell.height - box.h) / 2;
      doc.addImage(row.img.dataUrl, "PNG", x, y, box.w, box.h);
    }
  });

  let cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14;

  const infoRows: [string, string][] = [
    ["Nama Perusahaan", sub.nama_perusahaan],
    ["Alamat Kantor", sub.alamat_kantor],
    ["Alamat Tempat PKL", sub.alamat_pkl],
    ["Nama Kontak", sub.kontak_nama],
    ["Jabatan Kontak", sub.kontak_jabatan],
    ["No. HP Kontak", sub.kontak_hp],
    ["PKL untuk Bulan", `${sub.bulan_mulai} s.d ${sub.bulan_selesai} 20${tahunPendek(sub.tahun)}`]
  ];

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: infoRows,
    styles: { fontSize: 9.5, cellPadding: 6, lineColor: [0, 0, 0], lineWidth: 0.6, textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 150, fontStyle: "bold", fillColor: [235, 235, 235] },
      1: { cellWidth: contentWidth - 150 }
    }
  });

  cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const tglText = sub.finalized_at ? fmtDate(sub.finalized_at) : "……………………";
  const dateStr = `Jakarta, ${tglText}`;
  doc.text(dateStr, pageWidth - margin - doc.getTextWidth(dateStr), cursorY);

  cursorY += 16;
  doc.text("Mengetahui,", margin, cursorY);
  cursorY += 20;

  const [logoKa, logoWali, logoBk] = await Promise.all([
    loadImage(sub.ka_ttd_url || ""),
    loadImage(sub.wali_ttd_url || ""),
    loadImage(sub.bk_ttd_url || "")
  ]);
  const logoRep = await loadImage(sub.perwakilan_ttd_url);

  const cols = [
    { role: "Ka. Program Keahlian", nama: sub.ka_nama, idLabel: sub.ka_nip ? "NIP. " + sub.ka_nip : "NIP. -", img: logoKa },
    { role: "Wali Kelas", nama: sub.wali_nama, idLabel: sub.wali_nip ? "NIP. " + sub.wali_nip : "NIP. -", img: logoWali },
    { role: "Guru BK/BP", nama: sub.bk_nama, idLabel: sub.bk_nip ? "NIP. " + sub.bk_nip : "NIP. -", img: logoBk },
    { role: "Perwakilan Calon Peserta PKL", nama: sub.perwakilan_nama, idLabel: "NIS. " + sub.perwakilan_nis, img: logoRep }
  ];

  const colWidth = contentWidth / 4;
  const sigTop = cursorY;

  cols.forEach((c, i) => {
    const centerX = margin + colWidth * i + colWidth / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    centerText(doc, c.role, centerX, sigTop);

    const boxTop = sigTop + 8;
    if (c.img) {
      const box = fitBox(c.img.width, c.img.height, 70, 38);
      doc.addImage(c.img.dataUrl, "PNG", centerX - box.w / 2, boxTop, box.w, box.h);
    } else {
      doc.setDrawColor(0, 0, 0);
      doc.line(centerX - 35, boxTop + 34, centerX + 35, boxTop + 34);
    }

    const nameY = boxTop + 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    const nameWidth = centerText(doc, c.nama || "", centerX, nameY);
    doc.line(centerX - nameWidth / 2, nameY + 2, centerX + nameWidth / 2, nameY + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    centerText(doc, c.idLabel, centerX, nameY + 13);
  });

  return doc;
}

export async function downloadF01Pdf(sub: PengajuanF01, anggota: AnggotaF01[]) {
  const doc = await generateF01Pdf(sub, anggota);
  doc.save(f01FileName(sub.perwakilan_nama) + ".pdf");
}