import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// Let's inspect Sheet 'Gabungan SEPTEMBER' in Belanja BOS (Siplah) Sept 2026.xlsx
const recapFile = './downloaded_si/09 September/Belanja BOS (Siplah) Sept 2026.xlsx';
const buf = fs.readFileSync(recapFile);
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets['Gabungan SEPTEMBER'];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('=== ALL ROWS IN GABUNGAN SEPTEMBER ===');
let totalPutraSiplah = 0;
let totalBsSiplah = 0;
let totalFdsSiplah = 0;
let totalMahadSiplah = 0;

rows.forEach((r, idx) => {
  if (r.length < 3) return;
  const no = r[0];
  const uraian = r[2];
  const jml = r[7];
  const unit = r[8];
  if (typeof jml === 'number') {
    const uStr = String(unit || '').toUpperCase();
    if (uStr.includes('PUTRA')) totalPutraSiplah += jml;
    else if (uStr.includes('BS')) totalBsSiplah += jml;
    else if (uStr.includes('FDS')) totalFdsSiplah += jml;
    else if (uStr.includes('MAHAD')) totalMahadSiplah += jml;
    console.log(`r${idx} [${no}] ${uraian} -> Rp ${jml.toLocaleString('id-ID')} | Unit: ${unit}`);
  }
});

console.log('\nTotal Siplah Gabungan:');
console.log('Putra:', totalPutraSiplah);
console.log('BS   :', totalBsSiplah);
console.log('FDS  :', totalFdsSiplah);
console.log('Mahad:', totalMahadSiplah);
