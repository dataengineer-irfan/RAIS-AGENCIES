import os
import re

TS_PATH = os.path.join("src", "data", "catalogue.ts")
ASSETS_DIR = os.path.join("public", "assets", "products")

with open(TS_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

# For each SKU, check if enhanced_<sku>.jpg exists in public/assets/products
# If it does, update image: '/assets/products/...' to '/assets/products/enhanced_<sku>.jpg'

def replacer(match):
    full_block = match.group(0)
    sku_m = re.search(r"sku:\s*'([^']+)'", full_block)
    if not sku_m:
        return full_block
    
    sku = sku_m.group(1).lower()
    enhanced_name = f"enhanced_{sku}.jpg"
    enhanced_path = os.path.join(ASSETS_DIR, enhanced_name)
    
    if os.path.exists(enhanced_path):
        # replace image: '...'
        new_block = re.sub(r"image:\s*'[^']+'", f"image: '/assets/products/{enhanced_name}'", full_block)
        return new_block
    return full_block

# Match individual product objects in RAW_PRODUCTS
pattern = re.compile(r"\{\s*sku:\s*'[^']+',.*?\}", re.DOTALL)
updated_text, count = pattern.subn(replacer, text)

print(f"Updated {count} product images in {TS_PATH}")

with open(TS_PATH, 'w', encoding='utf-8') as f:
    f.write(updated_text)

print("Successfully synced catalogue.ts with enhanced high-resolution product photography!")
