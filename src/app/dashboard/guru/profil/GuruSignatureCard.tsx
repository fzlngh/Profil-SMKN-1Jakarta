"use client";

import { SignatureUploader } from "@/components/SignatureUploader";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

export function GuruSignatureCard({ userId, currentUrl }: { userId: string; currentUrl: string | null }) {
  const toast = useToast();
  const router = useRouter();

  async function handleUploaded(url: string) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("profiles").update({ tanda_tangan_url: url }).eq("id", userId);
    if (error) {
      toast("Gagal menyimpan tanda tangan: " + error.message, "err");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <SignatureUploader userId={userId} currentUrl={currentUrl} folder="ttd-guru" onUploaded={handleUploaded} />
      <div className="field-hint mt-2">Tanda tangan ini akan digunakan otomatis setiap kali Anda menyetujui berkas F01.</div>
    </div>
  );
}
