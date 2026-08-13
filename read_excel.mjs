import XLSX from 'xlsx';

const filePath = 'C:/Users/smafu/Downloads/2026 - RENCANA ANGGARAN BELANJA (RAB) BOSP KONSOLIDASI .xlsx';
const workbook = XLSX.readFile(filePath);

// =============================================
// Sheet 0: Pembagian Dana BOS & BPMU
// =============================================
const s0 = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '' });
console.log('=== SHEET: ' + workbook.SheetNames[0] + ' ===');
console.log('Total rows:', s0.length, ', Total cols:', s0[0]?.length);
for (let i = 0; i < Math.min(s0.length, 50); i++) {
  const row = s0[i];
  if (row.some(c => c !== '')) {
    const compact = {};
    row.forEach((c, ci) => { if (c !== '') compact[ci] = c; });
    console.log(`Row ${i}: ${JSON.stringify(compact)}`);
  }
}

// =============================================
// Sheet 7: Urutan Belanja
// =============================================
console.log('\n\n=== SHEET: ' + workbook.SheetNames[7] + ' ===');
const s7 = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[7]], { header: 1, defval: '' });
console.log('Total rows:', s7.length);

// Print header rows first
for (let i = 0; i < 10; i++) {
  const row = s7[i];
  if (row.some(c => c !== '')) {
    const compact = {};
    row.forEach((c, ci) => { if (c !== '') compact[ci] = c; });
    console.log(`Row ${i}: ${JSON.stringify(compact)}`);
  }
}

// Now count items per unit and analyze structure
let currentUnit = '';
let currentMonth = '';
const unitRealisasi = {};
let totalItems = 0;

for (let i = 7; i < s7.length; i++) {
  const row = s7[i];
  const col0 = String(row[0] || '').trim();
  const col2 = String(row[2] || '').trim();
  const col3 = String(row[3] || '').trim();
  const col4 = String(row[4] || '').trim();
  
  // Detect month markers (JANUARI, FEBRUARI, etc.)
  if (['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER'].includes(col0.toUpperCase())) {
    currentMonth = col0;
    continue;
  }
  
  // Detect unit markers
  if (col2 && ['PUTRA','MAHAD','RABBANI','BS','FDS'].some(u => col2.toUpperCase().includes(u))) {
    currentUnit = col2;
  }
  
  // Detect items with data
  if (col4 && col4 !== '' && row[9] && Number(row[9]) > 0) {
    totalItems++;
    if (!unitRealisasi[currentUnit]) unitRealisasi[currentUnit] = { months: {}, total: 0, items: [] };
    if (!unitRealisasi[currentUnit].months[currentMonth]) unitRealisasi[currentUnit].months[currentMonth] = 0;
    
    const nominal = Number(row[9]) || 0;
    const realNominal = Number(row[12]) || nominal;
    unitRealisasi[currentUnit].months[currentMonth] += realNominal;
    unitRealisasi[currentUnit].total += realNominal;
    
    if (unitRealisasi[currentUnit].items.length < 5) {
      unitRealisasi[currentUnit].items.push({
        month: currentMonth,
        kategori: col3,
        nama: col4,
        qty: row[6],
        satuan: row[7],
        hargaSiplah: row[8],
        totalSiplah: row[9],
        nominalReal: row[12],
        bku: row[14]
      });
    }
  }
}

console.log(`\nTotal items with realisasi: ${totalItems}`);
console.log('\n--- REALISASI PER UNIT ---');
Object.keys(unitRealisasi).forEach(u => {
  console.log(`\nUnit: "${u}" | Total: ${unitRealisasi[u].total}`);
  console.log('  Months:', JSON.stringify(unitRealisasi[u].months));
  console.log('  Sample items:');
  unitRealisasi[u].items.forEach(item => {
    console.log(`    ${item.month} | ${item.kategori} | ${item.nama} | Qty:${item.qty} | Siplah:${item.totalSiplah} | Real:${item.nominalReal} | BKU:${item.bku}`);
  });
});

// Print rows 7-50 fully for detailed analysis
console.log('\n\n--- FIRST 60 DATA ROWS (Row 7-67) ---');
for (let i = 7; i < Math.min(s7.length, 67); i++) {
  const row = s7[i];
  if (row.some(c => c !== '')) {
    const compact = {};
    row.forEach((c, ci) => { if (c !== '' && ci <= 15) compact[ci] = c; });
    console.log(`Row ${i}: ${JSON.stringify(compact)}`);
  }
}
