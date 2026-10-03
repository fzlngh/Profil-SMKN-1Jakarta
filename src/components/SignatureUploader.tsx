"use client";

import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

function resizeImage(file: File, maxW: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("File harus berupa gambar"));
    const reader = new FileReader();
    reader.onload = e => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error("Gagal memproses gambar"))), "image/png");
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

export function SignatureUploader({
  userId,
  currentUrl,
  folder,
  onUploaded,
  label
}: {
  userId: string;
  currentUrl?: string | null;
  folder: string; // e.g. "ttd-guru" or "paraf-siswa"
  onUploaded: (publicUrl: string) => void;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const blob = await resizeImage(file, 320);
      const supabase = createSupabaseBrowserClient();
      const path = `${userId}/${folder}-${Date.now()}.png`;
      const { error: upErr } = await supabase.storage.from("signatures").upload(path, blob, {
        contentType: "image/png",
        upsert: true
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("signatures").getPublicUrl(path);
      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
      toast("Tanda tangan berhasil diunggah", "ok");
    } catch (err: any) {
      toast(err.message || "Gagal mengunggah tanda tangan", "err");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="border-[1.5px] border-dashed border-paper-line rounded-lg p-4 text-center bg-[#FCFBF8]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="tanda tangan" className="max-w-[220px] max-h-[100px] mx-auto mb-2.5" />
        ) : (
          <div className="text-[12.5px] text-muted py-4">Belum ada tanda tangan diunggah</div>
        )}
      </div>
      <label className="btn btn-ghost mt-2.5 cursor-pointer">
        {busy ? <span className="animate-spin h-4 w-4 border-2 border-navy/30 border-t-navy rounded-full" /> : "📎"}
        {preview ? "Ganti" : "Unggah"} {label || "Tanda Tangan"}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={busy} />
      </label>
      <div className="field-hint">Unggah foto/scan tanda tangan (JPG/PNG), ukuran akan otomatis disesuaikan.</div>
    </div>
  );
}
