import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

let categoryStats = {
  'Operasional': { real: 0, unreal: 0, total: 0 },
  'Honor': { real: 0, unreal: 0, total: 0 },
  'Modal': { real: 0, unreal: 0, total: 0 },
  'Buku': { real: 0, unreal: 0, total: 0 }
};

function mapJenisToCategory(jenis) {
  const j = (jenis || '').toLowerCase();
  if (j.includes('buku')) return 'Buku';
  if (j.includes('gaji') || j.includes('honor')) return 'Honor';
  if (j.includes('modal')) return 'Modal';
  return 'Operasional';
}

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const cat = mapJenisToCategory(item.jenis);
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        const r = item.realisasi[mKey];
        if (r && !r.batal) {
          const q = r.qty !== undefined ? r.qty : (item.qty || 0);
          const h = r.harga !== undefined ? r.harga : (item.harga || 0);
          const val = q * h;
          if (val > 0) {
            if (realizedMonths.includes(mKey)) {
              categoryStats[cat].real += val;
            } else {
              categoryStats[cat].unreal += val;
            }
            categoryStats[cat].total += val;
          }
        }
      });
    }
  });
});

const totalPaguTarget = 1350310000;
let grandReal = Object.values(categoryStats).reduce((a, b) => a + b.real, 0);
let grandUnreal = Object.values(categoryStats).reduce((a, b) => a + b.unreal, 0);
let sisaCadangan = totalPaguTarget - (grandReal + grandUnreal);

if (sisaCadangan > 0) {
  categoryStats['Operasional'].unreal += sisaCadangan;
  categoryStats['Operasional'].total += sisaCadangan;
  grandUnreal += sisaCadangan;
}

const grandTotal = grandReal + grandUnreal;

console.log('=== OFFICIAL CATEGORY BREAKDOWN (MATCHING REALISASI PAGE) ===');
Object.keys(categoryStats).forEach(cat => {
  const c = categoryStats[cat];
  const pct = ((c.total / grandTotal) * 100).toFixed(1);
  console.log(`- ${cat}: Total Rp ${c.total.toLocaleString('id-ID')} (${pct}%) | Realisasi: Rp ${c.real.toLocaleString('id-ID')} | Belum Realisasi: Rp ${c.unreal.toLocaleString('id-ID')}`);
});

console.log('\n=============================================================');
console.log(`GRAND TOTAL REALISASI (Sem 1 BKU): Rp ${grandReal.toLocaleString('id-ID')}`);
console.log(`GRAND TOTAL BELUM REAL (Sem 2 Plan): Rp ${grandUnreal.toLocaleString('id-ID')}`);
console.log(`GRAND TOTAL PAGU NET BOS        : Rp ${grandTotal.toLocaleString('id-ID')}`);
