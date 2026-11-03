// =========================================================
// REPOSITORY — jembatan antara objek aplikasi (camelCase) dan tabel Supabase (snake_case)
//
// Prinsip:
//  - Aplikasi tetap bekerja dengan array siBatches / transaksiList / rekKoranList
//    seperti sebelumnya; hanya penyimpanannya yang pindah dari localStorage ke Supabase.
//  - Field yang tidak punya kolom khusus disimpan di kolom `extra` (JSONB) sehingga
//    tidak ada data yang hilang saat disimpan lalu dimuat ulang.
//  - Penyimpanan memakai diff terhadap snapshot terakhir: hanya baris yang berubah
//    yang dikirim ke server.
// =========================================================
import { supabase } from './supabaseClient.js';

const PAGE_SIZE = 1000;
const CHUNK = 100;

// ---------------------------------------------------------
// Pemetaan kolom: [namaDiAplikasi, namaDiDatabase, jenis]
// jenis: text (default) | fk | date | int | num | num0 (angka wajib, default 0)
// ---------------------------------------------------------
const BATCH_MAP = [
  ['id', 'id', 'fk'],
  ['nomorSI', 'nomor_si'],
  ['tanggal', 'tanggal', 'date'],
  ['tanggalFormat', 'tanggal_format'],
  ['perihal', 'perihal'],
  ['namaBank', 'nama_bank'],
  ['rekeningSumber', 'rekening_sumber'],
  ['atasNamaSumber', 'atas_nama_sumber'],
  ['totalNominal', 'total_nominal', 'num0'],
  ['status', 'status'],
  ['statusBadge', 'status_badge'],
  ['catatan', 'catatan'],
  ['monthFolder', 'month_folder'],
  ['siFolder', 'si_folder']
];

const TRANSFER_MAP = [
  ['originalNo', 'original_no', 'int'],
  ['unitId', 'unit_id', 'fk'],
  ['unitNama', 'unit_nama'],
  ['kategori', 'kategori'],
  ['vaSiplah', 'va_siplah'],
  ['namaBank', 'nama_bank'],
  ['atasNama', 'atas_nama'],
  ['bruto', 'bruto', 'num'],
  ['pajak', 'pajak', 'num'],
  ['netto', 'netto', 'num'],
  ['ket', 'ket'],
  ['note', 'note'],
  ['uraian', 'uraian']
];

const TRANSAKSI_MAP = [
  ['id', 'id', 'fk'],
  ['batchId', 'batch_id', 'fk'],
  ['noSI', 'no_si'],
  ['tanggal', 'tanggal', 'date'],
  ['unitId', 'unit_id', 'fk'],
  ['unitNama', 'unit_nama'],
  ['kategori', 'kategori'],
  ['namaBarang', 'nama_barang'],
  ['uraian', 'uraian'],
  ['qty', 'qty', 'num'],
  ['satuan', 'satuan'],
  ['hargaSatuan', 'harga_satuan', 'num'],
  ['nominal', 'nominal', 'num'],
  ['totalNominal', 'total_nominal', 'num'],
  ['netto', 'netto', 'num'],
  ['bruto', 'bruto', 'num'],
  ['pajak', 'pajak', 'num'],
  ['vaSiplah', 'va_siplah'],
  ['namaBank', 'nama_bank'],
  ['atasNama', 'atas_nama'],
  ['ket', 'ket'],
  ['note', 'note'],
  ['keterangan', 'keterangan']
];

const REK_MAP = [
  ['id', 'id', 'fk'],
  ['rowIndex', 'row_index', 'int'],
  ['serialDate', 'serial_date', 'int'],
  ['tanggal', 'tanggal', 'date'],
  ['uraian', 'uraian'],
  ['tipe', 'tipe'],
  ['kategori', 'kategori'],
  ['debit', 'debit', 'num0'],
  ['kredit', 'kredit', 'num0'],
  ['saldo', 'saldo', 'num0']
];

// ---------------------------------------------------------
// Konversi nilai
// ---------------------------------------------------------
function toDb(v, kind) {
  switch (kind) {
    case 'num0': {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }
    case 'num': {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    case 'int': {
      if (v === undefined || v === null || v === '') return null;
      const n = Math.trunc(Number(v));
      return Number.isFinite(n) ? n : null;
    }
    case 'date':
      return v ? String(v).slice(0, 10) : null;
    case 'fk':
      return v === undefined || v === null || v === '' ? null : String(v);
    default:
      return v === undefined ? null : v;
  }
}

function fromDb(v, kind) {
  if (kind === 'num' || kind === 'num0' || kind === 'int') return Number(v);
  return v;
}

function toRow(obj, map, skipKeys = []) {
  const row = {};
  const known = new Set(skipKeys);
  for (const [appKey, dbKey, kind] of map) {
    row[dbKey] = toDb(obj[appKey], kind);
    known.add(appKey);
  }
  const extra = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!known.has(k) && v !== undefined) extra[k] = v;
  }
  row.extra = extra;
  return row;
}

