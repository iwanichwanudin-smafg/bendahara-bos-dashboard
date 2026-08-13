import fs from 'fs';

const filePath = 'imported_data.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 6 Target items values:
// 1. Amplop Coklat / casing D: harga_final: 1.960.000, tahap1: 2.296.000, tahap2: -336.000
// 2. Tagihan Listrik P-1/TR 6.600 VA: harga_final: 6.310.697, tahap1: 6.453.350, tahap2: -142.653
// 3. Belanja Tagihan Listrik Bulanan: harga_final: 8.930.727, tahap1: 12.000.000, tahap2: -3.069.273
// 4. Honor Riski Francisko: harga_final: 11.052.271, tahap1: 15.200.000, tahap2: -4.147.729
// 5. Honor Pangestu Wibisono: harga_final: 17.969.641, tahap1: 18.480.000, tahap2: -510.359
// 6. Honor Mahmud Syah Alam: harga_final: 11.431.990, tahap1: 12.600.000, tahap2: -1.168.010

console.log('=== VERIFYING TARGET ITEM REVISIONS ===');

// Check unit 1 (FG PUTRA / SMAS Future Gate) items in globalRABData
let itemsUnit1 = data['1'] || [];

// Update items directly in Unit 1 or data structure
// Let's locate or update the 6 items
const updatesMap = [
  {
    desc: 'Amplop Coklat / casing D',
    match: (i) => i.desc && i.desc.toLowerCase().includes('amplop coklat'),
    volume: 28, satuan: 'pak', tarif: 82000,
    hargaFinal: 1960000, tahap1: 2296000, tahap2: -336000,
    kode_rekening: '5.1.02.01.01.06.05.08'
  },
  {
    desc: 'Tagihan Listrik P-1/TR 6.600 VA s.d. 200 kVA',
    match: (i) => (i.desc && i.desc.includes('6793')) || (i.desc && i.desc.toLowerCase().includes('tagihan listrik maret')),
    volume: 6793, satuan: 'kWh', tarif: 950,
    hargaFinal: 6310697, tahap1: 6453350, tahap2: -142653
  },
  {
    desc: 'Belanja Tagihan Listrik Bulanan',
    match: (i) => (i.desc && i.desc.toLowerCase().includes('tagihan listrik april')) || (i.desc && i.desc.toLowerCase().includes('belanja tagihan listrik bulanan')),
    volume: 1, satuan: 'bulan', tarif: 12000000,
    hargaFinal: 8930727, tahap1: 12000000, tahap2: -3069273
  },
  {
    desc: 'Honor Riski Francisko',
    match: (i) => i.desc && i.desc.includes('Riski Francisko') && (i.bulan === 'April' || i.qty === 80 || i.volume === 80 || i.harga === 190000),
    volume: 80, satuan: 'jam', tarif: 190000,
    hargaFinal: 11052271, tahap1: 15200000, tahap2: -4147729,
    kode_rekening: '7959770671130342'
  },
  {
    desc: 'Honor Pangestu Wibisono',
    match: (i) => i.desc && i.desc.includes('Pangestu Wibisono') && (i.bulan === 'April' || i.qty === 88 || i.volume === 88 || i.harga === 210000),
    volume: 88, satuan: 'jam', tarif: 210000,
    hargaFinal: 17969641, tahap1: 18480000, tahap2: -510359
  },
  {
    desc: 'Honor Mahmud Syah Alam',
    match: (i) => i.desc && i.desc.includes('Mahmud Syah Alam') && (i.bulan === 'April' || i.qty === 90 || i.volume === 90 || i.harga === 140000),
    volume: 90, satuan: 'jam', tarif: 140000,
    hargaFinal: 11431990, tahap1: 12600000, tahap2: -1168010,
    kode_rekening: '9642771672130312'
  }
];

updatesMap.forEach((u, idx) => {
  let found = false;
  itemsUnit1.forEach((item) => {
    if (u.match(item)) {
      item.desc = u.desc;
      item.volume = u.volume;
      item.qty = u.volume;
      item.satuan = u.satuan;
      item.tarif = u.tarif;
      item.harga = u.tarif;
      item.hargaFinal = u.hargaFinal;
      item.tahap1 = u.tahap1;
      item.tahap2 = u.tahap2;
      if (u.kode_rekening) item.kode_rekening = u.kode_rekening;
      found = true;
      console.log(`[UPDATED] Item ${idx + 1}: ${u.desc} -> Final: ${u.hargaFinal}, T1: ${u.tahap1}, T2: ${u.tahap2}`);
    }
  });
  if (!found) {
    // Add item if not found
    const newItem = {
      desc: u.desc,
      volume: u.volume,
      qty: u.volume,
      satuan: u.satuan,
      tarif: u.tarif,
      harga: u.tarif,
      hargaFinal: u.hargaFinal,
      tahap1: u.tahap1,
      tahap2: u.tahap2,
      bulan: 'April',
      jenis: u.desc.includes('Honor') ? 'Gaji' : 'Operasional',
      kode_rekening: u.kode_rekening || ''
    };
    itemsUnit1.push(newItem);
    console.log(`[ADDED NEW] Item ${idx + 1}: ${u.desc} -> Final: ${u.hargaFinal}, T1: ${u.tahap1}, T2: ${u.tahap2}`);
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('\nimported_data.json updated successfully.');
