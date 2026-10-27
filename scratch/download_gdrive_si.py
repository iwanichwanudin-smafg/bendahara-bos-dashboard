"""
Script untuk download semua file SI Excel dari Google Drive
Menggunakan Google Drive API (tanpa OAuth, hanya untuk folder publik)
"""

import urllib.request
import urllib.parse
import json
import os
import re
import time

DOWNLOAD_DIR = r"C:\Users\smafu\Downloads\SI_BJB_Downloaded"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Folder IDs yang sudah diketahui dari browser
# Format: (folder_id, bulan, si_number, expected_filename)
KNOWN_FOLDER_IDS = {
    'root': '1AL6WgBQJddT_AtNfOvZJB_BZo3gl2Upb',
    # Februari
    'Feb/SI1': '1o7CIP3hTte5J2Ub4ln7aktPK5GWbRetn',
    'Feb/SI2': '1Gyv04fBp_kdx3iyHTx-pRPPLvWjIRPYs',
    'Feb/SI3': '1aWWtn8OSRHR5qgFFrBbNQSbvScsxlBiY',
    # Maret
    'Mar/SI1': '1L4yb59RXSBSI3j7aTA03L3Xn9gMfHHEB',
    'Mar/SI2': '155ngD7qteDPVJYHR6RvGJNGZgT5SBmh3',
    'Mar/SI3': '1b04ANELHppFDoqcfKlbf3VhH7cbFy2wK',
    # April
    'Apr/SI1': '1cPH5AYpt_isW9Pq5r-xq7mf6g-SC7HuX',
    'Apr/SI2': '1f7YLfKO99A2SLiU_F3ncWnn13gvbCwHn',
    'Apr/SI3': '1unLqzLM-MoB4BW3f7CpQCb8DKMhcuqww',
}

def get_gdrive_folder_contents(folder_id):
    """
    Get file listing from a Google Drive folder using the web interface
    Returns list of {name, id, mimeType} dicts
    """
    # Use Google Drive's public API endpoint
    url = f"https://drive.google.com/drive/folders/{folder_id}"
    
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            content = response.read().decode('utf-8', errors='replace')
        return content
    except Exception as e:
        print(f"Error fetching folder {folder_id}: {e}")
        return None

def extract_file_ids_from_html(html_content):
    """Extract file IDs and names from Google Drive folder HTML"""
    files = []
    if not html_content:
        return files
    
    # Look for file data in the JavaScript embedded in the page
    # Google Drive embeds file info in window['_DRIVE_ivd'] or similar
    
    # Pattern 1: Look for file IDs in the data
    # Files in Google Drive folders appear as JSON data
    patterns = [
        r'"([a-zA-Z0-9_-]{25,})"[^}]*?"name":"([^"]+\.[a-z]{3,4})"',
        r'"name":"([^"]+\.xlsx)"[^}]*?"id":"([a-zA-Z0-9_-]{25,})"',
        r'"id":"([a-zA-Z0-9_-]{25,})"[^}]*?"name":"([^"]+\.xlsx)"',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, html_content)
        for match in matches:
            if len(match) == 2:
                id_val, name = match[0], match[1]
                if len(id_val) > 20 and '.' in name:
                    files.append({'id': id_val, 'name': name})
    
    return files

def download_gdrive_file(file_id, output_path):
    """Download a file from Google Drive by file ID"""
    # Try direct download URL
    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    
    try:
        req = urllib.request.Request(
            download_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            }
        )
        
        with urllib.request.urlopen(req, timeout=60) as response:
            content_type = response.headers.get('Content-Type', '')
            content_length = response.headers.get('Content-Length', 'unknown')
            print(f"  Content-Type: {content_type}, Size: {content_length}")
            
            data = response.read()
            
            # Check if it's HTML (confirmation page) vs actual file
            if b'<!DOCTYPE html' in data[:100] or b'<html' in data[:100]:
                print(f"  WARNING: Got HTML confirmation page, trying alternative URL...")
                return False
            
            with open(output_path, 'wb') as f:
                f.write(data)
            print(f"  ✅ Downloaded {len(data)} bytes to {output_path}")
            return True
            
    except Exception as e:
        print(f"  Error downloading {file_id}: {e}")
        return False

def try_get_file_id_from_folder(folder_id, target_extension='.xlsx'):
    """Try to find Excel files in a Google Drive folder"""
    print(f"\n  Fetching folder contents for ID: {folder_id}")
    html = get_gdrive_folder_contents(folder_id)
    
    if not html:
        return []
    
    # Save for debugging
    debug_path = os.path.join(DOWNLOAD_DIR, f"debug_{folder_id}.html")
    with open(debug_path, 'w', encoding='utf-8', errors='replace') as f:
        f.write(html[:50000])  # Save first 50KB for debugging
    
    # Try to extract file IDs
    files = extract_file_ids_from_html(html)
    xlsx_files = [f for f in files if f['name'].lower().endswith(target_extension)]
    
    print(f"  Found {len(files)} files total, {len(xlsx_files)} xlsx files")
    for f in xlsx_files:
        print(f"    - {f['name']} (ID: {f['id']})")
    
    return xlsx_files

# Test with Feb/SI1 folder
print("=== Testing Google Drive Access ===")
print(f"\nTesting folder: Feb/SI1 (ID: {KNOWN_FOLDER_IDS['Feb/SI1']})")
files = try_get_file_id_from_folder(KNOWN_FOLDER_IDS['Feb/SI1'])

print(f"\n=== Done! Check {DOWNLOAD_DIR} for debug HTML files ===")
print("\nNote: We may need to use a different approach to get file IDs.")
print("The debug HTML file will help us understand the data structure.")
