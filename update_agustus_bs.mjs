import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG PUTRI BS (Unit 3) - Agustus:
const agustusBSItems = [
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 69, satuan: 'rim', harga: 70000, totalNominal: 4830000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 44, satuan: 'rim', harga: 80000, totalNominal: 3520000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Box File merk Bambi Biru dan hitam uk. Jumbo (1033)', link: '-', qty: 24, satuan: 'pcs', harga: 59000, totalNominal: 1416000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Soklin lantai 770 ml', link: '-', qty: 51, satuan: 'pcs', harga: 19000, totalNominal: 969000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Mama lemon 680ml', link: '-', qty: 327, satuan: 'pcs', harga: 13000, totalNominal: 4251000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Cling Pembersih Kaca 400ml', link: '-', qty: 18, satuan: 'pcs', harga: 11000, totalNominal: 198000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Pengharum Ruangan Gantung', link: '-', qty: 12, satuan: 'pcs', harga: 19000, totalNominal: 228000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Glade matic device spray', link: '-', qty: 4, satuan: 'pcs', harga: 97000, totalNominal: 388000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Refill pewangi spray Glade', link: '-', qty: 45, satuan: 'pcs', harga: 43000, totalNominal: 1935000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Trashbag Hitam 60x80', link: '-', qty: 45, satuan: 'pak', harga: 32000, totalNominal: 1440000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Trashbag Bening', link: '-', qty: 15, satuan: 'pak', harga: 32000, totalNominal: 480000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tisu Wajah Nice', link: '-', qty: 100, satuan: 'pcs', harga: 22000, totalNominal: 2200000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tisu Toilet Nice', link: '-', qty: 75, satuan: 'pcs', harga: 10000, totalNominal: 750000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Sapu ijuk', link: '-', qty: 30, satuan: 'pcs', harga: 44000, totalNominal: 1320000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Alat pel', link: '-', qty: 30, satuan: 'pcs', harga: 44000, totalNominal: 1320000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Wiper/Karet Pembersih Kaca Jendela', link: '-', qty: 15, satuan: 'Pcs', harga: 56000, totalNominal: 840000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Tiner Pembersih Meja/Kursi', link: '-', qty: 2, satuan: 'Drigen/5ltr', harga: 66000, totalNominal: 132000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Kantong Plastik Warna Merah No.28', link: '-', qty: 12, satuan: 'pak', harga: 45000, totalNominal: 540000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Kantong Plastik Warna Merah No.50', link: '-', qty: 30, satuan: 'pak', harga: 84000, totalNominal: 2520000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Baterai AA', link: '-', qty: 60, satuan: 'pak / isi 6', harga: 38000, totalNominal: 2280000, tgl: '2026-08-15' },
  { jenis: 'Operasional', desc: 'Baterai AAA', link: '-', qty: 60, satuan: 'pak / isi 6', harga: 35000, totalNominal: 2100000, tgl: '2026-08-15' }
];

const formattedBSItems = agustusBSItems.map(item => {
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
        invoice: `RAB-AGT-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 3 (BS) for Agustus
importedData[3] = [...(importedData[3] || []).filter(i => i.bulan !== 'Agustus'), ...formattedBSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI BS (Unit 3) - Agustus with ${formattedBSItems.length} exact screenshot items.`);
let totalNominalAgt = formattedBSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Anggaran FG PUTRI BS Agustus: Rp ${totalNominalAgt.toLocaleString('id-ID')}`);
