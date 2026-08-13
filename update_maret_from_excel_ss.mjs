import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for Maret - PUTRA (Unit 1):
const maretPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Maret', link: '-', qty: 6793, satuan: 'kWh', harga: 950, realQty: 1, realPrice: 6310697, tgl: '5 Mar 2026' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 3800000, realQty: 1, realPrice: 5653428, tgl: '27 Mar 2026' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 5880000, realQty: 1, realPrice: 6015238, tgl: '27 Mar 2026' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, realQty: 1, realPrice: 3789334, tgl: '27 Mar 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Maret',
  realisasi: {
    'Maret': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-MAR-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for MAHAD (Unit 2) - Maret:
const maretMahadItems = [
  { jenis: 'Operasional', desc: 'Bola Basket MOLTEN BG 4550 Size 7', link: '-', qty: 3, satuan: 'pcs', harga: 883000, realQty: 3, realPrice: 883000, tgl: '13 Apr 2026' },
  { jenis: 'Operasional', desc: 'Bola Futsal OrtusEight (Uk. 4)', link: '-', qty: 4, satuan: 'pcs', harga: 373000, realQty: 4, realPrice: 373000, tgl: '13 Apr 2026' },
  { jenis: 'Modal', desc: 'Vacuum Cleaner', link: '-', qty: 1, satuan: 'pcs', harga: 883061, realQty: 1, realPrice: 883061, tgl: '13 Apr 2026', note: 'Sudah direvisi harganya dari 833.061' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Maret',
  note: item.note || undefined,
  realisasi: {
    'Maret': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-MAR-MAHAD-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for FDS (Unit 4) - Maret:
const maretFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, realQty: 1, realPrice: 1200000, tgl: '5 Mar 2026' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 2245, satuan: 'kWh', harga: 900, realQty: 2245, realPrice: 900, tgl: '5 Mar 2026' },
  { jenis: 'Modal', desc: 'Kipas Angin Philips berdiri', link: '-', qty: 3, satuan: 'unit', harga: 510000, realQty: 3, realPrice: 510000, tgl: '13 Apr 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Maret',
  realisasi: {
    'Maret': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-MAR-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for RABBANI (Unit 5) - Maret:
const maretRabbaniItems = [
  { jenis: 'Operasional', desc: 'Bola Voli Molten V5M5000 Flistatec Original', link: '-', qty: 4, satuan: 'buah', harga: 1010000, realQty: 4, realPrice: 1010000, tgl: '13 Apr 2026', note: 'Sudah dikurangi 1' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Maret',
  note: item.note || undefined,
  realisasi: {
    'Maret': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-MAR-RABBANI-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Maret items for Unit 1, Unit 2, Unit 4, Unit 5
const otherUnit1 = (importedData[1] || []).filter(item => item.bulan !== 'Maret');
const otherUnit2 = (importedData[2] || []).filter(item => item.bulan !== 'Maret');
const otherUnit4 = (importedData[4] || []).filter(item => item.bulan !== 'Maret');
const otherUnit5 = (importedData[5] || []).filter(item => item.bulan !== 'Maret');

importedData[1] = [...otherUnit1, ...maretPutraItems];
importedData[2] = [...otherUnit2, ...maretMahadItems];
importedData[4] = [...otherUnit4, ...maretFDSItems];
importedData[5] = [...otherUnit5, ...maretRabbaniItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT MARET ===');
const totalRabPutra = maretPutraItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealPutra = maretPutraItems.reduce((s, i) => s + (i.realisasi.Maret.qty * i.realisasi.Maret.harga), 0);

const totalRabMahad = maretMahadItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRabFDS = maretFDSItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRabRabbani = maretRabbaniItems.reduce((s, i) => s + (i.qty * i.harga), 0);

console.log(`PUTRA RAB Target  : 20.333.350 -> Calculated: Rp ${totalRabPutra.toLocaleString('id-ID')} (${totalRabPutra === 20333350 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`PUTRA Realisasi   : Calculated: Rp ${totalRealPutra.toLocaleString('id-ID')}`);
console.log(`MAHAD RAB Target  : 5.024.061  -> Calculated: Rp ${totalRabMahad.toLocaleString('id-ID')} (${totalRabMahad === 5024061 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`FDS RAB Target    : 4.750.500  -> Calculated: Rp ${totalRabFDS.toLocaleString('id-ID')} (${totalRabFDS === 4750500 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`RABBANI RAB Total : Calculated: Rp ${totalRabRabbani.toLocaleString('id-ID')} (${totalRabRabbani === 4040000 ? 'MATCH ✓' : 'DIFF ✗'})`);
