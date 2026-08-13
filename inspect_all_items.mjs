import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

Object.keys(data).forEach(unitId => {
  console.log(`\n--- UNIT ${unitId} ---`);
  const items = data[unitId] || [];
  items.forEach(item => {
    let itemSum = 0;
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        const r = item.realisasi[mKey];
        if (r && !r.batal) {
          const q = r.qty !== undefined ? r.qty : (item.qty || 0);
          const h = r.harga !== undefined ? r.harga : (item.harga || 0);
          itemSum += (q * h);
        }
      });
    }
    if (itemSum > 0) {
      console.log(`[${item.kategori || 'N/A'}] ${item.desc} | Total: Rp ${itemSum.toLocaleString('id-ID')}`);
    }
  });
});