function fromRow(row, map) {
  const obj = {};
  for (const [appKey, dbKey, kind] of map) {
    const v = row[dbKey];
    if (v !== null && v !== undefined) obj[appKey] = fromDb(v, kind);
  }
  if (row.extra && typeof row.extra === 'object') {
    for (const [k, v] of Object.entries(row.extra)) {
      if (!(k in obj)) obj[k] = v;
    }
  }
  return obj;
}

// ---------------------------------------------------------
// Baris database dari state aplikasi
// ---------------------------------------------------------
function transferRows(batch) {
  const list = Array.isArray(batch.transfers) ? batch.transfers : [];
  return list.map((t, idx) => {
    const row = toRow(t, TRANSFER_MAP, ['no']);
    row.batch_id = batch.id;
    row.no = idx + 1; // penomoran selalu berurutan 1..n di dalam satu SI
    return row;
  });
}

function batchRowsOf(siBatches) {
  const map = new Map();
  for (const b of siBatches || []) {
    if (!b || !b.id) continue;
    const row = toRow(b, BATCH_MAP, ['transfers']);
    map.set(b.id, { row, transfers: transferRows(b) });
  }
  return map;
}

function transaksiRowsOf(list) {
  const map = new Map();
  for (const t of list || []) {
    if (!t || !t.id) continue;
    map.set(t.id, toRow(t, TRANSAKSI_MAP));
  }
  return map;
}

function rekRowsOf(list) {
  const map = new Map();
  (list || []).forEach((r, i) => {
    if (!r) return;
    const withId = r.id ? r : { ...r, id: `RK-${String(i + 1).padStart(3, '0')}` };
    map.set(withId.id, toRow(withId, REK_MAP));
  });
  return map;
}

const sig = (v) => JSON.stringify(v);

// ---------------------------------------------------------
// Pemuatan
// ---------------------------------------------------------
async function fetchAll(table, orderColumn) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderColumn, { ascending: true })
      .order('id', { ascending: true }) // pengurut tambahan agar halaman tidak tumpang tindih
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Gagal memuat ${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }
  return rows;
}

async function fetchSingle(table) {
  const { data, error } = await supabase.from(table).select('*').limit(1).maybeSingle();
  if (error) throw new Error(`Gagal memuat ${table}: ${error.message}`);
  return data;
}

// Snapshot data yang terakhir sama dengan server (untuk diff)
let snapSI = { batches: new Map(), transfers: new Map(), transaksi: new Map() };
let snapRek = new Map();

