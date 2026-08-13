import XLSX from 'xlsx';

const filePath = 'C:/Users/smafu/Downloads/2026 - RENCANA ANGGARAN BELANJA (RAB) BOSP KONSOLIDASI  - Copy.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Urutan Belanja'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

console.log('--- SAMPLE ROWS ---');
data.slice(0, 40).forEach((r, i) => {
  const nonCols = {};
  r.forEach((cell, ci) => {
    if (cell !== '') nonCols[ci] = cell;
  });
  if (Object.keys(nonCols).length > 0) {
    console.log(`Row ${i}:`, JSON.stringify(nonCols));
  }
});
