import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find Tagihan Listrik Januari in Unit 1 (PUTRA)
const unit1Items = importedData[1] || [];
const listrikItem = unit1Items.find(item => item.desc === 'Tagihan Listrik Januari' && item.bulan === 'Januari');

if (listrikItem) {
  listrikItem.qty = 4758; // RAB planned kWh = 4758
  listrikItem.harga = 950;
  
  if (listrikItem.realisasi && listrikItem.realisasi.Januari) {
    listrikItem.realisasi.Januari.qty = 4667; // Actual BKU realized kWh = 4667
    listrikItem.realisasi.Januari.harga = 950;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== PEMBARUAN TAGIHAN LISTRIK JANUARI ===');
console.log(`RAB Planned Qty    : ${listrikItem.qty} kWh`);
console.log(`RAB Total          : Rp ${(listrikItem.qty * listrikItem.harga).toLocaleString('id-ID')}`);
console.log(`Realisasi BKU Qty  : ${listrikItem.realisasi.Januari.qty} kWh`);
console.log(`Realisasi Total    : Rp ${(listrikItem.realisasi.Januari.qty * listrikItem.realisasi.Januari.harga).toLocaleString('id-ID')}`);
