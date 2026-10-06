"use client";

import { FormEvent, useState } from "react";

export function InquiryForm() {
  const [message, setMessage] = useState("");
  function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Pemeriksaan lokal selesai. Pesan belum dikirim atau disimpan karena formulir ini belum terhubung ke layanan sekolah.");
  }
  return (
    <form className="inquiry-form" onSubmit={validate}>
      <p>Isi formulir untuk memeriksa format pertanyaan. Saat ini tidak ada backend pengiriman.</p>
      <label htmlFor="inquiry-name">Nama <span aria-hidden="true">*</span></label>
      <input id="inquiry-name" name="name" autoComplete="name" required maxLength={100} />
      <label htmlFor="inquiry-email">Email <span aria-hidden="true">*</span></label>
      <input id="inquiry-email" name="email" type="email" autoComplete="email" required maxLength={160} />
      <label htmlFor="inquiry-topic">Topik</label>
      <select id="inquiry-topic" name="topic">
        <option>Informasi umum</option>
        <option>Program keahlian</option>
        <option>Fasilitas sekolah</option>
        <option>Kegiatan &amp; prestasi</option>
        <option>Lainnya</option>
      </select>
      <label htmlFor="inquiry-message">Pesan <span aria-hidden="true">*</span></label>
      <textarea id="inquiry-message" name="message" required minLength={10} maxLength={2000} rows={5} />
      <button className="button button-navy" type="submit">Periksa formulir</button>
      {message && <p className="form-status" role="status">{message}</p>}
    </form>
  );
}