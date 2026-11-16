import re

p = 'public/catalogue.html'
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Replace any garbled title
html = re.sub(r'<title>.*?</title>', '<title>RAIS Agencies — Official Wholesale Product Catalogue (66 SKUs)</title>', html)

with open(p, 'w', encoding='utf-8') as f:
    f.write(html)

print('Cleaned up catalogue.html title.')
