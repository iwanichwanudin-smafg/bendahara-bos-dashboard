import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot 2 for FG MAHAD (Unit 2) - Januari:
const januariMahadItems = [
  { 
    jenis: 'Modal', 
    desc: 'Karpet permadani', 
    link: '-', 
    qty: 2, 
    satuan: 'pcs', 
    harga: 920000, // Total 1.840.000
    bulan: 'Januari',
    realisasi: {
      'Januari': {
        tgl: '2026-02-27',
        qty: 2,
        harga: 920000,
        link: 'Sudah BKU (Verified Screenshot 2)',
        invoice: 'BKU-JAN-MAHAD-KarpetPermadani'
      }
    }
  },
  { 
    jenis: 'Modal', 
    desc: 'CCTV', 
    link: 'https://s.shopee.co.id/8fMQV1NNul?share_channel_code=1', 
    qty: 4, 
    satuan: 'pcs', 
    harga: 500000, // Total 2.000.000
    bulan: 'Januari',
    realisasi: {
      'Januari': {
        tgl: '2026-02-27',
        qty: 4,
        harga: 500000,
        link: 'Sudah BKU (Verified Screenshot 2)',
        invoice: 'BKU-JAN-MAHAD-CCTV'
      }
    }
  }
];

// Retain non-Januari items for Unit 2, replace Januari items with exact screenshot 2 items
const currentUnit2Items = importedData[2] || [];
const otherMonthsItems = currentUnit2Items.filter(item => item.bulan !== 'Januari');

importedData[2] = [...januariMahadItems, ...otherMonthsItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG MAHAD (Unit 2) - Januari with ${januariMahadItems.length} exact screenshot items.`);
let totalNominalJan = januariMahadItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG MAHAD Januari: Rp ${totalNominalJan.toLocaleString('id-ID')}`);
