"use client";

import { SignatureUploader } from "@/components/SignatureUploader";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { updateMyProfile } from "@/lib/actions/auth";

export function GuruSignatureCard({ userId, currentUrl }: { userId: string; currentUrl: string | null }) {
  const toast = useToast();
  const router = useRouter();

  async function handleUploaded(url: string) {
    const result = await updateMyProfile({ signatureUrl: url });
    if (result.error) {
      toast("Gagal menyimpan tanda tangan: " + result.error, "err");
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
