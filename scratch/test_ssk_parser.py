import re

with open(r'c:\Users\smafu\.gemini\antigravity-ide\scratch\bendahara-bos-dashboard\scratch\folder_dump.html', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'aria-label="([^"]+)"[^>]*ssk=\'5:auSv138:([a-zA-Z0-9_-]+)', content)
print(f"Extracted {len(matches)} items:")
for label, fid in matches:
    print(f"  {label} -> ID: {fid}")
