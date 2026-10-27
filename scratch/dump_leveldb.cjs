const fs = require('fs');
const path = 'C:/Users/smafu/AppData/Local/Google/Chrome/User Data/Default/Local Storage/leveldb';
const files = fs.readdirSync(path).filter(f => f.endsWith('.ldb') || f.endsWith('.log'));

files.forEach(f => {
  try {
    const buf = fs.readFileSync(path + '/' + f);
    // Find UTF-16LE or UTF-8 strings
    // In Chrome leveldb, strings can be UTF-16LE with \x00 between chars
    let str16 = '';
    for (let i = 0; i < buf.length; i += 2) {
      if (buf[i+1] === 0 && buf[i] >= 32 && buf[i] <= 126) {
        str16 += String.fromCharCode(buf[i]);
      } else {
        str16 += ' ';
      }
    }
    const str8 = buf.toString('latin1');
    
    [ { name: 'utf16', s: str16 }, { name: 'latin1', s: str8 } ].forEach(({ name, s }) => {
      let idx = 0;
      while ((idx = s.indexOf('bosku_', idx)) !== -1) {
        const snippet = s.slice(idx, idx + 4000);
        console.log(`[${f} / ${name} @ ${idx}]`);
        console.log(snippet.slice(0, 500));
        idx += 6;
      }
    });
  } catch(e) {
    console.error(f, e.message);
  }
});
