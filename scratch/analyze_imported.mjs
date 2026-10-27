import fs from 'fs';

const data = JSON.parse(fs.readFileSync('imported_data.json', 'utf8'));

const months = {};
for (const u of Object.keys(data)) {
  const items = data[u];
  items.forEach(it => {
    if (it.realisasi) {
      for (const m of Object.keys(it.realisasi)) {
        const r = it.realisasi[m];
        if (!months[m]) months[m] = { count: 0, total: 0, dates: new Set() };
        months[m].count++;
        const harga = r.harga !== undefined ? r.harga : (it.harga || 0);
        const qty = r.qty !== undefined ? r.qty : it.qty;
        months[m].total += (harga * qty);
        if (r.tgl) months[m].dates.add(r.tgl);
      }
    }
  });
}

console.log('REALISASI SUMMARY PER BULAN DARI imported_data.json:');
let grandTotal = 0;
let grandCount = 0;
for (const [m, stat] of Object.entries(months)) {
  grandTotal += stat.total;
  grandCount += stat.count;
  console.log(`- ${m}: ${stat.count} item, Total Rp ${stat.total.toLocaleString('id-ID')}, Tgl: ${[...stat.dates].join(', ')}`);
}
console.log(`GRAND TOTAL: ${grandCount} items, Rp ${grandTotal.toLocaleString('id-ID')}`);
