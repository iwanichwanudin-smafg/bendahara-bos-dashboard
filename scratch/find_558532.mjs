// Target Putra in September = 123.734.570
const targetPutra = 123734570;

// Known items for Putra in September from the SI:
// 1. SI-132 (SIPLah Putra):
//    - Set Meja Kursi: 49.200.000
//    - Modal lainnya (Kotak HP 7.2 jt + Pompa 105 rb + Lampu UV 800 rb + Lenovo 3 unit 28.755 jt): 36.860.000
//    - Operasional Siplah (Cat, ATK, Kebersihan dll): 11.746.000
//    Total Siplah SI-132 Putra = 49.200.000 + 36.860.000 + 11.746.000 = 97.806.000
const siplahPutra = 97806000;

// 2. SI-143 (Buku Perpustakaan Putra):
//    - Buku Golden ways + good bye fairy + Physics: 903.000
const perpusPutra = 903000;

// 3. SI-144 (Gaji Guru Putra September):
//    - Real BJB Transfer: 16.579.266
//    - User says: "honor september yg sy hitung hanya 320.734 selisihnya" -> so user calculated 16.258.532
const honorBjb = 16579266;
const honorUser = 16258532; // 16.579.266 - 320.734

// 4. SI-106 (Listrik & Internet September):
//    - Transfer #1: Tagihan Listrik = 8.125.570
const listrikBjb = 8125570;
//    - Transfer #2: Internet Biznet & Pasang Baru = 2.553.000
//      We know FDS took 1.353.000.
//      Remaining in BJB for Putra = 2.553.000 - 1.353.000 = 1.200.000
const internetBjbPutra = 1200000;

console.log('--- Case A: Menggunakan Nilai Riil BJB ---');
const totalBjbPutra = siplahPutra + perpusPutra + honorBjb + listrikBjb + internetBjbPutra;
console.log('Total BJB Putra:', totalBjbPutra);
console.log('Selisih thd Excel User:', totalBjbPutra - targetPutra); // 879.266

console.log('\n--- Case B: Menggunakan Honor Hitungan User (16.258.532) ---');
const totalWithUserHonor = siplahPutra + perpusPutra + honorUser + listrikBjb + internetBjbPutra;
console.log('Total dgn Honor User:', totalWithUserHonor);
console.log('Selisih sisa:', totalWithUserHonor - targetPutra); // 558.532!

console.log('\nSisa selisih =', totalWithUserHonor - targetPutra); // Exactly 558.532!

// Now let's analyze what equals 558.532:
// Look at Tagihan Listrik & Internet:
// Listrik BJB: 8.125.570
// Internet Putra: 1.200.000
// Sum Listrik + Internet = 9.325.570
// If we subtract 558.532:
console.log('9.325.570 - 558.532 =', 9325570 - 558532); // 8.767.038
console.log('8.125.570 - 558.532 =', 8125570 - 558532); // 7.567.038
console.log('1.200.000 - 558.532 =', 1200000 - 558532); // 641.468
console.log('Target Putra - (Siplah + Perpus + Honor User):', targetPutra - (siplahPutra + perpusPutra + honorUser)); // 8.767.038!
