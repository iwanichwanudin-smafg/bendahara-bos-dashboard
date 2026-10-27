const fs = require('fs');
const readline = require('readline');

async function showStep21Full() {
  const fileStream = fs.createReadStream('C:/Users/smafu/.gemini/antigravity-ide/brain/03d6ee16-2d4d-416f-adc0-9d07f187aab4/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  for await (const line of rl) {
    if (line.includes('"step_index":21')) {
      const p = JSON.parse(line);
      const lines = p.content.split('\n');
      console.log('Total lines in step 21:', lines.length);
      console.log(lines.slice(35, 142).join('\n'));
      break;
    }
  }
}
showStep21Full();
