import { parseSIFile } from './generate_all_si_batches.mjs';
import fs from 'fs';

const fFeb1 = parseSIFile('public/samples/SI_BJB_BOSP_Februari_1.xlsx', 'SI BJB - BOSP (Februari 1).xlsx', '431/SI/SMA-FG/II/2026');
const fFeb2 = parseSIFile('C:/Users/smafu/Downloads/SI BJB - BOSP (Februari 2) (1).xlsx', 'SI BJB - BOSP (Februari 2).xlsx', '432/SI/SMA-FG/II/2026');
const fMar1 = parseSIFile('C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 1).xlsx', 'SI BJB - BOSP (Maret 1).xlsx', '433/SI/SMA-FG/III/2026');
const fMar2 = parseSIFile('C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 2).xlsx', 'SI BJB - BOSP (Maret 2).xlsx', '434/SI/SMA-FG/III/2026');
const fMar3 = parseSIFile('C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 3).xlsx', 'SI BJB - BOSP (Maret 3).xlsx', '435/SI/SMA-FG/III/2026');

const batches = [
  { id: 'SI-431-2026-02', ...fFeb1 },
  { id: 'SI-432-2026-02', ...fFeb2 },
  { id: 'SI-433-2026-03', ...fMar1 },
  { id: 'SI-434-2026-03', ...fMar2 },
  { id: 'SI-435-2026-03', ...fMar3 }
];

const transactions = [];
batches.forEach(b => {
  b.transfers.forEach((t, idx) => {
    transactions.push({
      id: `TRX-${b.id.replace('SI-', '')}-${String(idx + 1).padStart(2, '0')}`,
      batchId: b.id,
      noSI: b.nomorSI,
      tanggal: b.tanggal,
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
      keterangan: t.uraian || t.ket
    });
  });
});

console.log('Total Batches:', batches.length);
console.log('Total Transactions:', transactions.length);
console.log('Total Nominal SI:', batches.reduce((sum, b) => sum + b.totalNominal, 0));

fs.writeFileSync('scratch/all_5_batches.json', JSON.stringify({ batches, transactions }, null, 2));
