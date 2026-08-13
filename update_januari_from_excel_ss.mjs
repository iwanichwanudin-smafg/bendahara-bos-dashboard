import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for Januari - PUTRA (Unit 1):
const januariPutraItems = [
  // OPERASIONAL (Kuning)
  { jenis: 'Operasional', desc: 'Tagihan Listrik Januari', link: '-', qty: 4758, satuan: 'kWh', harga: 950, realPrice: 950, realQty: 4667, tgl: '27 Feb 2026' },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 6, satuan: 'rim', harga: 70000, realPrice: 70000, realQty: 6, note: 'Bayar hutang ke FG inc 6 rim' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 6, satuan: 'rim', harga: 80000, realPrice: 80000, realQty: 6, note: 'Bayar hutang ke FG inc 6 rim' },
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 135, satuan: 'pcs', harga: 75000, realPrice: 75000, realQty: 135 },
  { jenis: 'Operasional', desc: 'Bola Basket MOLTEN BG 4550 Size 7', link: '-', qty: 1, satuan: 'pcs', harga: 883000, realPrice: 883000, realQty: 1 },
  { jenis: 'Operasional', desc: 'Net Voli MITZUDA VN 285 Original', link: '-', qty: 1, satuan: 'pcs', harga: 935000, realPrice: 935000, realQty: 1 },
  { jenis: 'Operasional', desc: 'Bola Futsal OrtusEight (Uk. 4)', link: '-', qty: 2, satuan: 'pcs', harga: 373000, realPrice: 373000, realQty: 2 },
  { jenis: 'Operasional', desc: 'Bet Pingpong KATANA KB05 Original', link: '-', qty: 4, satuan: 'pcs', harga: 206000, realPrice: 206000, realQty: 4, tgl: '27 Feb 2026' },
  { jenis: 'Operasional', desc: 'Net Pingpong PWR SPIN 720 3 STAR', link: '-', qty: 1, satuan: 'set', harga: 156000, realPrice: 156000, realQty: 1 },
  { jenis: 'Operasional', desc: 'Bola Pingpong HUNDRED TOURNAMENT 6 IN 1 Original', link: '-', qty: 3, satuan: 'box', harga: 42000, realPrice: 42000, realQty: 3 },
  { jenis: 'Operasional', desc: 'Cat garis lapangan voli', link: '-', qty: 1, satuan: 'galon (5 kg)', harga: 373000, realPrice: 373000, realQty: 1 },
  { jenis: 'Operasional', desc: 'Kertas Concorde Putih 90gr', link: '-', qty: 10, satuan: 'pak', harga: 17000, realPrice: 17000, realQty: 10 },
  { jenis: 'Operasional', desc: 'Tinta refill stampel', link: '-', qty: 10, satuan: 'pcs', harga: 26000, realPrice: 26000, realQty: 10 },
  { jenis: 'Operasional', desc: 'Stampel ttd kepsek', link: '-', qty: 1, satuan: 'pcs', harga: 125000, realPrice: 125000, realQty: 1 },

  // GAJI (Kuning - RAB & Hijau - Realisasi Beda Nominal)
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5700000, realPrice: 3446070, realQty: 1 },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, realPrice: 6078510, realQty: 1, tgl: '27 Feb 2026' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, realPrice: 4094280, realQty: 1 },

  // MODAL (Biru/Hijau)
  { jenis: 'Modal', desc: 'Manekin - Praktik Memandikan Jenazah', link: '-', qty: 1, satuan: 'set', harga: 3960000, realPrice: 3960000, realQty: 1 },
  { jenis: 'Modal', desc: 'Printer Canon pixma G3730 (ruang guru)', link: '-', qty: 1, satuan: 'pcs', harga: 3360000, realPrice: 3360000, realQty: 1, tgl: '27 Feb 2026' },
  { jenis: 'Modal', desc: 'Meja Printer (RJ 80x40x75)', link: '-', qty: 1, satuan: 'unit', harga: 441039, realPrice: 441039, realQty: 1 }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Januari',
  note: item.note || undefined,
  realisasi: {
    'Januari': {
      tgl: item.tgl || '2026-02-27',
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-JAN-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for MAHAD (Unit 2) - Januari:
const januariMahadItems = [
  { jenis: 'Modal', desc: 'Karpet permadani', link: '-', qty: 2, satuan: 'pcs', harga: 920000, realPrice: 920000, realQty: 2, tgl: '27 Feb 2026' },
  { jenis: 'Modal', desc: 'CCTV', link: 'https://s.shopee.co.id/8fMQV1NNul?share_channel_code=1', qty: 4, satuan: 'pcs', harga: 500000, realPrice: 500000, realQty: 4, tgl: '27 Feb 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Januari',
  realisasi: {
    'Januari': {
      tgl: item.tgl || '2026-02-27',
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-JAN-MAHAD-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for FDS (Unit 4) - Januari:
const januariFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, realPrice: 1200000, realQty: 1, tgl: '27 Feb 2026' },
  { jenis: 'Modal', desc: 'Printer Canon pixma G3730 green', link: 'https://tk.tokopedia.com/ZSajb17mK/, https://id.shp.ee/V2tps1k', qty: 1, satuan: 'unit', harga: 3360000, realPrice: 3360000, realQty: 1, tgl: '27 Feb 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Januari',
  realisasi: {
    'Januari': {
      tgl: item.tgl || '2026-02-27',
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-JAN-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Januari items for Unit 1, Unit 2, Unit 4
const otherUnit1 = (importedData[1] || []).filter(item => item.bulan !== 'Januari');
const otherUnit2 = (importedData[2] || []).filter(item => item.bulan !== 'Januari');
const otherUnit4 = (importedData[4] || []).filter(item => item.bulan !== 'Januari');

importedData[1] = [...januariPutraItems, ...otherUnit1];
importedData[2] = [...januariMahadItems, ...otherUnit2];
importedData[4] = [...januariFDSItems, ...otherUnit4];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT JANUARI ===');
const totalRabPutra = januariPutraItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealPutra = januariPutraItems.reduce((s, i) => s + (i.realisasi.Januari.qty * i.realisasi.Januari.harga), 0);

const totalRabMahad = januariMahadItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealMahad = januariMahadItems.reduce((s, i) => s + (i.realisasi.Januari.qty * i.realisasi.Januari.harga), 0);

const totalRabFDS = januariFDSItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealFDS = januariFDSItems.reduce((s, i) => s + (i.realisasi.Januari.qty * i.realisasi.Januari.harga), 0);

console.log(`PUTRA RAB Target : 44.017.689 -> Calculated: Rp ${totalRabPutra.toLocaleString('id-ID')} (${totalRabPutra === 44017689 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`PUTRA Realisasi  : Target 41.436.549 -> Calculated: Rp ${totalRealPutra.toLocaleString('id-ID')}`);
console.log(`MAHAD Total      : Target 3.840.000  -> Calculated: Rp ${totalRabMahad.toLocaleString('id-ID')} (${totalRabMahad === 3840000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`FDS Total        : Target 4.560.000  -> Calculated: Rp ${totalRabFDS.toLocaleString('id-ID')} (${totalRabFDS === 4560000 ? 'MATCH ✓' : 'DIFF ✗'})`);
