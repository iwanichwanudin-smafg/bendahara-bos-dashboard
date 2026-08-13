import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - Juni:
const juniPutraItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Tagihan Listrik Juni', link: '-', qty: 1, satuan: 'bulan', harga: 7111540, totalNominal: 7111540, tgl: '2026-06-03' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 12, satuan: 'rim', harga: 470000, totalNominal: 5640000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Kertas Concorde 160 gr', link: '-', qty: 30, satuan: 'pak', harga: 19000, totalNominal: 570000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'CAT Tembok 25Kg', link: '-', qty: 11, satuan: 'pail', harga: 2798000, totalNominal: 30778000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Cat Dasar', link: '-', qty: 4, satuan: 'pail', harga: 1570000, totalNominal: 6280000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Roll Cat', link: '-', qty: 8, satuan: 'pcs', harga: 86000, totalNominal: 688000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Bak Cat', link: '-', qty: 5, satuan: 'pcs', harga: 22000, totalNominal: 110000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Kuas 3 inch', link: '-', qty: 4, satuan: 'pcs', harga: 45000, totalNominal: 180000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Amplas 120', link: '-', qty: 2, satuan: 'roll', harga: 38000, totalNominal: 76000, tgl: '2026-06-26' },

  // MODAL
  { jenis: 'Modal', desc: 'Papan Tulis White Board', link: '-', qty: 5, satuan: 'unit', harga: 750000, totalNominal: 3750000, tgl: '2026-06-26' },
  { jenis: 'Modal', desc: 'Lenovo IdeaPad Slim intel core i3 Gen 13', link: '-', qty: 3, satuan: 'pcs', harga: 9585000, totalNominal: 28755000, tgl: '2026-06-26' },

  // GAJI
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5646479, totalNominal: 5646479, tgl: '2026-06-26' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6015186, totalNominal: 6015186, tgl: '2026-06-26' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 3789337, totalNominal: 3789337, tgl: '2026-06-26' },

  // BUKU
  { jenis: 'Buku', desc: 'Buku Scythe', link: '-', qty: 1, satuan: 'eks', harga: 87900, totalNominal: 87900, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku Thunderhead', link: '-', qty: 1, satuan: 'eks', harga: 94000, totalNominal: 94000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku Nak, Maafkan Bapak', link: '-', qty: 1, satuan: 'eks', harga: 106000, totalNominal: 106000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku I Want To Eat Your Pancreas', link: '-', qty: 1, satuan: 'eks', harga: 142000, totalNominal: 142000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku 48 Laws of Power', link: '-', qty: 1, satuan: 'eks', harga: 161000, totalNominal: 161000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku How to Win Friends and Influence People', link: '-', qty: 1, satuan: 'eks', harga: 220000, totalNominal: 220000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku Sisi Tergelap Surga', link: '-', qty: 1, satuan: 'eks', harga: 105000, totalNominal: 105000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku The Maxwell Daily Reader', link: '-', qty: 1, satuan: 'eks', harga: 108000, totalNominal: 108000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku The Happiness Advantage', link: '-', qty: 1, satuan: 'eks', harga: 377000, totalNominal: 377000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku Hyouka', link: '-', qty: 1, satuan: 'eks', harga: 74000, totalNominal: 74000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku HARGA SEBUAH PERCAYA', link: '-', qty: 1, satuan: 'eks', harga: 107000, totalNominal: 107000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku The Principle of Power', link: '-', qty: 1, satuan: 'eks', harga: 76000, totalNominal: 76000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku Seporsi Mie Ayam Sebelum Mati', link: '-', qty: 1, satuan: 'eks', harga: 109000, totalNominal: 109000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Buku Selesai Dengan Diri Sendiri', link: '-', qty: 1, satuan: 'eks', harga: 150000, totalNominal: 150000, tgl: '2026-06-24' },
  { jenis: 'Buku', desc: 'Bayna Yadayk Lil Muallim (Jilid 1)', link: '-', qty: 1, satuan: 'eks', harga: 500000, totalNominal: 500000, tgl: '2026-06-24' }
];

// 2. FG MAHAD (Unit 2) - Juni:
const juniMahadItems = [
  { jenis: 'Operasional', desc: 'Map Raport', link: '-', qty: 20, satuan: 'pcs', harga: 75000, totalNominal: 1500000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Kertas Raport', link: '-', qty: 5, satuan: 'rim', harga: 470000, totalNominal: 2350000, tgl: '2026-06-26' },
  { jenis: 'Operasional', desc: 'Kertas Concorde 160 gr', link: '-', qty: 10, satuan: 'pak', harga: 19000, totalNominal: 190000, tgl: '2026-06-26' },
  { jenis: 'Modal', desc: 'Lemari Kantor Besi Kaca Arsip 2 pintu', link: '-', qty: 1, satuan: 'pcs', harga: 2050000, totalNominal: 2050000, tgl: '2026-06-26' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
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
        qty: item.qty,
        harga: item.harga,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-JUN-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'Juni'), ...formatItems(juniPutraItems, 'PUTRA')];

// Update Unit 2 (MAHAD)
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'Juni'), ...formatItems(juniMahadItems, 'MAHAD')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('Juni items updated successfully for PUTRA and MAHAD.');
