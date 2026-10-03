export type UserRole = "siswa" | "guru_bk" | "wali_kelas" | "ka_prodi" | "superadmin";
export type SubmissionStatus = "menunggu_bk" | "menunggu_wali_kelas" | "menunggu_ka_prodi" | "selesai" | "ditolak";
export type RejectStage = "guru_bk" | "wali_kelas" | "ka_prodi";

export interface Profile {
  id: string;
  email: string;
  nama_lengkap: string;
  role: UserRole;
  nis: string | null;
  kelas: string | null;
  jurusan: string | null;
  no_hp: string | null;
  nip: string | null;
  tanda_tangan_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnggotaF01 {
  id: string;
  pengajuan_id: string;
  siswa_id: string;
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  no_hp: string | null;
  paraf_url: string;
  urutan: number;
  created_at: string;
}

export interface PengajuanF01 {
  id: string;
  created_by: string;

  perwakilan_nama: string;
  perwakilan_nis: string;
  perwakilan_ttd_url: string;

  nama_perusahaan: string;
  alamat_kantor: string;
  alamat_pkl: string;
  kontak_nama: string;
  kontak_jabatan: string;
  kontak_hp: string;

  bulan_mulai: string;
  bulan_selesai: string;
  tahun: string;

  status: SubmissionStatus;

  bk_id: string | null;
  bk_nama: string | null;
  bk_nip: string | null;
  bk_ttd_url: string | null;
  bk_approved_at: string | null;

  wali_kelas_id: string | null;
  wali_nama: string | null;
  wali_nip: string | null;
  wali_ttd_url: string | null;
  wali_approved_at: string | null;

  ka_prodi_id: string | null;
  ka_nama: string | null;
  ka_nip: string | null;
  ka_ttd_url: string | null;
  ka_prodi_approved_at: string | null;

  reject_stage: RejectStage | null;
  reject_by: string | null;
  reject_note: string | null;
  reject_at: string | null;

  finalized_at: string | null;
  created_at: string;
  updated_at: string;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  siswa: "Siswa",
  guru_bk: "Guru BK/BP",
  wali_kelas: "Wali Kelas",
  ka_prodi: "Ka. Program Keahlian",
  superadmin: "Superadmin"
};

export const STAGE_ROLE: Partial<Record<SubmissionStatus, UserRole>> = {
  menunggu_bk: "guru_bk",
  menunggu_wali_kelas: "wali_kelas",
  menunggu_ka_prodi: "ka_prodi"
};

export const STAGE_LABEL: Record<string, string> = {
  menunggu_bk: "Guru BK/BP",
  menunggu_wali_kelas: "Wali Kelas",
  menunggu_ka_prodi: "Ka. Program Keahlian",
  selesai: "Selesai",
  ditolak: "Ditolak"
};

