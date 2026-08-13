import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot 4 for FG PUTRI FDS (Unit 4) - Februari:
const februariFDSItems = [
  { 
    jenis: 'Operasional', 
    desc: 'Internet Indihome', 
    link: '-', 
    qty: 1, 
    satuan: 'bulan', 
    harga: 1200000, // Total = 1.200.000
    bulan: 'Februari',
    realisasi: {
      'Februari': {
        tgl: '2026-02-27',
        qty: 1,
        harga: 1200000,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: 'BKU-FEB-FDS-InternetIndihome'
      }
    }
  },
  { 
    jenis: 'Operasional', 
    desc: 'Listrik Token', 
    link: 'Ajri', 
    qty: 2245, 
    satuan: 'kWh', 
    harga: 900, // Total = 2.020.500
    bulan: 'Februari',
    realisasi: {
      'Februari': {
        tgl: '2026-02-27',
        qty: 2245,
        harga: 900,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: 'BKU-FEB-FDS-ListrikToken'
      }
    }
  }
];

// Retain non-Februari items for Unit 4, replace Februari items with exact screenshot items
const currentUnit4Items = importedData[4] || [];
const otherMonthsItems = currentUnit4Items.filter(item => item.bulan !== 'Februari');

importedData[4] = [...otherMonthsItems, ...februariFDSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI FDS (Unit 4) - Februari with ${februariFDSItems.length} exact screenshot items.`);
let totalNominalFeb = februariFDSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRI FDS Februari: Rp ${totalNominalFeb.toLocaleString('id-ID')}`);
