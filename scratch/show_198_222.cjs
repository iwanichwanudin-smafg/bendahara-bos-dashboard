const fs = require('fs');
const readline = require('readline');

async function showSteps() {
  const fileStream = fs.createReadStream('C:/Users/smafu/.gemini/antigravity-ide/brain/912f4f22-67f1-48d6-ac10-d4871fc70da3/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  for await (const line of rl) {
    if (line.includes('"step_index":198') || line.includes('"step_index":222')) {
      const p = JSON.parse(line);
      console.log('=== STEP', p.step_index, '===');
      p.tool_calls.forEach(tc => {
        console.log(tc.name, tc.args.Description);
        if (tc.args.TargetContent) {
          console.log('--- TARGET CONTENT ---');
          console.log(tc.args.TargetContent.slice(0, 300));
          console.log('--- REPLACEMENT CONTENT ---');
          console.log(tc.args.ReplacementContent.slice(0, 300));
        }
        if (tc.args.ReplacementChunks) {
          tc.args.ReplacementChunks.forEach((c, idx) => {
            console.log('CHUNK', idx);
            console.log('TARGET:', c.TargetContent.slice(0, 150));
            console.log('REPLACEMENT:', c.ReplacementContent.slice(0, 150));
          });
        }
      });
    }
  }
}
showSteps();
