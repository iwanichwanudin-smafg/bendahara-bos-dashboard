import fs from 'fs';
import * as XLSX from 'xlsx';

const f = './downloaded_si/09 September/Belanja BOS (Siplah) Sept 2026.xlsx';
const buf = fs.readFileSync(f);
const wb = XLSX.read(buf, { type: 'buffer' });

wb.SheetNames.forEach(sName => {
  console.log(`\n=================== SHEET: ${sName} ===================`);
  const data = XLSX.utils.sheet_to_json(wb.Sheets[sName], { header: 1 });
  data.slice(0, 30).forEach((row, i) => {
    if (row.length > 0) {
      console.log(`r${i}:`, row.slice(0, 9));
    }
  });
});
