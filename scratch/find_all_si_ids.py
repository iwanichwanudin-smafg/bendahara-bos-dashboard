import json
import re

with open(r"scratch\gdrive_urls.json", "r", encoding="utf-8") as f:
    items = json.load(f)

sheets_map = {}
docs_map = {}

for it in items:
    url = it.get('url', '')
    title = it.get('title', '')
    
    # Spreadsheets
    m_s = re.search(r'docs\.google\.com/spreadsheets/d/([a-zA-Z0-9_-]+)', url)
    if m_s:
        sid = m_s.group(1)
        clean_title = title.replace(' - Google Sheets', '').replace(' - Google Spreadsheet', '').strip()
        if sid not in sheets_map or (clean_title and not sheets_map[sid]):
            sheets_map[sid] = clean_title
            
    # Docs
    m_d = re.search(r'docs\.google\.com/document/d/([a-zA-Z0-9_-]+)', url)
    if m_d:
        did = m_d.group(1)
        clean_title = title.replace(' - Google Docs', '').strip()
        if did not in docs_map or (clean_title and not docs_map[did]):
            docs_map[did] = clean_title

    # Drive uc?id
    m_u = re.search(r'drive\.google\.com/uc\?id=([a-zA-Z0-9_-]+)', url)
    if m_u:
        uid = m_u.group(1)
        clean_title = title.strip()
        if uid not in sheets_map:
            sheets_map[uid] = clean_title

print("=== FOUND SHEETS ===")
for sid, t in sorted(sheets_map.items(), key=lambda x: str(x[1])):
    if any(k in t.lower() for k in ['si', 'bosp', 'honor', 'mutasi', 'belanja']):
        print(f"SHEET: {t} -> {sid}")

print("\n=== FOUND DOCS ===")
for did, t in sorted(docs_map.items(), key=lambda x: str(x[1])):
    if any(k in t.lower() for k in ['si', 'pindah', 'kwitansi']):
        print(f"DOC: {t} -> {did}")
