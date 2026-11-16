import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"scripts\catalogue_66_skus.json", "r", encoding="utf-8") as f:
    products = json.load(f)

print(f"Total Catalogue SKUs: {len(products)}")
print("=" * 80)
for p in products:
    print(f"[{p['sku']}] {p['title']} ({p['brand']}) -> {p['img_src']}")
