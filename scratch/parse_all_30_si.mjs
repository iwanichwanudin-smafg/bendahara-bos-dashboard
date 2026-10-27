import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const manifest = JSON.parse(fs.readFileSync('downloaded_si/manifest.json', 'utf8'));
const siExcelFiles = manifest.filter(m => m.file_name.startsWith('SI BJB') && m.file_name.endsWith('.xlsx'));

console.log(`=== PARSING ALL ${siExcelFiles.length} SI EXCEL FILES ===\n`);

const romanMonths = {
  '01 Januari': 'I',
  '02 Februari': 'II',
  '03 Maret': 'III',
  '04 April': 'IV',
  '05 Mei': 'V',
  '06 Juni': 'VI',
  '07 Juli': 'VII',
  '08 Agustus': 'VIII',
  '09 September': 'IX',
  '10 Oktober': 'X'
};

const monthNumber = {
  '01 Januari': '01',
  '02 Februari': '02',
  '03 Maret': '03',
  '04 April': '04',
  '05 Mei': '05',
  '06 Juni': '06',
  '07 Juli': '07',
  '08 Agustus': '08',
  '09 September': '09',
  '10 Oktober': '10',
  'januari': '01',
  'februari': '02',
  'maret': '03',
  'april': '04',
  'mei': '05',
  'juni': '06',
  'juli': '07',
  'agustus': '08',
  'september': '09',
  'oktober': '10'
};

function parseIndonesianDateToISO(dateStr, fallbackMonthNum = '02') {
  if (!dateStr) return `2026-${fallbackMonthNum}-15`;
  const parts = String(dateStr).trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const mStr = parts[1].toLowerCase();
    const m = monthNumber[mStr] || fallbackMonthNum;
    const y = parts[2] || '2026';
    if (!isNaN(parseInt(day)) && !isNaN(parseInt(y))) {
      return `${y}-${m}-${day}`;
    }
  }
  return `2026-${fallbackMonthNum}-15`;
}

function findDocxNumber(monthDir, siDir, fallbackMonth) {
  try {
    const dir = path.dirname(siDir);
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f.endsWith('.docx') && (f.includes('SI BJB') || f.includes('Pindah'))) {
        const m = f.match(/^(\d+)\s+SI/i);
        if (m) return m[1];
      }
    }
  } catch (e) {}
  return null;
}

const parsedResults = [];

