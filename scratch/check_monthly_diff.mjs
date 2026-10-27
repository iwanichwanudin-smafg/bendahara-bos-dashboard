import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

// User Excel targets per month:
const userMonthly = {
  '01+02': 76082549 + 54455542, // Jan 76.082.549 + Feb 54.455.542 = 130.538.091
  '03': 35583258,
  '04': 222544998,
  '05': 63420031,
  '06': 208267598,
  '07': 27112735,
  '08': 88963188,
  '09': 222100777,
  '10': 156533712
};

// Now calculate SI batches by month:
const siMonthly = {
  '01+02': 0, '03': 0, '04': 0, '05': 0, '06': 0, '07': 0, '08': 0, '09': 0, '10': 0
};

INITIAL_SI_BATCHES.forEach(b => {
  const m = b.tanggal.substring(5, 7);
  const key = ['01', '02'].includes(m) ? '01+02' : m;
  siMonthly[key] += b.totalNominal;
});

console.log('=== CEK SELISIH PER BULAN (TOTAL BULANAN) ===');
for (const [m, uVal] of Object.entries(userMonthly)) {
  const sVal = siMonthly[m];
  console.log(`Bulan ${m}: Excel = ${uVal.toLocaleString('id-ID').padStart(14)} | SI BJB = ${sVal.toLocaleString('id-ID').padStart(14)} | Selisih = ${(sVal - uVal).toLocaleString('id-ID').padStart(12)}`);
}

// Check cumulative Tahap 1 and Tahap 2:
const t1Excel = 660353976;
const t2Excel = 494710412;

let t1SI = 0;
let t2SI = 0;
INITIAL_SI_BATCHES.forEach(b => {
  const m = parseInt(b.tanggal.substring(5, 7));
  if (m <= 6) t1SI += b.totalNominal;
  else t2SI += b.totalNominal;
});

console.log('\n=== TAHAP 1 & TAHAP 2 ===');
console.log(`Tahap 1: Excel = ${t1Excel.toLocaleString('id-ID')} | SI BJB = ${t1SI.toLocaleString('id-ID')} | Selisih = ${(t1SI - t1Excel).toLocaleString('id-ID')}`);
console.log(`Tahap 2: Excel = ${t2Excel.toLocaleString('id-ID')} | SI BJB = ${t2SI.toLocaleString('id-ID')} | Selisih = ${(t2SI - t2Excel).toLocaleString('id-ID')}`);
console.log(`GRAND TOTAL SELISIH = ${((t1SI + t2SI) - (t1Excel + t2Excel)).toLocaleString('id-ID')}`);
