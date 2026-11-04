// Database tiruan di memori — meniru bagian klien Supabase yang dipakai repository.js.
// Dipakai agar test berjalan tanpa jaringan dan tanpa menyentuh data sungguhan.
import { COLUMNS } from './schema_columns.mjs';

export function createMockClient() {
  const tables = {};
  const stats = { writes: 0, failNextWrite: null };
  const rowsOf = (name) => (tables[name] ||= []);

  class Query {
    constructor(table) {
      this.table = table; this.op = 'select';
      this.filters = []; this.orders = []; this.rng = null; this.lim = null; this.single = false;
    }
    select() { this.op = 'select'; return this; }
    order(column) { this.orders.push(column); return this; }
    range(from, to) { this.rng = [from, to]; return this; }
    limit(n) { this.lim = n; return this; }
    maybeSingle() { this.single = true; return this; }
    upsert(rows, { onConflict }) { this.op = 'upsert'; this.payload = rows; this.key = onConflict; return this; }
    insert(rows) { this.op = 'insert'; this.payload = rows; return this; }
    delete() { this.op = 'delete'; return this; }
    in(column, values) { this.filters.push((r) => values.includes(r[column])); return this; }
    eq(column, value) { this.filters.push((r) => r[column] === value); return this; }
    then(resolve, reject) { return Promise.resolve(this.run()).then(resolve, reject); }

    run() {
      const rows = rowsOf(this.table);
      if (this.op === 'select') {
        let out = rows.map((r) => JSON.parse(JSON.stringify(r)));
        out.sort((a, b) => {
          for (const c of this.orders) { if (a[c] < b[c]) return -1; if (a[c] > b[c]) return 1; }
          return 0;
        });
        if (this.rng) out = out.slice(this.rng[0], this.rng[1] + 1);
        if (this.lim != null) out = out.slice(0, this.lim);
        return this.single ? { data: out[0] ?? null, error: null } : { data: out, error: null };
      }

      stats.writes++;
      if (stats.failNextWrite) {
        const message = stats.failNextWrite;
        stats.failNextWrite = null;
        return { error: { message } };
      }
      const allowed = COLUMNS[this.table];
      if (allowed && this.payload) {
        for (const r of this.payload) {
          const unknown = Object.keys(r).filter((k) => !allowed.includes(k));
          if (unknown.length) {
            return { error: { message: `Could not find the '${unknown[0]}' column of '${this.table}' in the schema cache` } };
          }
        }
      }
      const copy = (x) => JSON.parse(JSON.stringify(x));
      if (this.op === 'insert') {
        for (const r of this.payload) {
          if (this.table === 'si_transfers' && rows.some((x) => x.batch_id === r.batch_id && x.no === r.no)) {
            return { error: { message: 'duplicate key value violates unique constraint' } };
          }
          rows.push(copy(r));
        }
        return { error: null };
      }
      if (this.op === 'upsert') {
        for (const r of this.payload) {
          const i = rows.findIndex((x) => x[this.key] === r[this.key]);
          if (i >= 0) rows[i] = copy(r); else rows.push(copy(r));
        }
        return { error: null };
      }
      if (this.op === 'delete') {
        const gone = rows.filter((r) => this.filters.every((f) => f(r)));
        tables[this.table] = rows.filter((r) => !this.filters.every((f) => f(r)));
        if (this.table === 'si_batches') { // meniru ON DELETE CASCADE
          const ids = new Set(gone.map((g) => g.id));
          tables.si_transfers = rowsOf('si_transfers').filter((x) => !ids.has(x.batch_id));
          tables.transaksi = rowsOf('transaksi').filter((x) => !ids.has(x.batch_id));
        }
        return { error: null };
      }
    }
  }
  return { client: { from: (t) => new Query(t) }, tables, stats };
}