export async function loadAll() {
  const [profilRow, rekInfoRow, paguRows, unitRows, batchRows, transferRowsDb, trxRows, rekRows] =
    await Promise.all([
      fetchSingle('profil_sekolah'),
      fetchSingle('rekening_bank'),
      supabase.from('pagu_tahunan').select('*').order('tahun', { ascending: false }).limit(1),
      fetchAll('pagu_unit', 'urutan'),
      fetchAll('si_batches', 'tanggal'),
      fetchAll('si_transfers', 'id'),
      fetchAll('transaksi', 'tanggal'),
      fetchAll('rekening_koran', 'row_index')
    ]);

  if (paguRows.error) throw new Error('Gagal memuat pagu_tahunan: ' + paguRows.error.message);
  if (!profilRow) {
    throw new Error('Profil sekolah belum ada di database, atau akun Anda tidak punya hak akses.');
  }

  const profil = {
    nama: profilRow.nama,
    npsn: profilRow.npsn,
    namaYayasan: profilRow.nama_yayasan,
    alamat: profilRow.alamat,
    namaBank: profilRow.nama_bank,
    noRekening: profilRow.no_rekening,
    namaRekening: profilRow.nama_rekening,
    namaKepsek: profilRow.nama_kepsek,
    namaBendahara: profilRow.nama_bendahara,
    hpBendahara: profilRow.hp_bendahara,
    emailBendahara: profilRow.email_bendahara,
    tahunAnggaran: String(profilRow.tahun_anggaran ?? '')
  };

  const p = paguRows.data[0] || {};
  const tahun = p.tahun;
  const pagu = {
    totalSiswa: Number(p.total_siswa || 0),
    nominalPerSiswa: Number(p.nominal_per_siswa || 0),
    totalPaguGross: Number(p.total_pagu_gross || 0),
    iuranFKSSPerSiswa: Number(p.iuran_fkss_per_siswa || 0),
    totalIuranFKSS: Number(p.total_iuran_fkss || 0),
    totalPaguNetto: Number(p.total_pagu_netto || 0),
    paguTahap1: Number(p.pagu_tahap1 || 0),
    paguTahap2: Number(p.pagu_tahap2 || 0),
    units: unitRows
      .filter((u) => u.tahun === tahun)
      .map((u) => ({
        id: u.id,
        nama: u.nama,
        siswa: Number(u.siswa),
        paguMurni: Number(u.pagu_murni),
        talanganFKSS: Number(u.talangan_fkss),
        pagu: Number(u.pagu),
        color: u.warna,
        catatan: u.catatan
      }))
  };

  const rekeningInfo = rekInfoRow
    ? {
        bank: rekInfoRow.bank,
        cabang: rekInfoRow.cabang,
        nomorRekening: rekInfoRow.nomor_rekening,
        namaRekening: rekInfoRow.nama_rekening,
        tahunAnggaran: rekInfoRow.tahun_anggaran,
        fileSumber: rekInfoRow.file_sumber,
        sheetSumber: rekInfoRow.sheet_sumber,
        totalMutasiDebit: Number(rekInfoRow.total_mutasi_debit || 0),
        totalMutasiKredit: Number(rekInfoRow.total_mutasi_kredit || 0),
        saldoAkhir: Number(rekInfoRow.saldo_akhir || 0)
      }
    : {};

  // Kelompokkan transfer per SI, urut berdasarkan nomor
  const transfersByBatch = new Map();
  for (const t of transferRowsDb) {
    const obj = fromRow(t, TRANSFER_MAP);
    obj.no = Number(t.no);
    if (!transfersByBatch.has(t.batch_id)) transfersByBatch.set(t.batch_id, []);
    transfersByBatch.get(t.batch_id).push(obj);
  }
  for (const list of transfersByBatch.values()) list.sort((a, b) => a.no - b.no);

  const siBatches = batchRows.map((b) => {
    const obj = fromRow(b, BATCH_MAP);
    obj.transfers = transfersByBatch.get(b.id) || [];
    return obj;
  });
  const transaksi = trxRows.map((t) => fromRow(t, TRANSAKSI_MAP));
  const rekKoran = rekRows.map((r) => {
    const obj = fromRow(r, REK_MAP);
    if (obj.serialDate === undefined) obj.serialDate = null; // sama seperti bentuk aslinya
    return obj;
  });

  // Simpan snapshot sebagai acuan diff berikutnya
  const batchMap = batchRowsOf(siBatches);
  snapSI = {
    batches: new Map([...batchMap].map(([id, v]) => [id, sig(v.row)])),
    transfers: new Map([...batchMap].map(([id, v]) => [id, sig(v.transfers)])),
    transaksi: new Map([...transaksiRowsOf(transaksi)].map(([id, row]) => [id, sig(row)]))
  };
  snapRek = new Map([...rekRowsOf(rekKoran)].map(([id, row]) => [id, sig(row)]));

  return { profil, pagu, rekeningInfo, siBatches, transaksi, rekKoran };
}

// ---------------------------------------------------------
// Penyimpanan (diff terhadap snapshot)
// ---------------------------------------------------------
function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function run(promise, label) {
  const { error } = await promise;
  if (error) throw new Error(`${label}: ${error.message}`);
}

