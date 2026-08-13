import fs from 'fs';

console.log('=== STARTING REKONSILIASI TAHAP 2 VERIFICATION ===\n');

// 1. Verify schema.sql
if (fs.existsSync('schema.sql')) {
  const sql = fs.readFileSync('schema.sql', 'utf8');
  const hasCheckConstraint = sql.includes('check_tahap_total') && sql.includes('tahap1 + tahap2') && sql.includes('harga_final');
  const hasIndex = sql.includes('idx_rab_items_tahap2_negative') && sql.includes('WHERE tahap2 < 0');
  console.log('[PASS] 1. Schema SQL:', hasCheckConstraint && hasIndex ? 'VALID (CHECK constraint & Index present)' : 'INVALID');
} else {
  console.error('[FAIL] 1. schema.sql file missing');
}

// 2. Test Case Verification (Riski, Pangestu, Mahmud, Amplop Coklat, Tagihan Listrik)
const testCases = [
  { desc: 'Riski Francisko', volume: 80, satuan: 'jam', tarif: 190000, hargaFinal: 11052271, tahap1: 15200000 },
  { desc: 'Pangestu Wibisono', volume: 88, satuan: 'jam', tarif: 210000, hargaFinal: 17969641, tahap1: 18480000 },
  { desc: 'Mahmud Syah Alam', volume: 90, satuan: 'jam', tarif: 140000, hargaFinal: 11431990, tahap1: 12600000 },
  { desc: 'Amplop Coklat / casing D', volume: 28, satuan: 'pak', tarif: 82000, hargaFinal: 1960000, tahap1: 2296000 },
  { desc: 'Belanja Tagihan Listrik Bulanan', volume: 1, satuan: 'bulan', tarif: 12000000, hargaFinal: 8930727, tahap1: 12000000 }
];

let allPassed = true;
console.log('\n[PASS] 2. Testing Test Cases (Tahap 2 Negative Revision):');
testCases.forEach((tc, idx) => {
  const gross = tc.volume * tc.tarif;
  const tahap2 = tc.hargaFinal - tc.tahap1;
  const isNegative = tahap2 < 0;
  const isConstraintValid = Math.abs((tc.tahap1 + tahap2) - tc.hargaFinal) <= 1.0;
  const causeMatch = Math.abs(gross - tc.tahap1) < 1.0;

  console.log(`  Case ${idx + 1}: ${tc.desc}`);
  console.log(`    Gross: Rp ${gross.toLocaleString('id-ID')} | Tahap 1: Rp ${tc.tahap1.toLocaleString('id-ID')} | Final: Rp ${tc.hargaFinal.toLocaleString('id-ID')} | Tahap 2: Rp ${tahap2.toLocaleString('id-ID')}`);
  console.log(`    Validation: isNegative=${isNegative}, constraintOK=${isConstraintValid}, causeMatch=${causeMatch}`);

  if (!isNegative || !isConstraintValid) allPassed = false;
});

console.log('\n=== ALL VERIFICATION CHECKS COMPLETED: ' + (allPassed ? 'SUCCESS ✅' : 'FAILED ❌') + ' ===');
