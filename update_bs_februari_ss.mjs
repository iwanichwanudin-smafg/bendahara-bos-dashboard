import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact 34 items from Screenshots for BS (Unit 3) - Februari 2026:
const bsFebruariItems = [
  // PART 1 (ATK)
  { jenis: 'Operasional', desc: 'Binder Clip No. 260', link: '-', qty: 1, satuan: 'gross', harga: 303000 },
  { jenis: 'Operasional', desc: 'Binder Clip No. 105', link: '-', qty: 1, satuan: 'gross', harga: 50000 },
  { jenis: 'Operasional', desc: 'Binder Clip No. 107', link: '-', qty: 1, satuan: 'gross', harga: 56000 },
  { jenis: 'Operasional', desc: 'Pulpen Pilot Ballliner Hitam 0.8mm', link: '-', qty: 4, satuan: 'Lusin', harga: 262000 },
  { jenis: 'Operasional', desc: 'Pulpen Pilot Ballliner Biru 0.8mm', link: '-', qty: 4, satuan: 'Lusin', harga: 262000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.7 mm hitam', link: '-', qty: 1, satuan: 'Lusin', harga: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.7 mm biru', link: '-', qty: 1, satuan: 'Lusin', harga: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm merah', link: '-', qty: 1, satuan: 'Lusin', harga: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm coklat', link: '-', qty: 1, satuan: 'Lusin', harga: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm hitam', link: '-', qty: 1, satuan: 'Lusin', harga: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm biru', link: '-', qty: 1, satuan: 'Lusin', harga: 309000 },
  { jenis: 'Operasional', desc: 'Pensil Mekanik pentel 0.5', link: '-', qty: 12, satuan: 'pcs', harga: 20000 },
  { jenis: 'Operasional', desc: 'Double Tape 1/2 inch', link: '-', qty: 40, satuan: 'pcs', harga: 5000 },
  { jenis: 'Operasional', desc: 'Double Tape 1 inch', link: '-', qty: 40, satuan: 'pcs', harga: 8000 },
  { jenis: 'Operasional', desc: 'Lakban bening 1/2 inch', link: '-', qty: 40, satuan: 'pcs', harga: 6000 },
  { jenis: 'Operasional', desc: 'Lakban bening 1 inch', link: '-', qty: 40, satuan: 'pcs', harga: 10000 },
  { jenis: 'Operasional', desc: 'Lakban bening 2 inch', link: '-', qty: 60, satuan: 'pcs', harga: 12000, tgl: '12 Mar 2026' },
  { jenis: 'Operasional', desc: 'Lakban Hitam 2 inch', link: '-', qty: 40, satuan: 'pcs', harga: 22000 },

  // PART 2 (Kebersihan & Perlengkapan)
  { jenis: 'Operasional', desc: 'Soklin lantai 770 ml', link: '-', qty: 45, satuan: 'pcs', harga: 19000 },
  { jenis: 'Operasional', desc: 'Mama lemon 680ml', link: '-', qty: 200, satuan: 'pcs', harga: 13000 },
  { jenis: 'Operasional', desc: 'Cling Pembersih Kaca 400ml', link: '-', qty: 18, satuan: 'pcs', harga: 11000 },
  { jenis: 'Operasional', desc: 'Pengharum Ruangan Gantung', link: '-', qty: 12, satuan: 'pcs', harga: 19000 },
  { jenis: 'Operasional', desc: 'Glade matic device spray', link: '-', qty: 4, satuan: 'pcs', harga: 97000 },
  { jenis: 'Operasional', desc: 'Refill pewangi spray Glade', link: '-', qty: 45, satuan: 'pcs', harga: 43000 },
  { jenis: 'Operasional', desc: 'Trashbag Hitam 60x80', link: '-', qty: 45, satuan: 'pak', harga: 32000 },
  { jenis: 'Operasional', desc: 'Trashbag Bening', link: '-', qty: 15, satuan: 'pak', harga: 32000 },
  { jenis: 'Operasional', desc: 'Tisu Wajah Nice', link: '-', qty: 100, satuan: 'pcs', harga: 22000 },
  { jenis: 'Operasional', desc: 'Tisu Toilet Nice', link: '-', qty: 75, satuan: 'pcs', harga: 10000 },
  { jenis: 'Operasional', desc: 'Sapu ijuk', link: '-', qty: 30, satuan: 'pcs', harga: 44000 },
  { jenis: 'Operasional', desc: 'Alat pel', link: '-', qty: 30, satuan: 'pcs', harga: 44000 },
  { jenis: 'Operasional', desc: 'Wiper/Karet Pembersih Kaca Jendela', link: '-', qty: 15, satuan: 'Pcs', harga: 56000 },
  { jenis: 'Operasional', desc: 'Tiner Pembersih Meja/Kursi', link: '-', qty: 2, satuan: 'liter/kaleng', harga: 66000 },
  { jenis: 'Operasional', desc: 'Kantong Plastik Warna Merah No.28', link: '-', qty: 12, satuan: 'pak', harga: 45000 },
  { jenis: 'Operasional', desc: 'Kantong Plastik Warna Merah No.50', link: '-', qty: 30, satuan: 'pak', harga: 84000 }
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
      tgl: item.tgl || '12 Mar 2026',
      qty: item.qty,
      harga: item.harga,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-FEB-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Februari items for BS (Unit 3)
const otherUnit3 = (importedData[3] || []).filter(item => item.bulan !== 'Februari');

importedData[3] = [...otherUnit3, ...bsFebruariItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT BS FEBRUARI ===');
const totalRab = bsFebruariItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalReal = bsFebruariItems.reduce((s, i) => s + (i.realisasi.Februari.qty * i.realisasi.Februari.harga), 0);

console.log(`BS RAB Target      : 25.105.000 -> Calculated: Rp ${totalRab.toLocaleString('id-ID')} (${totalRab === 25105000 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`BS Realisasi Target : 25.105.000 -> Calculated: Rp ${totalReal.toLocaleString('id-ID')} (${totalReal === 25105000 ? 'MATCH ✓' : 'DIFF ✗'})`);
