import fs from 'fs';

const raw = fs.readFileSync('imported_data.json', 'utf8');
const data = JSON.parse(raw);

const nonGoodsPatterns = [
  /tagihan\s+listrik/i,
  /listrik\s+token/i,
  /pembayaran\s+listrik/i,
  /token\s+listrik/i,
  /internet/i,
  /indihome/i,
  /wifi/i,
  /langganan/i,
  /pulsadata/i,
  /honor/i,
  /gaji/i,
  /narasumber/i,
  /jasa\s+servis/i,
  /sewa/i
];

let totalRealizedAll = 0;
let totalRealizedInventaris = 0;
let sumNominalInventaris = 0;

const inventarisItems = [];

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(month => {
        const r = item.realisasi[month];
        if (r && !r.batal) {
          totalRealizedAll++;

          const jLower = (item.jenis || '').toLowerCase();
          if (jLower === 'gaji' || jLower === 'honor') return;

          let cat = '';
          if (jLower === 'modal' || jLower === 'aset' || jLower === 'belanja modal') cat = 'Belanja Modal / Aset';
          else if (jLower === 'buku' || jLower === 'belanja buku') cat = 'Belanja Buku';
          else if (jLower === 'operasional' || jLower === 'belanja operasional') {
            const isNonGood = nonGoodsPatterns.some(pat => pat.test(item.desc || ''));
            if (!isNonGood) cat = 'Belanja Operasional (Barang)';
          }

          if (cat) {
            totalRealizedInventaris++;
            const qty = r.qty !== undefined ? r.qty : item.qty;
            const harga = r.harga !== undefined ? r.harga : item.harga;
            const total = qty * harga;
            sumNominalInventaris += total;
            inventarisItems.push({
              unitId,
              month,
              tgl: r.tgl || `- (${month})`,
              desc: item.desc,
              cat,
              qty,
              satuan: item.satuan,
              harga,
              total,
              invoice: r.invoice || '-'
            });
          }
        }
      });
    }
  });
});

console.log("Total Realized Items Across All Categories:", totalRealizedAll);
console.log("Total Realized Items in Inventarisir:", totalRealizedInventaris);
console.log("Total Nilai Inventarisir (Rp):", sumNominalInventaris.toLocaleString('id-ID'));
console.log("\nSample Inventaris Items:");
inventarisItems.slice(0, 15).forEach(i => console.log(i));
