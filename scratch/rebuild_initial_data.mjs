/**
 * Script to rebuild INITIAL_SI_BATCHES and INITIAL_TRANSAKSI_LIST 
 * from the 30 parsed SI Excel files
 */
import fs from 'fs';
import XLSX from 'xlsx';
import path from 'path';

const DOWNLOAD_DIR = 'downloaded_si';

const romanMonths = {
  '01 Januari': 'I', '02 Februari': 'II', '03 Maret': 'III', '04 April': 'IV',
  '05 Mei': 'V', '06 Juni': 'VI', '07 Juli': 'VII', '08 Agustus': 'VIII',
  '09 September': 'IX', '10 Oktober': 'X'
};

const monthNumber = {
  '01 Januari': '01', '02 Februari': '02', '03 Maret': '03', '04 April': '04',
  '05 Mei': '05', '06 Juni': '06', '07 Juli': '07', '08 Agustus': '08',
  '09 September': '09', '10 Oktober': '10',
  'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
  'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
  'september': '09', 'oktober': '10'
};

function parseIndonesianDateToISO(dateStr, fallbackMonthNum = '02') {
  if (!dateStr) return `2026-${fallbackMonthNum}-15`;
  const parts = String(dateStr).trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].replace(/[^0-9]/g, '').padStart(2, '0');
    const mStr = parts[1].toLowerCase().replace(/[^a-z]/g, '');
    const m = monthNumber[mStr] || fallbackMonthNum;
    const y = parts[2].replace(/[^0-9]/g, '') || '2026';
    if (day && y.length === 4) return `${y}-${m}-${day}`;
  }
  return `2026-${fallbackMonthNum}-15`;
}

