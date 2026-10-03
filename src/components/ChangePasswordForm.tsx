"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/lib/actions/auth";
import { useToast } from "@/components/Toast";

export function ChangePasswordForm() {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function handleSubmit() {
    if (value.length < 4) {
      toast("Kata sandi minimal 4 karakter", "err");
      return;
    }
    startTransition(async () => {
      const res = await changePassword(value);
      if (res.error) {
        toast(res.error, "err");
        return;
      }
      setValue("");
      toast("Kata sandi berhasil diganti", "ok");
    });
  }

  return (
    <div>
      <div className="mb-3.5">
        <label className="field-label">Kata Sandi Baru</label>
        <input
          type="password"
          className="field-input"
          placeholder="Minimal 4 karakter"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" disabled={pending} onClick={handleSubmit}>
        Simpan Kata Sandi
      </button>
    </div>
  );
}
