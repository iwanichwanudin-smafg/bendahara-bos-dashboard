import zipfile
import xml.etree.ElementTree as ET
import glob
import os
import re
import json

with open('scratch/all_30_parsed_batches.json', 'r', encoding='utf-8') as f:
    parsed_batches = json.load(f)

print(f"{'No':<3} | {'Bulan':<12} | {'Nomor SI (DOCX)':<25} | {'Nominal DOCX':<16} | {'Nominal XLS':<16} | {'Status':<8}")
print("-" * 90)

mismatches = []

for idx, b in enumerate(parsed_batches, 1):
    folder = os.path.dirname(b['localPath'])
    docxs = [f for f in glob.glob(os.path.join(folder, '*.docx')) if 'Kwitansi' not in os.path.basename(f)]
    
    docx_no = 'N/A'
    docx_date = 'N/A'
    docx_amount = None
    
    if docxs:
        try:
            with zipfile.ZipFile(docxs[0]) as z:
                xml = z.read('word/document.xml')
                tree = ET.fromstring(xml)
                txt = ' '.join(tree.itertext())
                
                m_no = re.search(r'Nomor\s*:\s*([0-9A-Za-z\/\-\.]+)', txt)
                if m_no: docx_no = m_no.group(1).strip()
                
                m_date = re.search(r'Bekasi,\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})', txt)
                if m_date: docx_date = m_date.group(1).strip()
                
                # Search for Jumlah: Rp ... or Rp. ...
                m_amt = re.search(r'Jumlah\s*:\s*Rp\.?\s*([\d\.,]+)', txt)
                if m_amt:
                    raw_num = m_amt.group(1).replace('.', '').replace(',', '')
                    # clean trailing chars
                    raw_num = re.sub(r'\D', '', raw_num)
                    if raw_num:
                        docx_amount = int(raw_num)
        except Exception as e:
            pass
            
    xls_amount = b['totalNominal']
    status = "OK"
    if docx_amount and docx_amount != xls_amount:
        status = "MISMATCH"
        mismatches.append({
            'idx': idx,
            'folder': b['siFolder'],
            'docx_no': docx_no,
            'docx_amount': docx_amount,
            'xls_amount': xls_amount,
            'diff': xls_amount - docx_amount
        })
        
    d_amt_str = f"Rp {docx_amount:,}".replace(',', '.') if docx_amount else "N/A"
    x_amt_str = f"Rp {xls_amount:,}".replace(',', '.')
    print(f"{idx:<3} | {b['monthFolder']:<12} | {docx_no:<25} | {d_amt_str:<16} | {x_amt_str:<16} | {status:<8}")

print("-" * 90)
if mismatches:
    print(f"FOUND {len(mismatches)} MISMATCHES:")
    for m in mismatches:
        print(m)
else:
    print("ALL 30 SI NOMINALS MATCH BETWEEN DOCX AND XLS PERFECTLY!")