function formatTanggalIndonesia(isoDate) {
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const [y, m, d] = isoDate.split('-');
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function parseSIExcel(filePath, monthFolder, siFolder, docxNumber) {
  const buf = fs.readFileSync(filePath);
  const wb = XLSX.read(buf, { type: 'buffer' });

  let targetSheetName = wb.SheetNames[0];
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    if (!s) continue;
    const testRows = XLSX.utils.sheet_to_json(s, { header: 1, defval: '' });
    const hasMatch = testRows.some(row => {
      const str = row.map(c => String(c).toUpperCase()).join(' ');
      return str.includes('DAFTAR RINCIAN BELANJA') || str.includes('REKAP TRANSFER') ||
        (str.includes('NO') && (str.includes('BELANJA') || str.includes('URAIAN')) && 
         (str.includes('NETTO') || str.includes('REKENING') || str.includes('JUMLAH')));
    });
    if (hasMatch) { targetSheetName = name; break; }
  }

  const sheet = wb.Sheets[targetSheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  let bulan = '';
  let tahun = '2026';
  let noTabungan = '0120640100100';
  let tglSelesai = '';
  let headerRowIndex = -1;

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rowStr = row.map(c => String(c).trim().toUpperCase()).join(' ');
    if (rowStr.includes('NOMOR TABUNGAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('NOMOR TABUNGAN'));
      const val = row.slice(idx + 1).find(c => c && c !== ':');
      if (val) noTabungan = String(val).replace(/\D/g, '').padStart(13, '0');
    }
    if (rowStr.includes('BULAN') && !bulan) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('BULAN'));
      bulan = row.slice(idx + 1).find(c => c && c !== ':') || '';
    }
    if (rowStr.includes('TAHUN') && tahun === '2026') {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('TAHUN'));
      tahun = String(row.slice(idx + 1).find(c => c && c !== ':') || '2026');
    }
    if (rowStr.includes('NO') && (rowStr.includes('BELANJA') || rowStr.includes('URAIAN')) &&
       (rowStr.includes('NETTO') || rowStr.includes('REKENING') || rowStr.includes('JUMLAH'))) {
      headerRowIndex = i;
    }
  }

  // Find date and signatures from bottom
  for (let i = rawRows.length - 1; i >= 0; i--) {
    const row = rawRows[i];
    for (const cell of row) {
      const cStr = String(cell).trim();
      const mDate = cStr.match(/Bekasi,\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
      if (mDate && !tglSelesai) tglSelesai = mDate[1];
      const mDate2 = cStr.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4})/) ;
      if (mDate2 && !tglSelesai && cStr.includes('Bekasi')) tglSelesai = mDate2[1];
    }
    if (tglSelesai) break;
  }

  // Set column indices
  let colIdx = { no: 0, uraian: 1, rekening: 2, bank: 3, atasNama: 4, bruto: -1, pajak: -1, netto: -1, ket: -1 };
  if (headerRowIndex !== -1) {
    const hRow = rawRows[headerRowIndex].map(c => String(c).trim().toUpperCase());
    hRow.forEach((col, c) => {
      if (col === 'NO' || col === 'NO.') colIdx.no = c;
      else if (col.includes('BELANJA') || col.includes('URAIAN')) colIdx.uraian = c;
      else if ((col.includes('REKENING') || col.includes('VA')) && !col.includes('SUMBER')) colIdx.rekening = c;
      else if (col.includes('BANK') && !col.includes('SUMBER')) colIdx.bank = c;
      else if (col.includes('ATAS NAMA') || col.includes('PENERIMA')) colIdx.atasNama = c;
      else if (col.includes('BRUTO')) colIdx.bruto = c;
      else if (col.includes('PAJAK') || col.includes('PPH')) colIdx.pajak = c;
      else if (col.includes('NETTO') || col === 'JUMLAH (RP)' || col === 'JUMLAH') colIdx.netto = c;
      else if (col.includes('KET') || col.includes('KETERANGAN') || col.includes('CATATAN')) colIdx.ket = c;
    });
  }

  const transfers = [];
  const startI = headerRowIndex !== -1 ? headerRowIndex + 1 : 10;

  for (let i = startI; i < rawRows.length; i++) {
    const row = rawRows[i];
    const noVal = parseInt(String(row[colIdx.no] || '').trim());
    if (isNaN(noVal) || noVal <= 0) {
      const str = row.map(c => String(c).toUpperCase()).join(' ');
      if (str.includes('JUMLAH') || str.includes('TOTAL') || str.includes('BEKASI')) break;
      continue;
    }

    const rawUraian = String(row[colIdx.uraian] || '').trim();
    const vaSiplah = String(row[colIdx.rekening] || '').trim().replace(/^'/, '');
    const namaBank = String(row[colIdx.bank] || 'BJB').trim();
    const atasNama = String(row[colIdx.atasNama] || '').trim();

    // Try to get netto
    let netto = 0;
    if (colIdx.netto >= 0) {
      const cell = row[colIdx.netto];
      netto = typeof cell === 'number' ? cell : Math.round(parseFloat(String(cell || 0).replace(/[^\d.-]/g, '')) || 0);
    }
    // Fallback: search from right
    if (!netto) {
      for (let c = row.length - 1; c >= 5; c--) {
        const v = row[c];
        const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/[^\d.-]/g, ''));
        if (n > 100000) { netto = Math.round(n); break; }
      }
    }

    const bruto = colIdx.bruto >= 0 && row[colIdx.bruto] ? 
      (typeof row[colIdx.bruto] === 'number' ? row[colIdx.bruto] : parseFloat(String(row[colIdx.bruto]).replace(/[^\d.-]/g, '')) || 0) : 0;
    const pajak = colIdx.pajak >= 0 && row[colIdx.pajak] ? 
      (typeof row[colIdx.pajak] === 'number' ? row[colIdx.pajak] : parseFloat(String(row[colIdx.pajak]).replace(/[^\d.-]/g, '')) || 0) : 0;

    const ketRaw = colIdx.ket >= 0 ? String(row[colIdx.ket] || '').trim() : '';

    // Unit detection
    let unitId = 'PUTRA';
    let unitNama = 'FG Putra';
    const comb = (rawUraian + ' ' + atasNama + ' ' + ketRaw).toUpperCase();
    if (comb.includes('RABBANI')) { unitId = 'RABBANI'; unitNama = 'FG Rabbani'; }
    else if (comb.includes('FDS') || comb.includes('FULLDAY') || comb.includes('FULL DAY') || comb.includes('PUTRI (FDS)')) { unitId = 'FDS'; unitNama = 'FG Putri (FDS)'; }
    else if (comb.includes('MAHAD') || comb.includes("MA'HAD") || comb.includes('ASRAMA')) { unitId = 'MAHAD'; unitNama = 'FG Mahad'; }
    else if (comb.includes('BOARDING') || comb.includes('PUTRI (BS)') || comb.includes('PUTRI BS') || /\bBS\b/.test(comb)) { unitId = 'BS'; unitNama = 'FG Putri (BS)'; }
    else if (comb.includes('YAYASAN') || comb.includes('YIP')) { unitId = 'YAYASAN'; unitNama = 'Yayasan'; }

    // Category detection
    let kategori = 'Operasional';
    const combL = comb.toLowerCase();
    if (combL.includes('honor') || combL.includes('gaji') || combL.includes('transport') || combL.includes('insentif') || combL.includes('narasumber')) kategori = 'Honor';
    else if (combL.includes('buku') || combL.includes('kitab') || combL.includes('lks') || combL.includes('modul') || combL.includes('erlangga') || combL.includes('yudhistira') || combL.includes('intan pariwara')) kategori = 'Buku';
    else if (combL.includes('modal') || combL.includes('laptop') || combL.includes('meja kursi') || combL.includes('lemari') || combL.includes('printer') || combL.includes('cctv') || combL.includes('karpet') || combL.includes('kipas')) kategori = 'Modal';
    else if (combL.includes('listrik') || combL.includes('internet') || combL.includes('token') || combL.includes('tagihan')) kategori = 'Operasional';

    // Process uraian - split ket and note
    let displayTitle = rawUraian;
    let note = '';
    const noteMatch = rawUraian.match(/>>>\s*(.*)/);
    if (noteMatch) {
      note = '>>> ' + noteMatch[1].trim();
      displayTitle = rawUraian.replace(/>>>\s*.*/, '').trim();
    }

    // Use ket from separate column if available
    if (ketRaw && ketRaw.length > 5) {
      if (ketRaw.startsWith('>>>')) {
        note = ketRaw;
      } else {
        if (!displayTitle || displayTitle === 'Transfer Dana' || displayTitle === 'Transfer') {
          displayTitle = ketRaw;
        }
      }
    }

    if (!displayTitle || displayTitle === 'Transfer Dana' || displayTitle === 'Transfer') {
      if (kategori === 'Operasional' && (combL.includes('listrik') || combL.includes('token'))) displayTitle = 'Tagihan Listrik';
      else if (kategori === 'Operasional' && combL.includes('internet')) displayTitle = 'Tagihan Internet';
      else displayTitle = `Belanja ${kategori} (${unitNama})`;
    }

    transfers.push({
      no: transfers.length + 1,
      originalNo: noVal,
      unitId,
      unitNama,
      kategori,
      vaSiplah,
      namaBank,
      atasNama,
      bruto: Math.round(bruto),
      pajak: Math.round(pajak),
      netto: Math.round(netto),
      ket: displayTitle,
      note,
      uraian: displayTitle + (note ? ' — ' + note.replace(/^>>>\s*/, '') : '')
    });
  }

  const mNum = monthNumber[monthFolder] || '02';
  const mRoman = romanMonths[monthFolder] || 'II';
  const isoDate = tglSelesai ? parseIndonesianDateToISO(tglSelesai, mNum) : `2026-${mNum}-15`;
  const totalNominal = transfers.reduce((sum, t) => sum + t.netto, 0);
  const fileName = path.basename(filePath);
  const nomorSI = `${docxNumber}/SI/SMA-FG/${mRoman}/${tahun}`;
  const batchId = `SI-${docxNumber}-${tahun}-${mNum}`;

  return {
    id: batchId,
    nomorSI,
    tanggal: isoDate,
    tanggalFormat: tglSelesai || formatTanggalIndonesia(isoDate),
    perihal: 'Surat Perintah Pemindahbukuan (Belanja Operasional BOSP)',
    namaBank: 'Bank BJB KCP Jatiasih di Bekasi',
    rekeningSumber: noTabungan || '0120640100100',
    atasNamaSumber: 'SMAS FUTURE GATE',
    totalNominal,
    status: 'SELESAI TRANSAKSI',
    statusBadge: 'Lunas / Cair',
    catatan: `Import dari file: ${fileName}`,
    monthFolder,
    siFolder,
    transfers
  };
}

