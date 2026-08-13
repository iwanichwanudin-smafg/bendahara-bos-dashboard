import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for Mei - PUTRA (Unit 1):
const meiPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Mei', link: '-', qty: 1, satuan: 'bulan', harga: 7960000, realQty: 1, realPrice: 7649029, tgl: '4 Mei 2026' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5800000, realQty: 1, realPrice: 5646479, tgl: '26 Mei 2026' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, realQty: 1, realPrice: 6015186, tgl: '26 Mei 2026' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, realQty: 1, realPrice: 3789337, tgl: '26 Mei 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Mei',
  realisasi: {
    'Mei': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-MEI-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for BS (Unit 3) - Mei (15 Buku items):
const meiBSItems = [
  { desc: 'KODING DAN KECERDASAN ARTIFISIAL SMA/MA KLS.10/KM', qty: 60, harga: 143000 },
  { desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.11/KM', qty: 10, harga: 202000 },
  { desc: 'BIOLOGI SMA/MA KLS 11/KM', qty: 10, harga: 322000 },
  { desc: 'FISIKA SMA/MA KLS.11/KM', qty: 10, harga: 249000 },
  { desc: 'KIMIA SMA/MA KLS.XI/KM', qty: 10, harga: 204000 },
  { desc: 'EKONOMI SMA/MA KLS 11/KM REVISI', qty: 10, harga: 152000 },
  { desc: 'SOSIOLOGI SMA/MA KLS.11/KM REVISI', qty: 10, harga: 124000 },
  { desc: 'GEOGRAFI SMA/MA KLS.11/KM REVISI', qty: 10, harga: 184000 },
  { desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.12/KM', qty: 10, harga: 219000 },
  { desc: 'BIOLOGI SMA/MA KLS.12/KM', qty: 10, harga: 196000 },
  { desc: 'FISIKA SMA/MA KLS.12/KM', qty: 10, harga: 178000 },
  { desc: 'KIMIA SMA/MA KLS.XII/KM', qty: 10, harga: 146000 },
  { desc: 'EKONOMI SMA/MA KLS.12/KM REVISI', qty: 10, harga: 140000 },
  { desc: 'SOSIOLOGI SMA/MA KLS.12/KM', qty: 10, harga: 141000 },
  { desc: 'GEOGRAFI SMA/MA KLS.12/KM', qty: 10, harga: 193000 }
].map(item => ({
  jenis: 'Buku',
  desc: item.desc,
  link: '-',
  qty: item.qty,
  satuan: 'eks',
  harga: item.harga,
  bulan: 'Mei',
  realisasi: {
    'Mei': {
      tgl: '3 Jun 2026',
      qty: item.qty,
      harga: item.harga,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-MEI-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for FDS (Unit 4) - Mei:
const meiFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, realQty: 1, realPrice: 1200000, tgl: '4 Mei 2026' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, realQty: 4, realPrice: 1010000, tgl: '4 Mei 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Mei',
  realisasi: {
    'Mei': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-MEI-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Mei items for Unit 1, Unit 3, Unit 4
const otherUnit1 = (importedData[1] || []).filter(item => item.bulan !== 'Mei');
const otherUnit3 = (importedData[3] || []).filter(item => item.bulan !== 'Mei');
const otherUnit4 = (importedData[4] || []).filter(item => item.bulan !== 'Mei');

importedData[1] = [...otherUnit1, ...meiPutraItems];
importedData[3] = [...otherUnit3, ...meiBSItems];
importedData[4] = [...otherUnit4, ...meiFDSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT MEI ===');
const totalRabPutra = meiPutraItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealPutra = meiPutraItems.reduce((s, i) => s + (i.realisasi.Mei.qty * i.realisasi.Mei.harga), 0);

const totalRabBS = meiBSItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRabFDS = meiFDSItems.reduce((s, i) => s + (i.qty * i.harga), 0);

console.log(`PUTRA RAB Target  : 24.260.000 -> Calculated: Rp ${totalRabPutra.toLocaleString('id-ID')} (${totalRabPutra === 24260000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`PUTRA Realisasi   : 23.100.031 -> Calculated: Rp ${totalRealPutra.toLocaleString('id-ID')} (${totalRealPutra === 23100031 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`BS RAB Target     : 35.080.000 -> Calculated: Rp ${totalRabBS.toLocaleString('id-ID')} (${totalRabBS === 35080000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`FDS RAB Target    : 5.240.000  -> Calculated: Rp ${totalRabFDS.toLocaleString('id-ID')} (${totalRabFDS === 5240000 ? 'MATCH ✓' : 'DIFF ✗'})`);
