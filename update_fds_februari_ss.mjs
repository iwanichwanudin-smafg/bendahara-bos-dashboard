import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FDS (Unit 4) - Februari 2026:
const fdsFebruariItems = [
  { 
    jenis: 'Operasional', 
    desc: 'Internet Indihome', 
    link: '-', 
    qty: 1, 
    satuan: 'bulan', 
    harga: 1200000, 
    tgl: '27 Feb 2026' 
  },
  { 
    jenis: 'Operasional', 
    desc: 'Listrik Token', 
    link: '-', 
    qty: 2245, 
    satuan: 'kWh', 
    harga: 900, 
    tgl: '27 Feb 2026' 
  }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Februari',
  realisasi: {
    'Februari': {
      tgl: item.tgl,
      qty: item.qty,
      harga: item.harga,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-FEB-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Februari items for FDS (Unit 4)
const otherUnit4 = (importedData[4] || []).filter(item => item.bulan !== 'Februari');

importedData[4] = [...otherUnit4, ...fdsFebruariItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT FDS FEBRUARI ===');
const totalRab = fdsFebruariItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalReal = fdsFebruariItems.reduce((s, i) => s + (i.realisasi.Februari.qty * i.realisasi.Februari.harga), 0);

console.log(`FDS RAB Target      : 3.220.500 -> Calculated: Rp ${totalRab.toLocaleString('id-ID')} (${totalRab === 3220500 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`FDS Realisasi Target : 3.220.500 -> Calculated: Rp ${totalReal.toLocaleString('id-ID')} (${totalReal === 3220500 ? 'MATCH ✓' : 'DIFF ✗'})`);
