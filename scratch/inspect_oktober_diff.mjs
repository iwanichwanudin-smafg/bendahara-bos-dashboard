import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

// Targets in Excel for Oktober:
const targetOkt = {
  PUTRA: 39808788,
  MAHAD: 6100000,
  BS: 6854100,
  FDS: 25045824,
  RABBANI: 78725000
};

console.log('=== TARGET EXCEL OKTOBER ===');
console.log(targetOkt);
console.log('Total Target Okt:', Object.values(targetOkt).reduce((a,b)=>a+b, 0));

// Let's inspect the 3 SI in Oktober
const oktBatches = INITIAL_SI_BATCHES.filter(b => b.tanggal.startsWith('2026-10'));
console.log('\n=== 3 SI DI BULAN OKTOBER ===');
oktBatches.forEach(b => {
  console.log(`\nBatch: ${b.id} (${b.nomorSI}) - Total: ${b.totalNominal.toLocaleString('id-ID')}`);
  b.transfers.forEach(t => {
    console.log(`  Transfer #${t.no}: Netto=${t.netto.toLocaleString('id-ID')} | Unit=${t.unitId} (${t.unitNama}) | Ket="${t.ket}" | Note="${t.note}" | Rek=${t.vaSiplah}`);
  });
});

// Check if any numbers like 558532 or differences exist in October
// Let's inspect October files in downloaded_si/10 Oktober
const oktDir = './downloaded_si/10 Oktober';
fs.readdirSync(oktDir).forEach(f => {
  const full = path.join(oktDir, f);
  if (fs.statSync(full).isDirectory()) {
    console.log(`\nFolder: ${f}`);
    fs.readdirSync(full).forEach(sub => {
      console.log(`  ${sub}`);
    });
  } else {
    console.log(`\nFile: ${f}`);
  }
});
