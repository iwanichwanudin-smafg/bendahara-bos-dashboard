import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

const sem2Months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

console.log('=== AUDITING TAHAP 2 MONTHLY TOTALS PER UNIT ===\n');

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  
  // Calculate total planned for each Sem 2 month from RAB items
  let rabMonthlyTotals = { 'Juli': 0, 'Agustus': 0, 'September': 0, 'Oktober': 0, 'November': 0, 'Desember': 0 };
  
  items.forEach(item => {
    const hargaSiplah = item.harga * 1.11 * 1.12;
    if (item.bulan === 'Rutin Bulanan') {
      const monthlyTotal = hargaSiplah * (item.qty / 12);
      sem2Months.forEach(m => rabMonthlyTotals[m] += monthlyTotal);
    } else if (sem2Months.includes(item.bulan)) {
      rabMonthlyTotals[item.bulan] += hargaSiplah * item.qty;
    }
  });

  console.log(`Unit ${unitId}:`);
  sem2Months.forEach(m => {
    console.log(`  - ${m}: Rp ${Math.round(rabMonthlyTotals[m]).toLocaleString('id-ID')}`);
  });
});
