import XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:/Users/smafu/Downloads/2026 - RENCANA ANGGARAN BELANJA (RAB) BOSP KONSOLIDASI  - Copy.xlsx';
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Urutan Belanja'];
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

const unitIdMap = {
  'PUTRA': 1,
  'MAHAD': 2,
  'BS': 3,
  'FDS': 4,
  'RABBANI': 5
};

const monthNamesIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let currentUnitKey = 'PUTRA';
let currentMonthKey = 'Januari';
let currentCategory = 'Operasional';

const importedRABData = { 1: [], 2: [], 3: [], 4: [], 5: [] };

rawData.forEach((row, i) => {
  if (i === 0) return;

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
  const c10 = String(row[10] || '').trim(); // Status KET
  const c11 = String(row[11] || '').trim(); // BAYAR BANK
  const c12 = String(row[12] || '').trim(); // Nominal Real
  const c13 = String(row[13] || '').trim(); // Selisih
  const c14 = String(row[14] || '').trim(); // BKU

  // Check month
  const mMatch = monthNamesIndo.find(m => m.toUpperCase() === c0.toUpperCase());
  if (mMatch) {
    currentMonthKey = mMatch;
  }

  // Check unit
  const uMatch = ['PUTRA', 'MAHAD', 'BS', 'FDS', 'RABBANI'].find(u => u === c2.toUpperCase() || u === c1.toUpperCase());
  if (uMatch) {
    currentUnitKey = uMatch;
  }

  // Check category
  if (c3) {
    const c3U = c3.toUpperCase();
    if (c3U.includes('OPERASIONAL')) currentCategory = 'Operasional';
    else if (c3U.includes('GAJI')) currentCategory = 'Gaji';
    else if (c3U.includes('BUKU')) currentCategory = 'Buku';
    else if (c3U.includes('MODAL')) currentCategory = 'Modal';
  }

  if (c4 && c4 !== 'NAMA BARANG' && c4 !== 'Not Posted Yet' && c4 !== 'BATAL DIBELANJAKAN' && c4 !== 'SDH TUNTAS') {
    const unitId = unitIdMap[currentUnitKey] || 1;
    const qty = Number(c6) || 1;
    const hargaSiplah = Number(c8) || 0;
    const totalSiplah = Number(c9) || 0;
    const nominalReal = Number(c12) || Number(c11) || totalSiplah;
    const statusKet = c10;
    const bkuCode = c14;

    const isTahap1Month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].includes(currentMonthKey);
    const isBatal = statusKet.toUpperCase().includes('BATAL') || statusKet.toUpperCase().includes('CANCEL');

    // Create RAB item
    const item = {
      jenis: currentCategory,
      desc: c4,
      link: c5 || '-',
      qty: qty,
      satuan: c7 || 'pcs',
      harga: hargaSiplah > 0 ? hargaSiplah : (qty > 0 ? totalSiplah / qty : 0),
      bulan: currentMonthKey,
      realisasi: {}
    };

    // Attach realisasi for Tahap 1 or if BKU exists or if posted
    if (isTahap1Month || bkuCode || statusKet.toUpperCase().includes('POSTED') || statusKet.toUpperCase().includes('BAYAR') || nominalReal > 0) {
      if (isBatal) {
        item.realisasi[currentMonthKey] = { batal: true };
      } else if (nominalReal > 0 || totalSiplah > 0) {
        const monthIdx = monthNamesIndo.indexOf(currentMonthKey) + 1;
        const monthStr = monthIdx < 10 ? `0${monthIdx}` : `${monthIdx}`;
        item.realisasi[currentMonthKey] = {
          tgl: `2026-${monthStr}-15`,
          qty: qty,
          harga: qty > 0 ? (nominalReal > 0 ? nominalReal / qty : totalSiplah / qty) : (nominalReal || totalSiplah),
          link: c5 && c5.startsWith('http') ? c5 : 'Sudah BKU (Tahap 1)',
          invoice: bkuCode ? `BKU-${bkuCode}` : `BKU-${unitId}-${currentMonthKey.substring(0,3).toUpperCase()}`
        };
      }
    }

    importedRABData[unitId].push(item);
  }
});

console.log('Imported counts per unit:');
Object.keys(importedRABData).forEach(uId => {
  let realCount = 0;
  importedRABData[uId].forEach(item => {
    if (item.realisasi && Object.keys(item.realisasi).length > 0) realCount++;
  });
  console.log(`Unit ${uId}: ${importedRABData[uId].length} RAB items, ${realCount} realisasi records`);
});

fs.writeFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', JSON.stringify(importedRABData, null, 2));
console.log('Saved to imported_data.json');
