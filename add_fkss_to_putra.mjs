import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Iuran FKSS Item for FG PUTRA (Unit 1):
// Total 799 siswa x Rp 25.000 = Rp 19.975.000 (Anggaran Iuran FKSS Konsolidasi)
const fkssItem = {
  jenis: 'Operasional',
  desc: 'Iuran FKSS (799 Siswa x Rp 25.000)',
  link: '-',
  qty: 799,
  satuan: 'siswa',
  harga: 25000,
  bulan: 'Juli',
  realisasi: {
    'Juli': {
      tgl: '2026-07-15',
      qty: 799,
      harga: 25000,
      link: 'Rencana Anggaran (Plan)',
      invoice: 'RAB-JUL-PUTRA-FKSS'
    }
  }
};

// Check if item already exists in Unit 1 (PUTRA)
const putraItems = importedData[1] || [];
const existingIndex = putraItems.findIndex(i => i.desc.includes('Iuran FKSS'));

if (existingIndex >= 0) {
  putraItems[existingIndex] = fkssItem;
} else {
  putraItems.push(fkssItem);
}

importedData[1] = putraItems;

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Successfully added Iuran FKSS (Rp ${(799 * 25000).toLocaleString('id-ID')}) to FG PUTRA Anggaran (Bulan Juli).`);
