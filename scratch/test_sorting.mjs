globalThis.window = { location: { hash: '' }, addEventListener: () => {} };
globalThis.document = { getElementById: () => null, querySelectorAll: () => [], addEventListener: () => {} };
globalThis.localStorage = { getItem: () => null, setItem: () => null };

async function runTest() {
  const { sortSIBatchesChronological, sortTransaksiChronological } = await import('../main.js');
  const { INITIAL_SI_BATCHES, INITIAL_TRANSAKSI_ITEMS } = await import('../src/data/initialData.js');

  const reversedBatches = [...INITIAL_SI_BATCHES].reverse();
  const sortedBatches = sortSIBatchesChronological(reversedBatches);

  console.log('=== VERIFY SI BATCHES ORDER (Oldest to Newest) ===');
  sortedBatches.forEach((b, i) => {
    console.log(`${i + 1}. [${b.tanggal}] ${b.nomorSI} - Rp ${b.totalNominal.toLocaleString('id-ID')} (${b.transfers.length} trf)`);
  });

  let isAscending = true;
  for (let i = 0; i < sortedBatches.length - 1; i++) {
    if (sortedBatches[i].tanggal > sortedBatches[i + 1].tanggal) {
      isAscending = false;
    }
  }
  console.log('\nAre SI Batches sorted chronologically ascending?', isAscending);

  const reversedTrx = [...INITIAL_TRANSAKSI_ITEMS].reverse();
  const sortedTrx = sortTransaksiChronological(reversedTrx);

  console.log('\n=== VERIFY TRANSAKSI ORDER (Oldest to Newest) ===');
  sortedTrx.slice(0, 5).forEach((t, i) => {
    console.log(`First ${i + 1}. [${t.tanggal}] ${t.noSI} - ${t.namaBarang.slice(0, 40)}`);
  });
  sortedTrx.slice(-5).forEach((t, i) => {
    console.log(`Last ${i + 1}. [${t.tanggal}] ${t.noSI} - ${t.namaBarang.slice(0, 40)}`);
  });

  let isTrxAscending = true;
  for (let i = 0; i < sortedTrx.length - 1; i++) {
    if (sortedTrx[i].tanggal > sortedTrx[i + 1].tanggal) {
      isTrxAscending = false;
    }
  }
  console.log('\nAre Transaksi items sorted chronologically ascending?', isTrxAscending);
}

runTest().catch(console.error);
