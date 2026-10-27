import urllib.request
import re

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def test_fetch(fid):
    url = f"https://drive.google.com/drive/folders/{fid}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as res:
        html = res.read().decode('utf-8', errors='ignore')
    
    matches = re.findall(r'aria-label="([^"]+)"[^>]*ssk=\'5:auSv138:([a-zA-Z0-9_-]+)', html)
    print(f"Folder {fid} has {len(matches)} items:", flush=True)
    for label, raw_id in matches:
        cid = raw_id.split('-')[0]
        print(f"  {label} -> {cid}", flush=True)

print("Fetching ROOT:", flush=True)
test_fetch("1AL6WgBQJddT_AtNfOvZJB_BZo3gl2Upb")