export async function saveSI(siBatches, transaksiList) {
  const batchMap = batchRowsOf(siBatches);
  const trxMap = transaksiRowsOf(transaksiList);

  const nextBatchSig = new Map([...batchMap].map(([id, v]) => [id, sig(v.row)]));
  const nextTransferSig = new Map([...batchMap].map(([id, v]) => [id, sig(v.transfers)]));
  const nextTrxSig = new Map([...trxMap].map(([id, row]) => [id, sig(row)]));

  const deletedBatchIds = [...snapSI.batches.keys()].filter((id) => !batchMap.has(id));
  const deletedTrxIds = [...snapSI.transaksi.keys()].filter((id) => !trxMap.has(id));
  const changedBatchIds = [...batchMap.keys()].filter(
    (id) => snapSI.batches.get(id) !== nextBatchSig.get(id)
  );
  const changedTransferBatchIds = [...batchMap.keys()].filter(
    (id) => snapSI.transfers.get(id) !== nextTransferSig.get(id)
  );
  const changedTrxIds = [...trxMap.keys()].filter(
    (id) => snapSI.transaksi.get(id) !== nextTrxSig.get(id)
  );

  const nothing =
    !deletedBatchIds.length && !deletedTrxIds.length && !changedBatchIds.length &&
    !changedTransferBatchIds.length && !changedTrxIds.length;
  if (nothing) return;

  // 1) Hapus transaksi yang dibuang (sebelum SI, agar urutan aman)
  for (const ids of chunks(deletedTrxIds, CHUNK)) {
    await run(supabase.from('transaksi').delete().in('id', ids), 'Hapus transaksi');
  }
  // 2) Hapus SI yang dibuang (transfer & transaksi terkait ikut terhapus oleh CASCADE)
  for (const ids of chunks(deletedBatchIds, CHUNK)) {
    await run(supabase.from('si_batches').delete().in('id', ids), 'Hapus dokumen SI');
  }
  // 3) Tambah/ubah SI
  for (const ids of chunks(changedBatchIds, CHUNK)) {
    await run(
      supabase.from('si_batches').upsert(ids.map((id) => batchMap.get(id).row), { onConflict: 'id' }),
      'Simpan dokumen SI'
    );
  }
  // 4) Ganti rincian transfer untuk SI yang berubah
  for (const id of changedTransferBatchIds) {
    await run(supabase.from('si_transfers').delete().eq('batch_id', id), 'Bersihkan transfer SI');
    const rows = batchMap.get(id).transfers;
    for (const part of chunks(rows, CHUNK)) {
      await run(supabase.from('si_transfers').insert(part), 'Simpan transfer SI');
    }
  }
  // 5) Tambah/ubah transaksi
  for (const ids of chunks(changedTrxIds, CHUNK)) {
    await run(
      supabase.from('transaksi').upsert(ids.map((id) => trxMap.get(id)), { onConflict: 'id' }),
      'Simpan transaksi'
    );
  }

  snapSI = { batches: nextBatchSig, transfers: nextTransferSig, transaksi: nextTrxSig };
}

export async function saveRekKoran(rekList) {
  const rows = rekRowsOf(rekList);
  const nextSig = new Map([...rows].map(([id, row]) => [id, sig(row)]));

  const deletedIds = [...snapRek.keys()].filter((id) => !rows.has(id));
  const changedIds = [...rows.keys()].filter((id) => snapRek.get(id) !== nextSig.get(id));
  if (!deletedIds.length && !changedIds.length) return;

  for (const ids of chunks(deletedIds, CHUNK)) {
    await run(supabase.from('rekening_koran').delete().in('id', ids), 'Hapus mutasi rekening');
  }
  for (const ids of chunks(changedIds, CHUNK)) {
    await run(
      supabase.from('rekening_koran').upsert(ids.map((id) => rows.get(id)), { onConflict: 'id' }),
      'Simpan mutasi rekening'
    );
  }
  snapRek = nextSig;
}

// ---------------------------------------------------------
// Antrean penyimpanan: gabungkan banyak perubahan beruntun menjadi satu sinkronisasi
// ---------------------------------------------------------
export function createSyncQueue(onStatus = () => {}) {
  let timer = null;
  let running = Promise.resolve();
  let pending = { si: null, rek: null };
  let dirty = false;

  async function flush() {
    clearTimeout(timer);
    timer = null;
    const job = pending;
    pending = { si: null, rek: null };
    if (!job.si && !job.rek) return;
    running = running.then(async () => {
      onStatus('saving');
      try {
        if (job.si) await saveSI(job.si.siBatches, job.si.transaksiList);
        if (job.rek) await saveRekKoran(job.rek);
        dirty = Boolean(pending.si || pending.rek);
        onStatus(dirty ? 'saving' : 'saved');
      } catch (err) {
        console.error('Gagal menyimpan ke Supabase:', err);
        // Kembalikan pekerjaan yang gagal agar dicoba lagi pada penyimpanan berikutnya
        if (!pending.si && job.si) pending.si = job.si;
        if (!pending.rek && job.rek) pending.rek = job.rek;
        dirty = true;
        onStatus('error', err.message);
      }
    });
    return running;
  }

  function schedule() {
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(flush, 500);
  }

  return {
    scheduleSI(siBatches, transaksiList) {
      // salin dangkal agar perubahan setelah ini tidak ikut terbawa
      pending.si = { siBatches: siBatches.slice(), transaksiList: transaksiList.slice() };
      schedule();
    },
    scheduleRek(rekList) {
      pending.rek = rekList.slice();
      schedule();
    },
    flush,
    hasPending: () => dirty || Boolean(pending.si || pending.rek)
  };
}
