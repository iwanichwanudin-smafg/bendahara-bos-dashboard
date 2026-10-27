import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// Search for 558532 or 8767038 in all excel files
function searchNumbers(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchNumbers(fullPath);
    } else if (entry.name.endsWith('.xlsx')) {
      try {
        const buf = fs.readFileSync(fullPath);
        const wb = XLSX.read(buf, { type: 'buffer' });
        wb.SheetNames.forEach(s => {
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
          rows.forEach((r, idx) => {
            r.forEach(c => {
              if (typeof c === 'number') {
                if (Math.abs(c - 558532) < 5 || Math.abs(c - 8767038) < 5 || Math.abs(c - 320734) < 5 || Math.abs(c - 16258532) < 5) {
                  console.log(`Found in ${fullPath} [${s}] r${idx}:`, c, r);
                }
              }
            });
          });
        });
      } catch (e) {}
    }
  }
}

searchNumbers('./downloaded_si');
