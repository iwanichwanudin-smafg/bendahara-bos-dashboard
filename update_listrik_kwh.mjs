import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find Tagihan Listrik Januari in Unit 1 (PUTRA)
const unit1Items = importedData[1] || [];
const listrikItem = unit1Items.find(item => item.desc === 'Tagihan Listrik Januari' && item.bulan === 'Januari');

if (listrikItem) {
  listrikItem.qty = 4758;
  if (listrikItem.realisasi && listrikItem.realisasi.Januari) {
    listrikItem.realisasi.Januari.qty = 4758;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== UPDATE TAGIHAN LISTRIK JANUARI BERHASIL ===');
console.log(`Desc   : ${listrikItem.desc}`);
console.log(`Qty    : ${listrikItem.qty} kWh`);
console.log(`Harga  : Rp ${listrikItem.harga.toLocaleString('id-ID')} / kWh`);
console.log(`Total  : Rp ${(listrikItem.qty * listrikItem.harga).toLocaleString('id-ID')}`);
