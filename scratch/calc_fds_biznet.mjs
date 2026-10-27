// Let's calculate FDS in September:
// Target FDS in user Excel for September: 25.641.207

// Items of FDS in September:
// 1. SI-143 transfer #2: Belanja Modal September (FDS) = 19.238.207
// 2. SI-106 transfer #4 (originally #3): Token Listrik FDS = 3.850.000
// 3. SI-132 transfer #5: Tambahan Token September (FDS) = 1.200.000
// 4. SI-106 Biznet:
//    - Internet Biznet September (FDS) = 1.050.000
//    - Internet Biznet & Pemasangan (FDS) = 1.503.000
//    Total Biznet FDS = 1.050.000 + 1.503.000 = 2.553.000

const modalFds = 19238207;
const tokenFds1 = 3850000;
const tokenFds2 = 1200000;
const biznetFds = 2553000;

const totalFdsSep = modalFds + tokenFds1 + tokenFds2 + biznetFds;
console.log('Total FDS September if all included:', totalFdsSep);
console.log('Target FDS September in Excel:', 25641207);
console.log('Difference in FDS:', totalFdsSep - 25641207);
