// =========================================================
// RINCIAN PAGU PER UNIT: jatah bruto, iuran FKSS, jatah netto
//
// Aturan (sesuai tabel pembagian BOS):
//  - Iuran FKSS tiap unit   = jumlah siswa x iuran per siswa
//  - Jatah netto            = jatah bruto - iuran FKSS   (nilai tersimpan di database: paguMurni)
//  - Jatah bruto            = jatah netto + iuran FKSS
//  - Seluruh iuran FKSS dibayar lebih dulu oleh unit penalang (FG Putra) dari kas di luar dana BOS,
//    sehingga nominal iuran semua unit ditambahkan ke pagu RKAS unit penalang (talanganFKSS).
// =========================================================

export function hitungRincianPagu(units, iuranPerSiswa) {
  const rate = Number(iuranPerSiswa) || 0;

  const rows = (units || []).map((u) => {
    const siswa = Number(u.siswa) || 0;
    const jatahNetto = Number(u.paguMurni) || 0;
    const iuranFKSS = siswa * rate;
    return {
      id: u.id,
      nama: u.nama,
      siswa,
      jatahBruto: jatahNetto + iuranFKSS,
      iuranFKSS,
      jatahNetto,
      tambahanIuran: Number(u.talanganFKSS) || 0, // iuran yang diterima unit penalang
      paguRKAS: Number(u.pagu) || 0
    };
  });

  const jumlah = (key) => rows.reduce((acc, r) => acc + r[key], 0);
  const totals = {
    siswa: jumlah('siswa'),
    jatahBruto: jumlah('jatahBruto'),
    iuranFKSS: jumlah('iuranFKSS'),
    jatahNetto: jumlah('jatahNetto'),
    tambahanIuran: jumlah('tambahanIuran'),
    paguRKAS: jumlah('paguRKAS')
  };

  const penalang = rows.find((r) => r.tambahanIuran > 0) || null;
  return {
    rows,
    totals,
    penalang,
    // 0 berarti seluruh iuran semua unit tepat sama dengan yang ditambahkan ke unit penalang
    selisihTalangan: totals.iuranFKSS - totals.tambahanIuran
  };
}
