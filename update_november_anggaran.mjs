import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. FG PUTRA (Unit 1) - November Anggaran:
const novemberPutraItems = [
  { jenis: 'Operasional', desc: 'Tagihan Listrik November', link: '-', qty: 1, satuan: 'bulan', harga: 7960000, tgl: '2026-11-01' },
  { jenis: 'Gaji', desc: 'Riski Francisko', link: '-', qty: 1, satuan: 'bulan', harga: 5800000, tgl: '2026-11-28' },
  { jenis: 'Gaji', desc: 'Pangestu Wibisono', link: '-', qty: 1, satuan: 'bulan', harga: 6300000, tgl: '2026-11-28' },
  { jenis: 'Gaji', desc: 'Mahmud Syah Alam', link: '-', qty: 1, satuan: 'bulan', harga: 4200000, tgl: '2026-11-28' }
];

// 2. FG MAHAD (Unit 2) - November Anggaran:
const novemberMahadItems = [
  { jenis: 'Modal', desc: 'Wastafel stainless', link: 'https://s.shopee.co.id/9zs6HGwo2n', qty: 1, satuan: 'pcs', harga: 685000, tgl: '2026-11-15' }
];

// 3. FG PUTRI BS (Unit 3) - November Anggaran:
const novemberBSItems = [
  { jenis: 'Operasional', desc: 'Kertas A4', link: 'Paperone 75 gsm', qty: 55, satuan: 'rim', harga: 70000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Kertas F4', link: 'Paperone 75 gsm', qty: 30, satuan: 'rim', harga: 80000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Konsumsi Pelatihan guru thinking Skill', link: '-', qty: 45, satuan: 'orang', harga: 30000, tgl: '2026-11-15' },
  { jenis: 'Honor', desc: 'Honor narasumber (IHT) Pelatihan guru thinking Skill', link: '-', qty: 2, satuan: 'Jam/pertemuan', harga: 1500000, tgl: '2026-11-15' }
];

// 4. FG PUTRI FDS (Unit 4) - November Anggaran:
const novemberFDSItems = [
  { jenis: 'Operasional', desc: 'Internet Indihome', link: '-', qty: 1, satuan: 'bulan', harga: 1200000, tgl: '2026-11-01' },
  { jenis: 'Operasional', desc: 'Listrik Token', link: '-', qty: 4, satuan: 'paket', harga: 1010000, tgl: '2026-11-01' }
];

// 5. RABBANI (Unit 5) - November Anggaran:
const novemberRabbaniItems = [
  { jenis: 'Operasional', desc: 'Bola Futsal Adidas', link: '-', qty: 15, satuan: 'pcs', harga: 502000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Bola Sepak Adidas', link: '-', qty: 5, satuan: 'pcs', harga: 625000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Bola Basket MOLTEN BG 4550 Size 7', link: '-', qty: 10, satuan: 'pcs', harga: 883000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Bola Tenis Meja / Bola Pingpong DHS Bintang 3', link: '-', qty: 20, satuan: 'pak', harga: 189000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Net Bulu Tangkis', link: '-', qty: 4, satuan: 'pcs', harga: 690000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Score Table / scoreboard manual', link: '-', qty: 2, satuan: 'pcs', harga: 502000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Skipping', link: '-', qty: 10, satuan: 'pcs', harga: 120000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Stop Watch', link: '-', qty: 5, satuan: 'pcs', harga: 220000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Cone Kerucut', link: '-', qty: 3, satuan: 'pak isi 10 pcs', harga: 107000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Cone Mangkok', link: '-', qty: 3, satuan: 'lusin', harga: 295000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Poster Planet', link: '-', qty: 5, satuan: 'pcs', harga: 26000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Poster Organ Tubuh', link: '-', qty: 5, satuan: 'pcs', harga: 26000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Peta Indonesia size besar', link: '-', qty: 5, satuan: 'pcs', harga: 165000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Kabel roll merk Loyal', link: '-', qty: 10, satuan: 'Roll', harga: 113000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Kabel LAN Belden', link: '-', qty: 1, satuan: 'Roll / 100 Meter', harga: 1443000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Connector RJ 45 Belden', link: '-', qty: 3, satuan: 'pak', harga: 440000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Kabel Ties', link: '-', qty: 5, satuan: 'pak', harga: 23000, tgl: '2026-11-15' },
  { jenis: 'Operasional', desc: 'Kabel Listrik Serabut Transparan, tembaga', link: '-', qty: 1, satuan: 'Roll / 100 meter', harga: 498000, tgl: '2026-11-15' }
];

function formatItems(items, unitCode) {
  return items.map(item => ({
    jenis: item.jenis,
    desc: item.desc,
    link: item.link,
    qty: item.qty,
    satuan: item.satuan,
    harga: item.harga,
    bulan: 'November',
    realisasi: {
      'November': {
        tgl: item.tgl,
        qty: item.qty,
        harga: item.harga,
        link: 'Rencana Anggaran (Plan)',
        invoice: `RAB-NOV-${unitCode}-${item.desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`
      }
    }
  }));
}

importedData[1] = [...(importedData[1] || []).filter(i => i.bulan !== 'November'), ...formatItems(novemberPutraItems, 'PUTRA')];
importedData[2] = [...(importedData[2] || []).filter(i => i.bulan !== 'November'), ...formatItems(novemberMahadItems, 'MAHAD')];
importedData[3] = [...(importedData[3] || []).filter(i => i.bulan !== 'November'), ...formatItems(novemberBSItems, 'BS')];
importedData[4] = [...(importedData[4] || []).filter(i => i.bulan !== 'November'), ...formatItems(novemberFDSItems, 'FDS')];
importedData[5] = [...(importedData[5] || []).filter(i => i.bulan !== 'November'), ...formatItems(novemberRabbaniItems, 'RABBANI')];

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('November Anggaran items updated successfully for ALL 5 UNITS.');
