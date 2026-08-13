import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from the screenshot for FG PUTRA (Unit 1) - Januari:
const januariPutraItems = [
  // === OPERASIONAL ===
  { jenis: 'Operasional', desc: 'Tagihan Listrik Januari', link: '-', qty: 4758, satuan: 'kWh', totalNominal: 4433650 },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 6, satuan: 'rim', totalNominal: 420000 },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 6, satuan: 'rim', totalNominal: 480000 },
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 135, satuan: 'pcs', totalNominal: 10125000 },
  { jenis: 'Operasional', desc: 'Bola Basket MOLTEN BG 4550 Size 7', link: '-', qty: 1, satuan: 'pcs', totalNominal: 883000 },
  { jenis: 'Operasional', desc: 'Net Voli MITZUDA VN 285 Original', link: '-', qty: 1, satuan: 'pcs', totalNominal: 935000 },
  { jenis: 'Operasional', desc: 'Bola Futsal OrtusEight (Uk. 4)', link: '-', qty: 2, satuan: 'pcs', totalNominal: 746000 },
  { jenis: 'Operasional', desc: 'Bet Pingpong KATANA KB05 Original', link: '-', qty: 4, satuan: 'pcs', totalNominal: 824000 },
  { jenis: 'Operasional', desc: 'Net Pingpong PWR SPIN 720 3 STAR', link: '-', qty: 1, satuan: 'set', totalNominal: 156000 },
  { jenis: 'Operasional', desc: 'Bola Pingpong HUNDRED TOURNAMENT 6 IN 1 Original', link: '-', qty: 3, satuan: 'box', totalNominal: 126000 },
  { jenis: 'Operasional', desc: 'Cat garis lapangan voli', link: '-', qty: 1, satuan: 'galon (5 kg)', totalNominal: 373000 },
  { jenis: 'Operasional', desc: 'Kertas Concorde Putih 90gr', link: '-', qty: 10, satuan: 'pak', totalNominal: 170000 },
  { jenis: 'Operasional', desc: 'Tinta refill stampel', link: '-', qty: 10, satuan: 'pcs', totalNominal: 260000 },
  { jenis: 'Operasional', desc: 'Stampel ttd kepsek', link: '-', qty: 1, satuan: 'pcs', totalNominal: 125000 },

  // === GAJI ===
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', totalNominal: 3446070 },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', totalNominal: 6078510 },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', totalNominal: 4094280 },

  // === MODAL ===
  { jenis: 'Modal', desc: 'Manekin - Praktik Memandikan Jenazah', link: '-', qty: 1, satuan: 'set', totalNominal: 3960000 },
  { jenis: 'Modal', desc: 'Printer Canon pixma G3730 (ruang guru)', link: '-', qty: 1, satuan: 'pcs', totalNominal: 3360000 },
  { jenis: 'Modal', desc: 'Meja Printer (RJ 80x40x75)', link: '-', qty: 1, satuan: 'unit', totalNominal: 441039 }
];

// Build structured items for FG PUTRA - Januari
const formattedJanuariItems = januariPutraItems.map(item => {
  const unitPrice = item.qty > 0 ? item.totalNominal / item.qty : item.totalNominal;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'Januari',
    realisasi: {
      'Januari': {
        tgl: '2026-02-27',
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-JAN-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Retain non-Januari items for Unit 1, replace Januari items with exact screenshot items
const currentUnit1Items = importedData[1] || [];
const otherMonthsItems = currentUnit1Items.filter(item => item.bulan !== 'Januari');

importedData[1] = [...formattedJanuariItems, ...otherMonthsItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRA (Unit 1) - Januari with ${formattedJanuariItems.length} exact screenshot items.`);
let totalNominalJan = formattedJanuariItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRA Januari: Rp ${totalNominalJan.toLocaleString('id-ID')}`);
