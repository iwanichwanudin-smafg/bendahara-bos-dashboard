// Clean and robust loadData logic
function getCleanData(savedSIList, savedTrxList, initialBatches, initialTrx) {
  // If user has saved batches in storage, use them!
  let batches = [];
  let trx = [];

  if (Array.isArray(savedSIList) && savedSIList.length > 0) {
    batches = savedSIList;
  } else {
    batches = JSON.parse(JSON.stringify(initialBatches));
  }

  if (Array.isArray(savedTrxList) && savedTrxList.length > 0) {
    trx = savedTrxList;
  } else {
    trx = JSON.parse(JSON.stringify(initialTrx));
  }

  // Ensure deterministic IDs and no duplicates
  const seenIds = new Set();
  const dedupedTrx = [];
  trx.forEach(t => {
    if (!seenIds.has(t.id)) {
      seenIds.add(t.id);
      dedupedTrx.push(t);
    }
  });

  return { batches, trx: dedupedTrx };
}

console.log('Clean logic defined.');
