import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const files = [
  './downloaded_si/01 Januari/Belanja BOS (Siplah) Januari 2026.xlsx',
  './downloaded_si/02 Februari/Belanja BOS (Siplah) Februari 2026.xlsx',
  './downloaded_si/03 Maret/Belanja BOS (Siplah) Maret 2026.xlsx',
  './downloaded_si/04 April/Belanja BOS (Siplah) April 2026.xlsx',
  './downloaded_si/05 Mei/Belanja BOS (Siplah) Mei - Juni 2026.xlsx',
  './downloaded_si/08 Agustus/Belanja BOS (Siplah) Agt 2026.xlsx',
  './downloaded_si/09 September/Belanja BOS (Siplah) Sept 2026.xlsx',
  './downloaded_si/10 Oktober/Belanja BOS (Siplah) Okt 2026.xlsx'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const buf = fs.readFileSync(f);
  const wb = XLSX.read(buf, { type: 'buffer' });
  console.log(`\n========================================`);
  console.log(`FILE: ${f}`);
  console.log(`Sheet Names:`, wb.SheetNames);

  // If there's a sheet named REKAP or REAL, or check the first sheet
  wb.SheetNames.forEach(sName => {
    const ws = wb.Sheets[sName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    // look for words like REAL, PUTRA, MAHAD
    for (let r = 0; r < Math.min(data.length, 30); r++) {
      const rowStr = (data[r] || []).map(c => String(c)).join(' | ');
      if (rowStr.toUpperCase().includes('REAL') || rowStr.toUpperCase().includes('PUTRA') || rowStr.toUpperCase().includes('TAHAP 1')) {
        console.log(`[Sheet ${sName}] Row ${r}: ${rowStr}`);
      }
    }
  });
}
