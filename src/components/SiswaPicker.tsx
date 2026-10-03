"use client";

import { useState, useTransition } from "react";
import type { Profile } from "@/lib/types";
import { searchSiswaCandidates } from "@/lib/actions/submissions";

export function SiswaPicker({
  selected,
  onChange,
  excludeId
}: {
  selected: Profile[];
  onChange: (list: Profile[]) => void;
  excludeId: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [pending, startTransition] = useTransition();

  function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const excludeIds = [excludeId, ...selected.map(s => s.id)];
      const res = await searchSiswaCandidates(value, excludeIds);
      setResults(res.data || []);
    });
  }

  function add(p: Profile) {
    onChange([...selected, p]);
    setResults(r => r.filter(x => x.id !== p.id));
    setQuery("");
  }

  function remove(id: string) {
    onChange(selected.filter(s => s.id !== id));
  }

  return (
    <div>
      <input
        className="field-input"
        placeholder="Cari nama atau NIS siswa lain..."
        value={query}
        onChange={e => handleSearch(e.target.value)}
      />
      {pending && <div className="field-hint">Mencari...</div>}
      {results.length > 0 && (
        <div className="mt-2 border border-paper-line rounded-lg overflow-hidden">
          {results.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => add(p)}
              className="w-full text-left px-3 py-2 text-[13px] hover:bg-paper border-b border-paper-line last:border-none"
            >
              <span className="font-semibold">{p.nama_lengkap}</span>{" "}
              <span className="text-muted font-mono">({p.nis})</span> · {p.kelas}/{p.jurusan}
            </button>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {selected.map(p => (
            <div key={p.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-paper rounded-lg text-[13px]">
              <div>
                <span className="font-semibold">{p.nama_lengkap}</span>{" "}
                <span className="text-muted font-mono">({p.nis})</span> · {p.kelas}/{p.jurusan}
              </div>
              <button type="button" className="text-danger text-[12px] font-semibold" onClick={() => remove(p.id)}>
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="field-hint mt-2">
        Hanya siswa yang sudah mengunggah tanda tangan di profilnya sendiri yang dapat ditambahkan; paraf mereka akan
        terlampir otomatis dari akun masing-masing.
      </div>
    </div>
  );
}
