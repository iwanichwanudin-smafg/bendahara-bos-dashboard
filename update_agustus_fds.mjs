import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG PUTRI FDS (Unit 4) - Agustus:
const agustusFDSItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, totalNominal: 1200000, tgl: '2026-08-01' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 5, satuan: 'paket', harga: 1010000, totalNominal: 5050000, tgl: '2026-08-01' },

  // MODAL
  { jenis: 'Modal', desc: 'Printer HP Smart Ink 525/520/580', link: '-', qty: 1, satuan: 'unit', harga: 3006000, totalNominal: 3006000, tgl: '2026-08-15' },
  { jenis: 'Modal', desc: 'Proyektor Epson EB E600', link: '-', qty: 5, satuan: 'unit', harga: 7150000, totalNominal: 35750000, tgl: '2026-08-15' }
];

const formattedFDSItems = agustusFDSItems.map(item => {
  const unitPrice = item.harga;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'Agustus',
    realisasi: {
      'Agustus': {
        tgl: item.tgl,
        qty: item.qty,
        harga: unitPrice,
        link: 'Rencana Anggaran (Plan)',
        invoice: `RAB-AGT-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 4 (FDS) for Agustus
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'Agustus'), ...formattedFDSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI FDS (Unit 4) - Agustus with ${formattedFDSItems.length} exact screenshot items.`);
let totalNominalAgt = formattedFDSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Anggaran FG PUTRI FDS Agustus: Rp ${totalNominalAgt.toLocaleString('id-ID')}`);
