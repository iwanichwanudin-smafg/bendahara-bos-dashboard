import fs from 'fs';

const jsonPath = 'c:/Users/smafu/.gemini/antigravity-ide/scratch/bendahara-bos-dashboard/imported_data.json';
const importedData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Remove Iuran FKSS item from Unit 1 (PUTRA)
importedData[1] = (importedData[1] || []).filter(item => !item.desc.includes('Iuran FKSS'));

fs.writeFileSync(jsonPath, JSON.stringify(importedData, null, 2));

console.log('Removed Iuran FKSS item from Unit 1 (PUTRA) in imported_data.json.');
