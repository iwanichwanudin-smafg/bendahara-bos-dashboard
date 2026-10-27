import json

with open(r"scratch\extracted_gdrive_resources.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"=== ALL SPREADSHEETS ({len(data['spreadsheets'])}) ===")
for s in data['spreadsheets']:
    print(f"{s['title']} | ID: {s['id']} | URL: {s['url']}")
