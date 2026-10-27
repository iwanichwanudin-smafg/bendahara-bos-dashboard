import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const baseDir = './downloaded_si';
const months = fs.readdirSync(baseDir);

for (const m of months) {
  const mPath = path.join(baseDir, m);
  if (!fs.statSync(mPath).isDirectory()) continue;
  
  const files = fs.readdirSync(mPath);
  const recapFile = files.find(f => f.toLowerCase().includes('belanja bos') || f.toLowerCase().includes('rekap') || f.endsWith('.xlsx'));
  
  console.log(`\n=== FOLDER: ${m} ===`);
  files.forEach(f => {
    if (f.endsWith('.xlsx')) console.log('  Found Excel:', f);
  });
}
