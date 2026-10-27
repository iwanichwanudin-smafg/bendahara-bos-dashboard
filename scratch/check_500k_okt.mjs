// Check any numbers in October that could relate to 558.532
import fs from 'fs';
import * as XLSX from 'xlsx';

const f = './downloaded_si/10 Oktober/Belanja BOS (Siplah) Okt 2026.xlsx';
const buf = fs.readFileSync(f);
const wb = XLSX.read(buf, { type: 'buffer' });

console.log('--- ALL NUMBERS IN OKTOBER RECAP ---');
wb.SheetNames.forEach(s => {
  const ws = wb.Sheets[s];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  rows.forEach((r, idx) => {
    r.forEach(c => {
      if (typeof c === 'number' && c > 500000 && c < 600000) {
        console.log(`[${s}] r${idx}:`, c, r);
      }
    });
  });
});