// Walk downloaded_si folder and parse all SI BJB files
const allBatches = [];

const monthFolders = fs.readdirSync(DOWNLOAD_DIR)
  .filter(f => fs.statSync(path.join(DOWNLOAD_DIR, f)).isDirectory() && !f.startsWith('.') && f !== 'manifest.json'.split('.')[0])
  .sort();

for (const monthFolder of monthFolders) {
  if (monthFolder === 'manifest.json') continue;
  const monthDir = path.join(DOWNLOAD_DIR, monthFolder);
  if (!fs.existsSync(monthDir)) continue;

  const entries = fs.readdirSync(monthDir);
  for (const entry of entries.sort()) {
    const entryPath = path.join(monthDir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Si subfolder
      const siFiles = fs.readdirSync(entryPath).sort();
      
      // Find docx number from .docx files
      let docxNumber = '';
      for (const f of siFiles) {
        const m = f.match(/^(\d+)\s+SI\s+BJB/i);
        if (m) { docxNumber = m[1]; break; }
      }

      for (const f of siFiles) {
        if (f.startsWith('SI BJB') && f.endsWith('.xlsx')) {
          const xlsxPath = path.join(entryPath, f);
          try {
            const batch = parseSIExcel(xlsxPath, monthFolder, entry, docxNumber || 'SI');
            allBatches.push(batch);
            console.log(`[OK] ${batch.nomorSI} | ${batch.tanggal} | ${f} | ${batch.transfers.length} transfers | Rp ${batch.totalNominal.toLocaleString('id-ID')}`);
          } catch (e) {
            console.error(`[FAIL] ${f}: ${e.message}`);
          }
        }
      }
    } else if (entry.startsWith('SI BJB') && entry.endsWith('.xlsx')) {
      // Direct file in month folder (shouldn't happen based on structure, but handle it)
      let docxNumber = '';
      const siblings = fs.readdirSync(monthDir);
      for (const sf of siblings) {
        const m = sf.match(/^(\d+)\s+SI\s+BJB/i);
        if (m) { docxNumber = m[1]; break; }
      }
      try {
        const batch = parseSIExcel(entryPath, monthFolder, 'ROOT', docxNumber || 'SI');
        allBatches.push(batch);
        console.log(`[OK] ${batch.nomorSI} | ${batch.tanggal} | ${entry} | ${batch.transfers.length} transfers | Rp ${batch.totalNominal.toLocaleString('id-ID')}`);
      } catch (e) {
        console.error(`[FAIL] ${entry}: ${e.message}`);
      }
    }
  }
}

