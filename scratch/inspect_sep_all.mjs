import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const sepDir = './downloaded_si/09 September';
const entries = fs.readdirSync(sepDir);

entries.forEach(entry => {
  const fullPath = path.join(sepDir, entry);
  console.log(`\nEntry: ${entry}`);
  if (fs.statSync(fullPath).isDirectory()) {
    fs.readdirSync(fullPath).forEach(file => {
      console.log(`  File: ${file}`);
      if (file.endsWith('.xlsx')) {
        const buf = fs.readFileSync(path.join(fullPath, file));
        const wb = XLSX.read(buf, { type: 'buffer' });
        wb.SheetNames.forEach(s => {
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
          console.log(`    [Sheet ${s}] Total Rows: ${rows.length}`);
          rows.forEach((r, idx) => {
            const str = r.map(c => String(c)).join(' ');
            if (str.toUpperCase().includes('TOTAL') || str.toUpperCase().includes('JUMLAH') || str.includes('AJRI') || str.includes('BIZNET') || str.includes('LISTRIK')) {
              console.log(`      r${idx}:`, r);
            }
          });
        });
      }
    });
  } else if (entry.endsWith('.xlsx')) {
    const buf = fs.readFileSync(fullPath);
    const wb = XLSX.read(buf, { type: 'buffer' });
    wb.SheetNames.forEach(s => {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
      console.log(`  [Recap Sheet ${s}] Total Rows: ${rows.length}`);
      rows.forEach((r, idx) => {
        const str = r.map(c => String(c)).join(' ');
        if (str.toUpperCase().includes('TOTAL') || str.toUpperCase().includes('JUMLAH')) {
          console.log(`    r${idx}:`, r);
        }
      });
    });
  }
});
