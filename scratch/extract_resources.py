import json
import re

with open(r"scratch\gdrive_urls.json", "r", encoding="utf-8") as f:
    items = json.load(f)

# Find all spreadsheets
spreadsheets = {}
docs = {}
folders = {}

for it in items:
    title = it.get('title') or ''
    url = it.get('url') or ''
    
    # Check spreadsheet
    m_sheet = re.search(r'docs\.google\.com/spreadsheets/d/([a-zA-Z0-9_-]+)', url)
    if m_sheet:
        sid = m_sheet.group(1)
        if sid not in spreadsheets or len(title) > len(spreadsheets[sid]['title']):
            spreadsheets[sid] = {'id': sid, 'title': title, 'url': url}
            
    # Check docs
    m_doc = re.search(r'docs\.google\.com/document/d/([a-zA-Z0-9_-]+)', url)
    if m_doc:
        did = m_doc.group(1)
        if did not in docs or len(title) > len(docs[did]['title']):
            docs[did] = {'id': did, 'title': title, 'url': url}

    # Check folders
    m_f = re.search(r'drive\.google\.com/drive/folders/([a-zA-Z0-9_-]+)', url)
    if m_f:
        fid = m_f.group(1)
        if fid not in folders or len(title) > len(folders[fid]['title']):
            folders[fid] = {'id': fid, 'title': title, 'url': url}

    # Check direct download or uc?id=
    m_uc = re.search(r'drive\.google\.com/uc\?id=([a-zA-Z0-9_-]+)', url)
    if m_uc:
        uid = m_uc.group(1)
        if uid not in spreadsheets:
            spreadsheets[uid] = {'id': uid, 'title': title, 'url': url}

print(f"=== SPREADSHEETS ({len(spreadsheets)}) ===")
for sid, data in spreadsheets.items():
    print(f"{data['title']} -> ID: {sid}")

print(f"\n=== GOOGLE DOCS ({len(docs)}) ===")
for did, data in docs.items():
    print(f"{data['title']} -> ID: {did}")

print(f"\n=== FOLDERS ({len(folders)}) ===")
for fid, data in folders.items():
    print(f"{data['title']} -> ID: {fid}")

# Save categorized
with open(r"scratch\extracted_gdrive_resources.json", "w", encoding="utf-8") as f:
    json.dump({
        'spreadsheets': list(spreadsheets.values()),
        'docs': list(docs.values()),
        'folders': list(folders.values())
    }, f, ensure_ascii=False, indent=2)
