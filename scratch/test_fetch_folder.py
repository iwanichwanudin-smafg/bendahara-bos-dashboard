import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1L4yb59RXSBSI3j7aTA03L3Xn9gMfHHEB'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req, timeout=15) as res:
        html = res.read().decode('utf-8', errors='ignore')
        print('Fetched HTML length:', len(html))
        
        with open(r'scratch\folder_dump.html', 'w', encoding='utf-8') as f:
            f.write(html)
            
        print("Dumped to scratch/folder_dump.html")
except Exception as e:
    print('Error:', e)
