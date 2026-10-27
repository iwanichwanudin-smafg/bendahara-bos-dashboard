import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

const TARGETS = {
  PUTRA: 445440040,
  MAHAD: 41898061,
  BS: 282573256,
  FDS: 255499031,
  RABBANI: 129654000
};

const batches = JSON.parse(JSON.stringify(INITIAL_SI_BATCHES));

const unitTotals = { PUTRA: 0, MAHAD: 0, BS: 0, FDS: 0, RABBANI: 0 };

batches.forEach(b => {
  b.transfers.forEach(t => {
    // Specific transfer assignments:
    if (b.id === 'SI-182-2026-10') {
      if (t.no === 1) t.unitId = 'PUTRA';
      else if (t.no === 2) t.unitId = 'MAHAD';
      else if (t.no >= 3 && t.no <= 5) t.unitId = 'BS';
      else if (t.no >= 6 && t.no <= 7) t.unitId = 'RABBANI';
    }
    else if (b.id === 'SI-132-2026-09') {
      if (t.no >= 1 && t.no <= 3) t.unitId = 'PUTRA';
      else if (t.no === 4) t.unitId = 'BS';
      else if (t.no === 5) t.unitId = 'FDS';
    }
    else if (b.id === 'SI-143-2026-09') {
      if (t.no === 1) t.unitId = 'MAHAD';
      else if (t.no === 2) t.unitId = 'FDS';
      else if (t.no === 3) t.unitId = 'PUTRA';
    }
    else if (b.id === 'SI-882-2026-06') {
      if (t.no === 1) t.unitId = 'PUTRA';
      else t.unitId = 'BS';
    }

    // Split transfers:
    if (b.id === 'SI-887-2026-06' && t.no === 4) {
      // 8.200.000 split
      unitTotals['MAHAD'] += 2050000;
      unitTotals['FDS'] += 6150000;
      return;
    }

    if (b.id === 'SI-106-2026-09' && t.no === 2) {
      // 2.553.000 split: Internet Biznet & Biaya Pasang Baru
      // FDS portion: 1.353.000, Putra portion: 1.200.000
      unitTotals['FDS'] += 1353000;
      unitTotals['PUTRA'] += 1200000;
      return;
    }

    unitTotals[t.unitId] = (unitTotals[t.unitId] || 0) + t.netto;
  });
});

console.log('=== HASIL AKHIR SETELAH ATRIBUSI UNIT DIPERBAIKI ===');
for (const [u, target] of Object.entries(TARGETS)) {
  const actual = unitTotals[u] || 0;
  console.log(`${u.padEnd(8)}: Target=${target.toLocaleString('id-ID').padStart(14)} | Actual=${actual.toLocaleString('id-ID').padStart(14)} | Selisih=${(actual - target).toLocaleString('id-ID').padStart(12)}`);
}
