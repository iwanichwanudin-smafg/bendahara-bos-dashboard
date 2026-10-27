import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const baseDir = './downloaded_si';

function searchExcelFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchExcelFiles(fullPath);
    } else if (entry.name.endsWith('.xlsx') || entry.name.endsWith('.xls')) {
      try {
        const buf = fs.readFileSync(fullPath);
        const wb = XLSX.read(buf, { type: 'buffer' });
        for (const sName of wb.SheetNames) {
          const ws = wb.Sheets[sName];
          const text = JSON.stringify(XLSX.utils.sheet_to_json(ws, { header: 1 }));
          if (text.includes('236755759') || text.includes('236.755.759') || text.includes('660353976') || text.includes('660.353.976') || text.includes('41436549')) {
            console.log(`FOUND MATCH in file: ${fullPath}, sheet: ${sName}`);
          }
        }
      } catch (e) {
        // ignore error
      }
    }
  }
}

searchExcelFiles(baseDir);
