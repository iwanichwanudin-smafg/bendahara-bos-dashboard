import fs from 'fs';
import * as XLSX from 'xlsx';

const f = './downloaded_si/09 September/Belanja BOS (Siplah) Sept 2026.xlsx';
const buf = fs.readFileSync(f);
const wb = XLSX.read(buf, { type: 'buffer' });

console.log('Sheet names:', wb.SheetNames);

// Let's inspect each sheet for any summary table
wb.SheetNames.forEach(s => {
  const ws = wb.Sheets[s];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const str = (row || []).join(' ');
    if (str.includes('123') || str.includes('Putra') || str.includes('PUTRA') || str.includes('Honor') || str.includes('Listrik')) {
      if (row.length > 0) console.log(`[${s}] r${i}:`, row);
    }
  }
});
