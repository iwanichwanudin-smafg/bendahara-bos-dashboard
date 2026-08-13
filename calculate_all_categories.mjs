import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

function classifyItem(desc, cat) {
  const d = (desc || '').toLowerCase();
  const c = (cat || '').toLowerCase();

  // 1. Honor & Gaji
  if (
    d.includes('gaji') || d.includes('honor') || d.includes('insentif') || d.includes('transport') ||
    d.includes('riski') || d.includes('pangestu') || d.includes('mahmud') || d.includes('narasumber') ||
    c.includes('honor') || c.includes('gaji') || c.includes('pegawai') || c.includes('personel')
  ) {
    return 'Honor';
  }

  // 2. Buku
  if (
    d.includes('buku') || d.includes('novel') || d.includes('kitab') || d.includes('modul') || d.includes('bacaan') ||
    c.includes('buku')
  ) {
    if (d.includes('buku kuitansi') || d.includes('buku nota') || d.includes('kuitansi')) {
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
    d.includes('neraca') || d.includes('torso') || d.includes('globe') || d.includes('jangka') || d.includes('scoreboard') ||
    d.includes('mesin')
  ) {
    return 'Modal';
  }

  // 4. Default: Operasional
  return 'Operasional';
}

const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

let totals = {
  'Operasional': { real: 0, plan: 0, total: 0 },
  'Honor': { real: 0, plan: 0, total: 0 },
  'Modal': { real: 0, plan: 0, total: 0 },
  'Buku': { real: 0, plan: 0, total: 0 }
};

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const cat = classifyItem(item.desc, item.kategori);
    
    // Check realized vs plan
    let itemReal = 0;
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        if (realizedMonths.includes(mKey)) {
          const r = item.realisasi[mKey];
          if (r && !r.batal) {
            const q = r.qty !== undefined ? r.qty : (item.qty || 0);
            const h = r.harga !== undefined ? r.harga : (item.harga || 0);
            itemReal += (q * h);
          }
        }
      });
    }

    // Total item plan value (SIPLah price)
    const hargaSiplah = (item.harga || 0) * 1.11 * 1.12;
    const itemPlanTotal = hargaSiplah * (item.qty || 0);
    
    totals[cat].real += itemReal;
    totals[cat].total += itemPlanTotal;
  });
});

let grandTotalReal = 0;
let grandTotalPlan = 0;

console.log('Category breakdown (Real vs Belum Realisasi):');
Object.keys(totals).forEach(cat => {
  const real = totals[cat].real;
  const total = totals[cat].total;
  const unrealized = total - real;
  grandTotalReal += real;
  grandTotalPlan += total;
  console.log(`\n- ${cat}:`);
  console.log(`  Total Anggaran  : Rp ${total.toLocaleString('id-ID')}`);
  console.log(`  Sudah Realisasi : Rp ${real.toLocaleString('id-ID')} (${((real/total)*100).toFixed(1)}%)`);
  console.log(`  Belum Realisasi : Rp ${unrealized.toLocaleString('id-ID')} (${((unrealized/total)*100).toFixed(1)}%)`);
});

console.log('\n====================================');
console.log(`Grand Total Anggaran : Rp ${grandTotalPlan.toLocaleString('id-ID')}`);
console.log(`Grand Total Realisasi: Rp ${grandTotalReal.toLocaleString('id-ID')} (${((grandTotalReal/grandTotalPlan)*100).toFixed(1)}%)`);
console.log(`Grand Belum Realisasi: Rp ${(grandTotalPlan - grandTotalReal).toLocaleString('id-ID')} (${(((grandTotalPlan - grandTotalReal)/grandTotalPlan)*100).toFixed(1)}%)`);
