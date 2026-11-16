import json
import re

with open('scripts/catalogue_66_skus.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

with open('public/catalogue.html', 'r', encoding='utf-8') as f:
    html = f.read()

card_pattern = re.compile(r'<!-- Product Card:\s*([^\s>]+)\s*-->(.*?)(?=<!-- Product Card:|</div>\s*</section>|$)', re.DOTALL)
cards = card_pattern.findall(html)

card_lookup = {}
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
    
    img_m = re.search(r'\s+src=["\'](assets/products/[^"\']+)["\']', block)
    if not img_m:
        img_m = re.search(r'\s+src=["\']([^"\']+)["\']', block)
    img_src = img_m.group(1).strip() if img_m else ''
    
    card_lookup[sku] = {
        'sku': sku,
        'title': title,
        'brand': brand,
        'pack': pack,
        'image': img_src
    }

categories_map = {
    'chk': ('CHICKEN', 'Chicken Items'),
    'chi': ('CHICKEN', 'Chicken Items'),
    'veg': ('VEG', 'Veg Items'),
    'sau': ('SAUCES', 'Ketchup & Sauces'),
    'brd': ('BREADING', 'Bread Mix & Powders'),
    'chs': ('CHEESE', 'Cheese & Slices'),
    'che': ('CHEESE', 'Cheese & Slices'),
    'box': ('PACKAGING', 'Pizza & Burger Boxes'),
    'pac': ('PACKAGING', 'Pizza & Burger Boxes'),
    'spc': ('SPICES', 'Culinary Spices'),
    'moj': ('MOJITOS', 'Mojitos & Syrups'),
}

hsn_map = {
    'CHICKEN': '1602',
    'VEG': '2004',
    'SAUCES': '2103',
    'BREADING': '1901',
    'CHEESE': '0406',
    'PACKAGING': '4819',
    'SPICES': '0910',
    'MOJITOS': '2106',
}

def clean_brand_name(brand_str):
    b = brand_str.strip().title()
    if b.lower() in ['master chef', 'itc master chef']:
        return 'ITC Master Chef'
    if b.lower() == 'vkl':
        return 'VKL'
    if b.lower() == 'itc':
        return 'ITC Master Chef'
    if b.lower() in ['del monte', 'delmont', 'delmonte']:
        return 'Del Monte'
    if b.lower() == 'triken':
        return 'Triken'
    if b.lower() == 'amul':
        return 'Amul'
    if b.lower() == 'nutrich':
        return 'Nutrich'
    if b.lower() == 'hup hup':
        return 'Hup Hup'
    if b.lower() == 'chilli fill':
        return 'Chilli Fill'
    if b.lower() == 'godrej':
        return 'Godrej'
    if b.lower() == 'signature':
        return 'Signature'
    if b.lower() == 'milky mist':
        return 'Milky Mist'
    if b.lower() == 'foodrite':
        return 'Foodrite'
    if b.lower() == 'mayank gold':
        return 'Mayank Gold'
    if b.lower() == 'packaging solutions':
        return 'Packaging Solutions'
    if b.lower() == 'rais master':
        return 'RAIS Select'
    if b.lower() == 'rais spices':
        return 'RAIS Spices'
    if b.lower() == 'rais beverages':
        return 'RAIS Beverages'
    if b.lower() == 'rais fresh':
        return 'RAIS Fresh'
    if b.lower() == 'rais select':
        return 'RAIS Select'
    return b

def clean_product_title(title_str):
    t = title_str.strip()
    words = t.split()
    clean_words = []
    for w in words:
        if w.upper() in ['ITC', 'VKL', 'KFC', 'MM', 'KG', 'PKT', 'NO', 'NOS', 'SKU', 'FDR', 'H&S', 'HS', '8MM', '6MM', '9MM', '11MM']:
            clean_words.append(w.upper())
        elif w.lower() in ['and', 'in', 'of', 'for', 'x']:
            clean_words.append(w.lower())
        else:
            clean_words.append(w.capitalize())
    res = ' '.join(clean_words)
    res = res.replace('Delmont ', 'Del Monte ').replace('Delmonte ', 'Del Monte ')
    res = res.replace('Mozzerolla', 'Mozzarella').replace('Mozerolla', 'Mozzarella')
    res = res.replace('Mayonies', 'Mayonnaise')
    res = res.replace('Veniger', 'Vinegar')
    res = res.replace('Bukets', 'Chicken Buckets')
    res = res.replace('Kechup', 'Ketchup')
    res = res.replace('Bluecurco', 'Blue Curacao Syrup')
    res = res.replace('Lime And Mint', 'Lime & Mint Mojito Syrup')
    res = res.replace('Strawberry Moji', 'Strawberry Mojito Syrup')
    res = res.replace('Marinde', 'Marinade')
    return res

formatted_products = []

for it in items:
    sku = it['sku'].upper()
    prefix = sku.split('-')[1].lower() if '-' in sku else sku.lower()
    cat_code, cat_name = categories_map.get(prefix, ('VEG', 'Veg Items'))
    
    card = card_lookup.get(sku, {})
    title = card.get('title') or it.get('title', '')
    brand = card.get('brand') or it.get('brand', '')
    pack = card.get('pack') or '1 Packet'
    img_src = it['img_src']

    if 'tortillah' in title.lower():
        cat_code, cat_name = ('CHICKEN', 'Chicken Items')
    if 'butter nutrilite' in title.lower():
        cat_code, cat_name = ('CHEESE', 'Cheese & Slices')
    if 'chilli flakes' in title.lower():
        cat_code, cat_name = ('BREADING', 'Bread Mix & Powders')
    if 'burger bun' in title.lower() or 'pizza base' in title.lower():
        cat_code, cat_name = ('VEG', 'Veg Items')
    if any(k in title.lower() for k in ['butter paper', 'tissue', 'cups', 'buket', 'bucket', 'box']):
        cat_code, cat_name = ('PACKAGING', 'Pizza & Burger Boxes')
    if any(k in title.lower() for k in ['culinary sauce', 'mayonies', 'veniger', 'ketchup', 'mayo', 'sauce', 'dressing']):
        if cat_code not in ['BREADING', 'CHEESE']:
            cat_code, cat_name = ('SAUCES', 'Ketchup & Sauces')
    if 'oregano' in title.lower():
        cat_code, cat_name = ('BREADING', 'Bread Mix & Powders')

    brand_clean = clean_brand_name(brand)
    title_clean = clean_product_title(title)
    
    desc = f'Authentic {brand_clean} {title_clean} in commercial {pack} wholesale packing for QSRs, hotels, and cafes.'

    pack_clean = pack.strip()
    if not pack_clean.startswith('1 ') and not pack_clean.endswith('Packet') and not any(u in pack_clean for u in ['KG', 'kg', 'g', 'gram', 'Pack', 'Bottle']):
        pack_clean = f'{pack_clean} Pack'

    is_featured = sku in ['RAIS-CHK-04', 'RAIS-CHK-05', 'RAIS-VEG-01', 'RAIS-CHS-01', 'RAIS-SAU-01', 'RAIS-BRD-02', 'RAIS-BOX-04']

    formatted_products.append({
        'sku': sku,
        'categoryCode': cat_code,
        'categoryName': cat_name,
        'name': title_clean,
        'brand': brand_clean,
        'pack': pack_clean,
        'hsn': hsn_map.get(cat_code, '2106'),
        'image': f'/{img_src}',
        'isFeatured': is_featured,
        'description': desc
    })

print(f'Total formatted products: {len(formatted_products)}')
cat_order = ['CHICKEN', 'VEG', 'SAUCES', 'BREADING', 'CHEESE', 'PACKAGING', 'SPICES', 'MOJITOS']
formatted_products.sort(key=lambda p: (cat_order.index(p['categoryCode']), p['name']))

cat_counts = {}
for p in formatted_products:
    cat_counts[p['categoryCode']] = cat_counts.get(p['categoryCode'], 0) + 1

print('Synced Category Counts:', cat_counts)
with open('scripts/formatted_66_products.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_products, f, indent=2)
print('Saved to scripts/formatted_66_products.json')
