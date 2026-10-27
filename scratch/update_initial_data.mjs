import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scratch/all_5_batches.json', 'utf8'));

// Clean titles and notes
raw.batches.forEach(b => {
  b.transfers.forEach(t => {
    t.ket = t.ket.replace(/\r?\n\s*/g, ' ').trim();
    if (t.note) t.note = t.note.replace(/\r?\n\s*/g, ' ').replace(/^>>>\s*/, '').trim();
    if (t.note === '4420000') t.note = '';
    t.uraian = t.ket + (t.note ? ' — ' + t.note : '');
  });
});

raw.transactions.forEach(trx => {
  trx.namaBarang = trx.namaBarang.replace(/\r?\n\s*/g, ' ').trim();
  trx.keterangan = trx.keterangan.replace(/\r?\n\s*/g, ' ').trim();
  if (trx.keterangan.endsWith('— 4420000')) {
    trx.keterangan = trx.keterangan.replace('— 4420000', '').trim();
  }
});

const content = `// Data Master Inisial untuk Aplikasi Bendahara BOS SMAS Future Gate
// Berdasarkan Surat Instruksi (SI) BJB dan Pagu Resmi 2026
// Menyimpan 5 Dokumen SI (Februari - Maret 2026) secara permanen

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
      pagu: 517810000, // Rp 497.835.000 + Rp 19.975.000 (kompensasi talangan FKSS di luar BOS)
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

// 5 Dokumen Surat Instruksi (SI) BJB yang Terverifikasi & Tersimpan Permanen
export const INITIAL_SI_BATCHES = ${JSON.stringify(raw.batches, null, 2)};

// 21 Transaksi Belanja & Pemindahbukuan yang Terkait dengan ke-5 Dokumen SI
export const INITIAL_TRANSAKSI_ITEMS = ${JSON.stringify(raw.transactions, null, 2)};
`;

fs.writeFileSync('src/data/initialData.js', content, 'utf8');
console.log('Successfully written initialData.js with 5 SI Batches and 21 Transaksi Items!');