for (const item of siExcelFiles) {
  const filePath = item.local_path;
  if (!fs.existsSync(filePath)) {
    console.log(`[FILE MISSING] ${filePath}`);
    continue;
  }

  const buf = fs.readFileSync(filePath);
  const wb = XLSX.read(buf, { type: 'buffer' });
  
  // Pick target sheet
  let targetSheetName = wb.SheetNames[0];
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    if (!s) continue;
    const testRows = XLSX.utils.sheet_to_json(s, { header: 1, defval: '' });
    const hasMatch = testRows.some(row => {
      const str = row.map(c => String(c).toUpperCase()).join(' ');
      return str.includes('DAFTAR RINCIAN BELANJA') || str.includes('REKAP TRANSFER') || (str.includes('NO') && str.includes('BELANJA') && (str.includes('NETTO') || str.includes('REKENING')));
    });
    if (hasMatch) {
      targetSheetName = name;
      break;
    }
  }

  const sheet = wb.Sheets[targetSheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  let namaKegiatan = '';
  let bulan = '';
  let tahun = '2026';
  let noTabungan = '0120640100100';
  let tglSelesai = '';
  let kepsek = '';
  let bendahara = '';
  let headerRowIndex = -1;

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rowStr = row.map(c => String(c).trim().toUpperCase()).join(' ');
    if (rowStr.includes('NAMA KEGIATAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('NAMA KEGIATAN'));
      namaKegiatan = row.slice(idx + 1).find(c => c && c !== ':') || '';
    }
    if (rowStr.includes('NOMOR TABUNGAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('NOMOR TABUNGAN'));
      const val = row.slice(idx + 1).find(c => c && c !== ':');
      if (val) noTabungan = String(val).padStart(13, '0');
    }
    if (rowStr.includes('BULAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('BULAN'));
      bulan = row.slice(idx + 1).find(c => c && c !== ':') || '';
    }
    if (rowStr.includes('TAHUN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('TAHUN'));
      tahun = row.slice(idx + 1).find(c => c && c !== ':') || '2026';
    }
    if (rowStr.includes('NO') && (rowStr.includes('BELANJA') || rowStr.includes('URAIAN')) && (rowStr.includes('NETTO') || rowStr.includes('REKENING') || rowStr.includes('JUMLAH'))) {
      headerRowIndex = i;
    }
  }

  // Find date and signatures from bottom
  for (let i = rawRows.length - 1; i >= 0; i--) {
    const row = rawRows[i];
    for (const cell of row) {
      const cStr = String(cell).trim();
      const mDate = cStr.match(/Bekasi,\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
      if (mDate && !tglSelesai) {
        tglSelesai = mDate[1];
      }
      if (cStr.toUpperCase().includes('GHAZI') && !kepsek) {
        kepsek = cStr;
      }
      if (cStr.toUpperCase().includes('IWAN') && !bendahara) {
        bendahara = cStr;
      }
    }
  }

  // Extract transfers
  const transfers = [];
  let colIdx = {
    no: 0,
    uraian: 1,
    rekening: 2,
    bank: 3,
    atasNama: 4,
    bruto: 5,
    pajak: 6,
    netto: 7
  };

  if (headerRowIndex !== -1) {
    const hRow = rawRows[headerRowIndex].map(c => String(c).trim().toUpperCase());
    for (let c = 0; c < hRow.length; c++) {
      const col = hRow[c];
      if (col === 'NO' || col === 'NO.') colIdx.no = c;
      if (col.includes('BELANJA') || col.includes('URAIAN')) colIdx.uraian = c;
      if (col.includes('REKENING') || col.includes('VA')) colIdx.rekening = c;
      if (col.includes('BANK')) colIdx.bank = c;
      if (col.includes('ATAS NAMA') || col.includes('PENERIMA')) colIdx.atasNama = c;
      if (col.includes('BRUTO')) colIdx.bruto = c;
      if (col.includes('PAJAK') || col.includes('PPH')) colIdx.pajak = c;
      if (col.includes('NETTO') || col.includes('JUMLAH (RP)')) colIdx.netto = c;
    }
  }

  const startI = headerRowIndex !== -1 ? headerRowIndex + 1 : 10;
  for (let i = startI; i < rawRows.length; i++) {
    const row = rawRows[i];
    const noVal = row[colIdx.no];
    const no = parseInt(String(noVal).trim());
    if (isNaN(no) || no <= 0) {
      const str = row.map(c => String(c).toUpperCase()).join(' ');
      if (str.includes('JUMLAH') || str.includes('TOTAL') || str.includes('BEKASI,')) {
        break;
      }
      continue;
    }

    const rawUraian = String(row[colIdx.uraian] || '').trim();
    const vaSiplah = String(row[colIdx.rekening] || '').trim().replace(/^'/, '');
    const namaBank = String(row[colIdx.bank] || 'BJB').trim();
    const atasNama = String(row[colIdx.atasNama] || '').trim();
    const bruto = Math.round(parseFloat(String(row[colIdx.bruto] || 0).replace(/[^\d.-]/g, '')) || 0);
    const pajak = Math.round(parseFloat(String(row[colIdx.pajak] || 0).replace(/[^\d.-]/g, '')) || 0);
    let netto = Math.round(parseFloat(String(row[colIdx.netto] || 0).replace(/[^\d.-]/g, '')) || 0);
    if (!netto && bruto) netto = bruto - pajak;

    // Unit detection
    let unitId = 'PUTRA';
    let unitNama = 'FG Putra';
    const comb = (rawUraian + ' ' + atasNama).toUpperCase();

    if (comb.includes('MAHAD') || comb.includes('MA\'HAD')) {
      unitId = 'MAHAD';
      unitNama = 'FG Mahad';
    } else if (comb.includes('RABBANI')) {
      unitId = 'RABBANI';
      unitNama = 'FG Rabbani';
    } else if (comb.includes('FDS') || comb.includes('FULLDAY') || comb.includes('FULL DAY') || comb.includes('PUTRI (FDS)')) {
      unitId = 'FDS';
      unitNama = 'FG Putri (FDS)';
    } else if (comb.includes('BOARDING') || comb.includes('PUTRI (BS)') || comb.includes('(BS)') || comb.includes('PUTRI BOARDING') || comb.includes(' BS')) {
      unitId = 'BS';
      unitNama = 'FG Putri (BS)';
    } else if (comb.includes('YAYASAN') || comb.includes('YIP')) {
      unitId = 'YAYASAN';
      unitNama = 'Yayasan';
    }

    // Category detection
    let kategori = 'Operasional';
    if (comb.includes('HONOR') || comb.includes('GAJI') || comb.includes('TRANSPORT') || comb.includes('INSENTIF')) {
      kategori = 'Honor';
    } else if (comb.includes('BUKU') || comb.includes('ERLANGGA') || comb.includes('YUDHISTIRA') || comb.includes('INTAN')) {
      kategori = 'Buku';
    } else if (comb.includes('MODAL') || comb.includes('LAPTOP') || comb.includes('MEJA') || comb.includes('KURSI') || comb.includes('LEMARI') || comb.includes('AC ')) {
      kategori = 'Modal';
    }

    let displayTitle = rawUraian;
    let note = '';
    const noteMatch = rawUraian.match(/>>>\s*(.*)/);
    if (noteMatch) {
      note = noteMatch[1].trim();
      displayTitle = rawUraian.replace(/>>>\s*.*/, '').trim();
    }

    transfers.push({
      no: transfers.length + 1,
      originalNo: no,
      unitId,
      unitNama,
      kategori,
      vaSiplah,
      namaBank,
      atasNama,
      bruto,
      pajak,
      netto,
      ket: displayTitle || atasNama,
      note,
      uraian: displayTitle + (note ? ' — ' + note : '')
    });
  }

  // Find docx file in the same folder to get exact doc number
  let docxNumber = findDocxNumber(item.month, item.local_path, item.month);
  
  // Format nomor SI
  const mRoman = romanMonths[item.month] || 'II';
  const mNum = monthNumber[item.month] || '02';
  const docxPrefix = docxNumber || 'SI';
  const nomorSI = `${docxPrefix}/SI/SMA-FG/${mRoman}/${tahun}`;
  const batchId = `SI-${docxPrefix}-${tahun}-${mNum}`;
  const isoDate = parseIndonesianDateToISO(tglSelesai, mNum);
  const totalNominal = transfers.reduce((sum, t) => sum + t.netto, 0);

  parsedResults.push({
    batchId,
    nomorSI,
    monthFolder: item.month,
    siFolder: item.si_folder,
    fileName: item.file_name,
    localPath: item.local_path,
    bulan: bulan || item.month.replace(/^\d+\s*/, ''),
    tahun,
    tglSelesai: tglSelesai || `15 ${item.month.replace(/^\d+\s*/, '')} ${tahun}`,
    isoDate,
    totalNominal,
    transfersCount: transfers.length,
    transfers
  });
}

console.log(`Parsed ${parsedResults.length} batches:`);
let grandTotal = 0;
let totalTransfers = 0;
parsedResults.forEach((b, idx) => {
  grandTotal += b.totalNominal;
  totalTransfers += b.transfersCount;
  console.log(`[${idx + 1}] ${b.nomorSI} | ${b.tglSelesai} (${b.isoDate}) | ${b.fileName} | Trf: ${b.transfersCount} | Rp ${b.totalNominal.toLocaleString('id-ID')}`);
});

console.log(`\n==========================================`);
console.log(`GRAND TOTAL: Rp ${grandTotal.toLocaleString('id-ID')}`);
console.log(`TOTAL TRANSFERS: ${totalTransfers}`);

fs.writeFileSync('scratch/all_30_parsed_batches.json', JSON.stringify(parsedResults, null, 2), 'utf8');
console.log('Saved to scratch/all_30_parsed_batches.json');
