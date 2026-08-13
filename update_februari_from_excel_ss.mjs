import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for Februari - PUTRA (Unit 1):
const februariPutraItems = [
  // OPERASIONAL
  { 
    jenis: 'Operasional', 
    desc: 'Tagihan Listrik Februari', 
    link: '-', 
    qty: 8632, 
    satuan: 'kWh', 
    harga: 950, 
    realQty: 1, 
    realPrice: 5453000, 
    tgl: '27 Feb 2026' 
  },
  { 
    jenis: 'Operasional', 
    desc: 'Jas Laboratorium MIPA (Uk L 8 pcs, Uk XL 8 pcs, Uk XXL 4 pcs)', 
    link: '-', 
    qty: 20, 
    satuan: 'pcs', 
    harga: 125000, 
    realQty: 20, 
    realPrice: 125000, 
    tgl: '12 Mar 2026' 
  },

  // GAJI
  { 
    jenis: 'Gaji', 
    desc: 'Riski Francisko', 
    link: '-', 
    qty: 1, 
    satuan: 'bulan', 
    harga: 5700000, 
    realQty: 1, 
    realPrice: 1952773, 
    tgl: '27 Feb 2026', 
    note: 'Perlu direvisi di Perubahan' 
  },
  { 
    jenis: 'Gaji', 
    desc: 'Pangestu Wibisono', 
    link: '-', 
    qty: 1, 
    satuan: 'bulan', 
    harga: 6300000, 
    realQty: 1, 
    realPrice: 5875893, 
    tgl: '27 Feb 2026' 
  },
  { 
    jenis: 'Gaji', 
    desc: 'Mahmud Syah Alam', 
    link: '-', 
    qty: 1, 
    satuan: 'bulan', 
    harga: 4200000, 
    realQty: 1, 
    realPrice: 3548376, 
    tgl: '27 Feb 2026' 
  },

  // MODAL
  { 
    jenis: 'Modal', 
    desc: 'Lenovo Monitor 24 inch D24-40 (Buat Perpus)', 
    link: '-', 
    qty: 1, 
    satuan: 'pcs', 
    harga: 1395000, 
    realQty: 1, 
    realPrice: 1395000, 
    tgl: '27 Feb 2026' 
  },
  { 
    jenis: 'Modal', 
    desc: 'Universal Bluetooth Keyboard (hitam) (Buat Perpus)', 
    link: '-', 
    qty: 1, 
    satuan: 'pcs', 
    harga: 155000, 
    realQty: 1, 
    realPrice: 155000, 
    tgl: '12 Mar 2026' 
  },
  { 
    jenis: 'Modal', 
    desc: 'Tablet Stand Holder Foldable 360 Rotatable merk AMINO', 
    link: '-', 
    qty: 1, 
    satuan: 'pcs', 
    harga: 110000, 
    realQty: 1, 
    realPrice: 110000, 
    tgl: '27 Feb 2026' 
  }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Februari',
  note: item.note || undefined,
  realisasi: {
    'Februari': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-FEB-PUTRA-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Exact items for MAHAD (Unit 2) - Februari:
const februariMahadItems = [
  { 
    jenis: 'Operasional', 
    desc: 'Tinta Printer HP Original 682 (Black dan Tricolor)', 
    link: '-', 
    qty: 4, 
    satuan: 'set', 
    harga: 460000, 
    realQty: 4, 
    realPrice: 460000, 
    tgl: '12 Mar 2026' 
  },
  { 
    jenis: 'Modal', 
    desc: 'Kursi kantor (Goto GC1003 BLACK)', 
    link: '-', 
    qty: 6, 
    satuan: 'pcs', 
    harga: 550000, 
    realQty: 6, 
    realPrice: 550000, 
    tgl: '13 Apr 2026' 
  }
].map(item => ({
  jenis: item.jenis,
  desc: item.desc,
  link: item.link,
  qty: item.qty,
  satuan: item.satuan,
  harga: item.harga,
  bulan: 'Februari',
  realisasi: {
    'Februari': {
      tgl: item.tgl,
      qty: item.realQty,
      harga: item.realPrice,
      link: 'Sudah BKU (Verified Screenshot)',
      invoice: `BKU-FEB-MAHAD-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Retain non-Februari items for Unit 1 & Unit 2
const otherUnit1 = (importedData[1] || []).filter(item => item.bulan !== 'Februari');
const otherUnit2 = (importedData[2] || []).filter(item => item.bulan !== 'Februari');

importedData[1] = [...otherUnit1, ...februariPutraItems];
importedData[2] = [...otherUnit2, ...februariMahadItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('=== VERIFIKASI PEMBARUAN SCREENSHOT FEBRUARI ===');
const totalRabPutra = februariPutraItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealPutra = februariPutraItems.reduce((s, i) => s + (i.realisasi.Februari.qty * i.realisasi.Februari.harga), 0);

const totalRabMahad = februariMahadItems.reduce((s, i) => s + (i.qty * i.harga), 0);
const totalRealMahad = februariMahadItems.reduce((s, i) => s + (i.realisasi.Februari.qty * i.realisasi.Februari.harga), 0);

console.log(`PUTRA RAB Target : 28.560.400 -> Calculated: Rp ${totalRabPutra.toLocaleString('id-ID')} (${totalRabPutra === 28560400 ? 'MATCH ✓' : 'DIFF ✗'})`);
console.log(`PUTRA Realisasi  : Calculated: Rp ${totalRealPutra.toLocaleString('id-ID')}`);
console.log(`MAHAD Total      : Target 5.140.000  -> Calculated: Rp ${totalRabMahad.toLocaleString('id-ID')} (${totalRabMahad === 5140000 ? 'MATCH ✓' : 'DIFF ✗'})`);