// Sort chronologically by tanggal then nomorSI
allBatches.sort((a, b) => {
  if (a.tanggal !== b.tanggal) return a.tanggal.localeCompare(b.tanggal);
  // Extract doc number for secondary sort
  const aNum = parseInt(a.nomorSI.split('/')[0]);
  const bNum = parseInt(b.nomorSI.split('/')[0]);
  return aNum - bNum;
});

console.log(`\n=== FINAL RESULT: ${allBatches.length} SI Batches ===`);
allBatches.forEach((b, i) => {
  console.log(`[${i+1}] ${b.nomorSI} | ${b.tanggal} | ${b.transfers.length} trf | Rp ${b.totalNominal.toLocaleString('id-ID')}`);
});

const grandTotal = allBatches.reduce((s, b) => s + b.totalNominal, 0);
console.log(`\nGRAND TOTAL: Rp ${grandTotal.toLocaleString('id-ID')}`);

// Generate initialData.js content
const comment = `// Data Master Inisial untuk Aplikasi Bendahara BOS SMAS Future Gate
// Berdasarkan Surat Instruksi (SI) BJB dan Pagu Resmi 2026
// Menyimpan ${allBatches.length} Dokumen SI (Februari - Oktober 2026) secara permanen
// Auto-generated dari ${allBatches.length} file Excel resmi Google Drive pada ${new Date().toLocaleDateString('id-ID')}`;

// Read current initialData.js to preserve PROFIL_SEKOLAH and PAGU_DATA
const currentContent = fs.readFileSync('src/data/initialData.js', 'utf8');
const profileMatch = currentContent.match(/export const PROFIL_SEKOLAH\s*=\s*\{[\s\S]*?\};/);
const paguMatch = currentContent.match(/export const PAGU_DATA\s*=\s*\{[\s\S]*?\};/);

const profileSection = profileMatch ? profileMatch[0] : '';
const paguSection = paguMatch ? paguMatch[0] : '';

// Build SI batches (without transfers) for INITIAL_SI_BATCHES
const siBatchesForExport = allBatches.map(b => {
  const { monthFolder, siFolder, ...rest } = b;
  return rest;
});

// Build transactions from all batches
const allTransaksi = [];
allBatches.forEach(batch => {
  batch.transfers.forEach((t, i) => {
    allTransaksi.push({
      id: `TRX-${batch.id.replace('SI-', '')}-${String(i+1).padStart(2,'0')}`,
      batchId: batch.id,
      noSI: batch.nomorSI,
      tanggal: batch.tanggal,
      unitId: t.unitId,
      unitNama: t.unitNama,
      kategori: t.kategori,
      namaBarang: t.ket,
      qty: 1,
      satuan: 'paket',
      hargaSatuan: t.netto,
      totalNominal: t.netto,
      vaSiplah: t.vaSiplah,
      status: 'Sudah Ditransaksikan',
      keterangan: `Transfer SI No. ${t.no} ke ${t.atasNama || 'Penerima'} (${t.namaBank} ${t.vaSiplah || '-'}) - ${t.uraian}`
    });
  });
});

const newContent = `${comment}

${profileSection}

${paguSection}

// ${allBatches.length} Dokumen Surat Instruksi (SI) BJB yang Terverifikasi & Tersimpan Permanen
// Urutan: Februari 2026 → Oktober 2026 (kronologis berdasarkan nomor SI)
export const INITIAL_SI_BATCHES = ${JSON.stringify(siBatchesForExport, null, 2)};

export const INITIAL_TRANSAKSI_LIST = ${JSON.stringify(allTransaksi, null, 2)};
`;

fs.writeFileSync('src/data/initialData.js', newContent, 'utf8');
console.log(`\n✅ Saved src/data/initialData.js with ${allBatches.length} SI batches and ${allTransaksi.length} transactions!`);
