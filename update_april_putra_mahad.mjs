import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - April:
const aprilPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik April', link: '-', qty: 1, satuan: 'bulan', harga: 4890727, totalNominal: 4890727, tgl: '2026-04-07' },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 17, satuan: 'rim', harga: 70000, totalNominal: 1190000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 3, satuan: 'rim', harga: 80000, totalNominal: 240000, tgl: '2026-05-26' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 2, satuan: 'bulan', harga: 5764374, totalNominal: 11528748, tgl: '2026-04-28' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6015186, totalNominal: 6015186, tgl: '2026-04-28' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 3789337, totalNominal: 3789337, tgl: '2026-04-28' }
];

// 2. FG MAHAD (Unit 2) - April:
const aprilMahadItems = [
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 70, satuan: 'rim', harga: 70000, totalNominal: 4900000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 35, satuan: 'rim', harga: 80000, totalNominal: 2800000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tali tambang 22mm (8 meter)', link: '-', qty: 8, satuan: 'meter', harga: 32000, totalNominal: 256000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Mic Imam Sholat', link: '-', qty: 1, satuan: 'pcs', harga: 248000, totalNominal: 248000, tgl: '2026-05-26' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'April',
    realisasi: {
      'April': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-APR-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'April'), ...formatItems(aprilPutraItems, 'PUTRA')];

// Update Unit 2 (MAHAD)
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'April'), ...formatItems(aprilMahadItems, 'MAHAD')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('April items updated successfully for PUTRA and MAHAD.');
