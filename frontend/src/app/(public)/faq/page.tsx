const documents = [
  "Surat Pernyataan Ketaatan Tata Tertib Bermaterai",
  "Pakta Integritas Bebas Narkoba & Anti-Tawuran",
  "Surat Izin Orang Tua Pengoperasian Mesin Bengkel",
  "Fotokopi SIM C & STNK Resmi (Bagi Pengendara Motor)",
  "Surat Keterangan Bebas Buta Warna (Bidang Keahlian Tertentu)",
  "Biodata Kontak Darurat Orang Tua / Wali Aktif"
];

const questions = [
  ["Bagaimana prosedur resmi pengajuan izin tidak masuk sekolah karena sakit atau keperluan penting?", "Izin sakit 1 hari wajib dikonfirmasi oleh Orang Tua/Wali ke Wali Kelas via pesan resmi atau portal siswa sebelum pukul 07.00 WIB. Untuk sakit lebih dari 1 hari, siswa wajib menyerahkan Surat Keterangan Dokter asli kepada Tim Piket/Wali Kelas pada hari pertama masuk kembali. Izin keperluan keluarga mendesak harus diajukan minimal H-1 menggunakan Surat Permohonan Izin Khusus."],
  ["Apa saja syarat dan aturan membawa sepeda motor ke lingkungan sekolah?", "Ketentuan membawa kendaraan mengikuti peraturan sekolah yang berlaku. Siswa wajib membawa SIM dan STNK yang sah serta mengikuti arahan petugas keamanan."],
  ["Kapan gawai (smartphone/laptop) boleh digunakan selama berada di sekolah?", "Penggunaan gawai mengikuti arahan guru dan ketentuan kegiatan belajar di sekolah."],
  ["Bagaimana mekanisme pemulihan poin jika siswa telah mendapatkan akumulasi sanksi disiplin?", "Silakan berkonsultasi dengan wali kelas atau tim kesiswaan untuk mengetahui tindak lanjut sesuai tata tertib sekolah."]
];

export default function FaqPage() {
  return <div className="faq-reference-page">
    <div className="faq-reference-grid">
      <section aria-labelledby="faq-documents-title">
        <small>PERSYARATAN ADMINISTRASI</small>
        <h1 id="faq-documents-title">Dokumen Kepatuhan Siswa</h1>
        <p>Daftar berkas wajib yang harus dikumpulkan dan diserahkan saat daftar ulang maupun pembaruan data akademik tahunan.</p>
        <ul>{documents.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
      </section>
      <section aria-labelledby="faq-title">
        <small>PUSAT TANYA JAWAB</small>
        <h2 id="faq-title">Frequently Asked Questions (FAQ)</h2>
        <p>Pertanyaan yang paling sering diajukan mengenai implementasi aturan, fasilitas kendaraan, perizinan, dan penanganan siswa.</p>
        <div className="faq-reference-questions">{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>
    </div>
  </div>;
}
