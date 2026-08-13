import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
const sem2Months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const monthNames = [...realizedMonths, ...sem2Months];

console.log('=== TEST EXACT SYNC FOR ALL 12 MONTHS & ALL 5 UNITS ===\n');

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  let monthSums = {};
  monthNames.forEach(m => monthSums[m] = 0);

  items.forEach(row => {
    const hargaSiplah = (row.harga || 0) * 1.11 * 1.12;

    // 1. Realisasi (verified BKU) for realized months Jan-Jun
    if (row.realisasi) {
      Object.keys(row.realisasi).forEach(mKey => {
        if (realizedMonths.includes(mKey)) {
          const r = row.realisasi[mKey];
          if (r && !r.batal) {
            const q = r.qty !== undefined ? r.qty : (row.qty || 0);
            const h = r.harga !== undefined ? r.harga : hargaSiplah;
            monthSums[mKey] += (q * h);
          }
        }
      });
    }

    // 2. Rencana Anggaran (RAB planned) for Tahap 2 months Jul-Des
    if (row.bulan === 'Rutin Bulanan') {
      const monthlyQty = (row.qty || 0) / 12;
      const monthlyTotal = hargaSiplah * monthlyQty;
      sem2Months.forEach(mKey => {
        monthSums[mKey] += monthlyTotal;
      });
    } else if (sem2Months.includes(row.bulan)) {
      monthSums[row.bulan] += hargaSiplah * (row.qty || 0);
    }
  });

  console.log(`Unit ${unitId}:`);
  monthNames.forEach(m => {
    const isReal = realizedMonths.includes(m);
    const tag = isReal ? '✓ Realisasi BKU' : '📋 Rencana Anggaran';
    console.log(`  - ${m} [${tag}]: Rp ${Math.round(monthSums[m]).toLocaleString('id-ID')}`);
  });
  console.log('');
});
