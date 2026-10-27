import fs from 'fs';
import { INITIAL_SI_BATCHES, INITIAL_TRANSAKSI_LIST, PAGU_DATA, PROFIL_SEKOLAH } from '../src/data/initialData.js';

const batches = JSON.parse(JSON.stringify(INITIAL_SI_BATCHES));

batches.forEach(b => {
  if (b.id === 'SI-106-2026-09') {
    b.transfers = [
      {
        no: 1,
        originalNo: 1,
        unitId: 'PUTRA',
        unitNama: 'FG Putra',
        kategori: 'Operasional',
        vaSiplah: '7167187492',
        namaBank: 'BJB',
        atasNama: 'Ajri Mauludi',
        bruto: 0,
        pajak: 0,
        netto: 8125570,
        ket: 'Tagihan Listrik September\nListrik Meteran 1 : 547102593529\nListrik Meteran 2 :  547301354404',
        note: '',
        uraian: 'Tagihan Listrik September\nListrik Meteran 1 : 547102593529\nListrik Meteran 2 :  547301354404'
      },
      {
        no: 2,
        originalNo: 2,
        unitId: 'FDS',
        unitNama: 'FG Putri (FDS)',
        kategori: 'Operasional',
        vaSiplah: '7167187492',
        namaBank: 'BJB',
        atasNama: 'Ajri Mauludi',
        bruto: 0,
        pajak: 0,
        netto: 1050000,
        ket: 'Internet Biznet September (FDS)',
        note: '',
        uraian: 'Internet Biznet September (FDS)'
      },
      {
        no: 3,
        originalNo: 2,
        unitId: 'FDS',
        unitNama: 'FG Putri (FDS)',
        kategori: 'Operasional',
        vaSiplah: '7167187492',
        namaBank: 'BJB',
        atasNama: 'Ajri Mauludi',
        bruto: 0,
        pajak: 0,
        netto: 1503000,
        ket: 'Internet Biznet September & Pemasangan (FDS)',
        note: '',
        uraian: 'Internet Biznet September & Pemasangan (FDS)'
      },
      {
        no: 4,
        originalNo: 3,
        unitId: 'FDS',
        unitNama: 'FG Putri (FDS)',
        kategori: 'Operasional',
        vaSiplah: '7167187492',
        namaBank: 'BJB',
        atasNama: 'Ajri Mauludi',
        bruto: 0,
        pajak: 0,
        netto: 3850000,
        ket: 'Token Listrik FDS September\n 3 x 1.000.000 + 500.000 + 300.000 (No ID Token : 32902726135)',
        note: '',
        uraian: 'Token Listrik FDS September\n 3 x 1.000.000 + 500.000 + 300.000 (No ID Token : 32902726135)'
      }
    ];
  }
});

// Re-generate all transactions
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

const unitTotals = { PUTRA: 0, MAHAD: 0, BS: 0, FDS: 0, RABBANI: 0 };
allTransactions.forEach(t => unitTotals[t.unitId] += t.nominal);
console.log('Unit Totals after user revision:');
console.log(unitTotals);

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
console.log('Updated ./src/data/initialData.js successfully!');
