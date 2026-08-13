import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot 1 & 2 for RABBANI (Unit 5) - Agustus:
const agustusRabbaniItems = [
  // Screenshot 1
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 60, satuan: 'rim', harga: 70000, totalNominal: 4200000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 10, satuan: 'rim', harga: 80000, totalNominal: 800000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Spidol whiteboard', link: '-', qty: 8, satuan: 'lusin / box', harga: 111000, totalNominal: 888000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard', link: '-', qty: 46, satuan: 'btl', harga: 27000, totalNominal: 1242000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Penghapus whiteboard joyco magnet', link: '-', qty: 46, satuan: 'pcs', harga: 13000, totalNominal: 598000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Box File merk Bambi Biru dan hitam uk. Jumbo (1033)', link: '-', qty: 84, satuan: 'pcs', harga: 59000, totalNominal: 4956000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Staples joyko no. 10', link: '-', qty: 45, satuan: 'pcs', harga: 17000, totalNominal: 765000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Sticky Note Post-It 3M 654', link: '-', qty: 98, satuan: 'pcs', harga: 21000, totalNominal: 2058000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Map Bussines File Uk F4 Biru, Kuning, Oren, Hijau', link: '-', qty: 40, satuan: 'lusin', harga: 32000, totalNominal: 1280000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Buku Kuitansi', link: '-', qty: 10, satuan: 'pcs', harga: 8000, totalNominal: 80000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Pembolong kertas joyko 30XL', link: '-', qty: 90, satuan: 'pcs', harga: 32000, totalNominal: 2880000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Gunting Sedang joyko', link: '-', qty: 96, satuan: 'pcs', harga: 12000, totalNominal: 1152000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Plastik Laminating A4 & F4 @ 2 pak', link: '-', qty: 4, satuan: 'pak', harga: 114000, totalNominal: 456000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Kertas Concorde 160 gr', link: '-', qty: 100, satuan: 'pak', harga: 19000, totalNominal: 1900000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Kertas foto glossy 210GR SPECTRA', link: '-', qty: 5, satuan: 'pak', harga: 38000, totalNominal: 190000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Plastik Fotocopy merk jeruk', link: '-', qty: 4, satuan: 'roll', harga: 126000, totalNominal: 504000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Stabilo', link: '-', qty: 180, satuan: 'pcs', harga: 8000, totalNominal: 1440000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Penggaris besi 100 cm', link: '-', qty: 4, satuan: 'pcs', harga: 95000, totalNominal: 380000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Penggaris besi 30 cm', link: '-', qty: 90, satuan: 'pcs', harga: 16000, totalNominal: 1440000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Penyangga buku besi (L)/pembatas buku', link: '-', qty: 90, satuan: 'pcs', harga: 33000, totalNominal: 2970000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tempat pensil meja', link: '-', qty: 90, satuan: 'pcs', harga: 23000, totalNominal: 2070000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Paperclip No 5', link: '-', qty: 10, satuan: 'gross', harga: 69000, totalNominal: 690000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Paperclip No 3', link: '-', qty: 10, satuan: 'gross', harga: 32000, totalNominal: 320000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 hitam', link: '-', qty: 40, satuan: 'pcs', harga: 123000, totalNominal: 4920000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 biru', link: '-', qty: 25, satuan: 'pcs', harga: 120000, totalNominal: 3000000, tgl: '2026-08-15' },

  // Screenshot 2
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 kuning', link: '-', qty: 25, satuan: 'pcs', harga: 120000, totalNominal: 3000000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 merah megenta', link: '-', qty: 25, satuan: 'pcs', harga: 120000, totalNominal: 3000000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta mesin fotocopy xerox', link: '-', qty: 10, satuan: 'pcs', harga: 628000, totalNominal: 6280000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Materai 10 ribu', link: '-', qty: 50, satuan: 'pcs', harga: 13000, totalNominal: 650000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta refill stampel (Hitam)', link: '-', qty: 10, satuan: 'pcs', harga: 26000, totalNominal: 260000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta refill stampel (Biru)', link: '-', qty: 5, satuan: 'pcs', harga: 26000, totalNominal: 130000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tinta refill stampel (Merah)', link: '-', qty: 5, satuan: 'pcs', harga: 26000, totalNominal: 130000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Bola Voli Molten V5M5000 Flistatec Original', link: '-', qty: 5, satuan: 'buah', harga: 1010000, totalNominal: 5050000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Soklin lantai 770 ml', link: '-', qty: 128, satuan: 'pcs', harga: 19000, totalNominal: 2432000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Mama lemon 680ml', link: '-', qty: 48, satuan: 'pcs', harga: 13000, totalNominal: 624000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Cling Pembersih Kaca 400ml', link: '-', qty: 24, satuan: 'pcs', harga: 11000, totalNominal: 264000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Harpic 450 ml', link: '-', qty: 40, satuan: 'botol', harga: 38000, totalNominal: 1520000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Handsoap/sabun cuci tangan', link: '-', qty: 12, satuan: 'jerigen', harga: 63000, totalNominal: 756000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Pengharum Ruangan Gantung', link: '-', qty: 75, satuan: 'pcs', harga: 19000, totalNominal: 1425000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tisu Wajah Nice', link: '-', qty: 48, satuan: 'pcs', harga: 22000, totalNominal: 1056000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Sapu ijuk', link: '-', qty: 8, satuan: 'pcs', harga: 44000, totalNominal: 352000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Wiper lantai', link: '-', qty: 8, satuan: 'pcs', harga: 38000, totalNominal: 304000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Pengki nagoya', link: '-', qty: 10, satuan: 'pcs', harga: 38000, totalNominal: 380000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tempat sampah Shinpo 10 liter', link: '-', qty: 10, satuan: 'pcs', harga: 95000, totalNominal: 950000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Alat Pel Lantai / spin mop / peras otomatis', link: '-', qty: 8, satuan: 'pcs', harga: 214000, totalNominal: 1712000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Ember', link: '-', qty: 10, satuan: 'pcs', harga: 69000, totalNominal: 690000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Keran', link: '-', qty: 10, satuan: 'pcs', harga: 51000, totalNominal: 510000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Gayung', link: '-', qty: 15, satuan: 'pcs', harga: 26000, totalNominal: 390000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Baterai AA', link: '-', qty: 6, satuan: 'pak / isi 6', harga: 38000, totalNominal: 228000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Lampu LED Philips 20 w putih', link: '-', qty: 25, satuan: 'pcs', harga: 82000, totalNominal: 2050000, tgl: '2026-08-15' }
];

const formattedRabbaniItems = agustusRabbaniItems.map(item => {
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
        invoice: `RAB-AGT-RABBANI-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 5 (Rabbani) for Agustus
importedData[5] = [...(importedData[5] || []).filter(i => i.bulan !== 'Agustus'), ...formattedRabbaniItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated RABBANI (Unit 5) - Agustus with ${formattedRabbaniItems.length} exact screenshot items.`);
let totalNominalAgt = formattedRabbaniItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Anggaran RABBANI Agustus: Rp ${totalNominalAgt.toLocaleString('id-ID')}`);
