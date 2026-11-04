import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createMockClient } from './mock_supabase.mjs';
import { UNITS, sampleBatches, sampleTransaksi, sampleRekKoran, MANUAL_TRANSAKSI } from './fixtures.mjs';
import { __useClientForTests, loadAll, saveSI, saveRekKoran, createSyncQueue } from '../src/lib/repository.js';

const clone = (x) => JSON.parse(JSON.stringify(x));
let db;

// Isi tabel referensi (di produksi sudah ada di database), lalu simpan data uji
async function seed() {
  db.tables.profil_sekolah = [{ id: 1, nama: 'Sekolah Uji', npsn: '12345678', tahun_anggaran: 2026 }];
  db.tables.rekening_bank = [{ id: 1 }];
  db.tables.pagu_tahunan = [{ tahun: 2026, total_siswa: 150 }];
  db.tables.pagu_unit = UNITS.map((u, i) => ({
    id: u.id, tahun: 2026, urutan: i + 1, nama: u.nama, siswa: u.siswa, pagu_murni: u.paguMurni,
    talangan_fkss: u.talanganFKSS, pagu: u.pagu, warna: u.color, catatan: u.catatan
  }));
  // loadAll pada database kosong mereset catatan perubahan internal (snapshot) modul
  await loadAll();
  const batches = sampleBatches();
  await saveSI(batches, sampleTransaksi(batches));
  await saveRekKoran(sampleRekKoran());
}

beforeEach(async () => {
  db = createMockClient();
  __useClientForTests(db.client);
  await seed();
  await loadAll(); // sinkronkan snapshot dengan isi database
  db.stats.writes = 0;
});

test('data yang disimpan lalu dimuat kembali identik dengan aslinya', async () => {
  const state = await loadAll();
  const batches = sampleBatches();
  assert.deepEqual(state.siBatches, batches);
  assert.deepEqual(state.transaksi, sampleTransaksi(batches));
  assert.deepEqual(state.rekKoran, sampleRekKoran());
});

test('total nominal setiap SI sama dengan jumlah transfernya', async () => {
  const { siBatches } = await loadAll();
  for (const b of siBatches) {
    assert.equal(b.totalNominal, b.transfers.reduce((a, t) => a + t.netto, 0), b.id);
  }
});

test('menyimpan ulang tanpa perubahan tidak menulis apa pun ke server', async () => {
  const s = await loadAll();
  await saveSI(s.siBatches, s.transaksi);
  await saveRekKoran(s.rekKoran);
  assert.equal(db.stats.writes, 0);
});

test('mengubah satu transaksi hanya menulis satu kali', async () => {
  const s = await loadAll();
  s.transaksi[0].netto += 1000;
  await saveSI(s.siBatches, s.transaksi);
  assert.equal(db.stats.writes, 1);
  assert.equal(db.tables.transaksi.find((r) => r.id === s.transaksi[0].id).netto, s.transaksi[0].netto);
});

test('transaksi manual (field tidak lengkap + field tambahan) kembali persis sama', async () => {
  const s = await loadAll();
  await saveSI(s.siBatches, [MANUAL_TRANSAKSI, ...s.transaksi]);
  const again = await loadAll();
  assert.deepEqual(again.transaksi.find((t) => t.id === 'TRX-12345'), MANUAL_TRANSAKSI);
});

test('menghapus satu SI ikut menghapus transfer dan transaksinya saja', async () => {
  const s = await loadAll();
  await saveSI(s.siBatches.filter((b) => b.id !== 'SI-001'), s.transaksi.filter((t) => t.batchId !== 'SI-001'));
  const again = await loadAll();
  assert.deepEqual(again.siBatches.map((b) => b.id), ['SI-002']);
  assert.ok(again.transaksi.every((t) => t.batchId === 'SI-002'));
  assert.ok(db.tables.si_transfers.every((t) => t.batch_id === 'SI-002'));
});

test('mengubah rincian transfer satu SI tidak menyentuh SI lain', async () => {
  const s = await loadAll();
  s.siBatches[0].transfers.pop();
  s.siBatches[0].totalNominal = 100000;
  await saveSI(s.siBatches, s.transaksi);
  const again = await loadAll();
  assert.equal(again.siBatches[0].transfers.length, 1);
  assert.deepEqual(again.siBatches[1], sampleBatches()[1]);
});

test('penghapusan semua SI mengosongkan tabel terkait', async () => {
  await saveSI([], []);
  const again = await loadAll();
  assert.equal(again.siBatches.length, 0);
  assert.equal(again.transaksi.length, 0);
  assert.equal(db.tables.si_transfers.length, 0);
});

test('mutasi rekening: serialDate kosong tetap null, perubahan hanya menulis baris yang berubah', async () => {
  const s = await loadAll();
  assert.equal(s.rekKoran[1].serialDate, null);
  s.rekKoran[0].saldo = 1234;
  await saveRekKoran(s.rekKoran);
  assert.equal(db.stats.writes, 1);
});

test('antrean: banyak perubahan beruntun digabung menjadi satu sinkronisasi', async () => {
  const s = await loadAll();
  const statuses = [];
  const queue = createSyncQueue((st) => statuses.push(st));
  for (let i = 0; i < 5; i++) {
    s.transaksi[0].netto += 1;
    queue.scheduleSI(s.siBatches, s.transaksi);
  }
  await queue.flush();
  assert.equal(statuses.at(-1), 'saved');
  assert.equal(db.stats.writes, 1);
});

test('kasus gagal: error server dilaporkan dan perubahan dicoba lagi pada simpan berikutnya', async () => {
  const s = await loadAll();
  const events = [];
  const queue = createSyncQueue((st, msg) => events.push([st, msg]));

  s.transaksi[0].netto += 500;
  db.stats.failNextWrite = 'koneksi terputus';
  queue.scheduleSI(s.siBatches, s.transaksi);
  await queue.flush();
  assert.equal(events.at(-1)[0], 'error');
  assert.match(events.at(-1)[1], /koneksi terputus/);
  assert.equal(queue.hasPending(), true); // perubahan belum hilang

  await queue.flush(); // tidak ada pekerjaan baru yang dijadwalkan ulang oleh pengguna
  queue.scheduleSI(s.siBatches, s.transaksi); // pengguna menyimpan lagi
  await queue.flush();
  assert.equal(events.at(-1)[0], 'saved');
  assert.equal(db.tables.transaksi.find((r) => r.id === s.transaksi[0].id).netto, s.transaksi[0].netto);
});

test('pemuatan gagal bila profil sekolah tidak terbaca (mis. akun tidak berhak)', async () => {
  db.tables.profil_sekolah = []; // RLS akan mengembalikan kosong untuk akun tanpa hak
  await assert.rejects(loadAll(), /Profil sekolah/);
});
