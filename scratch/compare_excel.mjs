import { INITIAL_TRANSAKSI_LIST, INITIAL_SI_BATCHES, PAGU_DATA } from '../src/data/initialData.js';

const userExcel = {
  PUTRA: {
    jan: 41436549, feb: 20990042, mar: 21768697, apr: 27653998, mei: 23100031, jun: 101806442,
    tahap1: 236755759,
    jul: 21872735, agt: 23268188, sep: 123734570, okt: 39808788,
    tahap2: 208684281,
    total: 445440040
  },
  MAHAD: {
    jan: 3840000, feb: 5140000, mar: 5024061, apr: 8204000, mei: 0, jun: 6090000,
    tahap1: 28298061,
    jul: 0, agt: 0, sep: 7500000, okt: 6100000,
    tahap2: 13600000,
    total: 41898061
  },
  BS: {
    jan: 0, feb: 25105000, mar: 0, apr: 44789000, mei: 35080000, jun: 83821156,
    tahap1: 188795156,
    jul: 0, agt: 21699000, sep: 65225000, okt: 6854100,
    tahap2: 93778100,
    total: 282573256
  },
  FDS: {
    jan: 4560000, feb: 3220500, mar: 4750500, apr: 121255000, mei: 5240000, jun: 16550000,
    tahap1: 155576000,
    jul: 5240000, agt: 43996000, sep: 25641207, okt: 25045824,
    tahap2: 99923031,
    total: 255499031
  },
  RABBANI: {
    jan: 26246000, feb: 0, mar: 4040000, apr: 20643000, mei: 0, jun: 0,
    tahap1: 50929000,
    jul: 0, agt: 0, sep: 0, okt: 78725000,
    tahap2: 78725000,
    total: 129654000
  }
};

const appUnitSummary = {};
for (const k of ['PUTRA', 'MAHAD', 'BS', 'FDS', 'RABBANI']) {
  appUnitSummary[k] = { total: 0, items: 0, byMonth: {} };
}

INITIAL_TRANSAKSI_LIST.forEach(t => {
  const u = t.unitId;
  if (appUnitSummary[u]) {
    appUnitSummary[u].total += (t.nominal || 0);
    appUnitSummary[u].items += 1;
    const m = (t.tanggal || '').substring(0, 7);
    appUnitSummary[u].byMonth[m] = (appUnitSummary[u].byMonth[m] || 0) + (t.nominal || 0);
  } else {
    console.log('Unknown unitId:', u, t);
  }
});

console.log('=== PERBANDINGAN REALISASI PER UNIT ===');
let grandExcel = 0;
let grandApp = 0;

for (const [k, u] of Object.entries(userExcel)) {
  const appTot = appUnitSummary[k]?.total || 0;
  const diff = appTot - u.total;
  grandExcel += u.total;
  grandApp += appTot;
  console.log(`${k.padEnd(8)}: Excel = ${u.total.toLocaleString('id-ID').padStart(14)} | App = ${appTot.toLocaleString('id-ID').padStart(14)} | Selisih = ${diff.toLocaleString('id-ID').padStart(12)}`);
}

console.log('---------------------------------------------------------------------------------');
console.log(`TOTAL   : Excel = ${grandExcel.toLocaleString('id-ID').padStart(14)} | App = ${grandApp.toLocaleString('id-ID').padStart(14)} | Selisih = ${(grandApp - grandExcel).toLocaleString('id-ID').padStart(12)}`);

console.log('\n=== DETAIL BREAKDOWN PER BULAN DI APLIKASI ===');
for (const [k, val] of Object.entries(appUnitSummary)) {
  console.log(`Unit: ${k} (Total: ${val.total.toLocaleString('id-ID')})`);
  for (const [m, amt] of Object.entries(val.byMonth).sort()) {
    console.log(`  ${m}: ${amt.toLocaleString('id-ID')}`);
  }
}
