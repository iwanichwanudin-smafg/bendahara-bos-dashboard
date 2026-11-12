// =========================================================
// HALAMAN "VISUAL PER UNIT": jatah, belanja rinci per kategori, dan serapan tiap unit
//
// Angka belanja memakai aturan yang sama dengan Dashboard (getMetrics di main.js):
// nominal item = totalNominal || nominal || netto. Dengan begitu total per unit di halaman ini
// selalu sama dengan "Realisasi SI" per unit di Dashboard.
// =========================================================

// Urutan dan warna sama dengan diagram kategori di Dashboard
export const KATEGORI_BELANJA = [
  { key: 'Operasional', label: 'Operasional', warna: '#2563eb' },
  { key: 'Modal', label: 'Modal / Aset', warna: '#7c3aed' },
  { key: 'Buku', label: 'Buku', warna: '#d97706' },
  { key: 'Honor', label: 'Honor', warna: '#be185d' }
];

export function nominalItem(item) {
  return Number(item && (item.totalNominal || item.nominal || item.netto)) || 0;
}

const jumlah = (rows) => rows.reduce((acc, r) => acc + nominalItem(r), 0);
const persen = (bagian, total) => (total > 0 ? Math.round((bagian / total) * 1000) / 10 : 0);

export function hitungBelanjaPerUnit(units, transaksiList) {
  return (units || []).map((unit) => {
    const items = (transaksiList || []).filter((t) => t && t.unitId === unit.id);
    const realisasi = jumlah(items);
    const jatah = Number(unit.pagu) || 0;

    const kategori = KATEGORI_BELANJA.map((k) => {
      const rows = items.filter((t) => String(t.kategori || '').toLowerCase() === k.key.toLowerCase());
      const total = jumlah(rows);
      return { ...k, total, jumlahItem: rows.length, persen: persen(total, realisasi) };
    });

    // Belanja yang kategorinya di luar empat kategori baku tidak boleh hilang dari total
    const terpakai = kategori.reduce((acc, k) => acc + k.total, 0);
    const itemLain = items.length - kategori.reduce((acc, k) => acc + k.jumlahItem, 0);
    const lainnya = { total: realisasi - terpakai, jumlahItem: itemLain, persen: persen(realisasi - terpakai, realisasi) };

    return {
      id: unit.id,
      nama: unit.nama,
      siswa: Number(unit.siswa) || 0,
      jatah,
      realisasi,
      sisa: jatah - realisasi,
      persenSerapan: persen(realisasi, jatah),
      jumlahItem: items.length,
      kategori,
      lainnya
    };
  });
}
