import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - Desember Anggaran:
const desemberPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik Desember', link: '-', qty: 1, satuan: 'bulan', harga: 7960000, tgl: '2026-12-01' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5800000, tgl: '2026-12-28' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, tgl: '2026-12-28' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, tgl: '2026-12-28' }
];

// 2. FG MAHAD (Unit 2) - Desember Anggaran:
const desemberMahadItems = [
  { jenis: 'Modal', desc: 'Ranjang UKS', link: 'https://tk.tokopedia.com/ZSanALqXw/', qty: 1, satuan: 'unit', harga: 2985000, tgl: '2026-12-15' },
  { jenis: 'Modal', desc: 'AC Gree 3pk', link: 'https://tk.tokopedia.com/ZS56U1LaB/', qty: 1, satuan: 'pcs', harga: 5595000, tgl: '2026-12-15' },
  { jenis: 'Modal', desc: 'Meja makan', link: 'https://tk.tokopedia.com/ZS5jyXAHV/', qty: 2, satuan: 'pcs', harga: 5845000, tgl: '2026-12-15' },
  { jenis: 'Modal', desc: 'Kursi makan', link: 'https://tk.tokopedia.com/ZS5jyXb6G/', qty: 5, satuan: 'pcs', harga: 200000, tgl: '2026-12-15' }
];

// 4. FG PUTRI FDS (Unit 4) - Desember Anggaran:
const desemberFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, tgl: '2026-12-01' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, tgl: '2026-12-01' },
  { jenis: 'Modal', desc: 'Meja Kerja Karyawan (100CM-Cokelat)', link: 'https://id.shp.ee/KbofwqJ', qty: 4, satuan: 'unit', harga: 400000, tgl: '2026-12-15' },
  { jenis: 'Modal', desc: 'Kursi kantor (Goto GC1003 BLACK)', link: 'https://tk.tokopedia.com/ZS5jf8dYR/', qty: 4, satuan: 'unit', harga: 550000, tgl: '2026-12-15' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'Desember',
    realisasi: {
      'Desember': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Rencana Anggaran (Plan)',
        invoice: `RAB-DES-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'Desember'), ...formatItems(desemberPutraItems, 'PUTRA')];
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'Desember'), ...formatItems(desemberMahadItems, 'MAHAD')];
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'Desember'), ...formatItems(desemberFDSItems, 'FDS')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('Desember Anggaran items updated successfully for PUTRA, MAHAD, and FDS.');
