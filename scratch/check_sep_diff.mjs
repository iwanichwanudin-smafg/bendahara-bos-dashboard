import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { INITIAL_SI_BATCHES } from '../src/data/initialData.js';

// Let's examine September:
// In user Excel for September:
// PUTRA: 123.734.570
// MAHAD: 7.500.000
// BS: 65.225.000
// FDS: 25.641.207
// RABBANI: 0
// TOTAL SEPTEMBER in user Excel: 222.100.777

// In SI BJB for September:
// SI-106: 14.528.570 (Listrik & Internet)
// SI-132: 101.085.000 (Siplah Putra, BS, FDS)
// SI-143: 27.641.207 (Siplah Mahad & FDS)
// SI-144: 16.579.266 (Gaji September)
// SI-147: 63.146.000 (Siplah BS)
// Total SI BJB September: 14.528.570 + 101.085.000 + 27.641.207 + 16.579.266 + 63.146.000 = 222.980.043
// Difference: 222.980.043 - 222.100.777 = 879.266!

// User says:
// Selisih honor september yang dihitung user = 320.734.
// Let's check SI-144:
// SI-144 is 16.579.266.
// If honor in user's Excel was: 16.579.266 - 320.734 = 16.258.532!
// Or: 16.579.266 - 16.258.532 = 320.734!
// Then where does 558.532 come from in September?

console.log('16.579.266 - 320.734 =', 16579266 - 320734);
console.log('879.266 - 320.734 =', 879266 - 320734);

// Let's inspect the files in September folder:
const sepDir = './downloaded_si/09 September';
fs.readdirSync(sepDir).forEach(f => {
  console.log(`Item in Sep: ${f}`);
});
