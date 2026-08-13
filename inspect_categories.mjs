import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

let categoryTotals = {
  operasional: 0,
  modal: 0,
  buku: 0,
  honor: 0,
  other: 0
};

let categoryDetails = {
  operasional: [],
  modal: [],
  buku: [],
  honor: [],
  other: []
};

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const desc = (item.desc || '').toLowerCase();
    const cat = (item.kategori || item.category || '').toLowerCase();
    
    // Determine category
    let type = 'operasional'; // default
    if (desc.includes('gaji') || desc.includes('honor') || cat.includes('honor') || cat.includes('gaji')) {
      type = 'honor';
    } else if (desc.includes('buku') || cat.includes('buku')) {
      type = 'buku';
    } else if (cat.includes('modal') || desc.includes('laptop') || desc.includes('printer') || desc.includes('ac ') || desc.includes('sofa') || desc.includes('ranjang') || desc.includes('microscope') || desc.includes('tensi') || desc.includes('penhancur') || desc.includes('wastafel') || desc.includes('meja') || desc.includes('kursi')) {
      type = 'modal';
    }
    
    let itemSum = 0;
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        const r = item.realisasi[mKey];
        if (r && !r.batal) {
          const q = r.qty !== undefined ? r.qty : (item.qty || 0);
          const h = r.harga !== undefined ? r.harga : (item.harga || 0);
          itemSum += (q * h);
        }
      });
    }
    
    categoryTotals[type] += itemSum;
  });
});

console.log('Category Totals:', categoryTotals);
const grand = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
console.log('Grand Total:', grand);
Object.keys(categoryTotals).forEach(k => {
  console.log(`${k}: Rp ${categoryTotals[k].toLocaleString('id-ID')} (${((categoryTotals[k]/grand)*100).toFixed(1)}%)`);
});
