import XLSX from 'xlsx';
import fs from 'fs';

function parseIndonesianDateToISO(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  const months = {
    januari: '01', februari: '02', maret: '03', april: '04',
    mei: '05', juni: '06', juli: '07', agustus: '08',
    september: '09', oktober: '10', november: '11', desember: '12'
  };
  const parts = String(dateStr).trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1].toLowerCase()] || '02';
    const year = parts[2];
    if (!isNaN(parseInt(year)) && !isNaN(parseInt(day))) {
      return `${year}-${month}-${day}`;
    }
  }
  return new Date().toISOString().slice(0, 10);
}

function parseSIExcel(buffer, fileName) {
  const wb = XLSX.read(buffer, { type: 'buffer' });
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

  for (let i = rawRows.length - 1; i >= 0; i--) {
    const row = rawRows[i];
    for (const cell of row) {
      const cStr = String(cell).trim();
      if (cStr.toLowerCase().includes('lunas dibayar')) {
        tglSelesai = cStr.replace(/lunas dibayar/i, '').trim();
      }
      if (cStr.toLowerCase().includes('ghazi')) kepsek = cStr;
      if (cStr.toLowerCase().includes('iwan')) bendahara = cStr;
    }
  }

  let colIdxNo = 0;
  let colIdxBelanja = 1;
  let colIdxRekening = 2;
  let colIdxBank = 3;
  let colIdxAtasNama = 4;
  let colIdxIdPelanggan = 5;
  let colIdxNetto = 13;
  let colIdxKet = 14;

  if (headerRowIndex >= 0) {
    const hRow = rawRows[headerRowIndex].map(c => String(c).trim().toUpperCase());
    hRow.forEach((c, idx) => {
      if (c === 'NO' || c === 'NO.') colIdxNo = idx;
      else if (c.includes('BELANJA') || c.includes('URAIAN')) colIdxBelanja = idx;
      else if (c.includes('REKENING') || c.includes('NO REK') || c.includes('VA')) colIdxRekening = idx;
      else if (c.includes('BANK')) colIdxBank = idx;
      else if (c.includes('ATAS NAMA') || c.includes('PENERIMA')) colIdxAtasNama = idx;
      else if (c.includes('ID PELANGGAN')) colIdxIdPelanggan = idx;
      else if (c === 'NETTO' || c.includes('JUMLAH NETTO')) colIdxNetto = idx;
      else if (c.includes('KET') || c.includes('KETERANGAN')) colIdxKet = idx;
    });
    if (colIdxNetto === 13 && !hRow[13]?.includes('NETTO')) {
      const totIdx = hRow.findIndex(c => c.includes('NETTO') || c === 'TOTAL' || c.includes('JUMLAH'));
      if (totIdx >= 0) colIdxNetto = totIdx;
    }
  }

  const transfers = [];
  const startRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 9;
  for (let i = startRow; i < rawRows.length; i++) {
    const row = rawRows[i];
    const firstCell = String(row[0] || '').trim().toUpperCase();
    const secondCell = String(row[1] || '').trim().toUpperCase();

    if (firstCell === 'TOTAL' || secondCell === 'TOTAL') break;

    const noVal = parseInt(firstCell);
    if (!isNaN(noVal) && noVal > 0) {
      const jenisBelanja = String(row[colIdxBelanja] || 'Transfer').trim();
      const rekening = String(row[colIdxRekening] || '').trim();
      const bank = String(row[colIdxBank] || 'BJB').trim();
      const atasNama = String(row[colIdxAtasNama] || '').trim();
      const idPelanggan = String(row[colIdxIdPelanggan] || '-').trim();

      let netto = 0;
      if (typeof row[colIdxNetto] === 'number') netto = row[colIdxNetto];
      else if (row[colIdxNetto]) netto = Number(String(row[colIdxNetto]).replace(/[^0-9.-]+/g, '')) || 0;
      else if (typeof row[13] === 'number') netto = row[13];
      else if (row[13]) netto = Number(String(row[13]).replace(/[^0-9.-]+/g, '')) || 0;
      else if (typeof row[11] === 'number') netto = row[11];
      else if (row[11]) netto = Number(String(row[11]).replace(/[^0-9.-]+/g, '')) || 0;

      const ket = String(row[colIdxKet] || row[14] || '').trim();
      const note = String(row[colIdxKet + 1] || row[15] || '').trim();

      let unitId = 'PUTRA';
      let unitNama = 'FG Putra';
      const combinedText = (ket + ' ' + note + ' ' + atasNama + ' ' + jenisBelanja).toLowerCase();
      if (combinedText.includes('rabbani')) {
        unitId = 'RABBANI'; unitNama = 'FG Rabbani';
      } else if (combinedText.includes('fds') || combinedText.includes('fullday')) {
        unitId = 'FDS'; unitNama = 'FG Putri (FDS)';
      } else if (combinedText.includes('mahad') || combinedText.includes('asrama')) {
        unitId = 'MAHAD'; unitNama = 'FG Mahad';
      } else if (combinedText.includes('putri (bs)') || combinedText.includes('(bs)') || combinedText.includes(' bs') || combinedText.includes('boarding')) {
        unitId = 'BS'; unitNama = 'FG Putri (BS)';
      } else if (combinedText.includes('putra')) {
        unitId = 'PUTRA'; unitNama = 'FG Putra';
      }

      let kategori = 'Operasional';
      if (combinedText.includes('modal') || combinedText.includes('aset') || combinedText.includes('manekin') || combinedText.includes('printer') || combinedText.includes('cctv') || combinedText.includes('karpet') || combinedText.includes('laptop') || combinedText.includes('meja') || combinedText.includes('kursi') || combinedText.includes('monitor') || combinedText.includes('keyboard')) {
        kategori = 'Modal';
      } else if (combinedText.includes('buku') || combinedText.includes('kitab') || combinedText.includes('lks') || combinedText.includes('modul')) {
        kategori = 'Buku';
      } else if (combinedText.includes('honor') || combinedText.includes('gaji') || combinedText.includes('insentif') || combinedText.includes('narasumber')) {
        kategori = 'Honor';
      }

      let displayTitle = ket;
      if (!displayTitle || displayTitle.toLowerCase() === 'transfer' || displayTitle.toLowerCase() === 'transfer dana') {
        displayTitle = `Belanja ${kategori} (${unitNama})`;
      }

      transfers.push({
        no: noVal,
        jenisBelanja,
        rekening,
        namaBank: bank,
        atasNama,
        idPelanggan,
        netto,
        kategori,
        unitId,
        unitNama,
        ket: displayTitle,
        note,
        uraian: displayTitle + (note ? ' — ' + note.replace(/^>>>\s*/, '') : '')
      });
    }
  }

  const totalNominal = transfers.reduce((sum, t) => sum + t.netto, 0);

  return {
    fileName,
    bulan: bulan || 'Februari',
    tahun: tahun || '2026',
    tglSelesai,
    isoDate: parseIndonesianDateToISO(tglSelesai),
    transfersCount: transfers.length,
    totalNominal,
    transfers
  };
}

