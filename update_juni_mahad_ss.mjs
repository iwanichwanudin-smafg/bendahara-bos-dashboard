import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 4 items for MAHAD (Unit 2) - Juni 2026:
const juniMahadItems = [
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 20, satuan: 'pcs', harga: 75000, realQty: 20, realPrice: 75000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 5, satuan: 'rim', harga: 470000, realQty: 5, realPrice: 470000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Kertas Concorde 160 gr', link: '-', qty: 10, satuan: 'pak', harga: 19000, realQty: 10, realPrice: 19000, tgl: '26 Jun 2026' },
  { jenis: 'Modal', desc: 'Lemari Kantor Besi Kaca Arsip 2 pintu', link: '-', qty: 1, satuan: 'pcs', harga: 2050000, realQty: 1, realPrice: 2050000, tgl: '26 Jun 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Juni',
  realisasi: {
    'Juni': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-JUN-MAHAD-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Juni items for Unit 2 (MAHAD)
const otherUnit2 = (importedData[2] || []).filter(item => item.bulan !== 'Juni');

importedData[2] = [...otherUnit2, ...juniMahadItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT JUNI (MAHAD) ===');
const totalRab = juniMahadItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalReal = juniMahadItems.reduce((s, i) => s + (i.realisasi.Juni.qty * i.realisasi.Juni.harga), 0);

console.log(`MAHAD RAB Target       : 6.090.000 -> Calculated: Rp ${totalRab.toLocaleString('id-ID')} (${totalRab === 6090000 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
console.log(`MAHAD Realisasi Target  : 6.090.000 -> Calculated: Rp ${totalReal.toLocaleString('id-ID')} (${totalReal === 6090000 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
