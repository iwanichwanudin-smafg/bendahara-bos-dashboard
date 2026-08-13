import fs from 'fs';

const arkasCategories = [
  { name: 'Barang', pct: 34.70, amount: 468618023, color: '#a7f3d0' },
  { name: 'Modal Peralatan Mesin', pct: 21.77, amount: 293880800, color: '#fbcfe8' },
  { name: 'Modal Aset Tetap Lainnya (Buku)', pct: 16.05, amount: 216750000, color: '#bae6fd' },
  { name: 'Honorarium', pct: 14.11, amount: 190489177, color: '#c7d2fe' },
  { name: 'Jasa', pct: 10.55, amount: 142458000, color: '#fed7aa' },
  { name: 'Pemeliharaan', pct: 2.82, amount: 38075000, color: '#fecdd3' },
  { name: 'Perjalanan Dinas', pct: 0.00, amount: 0, color: '#fef08a' },
  { name: 'Belum Dianggarkan', pct: 0.00, amount: 0, color: '#e2e8f0' }
];

const totalArkas = arkasCategories.reduce((a, b) => a + b.amount, 0);
console.log('Total ARKAS Kategori Belanja:', totalArkas.toLocaleString('id-ID'));

const arkasSNP = [
  { code: '02.', name: 'Pengembangan Standar Isi', amount: 7435000 },
  { code: '03.', name: 'Standar Proses', amount: 4795000 },
  { code: '04.', name: 'Standar Tenaga Kependidikan', amount: 0 },
  { code: '05.', name: 'Standar Sarana dan Prasarana', amount: 521999800 },
  { code: '06.', name: 'Standar Pengelolaan', amount: 621241023 },
  { code: '07.', name: 'Pengembangan Standar Pembiayaan', amount: 190489177 },
  { code: '08.', name: 'Standar Penilaian Pendidikan', amount: 4350000 }
];

const totalSNP = arkasSNP.reduce((a, b) => a + b.amount, 0);
console.log('Total ARKAS SNP:', totalSNP.toLocaleString('id-ID'));
