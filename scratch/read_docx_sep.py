import zipfile
import xml.etree.ElementTree as ET
import os

def read_docx(path):
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        text = []
        for elem in tree.iter():
            if elem.tag.endswith('t'):
                if elem.text:
                    text.append(elem.text)
        return ' '.join(text)

p1 = './downloaded_si/09 September/SI 1 Tagihan Listrik &amp; Internet Sep 2026/106 SI BJB-REG Pindah buku (Sep 1).docx'
p2 = './downloaded_si/09 September/SI 1 Tagihan Listrik &amp; Internet Sep 2026/Kwitansi Koordinator BOS Sep 2026.docx'

if os.path.exists(p1):
    print("=== DOCX 106 ===")
    print(read_docx(p1)[:2000])

if os.path.exists(p2):
    print("\n=== KWITANSI KOORDINATOR ===")
    print(read_docx(p2)[:2000])
