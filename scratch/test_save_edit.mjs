import { INITIAL_SI_BATCHES, INITIAL_TRANSAKSI_LIST } from '../src/data/initialData.js';

let batches = JSON.parse(JSON.stringify(INITIAL_SI_BATCHES));
let trxList = JSON.parse(JSON.stringify(INITIAL_TRANSAKSI_LIST));

console.log('Initial Trx Count:', trxList.length);
console.log('Initial Trx Total:', trxList.reduce((s, t) => s + (t.nominal || t.totalNominal || 0), 0));

// Find SI-106
const batch106 = batches.find(b => b.nomorSI.includes('106'));
console.log('Batch 106 id:', batch106.id);

// Check matching in trxList
const matchingTrx = trxList.filter(t => t.batchId === batch106.id);
console.log('Matching Trx count for batch 106:', matchingTrx.length);

// What if we do:
trxList = trxList.filter(t => t.batchId !== batch106.id);
console.log('After filter Trx count:', trxList.length);

// Now suppose we add the 4 transfers:
const transfers = [
  { no: 1, unitId: 'PUTRA', netto: 8125570 },
  { no: 2, unitId: 'FDS', netto: 1050000 },
  { no: 3, unitId: 'FDS', netto: 1503000 },
  { no: 4, unitId: 'FDS', netto: 3850000 }
];

transfers.forEach((t, i) => {
  trxList.push({
    id: `TRX-${Date.now()}-${i}`,
    batchId: batch106.id,
    noSI: batch106.nomorSI,
    nominal: t.netto,
    totalNominal: t.netto
  });
});

console.log('New Trx Count:', trxList.length);
console.log('New Trx Total:', trxList.reduce((s, t) => s + (t.nominal || t.totalNominal || 0), 0));
