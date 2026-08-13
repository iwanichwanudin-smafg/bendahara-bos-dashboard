import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

function classifyItem(desc, cat) {
  const d = (desc || '').toLowerCase();
  const c = (cat || '').toLowerCase();

  // 1. Honor & Gaji
  if (
    d.includes('gaji') || d.includes('honor') || d.includes('insentif') || d.includes('transport') ||
    d.includes('riski') || d.includes('pangestu') || d.includes('mahmud') || d.includes('narasumber') ||
    c.includes('honor') || c.includes('gaji') || c.includes('pegawai') || c.includes('personel')
  ) {
    return 'Honor';
  }

  // 2. Buku
  if (
    d.includes('buku') || d.includes('novel') || d.includes('kitab') || d.includes('modul') || d.includes('bacaan') ||
    c.includes('buku')
  ) {
    if (d.includes('buku kuitansi') || d.includes('buku nota') || d.includes('kuitansi')) {
      return 'Operasional';
    }
    return 'Buku';
  }

  // 3. Modal
  if (
    c.includes('modal') || d.includes('laptop') || d.includes('printer') || d.includes('ac ') || d.includes('gree') ||
    d.includes('sofa') || d.includes('ranjang') || d.includes('mikroskop') || d.includes('microscope') ||
    d.includes('tensi meter') || d.includes('penhancur') || d.includes('wastafel') || d.includes('meja') ||
    d.includes('kursi') || d.includes('rak ') || d.includes('ssd') || d.includes('white board') || d.includes('whiteboard') ||
    d.includes('neraca') || d.includes('torso') || d.includes('globe') || d.includes('jangka') || d.includes('scoreboard') ||
    d.includes('mesin')
  ) {
    return 'Modal';
  }

  // 4. Default: Operasional
  return 'Operasional';
}

const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

let categoryTotals = {
  'Operasional': { real: 0, unreal: 0 },
  'Honor': { real: 0, unreal: 0 },
  'Modal': { real: 0, unreal: 0 },
  'Buku': { real: 0, unreal: 0 }
};

let grandReal = 0;
let grandUnreal = 0;

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const catType = classifyItem(item.desc, item.kategori);
    
    // Realisasi (Jan-Jun)
    let itemReal = 0;
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        if (realizedMonths.includes(mKey)) {
          const r = item.realisasi[mKey];
          if (r && !r.batal) {
            const q = r.qty !== undefined ? r.qty : (item.qty || 0);
            const h = r.harga !== undefined ? r.harga : (item.harga || 0);
            itemReal += (q * h);
          }
        }
      });
    }

    // Total Anggaran Konsolidasi (Sem 1 + Sem 2 = Rp 1.344.883.000)
    // Wait, let's see how much was planned for Sem 2 (Jul-Des)
    // In our dashboard, total net BOS is Rp 1.350.310.000, and grand total realisasi + anggaran is Rp 1.344.883.000 (Real Sem 1: 660.353.976 + Anggaran Sem 2: 684.529.024)
  });
});

console.log('Test done');
