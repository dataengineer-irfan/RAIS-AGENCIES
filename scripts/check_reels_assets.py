import re
import os

with open('src/data/reelsCalendar.ts', 'r', encoding='utf-8') as f:
    text = f.read()

imgs = re.findall(r"productImage:\s*assetUrl\(['\"]/images/products_catalogue/([^'\"]+)['\"]\)", text)
print(f'Total product images in reelsCalendar.ts: {len(imgs)}')

missing = []
for img in imgs:
    p = os.path.join('public', 'assets', 'products', img)
    if not os.path.exists(p):
        missing.append((img, p))

print(f'Missing in public/assets/products: {len(missing)}')
if missing:
    for m in missing:
        print('  Missing:', m)
