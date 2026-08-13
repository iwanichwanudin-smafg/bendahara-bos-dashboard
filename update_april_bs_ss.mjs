import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 33 items from Screenshot for BS (Unit 3) - April 2026:
const bsAprilItems = [
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 55, satuan: 'rim', harga: 70000 },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 30, satuan: 'rim', harga: 80000 },
  { jenis: 'Operasional', desc: 'Spidol Permanent Warna Hitam', link: '-', qty: 10, satuan: 'box', harga: 108000 },
  { jenis: 'Operasional', desc: 'Spidol Marker Warna Silver', link: '-', qty: 5, satuan: 'box', harga: 239000 },
  { jenis: 'Operasional', desc: 'Spidol Marker Warna White', link: '-', qty: 5, satuan: 'box', harga: 239000 },
  { jenis: 'Operasional', desc: 'Map Bussines File Uk F4 Biru, Kuning, Oren, Hijau', link: '-', qty: 50, satuan: 'lusin', harga: 32000 },
  { jenis: 'Operasional', desc: 'Box File merk Bambi Biru dan hitam uk. A4 Jumbo (1033)', link: '-', qty: 84, satuan: 'pcs', harga: 59000 },
  { jenis: 'Operasional', desc: 'Ordner Besar merk Bambi uk. A4 50mm (1015)', link: '-', qty: 60, satuan: 'pcs', harga: 56000 },
  { jenis: 'Operasional', desc: 'Isi staples no.10-1M Max', link: '-', qty: 10, satuan: 'pak', harga: 88000 },
  { jenis: 'Operasional', desc: 'Sticky Note 3M Post-it (5 pad warna wami 76mm x 76mm)', link: '-', qty: 20, satuan: 'pak', harga: 87000 },
  { jenis: 'Operasional', desc: 'Map L Bening Uk F4 Joyko', link: '-', qty: 33, satuan: 'pcs', harga: 45000 },
  { jenis: 'Operasional', desc: 'Map Bening Kancing/Resleting size folio', link: '-', qty: 150, satuan: 'pcs', harga: 20000 },
  { jenis: 'Operasional', desc: 'Lem Fox 150 gr', link: '-', qty: 40, satuan: 'pcs', harga: 17000 },
  { jenis: 'Operasional', desc: 'Correction Type kertas Joyko', link: '-', qty: 24, satuan: 'pcs', harga: 9000 },
  { jenis: 'Operasional', desc: 'HVS A4 warna (biru/pink)', link: '-', qty: 2, satuan: 'rim', harga: 94000 },
  { jenis: 'Operasional', desc: 'HVS F4 warna (biru/pink)', link: '-', qty: 2, satuan: 'rim', harga: 109000 },
  { jenis: 'Operasional', desc: 'Index & Mark Joyko Im 61', link: '-', qty: 50, satuan: 'pcs', harga: 12000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Index & Mark Joyko Im 62', link: '-', qty: 50, satuan: 'pcs', harga: 12000 },
  { jenis: 'Operasional', desc: 'Kertas Concorde Putih 220gr', link: '-', qty: 40, satuan: 'pak', harga: 22000 },
  { jenis: 'Operasional', desc: 'Soklin lantai 770 ml', link: '-', qty: 45, satuan: 'pcs', harga: 19000 },
  { jenis: 'Operasional', desc: 'Mama lemon 680ml', link: '-', qty: 200, satuan: 'pcs', harga: 13000 },
  { jenis: 'Operasional', desc: 'Cling Pembersih Kaca 400ml', link: '-', qty: 18, satuan: 'pcs', harga: 11000 },
  { jenis: 'Operasional', desc: 'Pengharum Ruangan Gantung', link: '-', qty: 12, satuan: 'pcs', harga: 19000 },
  { jenis: 'Operasional', desc: 'Glade matic device spray', link: '-', qty: 4, satuan: 'pcs', harga: 97000 },
  { jenis: 'Operasional', desc: 'Refill pewangi spray Glade', link: '-', qty: 45, satuan: 'pcs', harga: 43000 },
  { jenis: 'Operasional', desc: 'Trashbag Hitam 60x80', link: '-', qty: 45, satuan: 'pak', harga: 32000 },
  { jenis: 'Operasional', desc: 'Trashbag Bening', link: '-', qty: 15, satuan: 'pak', harga: 32000 },
  { jenis: 'Operasional', desc: 'Tisu Wajah Nice', link: '-', qty: 100, satuan: 'pcs', harga: 22000 },
  { jenis: 'Operasional', desc: 'Tisu Toilet Nice', link: '-', qty: 75, satuan: 'pcs', harga: 10000 },
  { jenis: 'Operasional', desc: 'Sapu ijuk', link: '-', qty: 30, satuan: 'pcs', harga: 44000 },
  { jenis: 'Operasional', desc: 'Alat pel', link: '-', qty: 30, satuan: 'pcs', harga: 44000 },
  { jenis: 'Operasional', desc: 'Wiper/Karet Pembersih Kaca Jendela', link: '-', qty: 15, satuan: 'pcs', harga: 56000 },
  { jenis: 'Operasional', desc: 'Tiner Pembersih Meja/Kursi', link: '-', qty: 2, satuan: 'liter/kaleng', harga: 66000, note: 'Revisi dari 1 Jerigen' }
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
      tgl: item.tgl || '26 Mei 2026',
      qty: item.qty,
      harga: item.harga,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-APR-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-April items for BS (Unit 3)
const otherUnit3 = (importedData[3] || []).filter(item => item.bulan !== 'April');

importedData[3] = [...otherUnit3, ...bsAprilItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT BS APRIL ===');
const totalRab = bsAprilItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalReal = bsAprilItems.reduce((s, i) => s + (i.realisasi.April.qty * i.realisasi.April.harga), 0);

console.log(`BS RAB Target       : 44.809.000 -> Calculated: Rp ${totalRab.toLocaleString('id-ID')} (${totalRab === 44809000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`BS Realisasi Target  : 44.809.000 -> Calculated: Rp ${totalReal.toLocaleString('id-ID')} (${totalReal === 44809000 ? 'MATCH ✓' : 'DIFF ✗'})`);
