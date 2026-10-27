import sqlite3
import shutil
import os

history_orig = r'C:\Users\smafu\AppData\Local\Google\Chrome\User Data\Default\History'
history_copy = r'c:\Users\smafu\.gemini\antigravity-ide\scratch\bendahara-bos-dashboard\scratch\History_copy'

shutil.copy2(history_orig, history_copy)

conn = sqlite3.connect(history_copy)
cursor = conn.cursor()

query = "SELECT target_path, tab_url, start_time FROM downloads WHERE target_path LIKE '%SI%' OR target_path LIKE '%BJB%' OR target_path LIKE '%BOSP%' ORDER BY start_time DESC"
cursor.execute(query)

rows = cursor.fetchall()
print(f'Total downloaded SI matches: {len(rows)}')
for r in rows:
    path = r[0]
    exists = os.path.exists(path)
    url = r[1]
    print(f'[{exists}] {path}')
    if not exists:
        print(f'   URL: {url}')

conn.close()
