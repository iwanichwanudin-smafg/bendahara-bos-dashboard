import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG PUTRI BS (Unit 3) - April:
const aprilBSItems = [
  { jenis: 'Operasional', desc: 'Kertas A4', link: 'Paperone 75 gsm', qty: 55, satuan: 'rim', totalNominal: 3850000 },
  { jenis: 'Operasional', desc: 'Kertas F4', link: 'Paperone 75 gsm', qty: 30, satuan: 'rim', totalNominal: 2400000 },
  { jenis: 'Operasional', desc: 'Spidol Permanent Warna Hitam', link: 'https://tk.tokopedia.com/ZSagm7g5r/', qty: 10, satuan: 'box', totalNominal: 1060000 },
  { jenis: 'Operasional', desc: 'Spidol Marker Warna Silver', link: 'https://tk.tokopedia.com/ZSagXJdt8/', qty: 5, satuan: 'box', totalNominal: 1195000 },
  { jenis: 'Operasional', desc: 'Spidol Marker Warna White', link: 'https://tk.tokopedia.com/ZSagXJdt8/', qty: 5, satuan: 'box', totalNominal: 1195000 },
  { jenis: 'Operasional', desc: 'Map Bussines File Uk F4 Biru, Kuning, Oren, Hijau', link: '-', qty: 50, satuan: 'lusin', totalNominal: 1600000 },
  { jenis: 'Operasional', desc: 'Box File merk Bambi Biru dan hitam uk. Jumbo (1033)', link: 'Bambi', qty: 84, satuan: 'pcs', totalNominal: 4956000 },
  { jenis: 'Operasional', desc: 'Ordner Besar merk Bambi uk. A4 50mm (1015)', link: 'Bambi', qty: 80, satuan: 'pcs', totalNominal: 3360000 },
  { jenis: 'Operasional', desc: 'Isi staples no. 10-1M Max', link: 'https://tk.tokopedia.com/ZS5X7odFn/', qty: 10, satuan: 'pak', totalNominal: 880000 },
  { jenis: 'Operasional', desc: 'Sticky Note 3M Post-it (5 pad warna warni 76mm x 76mm)', link: 'https://tk.tokopedia.com/ZS5XwBXPm/', qty: 20, satuan: 'pak', totalNominal: 1740000 },
  { jenis: 'Operasional', desc: 'Map L Bening Uk F4 Joyko', link: 'https://tk.tokopedia.com/ZS5XE5Ue2/', qty: 33, satuan: 'pak', totalNominal: 1485000 },
  { jenis: 'Operasional', desc: 'Map Bening Kancing/Resleting size folio', link: 'https://tk.tokopedia.com/ZS54JSc4Q/', qty: 150, satuan: 'pcs', totalNominal: 3000000 },
  { jenis: 'Operasional', desc: 'Lem Fox 150 gr', link: 'https://tk.tokopedia.com/ZS54emaW9/', qty: 40, satuan: 'pcs', totalNominal: 680000 },
  { jenis: 'Operasional', desc: 'Corection Type kertas Joyko', link: 'https://tk.tokopedia.com/ZS54dWB9Y/', qty: 24, satuan: 'pcs', totalNominal: 216000 },
  { jenis: 'Operasional', desc: 'HVS A4 warna (biru/pink)', link: 'https://tk.tokopedia.com/ZSatH413w/', qty: 2, satuan: 'rim', totalNominal: 188000 },
  { jenis: 'Operasional', desc: 'HVS F4 warna (biru/pink)', link: 'https://tk.tokopedia.com/ZSat9juD3/', qty: 2, satuan: 'rim', totalNominal: 218000 },
  { jenis: 'Operasional', desc: 'Index & Mark Joyko Im 61', link: 'https://tk.tokopedia.com/ZS54RDcJe/', qty: 50, satuan: 'pcs', totalNominal: 600000 },
  { jenis: 'Operasional', desc: 'Index & Mark Joyko Im 62', link: 'https://tk.tokopedia.com/ZS54R9a3E/', qty: 50, satuan: 'pcs', totalNominal: 600000 },
  { jenis: 'Operasional', desc: 'Kertas Concorde Putih 220gr', link: 'https://tk.tokopedia.com/ZSagUG6Q2/', qty: 40, satuan: 'pak', totalNominal: 880000 },
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
  { jenis: 'Operasional', desc: 'Wiper/Karet Pembersih Kaca Jendela', link: 'https://tk.tokopedia.com/ZSaYk1wQq/', qty: 15, satuan: 'pcs', totalNominal: 840000 },
  { jenis: 'Operasional', desc: 'Tiner Pembersih Meja/Kursi', link: 'https://tk.tokopedia.com/ZSaVpEuBa/', qty: 2, satuan: 'liter/kaleng', totalNominal: 132000 }
];

const formattedBSItems = aprilBSItems.map(item => {
  const unitPrice = item.qty > 0 ? item.totalNominal / item.qty : item.totalNominal;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'April',
    realisasi: {
      'April': {
        tgl: '2026-05-26',
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-APR-BS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 3 (BS) for April
importedData[3] = [...(importedData[3] || []).filter(i => i.bulan !== 'April'), ...formattedBSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI BS (Unit 3) - April with ${formattedBSItems.length} exact screenshot items.`);
let totalNominalApr = formattedBSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRI BS April: Rp ${totalNominalApr.toLocaleString('id-ID')}`);
