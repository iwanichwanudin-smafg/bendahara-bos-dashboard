import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot 1 & 2 for FG PUTRI FDS (Unit 4) - April:
const aprilFDSItems = [
  // OPERASIONAL (Image 1)
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', totalNominal: 1200000, tgl: '2026-04-07' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', totalNominal: 4040000, tgl: '2026-04-07' },
  { jenis: 'Operasional', desc: 'Kertas A4', link: '-', qty: 70, satuan: 'rim', totalNominal: 3640000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: '-', qty: 80, satuan: 'rim', totalNominal: 4320000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Spidol Whiteboard', link: '-', qty: 9, satuan: 'lusin / box', totalNominal: 873000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Spidol Whiteboard (Refill 10)', link: '-', qty: 10, satuan: 'lusin / box', totalNominal: 970000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Spidol Whiteboard (Refill 6)', link: '-', qty: 6, satuan: 'lusin / box', totalNominal: 582000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard (Hitam)', link: '-', qty: 45, satuan: 'btl', totalNominal: 900000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard (Biru)', link: '-', qty: 45, satuan: 'btl', totalNominal: 900000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Tinta Spidol Whiteboard (Merah)', link: '-', qty: 45, satuan: 'btl', totalNominal: 900000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Penghapus whiteboard joyco magnet', link: '-', qty: 48, satuan: 'pcs', totalNominal: 432000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Amplop coklat merk Airmail', link: '-', qty: 24, satuan: 'pak', totalNominal: 1632000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Map Bussines File Uk F4 Biru, Kuning, Oren, Hijau', link: '-', qty: 24, satuan: 'lusin', totalNominal: 720000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Box File merk Bambi Biru dan hitam uk. Jumbo (1033)', link: '-', qty: 24, satuan: 'pcs', totalNominal: 864000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'Ordner Besar merk Bambi uk. F4 75mm (1010)', link: '-', qty: 24, satuan: 'pcs', totalNominal: 960000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL HITAM', link: '-', qty: 32, satuan: 'botol', totalNominal: 3424000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL WARNA (Cyan)', link: '-', qty: 16, satuan: 'botol', totalNominal: 1712000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL WARNA (Magenta)', link: '-', qty: 16, satuan: 'botol', totalNominal: 1712000, tgl: '2026-05-26' },
  { jenis: 'Operasional', desc: 'TINTA PRINTER EPSON L120 (664) ORIGINAL WARNA (Yellow)', link: '-', qty: 16, satuan: 'botol', totalNominal: 1712000, tgl: '2026-05-26' },

  // BUKU (Image 2)
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA KLS.11/KM', link: '-', qty: 57, satuan: 'eks', totalNominal: 7182000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.11/KM', link: '-', qty: 11, satuan: 'eks', totalNominal: 2222000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'SEJARAH SMA/MA KLS.11/KM', link: '-', qty: 57, satuan: 'eks', totalNominal: 9348000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'BIOLOGI SMA/MA KLS.11/KM', link: '-', qty: 21, satuan: 'eks', totalNominal: 6762000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'FISIKA SMA/MA KLS 11/KM', link: '-', qty: 11, satuan: 'eks', totalNominal: 2739000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'KIMIA SMA/MA KLS.XI/KM', link: '-', qty: 21, satuan: 'eks', totalNominal: 4284000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'EKONOMI SMA/MA KLS.11/KM REVISI', link: '-', qty: 31, satuan: 'eks', totalNominal: 4712000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'SOSIOLOGI SMA/MA KLS.11/KM REVISI', link: '-', qty: 47, satuan: 'eks', totalNominal: 5828000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'GEOGRAFI SMA/MA KLS.11/KM REVISI', link: '-', qty: 11, satuan: 'eks', totalNominal: 2024000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA KLS.12/KM', link: '-', qty: 58, satuan: 'eks', totalNominal: 9570000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.12/KM', link: '-', qty: 11, satuan: 'eks', totalNominal: 2409000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'SEJARAH SMA/MA KLS.12/KM', link: '-', qty: 58, satuan: 'eks', totalNominal: 8178000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'BIOLOGI SMA/MA KLS.12/KM', link: '-', qty: 21, satuan: 'eks', totalNominal: 4116000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'FISIKA SMA/MA KLS 12/KM', link: '-', qty: 11, satuan: 'eks', totalNominal: 1958000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'KIMIA SMA/MA KLS.XII/KM', link: '-', qty: 21, satuan: 'eks', totalNominal: 3066000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'EKONOMI SMA/MA KLS.12/KM REVISI', link: '-', qty: 31, satuan: 'eks', totalNominal: 4340000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'SOSIOLOGI SMA/MA KLS.12/KM REVISI', link: '-', qty: 47, satuan: 'eks', totalNominal: 6627000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'GEOGRAFI SMA/MA KLS.12/KM', link: '-', qty: 11, satuan: 'eks', totalNominal: 2123000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'ERLANGGA RPUL INDONESIA & DUNIA UTK SD, SMP, SMA &', link: '-', qty: 1, satuan: 'eks', totalNominal: 404000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'PANDUAN TANGGAP DARURAT BENCANA: BANJIR', link: '-', qty: 2, satuan: 'eks', totalNominal: 302000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'PAKET ENSIKLOPEDIA SAINS', link: '-', qty: 1, satuan: 'eks', totalNominal: 1375000, tgl: '2026-05-11' },
  { jenis: 'Buku', desc: 'BUKU POSTER: PETA DUNIA', link: '-', qty: 1, satuan: 'eks', totalNominal: 193000, tgl: '2026-05-11' }
];

const formattedFDSItems = aprilFDSItems.map(item => {
  const unitPrice = item.qty > 0 ? item.totalNominal / item.qty : item.totalNominal;
  return {
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: unitPrice,
    bulan: 'April',
    realisasi: {
      'April': {
        tgl: item.tgl,
        qty: item.qty,
        harga: unitPrice,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-APR-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  };
});

// Update Unit 4 (FDS) for April
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'April'), ...formattedFDSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log(`Updated FG PUTRI FDS (Unit 4) - April with ${formattedFDSItems.length} exact screenshot items.`);
let totalNominalApr = formattedFDSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Total Realisasi FG PUTRI FDS April: Rp ${totalNominalApr.toLocaleString('id-ID')}`);
