import fs from 'fs';

const raw = fs.readFileSync('imported_data.json', 'utf8');
const data = JSON.parse(raw);

const nonGoodsKeywords = ['listrik', 'internet', 'wifi', 'indihome', 'pulsa', 'kuota', 'telepon', 'telkom', 'jasa', 'honor', 'gaji', 'langganan'];

const filteredOut = [];
const kept = [];

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const jenis = (item.jenis || '').toLowerCase();
    const desc = (item.desc || '').toLowerCase();

    if (jenis === 'gaji') return; // Honor / Gaji excluded

    if (jenis === 'modal' || jenis === 'buku') {
      kept.push({ unitId, jenis: item.jenis, desc: item.desc });
    } else if (jenis === 'operasional') {
      const isNonGoods = nonGoodsKeywords.some(kw => desc.includes(kw));
      if (isNonGoods) {
        filteredOut.push({ unitId, jenis: item.jenis, desc: item.desc });
      } else {
        kept.push({ unitId, jenis: item.jenis, desc: item.desc });
      }
    }
  });
});

console.log("Filtered Out Count (Non-goods Operasional/Services/Utilities):", filteredOut.length);
console.log("Filtered Out Samples:");
filteredOut.forEach(f => console.log("  [EXCLUDED]", f.desc));

console.log("\nTotal Kept Items (Modal, Buku, Operasional Barang):", kept.length);
