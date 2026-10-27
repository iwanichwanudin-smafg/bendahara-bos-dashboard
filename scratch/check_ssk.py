import re

with open(r'c:\Users\smafu\.gemini\antigravity-ide\scratch\bendahara-bos-dashboard\scratch\folder_dump.html', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'ssk=\'5:auSv138:([^\']+)\'', content)
print(f"Total ssk matches: {len(matches)}")
for m in matches:
    print(f"RAW ssk: {m}")
