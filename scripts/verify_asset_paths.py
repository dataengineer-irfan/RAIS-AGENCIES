import json
import os

with open("scripts/catalogue_66_skus.json", "r", encoding="utf-8") as f:
    items = json.load(f)

missing_assets = []
missing_catalogue = []

for item in items:
    # img_src is like "assets/products/triken_chicken_momos.jpg"
    filename = os.path.basename(item["img_src"])
    p1 = os.path.join("public", "assets", "products", filename)
    p2 = os.path.join("public", "images", "products_catalogue", filename)
    
    if not os.path.exists(p1):
        missing_assets.append((item["sku"], p1))
    if not os.path.exists(p2):
        missing_catalogue.append((item["sku"], p2))

print(f"Missing in public/assets/products: {len(missing_assets)}")
for m in missing_assets:
    print("  ", m)

print(f"Missing in public/images/products_catalogue: {len(missing_catalogue)}")
for m in missing_catalogue:
    print("  ", m)
