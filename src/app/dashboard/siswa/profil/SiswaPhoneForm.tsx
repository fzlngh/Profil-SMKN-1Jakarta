"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { updateMyProfile } from "@/lib/actions/auth";

export function SiswaPhoneForm({ currentPhone }: { currentPhone: string | null }) {
  const [value, setValue] = useState(currentPhone || "");
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function handleSave() {
    startTransition(async () => {
      const result = await updateMyProfile({ noHp: value.trim() });
      if (result.error) {
        toast(result.error, "err");
        return;
      }
      toast("No. HP disimpan", "ok");
      router.refresh();
    });
  }

  return (
    <div className="kv items-center">
      <div className="text-muted">No. HP</div>
      <div className="flex items-center gap-2">
        <input className="field-input !py-1.5 !w-[160px]" value={value} onChange={e => setValue(e.target.value)} placeholder="08xxxxxxxxxx" />
        <button className="btn btn-ghost btn-sm" disabled={pending} onClick={handleSave}>
          Simpan
        </button>
      </div>
    </div>
  );
}
