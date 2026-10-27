import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all_30_parsed_batches.json', 'utf8'));
console.log('Total batches in JSON:', data.length);

let grandTotal = 0;
const seenNomor = new Map();

data.forEach((b, idx) => {
  const sumTransfers = (b.transfers || []).reduce((acc, t) => acc + (t.netto || 0), 0);
  const diff = b.totalNominal - sumTransfers;
  grandTotal += b.totalNominal;
  
  let dupWarn = '';
  if (seenNomor.has(b.nomorSI)) {
    dupWarn = ` [DUPLICATE NOMOR SI with item ${seenNomor.get(b.nomorSI) + 1}]`;
  } else {
    seenNomor.set(b.nomorSI, idx);
  }

  const matchStr = diff === 0 ? 'MATCH' : `MISMATCH! Diff=${diff}`;
  console.log(`${(idx + 1).toString().padStart(2)}. [${b.monthFolder}] ${b.nomorSI} | Rp ${b.totalNominal.toLocaleString('id-ID')} | Trx: ${b.transfersCount} | Sum: Rp ${sumTransfers.toLocaleString('id-ID')} (${matchStr})${dupWarn}`);
  console.log(`    Folder: ${b.siFolder}`);
  console.log(`    File:   ${b.fileName}`);
});

console.log('----------------------------------------------------');
console.log('Grand Total 30 SI: Rp', grandTotal.toLocaleString('id-ID'));
