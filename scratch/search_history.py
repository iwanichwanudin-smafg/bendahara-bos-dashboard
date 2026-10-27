import sqlite3
import json

db_path = r"scratch\History_copy"
conn = sqlite3.connect(db_path)
c = conn.cursor()

c.execute("""
SELECT url, title, last_visit_time 
FROM urls 
WHERE url LIKE '%drive.google.com%' 
   OR url LIKE '%docs.google.com%'
   OR title LIKE '%SI BJB%'
   OR title LIKE '%Pindah buku%'
   OR title LIKE '%Pindah Buku%'
   OR title LIKE '%Kwitansi Koordinator%'
   OR title LIKE '%TANDA TERIMA HONORARIUM%'
ORDER BY last_visit_time DESC
""")

rows = c.fetchall()
results = []
for url, title, lvt in rows:
    results.append({
        'url': url,
        'title': title,
        'last_visit_time': lvt
    })

with open(r"scratch\gdrive_urls.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Successfully saved {len(results)} items to scratch/gdrive_urls.json")
