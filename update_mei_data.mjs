import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - Mei:
const meiPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Mei', link: '-', qty: 1, satuan: 'bulan', harga: 7649029, totalNominal: 7649029, tgl: '2026-05-04' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5646479, totalNominal: 5646479, tgl: '2026-05-26' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6015186, totalNominal: 6015186, tgl: '2026-05-26' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 3789337, totalNominal: 3789337, tgl: '2026-05-26' }
];

// 2. FG PUTRI BS (Unit 3) - Mei:
const meiBSItems = [
  { jenis: 'Buku', desc: 'KODING DAN KECERDASAN ARTIFISIAL SMA/MA KLS.10/KM', link: '-', qty: 60, satuan: 'eks', harga: 143000, totalNominal: 8580000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.11/KM', link: '-', qty: 10, satuan: 'eks', harga: 202000, totalNominal: 2020000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'BIOLOGI SMA/MA KLS.11/KM', link: '-', qty: 10, satuan: 'eks', harga: 322000, totalNominal: 3220000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'FISIKA SMA/MA KLS.11/KM', link: '-', qty: 10, satuan: 'eks', harga: 249000, totalNominal: 2490000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'KIMIA SMA/MA KLS.XI/KM', link: '-', qty: 10, satuan: 'eks', harga: 204000, totalNominal: 2040000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'EKONOMI SMA/MA KLS.11/KM REVISI', link: '-', qty: 10, satuan: 'eks', harga: 152000, totalNominal: 1520000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'SOSIOLOGI SMA/MA KLS.11/KM REVISI', link: '-', qty: 10, satuan: 'eks', harga: 124000, totalNominal: 1240000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'GEOGRAFI SMA/MA KLS.11/KM REVISI', link: '-', qty: 10, satuan: 'eks', harga: 184000, totalNominal: 1840000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'MATEMATIKA SMA/MA TINGKAT LANJUT KLS.12/KM', link: '-', qty: 10, satuan: 'eks', harga: 219000, totalNominal: 2190000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'BIOLOGI SMA/MA KLS.12/KM', link: '-', qty: 10, satuan: 'eks', harga: 196000, totalNominal: 1960000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'FISIKA SMA/MA KLS.12/KM', link: '-', qty: 10, satuan: 'eks', harga: 178000, totalNominal: 1780000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'KIMIA SMA/MA KLS.XII/KM', link: '-', qty: 10, satuan: 'eks', harga: 146000, totalNominal: 1460000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'EKONOMI SMA/MA KLS.12/KM REVISI', link: '-', qty: 10, satuan: 'eks', harga: 140000, totalNominal: 1400000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'SOSIOLOGI SMA/MA KLS 12/KM', link: '-', qty: 10, satuan: 'eks', harga: 141000, totalNominal: 1410000, tgl: '2026-06-03' },
  { jenis: 'Buku', desc: 'GEOGRAFI SMA/MA KLS.12/KM', link: '-', qty: 10, satuan: 'eks', harga: 193000, totalNominal: 1930000, tgl: '2026-06-03' }
];

// 3. FG PUTRI FDS (Unit 4) - Mei:
const meiFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, totalNominal: 1200000, tgl: '2026-05-04' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, totalNominal: 4040000, tgl: '2026-05-04' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'Mei',
    realisasi: {
      'Mei': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Sudah BKU (Verified Screenshot)',
        invoice: `BKU-MEI-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

// Update Unit 1 (PUTRA)
importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'Mei'), ...formatItems(meiPutraItems, 'PUTRA')];

// Update Unit 3 (BS)
importedData[3] = [...(importedData[3] || []).filter(i => i.bulan !== 'Mei'), ...formatItems(meiBSItems, 'BS')];

// Update Unit 4 (FDS)
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'Mei'), ...formatItems(meiFDSItems, 'FDS')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('Mei items updated successfully for PUTRA, BS, and FDS.');
