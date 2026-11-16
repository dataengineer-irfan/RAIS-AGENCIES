import json
import re

with open("scripts/catalogue_66_skus.json", "r", encoding="utf-8") as f:
    items = json.load(f)

print(f"Total items in catalogue_66_skus.json: {len(items)}")
for i, x in enumerate(items):
    print(f"{i+1:02d}. {x['sku']} | {x['title']} | Brand: {x['brand']} | Img: {x['img_src']}")
