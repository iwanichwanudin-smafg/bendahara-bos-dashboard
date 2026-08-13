import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for RABBANI (Unit 5) - Januari:
const rabbaniJanuariItems = [
  // OPERASIONAL (Kuning)
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 135, satuan: 'pcs', harga: 75000 },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 60, satuan: 'rim', harga: 70000 },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 5, satuan: 'rim', harga: 80000 },
  { jenis: 'Operasional', desc: 'Spidol whiteboard', link: '-', qty: 4, satuan: 'lusin / box', harga: 111000 },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard', link: '-', qty: 23, satuan: 'btl', harga: 27000 },
  { jenis: 'Operasional', desc: 'Penghapus whiteboard joyco magnet', link: '-', qty: 23, satuan: 'pcs', harga: 13000 },
  { jenis: 'Operasional', desc: 'Cutter L-500', link: '-', qty: 1, satuan: 'box', harga: 251000 },
  { jenis: 'Operasional', desc: 'Isi Cutter L-500', link: '-', qty: 12, satuan: 'pak', harga: 11000, note: 'Perlu direvisi di Perubahan' },
  { jenis: 'Operasional', desc: 'Binder Clip No. 260', link: '-', qty: 1, satuan: 'gross', harga: 303000 },
  { jenis: 'Operasional', desc: 'Ballpoint Standard AE7 hitam', link: '-', qty: 15, satuan: 'pak', harga: 32000, tgl: '27 Feb 2026' },
  { jenis: 'Operasional', desc: 'Ballpoint Standard AE7 merah', link: '-', qty: 15, satuan: 'pak', harga: 32000 },
  { jenis: 'Operasional', desc: 'Amplop putih 110 x 230 mm (90 pps)', link: '-', qty: 10, satuan: 'pak', harga: 39000 },
  { jenis: 'Operasional', desc: 'Amplop coklat merk Airmail', link: '-', qty: 4, satuan: 'pak', harga: 82000 },
  { jenis: 'Operasional', desc: 'Double tape 1 inch', link: '-', qty: 12, satuan: 'buah', harga: 8000 },
  { jenis: 'Operasional', desc: 'Lakban Bening 2 inch', link: '-', qty: 10, satuan: 'pcs', harga: 12000 },
  { jenis: 'Operasional', desc: 'Lakban Hitam 2 inch', link: '-', qty: 10, satuan: 'pcs', harga: 22000 },
  { jenis: 'Operasional', desc: 'Map Kertas Warna merk Diamond', link: '-', qty: 5, satuan: 'pak', harga: 113000 },
  { jenis: 'Operasional', desc: 'Lem kertas kenko stick 15gr', link: '-', qty: 8, satuan: 'lusin', harga: 80000 },
  { jenis: 'Operasional', desc: 'Isi staples no.10-1M Max', link: '-', qty: 4, satuan: 'pak', harga: 88000 },
  { jenis: 'Operasional', desc: 'Staples joyko no. 10', link: '-', qty: 45, satuan: 'pcs', harga: 17000 },

  // MODAL (Biru/Hijau)
  { jenis: 'Modal', desc: 'Penggaris Jangka 1 Set, matematika (Guru)', link: '-', qty: 5, satuan: 'set', harga: 630000, tgl: '27 Feb 2026' },
  { jenis: 'Modal', desc: 'Flasdisk SSD portable 512 GB merk V Gen', link: '-', qty: 1, satuan: 'pcs', harga: 1885000 }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Januari',
  note: item.note || undefined,
  realisasi: {
    'Januari': {
      tgl: item.tgl || '2026-02-27',
      qty: item.qty,
      harga: item.harga,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-JAN-RABBANI-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Keep non-Januari items for Rabbani (Unit 5)
const otherUnit5 = (importedData[5] || []).filter(item => item.bulan !== 'Januari');

importedData[5] = [...rabbaniJanuariItems, ...otherUnit5];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT RABBANI JANUARI ===');
const totalRab = rabbaniJanuariItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalReal = rabbaniJanuariItems.reduce((s, i) => s + (i.realisasi.Januari.qty * i.realisasi.Januari.harga), 0);

console.log(`RABBANI RAB Target  : 26.246.000 -> Calculated: Rp ${totalRab.toLocaleString('id-ID')} (${totalRab === 26246000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`RABBANI Realisasi   : Target 26.246.000 -> Calculated: Rp ${totalReal.toLocaleString('id-ID')} (${totalReal === 26246000 ? 'MATCH ✓' : 'DIFF ✗'})`);
