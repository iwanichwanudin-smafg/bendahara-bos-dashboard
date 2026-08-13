import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 19 OPERASIONAL items from Screenshot 1 for FDS (Unit 4) - April 2026:
const fdsAprilOperasional = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, realQty: 1, realPrice: 1200000, tgl: '7 Apr 2026' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, realQty: 1, realPrice: 4040000, tgl: '7 Apr 2026', note: 'Revisi satuan dari kWh (di RKAS disatukan)' },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 70, satuan: 'rim', harga: 70000, realQty: 1, realPrice: 3640000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 80, satuan: 'rim', harga: 80000, realQty: 1, realPrice: 4320000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Spidol Whiteboard', link: '-', qty: 9, satuan: 'lusin / box', harga: 111000, realQty: 1, realPrice: 873000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Spidol Whiteboard', link: '-', qty: 10, satuan: 'lusin / box', harga: 111000, realQty: 1, realPrice: 970000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Spidol Whiteboard', link: '-', qty: 6, satuan: 'lusin / box', harga: 111000, realQty: 1, realPrice: 582000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard', link: '-', qty: 45, satuan: 'btl', harga: 27000, realQty: 1, realPrice: 900000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard', link: '-', qty: 45, satuan: 'btl', harga: 27000, realQty: 1, realPrice: 900000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard', link: '-', qty: 45, satuan: 'btl', harga: 27000, realQty: 1, realPrice: 900000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Penghapus whiteboard joyco magnet', link: '-', qty: 48, satuan: 'pcs', harga: 13000, realQty: 1, realPrice: 432000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Amplop coklat merk Airmail', link: '-', qty: 24, satuan: 'pak', harga: 82000, realQty: 1, realPrice: 1632000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Map Bussines File Uk F4 Biru, Kuning, Oren, Hijau', link: '-', qty: 24, satuan: 'lusin', harga: 32000, realQty: 1, realPrice: 720000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Box File merk Bambi Biru dan hitam uk. Jumbo (1033)', link: '-', qty: 24, satuan: 'pcs', harga: 59000, realQty: 1, realPrice: 864000, tgl: '26 Mei 2026' },
  { jenis: 'Operasional', desc: 'Ordner Besar merk Bambi uk. F4 75mm (1010)', link: '-', qty: 24, satuan: 'pcs', harga: 40000, realQty: 1, realPrice: 960000, tgl: '26 Mei 2026', note: 'Revisi harga dari 50.000' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL HITAM', link: '-', qty: 32, satuan: 'botol', harga: 107000, realQty: 1, realPrice: 3424000, tgl: '26 Mei 2026', note: 'Revisi harga dari 120.000' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL WARNA', link: '-', qty: 16, satuan: 'botol', harga: 107000, realQty: 1, realPrice: 1712000, tgl: '26 Mei 2026', note: 'Revisi harga dari 120.000' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL WARNA', link: '-', qty: 16, satuan: 'botol', harga: 107000, realQty: 1, realPrice: 1712000, tgl: '26 Mei 2026', note: 'Revisi harga dari 120.000' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL WARNA', link: '-', qty: 16, satuan: 'botol', harga: 107000, realQty: 1, realPrice: 1712000, tgl: '26 Mei 2026', note: 'Revisi harga dari 120.000' }
];

