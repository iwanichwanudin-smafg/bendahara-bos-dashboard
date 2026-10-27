import fs from 'fs';
import * as XLSX from 'xlsx';

const f = './downloaded_si/09 September/SI 1 Tagihan Listrik &amp; Internet Sep 2026/SI BJB - BOSP (Sep 1).xlsx';
const buf = fs.readFileSync(f);
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
rows.forEach((r, idx) => {
  if (r.length > 0) console.log(`r${idx}:`, r);
});
