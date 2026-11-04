import { test } from 'node:test';
import assert from 'node:assert/strict';
import { titleCase, initials } from '../src/lib/auth.js';

test('nama HURUF BESAR diubah menjadi huruf kapital di awal kata', () => {
  assert.equal(titleCase('IWAN ICHWANUDIN'), 'Iwan Ichwanudin');
});

test('nama yang sudah benar tidak diubah', () => {
  assert.equal(titleCase('Ghazi Zulhazmi'), 'Ghazi Zulhazmi');
});

test('nama kosong tidak menimbulkan error', () => {
  assert.equal(titleCase(''), '');
  assert.equal(titleCase(undefined), '');
});

test('inisial diambil dari dua kata pertama', () => {
  assert.equal(initials('Iwan Ichwanudin'), 'II');
  assert.equal(initials('Ghazi Zulhazmi'), 'GZ');
  assert.equal(initials('Satu'), 'S');
  assert.equal(initials(''), '?');
});
