import json

with open('scripts/catalogue_66_skus.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

for i, it in enumerate(items):
    print(f"{i+1:2d}. [{it['sku'].upper():<15}] {it['title']:<38} | {it['brand'].title():<15} | {it['img_src']}")
