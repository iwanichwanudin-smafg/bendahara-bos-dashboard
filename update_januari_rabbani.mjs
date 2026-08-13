import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot 4 for RABBANI (Unit 5) - Januari:
const januariRabbaniItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 135, satuan: 'pcs', totalNominal: 10125000 },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 60, satuan: 'rim', totalNominal: 4200000 },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 5, satuan: 'rim', totalNominal: 400000 },
  { jenis: 'Operasional', desc: 'Spidol whiteboard', link: '-', qty: 4, satuan: 'lusin / box', totalNominal: 444000 },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard', link: '-', qty: 23, satuan: 'btl', totalNominal: 621000 },
  { jenis: 'Operasional', desc: 'Penghapus whiteboard joyco magnet', link: '-', qty: 23, satuan: 'pcs', totalNominal: 299000 },
  { jenis: 'Operasional', desc: 'Cutter L-500', link: '-', qty: 1, satuan: 'box', totalNominal: 251000 },
  { jenis: 'Operasional', desc: 'Isi Cutter L-500', link: '-', qty: 12, satuan: 'pak', totalNominal: 132000 },
  { jenis: 'Operasional', desc: 'Binder Clip No. 260', link: '-', qty: 1, satuan: 'gross', totalNominal: 303000 },
  { jenis: 'Operasional', desc: 'Ballpoint Standard AE7 hitam', link: '-', qty: 15, satuan: 'pak', totalNominal: 480000 },
  { jenis: 'Operasional', desc: 'Ballpoint Standard AE7 merah', link: '-', qty: 15, satuan: 'pak', totalNominal: 480000 },
  { jenis: 'Operasional', desc: 'Amplop putih 110 x 230 mm (90 pps)', link: '-', qty: 10, satuan: 'pak', totalNominal: 390000 },
  { jenis: 'Operasional', desc: 'Amplop coklat merk Airmail', link: '-', qty: 4, satuan: 'pak', totalNominal: 328000 },
  { jenis: 'Operasional', desc: 'Double tape 1 inch', link: '-', qty: 12, satuan: 'buah', totalNominal: 96000 },
  { jenis: 'Operasional', desc: 'Lakban Bening 2 inch', link: '-', qty: 10, satuan: 'pcs', totalNominal: 120000 },
  { jenis: 'Operasional', desc: 'Lakban Hitam 2 inch', link: '-', qty: 10, satuan: 'pcs', totalNominal: 220000 },
  { jenis: 'Operasional', desc: 'Map Kertas Warna merk Diamond', link: '-', qty: 5, satuan: 'pak', totalNominal: 565000 },
  { jenis: 'Operasional', desc: 'Lem kertas kenko stick 15gr', link: '-', qty: 8, satuan: 'lusin', totalNominal: 640000 },
  { jenis: 'Operasional', desc: 'Isi staples no. 10-1M Max', link: '-', qty: 4, satuan: 'pak', totalNominal: 352000 },
  { jenis: 'Operasional', desc: 'Staples joyko no. 10', link: '-', qty: 45, satuan: 'pcs', totalNominal: 765000 },

  // MODAL
  { jenis: 'Modal', desc: 'Penggaris Jangka 1 Set, matematika (Guru)', link: '-', qty: 5, satuan: 'set', totalNominal: 3150000 },
  { jenis: 'Modal', desc: 'Flasdisk SSD portable 512 GB merk V Gen', link: '-', qty: 1, satuan: 'pcs', totalNominal: 1885000 }
];

const formattedRabbaniItems = januariRabbaniItems.map(item => {
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
        link: 'Sudah BKU (Verified Screenshot 4)',
        invoice: `BKU-JAN-RABBANI-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Retain non-Januari items for Unit 5, replace Januari items with exact screenshot 4 items
const currentUnit5Items = importedData[5] || [];
const otherMonthsItems = currentUnit5Items.filter(item => item.bulan !== 'Januari');

importedData[5] = [...formattedRabbaniItems, ...otherMonthsItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated RABBANI (Unit 5) - Januari with ${formattedRabbaniItems.length} exact screenshot items.`);
let totalNominalJan = formattedRabbaniItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi RABBANI Januari: Rp ${totalNominalJan.toLocaleString('id-ID')}`);
