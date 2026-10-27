import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// Inspect October SI 2
const oktDir = './downloaded_si/10 Oktober';
fs.readdirSync(oktDir).forEach(f => {
  const fPath = path.join(oktDir, f);
  if (fs.statSync(fPath).isDirectory()) {
    console.log(`\nFolder: ${f}`);
    fs.readdirSync(fPath).forEach(file => {
      console.log(`  File: ${file}`);
      if (file.endsWith('.xlsx')) {
        const buf = fs.readFileSync(path.join(fPath, file));
        const wb = XLSX.read(buf, { type: 'buffer' });
        console.log(`    Sheets:`, wb.SheetNames);
        wb.SheetNames.forEach(s => {
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
          console.log(`    Sheet ${s} has ${rows.length} rows`);
          rows.slice(0, 15).forEach((r, idx) => {
            if (r.length > 0) console.log(`      r${idx}:`, r.slice(0, 8));
          });
        });
      }
    });
  } else if (f.endsWith('.xlsx')) {
    console.log(`\nDirect Excel: ${f}`);
    const buf = fs.readFileSync(fPath);
    const wb = XLSX.read(buf, { type: 'buffer' });
    console.log(`  Sheets:`, wb.SheetNames);
    wb.SheetNames.forEach(s => {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
      console.log(`  Sheet ${s} has ${rows.length} rows`);
      rows.slice(0, 15).forEach((r, idx) => {
        if (r.length > 0) console.log(`    r${idx}:`, r.slice(0, 8));
      });
    });
  }
});
