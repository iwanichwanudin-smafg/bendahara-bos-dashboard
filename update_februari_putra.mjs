import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG PUTRA (Unit 1) - Februari:
const februariPutraItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Tagihan Listrik Februari', link: '-', qty: 8632, satuan: 'kWh', totalNominal: 5453000, tgl: '2026-02-27' },
  { jenis: 'Operasional', desc: 'Jas Laboratorium MIPA (Uk.L 8 pcs, Uk.XL 8 pcs, Uk.XXL 4 pcs)', link: '-', qty: 20, satuan: 'pcs', totalNominal: 2500000, tgl: '2026-03-12' },

  // GAJI
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', totalNominal: 4179881, tgl: '2026-02-27' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', totalNominal: 6083315, tgl: '2026-02-27' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', totalNominal: 3994180, tgl: '2026-02-27' },

  // MODAL
  { jenis: 'Modal', desc: 'Lenovo Monitor 24 Inch D24-40 (Buat Perpus)', link: 'https://tk.tokopedia.com/ZS5rTdvEF/', qty: 1, satuan: 'pcs', totalNominal: 1395000, tgl: '2026-03-12' },
  { jenis: 'Modal', desc: 'Universal Bluetooth Keyboard (hitam) (Buat Perpus)', link: 'https://tk.tokopedia.com/ZS5rwJ1tS/', qty: 1, satuan: 'pcs', totalNominal: 155000, tgl: '2026-03-12' },
  { jenis: 'Modal', desc: 'Tablet Stand Holder Foldable 360 Rotatable merk AMINO', link: 'https://tk.tokopedia.com/ZS5rTLp7X/', qty: 1, satuan: 'pcs', totalNominal: 110000, tgl: '2026-03-12' }
];

const formattedFebruariItems = februariPutraItems.map(item => {
  const unitPrice = item.qty > 0 ? item.totalNominal / item.qty : item.totalNominal;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'Februari',
    realisasi: {
      'Februari': {
        tgl: item.tgl,
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-FEB-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Retain non-Februari items for Unit 1, replace Februari items with exact screenshot items
const currentUnit1Items = importedData[1] || [];
const otherMonthsItems = currentUnit1Items.filter(item => item.bulan !== 'Februari');

importedData[1] = [...otherMonthsItems, ...formattedFebruariItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRA (Unit 1) - Februari with ${formattedFebruariItems.length} exact screenshot items.`);
let totalNominalFeb = formattedFebruariItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRA Februari: Rp ${totalNominalFeb.toLocaleString('id-ID')}`);
