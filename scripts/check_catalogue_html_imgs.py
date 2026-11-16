import os
import re

with open('public/catalogue.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all src="..." attributes
matches = re.findall(r'src=["\']([^"\']+)["\']', text)
print(f'Total src attributes found in catalogue.html: {len(matches)}')

prod_matches = [m for m in matches if 'assets/products' in m]
print(f'Total assets/products src: {len(prod_matches)}')
print(f'Unique assets/products src: {len(set(prod_matches))}')

missing = []
for p in sorted(set(prod_matches)):
    full_path = os.path.join('public', p.replace('/', os.sep))
    if not os.path.exists(full_path):
        missing.append((p, full_path))

print(f'Missing files in public/assets/products: {len(missing)}')
if missing:
    for m in missing[:10]:
        print('  Missing:', m)
else:
    print('ALL files in public/catalogue.html exist on disk!')
