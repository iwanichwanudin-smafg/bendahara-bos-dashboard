import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const units = [
  { id: 1, name: 'PUTRA' },
  { id: 2, name: 'MAHAD' },
  { id: 3, name: 'PUTRI BS' },
  { id: 4, name: 'PUTRI FDS' },
  { id: 5, name: 'RABBANI' }
];

console.log('====================================================');
console.log('   REKAPITULASI KONSOLIDASI BULAN FEBRUARI 2026     ');
console.log('====================================================\n');

let grandRabFeb = 0;
let grandRealFeb = 0;

units.forEach(u => {
  const items = (importedData[u.id] || []).filter(item => item.bulan === 'Februari');
  let rabSum = 0;
  let realSum = 0;

  items.forEach(item => {
    rabSum += (item.qty * item.harga);
    if (item.realisasi && item.realisasi.Februari) {
      const r = item.realisasi.Februari;
      realSum += (r.qty * r.harga);
    }
  });

  grandRabFeb += rabSum;
  grandRealFeb += realSum;

  console.log(`📌 Unit ${u.name} (Unit ${u.id}):`);
  console.log(`   - Jumlah Item : ${items.length} item`);
  console.log(`   - Total RAB   : Rp ${rabSum.toLocaleString('id-ID')}`);
  console.log(`   - Realisasi BKU: Rp ${realSum.toLocaleString('id-ID')}\n`);
});

console.log('====================================================');
console.log(`TOTAL KONSOLIDASI RAB FEBRUARI       : Rp ${grandRabFeb.toLocaleString('id-ID')}`);
console.log(`TOTAL KONSOLIDASI REALISASI FEBRUARI : Rp ${grandRealFeb.toLocaleString('id-ID')}`);
console.log('====================================================');
