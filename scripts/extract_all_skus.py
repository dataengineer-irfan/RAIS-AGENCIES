import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_path = r"C:\Users\affra\Documents\RAIS\RAIS_Product_Catalogue_No_Prices.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Pattern to capture each product card
card_pattern = re.compile(r'<div class="product-card[^"]*"([^>]*)>([\s\S]*?)(?=(?:<div class="product-card|\Z))')
matches = card_pattern.findall(html)
print(f"Total product cards matched: {len(matches)}")

products = []

for idx, (attrs, body) in enumerate(matches):
    sku_m = re.search(r'data-sku=["\']([^"\']*)["\']', attrs, re.I)
    name_m = re.search(r'data-name=["\']([^"\']*)["\']', attrs, re.I)
    brand_m = re.search(r'data-brand=["\']([^"\']*)["\']', attrs, re.I)
    
    sku = sku_m.group(1).strip() if sku_m else ""
    name_attr = name_m.group(1).strip() if name_m else ""
    brand_attr = brand_m.group(1).strip() if brand_m else ""
    
    # Extract Title from card body
    h3_m = re.search(r'<h3[^>]*>([\s\S]*?)</h3>', body, re.I)
    title = re.sub(r'<[^>]+>', '', h3_m.group(1)).strip() if h3_m else name_attr
    
    # Extract brand from body
    brand_span = re.search(r'<span[^>]*class=["\'][^"\']*brand[^"\']*["\'][^>]*>([\s\S]*?)</span>', body, re.I)
    brand_text = re.sub(r'<[^>]+>', '', brand_span.group(1)).strip() if brand_span else brand_attr
    
    # Extract Category badge
    cat_span = re.search(r'<span[^>]*class=["\'][^"\']*category[^"\']*["\'][^>]*>([\s\S]*?)</span>', body, re.I)
    cat_text = re.sub(r'<[^>]+>', '', cat_span.group(1)).strip() if cat_span else ""
    
    # Extract Pack
    pack_m = re.search(r'<(?:span|p|div)[^>]*class=["\'][^"\']*(?:weight|pack|size|desc|text-slate-400|text-slate-500)[^"\']*["\'][^>]*>([\s\S]*?)</(?:span|p|div)>', body, re.I)
    pack_text = re.sub(r'<[^>]+>', '', pack_m.group(1)).strip() if pack_m else ""
    
    # Extract first img tag
    img_tag_m = re.search(r'<img\s+([^>]+)>', body, re.I)
    img_src = ""
    onerror_src = ""
    if img_tag_m:
        tag_content = img_tag_m.group(1)
        # Non-greedy match for src
        src_m = re.search(r'\bsrc=["\']([^"\']+)["\']', tag_content, re.I)
        if src_m:
            img_src = src_m.group(1).strip()
        onerror_m = re.search(r'onerror=.*?src=["\']?([^"\'\s>]+)["\']?', tag_content, re.I)
        if onerror_m:
            onerror_src = onerror_m.group(1).strip()
    
    # Check where this file exists
    base_dir = r"C:\Users\affra\Documents\RAIS"
    local_src_path = os.path.join(base_dir, img_src.replace('/', '\\'))
    fe_src_path = os.path.join(base_dir, "frontend", "public", img_src.replace('/', '\\'))
    
    src_exists = os.path.exists(local_src_path)
    if not src_exists and os.path.exists(fe_src_path):
        local_src_path = fe_src_path
        src_exists = True
        
    local_onerror_path = os.path.join(base_dir, onerror_src.replace('/', '\\'))
    onerror_exists = os.path.exists(local_onerror_path) if onerror_src else False
    
    p_info = {
        "index": idx + 1,
        "sku": sku,
        "title": title,
        "brand": brand_text,
        "category": cat_text,
        "pack": pack_text,
        "img_src": img_src,
        "img_path": local_src_path if src_exists else None,
        "src_exists": src_exists,
        "onerror_src": onerror_src,
        "onerror_exists": onerror_exists
    }
    products.append(p_info)

with open(r"scripts\catalogue_66_skus.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(products)} products to scripts/catalogue_66_skus.json")
missing = [p for p in products if not p['src_exists']]
print(f"Products with primary src missing: {len(missing)}")

for p in products[:15]:
    print(f"#{p['index']:02d} | {p['sku']:<16} | {p['title'][:25]:<26} | {p['img_src']}")
