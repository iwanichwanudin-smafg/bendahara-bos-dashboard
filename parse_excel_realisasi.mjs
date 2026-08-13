import XLSX from 'xlsx';

const filePath = 'C:/Users/smafu/Downloads/2026 - RENCANA ANGGARAN BELANJA (RAB) BOSP KONSOLIDASI  - Copy.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Urutan Belanja'];
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

console.log('Total raw rows:', rawData.length);

// Let's trace how unit & month markers appear
let currentUnit = 'PUTRA';
let currentMonth = 'JANUARI';
let currentCategory = 'OPERASIONAL';

const parsedItems = [];

const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
const unitsMap = {
  'PUTRA': 1,
  'MAHAD': 2,
  'BS': 3,
  'FDS': 4,
  'RABBANI': 5
};

rawData.forEach((row, i) => {
  if (i === 0) return; // Header

  const c0 = String(row[0] || '').trim();
  const c1 = String(row[1] || '').trim();
  const c2 = String(row[2] || '').trim();
  const c3 = String(row[3] || '').trim();
  const c4 = String(row[4] || '').trim();
  const c5 = String(row[5] || '').trim();
  const c6 = String(row[6] || '').trim();
  const c7 = String(row[7] || '').trim();
  const c8 = String(row[8] || '').trim();
  const c9 = String(row[9] || '').trim();
  const c10 = String(row[10] || '').trim();
  const c11 = String(row[11] || '').trim();
  const c12 = String(row[12] || '').trim();
  const c13 = String(row[13] || '').trim();
  const c14 = String(row[14] || '').trim();

  // Check if month marker in c0
  if (months.includes(c0.toUpperCase())) {
    currentMonth = c0.toUpperCase();
  }

  // Check if unit marker in c1 or c2 or c0
  if (c2 && ['PUTRA', 'MAHAD', 'BS', 'FDS', 'RABBANI'].includes(c2.toUpperCase())) {
    currentUnit = c2.toUpperCase();
  } else if (c1 && ['PUTRA', 'MAHAD', 'BS', 'FDS', 'RABBANI'].includes(c1.toUpperCase())) {
    currentUnit = c1.toUpperCase();
  }

  // Check category in c3
  if (c3 && ['OPERASIONAL', 'GAJI', 'BUKU', 'MODAL', 'BELANJA MODAL'].includes(c3.toUpperCase())) {
    currentCategory = c3.toUpperCase();
  }

  // An item row usually has a name in c4 (NAMA BARANG)
  if (c4 && c4 !== 'NAMA BARANG' && c4 !== 'Not Posted Yet' && c4 !== 'BATAL DIBELANJAKAN') {
    const qty = Number(c6) || 1;
    const hargaSiplah = Number(c8) || 0;
    const totalSiplah = Number(c9) || 0;
    const nominalReal = Number(c12) || Number(c11) || totalSiplah;
    const ket = c10;
    const bku = c14;

    parsedItems.push({
      rowIdx: i,
      unit: currentUnit,
      month: currentMonth,
      category: currentCategory,
      name: c4,
      merk: c5,
      qty: qty,
      satuan: c7,
      hargaSiplah: hargaSiplah,
      totalSiplah: totalSiplah,
      nominalReal: nominalReal,
      ket: ket,
      bku: bku
    });
  }
});

console.log(`Extracted ${parsedItems.length} items`);

// Summary by Unit & Month
const summary = {};
parsedItems.forEach(item => {
  const k = `${item.unit} | ${item.month}`;
  if (!summary[k]) summary[k] = { count: 0, totalSiplah: 0, totalReal: 0 };
  summary[k].count++;
  summary[k].totalSiplah += item.totalSiplah;
  summary[k].totalReal += item.nominalReal;
});

console.log('Summary by Unit & Month:');
console.log(JSON.stringify(summary, null, 2));
