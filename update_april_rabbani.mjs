import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for RABBANI (Unit 5) - April:
const aprilRabbaniItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 60, satuan: 'rim', totalNominal: 4200000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tinta refill stampel (Hitam)', link: '-', qty: 10, satuan: 'pcs', totalNominal: 260000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tinta refill stampel (Biru)', link: '-', qty: 15, satuan: 'pcs', totalNominal: 390000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tinta refill stampel (Merah)', link: '-', qty: 15, satuan: 'pcs', totalNominal: 390000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Soklin lantai 770 ml', link: '-', qty: 128, satuan: 'pcs', totalNominal: 2432000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Cling Pembersih Kaca 400ml', link: '-', qty: 24, satuan: 'pcs', totalNominal: 264000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Handsoap/sabun cuci tangan', link: '-', qty: 12, satuan: 'jerigen', totalNominal: 756000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Pengharum Ruangan Gantung', link: '-', qty: 75, satuan: 'pcs', totalNominal: 1425000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Sapu ijuk', link: '-', qty: 8, satuan: 'pcs', totalNominal: 352000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Wiper lantai', link: '-', qty: 8, satuan: 'pcs', totalNominal: 304000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Pengki nagoya', link: '-', qty: 10, satuan: 'pcs', totalNominal: 380000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tempat sampah Shinpo 10 liter', link: '-', qty: 10, satuan: 'pcs', totalNominal: 950000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Alat Pel Lantai / spin mop / peras otomatis', link: '-', qty: 8, satuan: 'pcs', totalNominal: 1712000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Ember', link: '-', qty: 10, satuan: 'pcs', totalNominal: 690000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Keran', link: '-', qty: 10, satuan: 'pcs', totalNominal: 510000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Gayung', link: '-', qty: 15, satuan: 'pcs', totalNominal: 390000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Baterai AA', link: '-', qty: 6, satuan: 'pak / isi 6', totalNominal: 228000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Lampu LED Philips 20 w putih', link: '-', qty: 25, satuan: 'pcs', totalNominal: 2050000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Selang benang', link: '-', qty: 1, satuan: 'roll / 100 m', totalNominal: 438000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Obeng amerika bolak balik', link: '-', qty: 5, satuan: 'pcs', totalNominal: 130000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Isi Cutter L-500', link: '-', qty: 132, satuan: 'tube', totalNominal: 1452000, tgl: '2026-05-26' },

  // MODAL
  { jenis: 'Modal', desc: 'Globe Dunia 35 cm', link: '-', qty: 2, satuan: 'pcs', totalNominal: 940000, tgl: '2026-05-26' }
];

const formattedRabbaniItems = aprilRabbaniItems.map(item => {
  const unitPrice = item.qty > 0 ? item.totalNominal / item.qty : item.totalNominal;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'April',
    realisasi: {
      'April': {
        tgl: item.tgl,
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-APR-RABBANI-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 5 (Rabbani) for April
importedData[5] = [...(importedData[5] || []).filter(i => i.bulan !== 'April'), ...formattedRabbaniItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated RABBANI (Unit 5) - April with ${formattedRabbaniItems.length} exact screenshot items.`);
let totalNominalApr = formattedRabbaniItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi RABBANI April: Rp ${totalNominalApr.toLocaleString('id-ID')}`);
