import XLSX from 'xlsx';
import fs from 'fs';

const wb = XLSX.readFile('downloaded_si/02 Februari/SI 2 (Belanja Siplah Anggaran Jan 2026)/SI BJB - BOSP (Februari 2).xlsx');
console.log('Sheet names:', wb.SheetNames);
for (const sheetName of wb.SheetNames) {
  console.log('--- SHEET:', sheetName, '---');
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
  rows.forEach((r, i) => {
    if (r.some(c => c !== '')) {
      console.log('R' + (i + 1) + ':', JSON.stringify(r));
    }
  });
}
