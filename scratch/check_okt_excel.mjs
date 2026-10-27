import fs from 'fs';
import * as XLSX from 'xlsx';

const f = './downloaded_si/10 Oktober/Belanja BOS (Siplah) Okt 2026.xlsx';
const buf = fs.readFileSync(f);
const wb = XLSX.read(buf, { type: 'buffer' });

console.log('=== INSPECT BELANJA BOS OKT 2026.XLSX ===');
console.log('Sheets:', wb.SheetNames);

wb.SheetNames.forEach(s => {
  const ws = wb.Sheets[s];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  let sheetTotal = 0;
  let found558 = false;
  rows.forEach((r, idx) => {
    r.forEach(c => {
      if (typeof c === 'number') {
        if (Math.abs(c - 558532) < 5 || String(c).includes('558')) {
          console.log(`[${s}] Row ${idx} has 558:`, c, r);
          found558 = true;
        }
      }
    });
    const str = r.map(c => String(c)).join(' ');
    if (str.toUpperCase().includes('TOTAL') || str.toUpperCase().includes('JUMLAH')) {
      console.log(`[Sheet ${s}] Total row ${idx}:`, r.filter(c => c !== undefined && c !== null && c !== ''));
    }
  });
});
