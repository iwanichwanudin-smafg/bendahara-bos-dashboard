import { INITIAL_TRANSAKSI_LIST, INITIAL_SI_BATCHES, PAGU_DATA } from '../src/data/initialData.js';

// User's Excel table
const excelUser = {
  PUTRA: {
    nama: 'FG Putra',
    siswa: 299,
    paguBJB: 517810000,
    tahap1: 236755759,
    tahap2: 208684281,
    totalRealisasi: 445440040,
    sisa: 517810000 - 445440040, // 72.369.960
    pct: ((445440040 / 517810000) * 100).toFixed(2)
  },
  MAHAD: {
    nama: 'FG Mahad',
    siswa: 39,
    paguBJB: 64935000,
    tahap1: 28298061,
    tahap2: 13600000,
    totalRealisasi: 41898061,
    sisa: 64935000 - 41898061, // 23.036.939
    pct: ((41898061 / 64935000) * 100).toFixed(2)
  },
  BS: {
    nama: 'FG Putri (BS)',
    siswa: 175,
    paguBJB: 291375000,
    tahap1: 188795156,
    tahap2: 93778100,
    totalRealisasi: 282573256,
    sisa: 291375000 - 282573256, // 8.801.744
    pct: ((282573256 / 291375000) * 100).toFixed(2)
  },
  FDS: {
    nama: 'FG Putri (FDS)',
    siswa: 162,
    paguBJB: 269730000,
    tahap1: 155576000,
    tahap2: 99923031,
    totalRealisasi: 255499031,
    sisa: 269730000 - 255499031, // 14.230.969
    pct: ((255499031 / 269730000) * 100).toFixed(2)
  },
  RABBANI: {
    nama: 'FG Rabbani',
    siswa: 124,
    paguBJB: 206460000,
    tahap1: 50929000,
    tahap2: 78725000,
    totalRealisasi: 129654000,
    sisa: 206460000 - 129654000, // 76.806.000
    pct: ((129654000 / 206460000) * 100).toFixed(2)
  }
};

// Application current data
const appData = {};
for (const k of Object.keys(excelUser)) {
  appData[k] = 0;
}
INITIAL_TRANSAKSI_LIST.forEach(t => {
  if (appData[t.unitId] !== undefined) {
    appData[t.unitId] += (t.nominal || 0);
  }
});

console.log('=== KOMPARASI LENGKAP APLIKASI VS EXCEL USER ===');
let totExcel = 0;
let totApp = 0;

for (const [id, u] of Object.entries(excelUser)) {
  const aVal = appData[id] || 0;
  const selisih = aVal - u.totalRealisasi;
  totExcel += u.totalRealisasi;
  totApp += aVal;
  console.log(`Unit: ${u.nama} (${id})`);
  console.log(`  - Realisasi Excel User : Rp ${u.totalRealisasi.toLocaleString('id-ID')} (${u.pct}%)`);
  console.log(`  - Realisasi di Aplikasi: Rp ${aVal.toLocaleString('id-ID')} (${((aVal/u.paguBJB)*100).toFixed(2)}%)`);
  console.log(`  - Status               : ${selisih === 0 ? 'COCOK (SAMA)' : 'TIDAK SAMA (SELISIH: Rp ' + selisih.toLocaleString('id-ID') + ')'}`);
  console.log('');
}

console.log('=== TOTAL KESELURUHAN ===');
console.log(`Total Excel User : Rp ${totExcel.toLocaleString('id-ID')}`);
console.log(`Total di Aplikasi: Rp ${totApp.toLocaleString('id-ID')}`);
console.log(`Selisih Total    : Rp ${(totApp - totExcel).toLocaleString('id-ID')}`);
