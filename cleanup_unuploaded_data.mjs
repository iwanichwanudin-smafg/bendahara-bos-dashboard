import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const verifiedMonths = ['Januari', 'Februari'];

let clearedCount = 0;
let totalClearedNominal = 0;

for (let unitId = 1; unitId <= 5; unitId++) {
  const items = data[unitId] || [];
  items.forEach(item => {
    if (!verifiedMonths.includes(item.bulan)) {
      if (item.realisasi && Object.keys(item.realisasi).length > 0) {
        Object.keys(item.realisasi).forEach(m => {
          const r = item.realisasi[m];
          totalClearedNominal += (r.qty || 0) * (r.harga || 0);
          clearedCount++;
        });
        item.realisasi = {};
      }
    } else {
      if (item.realisasi) {
        Object.keys(item.realisasi).forEach(m => {
          const r = item.realisasi[m];
          if (!r.link || !r.link.includes('Verified')) {
            totalClearedNominal += (r.qty || 0) * (r.harga || 0);
            clearedCount++;
            delete item.realisasi[m];
          }
        });
      }
    }
  });
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`Cleared ${clearedCount} unverified realisasi records totaling Rp ${totalClearedNominal.toLocaleString('id-ID')}.`);
