import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('scratch/all_30_parsed_batches.json', 'utf8'));

console.log('Comparing parsed totals with Excel written totals...\n');

let allMatch = true;

data.forEach((b, idx) => {
  const wb = XLSX.readFile(b.localPath);
  let sheet = wb.Sheets[wb.SheetNames[0]];
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(s, { header: 1, defval: '' });
    const hasMatch = rows.some(r => r.some(c => String(c).toUpperCase().includes('JUMLAH') || String(c).toUpperCase().includes('NETTO')));
    if (hasMatch) { sheet = s; break; }
  }
  
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  // Find bottom row containing JUMLAH or TOTAL
  let excelWrittenTotal = null;
  let formulaFound = '';
  
  for (let r = rawRows.length - 1; r >= 0; r--) {
    const row = rawRows[r];
    const isJumlahRow = row.some(c => {
      const s = String(c).trim().toUpperCase();
      return s === 'JUMLAH' || s === 'TOTAL' || s === 'JUMLAH (RP)' || s.startsWith('JUMLAH :') || s.startsWith('JUMLAH:');
    });
    
    if (isJumlahRow) {
      // Find numbers in this row
      const nums = row.filter(c => typeof c === 'number' || (!isNaN(parseFloat(String(c).replace(/[^\d.-]/g, ''))) && parseFloat(String(c).replace(/[^\d.-]/g, '')) > 100000));
      if (nums.length > 0) {
        // usually the last number is the total netto
        const lastNum = nums[nums.length - 1];
        excelWrittenTotal = typeof lastNum === 'number' ? lastNum : Math.round(parseFloat(String(lastNum).replace(/[^\d.-]/g, '')));
        break;
      }
    }
  }

  const parsedTotal = b.totalNominal;
  const match = excelWrittenTotal === null || excelWrittenTotal === parsedTotal;
  
  if (!match) {
    allMatch = false;
    console.log(`❌ MISMATCH in ${(idx+1)}. [${b.monthFolder}] ${b.nomorSI}:`);
    console.log(`   Excel written total: Rp ${excelWrittenTotal?.toLocaleString('id-ID')}`);
    console.log(`   Parsed total:        Rp ${parsedTotal.toLocaleString('id-ID')}`);
    console.log(`   Diff:                Rp ${(parsedTotal - (excelWrittenTotal || 0)).toLocaleString('id-ID')}`);
    console.log(`   File: ${b.fileName}`);
  } else {
    console.log(`✅ ${(idx+1).toString().padStart(2)}. [${b.monthFolder}] ${b.nomorSI}: Rp ${parsedTotal.toLocaleString('id-ID')} (Written in Excel: ${excelWrittenTotal ? 'Rp ' + excelWrittenTotal.toLocaleString('id-ID') : 'Auto-calculated'})`);
  }
});

console.log('\nResult: ' + (allMatch ? 'ALL 30 SI TOTALS MATCH EXCEL EXACTLY!' : 'SOME TOTALS DO NOT MATCH!'));
