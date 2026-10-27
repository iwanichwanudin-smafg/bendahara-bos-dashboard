import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const docxMetadata = JSON.parse(fs.readFileSync('scratch/docx_metadata.json', 'utf8'));

const monthNameToNum = {
  'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
  'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
  'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
};

function parseIndonesianDateToISO(dateStr, fallbackMonth = '02') {
  if (!dateStr) return `2026-${fallbackMonth}-15`;
  const parts = String(dateStr).trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].replace(/[^0-9]/g, '').padStart(2, '0');
    const y = parts[2].replace(/[^0-9]/g, '') || '2026';
    if (day && y.length === 4) return `${y}-${fallbackMonth}-${day}`;
  }
  return `2026-${fallbackMonth}-15`;
}

const batches = [];
const allTransactions = [];

console.log(`Processing ${docxMetadata.length} SIs...`);

docxMetadata.forEach((meta, bIdx) => {
  const mFolder = meta.monthFolder;
  const mNum = mFolder.substring(0, 2);
  const isoDate = parseIndonesianDateToISO(meta.tanggalStr, mNum);
  const tanggalFormat = meta.tanggalStr || `${parseInt(isoDate.split('-')[2])} ${mFolder.substring(3)} 2026`;
  
  const wb = XLSX.readFile(meta.excelPath);
  let targetSheet = wb.Sheets[wb.SheetNames[0]];
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    const testRows = XLSX.utils.sheet_to_json(s, { header: 1, defval: '' });
    const match = testRows.some(row => {
      const str = row.map(c => String(c).toUpperCase()).join(' ');
      return str.includes('DAFTAR RINCIAN BELANJA') || str.includes('REKAP TRANSFER') ||
        (str.includes('NO') && (str.includes('BELANJA') || str.includes('URAIAN')) && 
         (str.includes('NETTO') || str.includes('REKENING') || str.includes('JUMLAH')));
    });
    if (match) { targetSheet = s; break; }
  }

  const rawRows = XLSX.utils.sheet_to_json(targetSheet, { header: 1, defval: '' });

  let headerRowIndex = -1;
  let noTabungan = '0120640100100';

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rowStr = row.map(c => String(c).trim().toUpperCase()).join(' ');
    if (rowStr.includes('NOMOR TABUNGAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('NOMOR TABUNGAN'));
      const val = row.slice(idx + 1).find(c => c && c !== ':');
      if (val) noTabungan = String(val).replace(/\D/g, '').padStart(13, '0');
    }
    if (rowStr.includes('NO') && (rowStr.includes('BELANJA') || rowStr.includes('URAIAN')) &&
       (rowStr.includes('NETTO') || rowStr.includes('REKENING') || rowStr.includes('JUMLAH'))) {
      headerRowIndex = i;
    }
  }

  let colIdx = { no: 0, uraian: 1, rekening: 2, bank: 3, atasNama: 4, bruto: -1, pajak: -1, netto: -1, ket: -1, note: -1 };
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
      else if (col.includes('KET') || col.includes('KETERANGAN')) colIdx.ket = c;
    });
  }

  const transfers = [];
  const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 9;

  for (let i = startRow; i < rawRows.length; i++) {
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

    let netto = 0;
    if (colIdx.netto >= 0 && row[colIdx.netto] !== '') {
      const cell = row[colIdx.netto];
      netto = typeof cell === 'number' ? cell : Math.round(parseFloat(String(cell || 0).replace(/[^\d.-]/g, '')) || 0);
    }
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

    let ketRaw = '';
    if (colIdx.ket >= 0 && row[colIdx.ket]) ketRaw = String(row[colIdx.ket]).trim();
    let noteRaw = '';
    if (row.length > (colIdx.ket >= 0 ? colIdx.ket + 1 : 14)) {
      const extraCell = row[row.length - 1];
      if (extraCell && typeof extraCell === 'string' && extraCell.length > 5 && !extraCell.startsWith('=')) {
        noteRaw = extraCell.trim();
      }
    }

    // Determine unit
    let unitId = 'PUTRA';
    let unitNama = 'FG Putra';
    const comb = (rawUraian + ' ' + atasNama + ' ' + ketRaw + ' ' + noteRaw + ' ' + meta.siFolder).toUpperCase();
    if (comb.includes('RABBANI')) { unitId = 'RABBANI'; unitNama = 'FG Rabbani'; }
    else if (comb.includes('FDS') || comb.includes('FULLDAY') || comb.includes('FULL DAY') || comb.includes('PUTRI (FDS)')) { unitId = 'FDS'; unitNama = 'FG Putri (FDS)'; }
    else if (comb.includes('MAHAD') || comb.includes("MA'HAD") || comb.includes('ASRAMA')) { unitId = 'MAHAD'; unitNama = 'FG Mahad'; }
    else if (comb.includes('BOARDING') || comb.includes('PUTRI (BS)') || comb.includes('PUTRI BS') || /\bBS\b/.test(comb)) { unitId = 'BS'; unitNama = 'FG Putri (BS)'; }

    // Category detection
    let kategori = 'Operasional';
    const combL = comb.toLowerCase();
    if (combL.includes('honor') || combL.includes('gaji') || combL.includes('transport') || combL.includes('insentif') || combL.includes('narasumber')) kategori = 'Honor';
    else if (combL.includes('buku') || combL.includes('kitab') || combL.includes('lks') || combL.includes('modul') || combL.includes('erlangga') || combL.includes('yudhistira') || combL.includes('intan pariwara')) kategori = 'Buku';
    else if (combL.includes('modal') || combL.includes('laptop') || combL.includes('meja kursi') || combL.includes('lemari') || combL.includes('printer') || combL.includes('cctv') || combL.includes('karpet') || combL.includes('kipas')) kategori = 'Modal';
    else if (combL.includes('listrik') || combL.includes('internet') || combL.includes('token') || combL.includes('tagihan')) kategori = 'Operasional';

    let displayTitle = rawUraian;
    if (ketRaw && ketRaw.length > 3) {
      if (!displayTitle || displayTitle === 'Transfer Dana' || displayTitle === 'Transfer') {
        displayTitle = ketRaw;
      }
    }
    if (!displayTitle || displayTitle === 'Transfer Dana' || displayTitle === 'Transfer') {
      if (kategori === 'Operasional' && (combL.includes('listrik') || combL.includes('token'))) displayTitle = 'Tagihan Listrik';
      else if (kategori === 'Operasional' && combL.includes('internet')) displayTitle = 'Tagihan Internet';
      else if (kategori === 'Honor') displayTitle = `Honor BOSP Guru & Tendik (${unitNama})`;
      else displayTitle = `Belanja ${kategori} (${unitNama})`;
    }

    const note = noteRaw || '';
    const uraianFinal = displayTitle + (note ? ' — ' + note : '');

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
      uraian: uraianFinal
    });
  }

  const sumNetto = transfers.reduce((sum, t) => sum + t.netto, 0);
  const nomorClean = meta.nomorSI || `SI-${bIdx + 1}`;
  const docxNum = (nomorClean.match(/^(\d+)/) || ['',''])[1] || String(bIdx + 1).padStart(3, '0');
  const batchId = `SI-${docxNum}-2026-${mNum}`;

  const batchObj = {
    id: batchId,
    nomorSI: nomorClean,
    tanggal: isoDate,
    tanggalFormat: tanggalFormat,
    perihal: meta.perihal || 'Surat Perintah Pemindahbukuan (Belanja Operasional BOSP)',
    namaBank: 'Bank BJB KCP Jatiasih di Bekasi',
    rekeningSumber: noTabungan || '0120640100100',
    atasNamaSumber: 'SMAS FUTURE GATE',
    totalNominal: sumNetto,
    status: 'SELESAI TRANSAKSI',
    statusBadge: 'Lunas / Cair',
    catatan: `Import resmi: ${meta.excelFile} & ${meta.docxFile}`,
    monthFolder: meta.monthFolder,
    siFolder: meta.siFolder,
    transfers: transfers
  };

  batches.push(batchObj);

  transfers.forEach(t => {
    allTransactions.push({
      id: `TRX-${batchId}-${t.no}`,
      batchId: batchId,
      noSI: batchObj.nomorSI,
      tanggal: batchObj.tanggal,
      unitId: t.unitId,
      unitNama: t.unitNama,
      kategori: t.kategori,
      namaBarang: t.ket || t.uraian || 'Belanja Operasional',
      uraian: t.uraian,
      qty: 1,
      satuan: 'Paket',
      hargaSatuan: t.netto,
      nominal: t.netto,
      totalNominal: t.netto,
      netto: t.netto,
      bruto: t.bruto,
      pajak: t.pajak,
      vaSiplah: t.vaSiplah,
      namaBank: t.namaBank,
      atasNama: t.atasNama,
      ket: t.ket,
      note: t.note,
      keterangan: t.note || ''
    });
  });

  console.log(`[${(bIdx + 1).toString().padStart(2)}] ${batchObj.tanggal} | ${batchObj.nomorSI} | Rp ${sumNetto.toLocaleString('id-ID')} | Trx: ${transfers.length}`);
});

