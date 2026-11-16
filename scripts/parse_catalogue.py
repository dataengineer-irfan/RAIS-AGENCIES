import os
import re
import json

html_path = r"C:\Users\affra\Documents\RAIS\RAIS_Product_Catalogue_No_Prices.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

print("HTML length:", len(html))

# Let's inspect title and categories
title_m = re.search(r"<title>(.*?)</title>", html, re.I)
print("Title:", title_m.group(1) if title_m else "None")

# Find images
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
print(f"Total img tags: {len(imgs)}")
for i in imgs[:15]:
    print("  Img src:", i)

# Search for product card patterns
# Let's see some snippet of cards
cards = re.findall(r'(<div[^>]*class=["\'][^"\']*product-card[^"\']*["\'][^>]*>[\s\S]*?)(?=<div[^>]*class=["\'][^"\']*product-card|\Z)', html)
if not cards:
    cards = re.findall(r'(<div[^>]*class=["\'][^"\']*card[^"\']*["\'][^>]*>[\s\S]*?)(?=<div[^>]*class=["\'][^"\']*card|\Z)', html)

print(f"Card blocks found: {len(cards)}")

# Let's print the first 2 cards to see structure
for idx, c in enumerate(cards[:3]):
    print(f"\n--- CARD {idx+1} ---")
    print(c[:500])
