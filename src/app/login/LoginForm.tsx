"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions/auth";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await signIn(formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit}>
      <div className="mb-4">
        <label className="field-label">Email</label>
        <input type="email" name="email" required placeholder="nama@sekolah.sch.id" autoComplete="username" className="field-input" />
      </div>
      <div className="mb-4">
        <label className="field-label">Kata Sandi</label>
        <input
          type="password"
          name="password"
          required
          placeholder="NIS / NIP / kata sandi"
          autoComplete="current-password"
          className="field-input"
        />
      </div>
      {error && <div className="text-danger text-[13px] mb-3">{error}</div>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? <span className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" /> : "Masuk"}
      </button>
    </form>
  );
}
