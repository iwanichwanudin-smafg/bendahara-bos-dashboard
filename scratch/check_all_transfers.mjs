import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

console.log('=== CHECK ALL TRANSFERS IN ALL 30 BATCHES ===');
INITIAL_SI_BATCHES.forEach(b => {
  console.log(`\nBatch ${b.id} (${b.nomorSI}) - Folder: ${b.siFolder || b.monthFolder}`);
  b.transfers.forEach(t => {
    console.log(`  #${t.no}: ${t.netto.toLocaleString('id-ID')} | CurrentUnit: ${t.unitId} | Ket: "${t.ket}" | Note: "${t.note}" | Uraian: "${t.uraian ? t.uraian.substring(0, 50) : ''}"`);
  });
});
