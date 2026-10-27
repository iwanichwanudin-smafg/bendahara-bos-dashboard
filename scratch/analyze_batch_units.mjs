import { INITIAL_TRANSAKSI_LIST, INITIAL_SI_BATCHES } from '../src/data/initialData.js';

console.log('=== ANALISIS TRANSAKSI PER BULAN & BATCH ===');
const batchMap = {};
INITIAL_SI_BATCHES.forEach(b => {
  batchMap[b.id] = {
    nomorSI: b.nomorSI,
    tanggal: b.tanggal,
    folder: b.siFolder || b.monthFolder,
    total: b.totalNominal,
    units: {}
  };
});

INITIAL_TRANSAKSI_LIST.forEach(t => {
  const b = batchMap[t.batchId];
  if (b) {
    b.units[t.unitId] = (b.units[t.unitId] || 0) + t.nominal;
  }
});

for (const [id, b] of Object.entries(batchMap)) {
  console.log(`${id} (${b.tanggal}) [${b.nomorSI}] Total: ${b.total.toLocaleString('id-ID')}`);
  for (const [u, amt] of Object.entries(b.units)) {
    console.log(`   - ${u.padEnd(8)}: ${amt.toLocaleString('id-ID')}`);
  }
}
