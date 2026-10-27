import sqlite3
import os

db_path = r"scratch\History_copy"
if not os.path.exists(db_path):
    print("History_copy not found")
    exit(0)

conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("SELECT url, title FROM urls WHERE url LIKE '%drive.google.com%' ORDER BY last_visit_time DESC LIMIT 100")
rows = c.fetchall()
print(f"Total rows found: {len(rows)}")
for url, title in rows:
    print(f"{url} | {title}")
