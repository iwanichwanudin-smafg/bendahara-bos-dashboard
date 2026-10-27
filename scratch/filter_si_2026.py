import json
import re

with open(r"scratch\gdrive_urls.json", "r", encoding="utf-8") as f:
    items = json.load(f)

print(f"Total history items: {len(items)}")

si_2026 = []
for it in items:
    t = it.get('title') or ''
    u = it.get('url') or ''
    
    # Matches for 2026 SI documents
    if any(k in t.lower() for k in ['si bjb', 'pindah buku', 'bosp', 'bosp 2026', 'mutasi bjb']) or \
       any(k in u.lower() for k in ['si%20bjb', 'pindah%20buku', 'bosp']):
        si_2026.append(it)

print(f"Found {len(si_2026)} SI 2026 related entries:")
seen = set()
for it in si_2026:
    t = it.get('title') or ''
    u = it.get('url') or ''
    key = (t, u[:80])
    if key not in seen:
        seen.add(key)
        print(f"[{t}] -> {u}")
