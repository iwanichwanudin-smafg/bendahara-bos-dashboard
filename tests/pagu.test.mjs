import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hitungRincianPagu } from '../src/lib/pagu.js';

// Data KARANGAN: iuran 1.000 per siswa. Unit P menalangi seluruh iuran.
const UNITS = [
  { id: 'P', nama: 'Unit P', siswa: 30, paguMurni: 270000, talanganFKSS: 60000, pagu: 330000 },
  { id: 'Q', nama: 'Unit Q', siswa: 20, paguMurni: 180000, talanganFKSS: 0, pagu: 180000 },
  { id: 'R', nama: 'Unit R', siswa: 10, paguMurni: 90000, talanganFKSS: 0, pagu: 90000 }
];

test('iuran tiap unit = siswa x iuran per siswa', () => {
  const { rows } = hitungRincianPagu(UNITS, 1000);
  assert.deepEqual(rows.map((r) => r.iuranFKSS), [30000, 20000, 10000]);
});

test('jatah bruto = jatah netto + iuran, dan netto = nilai tersimpan', () => {
  const { rows } = hitungRincianPagu(UNITS, 1000);
  assert.deepEqual(rows.map((r) => r.jatahBruto), [300000, 200000, 100000]);
  assert.deepEqual(rows.map((r) => r.jatahNetto), [270000, 180000, 90000]);
  for (const r of rows) assert.equal(r.jatahBruto - r.iuranFKSS, r.jatahNetto);
});

test('pagu RKAS unit penalang = netto + total iuran semua unit; unit lain = netto', () => {
  const { rows, totals, penalang } = hitungRincianPagu(UNITS, 1000);
  assert.equal(penalang.id, 'P');
  assert.equal(totals.iuranFKSS, 60000);
  assert.equal(rows[0].paguRKAS, rows[0].jatahNetto + totals.iuranFKSS);
  assert.equal(rows[1].paguRKAS, rows[1].jatahNetto);
  assert.equal(rows[2].paguRKAS, rows[2].jatahNetto);
});

test('total bruto sama dengan total pagu RKAS bila seluruh iuran ditalangi satu unit', () => {
  const { totals, selisihTalangan } = hitungRincianPagu(UNITS, 1000);
  assert.equal(totals.jatahBruto, totals.paguRKAS);
  assert.equal(selisihTalangan, 0);
});

test('selisih terdeteksi bila total iuran tidak sama dengan tambahan di unit penalang', () => {
  const salah = UNITS.map((u) => (u.id === 'P' ? { ...u, talanganFKSS: 50000, pagu: 320000 } : u));
  assert.equal(hitungRincianPagu(salah, 1000).selisihTalangan, 10000);
});

test('data kosong atau iuran 0 tidak menimbulkan error', () => {
  assert.deepEqual(hitungRincianPagu([], 1000).rows, []);
  assert.equal(hitungRincianPagu(UNITS, 0).totals.iuranFKSS, 0);
  assert.equal(hitungRincianPagu(undefined, undefined).totals.siswa, 0);
});
