import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

INITIAL_SI_BATCHES.filter(b => ['02', '03'].includes(b.tanggal.substring(5, 7))).forEach(b => {
  console.log(`\nBatch ${b.id} (${b.nomorSI}) - Folder: ${b.siFolder || b.monthFolder}`);
  b.transfers.forEach(t => {
    console.log(`  #${t.no}: ${t.netto.toLocaleString('id-ID')} | CurrentUnit: ${t.unitId} | Ket: "${t.ket}" | Note: "${t.note}"`);
  });
});
