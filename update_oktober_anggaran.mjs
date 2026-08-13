import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - Oktober Anggaran:
const oktoberPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Oktober', link: '-', qty: 1, satuan: 'bulan', harga: 7960000, totalNominal: 7960000, tgl: '2026-10-01' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5800000, totalNominal: 5800000, tgl: '2026-10-28' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, totalNominal: 6300000, tgl: '2026-10-28' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, totalNominal: 4200000, tgl: '2026-10-28' }
];

// 2. FG MAHAD (Unit 2) - Oktober Anggaran:
const oktoberMahadItems = [
  { jenis: 'Modal', desc: 'Mesin penghancur kertas Krisbow', link: 'https://tk.tokopedia.com/ZS5hVLqWL/', qty: 1, satuan: 'pcs', harga: 1745000, totalNominal: 1745000, tgl: '2026-10-15' },
  { jenis: 'Modal', desc: 'Sofa perpustakaan (3 Seater)', link: '-', qty: 1, satuan: 'pcs', harga: 4355000, totalNominal: 4355000, tgl: '2026-10-15' }
];

// 3. FG PUTRI BS (Unit 3) - Oktober Anggaran (Exact 6.854.100):
const oktoberBSItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Matras (Olahraga) 100x200x10cm', link: 'https://tk.tokopedia.com/ZSP5Ssu5d/', qty: 2, satuan: 'pcs', harga: 995000, totalNominal: 1990000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Larutan Eosin 100ml', link: '-', qty: 1, satuan: 'botol', harga: 100000, totalNominal: 100000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Minyak Sawit/Goreng 2000ml', link: '-', qty: 1, satuan: 'botol', harga: 69000, totalNominal: 69000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Suntikan Aquascape 5ml', link: '-', qty: 20, satuan: 'pcs', harga: 4000, totalNominal: 80000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Aquabidest 5 liter (air penyulingan)', link: '-', qty: 4, satuan: 'jerigen', harga: 40000, totalNominal: 160000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Pot sampel urine 60ml', link: '-', qty: 100, satuan: 'pcs', harga: 4000, totalNominal: 400000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Soda Api 1000gr', link: '-', qty: 1, satuan: 'kg', harga: 50000, totalNominal: 50000, tgl: '2026-10-15' },
  { jenis: 'Operasional', desc: 'Jangka', link: '-', qty: 40, satuan: 'pcs', harga: 12000, totalNominal: 480000, tgl: '2026-10-15' },

  // MODAL
  { jenis: 'Modal', desc: 'Globe Dunia 30 cm', link: '-', qty: 1, satuan: 'pcs', harga: 225000, totalNominal: 225000, tgl: '2026-10-15' },

  // BUKU
  { jenis: 'Buku', desc: 'Tuhan, Beri Aku Alasan untuk Tidak Menyerah', link: '-', qty: 2, satuan: 'eks', harga: 94000, totalNominal: 188000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Cambridge Grammar and Writing Skills', link: '-', qty: 2, satuan: 'eks', harga: 324000, totalNominal: 648000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Developing Skill for TOEFL iBT', link: '-', qty: 1, satuan: 'eks', harga: 137100, totalNominal: 137100, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'General Knowledge', link: '-', qty: 1, satuan: 'eks', harga: 218000, totalNominal: 218000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Wonderful World 1 Tempat-Tempat Indah Dan Menakjubkan', link: '-', qty: 1, satuan: 'eks', harga: 217000, totalNominal: 217000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Wonderful World 2 Tempat-Tempat Indah Dan Menakjubkan', link: '-', qty: 1, satuan: 'eks', harga: 274000, totalNominal: 274000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Wonderful World 3 Tempat-Tempat Indah Dan Menakjubkan', link: '-', qty: 1, satuan: 'eks', harga: 212000, totalNominal: 212000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Simply AI: Facts Made Fast - DK Simply - 9780241684176', link: '-', qty: 1, satuan: 'eks', harga: 398000, totalNominal: 398000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Simply Emerging Technology: Facts Made Fast - DK Simply - 978', link: '-', qty: 1, satuan: 'eks', harga: 411000, totalNominal: 411000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Simply Physics: Facts Made Fast - DK Simply - 9780241722756', link: '-', qty: 1, satuan: 'eks', harga: 436000, totalNominal: 436000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Tenang', link: '-', qty: 1, satuan: 'eks', harga: 106000, totalNominal: 106000, tgl: '2026-10-20' },
  { jenis: 'Buku', desc: 'Buku tanya Jawab psikologi muslimah (aqwam)', link: '-', qty: 1, satuan: 'eks', harga: 55000, totalNominal: 55000, tgl: '2026-10-20' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
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
        invoice: `RAB-OKT-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'Oktober'), ...formatItems(oktoberPutraItems, 'PUTRA')];

// Update Unit 2 (MAHAD)
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'Oktober'), ...formatItems(oktoberMahadItems, 'MAHAD')];

// Update Unit 3 (BS)
importedData[3] = [...(importedData[3] || []).filter(i => i.bulan !== 'Oktober'), ...formatItems(oktoberBSItems, 'BS')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

const totalBS = oktoberBSItems.reduce((a, b) => a + (b.qty * b.harga), 0);
console.log(`Oktober Anggaran items updated successfully for PUTRA, MAHAD, and BS. Total BS = Rp ${totalBS.toLocaleString('id-ID')}`);
