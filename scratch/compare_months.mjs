import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

// User excel monthly totals:
const userMonthly = {
  '02': 76082549 + 54455542, // Jan + Feb = 130.538.091
  '03': 35583258,
  '04': 222544998,
  '05': 63420031,
  '06': 208267598,
  '07': 27112735,
  '08': 88963188,
  '09': 222100777,
  '10': 156533712
};

const appMonthly = {};
INITIAL_SI_BATCHES.forEach(b => {
  const m = b.tanggal.substring(5, 7); // MM
  appMonthly[m] = (appMonthly[m] || 0) + b.totalNominal;
});

console.log('=== KOMPARASI PER BULAN ===');
let totUser = 0;
let totApp = 0;
for (const [m, uVal] of Object.entries(userMonthly)) {
  const aVal = appMonthly[m] || 0;
  totUser += uVal;
  totApp += aVal;
  console.log(`Bulan ${m}: User = ${uVal.toLocaleString('id-ID').padStart(14)} | SI App = ${aVal.toLocaleString('id-ID').padStart(14)} | Selisih = ${(aVal - uVal).toLocaleString('id-ID').padStart(12)}`);
}
console.log('TOTAL   : User = ' + totUser.toLocaleString('id-ID') + ' | SI App = ' + totApp.toLocaleString('id-ID') + ' | Selisih = ' + (totApp - totUser).toLocaleString('id-ID'));

console.log('\n=== DETAIL SI DI SETIAP BULAN DARI BATCHES ===');
for (const m of Object.keys(userMonthly)) {
  console.log(`\nBulan ${m}:`);
  INITIAL_SI_BATCHES.filter(b => b.tanggal.substring(5, 7) === m).forEach(b => {
    console.log(`  - ${b.id} (${b.nomorSI}): ${b.totalNominal.toLocaleString('id-ID')} [${b.siFolder || b.monthFolder}]`);
  });
}
