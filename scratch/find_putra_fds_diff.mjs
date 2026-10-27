import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

// User Excel targets per month:
const TARGET_PUTRA = {
  '01+02': 41436549 + 20990042, // 62.426.591
  '03': 21768697,
  '04': 27653998,
  '05': 23100031,
  '06': 101806442,
  '07': 21872735,
  '08': 23268188,
  '09': 123734570,
  '10': 39808788
};

const TARGET_FDS = {
  '01+02': 4560000 + 3220500, // 7.780.500
  '03': 4750500,
  '04': 121255000,
  '05': 5240000,
  '06': 16550000,
  '07': 5240000,
  '08': 43996000,
  '09': 25641207,
  '10': 25045824
};

// Deep copy
const batches = JSON.parse(JSON.stringify(INITIAL_SI_BATCHES));
batches.forEach(b => {
  b.transfers.forEach(t => {
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
  });
});

// Calculate Putra and FDS actual per month
const actualPutra = { '01+02': 0, '03': 0, '04': 0, '05': 0, '06': 0, '07': 0, '08': 0, '09': 0, '10': 0 };
const actualFDS = { '01+02': 0, '03': 0, '04': 0, '05': 0, '06': 0, '07': 0, '08': 0, '09': 0, '10': 0 };

batches.forEach(b => {
  const m = b.tanggal.substring(5, 7);
  const mKey = ['01', '02'].includes(m) ? '01+02' : m;
  b.transfers.forEach(t => {
    let u = t.unitId;
    let amt = t.netto;
    if (b.id === 'SI-887-2026-06' && t.no === 4) {
      // Mahad & FDS
      actualFDS[mKey] += 6150000;
      return;
    }
    if (u === 'PUTRA') actualPutra[mKey] += amt;
    if (u === 'FDS') actualFDS[mKey] += amt;
  });
});

console.log('=== KOMPARASI PUTRA PER BULAN ===');
for (const m of Object.keys(TARGET_PUTRA)) {
  const tgt = TARGET_PUTRA[m];
  const act = actualPutra[m];
  console.log(`Bulan ${m}: Target=${tgt.toLocaleString('id-ID').padStart(12)} | Actual=${act.toLocaleString('id-ID').padStart(12)} | Diff=${(act - tgt).toLocaleString('id-ID').padStart(10)}`);
}

console.log('\n=== KOMPARASI FDS PER BULAN ===');
for (const m of Object.keys(TARGET_FDS)) {
  const tgt = TARGET_FDS[m];
  const act = actualFDS[m];
  console.log(`Bulan ${m}: Target=${tgt.toLocaleString('id-ID').padStart(12)} | Actual=${act.toLocaleString('id-ID').padStart(12)} | Diff=${(act - tgt).toLocaleString('id-ID').padStart(10)}`);
}
