# Catatan Revisi Website

## Fitur dan tampilan yang sudah tersedia
- Footer publik berisi identitas sekolah, kontak, navigasi, jam layanan, dan hak cipta.
- Tombol chatbot tersedia di navbar dan sebagai launcher mengambang. Panel percakapan mendukung riwayat selama sesi, input teks, kirim, status memuat, penanganan error, dikte suara browser, dan baca jawaban.
- Chatbot tidak menampilkan tombol percakapan baru, minimalkan, atau hapus percakapan sesuai instruksi revisi. Tombol tutup tetap tersedia.
- Pengumuman menggunakan ikon megafon konsisten pada banner mendesak, kartu pengumuman, dan ringkasan di beranda.
- Daftar dan detail berita tersedia melalui CMS pada `/berita` dan `/berita/[slug-atau-id]`.
- Animasi scroll, kartu, tombol, dan panel chatbot dibuat ringan serta mengikuti preferensi `prefers-reduced-motion`.

## Menjalankan
1. Masuk ke folder `frontend`.
2. Jalankan `npm ci`.
3. Salin `.env.example` menjadi `.env.local` dan isi konfigurasi yang diperlukan.
4. Jalankan `npm run dev` untuk pengembangan.
5. Jalankan `npm run build` dan `npm start` untuk verifikasi dan server produksi.

## Konfigurasi
- `NEXT_PUBLIC_CMS_API_URL`: URL CMS untuk daftar berita dan fallback chatbot lama.
- `CHAT_API_BASE_URL`: endpoint penyedia AI kompatibel OpenAI (default `https://api.openai.com/v1`).
- `CHAT_API_KEY`: kredensial AI server-only; jangan gunakan awalan `NEXT_PUBLIC_`.
- `CHAT_MODEL`: nama model AI.

Chatbot AI memerlukan `CHAT_API_KEY` dan `CHAT_MODEL`, atau CMS yang mendukung endpoint fallback. Feed berita memerlukan endpoint CMS `/api/public/news?limit=20&offset=0` dengan data dalam `data.items`. Tanpa konfigurasi tersebut, halaman terkait menampilkan status kosong/error yang sesuai.

## Verifikasi
- `npm run build` berhasil.
- `npx tsc --noEmit --incremental false` berhasil.
- Halaman pengumuman ditinjau di browser lokal; ikon megafon terlihat pada banner dan kartu, filter kategori bekerja, dan panel chatbot terbuka serta dapat ditutup.
- Endpoint AI memerlukan kredensial yang valid untuk menghasilkan jawaban langsung. Ketersediaan kredensial tidak disertakan di paket sumber.

## Perbaikan deployment live (12 Oktober 2026)
- Arsip sumber dicocokkan dengan struktur, teks, tautan, dan aset CSS yang disajikan pada deployment `frontend-xi-cyan-78.vercel.app` sebelum diedit.
- Header kini selalu menampilkan menu pada baris tersendiri, termasuk desktop. Tautan mempertahankan satu baris, tidak menyusut atau menimpa satu sama lain, dan dapat digulir mendatar di layar sempit.
- Tombol “Kirim email” menggunakan kuning-oranye yang sama dengan tombol utama di beranda.
- Panel chatbot dibatasi oleh tinggi viewport yang tersedia setelah ruang header dan safe area dikurangi. Fungsi percakapan, tombol tutup, dan launcher tetap dipakai; tidak ada kontrol drag.
- Ilustrasi peta di halaman kontak diganti dengan embed Google Maps. Alamat resmi dan koordinat `-6.1669, 106.8372` disimpan bersama agar embed serta seluruh tautan peta menuju titik yang sama.
- Build produksi dan pemeriksaan TypeScript berhasil setelah perubahan.
