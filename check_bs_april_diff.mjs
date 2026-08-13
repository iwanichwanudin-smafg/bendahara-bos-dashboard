const items = [
  { desc: 'Kertas A4', qty: 55, harga: 70000, excelTotal: 3850000 },
  { desc: 'Kertas F4', qty: 30, harga: 80000, excelTotal: 2400000 },
  { desc: 'Spidol Permanent Warna Hitam', qty: 10, harga: 108000, excelTotal: 1080000 },
  { desc: 'Spidol Marker Warna Silver', qty: 5, harga: 239000, excelTotal: 1195000 },
  { desc: 'Spidol Marker Warna White', qty: 5, harga: 239000, excelTotal: 1195000 },
  { desc: 'Map Bussines File Uk F4 Biru, Kuning, Oren, Hijau', qty: 50, harga: 32000, excelTotal: 1600000 },
  { desc: 'Box File merk Bambi Biru dan hitam uk. A4 Jumbo (1033)', qty: 84, harga: 59000, excelTotal: 4956000 },
  { desc: 'Ordner Besar merk Bambi uk. A4 50mm (1015)', qty: 60, harga: 56000, excelTotal: 3360000 },
  { desc: 'Isi staples no.10-1M Max', qty: 10, harga: 88000, excelTotal: 880000 },
  { desc: 'Sticky Note 3M Post-it (5 pad warna wami 76mm x 76mm)', qty: 20, harga: 87000, excelTotal: 1740000 },
  { desc: 'Map L Bening Uk F4 Joyko', qty: 33, harga: 45000, excelTotal: 1485000 },
  { desc: 'Map Bening Kancing/Resleting size folio', qty: 150, harga: 20000, excelTotal: 3000000 },
  { desc: 'Lem Fox 150 gr', qty: 40, harga: 17000, excelTotal: 680000 },
  { desc: 'Correction Type kertas Joyko', qty: 24, harga: 9000, excelTotal: 216000 },
  { desc: 'HVS A4 warna (biru/pink)', qty: 2, harga: 94000, excelTotal: 188000 },
  { desc: 'HVS F4 warna (biru/pink)', qty: 2, harga: 109000, excelTotal: 218000 },
  { desc: 'Index & Mark Joyko Im 61', qty: 50, harga: 12000, excelTotal: 600000 },
  { desc: 'Index & Mark Joyko Im 62', qty: 50, harga: 12000, excelTotal: 600000 },
  { desc: 'Kertas Concorde Putih 220gr', qty: 40, harga: 22000, excelTotal: 880000 },
  { desc: 'Soklin lantai 770 ml', qty: 45, harga: 19000, excelTotal: 855000 },
  { desc: 'Mama lemon 680ml', qty: 200, harga: 13000, excelTotal: 2600000 },
  { desc: 'Cling Pembersih Kaca 400ml', qty: 18, harga: 11000, excelTotal: 198000 },
  { desc: 'Pengharum Ruangan Gantung', qty: 12, harga: 19000, excelTotal: 228000 },
  { desc: 'Glade matic device spray', qty: 4, harga: 97000, excelTotal: 388000 },
  { desc: 'Refill pewangi spray Glade', qty: 45, harga: 43000, excelTotal: 1935000 },
  { desc: 'Trashbag Hitam 60x80', qty: 45, harga: 32000, excelTotal: 1440000 },
  { desc: 'Trashbag Bening', qty: 15, harga: 32000, excelTotal: 480000 },
  { desc: 'Tisu Wajah Nice', qty: 100, harga: 22000, excelTotal: 2200000 },
  { desc: 'Tisu Toilet Nice', qty: 75, harga: 10000, excelTotal: 750000 },
  { desc: 'Sapu ijuk', qty: 30, harga: 44000, excelTotal: 1320000 },
  { desc: 'Alat pel', qty: 30, harga: 44000, excelTotal: 1320000 },
  { desc: 'Wiper/Karet Pembersih Kaca Jendela', qty: 15, harga: 56000, excelTotal: 840000 },
  { desc: 'Tiner Pembersih Meja/Kursi', qty: 2, harga: 66000, excelTotal: 132000 }
];

let sumExcel = 0;
let sumCalc = 0;
items.forEach(i => {
  const calc = i.qty * i.harga;
  sumExcel += i.excelTotal;
  sumCalc += calc;
  if (calc !== i.excelTotal) {
    console.log(`DIFF on ${i.desc}: calc ${calc} vs excel ${i.excelTotal}`);
  }
});

console.log(`Sum Excel Total Column: ${sumExcel}`);
console.log(`Sum Qty * Harga Calc  : ${sumCalc}`);
