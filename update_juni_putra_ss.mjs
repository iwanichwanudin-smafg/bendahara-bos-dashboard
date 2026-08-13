import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 14 items from Screenshot 1 for PUTRA (Unit 1) - Juni 2026:
const juniPutraPart1 = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Juni', link: '-', qty: 1, satuan: 'bulan', harga: 7111540, realQty: 1, realPrice: 7111540, tgl: '3 Jun 2026' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 12, satuan: 'rim', harga: 470000, realQty: 12, realPrice: 470000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Kertas Concorde 160 gr', link: '-', qty: 30, satuan: 'pak', harga: 19000, realQty: 30, realPrice: 19000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'CAT Tembok 25Kg', link: '-', qty: 11, satuan: 'pail', harga: 2798000, realQty: 11, realPrice: 2798000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Cat Dasar', link: '-', qty: 4, satuan: 'pail', harga: 1570000, realQty: 4, realPrice: 1570000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Roll Cat', link: '-', qty: 8, satuan: 'pcs', harga: 86000, realQty: 8, realPrice: 86000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Bak Cat', link: '-', qty: 5, satuan: 'pcs', harga: 22000, realQty: 5, realPrice: 22000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Kuas 3 Inch', link: '-', qty: 4, satuan: 'pcs', harga: 45000, realQty: 4, realPrice: 45000, tgl: '26 Jun 2026' },
  { jenis: 'Operasional', desc: 'Amplas 120', link: '-', qty: 2, satuan: 'roll', harga: 38000, realQty: 2, realPrice: 38000, tgl: '26 Jun 2026' },
  { jenis: 'Modal', desc: 'Papan Tulis White Board', link: '-', qty: 5, satuan: 'unit', harga: 750000, realQty: 5, realPrice: 750000, tgl: '26 Jun 2026' },
  { jenis: 'Modal', desc: 'Lenovo IdeaPad Slim intel core i3 Gen 13', link: '-', qty: 3, satuan: 'pcs', harga: 9585000, realQty: 3, realPrice: 9585000, tgl: '26 Jun 2026' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5646479, realQty: 1, realPrice: 5646479, tgl: '26 Jun 2026' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6015186, realQty: 1, realPrice: 6015186, tgl: '26 Jun 2026' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 3789337, realQty: 1, realPrice: 3789337, tgl: '26 Jun 2026' }
];

// Exact 15 BUKU items from Screenshot 2 for PUTRA (Unit 1) - Juni 2026:
const juniPutraPart2 = [
  { desc: 'Buku Scythe', harga: 87900 },
  { desc: 'Buku Thunderhead', harga: 94000 },
  { desc: 'Buku Nak, Maafkan Bapak', harga: 106000 },
  { desc: 'Buku I Want To Eat Your Pancreas', harga: 142000 },
  { desc: 'Buku 48 Laws of Power', harga: 161000 },
  { desc: 'Buku How to Win Friends and Influence People', harga: 220000 },
  { desc: 'Buku Sisi Tergelap Surga', harga: 105000 },
  { desc: 'Buku The Maxwell Daily Reader', harga: 108000 },
  { desc: 'Buku The Happiness Advantage', harga: 377000 },
  { desc: 'Buku Hyouka', harga: 74000 },
  { desc: 'Buku HARGA SEBUAH PERCAYA', harga: 107000 },
  { desc: 'Buku The Principle of Power', harga: 76000 },
  { desc: 'Buku Seporsi Mie Ayam Sebelum Mati', harga: 109000 },
  { desc: 'Buku Selesai Dengan Diri Sendiri', harga: 150000 },
  { desc: 'Bayna Yadayk Lil Muallim (Jilid 1)', harga: 500000 }
].map(item => ({
  jenis: 'Buku',
  desc: item.desc,
  link: '-',
  qty: 1,
  satuan: 'eks',
  harga: item.harga,
  realQty: 1,
  realPrice: item.harga,
  tgl: '24 Jun 2026'
}));

const juniPutraAll = [...juniPutraPart1, ...juniPutraPart2].map(item => ({
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
      invoice: `BKU-JUN-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Juni items for Unit 1 (PUTRA)
const otherUnit1 = (importedData[1] || []).filter(item => item.bulan !== 'Juni');

importedData[1] = [...otherUnit1, ...juniPutraAll];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT JUNI (PUTRA) ===');
const totalPart1 = juniPutraPart1.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalPart2 = juniPutraPart2.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRabAll = totalPart1 + totalPart2;

console.log(`PUTRA JUNI Part 1 (Operasional, Modal, Gaji) : Rp ${totalPart1.toLocaleString('id-ID')}`);
console.log(`PUTRA JUNI Part 2 (15 Buku)                 : Rp ${totalPart2.toLocaleString('id-ID')}`);
console.log(`PUTRA JUNI GRAND TOTAL RAB & REALISASI BKU   : Rp ${totalRabAll.toLocaleString('id-ID')} (${totalRabAll === 101806442 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
