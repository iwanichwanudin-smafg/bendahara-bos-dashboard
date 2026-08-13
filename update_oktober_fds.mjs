import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact items from Screenshot for FG PUTRI FDS (Unit 4) - Oktober:
const oktoberFDSItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, tgl: '2026-10-01' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, tgl: '2026-10-01' },
  { jenis: 'Operasional', desc: 'Jas Laboratorium MIPA (Uk.L 8 pcs, Uk.XL 8 pcs, Uk.XXL 4 pcs)', link: 'https://s.shopee.co.id/8zzVR4Yb2S?share_channel_code=1', qty: 26, satuan: 'pcs', harga: 125000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Beaker Glass 500 mL', link: 'https://id.shp.ee/M4aF7yM', qty: 2, satuan: 'pcs', harga: 95000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Beaker Glass 150 mL', link: 'https://id.shp.ee/cEuh6o5', qty: 2, satuan: 'pcs', harga: 45000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Beaker Glass 100 mL', link: 'https://id.shp.ee/kXk5i9N', qty: 2, satuan: 'pcs', harga: 40000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Beaker Glass 50 mL', link: 'https://id.shp.ee/wEH99q1', qty: 2, satuan: 'pcs', harga: 35000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Batang pengaduk 7 x 15 mm', link: 'https://id.shp.ee/i2Z7EVy', qty: 1, satuan: 'set', harga: 25000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Buret 50 mL', link: 'https://id.shp.ee/EKKWxHz', qty: 2, satuan: 'pcs', harga: 270000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Statif klem single', link: 'https://id.shp.ee/nhC9Ai3', qty: 2, satuan: 'set', harga: 255000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Pipet gondok 10 mL', link: 'https://id.shp.ee/RooV85b', qty: 2, satuan: 'pcs', harga: 90000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Pipet pump 10 mL', link: 'https://id.shp.ee/gKSL5LK', qty: 2, satuan: 'pcs', harga: 60000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Botol cokelat 200 mL', link: 'https://id.shp.ee/7ZmsTYt', qty: 10, satuan: 'pcs', harga: 20000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Botol semprot', link: 'https://id.shp.ee/J7s3T4N', qty: 2, satuan: 'pcs', harga: 40000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Botol pipet 60 ml', link: 'https://id.shp.ee/JXt8k1j', qty: 10, satuan: 'pcs', harga: 20000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Elektroda karbon', link: 'https://id.shp.ee/2z4wuu2', qty: 2, satuan: 'set', harga: 85000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Erlenmeyer 100 mL', link: 'https://id.shp.ee/qSXS8it', qty: 2, satuan: 'pcs', harga: 70000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Gelas Ukur 100 mL', link: 'https://id.shp.ee/CbEJzX7', qty: 2, satuan: 'pcs', harga: 115000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Gelas Ukur 25 mL', link: 'https://id.shp.ee/gDUq1WE', qty: 2, satuan: 'pcs', harga: 60000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Lampu pembakar spirtus 250 mL', link: 'https://id.shp.ee/x7SMAL7', qty: 2, satuan: 'pcs', harga: 55000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Labu ukur 50 mL', link: 'https://id.shp.ee/FZZcP1v', qty: 1, satuan: 'pcs', harga: 164224, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Labu ukur 100 mL', link: 'https://id.shp.ee/jYJEcL6', qty: 1, satuan: 'pcs', harga: 175000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Sikat tabung reaksi', link: 'https://id.shp.ee/gq1LzYa', qty: 5, satuan: 'pcs', harga: 15000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Pipa U sedang diameter 16 mm', link: 'https://id.shp.ee/FiKYToj', qty: 2, satuan: 'pcs', harga: 65000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Sarung Tangan Medis', link: 'https://shopee.co.id/Sarung-Tangan-Latex-Powder-Free-Box-isi-100-pcs-i.242558870.14292052895', qty: 4, satuan: 'box', harga: 69000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Penjepit kayu', link: 'https://tk.tokopedia.com/ZSanT5ex9/', qty: 4, satuan: 'pcs', harga: 13000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Alkohol 70%', link: 'https://www.tokopedia.com/rofalaboratorium/alkohol-70-alkohol-antiseptik-alkohol-untuk-luka-1-liter', qty: 1, satuan: 'liter', harga: 88000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Zinc sulfat', link: 'https://tk.tokopedia.com/ZSacnXFaq/', qty: 1, satuan: 'kg', harga: 212000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'HCl 32%', link: 'https://siplahbliblicom/product/asam-klorida-32-1-liter-botol-kaca-student-grade/SPKD-0001-00614', qty: 1, satuan: 'liter', harga: 224000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Aqua dest 20 L', link: 'https://siplahbliblicom/product/aquades-20-liter-student-grade/SPKD-0001-00604', qty: 1, satuan: 'jerigen', harga: 268000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Asam sulfat 98%', link: 'https://siplahbliblicom/product/asam-sulfat-98-1-liter-botol-kaca-student-grade/SPKD-0001-00625', qty: 1, satuan: 'liter', harga: 143000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Barium klorida 500 gram', link: 'https://id.shp.ee/NqBqHju', qty: 1, satuan: 'botol', harga: 137000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Glukosa', link: 'https://siplahbliblicom/product/glukosa-larutan-1-liter-student-grade/SPKD-0001-00661', qty: 1, satuan: 'botol', harga: 119000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'NaOH 40% 500 mL', link: 'https://id.shp.ee/m4kk4YD', qty: 1, satuan: 'botol', harga: 187000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Urine reagent strip', link: 'https://s.shopee.co.id/AUoJBuFDpL?share_channel_code=1', qty: 1, satuan: 'set', harga: 162000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Alcohol swab', link: 'https://s.shopee.co.id/2Vm1g5aNtn?share_channel_code=1', qty: 1, satuan: 'box', harga: 25000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Pen lancet device general', link: 'https://s.shopee.co.id/4q9wTd9KXr?share_channel_code=1', qty: 3, satuan: 'pcs', harga: 25000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Hidrogen peroksida 20%', link: 'https://siplahbliblicom/product/hidrogen-peroksida-20-1-liter-student-grade/SPKD-0001-00668', qty: 1, satuan: 'liter', harga: 97000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Kit Pembuatan Nata', link: 'https://s.shopee.co.id/AUoJGzscMv?share_channel_code=1', qty: 10, satuan: 'paket', harga: 56000, tgl: '2026-10-15' },

  // MODAL
  { jenis: 'Modal', desc: 'Tensi Meter Digital', link: 'https://s.shopee.co.id/9Uvm2c1x68?share_channel_code=1', qty: 1, satuan: 'pcs', harga: 485000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Strip blood test (Easy Touch)', link: 'https://s.shopee.co.id/8AQOPiYXKg?share_channel_code=1', qty: 3, satuan: 'set', harga: 574000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Easy Touch Digital', link: 'https://shopee.co.id/Easy-Touch-Gchb-Multi-Function-Monitoring-System-i.935938658.22181420278', qty: 2, satuan: 'set', harga: 485000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Torso Mata Manusia', link: 'https://s.shopee.co.id/1La4KVtrUt?share_channel_code=1', qty: 1, satuan: 'pcs', harga: 370000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Torso Anatomi Telinga', link: 'https://s.shopee.co.id/806yGrfX6H?share_channel_code=1', qty: 1, satuan: 'pcs', harga: 370000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Mikroskop Binokuler', link: 'https://s.shopee.co.id/9Kb2EyvtC8', qty: 1, satuan: 'unit', harga: 4355000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Neraca Laboratorium', link: 'https://id.shp.ee/PBsq32v', qty: 1, satuan: 'unit', harga: 1118000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Papan Tulis White Board', link: 'https://tk.tokopedia.com/ZSQymxVrG/', qty: 3, satuan: 'unit', harga: 750000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Kit tes golongan darah', link: 'https://id.shp.ee/savH3Sx', qty: 1, satuan: 'set', harga: 647000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Molymod (Model molekul kimia)', link: 'https://tk.tokopedia.com/ZSanfv7dP/', qty: 2, satuan: 'pcs', harga: 585000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Microslaid jaringan', link: 'https://tk.tokopedia.com/ZSanyDrkt/', qty: 10, satuan: 'pcs', harga: 63000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Kit Hidroponik + TDS & EC Meter Digital', link: 'https://s.shopee.co.id/9zs2hM2kzM?share_channel_code=1', qty: 3, satuan: 'pcs', harga: 460000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Buku ishara test 14 buta warna', link: 'https://tk.tokopedia.com/ZSaLLwJM5/', qty: 2, satuan: 'pcs', harga: 38000, tgl: '2026-10-15' }
];

const formattedFDSItems = oktoberFDSItems.map(item => ({
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
      invoice: `RAB-OKT-FDS-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
    }
  }
}));

// Update Unit 4 (FDS) for Oktober
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'Oktober'), ...formattedFDSItems];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

let totalFDSNominal = formattedFDSItems.reduce((sum, item) => sum + (item.qty * item.harga), 0);
console.log(`Updated FG PUTRI FDS (Unit 4) - Oktober with ${formattedFDSItems.length} items. Total: Rp ${totalFDSNominal.toLocaleString('id-ID')}`);
