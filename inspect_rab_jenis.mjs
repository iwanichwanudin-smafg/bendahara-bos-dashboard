import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

let totalsByJenis = {
  'Operasional': { real: 0, unreal: 0, total: 0 },
  'Gaji': { real: 0, unreal: 0, total: 0 },
  'Honor': { real: 0, unreal: 0, total: 0 },
  'Buku': { real: 0, unreal: 0, total: 0 },
  'Belanja Modal': { real: 0, unreal: 0, total: 0 },
  'Modal': { real: 0, unreal: 0, total: 0 },
  'Other': { real: 0, unreal: 0, total: 0 }
};

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const jenis = item.jenis || 'Other';
    if (!totalsByJenis[jenis]) totalsByJenis[jenis] = { real: 0, unreal: 0, total: 0 };
    
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        const r = item.realisasi[mKey];
        if (r && !r.batal) {
          const q = r.qty !== undefined ? r.qty : (item.qty || 0);
          const h = r.harga !== undefined ? r.harga : (item.harga || 0);
          const val = q * h;
          if (val > 0) {
            if (realizedMonths.includes(mKey)) {
              totalsByJenis[jenis].real += val;
            } else {
              totalsByJenis[jenis].unreal += val;
            }
            totalsByJenis[jenis].total += val;
          }
        }
      });
    }
  });
});

console.log('=== TOTALS BY item.jenis IN RAB DATA ===');
Object.keys(totalsByJenis).forEach(j => {
  const t = totalsByJenis[j];
  if (t.total > 0) {
    console.log(`- ${j}: Realized (Sem 1) = Rp ${t.real.toLocaleString('id-ID')} | Belum Real (Sem 2) = Rp ${t.unreal.toLocaleString('id-ID')} | Total = Rp ${t.total.toLocaleString('id-ID')}`);
  }
});
