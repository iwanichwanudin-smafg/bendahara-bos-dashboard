import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { INITIAL_SI_BATCHES, INITIAL_TRANSAKSI_LIST } from '../src/data/initialData.js';

// Let's inspect where multi-unit batches exist
// Specifically:
// 1. SI-182-2026-10 (Okt 2)
// 2. SI-132-2026-09 (Sep 2)
// 3. SI-143-2026-09 (Sep 3)
// 4. SI-840-2026-05 (Mei 2)
// 5. SI-852-2026-05 (Mei 3)
// 6. SI-887-2026-06 (Jun 4)

function inspectBatchTransfers(batchId) {
  const batch = INITIAL_SI_BATCHES.find(b => b.id === batchId);
  console.log(`\n======================================================`);
  console.log(`BATCH: ${batch.id} (${batch.nomorSI}) - Total: ${batch.totalNominal.toLocaleString('id-ID')}`);
  console.log(`Folder: ${batch.siFolder || batch.monthFolder}`);
  batch.transfers.forEach(t => {
    console.log(`  Transfer #${t.no}: Netto=${t.netto.toLocaleString('id-ID')} | Unit=${t.unitId} (${t.unitNama}) | Ket=${t.ket} | Note=${t.note} | AtasNama=${t.atasNama} | Rek=${t.vaSiplah}`);
  });
}

inspectBatchTransfers('SI-182-2026-10');
inspectBatchTransfers('SI-132-2026-09');
inspectBatchTransfers('SI-143-2026-09');
inspectBatchTransfers('SI-840-2026-05');
inspectBatchTransfers('SI-852-2026-05');
inspectBatchTransfers('SI-887-2026-06');
