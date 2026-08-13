import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json', 'utf8'));

console.log('=== INSPECTING ALL ITEMS ACROSS 5 UNITS ===');

const bookKeywords = ['buku', 'kitab', 'modul', 'lks', 'paket', 'novel', 'bacaan', 'kamus', 'quran', 'qur\'an', 'iqro', 'hadits', 'al-quran', 'majalah', 'jurnal', 'atlas', 'peta', 'ensiklopedia'];

let bookItemsFound = [];

Object.keys(data).forEach(unitId => {
  const items = data[unitId] || [];
  items.forEach(item => {
    const desc = (item.desc || '').toLowerCase();
    const cat = (item.kategori || '').toLowerCase();
    const isBook = bookKeywords.some(kw => desc.includes(kw) || cat.includes(kw));
    
    if (isBook) {
      bookItemsFound.push({
        unit: unitId,
        desc: item.desc,
        kategoriRAB: item.kategori,
        bulan: item.bulan,
        qty: item.qty,
        harga: item.harga,
        realisasi: item.realisasi
      });
    }
  });
});

console.log(`Found ${bookItemsFound.length} book-related items:`);
bookItemsFound.forEach((b, i) => {
  console.log(`${i+1}. [${b.unit}] ${b.desc} | RAB Cat: "${b.kategoriRAB}" | Bulan: ${b.bulan} | Harga: Rp ${b.harga.toLocaleString('id-ID')}`);
});