const allFiles = [
  { p: 'public/samples/SI_BJB_BOSP_Februari_1.xlsx', name: 'SI BJB - BOSP (Februari 1).xlsx' },
  { p: 'C:/Users/smafu/Downloads/SI BJB - BOSP (Februari 2) (1).xlsx', name: 'SI BJB - BOSP (Februari 2) (1).xlsx' },
  { p: 'C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 1).xlsx', name: 'SI BJB - BOSP (Maret 1).xlsx' },
  { p: 'C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 2).xlsx', name: 'SI BJB - BOSP (Maret 2).xlsx' },
  { p: 'C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 3).xlsx', name: 'SI BJB - BOSP (Maret 3).xlsx' }
];

for (const item of allFiles) {
  if (fs.existsSync(item.p)) {
    const res = parseSIExcel(fs.readFileSync(item.p), item.name);
    console.log(`\n========================================`);
    console.log(`File: ${res.fileName}`);
    console.log(`Bulan: ${res.bulan} | Tanggal: ${res.tglSelesai} (${res.isoDate})`);
    console.log(`Total: Rp ${res.totalNominal.toLocaleString('id-ID')} | Transfers: ${res.transfersCount}`);
    res.transfers.forEach(t => {
      console.log(`  #${t.no} [${t.unitNama} / ${t.kategori}] Rp ${t.netto.toLocaleString('id-ID')} - ${t.ket.slice(0, 50)}`);
    });
  }
}
