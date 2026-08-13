import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const sem2Months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let totalCleared = 0;

Object.keys(importedData).forEach(unitId => {
  const items = importedData[unitId] || [];
  items.forEach(item => {
    if (item.realisasi) {
      sem2Months.forEach(m => {
        if (item.realisasi[m]) {
          delete item.realisasi[m];
          totalCleared++;
        }
      });
      // If realisasi object is now empty, delete it
      if (Object.keys(item.realisasi).length === 0) {
        delete item.realisasi;
      }
    }
  });
});

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== BERHASIL MEMBERSIHKAN DATA MOCK REALISASI TAHAP 2 ===');
console.log(`Jumlah realisasi Tahap 2 yang dibersihkan: ${totalCleared} item`);
console.log('Tahap 2 (Juli - Desember) sekarang 100% berstatus Rencana Belanja (Belum Dibelanjakan / Realisasi = Rp 0)');
