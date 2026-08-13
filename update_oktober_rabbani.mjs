import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot & Excel for RABBANI (Unit 5) - Oktober:
const oktoberRabbaniItems = [
  { jenis: 'Operasional', desc: 'Kertas A4', link: 'Paperone 75 gsm', qty: 60, satuan: 'rim', harga: 70000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: 'Paperone 75 gsm', qty: 5, satuan: 'rim', harga: 80000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Spidol whiteboard', link: 'snowman', qty: 4, satuan: 'lusin / box', harga: 111000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard', link: 'ink marking', qty: 23, satuan: 'btl', harga: 27000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Penghapus whiteboard joyco magnet', link: '-', qty: 23, satuan: 'pcs', harga: 13000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Box File merk Bambi Biru dan hitam uk. Jumbo (1033)', link: 'Bambi', qty: 96, satuan: 'pcs', harga: 59000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Bola Voli Molten V5M5000 Flistatec Original', link: 'https://tk.tokopedia.com/ZSa8qXVYx/', qty: 5, satuan: 'buah', harga: 1010000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Net Voli MITZUDA VN 285 Original', link: 'https://tk.tokopedia.com/ZS5TpKs5X/', qty: 3, satuan: 'pcs', harga: 935000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Pluit', link: 'https://shopee.co.id/CALARY-Peluit-Wasit-120db', qty: 5, satuan: 'pcs', harga: 38000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Raket Bulu Tangkis', link: 'https://tk.tokopedia.com/ZS5TucCb5/', qty: 20, satuan: 'pcs', harga: 565000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Shuttelcok / Bola Bulu Tangkis JP gold ', link: 'https://tk.tokopedia.com/ZS53t6xG6/', qty: 50, satuan: 'slop / tabung', harga: 226000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Minyak but but', link: '-', qty: 8, satuan: 'botol', harga: 63000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Minyak Kayu Putih 120 ml', link: '-', qty: 8, satuan: 'botol', harga: 63000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Plester Luka', link: '-', qty: 8, satuan: 'pak / 10 lembar', harga: 13000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Obat Tetes Mata', link: 'rohto / insto', qty: 4, satuan: 'botol', harga: 27000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Betadine 5 ml', link: '-', qty: 4, satuan: 'botol', harga: 16000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Obat maag', link: '-', qty: 5, satuan: 'pak', harga: 38000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Freshcare 10 ml', link: '-', qty: 10, satuan: 'buah', harga: 26000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Revanol 300 ml', link: '-', qty: 4, satuan: 'botol', harga: 19000, tgl: '2026-10-15' }
];

const formattedRabbaniItems = oktoberRabbaniItems.map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Oktober',
  realisasi: {
    'Oktober': {
      tgl: item.tgl,
      qty: item.qty,
      harga: item.harga,
      link: 'Rencana Anggaran (Plan)',
      invoice: `RAB-OKT-RABBANI-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Update Unit 5 (Rabbani) for Oktober
importedData[5] = [...(importedData[5] || []).filter(i => i.bulan !== 'Oktober'), ...formattedRabbaniItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

let totalRabbaniNominal = formattedRabbaniItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Updated RABBANI (Unit 5) - Oktober with ${formattedRabbaniItems.length} items. Total: Rp ${totalRabbaniNominal.toLocaleString('id-ID')}`);
