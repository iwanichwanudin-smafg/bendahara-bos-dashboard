import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

let unitBreakdown = {};
let categoryTotals = {
  'Operasional': 0,
  'Honor': 0,
  'Modal': 0,
  'Buku': 0
};

let detailJenisTotals = {};

Object.keys(data).forEach(unitId => {
  unitBreakdown[unitId] = { 'Operasional': 0, 'Honor': 0, 'Modal': 0, 'Buku': 0, total: 0 };
  const items = data[unitId] || [];
  items.forEach(item => {
    const jenis = item.jenis || 'Operasional';
    let catKey = 'Operasional';
    if (jenis.toLowerCase().includes('buku')) catKey = 'Buku';
    else if (jenis.toLowerCase().includes('gaji') || jenis.toLowerCase().includes('honor')) catKey = 'Honor';
    else if (jenis.toLowerCase().includes('modal')) catKey = 'Modal';

    if (!detailJenisTotals[jenis]) detailJenisTotals[jenis] = 0;

    let itemTotal = 0;
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        const r = item.realisasi[mKey];
        if (r && !r.batal) {
          const q = r.qty !== undefined ? r.qty : (item.qty || 0);
          const h = r.harga !== undefined ? r.harga : (item.harga || 0);
          const val = q * h;
          itemTotal += val;
        }
      });
    }

    categoryTotals[catKey] += itemTotal;
    unitBreakdown[unitId][catKey] += itemTotal;
    unitBreakdown[unitId].total += itemTotal;
    detailJenisTotals[jenis] += itemTotal;
  });
});

console.log('=== 1. DETAIL HIMPUNAN JENIS BELANJA DARI RAB ===');
Object.keys(detailJenisTotals).forEach(j => {
  console.log(`- Raw Jenis "${j}": Rp ${detailJenisTotals[j].toLocaleString('id-ID')}`);
});

console.log('\n=== 2. AUDIT TOTAL PER KATEGORI DASHBOARD ===');
const grandItemTotal = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
Object.keys(categoryTotals).forEach(c => {
  const amount = categoryTotals[c];
  const pct = ((amount / 1350310000) * 100).toFixed(2);
  console.log(`- ${c}: Rp ${amount.toLocaleString('id-ID')} (${pct}%)`);
});
console.log(`Total 12-Bulan RAB Items: Rp ${grandItemTotal.toLocaleString('id-ID')}`);
console.log(`Sisa Pagu Net Cadangan (Unallocated): Rp ${(1350310000 - grandItemTotal).toLocaleString('id-ID')}`);
console.log(`TOTAL PAGU NET BOS 5 UNIT          : Rp 1.350.310.000`);

console.log('\n=== 3. RINCIAN TOTAL PER UNIT (5 UNIT) ===');
Object.keys(unitBreakdown).forEach(u => {
  const ub = unitBreakdown[u];
  console.log(`Unit ${u}: Total Rp ${ub.total.toLocaleString('id-ID')} | Operasional: Rp ${ub['Operasional'].toLocaleString('id-ID')} | Honor: Rp ${ub['Honor'].toLocaleString('id-ID')} | Modal: Rp ${ub['Modal'].toLocaleString('id-ID')} | Buku: Rp ${ub['Buku'].toLocaleString('id-ID')}`);
});