// Exact 22 BUKU items from Screenshot 2 for FDS (Unit 4) - April 2026:
const fdsAprilBuku = [
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA KLS 11/KM', link: '-', qty: 57, satuan: 'eks', harga: 126000, realQty: 57, realPrice: 126000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.11/KM', link: '-', qty: 11, satuan: 'eks', harga: 202000, realQty: 11, realPrice: 202000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'SEJARAH SMA/MA KLS.11/KM', link: '-', qty: 57, satuan: 'eks', harga: 164000, realQty: 57, realPrice: 164000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'BIOLOGI SMA/MA KLS.11/KM', link: '-', qty: 21, satuan: 'eks', harga: 322000, realQty: 21, realPrice: 322000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'FISIKA SMA/MA KLS.11/KM', link: '-', qty: 11, satuan: 'eks', harga: 249000, realQty: 11, realPrice: 249000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'KIMIA SMA/MA KLS.XI/KM', link: '-', qty: 21, satuan: 'eks', harga: 204000, realQty: 21, realPrice: 204000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'EKONOMI SMA/MA KLS 11/KM REVISI', link: '-', qty: 31, satuan: 'eks', harga: 152000, realQty: 31, realPrice: 152000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'SOSIOLOGI SMA/MA KLS.11/KM REVISI', link: '-', qty: 47, satuan: 'eks', harga: 124000, realQty: 47, realPrice: 124000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'GEOGRAFI SMA/MA KLS.11/KM REVISI', link: '-', qty: 11, satuan: 'eks', harga: 184000, realQty: 11, realPrice: 184000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA KLS 12/KM', link: '-', qty: 58, satuan: 'eks', harga: 165000, realQty: 58, realPrice: 165000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.12/KM', link: '-', qty: 11, satuan: 'eks', harga: 219000, realQty: 11, realPrice: 219000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'SEJARAH SMA/MA KLS.12/KM', link: '-', qty: 58, satuan: 'eks', harga: 141000, realQty: 58, realPrice: 141000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'BIOLOGI SMA/MA KLS 12/KM', link: '-', qty: 21, satuan: 'eks', harga: 196000, realQty: 21, realPrice: 196000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'FISIKA SMA/MA KLS.12/KM', link: '-', qty: 11, satuan: 'eks', harga: 178000, realQty: 11, realPrice: 178000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'KIMIA SMA/MA KLS.XII/KM', link: '-', qty: 21, satuan: 'eks', harga: 146000, realQty: 21, realPrice: 146000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'EKONOMI SMA/MA KLS 12/KM REVISI', link: '-', qty: 31, satuan: 'eks', harga: 140000, realQty: 31, realPrice: 140000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'SOSIOLOGI SMA/MA KLS.12/KM', link: '-', qty: 47, satuan: 'eks', harga: 141000, realQty: 47, realPrice: 141000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'GEOGRAFI SMA/MA KLS.12/KM', link: '-', qty: 11, satuan: 'eks', harga: 193000, realQty: 11, realPrice: 193000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'ERLANGGA RPUL INDONESIA & DUNIA UTK SD, SMP, SMA &', link: '-', qty: 1, satuan: 'eks', harga: 404000, realQty: 1, realPrice: 404000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'PANDUAN TANGGAP DARURAT BENCANA: BANJIR', link: '-', qty: 2, satuan: 'eks', harga: 151000, realQty: 2, realPrice: 151000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'PAKET ENSIKLOPEDIA SAINS', link: '-', qty: 1, satuan: 'eks', harga: 1375000, realQty: 1, realPrice: 1375000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' },
  { jenis: 'Buku', desc: 'BUKU POSTER: PETA DUNIA', link: '-', qty: 1, satuan: 'eks', harga: 193000, realQty: 1, realPrice: 193000, tgl: '11 Mei 2026', note: 'Digeser dari Juni' }
];

const fdsAprilAll = [...fdsAprilOperasional, ...fdsAprilBuku].map(item => ({
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
      invoice: `BKU-APR-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-April items for FDS (Unit 4)
const otherUnit4 = (importedData[4] || []).filter(item => item.bulan !== 'April');

importedData[4] = [...otherUnit4, ...fdsAprilAll];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT FDS APRIL (OPERASIONAL & BUKU) ===');
const totalRabOperasional = fdsAprilOperasional.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealOperasional = fdsAprilOperasional.reduce((s, i) => s + (i.realQty * i.realPrice), 0);

const totalRabBuku = fdsAprilBuku.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealBuku = fdsAprilBuku.reduce((s, i) => s + (i.realQty * i.realPrice), 0);

console.log(`FDS OPERASIONAL RAB       : Rp ${totalRabOperasional.toLocaleString('id-ID')} (Sum from rows: 36.776.000)`);
console.log(`FDS OPERASIONAL Realisasi  : Rp ${totalRealOperasional.toLocaleString('id-ID')} (Target: 31.493.000 ${totalRealOperasional === 31493000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`FDS BUKU RAB Target        : Rp ${totalRabBuku.toLocaleString('id-ID')} (Target: 89.762.000 ${totalRabBuku === 89762000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`FDS BUKU Realisasi         : Rp ${totalRealBuku.toLocaleString('id-ID')} (Target: 89.762.000 ${totalRealBuku === 89762000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`FDS GRAND TOTAL RAB        : Rp ${(totalRabOperasional + totalRabBuku).toLocaleString('id-ID')}`);
console.log(`FDS GRAND TOTAL REALISASI  : Rp ${(totalRealOperasional + totalRealBuku).toLocaleString('id-ID')}`);
