import re
import os

with open('src/data/catalogue.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

# Extract all image paths in RAW_PRODUCTS
images = re.findall(r"image:\s*'([^']+)'", ts_code)
print(f'Total images in catalogue.ts: {len(images)}')

missing = []
found = []
for img in images:
    clean = img.lstrip('/')
    disk_path = os.path.join('public', clean.replace('/', os.sep))
    if not os.path.exists(disk_path):
        missing.append((img, disk_path))
    else:
        found.append((img, disk_path))

print(f'Found on disk: {len(found)}')
print(f'Missing on disk: {len(missing)}')
for m in missing[:15]:
    print('  Missing:', m[0])
