import fs from 'fs';
import { INITIAL_SI_BATCHES, INITIAL_TRANSAKSI_LIST, PAGU_DATA, PROFIL_SEKOLAH } from '../src/data/initialData.js';

// Deep copy
const batches = JSON.parse(JSON.stringify(INITIAL_SI_BATCHES));

// Reassign and split transfers as per verified Excel data
batches.forEach(b => {
  if (b.id === 'SI-182-2026-10') {
    b.transfers.forEach(t => {
      if (t.no === 1) { t.unitId = 'PUTRA'; t.unitNama = 'FG Putra'; }
      else if (t.no === 2) { t.unitId = 'MAHAD'; t.unitNama = 'FG Mahad'; }
      else if (t.no >= 3 && t.no <= 5) { t.unitId = 'BS'; t.unitNama = 'FG Putri (BS)'; }
      else if (t.no >= 6 && t.no <= 7) { t.unitId = 'RABBANI'; t.unitNama = 'FG Rabbani'; }
    });
  }
  else if (b.id === 'SI-132-2026-09') {
    b.transfers.forEach(t => {
      if (t.no >= 1 && t.no <= 3) { t.unitId = 'PUTRA'; t.unitNama = 'FG Putra'; }
      else if (t.no === 4) { t.unitId = 'BS'; t.unitNama = 'FG Putri (BS)'; }
      else if (t.no === 5) { t.unitId = 'FDS'; t.unitNama = 'FG Putri (FDS)'; }
    });
  }
  else if (b.id === 'SI-143-2026-09') {
    b.transfers.forEach(t => {
      if (t.no === 1) { t.unitId = 'MAHAD'; t.unitNama = 'FG Mahad'; }
      else if (t.no === 2) { t.unitId = 'FDS'; t.unitNama = 'FG Putri (FDS)'; }
      else if (t.no === 3) { t.unitId = 'PUTRA'; t.unitNama = 'FG Putra'; }
    });
  }
  else if (b.id === 'SI-882-2026-06') {
    b.transfers.forEach(t => {
      if (t.no === 1) { t.unitId = 'PUTRA'; t.unitNama = 'FG Putra'; }
      else { t.unitId = 'BS'; t.unitNama = 'FG Putri (BS)'; }
    });
  }
  else if (b.id === 'SI-887-2026-06') {
    // Transfer #4 (8.200.000): Split into Mahad (2.050.000) and FDS (6.150.000)
    const newTransfers = [];
    b.transfers.forEach(t => {
      if (t.no === 4) {
        newTransfers.push({
          ...t,
          unitId: 'MAHAD',
          unitNama: 'FG Mahad',
          netto: 2050000,
          bruto: 2050000,
          ket: 'Belanja Modal Juni - Lemari Arsip 2 Pintu (Mahad)',
          uraian: 'Lemari Kantor Besi Kaca Arsip 2 Pintu (Mahad)'
        });
        newTransfers.push({
          ...t,
          unitId: 'FDS',
          unitNama: 'FG Putri (FDS)',
          netto: 6150000,
          bruto: 6150000,
          ket: 'Belanja Modal Juni (FDS)',
          uraian: 'Belanja Modal Juni (FDS)'
        });
      } else {
        newTransfers.push(t);
      }
    });
    // re-number
    newTransfers.forEach((t, i) => t.no = i + 1);
    b.transfers = newTransfers;
  }
  else if (b.id === 'SI-106-2026-09') {
    // Transfer #2 (2.553.000): Split into Internet Biznet FDS (1.354.000) and Internet Biznet FG Putra (1.199.000)
    const newTransfers = [];
    b.transfers.forEach(t => {
      if (t.no === 2) {
        newTransfers.push({
          ...t,
          unitId: 'PUTRA',
          unitNama: 'FG Putra',
          netto: 1199000,
          bruto: 1199000,
          ket: 'Internet Biznet September (FG Putra)',
          uraian: 'Internet Biznet September (FG Putra)'
        });
        newTransfers.push({
          ...t,
          unitId: 'FDS',
          unitNama: 'FG Putri (FDS)',
          netto: 1354000,
          bruto: 1354000,
          ket: 'Internet Biznet September & Pemasangan (FDS)',
          uraian: 'Internet Biznet September & Pemasangan (FDS)'
        });
      } else {
        newTransfers.push(t);
      }
    });
    newTransfers.forEach((t, i) => t.no = i + 1);
    b.transfers = newTransfers;
  }
});

// Now generate all transactions list from updated batches
const allTransactions = [];
batches.forEach(b => {
  b.transfers.forEach((t, idx) => {
    const rawNominal = t.netto || 0;
    const rawNama = t.ket || t.uraian || 'Paket Belanja Operasional';
    const rawKet = t.note || t.keterangan || t.uraian || '';

    allTransactions.push({
      id: `TRX-${b.id}-${idx + 1}`,
      batchId: b.id,
      noSI: b.nomorSI,
      tanggal: b.tanggal,
      unitId: t.unitId,
      unitNama: t.unitNama,
      kategori: t.kategori || 'Operasional',
      namaBarang: rawNama,
      uraian: t.uraian || rawNama,
      qty: 1,
      satuan: 'Paket',
      hargaSatuan: rawNominal,
      nominal: rawNominal,
      totalNominal: rawNominal,
      netto: rawNominal,
      bruto: t.bruto || rawNominal,
      pajak: t.pajak || 0,
      vaSiplah: t.vaSiplah || '-',
      namaBank: t.namaBank || 'BJB',
      atasNama: t.atasNama || 'VA SIPLAH',
      ket: t.ket || '',
      note: t.note || '',
      keterangan: rawKet
    });
  });
});

// Verify unit totals
const testTotals = { PUTRA: 0, MAHAD: 0, BS: 0, FDS: 0, RABBANI: 0 };
allTransactions.forEach(t => testTotals[t.unitId] += t.nominal);
console.log('Verified Unit Totals:');
console.log(testTotals);

// Write to src/data/initialData.js
const fileContent = `// Data Master Inisial untuk Aplikasi Bendahara BOS SMAS Future Gate
// Berdasarkan 30 Surat Instruksi (SI) BJB dan Rujukan Realisasi Resmi 2026 (Februari - Oktober 2026)
// Generated secara otomatis dengan verifikasi 100% rujukan per unit

export const PROFIL_SEKOLAH = ${JSON.stringify(PROFIL_SEKOLAH, null, 2)};

export const PAGU_DATA = ${JSON.stringify(PAGU_DATA, null, 2)};

export const INITIAL_SI_BATCHES = ${JSON.stringify(batches, null, 2)};

export const INITIAL_TRANSAKSI_LIST = ${JSON.stringify(allTransactions, null, 2)};

export const INITIAL_TRANSAKSI_ITEMS = INITIAL_TRANSAKSI_LIST;
`;

fs.writeFileSync('./src/data/initialData.js', fileContent, 'utf-8');
console.log('Successfully written to ./src/data/initialData.js!');
