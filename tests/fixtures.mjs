// DATA UJI KARANGAN — bukan data sekolah sungguhan. Sengaja memuat kasus-kasus yang rumit.
export const UNITS = [
  { id: 'A', nama: 'Unit A', siswa: 100, paguMurni: 1000000, talanganFKSS: 0, pagu: 1000000, color: '#111111', catatan: 'uji' },
  { id: 'B', nama: 'Unit B', siswa: 50, paguMurni: 500000, talanganFKSS: 0, pagu: 500000, color: '#222222', catatan: 'uji' }
];

export function sampleBatches() {
  return [
    {
      id: 'SI-001', nomorSI: '001/SI/UJI/I/2026', tanggal: '2026-01-10', tanggalFormat: '10 Januari 2026',
      perihal: 'Surat Uji', namaBank: 'Bank Uji', rekeningSumber: '000111', atasNamaSumber: 'SEKOLAH UJI',
      totalNominal: 300000, status: 'SELESAI TRANSAKSI', statusBadge: 'Lunas / Cair', catatan: 'uji',
      monthFolder: '01 Januari', siFolder: 'SI 1 (A &amp; B)',
      transfers: [
        { no: 1, originalNo: 1, unitId: 'A', unitNama: 'Unit A', kategori: 'Operasional', vaSiplah: '111', namaBank: 'BJB',
          atasNama: 'Penerima Satu', bruto: 0, pajak: 0, netto: 100000, ket: 'Listrik\nMeteran 1 : 123', note: '',
          uraian: 'Listrik\nMeteran 1 : 123' },
        // nomor asli berbeda dari nomor urut + catatan terisi
        { no: 2, originalNo: 7, unitId: 'B', unitNama: 'Unit B', kategori: 'Modal', vaSiplah: '222', namaBank: 'BJB',
          atasNama: 'Penerima Dua', bruto: 200000, pajak: 0, netto: 200000, ket: 'Kursi', note: '6 unit\t@ 33.333',
          uraian: 'Kursi — 6 unit\t@ 33.333' }
      ]
    },
    {
      id: 'SI-002', nomorSI: '002/SI/UJI/II/2026', tanggal: '2026-02-10', tanggalFormat: '10 Februari 2026',
      perihal: 'Surat Uji', namaBank: 'Bank Uji', rekeningSumber: '000111', atasNamaSumber: 'SEKOLAH UJI',
      totalNominal: 50000, status: 'SELESAI TRANSAKSI', statusBadge: 'Lunas / Cair', catatan: 'uji',
      monthFolder: '02 Februari', siFolder: 'SI 2',
      transfers: [
        { no: 1, originalNo: 1, unitId: 'A', unitNama: 'Unit A', kategori: 'Honor', vaSiplah: '333', namaBank: 'BJB',
          atasNama: 'Penerima Tiga', bruto: 0, pajak: 0, netto: 50000, ket: 'Honor Februari', note: '', uraian: 'Honor Februari' }
      ]
    }
  ];
}

// Transaksi yang diturunkan dari transfer SI, sama seperti yang dibuat aplikasi saat impor SI
export function sampleTransaksi(batches) {
  return batches.flatMap((b) => b.transfers.map((t) => ({
    id: `TRX-${b.id}-${t.no}`, batchId: b.id, noSI: b.nomorSI, tanggal: b.tanggal,
    unitId: t.unitId, unitNama: t.unitNama, kategori: t.kategori, namaBarang: t.ket, uraian: t.uraian,
    qty: 1, satuan: 'Paket', hargaSatuan: t.netto, nominal: t.netto, totalNominal: t.netto, netto: t.netto,
    bruto: t.netto, pajak: t.pajak, vaSiplah: t.vaSiplah, namaBank: t.namaBank, atasNama: t.atasNama,
    ket: t.ket, note: t.note, keterangan: t.note || t.uraian
  })));
}

// Transaksi manual: tidak punya batchId/netto/pajak dan membawa field tambahan (status)
export const MANUAL_TRANSAKSI = {
  id: 'TRX-12345', noSI: '001/SI/UJI/I/2026', tanggal: '2026-03-05', unitId: 'A', unitNama: 'Unit A',
  kategori: 'Operasional', namaBarang: 'Kertas A4', qty: 2, satuan: 'rim', hargaSatuan: 50000,
  totalNominal: 100000, vaSiplah: '-', status: 'Sudah Ditransaksikan', keterangan: 'uji manual'
};

export function sampleRekKoran() {
  return [
    { id: 'RK-001', rowIndex: 3, serialDate: 46022, tanggal: '2025-12-31', uraian: 'Saldo Awal', tipe: 'PENERIMAAN',
      kategori: 'SALDO_AWAL', debit: 1000000, kredit: 0, saldo: 1000000 },
    // serialDate kosong (null) harus tetap null
    { id: 'RK-002', rowIndex: 4, serialDate: null, tanggal: '2026-01-10', uraian: 'SI 1 (Uji)', tipe: 'PENGELUARAN',
      kategori: 'BELANJA_SIPLAH', debit: 0, kredit: 300000, saldo: 700000 }
  ];
}
