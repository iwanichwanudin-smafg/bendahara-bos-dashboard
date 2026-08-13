import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 20 BUKU items from Screenshot for BS (Unit 3) - Juni 2026:
const juniBSBuku = [
  { desc: 'Kimia 10 smart book', qty: 25, harga: 146000 },
  { desc: 'Kimia 11 smart book', qty: 12, harga: 143000 },
  { desc: 'Kimia 12 smart book', qty: 10, harga: 134000 },
  { desc: 'Fisika 10 smart book', qty: 25, harga: 146000 },
  { desc: 'Fisika 11 smart book', qty: 6, harga: 143000 },
  { desc: 'Fisika 12 smart book', qty: 8, harga: 150000 },
  { desc: 'Matematika 10 smart book', qty: 30, harga: 146000 },
  { desc: 'Matematika 11 smart book', qty: 30, harga: 127000 },
  { desc: 'Matematika 12 smart book', qty: 20, harga: 112000 },
  { desc: 'Matematika TL 11', qty: 9, harga: 143000 },
  { desc: 'Matematika TL 12', qty: 14, harga: 132000 },
  { desc: 'Biologi 10 smart book', qty: 28, harga: 146000 },
  { desc: 'Biologi 11 smart book', qty: 15, harga: 159000 },
  { desc: 'Biologi 12 smart book', qty: 10, harga: 123000 },
  { desc: 'Ekonomi 10', qty: 28, harga: 146000 },
  { desc: 'Ekonomi 11', qty: 9, harga: 143000 },
  { desc: 'Ekonomi 12', qty: 14, harga: 143000 },
  { desc: 'INFORMATIKA SMA KLS X HET', qty: 50, harga: 22500 },
  { desc: 'INFORMATIKA SMA KLS XI HET', qty: 60, harga: 25800 },
  { desc: 'INFORMATIKA SMA KLS XII HET', qty: 50, harga: 19000 }
].map(item => ({
  jenis: 'Buku',
  desc: item.desc,
  link: '-',
  qty: item.qty,
  satuan: 'eks',
  harga: item.harga,
  bulan: 'Juni',
  realisasi: {
    'Juni': {
      tgl: '24 Jun 2026',
      qty: item.qty,
      harga: item.harga,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-JUN-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Buku Juni items for Unit 3 (BS) + non-Juni items
const existingUnit3 = importedData[3] || [];
const otherMonthsUnit3 = existingUnit3.filter(item => item.bulan !== 'Juni');
const opModalJuniUnit3 = existingUnit3.filter(item => item.bulan === 'Juni' && item.jenis !== 'Buku');

importedData[3] = [...otherMonthsUnit3, ...opModalJuniUnit3, ...juniBSBuku];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT JUNI (BS BUKU) ===');
const totalOpModal = opModalJuniUnit3.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalBuku = juniBSBuku.reduce((s, i) => s + (i.qty * i.harga), 0);
const grandTotalBSJuni = totalOpModal + totalBuku;

console.log(`BS JUNI Operasional & Modal (11 Item) : Rp ${totalOpModal.toLocaleString('id-ID')}`);
console.log(`BS JUNI Buku (20 Item)                : Rp ${totalBuku.toLocaleString('id-ID')}`);
console.log(`BS JUNI GRAND TOTAL RAB & REALISASI   : Rp ${grandTotalBSJuni.toLocaleString('id-ID')} (${grandTotalBSJuni === 83821156 ? 'MATCH PERSIS 100% ✓' : 'DIFF ✗'})`);
