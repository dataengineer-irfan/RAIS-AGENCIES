import json

with open('scripts/catalogue_66_skus.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f'Total items in catalogue_66_skus.json: {len(items)}')
for i, it in enumerate(items[:15]):
    print(f"{i+1:2d}. SKU: {it['sku']:<15} Title: {it['title']:<30} Brand: {it['brand']:<15} Img: {it['img_src']}")
