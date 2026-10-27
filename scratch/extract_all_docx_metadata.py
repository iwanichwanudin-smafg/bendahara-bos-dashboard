import zipfile
import xml.etree.ElementTree as ET
import glob
import os
import re
import json

month_folders = [
    '02 Februari', '03 Maret', '04 April', '05 Mei', '06 Juni',
    '07 Juli', '08 Agustus', '09 September', '10 Oktober'
]

results = []

for mf in month_folders:
    base_m_dir = os.path.join('downloaded_si', mf)
    if not os.path.exists(base_m_dir):
        continue
    
    subdirs = sorted([d for d in os.listdir(base_m_dir) if os.path.isdir(os.path.join(base_m_dir, d))])
    
    for sd in subdirs:
        full_dir = os.path.join(base_m_dir, sd)
        docxs = [f for f in glob.glob(os.path.join(full_dir, '*.docx')) if 'Kwitansi' not in os.path.basename(f)]
        excels = [f for f in glob.glob(os.path.join(full_dir, '*.xlsx')) if 'TANDA TERIMA' not in os.path.basename(f) and 'Belanja BOS' not in os.path.basename(f) and 'Presensi' not in os.path.basename(f)]
        
        # Sort excels to prioritize "SI BJB"
        excels.sort(key=lambda x: 0 if 'SI BJB' in os.path.basename(x) else 1)
        
        docx_file = docxs[0] if docxs else None
        excel_file = excels[0] if excels else None
        
        nomor_si = ''
        tanggal_str = ''
        nominal_docx = 0
        perihal = 'Surat Perintah Pemindahbukuan (Belanja Operasional BOSP)'
        
        if docx_file:
            try:
                with zipfile.ZipFile(docx_file) as z:
                    xml = z.read('word/document.xml')
                    tree = ET.fromstring(xml)
                    txt = ' '.join(tree.itertext())
                    
                    m_no = re.search(r'Nomor\s*:\s*([0-9A-Za-z\/\-\.]+)', txt)
                    if m_no: nomor_si = m_no.group(1).strip()
                    
                    m_date = re.search(r'Bekasi,\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})', txt)
                    if m_date: tanggal_str = m_date.group(1).strip()
                    
                    m_perihal = re.search(r'Perihal\s*:\s*([^\n\r]+?)(?:Kepada|$)', txt)
                    if m_perihal: perihal = m_perihal.group(1).strip()
                    
                    m_amt = re.search(r'Jumlah\s*:\s*Rp\.?\s*([\d\.,]+)', txt)
                    if m_amt:
                        raw_num = re.sub(r'\D', '', m_amt.group(1))
                        if raw_num: nominal_docx = int(raw_num)
            except Exception as e:
                print(f"Error reading {docx_file}: {e}")
                
        results.append({
            'monthFolder': mf,
            'siFolder': sd,
            'docxFile': os.path.basename(docx_file) if docx_file else '',
            'excelFile': os.path.basename(excel_file) if excel_file else '',
            'excelPath': excel_file,
            'nomorSI': nomor_si,
            'tanggalStr': tanggal_str,
            'nominalDocx': nominal_docx,
            'perihal': perihal
        })

with open('scratch/docx_metadata.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"Extracted metadata for {len(results)} SIs to scratch/docx_metadata.json")
