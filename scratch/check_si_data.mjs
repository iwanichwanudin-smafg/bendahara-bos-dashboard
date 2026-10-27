import { readFileSync } from 'fs';

const content = readFileSync('src/data/initialData.js', 'utf8');

// Find all SI batch IDs
const idMatches = content.match(/"id":\s*"SI-[^"]+"/g);
const nomorMatches = content.match(/"nomorSI":\s*"[^"]+"/g);
const tanggalMatches = content.match(/"tanggalFormat":\s*"[^"]+"/g);

console.log('=== SI Batch IDs in initialData.js ===');
if (idMatches) idMatches.forEach(m => console.log(m));
else console.log('None found');

console.log('\n=== Nomor SI ===');
if (nomorMatches) nomorMatches.forEach(m => console.log(m));
else console.log('None found');

console.log('\n=== Tanggal SI ===');
if (tanggalMatches) tanggalMatches.forEach(m => console.log(m));
else console.log('None found');
