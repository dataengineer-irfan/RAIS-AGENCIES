import re
import os

with open('public/catalogue.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

img_srcs = sorted(set(re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)))
print(f'Total unique img tags found: {len(img_srcs)}')
for s in img_srcs:
    print(' ', s)
