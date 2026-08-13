import fs from 'fs';

const raw = fs.readFileSync('imported_data.json', 'utf8');
const data = JSON.parse(raw);

const opItems = new Set();
Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    if (item.jenis && item.jenis.toLowerCase() === 'operasional') {
      opItems.add(item.desc);
    }
  });
});

console.log("Total Operasional items count:", opItems.size);
console.log("Sample Operasional items:");
Array.from(opItems).slice(0, 50).forEach(d => console.log("- ", d));
