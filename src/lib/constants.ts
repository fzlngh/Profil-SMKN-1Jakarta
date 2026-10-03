export const SCHOOL = {
  prov: "Pemerintah Provinsi Daerah Khusus Ibukota Jakarta",
  name: "Sekolah Menengah Kejuruan (SMK) Negeri 1 Jakarta",
  addr: "Jalan Budi Utomo No. 7 Jakarta Pusat · Telp/Fax (021) 3813630 · smkn1jakarta@gmail.com",
  logo: "/logo.png"
};

export const STEPS = [
  { key: "diajukan", label: "Diajukan Siswa" },
  { key: "menunggu_bk", label: "Guru BK/BP" },
  { key: "menunggu_wali_kelas", label: "Wali Kelas" },
  { key: "menunggu_ka_prodi", label: "Ka. Prodi" },
  { key: "selesai", label: "Selesai" }
] as const;
