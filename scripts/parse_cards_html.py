import re
import json

with open('public/catalogue.html', 'r', encoding='utf-8') as f:
    html = f.read()

card_pattern = re.compile(r'<!-- Product Card:\s*([^\s>]+)\s*-->(.*?)(?=<!-- Product Card:|</div>\s*</section>|$)', re.DOTALL)
cards = card_pattern.findall(html)

parsed_cards = []
for sku_comment, block in cards:
    sku_m = re.search(r'data-sku=["\']([^"\']+)["\']', block)
    sku = sku_m.group(1).upper() if sku_m else sku_comment.upper()
    
    title_m = re.search(r'<h3[^>]*title=["\']([^"\']+)["\']', block)
    if not title_m:
        title_m = re.search(r'<h3[^>]*>(.*?)</h3>', block, re.DOTALL)
    title = title_m.group(1).strip() if title_m else ''
    title = re.sub(r'<[^>]+>', '', title).strip()

    brand_m = re.search(r'data-brand=["\']([^"\']+)["\']', block)
    brand = brand_m.group(1).strip().title() if brand_m else ''
    
    pack_m = re.search(r'📦 Pack:</span>\s*<span[^>]*>(.*?)</span>', block, re.DOTALL)
    pack = pack_m.group(1).strip() if pack_m else '1 Packet'
    pack = re.sub(r'<[^>]+>', '', pack).strip()
    
    # Match exact html attribute src="..." (not this.src)
    img_m = re.search(r'\s+src=["\'](assets/products/[^"\']+)["\']', block)
    if not img_m:
        img_m = re.search(r'\s+src=["\']([^"\']+)["\']', block)
    img_src = img_m.group(1).strip() if img_m else ''
    
    parsed_cards.append({
        'sku': sku,
        'title': title,
        'brand': brand,
        'pack': pack,
        'image': img_src
    })

print(f'Parsed {len(parsed_cards)} items from catalogue.html')
for c in parsed_cards[:10]:
    print(c)
