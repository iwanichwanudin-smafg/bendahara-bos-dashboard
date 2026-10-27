import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

// User targets:
const TARGETS = {
  PUTRA: 445440040,
  MAHAD: 41898061,
  BS: 282573256,
  FDS: 255499031,
  RABBANI: 129654000
};

// Deep copy of batches
const batches = JSON.parse(JSON.stringify(INITIAL_SI_BATCHES));

// Let's inspect each batch and reassign unitId properly:
batches.forEach(b => {
  b.transfers.forEach(t => {
    const k = (t.ket || '').toUpperCase();
    const n = (t.note || '').toUpperCase();
    const u = (t.uraian || '').toUpperCase();
    const f = (b.siFolder || b.monthFolder || '').toUpperCase();

    // Check specific transfer IDs or patterns
    if (b.id === 'SI-182-2026-10') {
      if (t.no === 1) t.unitId = 'PUTRA'; // Belanja Modal Oktober (FG Putra)
      else if (t.no === 2) t.unitId = 'MAHAD'; // Belanja Modal Oktober (Mahad)
      else if (t.no >= 3 && t.no <= 5) t.unitId = 'BS'; // BS
      else if (t.no >= 6 && t.no <= 7) t.unitId = 'RABBANI'; // Rabbani
    }
    else if (b.id === 'SI-132-2026-09') {
      if (t.no >= 1 && t.no <= 3) t.unitId = 'PUTRA'; // FG Putra (49.200.000, 36.860.000, 11.746.000)
      else if (t.no === 4) t.unitId = 'BS'; // Belanja Buku Erlangga September (BS) 2.079.000
      else if (t.no === 5) t.unitId = 'FDS'; // Tambahan Token September (FDS) 1.200.000
    }
    else if (b.id === 'SI-143-2026-09') {
      if (t.no === 1) t.unitId = 'MAHAD'; // Belanja Modal September (Mahad) 7.500.000
      else if (t.no === 2) t.unitId = 'FDS'; // Belanja Modal September (FDS) 19.238.207
      else if (t.no === 3) t.unitId = 'PUTRA'; // Belanja Buku-buku Perpus September (FG Putra) 903.000
    }
    else if (b.id === 'SI-882-2026-06') {
      if (t.no === 1) t.unitId = 'PUTRA'; // Buku Perpustakaan (FG Putra) 2.416.900
      else t.unitId = 'BS';
    }
    else if (b.id === 'SI-887-2026-06') {
      // Transfer #4: 8.200.000 | Ket: "Belanja Modal Juni (Mahad & FDS)"
      // In Excel: Mahad gets 2.050.000, FDS gets 6.150.000!
      // We will split transfer #4 into two transfers!
    }
  });
});

// Let's calculate totals with this logic
const unitTotals = { PUTRA: 0, MAHAD: 0, BS: 0, FDS: 0, RABBANI: 0 };
batches.forEach(b => {
  b.transfers.forEach(t => {
    if (b.id === 'SI-887-2026-06' && t.no === 4) {
      unitTotals['MAHAD'] += 2050000;
      unitTotals['FDS'] += 6150000;
    } else {
      unitTotals[t.unitId] = (unitTotals[t.unitId] || 0) + t.netto;
    }
  });
});

console.log('=== HASIL SETELAH ATRIBUSI UNIT DIPERBAIKI ===');
for (const [u, target] of Object.entries(TARGETS)) {
  const actual = unitTotals[u] || 0;
  console.log(`${u.padEnd(8)}: Target=${target.toLocaleString('id-ID').padStart(14)} | Actual=${actual.toLocaleString('id-ID').padStart(14)} | Selisih=${(actual - target).toLocaleString('id-ID').padStart(12)}`);
}

const grandTarget = Object.values(TARGETS).reduce((a, b) => a + b, 0);
const grandActual = Object.values(unitTotals).reduce((a, b) => a + b, 0);
console.log(`TOTAL   : Target=${grandTarget.toLocaleString('id-ID').padStart(14)} | Actual=${grandActual.toLocaleString('id-ID').padStart(14)} | Selisih=${(grandActual - grandTarget).toLocaleString('id-ID').padStart(12)}`);