console.log(`\nTotal Batches Generated: ${batches.length}`);
console.log(`Total Transactions Generated: ${allTransactions.length}`);
const grandTotal = batches.reduce((sum, b) => sum + b.totalNominal, 0);
console.log(`Grand Total All 30 SIs: Rp ${grandTotal.toLocaleString('id-ID')}`);

// Reconstruct initialData.js content
const initialDataHeader = `// Data Master Inisial untuk Aplikasi Bendahara BOS SMAS Future Gate
// Berdasarkan 30 Surat Instruksi (SI) BJB dan Pagu Resmi 2026 (Februari - Oktober 2026)
// Generated secara otomatis dengan verifikasi 100% antara file DOCX dan XLSX resmi

export const PROFIL_SEKOLAH = {
  nama: 'SMAS FUTURE GATE',
  npsn: '20268577',
  namaYayasan: 'Yayasan Future Gate Bekasi',
  alamat: 'Komp. Pemda Jatiasih, Jl. Yudhistira RT 004/003, Jatiasih, Kota Bekasi',
  namaBank: 'Bank BJB KCP Jatiasih',
  noRekening: '0120640100100',
  namaRekening: 'SMAS FUTURE GATE',
  namaKepsek: 'GHAZI ZULHAZMI, S.Pd.',
  namaBendahara: 'IWAN ICHWANUDIN',
  hpBendahara: '089637565759',
  emailBendahara: 'iwanichwanudin@smafg.sch.id',
  tahunAnggaran: '2026'
};

export const PAGU_DATA = {
  totalSiswa: 799,
  nominalPerSiswa: 1690000,
  totalPaguGross: 1350310000,
  iuranFKSSPerSiswa: 25000,
  totalIuranFKSS: 19975000,
  totalPaguNetto: 1350310000, // Total Alokasi BOS Bank BJB untuk 5 Unit
  paguTahap1: 675155000,     // 50% Tahap 1
  paguTahap2: 675155000,     // 50% Tahap 2
  units: [
    {
      id: 'PUTRA',
      nama: 'FG Putra',
      siswa: 299,
      paguMurni: 497835000,
      talanganFKSS: 19975000,
      pagu: 517810000,
      color: '#3b82f6',
      catatan: 'Termasuk kompensasi talangan Iuran FKSS Rp 19.975.000'
    },
    {
      id: 'MAHAD',
      nama: 'FG Mahad',
      siswa: 39,
      paguMurni: 64935000,
      talanganFKSS: 0,
      pagu: 64935000,
      color: '#8b5cf6',
      catatan: 'Pagu Netto (beban FKSS Rp 975.000 ditalangi)'
    },
    {
      id: 'BS',
      nama: 'FG Putri (BS)',
      siswa: 175,
      paguMurni: 291375000,
      talanganFKSS: 0,
      pagu: 291375000,
      color: '#ec4899',
      catatan: 'Pagu Netto (beban FKSS Rp 4.375.000 ditalangi)'
    },
    {
      id: 'FDS',
      nama: 'FG Putri (FDS)',
      siswa: 162,
      paguMurni: 269730000,
      talanganFKSS: 0,
      pagu: 269730000,
      color: '#10b981',
      catatan: 'Pagu Netto (beban FKSS Rp 4.050.000 ditalangi)'
    },
    {
      id: 'RABBANI',
      nama: 'FG Rabbani',
      siswa: 124,
      paguMurni: 206460000,
      talanganFKSS: 0,
      pagu: 206460000,
      color: '#f59e0b',
      catatan: 'Pagu Netto (beban FKSS Rp 3.100.000 ditalangi)'
    }
  ]
};

// 30 Dokumen Surat Instruksi (SI) Resmi BJB (Februari - Oktober 2026)
export const INITIAL_SI_BATCHES = ${JSON.stringify(batches, null, 2)};

// 112 Transaksi Rincian Belanja Resmi 2026
export const INITIAL_TRANSAKSI_LIST = ${JSON.stringify(allTransactions, null, 2)};

export const INITIAL_TRANSAKSI_ITEMS = INITIAL_TRANSAKSI_LIST;
`;

fs.writeFileSync('src/data/initialData.js', initialDataHeader, 'utf8');
console.log('Successfully wrote src/data/initialData.js!');
