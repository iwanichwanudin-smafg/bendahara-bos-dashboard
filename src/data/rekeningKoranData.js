// =========================================================
// INFO REKENING BANK — diisi dari Supabase setelah pengguna login.
// (Dulu berisi nomor rekening dan seluruh mutasi langsung di kode.)
// =========================================================

export const REKENING_INFO = {};

export function applyRekeningInfo(info) {
  Object.assign(REKENING_INFO, info);
}
