import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 11 Operasional & Modal items for BS (Unit 3) - Juni 2026:
const juniBSItems = [
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 80, satuan: 'pcs', harga: 75000, realQty: 80, realPrice: 75000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 5, satuan: 'rim', harga: 470000, realQty: 5, realPrice: 470000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Larutan iodin/ iodium yodium 100 ml', link: '-', qty: 1, satuan: 'botol', harga: 117156, realQty: 1, realPrice: 117156, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Larutan Bivret (uji protein) 250ml', link: '-', qty: 2, satuan: 'pcs', harga: 88000, realQty: 2, realPrice: 88000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Pita Magnesium (25 gram) 3,5 meter', link: '-', qty: 2, satuan: 'roll', harga: 380000, realQty: 2, realPrice: 380000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Gelas sloki', link: '-', qty: 30, satuan: 'pcs', harga: 5000, realQty: 30, realPrice: 5000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Stearin', link: '-', qty: 15, satuan: 'pak', harga: 10000, realQty: 15, realPrice: 10000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Minyak Sawit/Goreng 2000ml', link: '-', qty: 2, satuan: 'botol', harga: 69000, realQty: 2, realPrice: 69000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Vaseline jelly 50ml repairing gel', link: '-', qty: 3, satuan: 'botol', harga: 44000, realQty: 3, realPrice: 44000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Minyak Zaitun 1000ml', link: '-', qty: 3, satuan: 'botol', harga: 137000, realQty: 3, realPrice: 137000, tgl: '26 Jun 2026' },
  { jenis: 'Modal', desc: 'Lenovo IdeaPad Slim Intel core i3 Gen 13', link: '-', qty: 3, satuan: 'pcs', harga: 9585000, realQty: 3, realPrice: 9585000, tgl: '26 Jun 2026' }
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
      invoice: `BKU-JUN-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Juni items for Unit 3 (BS)
const otherUnit3 = (importedData[3] || []).filter(item => item.bulan !== 'Juni');

importedData[3] = [...otherUnit3, ...juniBSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT JUNI (BS OPERASIONAL & MODAL) ===');
const totalRab = juniBSItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalReal = juniBSItems.reduce((s, i) => s + (i.realisasi.Juni.qty * i.realisasi.Juni.harga), 0);

console.log(`BS JUNI RAB Target       : 39.139.156 -> Calculated: Rp ${totalRab.toLocaleString('id-ID')} (${totalRab === 39139156 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
console.log(`BS JUNI Realisasi Target  : 39.139.156 -> Calculated: Rp ${totalReal.toLocaleString('id-ID')} (${totalReal === 39139156 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
