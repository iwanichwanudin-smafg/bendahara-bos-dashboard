import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - Maret:
const maretPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Maret', link: '-', qty: 6793, satuan: 'kWh', harga: 929, totalNominal: 6310697, tgl: '2026-03-05' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 3426320, totalNominal: 3426320, tgl: '2026-03-27' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 5807816, totalNominal: 5807816, tgl: '2026-03-27' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 3343530, totalNominal: 3343530, tgl: '2026-03-27' }
];

// 2. FG MAHAD (Unit 2) - Maret:
const maretMahadItems = [
  { jenis: 'Operasional', desc: 'Bola Basket MOLTEN BG 4550 Size 7', link: '-', qty: 3, satuan: 'pcs', harga: 883000, totalNominal: 2649000, tgl: '2026-04-13' },
  { jenis: 'Operasional', desc: 'Bola Futsal OrtusEight (Uk. 4)', link: '-', qty: 4, satuan: 'pcs', harga: 373000, totalNominal: 1492000, tgl: '2026-04-13' },
  { jenis: 'Modal', desc: 'Vacuum Cleaner', link: '-', qty: 1, satuan: 'pcs', harga: 883061, totalNominal: 883061, tgl: '2026-04-13' }
];

// 3. FG PUTRI FDS (Unit 4) - Maret:
const maretFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, totalNominal: 1200000, tgl: '2026-03-05' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 2245, satuan: 'kWh', harga: 900, totalNominal: 2020500, tgl: '2026-03-05' },
  { jenis: 'Modal', desc: 'Kipas Angin Phillips berdiri', link: '-', qty: 3, satuan: 'unit', harga: 510000, totalNominal: 1530000, tgl: '2026-04-13' }
];

// 4. RABBANI (Unit 5) - Maret:
const maretRabbaniItems = [
  { jenis: 'Operasional', desc: 'Bola Voli Molten V5M5000 Flistatec Original', link: '-', qty: 4, satuan: 'buah', harga: 1010000, totalNominal: 4040000, tgl: '2026-04-13' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'Maret',
    realisasi: {
      'Maret': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-MAR-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'Maret'), ...formatItems(maretPutraItems, 'PUTRA')];

// Update Unit 2 (MAHAD)
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'Maret'), ...formatItems(maretMahadItems, 'MAHAD')];

// Update Unit 4 (FDS)
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'Maret'), ...formatItems(maretFDSItems, 'FDS')];

// Update Unit 5 (RABBANI)
importedData[5] = [...(importedData[5] || []).filter(i => i.bulan !== 'Maret'), ...formatItems(maretRabbaniItems, 'RABBANI')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('Maret items updated successfully for PUTRA, MAHAD, FDS, and RABBANI.');
