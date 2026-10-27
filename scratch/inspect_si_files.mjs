import XLSX from 'xlsx';
import fs from 'fs';

const files = [
  'public/samples/SI_BJB_BOSP_Februari_1.xlsx',
  'C:/Users/smafu/Downloads/SI BJB - BOSP (Februari 2) (1).xlsx',
  'C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 1).xlsx',
  'C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 2).xlsx',
  'C:/Users/smafu/Downloads/SI BJB - BOSP (Maret 3).xlsx'
];

for (const f of files) {
  try {
    if (!fs.existsSync(f)) {
      console.log('File does not exist:', f);
      continue;
    }
    const buf = fs.readFileSync(f);
    const wb = XLSX.read(buf, { type: 'buffer' });
    console.log('\n=============================================');
    console.log('FILE:', f);
    for (const name of wb.SheetNames) {
      const s = wb.Sheets[name];
      const rows = XLSX.utils.sheet_to_json(s, { header: 1, defval: '' });
      console.log('Sheet:', name, 'Total Rows:', rows.length);
      for (let i = 0; i < Math.min(15, rows.length); i++) {
        const line = rows[i].filter(c => c !== '').join(' | ');
        if (line) console.log(`  [${i}] ${line}`);
      }
    }
  } catch (err) {
    console.error('Error:', f, err.message);
  }
}
