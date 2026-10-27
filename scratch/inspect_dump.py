import re

with open(r'scratch\folder_dump.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("File size:", len(content))

# Look for occurrences of 'Maret' or 'xlsx' or 'docx'
for ext in ['xlsx', 'docx', 'pdf', 'Maret', 'SI ']:
    matches = [m.start() for m in re.finditer(re.escape(ext), content, re.IGNORECASE)]
    print(f"Matches for '{ext}': {len(matches)}")
    for idx in matches[:5]:
        snippet = content[max(0, idx - 100):min(len(content), idx + 100)]
        print(f"   [{ext}] ... {snippet!r} ...")
