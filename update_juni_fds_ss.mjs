import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 5 items for FDS (Unit 4) - Juni 2026:
const juniFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, realQty: 1, realPrice: 1200000, tgl: '3 Jun 2026' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, realQty: 4, realPrice: 1010000, tgl: '3 Jun 2026' },
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 50, satuan: 'pcs', harga: 75000, realQty: 50, realPrice: 75000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 3, satuan: 'rim', harga: 470000, realQty: 3, realPrice: 470000, tgl: '26 Jun 2026' },
  { jenis: 'Modal', desc: 'Lemari Kantor Besi Kaca Arsip 2 pintu', link: '-', qty: 3, satuan: 'unit', harga: 2050000, realQty: 3, realPrice: 2050000, tgl: '26 Jun 2026' }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Juni',
  realisasi: {
    'Juni': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-JUN-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Juni items for Unit 4 (FDS)
const otherUnit4 = (importedData[4] || []).filter(item => item.bulan !== 'Juni');

importedData[4] = [...otherUnit4, ...juniFDSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT JUNI (FDS) ===');
const totalRab = juniFDSItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalReal = juniFDSItems.reduce((s, i) => s + (i.realisasi.Juni.qty * i.realisasi.Juni.harga), 0);

console.log(`FDS JUNI RAB Target       : 16.550.000 -> Calculated: Rp ${totalRab.toLocaleString('id-ID')} (${totalRab === 16550000 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
console.log(`FDS JUNI Realisasi Target  : 16.550.000 -> Calculated: Rp ${totalReal.toLocaleString('id-ID')} (${totalReal === 16550000 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
