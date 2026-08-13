import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - Juli Anggaran:
const juliPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Juli', link: '-', qty: 1, satuan: 'bulan', harga: 7960000, totalNominal: 7960000, tgl: '2026-07-01' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5800000, totalNominal: 5800000, tgl: '2026-07-28' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, totalNominal: 6300000, tgl: '2026-07-28' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, totalNominal: 4200000, tgl: '2026-07-28' }
];

// 2. FG PUTRI FDS (Unit 4) - Juli Anggaran:
const juliFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, totalNominal: 1200000, tgl: '2026-07-01' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, totalNominal: 4040000, tgl: '2026-07-01' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'Juli',
    realisasi: {
      'Juli': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Rencana Anggaran (Plan)',
        invoice: `RAB-JUL-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'Juli'), ...formatItems(juliPutraItems, 'PUTRA')];

// Update Unit 4 (FDS)
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'Juli'), ...formatItems(juliFDSItems, 'FDS')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('Juli Anggaran items updated successfully for PUTRA and FDS.');
