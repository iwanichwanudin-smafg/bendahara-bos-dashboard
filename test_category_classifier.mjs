import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

function classifyItem(desc, cat) {
  const d = (desc || '').toLowerCase();
  const c = (cat || '').toLowerCase();

  // 1. Honor & Gaji
  if (
    d.includes('gaji') || d.includes('honor') || d.includes('insentif') || d.includes('transport') ||
    c.includes('honor') || c.includes('gaji') || c.includes('pegawai')
  ) {
    return 'Honor';
  }

  // 2. Buku
  if (
    d.includes('buku') || d.includes('novel') || d.includes('kitab') || d.includes('modul') || d.includes('bacaan') ||
    c.includes('buku')
  ) {
    // Note: Buku Kuitansi or Buku Gambar ATK can be operasional, but books in general or library books are Buku
    if (d.includes('buku kuitansi') || d.includes('buku nota')) {
      return 'Operasional';
    }
    return 'Buku';
  }

  // 3. Modal
  if (
    c.includes('modal') || d.includes('laptop') || d.includes('printer') || d.includes('ac ') || d.includes('gree') ||
    d.includes('sofa') || d.includes('ranjang') || d.includes('mikroskop') || d.includes('microscope') ||
    d.includes('tensi meter') || d.includes('penhancur') || d.includes('wastafel') || d.includes('meja') ||
    d.includes('kursi') || d.includes('rak ') || d.includes('ssd') || d.includes('white board') || d.includes('whiteboard') ||
    d.includes('neraca') || d.includes('torso') || d.includes('globe') || d.includes('jangka') || d.includes(' scoreboard') ||
    d.includes('mesin')
  ) {
    return 'Modal';
  }

  // 4. Default: Operasional
  return 'Operasional';
}

let categoryTotals = {
  'Operasional': 0,
  'Modal': 0,
  'Buku': 0,
  'Honor': 0
};

let itemCount = {
  'Operasional': 0,
  'Modal': 0,
  'Buku': 0,
  'Honor': 0
};

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const catType = classifyItem(item.desc, item.kategori);
    
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
    
    if (itemSum > 0) {
      categoryTotals[catType] += itemSum;
      itemCount[catType]++;
    }
  });
});

console.log('Category Totals (1 Year All Units):');
const grandTotal = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
Object.keys(categoryTotals).forEach(k => {
  const pct = ((categoryTotals[k] / grandTotal) * 100).toFixed(1);
  console.log(`- ${k}: Rp ${categoryTotals[k].toLocaleString('id-ID')} (${pct}%) [${itemCount[k]} items]`);
});
console.log(`GRAND TOTAL: Rp ${grandTotal.toLocaleString('id-ID')}`);
