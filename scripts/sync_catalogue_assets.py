import os
import shutil
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/catalogue_66_skus.json", "r", encoding="utf-8") as f:
    products = json.load(f)

dest_dir = "public/images/products_catalogue"
os.makedirs(dest_dir, exist_ok=True)

copied = 0
for p in products:
    src = p["img_path"]
    if src and os.path.exists(src):
        dst = os.path.join(dest_dir, os.path.basename(src))
        shutil.copy2(src, dst)
        p["local_asset"] = dst.replace('\\', '/')
        copied += 1
    else:
        print(f"Warning: missing {p['sku']}: {src}")

with open("scripts/catalogue_66_skus.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Successfully copied {copied} / {len(products)} catalogue assets into {dest_dir}")
