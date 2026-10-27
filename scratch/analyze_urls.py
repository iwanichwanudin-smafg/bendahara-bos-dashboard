import json
import re

with open(r"scratch\gdrive_urls.json", "r", encoding="utf-8") as f:
    items = json.load(f)

si_items = []
folders = []
for it in items:
    title = it.get('title') or ''
    url = it.get('url') or ''
    
    # Check if SI file or folder
    if any(k in title.lower() for k in ['si bjb', 'pindah buku', 'kwitansi', 'honorarium', 'belanja bos', '01 januari', '02 februari', '03 maret', '04 april', '05 mei', '06 juni', '07 juli', '08 agustus', '09 september', '10 oktober']) or 'drive/folders' in url:
        si_items.append(it)

print(f"Total relevant items: {len(si_items)}")
for it in si_items[:50]:
    print(f"[{it['title']}] -> {it['url']}")
