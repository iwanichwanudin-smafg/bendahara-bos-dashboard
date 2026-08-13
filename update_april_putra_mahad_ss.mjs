import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for April - PUTRA (Unit 1):
const aprilPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik April', link: '-', qty: 1, satuan: 'bulan', harga: 7960000, realQty: 1, realPrice: 4890727, tgl: '7 Apr 2026', note: 'Revisi satuan dari kWh' },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 17, satuan: 'rim', harga: 70000, realQty: 17, realPrice: 70000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 3, satuan: 'rim', harga: 80000, realQty: 3, realPrice: 80000, tgl: '26 Mei 2026' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 2, satuan: 'bulan', harga: 5800000, realQty: 1, realPrice: 11528748, tgl: '28 Apr 2026' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, realQty: 1, realPrice: 6015186, tgl: '28 Apr 2026' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, realQty: 1, realPrice: 3769337, tgl: '28 Apr 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'April',
  note: item.note || undefined,
  realisasi: {
    'April': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-APR-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for MAHAD (Unit 2) - April:
const aprilMahadItems = [
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 70, satuan: 'rim', harga: 70000, realQty: 70, realPrice: 70000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 35, satuan: 'rim', harga: 80000, realQty: 35, realPrice: 80000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Tali tambang 22mm (8 meter)', link: '-', qty: 8, satuan: 'meter', harga: 32000, realQty: 8, realPrice: 32000, tgl: '26 Mei 2026', note: 'Sudah direvisi harganya dari 504.000' },
  { jenis: 'Operasional', desc: 'Mic Imam Sholat', link: '-', qty: 1, satuan: 'pcs', harga: 248000, realQty: 1, realPrice: 248000, tgl: '26 Mei 2026', note: 'Sudah di buat anggarannya' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'April',
  note: item.note || undefined,
  realisasi: {
    'April': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-APR-MAHAD-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-April items for Unit 1 & Unit 2
const otherUnit1 = (importedData[1] || []).filter(item => item.bulan !== 'April');
const otherUnit2 = (importedData[2] || []).filter(item => item.bulan !== 'April');

importedData[1] = [...otherUnit1, ...aprilPutraItems];
importedData[2] = [...otherUnit2, ...aprilMahadItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT APRIL (PUTRA & MAHAD) ===');
const totalRabPutra = aprilPutraItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealPutra = aprilPutraItems.reduce((s, i) => s + (i.realisasi.April.qty * i.realisasi.April.harga), 0);

const totalRabMahad = aprilMahadItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealMahad = aprilMahadItems.reduce((s, i) => s + (i.realisasi.April.qty * i.realisasi.April.harga), 0);

console.log(`PUTRA RAB Target : 31.490.000 -> Calculated: Rp ${totalRabPutra.toLocaleString('id-ID')} (${totalRabPutra === 31490000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`PUTRA Realisasi  : Calculated: Rp ${totalRealPutra.toLocaleString('id-ID')}`);
console.log(`MAHAD RAB Target : 8.204.000  -> Calculated: Rp ${totalRabMahad.toLocaleString('id-ID')} (${totalRabMahad === 8204000 ? 'MATCH ✓' : 'DIFF ✗'})`);
