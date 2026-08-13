import XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'C:/Users/smafu/Downloads/2026 - RENCANA ANGGARAN BELANJA (RAB) BOSP KONSOLIDASI  - Copy.xlsx';
const workbook = XLSX.readFile(filePath, { cellDates: true, raw: false });
const sheet = workbook.Sheets['Urutan Belanja'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });

const unitMap = {
  'PUTRA': 1,
  'MAHAD': 2,
  'BS': 3,
  'FDS': 4,
  'RABBANI': 5
};

const monthNamesIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let currentUnitName = 'FG PUTRA';
let currentUnitId = 1;
let currentMonth = 'Januari';
let currentCategory = 'Operasional';
let currentTglBankGroup = '';

const bkuItems = [];

const cleanNumber = (valStr) => {
  if (valStr === undefined || valStr === null || valStr === '') return 0;
  if (typeof valStr === 'number') return valStr;
  let str = String(valStr).replace(/Rp|\s/gi, '').trim();
  if (!str) return 0;
  if (str.includes(',') && !str.includes('.')) {
    str = str.replace(/,/g, '');
  } else if (str.includes('.') && !str.includes(',')) {
    str = str.replace(/\./g, '');
  } else if (str.includes(',') && str.includes('.')) {
    if (str.indexOf('.') < str.indexOf(',')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  }
  return parseFloat(str) || 0;
};

// Also keep full RAB list per unit
const importedRABData = { 1: [], 2: [], 3: [], 4: [], 5: [] };

data.forEach((row, idx) => {
  if (idx === 0) return;

  const cA = String(row[0] || '').trim(); // Col A
  const cB = String(row[1] || '').trim(); // Col B
  const cC = String(row[2] || '').trim(); // Col C
  const cD = String(row[3] || '').trim(); // Col D
  const cE = String(row[4] || '').trim(); // Col E - NAMA BARANG
  const cF = String(row[5] || '').trim(); // Col F - MERK DAN TIPE / LINK
  const cG = String(row[6] || '').trim(); // Col G - JUMLAH BARANG
  const cH = String(row[7] || '').trim(); // Col H - SATUAN
  const cI = String(row[8] || '').trim(); // Col I - HARGA SATUAN SIPLAH
  const cJ = String(row[9] || '').trim(); // Col J - HARGA TOTAL SIPLAH
  const cK = String(row[10] || '').trim(); // Col K - KET
  const cL = String(row[11] || '').trim(); // Col L - BAYAR BANK
  const cM = String(row[12] || '').trim(); // Col M - Nominal Real
  const cN = String(row[13] || '').trim(); // Col N - Selisih
  const cO = String(row[14] || '').trim(); // Col O - BKU

  // Month
  const mMatch = monthNamesIndo.find(m => m.toUpperCase() === cA.toUpperCase());
  if (mMatch) {
    currentMonth = mMatch;
  }

  // Unit
  const uUpper = (cC || cB || cA).toUpperCase();
  if (uUpper.includes('PUTRA')) { currentUnitName = 'FG PUTRA'; currentUnitId = 1; }
  else if (uUpper.includes('MAHAD')) { currentUnitName = 'FG MAHAD'; currentUnitId = 2; }
  else if (uUpper.includes('BS')) { currentUnitName = 'FG PUTRI BS'; currentUnitId = 3; }
  else if (uUpper.includes('FDS')) { currentUnitName = 'FG PUTRI FDS'; currentUnitId = 4; }
  else if (uUpper.includes('RABBANI')) { currentUnitName = 'RABBANI'; currentUnitId = 5; }

  // Category
  if (cD) {
    const cdU = cD.toUpperCase();
    if (cdU.includes('OPERASIONAL')) currentCategory = 'Operasional';
    else if (cdU.includes('GAJI')) currentCategory = 'Gaji';
    else if (cdU.includes('BUKU')) currentCategory = 'Buku';
    else if (cdU.includes('MODAL')) currentCategory = 'Modal';
  }

  // Group date marker in Col L
  if (cL && (cL.includes('Feb') || cL.includes('Jan') || cL.includes('Mar') || cL.includes('Apr') || cL.includes('Mei') || cL.includes('Jun') || cL.includes('Jul') || cL.includes('2026') || cL.includes('-') || cL.includes('/'))) {
    currentTglBankGroup = cL;
  }

  // Process RAB item
  if (cE && cE !== 'NAMA BARANG' && cE !== 'Not Posted Yet' && cE !== 'BATAL DIBELANJAKAN' && cE !== 'SDH TUNTAS') {
    const qty = cleanNumber(cG) || 1;
    const nominalBku = cleanNumber(cO);
    const nominalReal = cleanNumber(cM);
    const totalSiplah = cleanNumber(cJ);
    const hargaSiplahSatuan = cleanNumber(cI);

    const hasBKU = cO && cO !== 'BKU' && cO !== '-';
    const isBatal = cK.toUpperCase().includes('BATAL') || cK.toUpperCase().includes('CANCEL');

    let effectiveTotalReal = nominalBku > 0 ? nominalBku : (nominalReal > 0 ? nominalReal : (hasBKU ? totalSiplah : 0));
    let effectiveHargaSatuan = qty > 0 ? effectiveTotalReal / qty : effectiveTotalReal;

    // Date formatting for Col L
    let tglRaw = cL || currentTglBankGroup;
    let formattedDate = '2026-02-27'; // Default fallback date

    if (tglRaw) {
      const dateParts = tglRaw.split(/[\s\-\/]+/);
      if (dateParts.length >= 3) {
        let day = parseInt(dateParts[0]) || 15;
        let monthStr = dateParts[1].toLowerCase();
        let year = dateParts[2].length === 2 ? '20' + dateParts[2] : (dateParts[2] || '2026');

        const monthMap = {
          'jan': '01', 'januari': '01', 'feb': '02', 'februari': '02',
          'mar': '03', 'maret': '03', 'apr': '04', 'april': '04',
          'mei': '05', 'may': '05', 'jun': '06', 'juni': '06',
          'jul': '07', 'juli': '07', 'agu': '08', 'agustus': '08',
          'sep': '09', 'september': '09', 'okt': '10', 'oktober': '10',
          'nov': '11', 'november': '11', 'des': '12', 'desember': '12'
        };
        let mNum = monthMap[monthStr] || '02';
        let dayStr = day < 10 ? `0${day}` : `${day}`;
        formattedDate = `${year}-${mNum}-${dayStr}`;
      }
    } else {
      const monthIdx = monthNamesIndo.indexOf(currentMonth) + 1;
      const monthStr = monthIdx < 10 ? `0${monthIdx}` : `${monthIdx}`;
      formattedDate = `2026-${monthStr}-15`;
    }

    const item = {
      jenis: currentCategory,
      desc: cE, // Col E: Nama Barang Exact
      link: cF || '-', // Col F: Merk/Link
      qty: qty,
      satuan: cH || 'pcs',
      harga: hargaSiplahSatuan > 0 ? hargaSiplahSatuan : (qty > 0 ? totalSiplah / qty : 0),
      bulan: currentMonth,
      realisasi: {}
    };

    if (hasBKU) {
      if (isBatal) {
        item.realisasi[currentMonth] = { batal: true };
      } else {
        item.realisasi[currentMonth] = {
          tgl: formattedDate, // Col L: Tanggal BAYAR BANK
          qty: qty,
          harga: effectiveHargaSatuan, // Based on BKU / Nominal Real / Total SIPLah
          link: cF && cF.startsWith('http') ? cF : 'Sudah BKU (Verified)',
          invoice: `BKU-${cO.replace(/Rp|\s/g, '')}` // Col O: BKU
        };
      }

      bkuItems.push({
        unitId: currentUnitId,
        unitName: currentUnitName,
        month: currentMonth,
        desc: cE,
        tglBank: formattedDate,
        bku: cO,
        qty: qty,
        harga: effectiveHargaSatuan,
        total: effectiveTotalReal
      });
    }

    importedRABData[currentUnitId].push(item);
  }
});

console.log(`Extracted ${bkuItems.length} BKU transactions total.`);
console.log('\n--- SAMPLE BKU TRANSACTIONS ---');
bkuItems.slice(0, 15).forEach((b, i) => {
  console.log(`${i+1}. [${b.unitName}] ${b.month} | "${b.desc}" | Qty: ${b.qty} | TglBank: ${b.tglBank} | BKU: ${b.bku} | Total: Rp ${b.total.toLocaleString('id-ID')}`);
});

fs.writeFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', JSON.stringify(importedRABData, null, 2));
console.log('\nUpdated imported_data.json successfully!');
