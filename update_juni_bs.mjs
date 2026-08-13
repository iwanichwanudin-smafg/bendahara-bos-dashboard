import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG PUTRI BS (Unit 3) - Juni:
const juniBSItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 80, satuan: 'pcs', harga: 75000, totalNominal: 6000000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 5, satuan: 'rim', harga: 470000, totalNominal: 2350000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Larutan iodin/ iodium yodium 100 ml', link: '-', qty: 1, satuan: 'botol', harga: 117156, totalNominal: 117156, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Larutan Biuret (uji protein) 250ml', link: '-', qty: 2, satuan: 'pcs', harga: 88000, totalNominal: 176000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Pita Magnesium (25 gram) 3.5 meter', link: '-', qty: 2, satuan: 'roll', harga: 380000, totalNominal: 760000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Gelas sloki', link: '-', qty: 30, satuan: 'pcs', harga: 5000, totalNominal: 150000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Stearin', link: '-', qty: 15, satuan: 'pak', harga: 10000, totalNominal: 150000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Minyak Sawit/Goreng 2000ml', link: '-', qty: 2, satuan: 'botol', harga: 69000, totalNominal: 138000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Vaseline jelly 50ml repairing gel', link: '-', qty: 3, satuan: 'botol', harga: 44000, totalNominal: 132000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Minyak Zaitun 1000ml', link: '-', qty: 3, satuan: 'botol', harga: 137000, totalNominal: 411000, tgl: '2026-06-26' },

  // MODAL
  { jenis: 'Modal', desc: 'Lenovo IdeaPad Slim intel core i3 Gen 13', link: '-', qty: 3, satuan: 'pcs', harga: 9585000, totalNominal: 28755000, tgl: '2026-06-26' },

  // BUKU
  { jenis: 'Buku', desc: 'Kimia 10 smart book', link: '-', qty: 25, satuan: 'eks', harga: 146000, totalNominal: 3650000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Kimia 11 smart book', link: '-', qty: 12, satuan: 'eks', harga: 143000, totalNominal: 1716000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Kimia 12 smart book', link: '-', qty: 10, satuan: 'eks', harga: 134000, totalNominal: 1340000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Fisika 10 smart book', link: '-', qty: 25, satuan: 'eks', harga: 146000, totalNominal: 3650000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Fisika 11 smart book', link: '-', qty: 6, satuan: 'eks', harga: 143000, totalNominal: 858000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Fisika 12 smart book', link: '-', qty: 8, satuan: 'eks', harga: 150000, totalNominal: 1200000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Matematika 10 smart book', link: '-', qty: 30, satuan: 'eks', harga: 146000, totalNominal: 4380000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Matematika 11 smart book', link: '-', qty: 30, satuan: 'eks', harga: 127000, totalNominal: 3810000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Matematika 12 smart book', link: '-', qty: 20, satuan: 'eks', harga: 112000, totalNominal: 2240000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Matematika TL 11', link: '-', qty: 9, satuan: 'eks', harga: 143000, totalNominal: 1287000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Matematika TL 12', link: '-', qty: 14, satuan: 'eks', harga: 132000, totalNominal: 1848000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Biologi 10 smart book', link: '-', qty: 28, satuan: 'eks', harga: 146000, totalNominal: 4088000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Biologi 11 smart book', link: '-', qty: 15, satuan: 'eks', harga: 159000, totalNominal: 2385000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Biologi 12 smart book', link: '-', qty: 10, satuan: 'eks', harga: 123000, totalNominal: 1230000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Ekonomi 10', link: '-', qty: 28, satuan: 'eks', harga: 146000, totalNominal: 4088000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Ekonomi 11', link: '-', qty: 9, satuan: 'eks', harga: 143000, totalNominal: 1287000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Ekonomi 12', link: '-', qty: 14, satuan: 'eks', harga: 143000, totalNominal: 2002000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'INFORMATIKA SMA KLS X HET', link: '-', qty: 50, satuan: 'eks', harga: 22500, totalNominal: 1125000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'INFORMATIKA SMA KLS XI HET', link: '-', qty: 60, satuan: 'eks', harga: 25800, totalNominal: 1548000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'INFORMATIKA SMA KLS XII HET', link: '-', qty: 50, satuan: 'eks', harga: 19000, totalNominal: 950000, tgl: '2026-06-24' }
];

const formattedBSItems = juniBSItems.map(item => {
  const unitPrice = item.harga;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'Juni',
    realisasi: {
      'Juni': {
        tgl: item.tgl,
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-JUN-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 3 (BS) for Juni
importedData[3] = [...(importedData[3] || []).filter(i => i.bulan !== 'Juni'), ...formattedBSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI BS (Unit 3) - Juni with ${formattedBSItems.length} exact screenshot items.`);
let totalNominalJun = formattedBSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRI BS Juni: Rp ${totalNominalJun.toLocaleString('id-ID')}`);
