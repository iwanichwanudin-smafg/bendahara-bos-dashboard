import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot 3 for FG PUTRI FDS (Unit 4) - Januari:
const januariFDSItems = [
  { 
    jenis: 'Operasional', 
    desc: 'Internet Indihome', 
    link: '-', 
    qty: 1, 
    satuan: 'bulan', 
    harga: 1200000, // Total = 1.200.000
    bulan: 'Januari',
    realisasi: {
      'Januari': {
        tgl: '2026-02-27',
        qty: 1,
        harga: 1200000,
        link: 'Sudah BKU (Verified Screenshot 3)',
        invoice: 'BKU-JAN-FDS-InternetIndihome'
      }
    }
  },
  { 
    jenis: 'Modal', 
    desc: 'Printer Canon pixma G3730 green', 
    link: 'https://tk.tokopedia.com/ZSajb17mK/, https://id.shp.ee/V2tps1k', 
    qty: 1, 
    satuan: 'unit', 
    harga: 3360000, // Total = 3.360.000
    bulan: 'Januari',
    realisasi: {
      'Januari': {
        tgl: '2026-02-27',
        qty: 1,
        harga: 3360000,
        link: 'Sudah BKU (Verified Screenshot 3)',
        invoice: 'BKU-JAN-FDS-PrinterCanon'
      }
    }
  }
];

// Retain non-Januari items for Unit 4, replace Januari items with exact screenshot 3 items
const currentUnit4Items = importedData[4] || [];
const otherMonthsItems = currentUnit4Items.filter(item => item.bulan !== 'Januari');

importedData[4] = [...januariFDSItems, ...otherMonthsItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI FDS (Unit 4) - Januari with ${januariFDSItems.length} exact screenshot items.`);
let totalNominalJan = januariFDSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRI FDS Januari: Rp ${totalNominalJan.toLocaleString('id-ID')}`);
