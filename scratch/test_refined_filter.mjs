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

const opExcluded = [];
const opKept = [];

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const jenis = (item.jenis || '').toLowerCase();
    const desc = (item.desc || '').toLowerCase();

    if (jenis === 'operasional') {
      const isNonGood = nonGoodsPatterns.some(pat => pat.test(desc));
      if (isNonGood) {
        opExcluded.push(item.desc);
      } else {
        opKept.push(item.desc);
      }
    }
  });
});

console.log("Operasional Excluded Count:", opExcluded.length);
console.log("Excluded list:", Array.from(new Set(opExcluded)));
console.log("\nOperasional Kept Count:", opKept.length);
console.log("Sample Kept contains listrik?:", opKept.filter(d => d.toLowerCase().includes('listrik')));
