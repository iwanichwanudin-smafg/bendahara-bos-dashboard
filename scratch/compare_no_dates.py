import zipfile
import xml.etree.ElementTree as ET
import glob
import os
import re
import json

with open('scratch/all_30_parsed_batches.json', 'r', encoding='utf-8') as f:
    parsed_batches = json.load(f)

for idx, b in enumerate(parsed_batches, 1):
    folder = os.path.dirname(b['localPath'])
    docxs = [f for f in glob.glob(os.path.join(folder, '*.docx')) if 'Kwitansi' not in os.path.basename(f)]
    
    docx_no = ''
    docx_date = ''
    
    if docxs:
        with zipfile.ZipFile(docxs[0]) as z:
            xml = z.read('word/document.xml')
            tree = ET.fromstring(xml)
            txt = ' '.join(tree.itertext())
            m_no = re.search(r'Nomor\s*:\s*([0-9A-Za-z\/\-\.]+)', txt)
            if m_no: docx_no = m_no.group(1).strip()
            m_date = re.search(r'Bekasi,\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})', txt)
            if m_date: docx_date = m_date.group(1).strip()
            
    print(f"{idx:2d}. {b['monthFolder']:<12} | DOCX No: {docx_no:<24} | XLS No: {b['nomorSI']:<24} | Tanggal: {docx_date}")
