import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG MAHAD (Unit 2) - Februari:
const februariMahadItems = [
  { 
    jenis: 'Operasional', 
    desc: 'Tinta Printer HP Original 682 (Black dan Tricolor)', 
    link: 'https://tk.tokopedia.com/ZS5jSYLS8/', 
    qty: 4, 
    satuan: 'set', 
    harga: 460000, // Total = 1.840.000
    bulan: 'Februari',
    realisasi: {
      'Februari': {
        tgl: '2026-03-12',
        qty: 4,
        harga: 460000,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: 'BKU-FEB-MAHAD-TintaPrinter'
      }
    }
  },
  { 
    jenis: 'Modal', 
    desc: 'Kursi kantor (Goto GC1003 BLACK)', 
    link: 'https://tk.tokopedia.com/ZS5jf8dYR/', 
    qty: 6, 
    satuan: 'pcs', 
    harga: 550000, // Total = 3.300.000
    bulan: 'Februari',
    realisasi: {
      'Februari': {
        tgl: '2026-04-13',
        qty: 6,
        harga: 550000,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: 'BKU-FEB-MAHAD-KursiKantor'
      }
    }
  }
];

// Retain non-Februari items for Unit 2, replace Februari items with exact screenshot items
const currentUnit2Items = importedData[2] || [];
const otherMonthsItems = currentUnit2Items.filter(item => item.bulan !== 'Februari');

importedData[2] = [...otherMonthsItems, ...februariMahadItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG MAHAD (Unit 2) - Februari with ${februariMahadItems.length} exact screenshot items.`);
let totalNominalFeb = februariMahadItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG MAHAD Februari: Rp ${totalNominalFeb.toLocaleString('id-ID')}`);
