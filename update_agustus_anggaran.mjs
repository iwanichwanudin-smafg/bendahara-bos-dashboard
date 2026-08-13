import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - Agustus Anggaran:
const agustusPutraItems = [
  // OPERASIONAL
  { jenis: 'Operasional', desc: 'Tagihan Listrik Agustus', link: '-', qty: 1, satuan: 'bulan', harga: 7950000, totalNominal: 7950000, tgl: '2026-08-01' },

  // GAJI
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5800000, totalNominal: 5800000, tgl: '2026-08-28' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, totalNominal: 6300000, tgl: '2026-08-28' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, totalNominal: 4200000, tgl: '2026-08-28' },

  // MODAL
  { jenis: 'Modal', desc: 'Set Meja Kursi Siswa', link: '-', qty: 50, satuan: 'pcs', harga: 995000, totalNominal: 49750000, tgl: '2026-08-15' },
  { jenis: 'Modal', desc: 'Kotak Penyimpanan HP', link: '-', qty: 12, satuan: 'pcs', harga: 470000, totalNominal: 5640000, tgl: '2026-08-15' },

  // BUKU
  { jenis: 'Buku', desc: 'Buku Golden ways anak Sholeh', link: '-', qty: 1, satuan: 'pcs', harga: 44000, totalNominal: 44000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Buku good bye fairy', link: '-', qty: 1, satuan: 'pcs', harga: 131000, totalNominal: 131000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Buku Physics 12th Edition', link: '-', qty: 1, satuan: 'pcs', harga: 728000, totalNominal: 728000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Bupena Kimia XII - Erlangga', link: '-', qty: 19, satuan: 'eks', harga: 146000, totalNominal: 2774000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Bupena Kimia XI - Erlangga', link: '-', qty: 8, satuan: 'eks', harga: 204000, totalNominal: 1632000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Ekonomi XII - Erlangga', link: '-', qty: 27, satuan: 'eks', harga: 140000, totalNominal: 3780000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'IPS Sosiologi Kls X SMA/MA [ Kur Merdeka ] - B Aksara', link: '-', qty: 47, satuan: 'eks', harga: 138000, totalNominal: 6486000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Modul Sosiologi Kls XI SMA/MA [ Kur Merdeka ] - B Aksara', link: '-', qty: 25, satuan: 'eks', harga: 124000, totalNominal: 3100000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Modul Sosiologi Kls XII SMA/MA [ Kur Merdeka ] - B Aksara', link: '-', qty: 35, satuan: 'eks', harga: 141000, totalNominal: 4935000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Geografi XII - Yrama Widya', link: '-', qty: 31, satuan: 'eks', harga: 193000, totalNominal: 5983000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Mandiri Matematika Tingkat Lanjut XII - Erlangga', link: '-', qty: 19, satuan: 'eks', harga: 219000, totalNominal: 4161000, tgl: '2026-08-20' },
  { jenis: 'Buku', desc: 'Mandiri Matematika XII Kumer - Erlangga', link: '-', qty: 47, satuan: 'eks', harga: 165000, totalNominal: 7755000, tgl: '2026-08-20' }
];

// 2. FG MAHAD (Unit 2) - Agustus Anggaran:
const agustusMahadItems = [
  { jenis: 'Modal', desc: 'Alat Gym', link: '-', qty: 1, satuan: 'pcs', harga: 6790000, totalNominal: 6790000, tgl: '2026-08-15' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'Agustus',
    realisasi: {
      'Agustus': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Rencana Anggaran (Plan)',
        invoice: `RAB-AGT-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'Agustus'), ...formatItems(agustusPutraItems, 'PUTRA')];

// Update Unit 2 (MAHAD)
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'Agustus'), ...formatItems(agustusMahadItems, 'MAHAD')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('Agustus Anggaran items updated successfully for PUTRA and MAHAD.');
