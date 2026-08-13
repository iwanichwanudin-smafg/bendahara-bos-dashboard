import XLSX from 'xlsx';

const filePath = 'C:/Users/smafu/Downloads/2026 - RENCANA ANGGARAN BELANJA (RAB) BOSP KONSOLIDASI  - Copy.xlsx';
const workbook = XLSX.readFile(filePath, { cellDates: true, cellFormulas: true });
const sheet = workbook.Sheets['Urutan Belanja'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });

console.log('Total rows:', data.length);
console.log('Row 0 (Headers):', JSON.stringify(data[0]));

let countWithBKU = 0;
let currentUnit = 'PUTRA';
let currentMonth = 'Januari';
let currentCategory = 'Operasional';

const monthNames = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

const bkuRecords = [];

data.forEach((row, idx) => {
  if (idx === 0) return;

  const cA = String(row[0] || '').trim(); // Col A
  const cB = String(row[1] || '').trim(); // Col B
  const cC = String(row[2] || '').trim(); // Col C - Unit
  const cD = String(row[3] || '').trim(); // Col D - Kategori
  const cE = String(row[4] || '').trim(); // Col E - Nama Barang
  const cF = String(row[5] || '').trim(); // Col F - Merk/Tipe
  const cG = String(row[6] || '').trim(); // Col G - Qty
  const cH = String(row[7] || '').trim(); // Col H - Satuan
  const cI = String(row[8] || '').trim(); // Col I - Harga Satuan SIPLah
  const cJ = String(row[9] || '').trim(); // Col J - Harga Total SIPLah
  const cK = String(row[10] || '').trim(); // Col K - Ket
  const cL = String(row[11] || '').trim(); // Col L - BAYAR BANK / Tanggal Bayar
  const cM = String(row[12] || '').trim(); // Col M - Nominal Real
  const cN = String(row[13] || '').trim(); // Col N - Selisih
  const cO = String(row[14] || '').trim(); // Col O - BKU

  // Check month marker in A
  if (monthNames.includes(cA.toUpperCase())) {
    currentMonth = cA;
  }

  // Check unit in C or B
  const uUpper = (cC || cB).toUpperCase();
  if (['PUTRA', 'MAHAD', 'BS', 'FDS', 'RABBANI'].some(u => uUpper.includes(u))) {
    if (uUpper.includes('PUTRA')) currentUnit = 'FG PUTRA';
    else if (uUpper.includes('MAHAD')) currentUnit = 'FG MAHAD';
    else if (uUpper.includes('BS')) currentUnit = 'FG PUTRI BS';
    else if (uUpper.includes('FDS')) currentUnit = 'FG PUTRI FDS';
    else if (uUpper.includes('RABBANI')) currentUnit = 'RABBANI';
  }

  // Check category in D
  if (cD) {
    const cdU = cD.toUpperCase();
    if (cdU.includes('OPERASIONAL')) currentCategory = 'Operasional';
    else if (cdU.includes('GAJI')) currentCategory = 'Gaji';
    else if (cdU.includes('BUKU')) currentCategory = 'Buku';
    else if (cdU.includes('MODAL')) currentCategory = 'Modal';
  }

  // Filter only rows that have BKU in Column O
  if (cO && cO !== 'BKU' && cO !== '-' && cE && cE !== 'NAMA BARANG') {
    countWithBKU++;
    bkuRecords.push({
      rowIdx: idx,
      unit: currentUnit,
      month: currentMonth,
      category: currentCategory,
      namaBarang: cE, // Col E
      merk: cF, // Col F
      qty: Number(cG) || 1,
      satuan: cH || 'pcs',
      hargaSiplahSatuan: Number(cI) || 0,
      hargaSiplahTotal: Number(cJ) || 0,
      ket: cK,
      tglBayarBank: cL, // Col L (BAYAR BANK)
      nominalReal: cM, // Col M (Nominal Real)
      bku: cO // Col O (BKU)
    });
  }
});

console.log(`Found ${bkuRecords.length} rows with BKU in Column O.`);
console.log('\n--- SAMPLE FIRST 20 BKU RECORDS ---');
bkuRecords.slice(0, 20).forEach((rec, i) => {
  console.log(`${i+1}. [Row ${rec.rowIdx}] ${rec.unit} | BKU:${rec.bku} | TglBank:${rec.tglBayarBank} | Barang:${rec.namaBarang} | NominalReal:${rec.nominalReal} | TotalSiplah:${rec.hargaSiplahTotal}`);
});
