import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items for FG PUTRI BS (Unit 3) - Februari (Bank Total Rp 25.105.000):
const februariBSItems = [
  { jenis: 'Operasional', desc: 'Binder Clip No. 260', link: 'Joyko', qty: 1, satuan: 'gross', totalNominal: 303000 },
  { jenis: 'Operasional', desc: 'Binder Clip No. 105', link: 'Joyko', qty: 1, satuan: 'gross', totalNominal: 50000 },
  { jenis: 'Operasional', desc: 'Binder Clip No. 107', link: 'Joyko', qty: 1, satuan: 'gross', totalNominal: 56000 },
  { jenis: 'Operasional', desc: 'Pulpen Pilot Balliner Hitam 0.8mm', link: 'https://tk.tokopedia.com/ZS5HrVoBg/', qty: 4, satuan: 'Lusin', totalNominal: 1048000 },
  { jenis: 'Operasional', desc: 'Pulpen Pilot Balliner Biru 0.8mm', link: 'https://tk.tokopedia.com/ZS5HrVoBg/', qty: 4, satuan: 'Lusin', totalNominal: 1048000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.7 mm hitam', link: 'https://tk.tokopedia.com/ZS5HMTbvJ/', qty: 1, satuan: 'Lusin', totalNominal: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.7 mm biru', link: 'https://tk.tokopedia.com/ZS5HMTbvJ/', qty: 1, satuan: 'Lusin', totalNominal: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm merah', link: 'https://tk.tokopedia.com/ZS5HMTbvJ/', qty: 1, satuan: 'Lusin', totalNominal: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm coklat', link: 'https://tk.tokopedia.com/ZS5HMTbvJ/', qty: 1, satuan: 'Lusin', totalNominal: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm hitam', link: 'https://tk.tokopedia.com/ZS5HMTbvJ/', qty: 1, satuan: 'Lusin', totalNominal: 309000 },
  { jenis: 'Operasional', desc: 'Pulpen gel Zebra Sarasa 0.5 mm biru', link: 'https://tk.tokopedia.com/ZS5HMTbvJ/', qty: 1, satuan: 'Lusin', totalNominal: 309000 },
  { jenis: 'Operasional', desc: 'Pensil Mekanik pentel 0.5', link: 'https://tk.tokopedia.com/ZSP5AJyjQ/', qty: 12, satuan: 'pcs', totalNominal: 240000 },
  { jenis: 'Operasional', desc: 'Double Tape 1/2 inch', link: '-', qty: 40, satuan: 'pcs', totalNominal: 200000 },
  { jenis: 'Operasional', desc: 'Double Tape 1 inch', link: '-', qty: 40, satuan: 'pcs', totalNominal: 320000 },
  { jenis: 'Operasional', desc: 'Lakban bening 1/2 inch', link: '-', qty: 40, satuan: 'pcs', totalNominal: 240000 },
  { jenis: 'Operasional', desc: 'Lakban bening 1 inch', link: '-', qty: 40, satuan: 'pcs', totalNominal: 400000 },
  { jenis: 'Operasional', desc: 'Lakban bening 2 inch', link: '-', qty: 60, satuan: 'pcs', totalNominal: 720000 },
  { jenis: 'Operasional', desc: 'Lakban Hitam 2 inch', link: '-', qty: 40, satuan: 'pcs', totalNominal: 880000 },
  { jenis: 'Operasional', desc: 'Soklin lantai 770 ml', link: 'FG inc', qty: 45, satuan: 'pcs', totalNominal: 855000 },
  { jenis: 'Operasional', desc: 'Mama lemon 680ml', link: 'FG inc', qty: 200, satuan: 'pcs', totalNominal: 2600000 },
  { jenis: 'Operasional', desc: 'Cling Pembersih Kaca 400ml', link: 'https://tk.tokopedia.com/ZSa4m4amw/', qty: 18, satuan: 'pcs', totalNominal: 198000 },
  { jenis: 'Operasional', desc: 'Pengharum Ruangan Gantung', link: 'https://tk.tokopedia.com/ZSa4uxSqj/', qty: 12, satuan: 'pcs', totalNominal: 228000 },
  { jenis: 'Operasional', desc: 'Glade matic device spray', link: 'https://tk.tokopedia.com/ZSa4Ck8PP/', qty: 4, satuan: 'pcs', totalNominal: 388000 },
  { jenis: 'Operasional', desc: 'Refill pewangi spray Glade', link: 'https://tk.tokopedia.com/ZSa4XpnMJ/', qty: 45, satuan: 'pcs', totalNominal: 1935000 },
  { jenis: 'Operasional', desc: 'Trashbag Hitam 60x80', link: 'https://tk.tokopedia.com/ZSa4XE4BC/', qty: 45, satuan: 'pak', totalNominal: 1440000 },
  { jenis: 'Operasional', desc: 'Trashbag Bening', link: 'https://tk.tokopedia.com/ZSa4b9W87/', qty: 15, satuan: 'pak', totalNominal: 480000 },
  { jenis: 'Operasional', desc: 'Tisu Wajah Nice', link: 'https://tk.tokopedia.com/ZSa4pdv3M/', qty: 100, satuan: 'pcs', totalNominal: 2200000 },
  { jenis: 'Operasional', desc: 'Tisu Toilet Nice', link: 'https://tk.tokopedia.com/ZSaV4XMNB/', qty: 75, satuan: 'pcs', totalNominal: 750000 },
  { jenis: 'Operasional', desc: 'Sapu ijuk', link: '-', qty: 30, satuan: 'pcs', totalNominal: 1320000 },
  { jenis: 'Operasional', desc: 'Alat pel', link: '-', qty: 30, satuan: 'pcs', totalNominal: 1320000 },
  { jenis: 'Operasional', desc: 'Wiper/Karet Pembersih Kaca Jendela', link: 'https://tk.tokopedia.com/ZSaYk1wQq/', qty: 15, satuan: 'Pcs', totalNominal: 840000 },
  { jenis: 'Operasional', desc: 'Tiner Pembersih Meja/Kursi', link: 'https://tk.tokopedia.com/ZSaVpEuBa/', qty: 2, satuan: 'liter/kaleng', totalNominal: 132000 },
  { jenis: 'Operasional', desc: 'Kantong Plastik Warna Merah No.28', link: '-', qty: 12, satuan: 'pak', totalNominal: 540000 },
  { jenis: 'Operasional', desc: 'Kantong Plastik Warna Merah No.50', link: '-', qty: 30, satuan: 'pak', totalNominal: 2520000 }
];

const formattedBSItems = februariBSItems.map(item => {
  const unitPrice = item.qty > 0 ? item.totalNominal / item.qty : item.totalNominal;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'Februari',
    realisasi: {
      'Februari': {
        tgl: '2026-03-12',
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-FEB-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Retain non-Februari items for Unit 3, replace Februari items with exact screenshot items
const currentUnit3Items = importedData[3] || [];
const otherMonthsItems = currentUnit3Items.filter(item => item.bulan !== 'Februari');

importedData[3] = [...otherMonthsItems, ...formattedBSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI BS (Unit 3) - Februari with ${formattedBSItems.length} exact screenshot items.`);
let totalNominalFeb = formattedBSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRI BS Februari: Rp ${totalNominalFeb.toLocaleString('id-ID')}`);
