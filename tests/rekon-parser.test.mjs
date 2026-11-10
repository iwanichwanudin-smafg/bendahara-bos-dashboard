import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { parseRekKoranSheet } from '../src/modules/rekonsiliasiModule.js';

// Meniru bentuk sheet "Rek Koran": judul, header, baris data, baris kosong bersaldo, lalu baris rekap.
// Semua angka dan uraian di sini karangan.
function bangunSheet(jumlahTransaksi, jumlahBarisKosong = 40) {
  const aoa = [['MUTASI REK BANK UJI'], ['Tgl', 'SI', 'D', 'K', 'Saldo']];
  let saldo = 1000;
  aoa.push([46022, null, 1000, null, saldo]); // saldo awal
  for (let i = 1; i <= jumlahTransaksi; i++) {
    saldo -= 10;
    aoa.push([46022 + i, `SI ${i} (Uji)`, null, 10, saldo]);
  }
  for (let i = 0; i < jumlahBarisKosong; i++) aoa.push([null, null, null, null, saldo]); // baris cadangan
  aoa.push([null, 'TOTAL MUTASI DEBIT', null, null, 1000]);
  aoa.push([null, 'TOTAL MUTASI KREDIT', null, null, jumlahTransaksi * 10]);
  aoa.push([null, 'SALDO', null, null, saldo]);
  return XLSX.utils.aoa_to_sheet(aoa);
}

test('mutasi lebih dari 43 baris terbaca semua (tidak terpotong lagi)', () => {
  const rows = parseRekKoranSheet(bangunSheet(80));
  assert.equal(rows.length, 81); // 1 saldo awal + 80 transaksi
  assert.equal(rows.at(-1).uraian, 'SI 80 (Uji)');
  assert.equal(rows.at(-1).saldo, 1000 - 80 * 10);
});

test('baris kosong bersaldo dan baris rekap tidak ikut terbaca sebagai transaksi', () => {
  const rows = parseRekKoranSheet(bangunSheet(5));
  assert.equal(rows.length, 6);
  assert.ok(rows.every((r) => !/^(TOTAL\b|SALDO\s*$)/i.test(r.uraian)));
});

test('hanya baris saldo awal tanpa transaksi lain tetap terbaca', () => {
  const rows = parseRekKoranSheet(bangunSheet(0));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].tipe, 'PENERIMAAN');
  assert.equal(rows[0].debit, 1000);
});

test('penerimaan dan pengeluaran dikenali dengan benar', () => {
  const aoa = [['x'], ['Tgl', 'SI', 'D', 'K', 'Saldo'],
    [46022, null, 500, null, 500],
    [46023, 'CAIR TAHAP 2', 900, null, 1400],
    [46024, 'Bunga bank', 5, null, 1405],
    [46025, 'SI 1 (Gaji Nov)', null, 200, 1205],
    [46026, 'SI 2 (Belanja Siplah Anggaran Nov)', null, 300, 905]];
  const rows = parseRekKoranSheet(XLSX.utils.aoa_to_sheet(aoa));
  assert.deepEqual(rows.map((r) => r.kategori),
    ['SALDO_AWAL', 'PENCAIRAN_BOS', 'BUNGA_BANK', 'GAJI_HONOR', 'BELANJA_SIPLAH']);
  assert.equal(rows.filter((r) => r.tipe === 'PENGELUARAN').length, 2);
});

test('ID baris berurutan RK-001, RK-002, dst.', () => {
  const rows = parseRekKoranSheet(bangunSheet(3));
  assert.deepEqual(rows.map((r) => r.id), ['RK-001', 'RK-002', 'RK-003', 'RK-004']);
});
