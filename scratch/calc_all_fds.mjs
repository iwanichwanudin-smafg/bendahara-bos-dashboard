import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

// Let's sum all transfers where unitId === 'FDS'
const batches = JSON.parse(JSON.stringify(INITIAL_SI_BATCHES));

// Update SI-106 as per user's screenshot:
// Row 1: Putra (8.125.570)
// Row 2: FDS (1.050.000)
// Row 3: FDS (1.503.000)
// Row 4: FDS (3.850.000)

let totalFdsAllSi = 0;
let fdsByMonth = {};

batches.forEach(b => {
  const m = b.tanggal.substring(5, 7);
  b.transfers.forEach(t => {
    let u = t.unitId;
    let amt = t.netto;

    // Apply SI-106 as per user screenshot
    if (b.id === 'SI-106-2026-09') {
      if (t.ket && t.ket.includes('Listrik')) { u = 'PUTRA'; amt = 8125570; }
      else if (t.ket && t.ket.includes('1.050.000')) { u = 'FDS'; amt = 1050000; }
      else if (t.ket && t.ket.includes('1.503.000')) { u = 'FDS'; amt = 1503000; }
      else if (t.ket && t.ket.includes('Token')) { u = 'FDS'; amt = 3850000; }
    }

    if (u === 'FDS') {
      totalFdsAllSi += amt;
      fdsByMonth[m] = (fdsByMonth[m] || 0) + amt;
    }
  });
});

console.log('Total FDS across all 30 SI:', totalFdsAllSi);
console.log('FDS by Month:', fdsByMonth);
console.log('Target FDS in Excel:', 255499031);
console.log('Diff FDS:', totalFdsAllSi - 255499031);
