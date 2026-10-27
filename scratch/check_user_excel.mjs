// Tabel dari gambar screenshot Excel user
const excelUser = [
  {
    unit: 'PUTRA',
    jan: 41436549,
    feb: 20990042,
    mar: 21768697,
    apr: 27653998,
    mei: 23100031,
    jun: 101806442,
    tahap1: 236755759,
    jul: 21872735,
    agt: 23268188,
    sep: 123734570,
    okt: 39808788
  },
  {
    unit: 'MAHAD',
    jan: 3840000,
    feb: 5140000,
    mar: 5024061,
    apr: 8204000,
    mei: 0,
    jun: 6090000,
    tahap1: 28298061,
    jul: 0,
    agt: 0,
    sep: 7500000,
    okt: 6100000
  },
  {
    unit: 'PUTRI-BS',
    unitId: 'BS',
    jan: 0,
    feb: 25105000,
    mar: 0,
    apr: 44789000,
    mei: 35080000,
    jun: 83821156,
    tahap1: 188795156,
    jul: 0,
    agt: 21699000,
    sep: 65225000,
    okt: 6854100
  },
  {
    unit: 'PUTRI-FDS',
    unitId: 'FDS',
    jan: 4560000,
    feb: 3220500,
    mar: 4750500,
    apr: 121255000,
    mei: 5240000,
    jun: 16550000,
    tahap1: 155576000,
    jul: 5240000,
    agt: 43996000,
    sep: 25641207,
    okt: 25045824
  },
  {
    unit: 'RABBANI',
    unitId: 'RABBANI',
    jan: 26246000,
    feb: 0,
    mar: 4040000,
    apr: 20643000,
    mei: 0,
    jun: 0,
    tahap1: 50929000,
    jul: 0,
    agt: 0,
    sep: 0,
    okt: 78725000
  }
];

// Check calculations of user's table
console.log('=== VALIDASI JUMLAH DI TABEL USER ===');
const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt'];
const monthTotals = {};
months.forEach(m => monthTotals[m] = 0);

excelUser.forEach(u => {
  const t1Calc = u.jan + u.feb + u.mar + u.apr + u.mei + u.jun;
  const t2Calc = u.jul + u.agt + u.sep + u.okt;
  const totCalc = t1Calc + t2Calc;
  u.tahap2 = t2Calc;
  u.total = totCalc;
  months.forEach(m => monthTotals[m] += u[m]);
  console.log(`${u.unit.padEnd(10)}: Tahap1=${u.tahap1.toLocaleString('id-ID')} (calc:${t1Calc.toLocaleString('id-ID')}) | Tahap2=${t2Calc.toLocaleString('id-ID')} | Total=${totCalc.toLocaleString('id-ID')}`);
});

console.log('\n=== TOTAL PER BULAN DI TABEL USER ===');
for (const m of months) {
  console.log(`Bulan ${m.toUpperCase()}: ${monthTotals[m].toLocaleString('id-ID')}`);
}

const grandTahap1 = excelUser.reduce((a, b) => a + b.tahap1, 0);
const grandTahap2 = excelUser.reduce((a, b) => a + b.tahap2, 0);
const grandTotal = excelUser.reduce((a, b) => a + b.total, 0);
console.log(`\nGRAND TOTAL: Tahap 1 = ${grandTahap1.toLocaleString('id-ID')}, Tahap 2 = ${grandTahap2.toLocaleString('id-ID')}, Total Realisasi = ${grandTotal.toLocaleString('id-ID')}`);
