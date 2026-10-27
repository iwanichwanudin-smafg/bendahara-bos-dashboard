import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// 1. Inspect SI 1 Tagihan Listrik & Internet Sep 2026
const si1Dir = './downloaded_si/09 September/SI 1 Tagihan Listrik & Internet Sep 2026';
fs.readdirSync(si1Dir).forEach(f => {
  console.log(`SI 1 file: ${f}`);
  if (f.endsWith('.xlsx')) {
    const buf = fs.readFileSync(path.join(si1Dir, f));
    const wb = XLSX.read(buf, { type: 'buffer' });
    wb.SheetNames.forEach(s => {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
      rows.forEach((r, idx) => {
        if (r.length > 0) console.log(`  r${idx}:`, r);
      });
    });
  }
});

// 2. Inspect Belanja BOS (Siplah) Sept 2026.xlsx
const recapFile = './downloaded_si/09 September/Belanja BOS (Siplah) Sept 2026.xlsx';
const buf = fs.readFileSync(recapFile);
const wb = XLSX.read(buf, { type: 'buffer' });
console.log('\nRecap Sheet Names:', wb.SheetNames);
wb.SheetNames.forEach(s => {
  const ws = wb.Sheets[s];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  // find rows with TOTAL or Putra
  rows.forEach((r, idx) => {
    const str = r.map(c => String(c)).join(' ');
    if (str.toUpperCase().includes('TOTAL') || str.toUpperCase().includes('JUMLAH')) {
      console.log(`[Sheet ${s}] Total row ${idx}:`, r);
    }
  });
});
