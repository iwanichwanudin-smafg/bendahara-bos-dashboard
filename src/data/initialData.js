// =========================================================
// DATA REFERENSI — diisi dari Supabase setelah pengguna login.
//
// File ini dulunya memuat seluruh data keuangan (profil, pagu, 30 SI, 114 transaksi)
// langsung di kode sehingga bisa diunduh siapa saja. Kini data disimpan di database
// dan hanya dimuat untuk pengguna yang sudah login.
//
// Objek di bawah sengaja dibuat "mutable" supaya semua modul yang mengimpornya
// otomatis melihat isi terbaru setelah applyReferenceData() dipanggil.
// =========================================================

export const PROFIL_SEKOLAH = {};

export const PAGU_DATA = {
  totalSiswa: 0,
  nominalPerSiswa: 0,
  totalPaguGross: 0,
  iuranFKSSPerSiswa: 0,
  totalIuranFKSS: 0,
  totalPaguNetto: 0,
  paguTahap1: 0,
  paguTahap2: 0,
  units: []
};

export function applyReferenceData(profil, pagu) {
  Object.assign(PROFIL_SEKOLAH, profil);
  const { units, ...scalar } = pagu;
  Object.assign(PAGU_DATA, scalar);
  PAGU_DATA.units.splice(0, PAGU_DATA.units.length, ...units);
}
