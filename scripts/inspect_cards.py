import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html_path = r"C:\Users\affra\Documents\RAIS\RAIS_Product_Catalogue_No_Prices.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

cards = re.findall(r'(<div[^>]*class=["\'][^"\']*product-card[^"\']*["\'][^>]*>[\s\S]*?)(?=<div[^>]*class=["\'][^"\']*product-card|\Z)', html)
print(f"Total cards: {len(cards)}")

for idx, c in enumerate(cards[:10]):
    sku_m = re.search(r'data-sku=["\']([^"\']*)["\']', c)
    name_m = re.search(r'data-name=["\']([^"\']*)["\']', c)
    sku = sku_m.group(1) if sku_m else "N/A"
    name = name_m.group(1) if name_m else "N/A"
    
    # All img tags
    imgs = re.findall(r'<img[^>]+>', c)
    print(f"\n--- Card {idx+1}: {sku} | {name} ---")
    for im in imgs:
        print("  Tag:", im.replace('\n', ' ').strip())
