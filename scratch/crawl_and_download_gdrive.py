import urllib.request
import re
import os
import time
import json

ROOT_FOLDER_ID = "1AL6WgBQJddT_AtNfOvZJB_BZo3gl2Upb"
DOWNLOAD_DIR = r"c:\Users\smafu\.gemini\antigravity-ide\scratch\bendahara-bos-dashboard\downloaded_si"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def clean_id(raw_id):
    # Strip the trailing -\d+-\d+ suffix like -0-16, -0-17, etc.
    cleaned = re.sub(r'-\d+-\d+$', '', raw_id)
    return cleaned

def fetch_folder_items(folder_id):
    url = f"https://drive.google.com/drive/folders/{folder_id}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=25) as res:
            html = res.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"  [ERROR] fetching folder {folder_id}: {e}", flush=True)
        return []

    items = []
    # Match aria-label and ssk pattern
    p1 = re.findall(r'aria-label="([^"]+)"[^>]*ssk=\'5:auSv138:([a-zA-Z0-9_-]+)', html)
    for label, raw_id in p1:
        fid = clean_id(raw_id)
        is_folder = 'folder' in label.lower()
        items.append({
            'label': label,
            'id': fid,
            'is_folder': is_folder
        })
        
    return items

def download_file(file_id, label, output_path):
    if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
        print(f"    [Already Exists] {os.path.basename(output_path)}", flush=True)
        return True

    urls_to_try = []
    if label.lower().endswith('.xlsx') or 'excel' in label.lower() or 'spreadsheet' in label.lower():
        urls_to_try.append(f"https://docs.google.com/spreadsheets/d/{file_id}/export?format=xlsx")
    if label.lower().endswith('.docx') or 'word' in label.lower():
        urls_to_try.append(f"https://docs.google.com/document/d/{file_id}/export?format=docx")
    
    # Direct drive download
    urls_to_try.append(f"https://drive.google.com/uc?export=download&id={file_id}")

    for url in urls_to_try:
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as res:
                data = res.read()
                if len(data) > 500 and not (b'<!DOCTYPE html' in data[:100] or b'<html' in data[:100]):
                    with open(output_path, 'wb') as f:
                        f.write(data)
                    print(f"    [Downloaded] {os.path.basename(output_path)} ({len(data)} bytes)", flush=True)
                    return True
        except Exception:
            pass

    print(f"    [FAILED] Could not download {label} (ID: {file_id})", flush=True)
    return False

def main():
    print(f"=== STARTING COMPREHENSIVE GOOGLE DRIVE CRAWLER ===", flush=True)
    print(f"Root: {ROOT_FOLDER_ID}", flush=True)
    
    month_folders = fetch_folder_items(ROOT_FOLDER_ID)
    print(f"Found {len(month_folders)} month folders:", flush=True)
    for m in month_folders:
        print(f" - {m['label']} (ID: {m['id']})", flush=True)

    all_downloads = []

    for m in month_folders:
        if not m['is_folder']:
            continue
        m_name = m['label'].replace(' Shared folder', '').strip()
        month_dir = os.path.join(DOWNLOAD_DIR, m_name)
        os.makedirs(month_dir, exist_ok=True)
        print(f"\n==========================================", flush=True)
        print(f"--- MONTH: {m_name} (Folder ID: {m['id']}) ---", flush=True)
        print(f"==========================================", flush=True)
        time.sleep(1)

        si_folders = fetch_folder_items(m['id'])
        print(f"Found {len(si_folders)} items in {m_name}", flush=True)
        
        for sf in si_folders:
            if sf['is_folder']:
                si_name = sf['label'].replace(' Shared folder', '').strip()
                si_dir = os.path.join(month_dir, si_name)
                os.makedirs(si_dir, exist_ok=True)
                print(f"\n  [Subfolder] {si_name} (ID: {sf['id']})", flush=True)
                time.sleep(0.5)

                files = fetch_folder_items(sf['id'])
                for f in files:
                    clean_name = f['label']
                    for sfx in [' Microsoft Excel', ' Microsoft Word', ' PDF document', ' Shared folder']:
                        clean_name = clean_name.replace(sfx, '')
                    clean_name = clean_name.strip()
                    
                    if not f['is_folder'] and (clean_name.endswith('.xlsx') or clean_name.endswith('.docx')):
                        dest = os.path.join(si_dir, clean_name)
                        print(f"    File: {clean_name} (ID: {f['id']})", flush=True)
                        ok = download_file(f['id'], clean_name, dest)
                        all_downloads.append({
                            'month': m_name,
                            'si_folder': si_name,
                            'file_name': clean_name,
                            'file_id': f['id'],
                            'local_path': dest,
                            'success': ok
                        })
            else:
                # File directly in month folder
                clean_name = sf['label']
                for sfx in [' Microsoft Excel', ' Microsoft Word', ' PDF document']:
                    clean_name = clean_name.replace(sfx, '')
                clean_name = clean_name.strip()
                if clean_name.endswith('.xlsx') or clean_name.endswith('.docx'):
                    dest = os.path.join(month_dir, clean_name)
                    print(f"  [Direct File] {clean_name} (ID: {sf['id']})", flush=True)
                    ok = download_file(sf['id'], clean_name, dest)
                    all_downloads.append({
                        'month': m_name,
                        'si_folder': 'ROOT',
                        'file_name': clean_name,
                        'file_id': sf['id'],
                        'local_path': dest,
                        'success': ok
                    })

    # Save summary manifest
    manifest_path = os.path.join(DOWNLOAD_DIR, "manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(all_downloads, f, ensure_ascii=False, indent=2)

    print("\n==========================================", flush=True)
    print(f"CRAWL COMPLETE! Total files processed: {len(all_downloads)}", flush=True)
    successful = [d for d in all_downloads if d['success']]
    print(f"Successfully downloaded: {len(successful)} / {len(all_downloads)}", flush=True)

if __name__ == '__main__':
    main()
