import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hitungBelanjaPerUnit, nominalItem, warnaAman, WARNA_UNIT_CADANGAN } from '../src/lib/visualUnit.js';

// Data KARANGAN
const UNITS = [
  { id: 'A', nama: 'Unit A', siswa: 100, pagu: 1000 },
  { id: 'B', nama: 'Unit B', siswa: 50, pagu: 500 }
];
const TRX = [
  { id: 1, unitId: 'A', kategori: 'Operasional', totalNominal: 100 },
  { id: 2, unitId: 'A', kategori: 'operasional', totalNominal: 50 },   // huruf kecil tetap terhitung
  { id: 3, unitId: 'A', kategori: 'Modal', nominal: 200 },            // memakai kolom nominal
  { id: 4, unitId: 'A', kategori: 'Buku', netto: 150 },               // memakai kolom netto
  { id: 5, unitId: 'A', kategori: 'Honor', totalNominal: 100 },
  { id: 6, unitId: 'B', kategori: 'Buku', totalNominal: 300 }
];

test('belanja per kategori dijumlahkan dengan benar per unit', () => {
  const [a, b] = hitungBelanjaPerUnit(UNITS, TRX);
  assert.deepEqual(a.kategori.map((k) => k.total), [150, 200, 150, 100]);
  assert.equal(a.realisasi, 600);
  assert.deepEqual(b.kategori.map((k) => k.total), [0, 0, 300, 0]);
});

test('total kategori + lainnya selalu sama dengan realisasi unit', () => {
  for (const u of hitungBelanjaPerUnit(UNITS, TRX)) {
    const sumKategori = u.kategori.reduce((acc, k) => acc + k.total, 0);
    assert.equal(sumKategori + u.lainnya.total, u.realisasi, u.id);
  }
});

test('belanja berkategori tak dikenal atau kosong masuk ke "lainnya", tidak hilang', () => {
  const trx = [...TRX, { id: 7, unitId: 'B', kategori: 'Jasa', totalNominal: 40 }, { id: 8, unitId: 'B', totalNominal: 10 }];
  const b = hitungBelanjaPerUnit(UNITS, trx)[1];
  assert.equal(b.lainnya.total, 50);
  assert.equal(b.lainnya.jumlahItem, 2);
  assert.equal(b.realisasi, 350);
});

test('sisa, serapan, dan persen per kategori benar', () => {
  const a = hitungBelanjaPerUnit(UNITS, TRX)[0];
  assert.equal(a.sisa, 400);
  assert.equal(a.persenSerapan, 60);
  assert.deepEqual(a.kategori.map((k) => k.persen), [25, 33.3, 25, 16.7]);
});

test('unit tanpa transaksi: semua nol, tanpa pembagian dengan nol', () => {
  const [a] = hitungBelanjaPerUnit(UNITS, []);
  assert.equal(a.realisasi, 0);
  assert.equal(a.persenSerapan, 0);
  assert.ok(a.kategori.every((k) => k.total === 0 && k.persen === 0));
  assert.equal(a.sisa, 1000);
});

test('pagu 0 dan data kosong tidak menimbulkan error', () => {
  assert.equal(hitungBelanjaPerUnit([{ id: 'X', nama: 'X', siswa: 0, pagu: 0 }], TRX)[0].persenSerapan, 0);
  assert.deepEqual(hitungBelanjaPerUnit(undefined, undefined), []);
});

test('nominalItem mengikuti aturan Dashboard (totalNominal, lalu nominal, lalu netto)', () => {
  assert.equal(nominalItem({ totalNominal: 5, nominal: 6, netto: 7 }), 5);
  assert.equal(nominalItem({ nominal: 6, netto: 7 }), 6);
  assert.equal(nominalItem({ netto: 7 }), 7);
  assert.equal(nominalItem({}), 0);
  assert.equal(nominalItem(null), 0);
});

test('warna identitas unit dibawa dan hanya format hex yang diterima', () => {
  const [a, b] = hitungBelanjaPerUnit([
    { id: 'A', nama: 'A', siswa: 1, pagu: 1, color: '#3b82f6' },
    { id: 'B', nama: 'B', siswa: 1, pagu: 1, color: 'red;"><script>' }
  ], []);
  assert.equal(a.warna, '#3b82f6');
  assert.equal(b.warna, WARNA_UNIT_CADANGAN);
  assert.equal(warnaAman('#fff'), '#fff');
  assert.equal(warnaAman(undefined), WARNA_UNIT_CADANGAN);
  assert.equal(warnaAman('#12345'), WARNA_UNIT_CADANGAN);
});
