import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - September Anggaran:
const septemberPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik September', link: '-', qty: 1, satuan: 'bulan', harga: 7960000, totalNominal: 7960000, tgl: '2026-09-01' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5800000, totalNominal: 5800000, tgl: '2026-09-28' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, totalNominal: 6300000, tgl: '2026-09-28' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, totalNominal: 4200000, tgl: '2026-09-28' },
  { jenis: 'Modal', desc: 'Lenovo IdeaPad Slim intel core i3 Gen 13', link: 'https://tk.tokopedia.com/ZSaro9e6q/', qty: 3, satuan: 'pcs', harga: 9585000, totalNominal: 28755000, tgl: '2026-09-15' }
];

// 2. FG MAHAD (Unit 2) - September Anggaran:
const septemberMahadItems = [
  { jenis: 'Modal', desc: 'Mic stand', link: 'https://tk.tokopedia.com/ZS56UVvor/', qty: 1, satuan: 'pcs', harga: 488700, totalNominal: 488700, tgl: '2026-09-15' }
];

// 3. FG PUTRI BS (Unit 3) - September Anggaran:
const septemberBSItems = [
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 hitam', link: 'https://tk.tokopedia.com/ZSPftkvRo/', qty: 15, satuan: 'btl', harga: 123000, totalNominal: 1845000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 biru', link: 'https://tk.tokopedia.com/ZS5qFpgc6/', qty: 15, satuan: 'btl', harga: 120000, totalNominal: 1800000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 kuning', link: 'https://tk.tokopedia.com/ZS5qFpgc6/', qty: 15, satuan: 'btl', harga: 120000, totalNominal: 1800000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Epson 003 merah megenta', link: 'https://tk.tokopedia.com/ZS5qFpgc6/', qty: 15, satuan: 'btl', harga: 120000, totalNominal: 1800000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Canon G1020 warna hitam', link: 'https://tk.tokopedia.com/ZSPfWpvdm/', qty: 15, satuan: 'btl', harga: 187000, totalNominal: 2805000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Canon G1020 biru', link: 'https://tk.tokopedia.com/ZS5qyM44Q/', qty: 15, satuan: 'btl', harga: 162000, totalNominal: 2430000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Canon G1020 kuning', link: 'https://tk.tokopedia.com/ZS5qyRmTu/', qty: 15, satuan: 'btl', harga: 162000, totalNominal: 2430000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Tinta printer Canon G 1020 magenta', link: 'https://tk.tokopedia.com/ZS5qy6Kjk/', qty: 15, satuan: 'btl', harga: 162000, totalNominal: 2430000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Cartridge Canon G 1020 warna hitam (BH 70)', link: 'https://tk.tokopedia.com/ZS5qPy3Ej/', qty: 10, satuan: 'pcs', harga: 800000, totalNominal: 8000000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Catridge Canon G1020 Colour (CH 70)', link: 'https://tk.tokopedia.com/ZS5qPAk8U/', qty: 6, satuan: 'pcs', harga: 788000, totalNominal: 4728000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Cartridge Canon Ip 2770 hitam (810)', link: 'https://tk.tokopedia.com/ZSP5f7HGy/', qty: 6, satuan: 'pcs', harga: 319000, totalNominal: 1914000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Cartridge Canon IP 2770 colour (811)', link: 'https://tk.tokopedia.com/ZS5qma1Ld/', qty: 6, satuan: 'pcs', harga: 400000, totalNominal: 2400000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Toner Cartridge Compatible Samsung MLT D105 SCX 4623', link: 'https://tk.tokopedia.com/ZSP5aN5p2/', qty: 24, satuan: 'pcs', harga: 150000, totalNominal: 3600000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Sticky Note TJ-653 Neon', link: 'https://tk.tokopedia.com/ZS5XQ1Q7M/', qty: 50, satuan: 'pad', harga: 12000, totalNominal: 600000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Raket Bulu Tangkis', link: 'https://tk.tokopedia.com/ZS5TucCb5/', qty: 15, satuan: 'pcs', harga: 565000, totalNominal: 8475000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Shuttelcok / Bola Bulu Tangkis JP gold', link: 'https://tk.tokopedia.com/ZS53t6xG6/', qty: 10, satuan: 'slop', harga: 226000, totalNominal: 2260000, tgl: '2026-09-15' },
  { jenis: 'Operasional', desc: 'Bola kasti', link: 'https://tk.tokopedia.com/ZSP5agdrE/', qty: 5, satuan: 'slop / tabung', harga: 140000, totalNominal: 700000, tgl: '2026-09-15' },
  { jenis: 'Modal', desc: 'Kit tes golongan darah', link: 'https://id.shp.ee/savH3Sx', qty: 1, satuan: 'set', harga: 647000, totalNominal: 647000, tgl: '2026-09-15' },
  { jenis: 'Modal', desc: 'KIT uji set makanan', link: 'https://tk.tokopedia.com/ZSPf1YUmU/', qty: 1, satuan: 'set', harga: 810000, totalNominal: 810000, tgl: '2026-09-15' },
  { jenis: 'Modal', desc: 'Peta Indonesia size besar', link: '-', qty: 1, satuan: 'pcs', harga: 165000, totalNominal: 165000, tgl: '2026-09-15' },
  { jenis: 'Modal', desc: 'Peta Dunia size besar', link: 'https://tk.tokopedia.com/ZSaTtMe8x/', qty: 1, satuan: 'pcs', harga: 299000, totalNominal: 299000, tgl: '2026-09-15' },
  { jenis: 'Modal', desc: 'KIT tenaga angin mini wind turbine generator', link: 'https://tk.tokopedia.com/ZSaTtToc5/', qty: 1, satuan: 'Pcs', harga: 218000, totalNominal: 218000, tgl: '2026-09-15' }
];

// 4. FG PUTRI FDS (Unit 4) - September Anggaran:
const septemberFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, totalNominal: 1200000, tgl: '2026-09-01' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, totalNominal: 4040000, tgl: '2026-09-01' },
  { jenis: 'Modal', desc: 'Lenovo IdeaPad Slim intel core i3 Gen 13', link: 'https://tk.tokopedia.com/ZSaro9e6q/', qty: 2, satuan: 'unit', harga: 9585000, totalNominal: 19170000, tgl: '2026-09-15' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'September',
    realisasi: {
      'September': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Rencana Anggaran (Plan)',
        invoice: `RAB-SEP-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'September'), ...formatItems(septemberPutraItems, 'PUTRA')];

// Update Unit 2 (MAHAD)
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'September'), ...formatItems(septemberMahadItems, 'MAHAD')];

// Update Unit 3 (BS)
importedData[3] = [...(importedData[3] || []).filter(i => i.bulan !== 'September'), ...formatItems(septemberBSItems, 'BS')];

// Update Unit 4 (FDS)
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'September'), ...formatItems(septemberFDSItems, 'FDS')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('September Anggaran items updated successfully for PUTRA, MAHAD, BS, and FDS.');
