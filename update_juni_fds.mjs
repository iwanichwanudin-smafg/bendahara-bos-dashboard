import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG PUTRI FDS (Unit 4) - Juni:
const juniFDSItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, totalNominal: 1200000, tgl: '2026-06-03' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, totalNominal: 4040000, tgl: '2026-06-03' },
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 50, satuan: 'pcs', harga: 75000, totalNominal: 3750000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 3, satuan: 'rim', harga: 470000, totalNominal: 1410000, tgl: '2026-06-26' },

  // MODAL
  { jenis: 'Modal', desc: 'Lemari Kantor Besi Kaca Arsip 2 pintu', link: '-', qty: 3, satuan: 'unit', harga: 2050000, totalNominal: 6150000, tgl: '2026-06-26' }
];

const formattedFDSItems = juniFDSItems.map(item => {
  const unitPrice = item.harga;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'Juni',
    realisasi: {
      'Juni': {
        tgl: item.tgl,
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-JUN-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 4 (FDS) for Juni
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'Juni'), ...formattedFDSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI FDS (Unit 4) - Juni with ${formattedFDSItems.length} exact screenshot items.`);
let totalNominalJun = formattedFDSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRI FDS Juni: Rp ${totalNominalJun.toLocaleString('id-ID')}`);
