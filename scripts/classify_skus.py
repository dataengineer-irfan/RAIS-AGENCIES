import json

with open('scripts/catalogue_66_skus.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Inspect categories and SKUs
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

for i, it in enumerate(items):
    sku = it['sku'].lower()
    prefix = sku.split('-')[1] if '-' in sku else sku
    cat_code, cat_name = categories_map.get(prefix, ('VEG', 'Veg Items'))
    # special cases
    if 'tortillah' in it['title'].lower():
        cat_code, cat_name = ('CHICKEN', 'Chicken Items')
    if 'butter nutrilite' in it['title'].lower():
        cat_code, cat_name = ('CHEESE', 'Cheese & Slices')
    if 'chilli flakes' in it['title'].lower():
        cat_code, cat_name = ('BREADING', 'Bread Mix & Powders')
    if 'burger bun' in it['title'].lower() or 'pizza base' in it['title'].lower():
        cat_code, cat_name = ('VEG', 'Veg Items')
    if 'butter paper' in it['title'].lower() or 'tissue' in it['title'].lower() or 'cups' in it['title'].lower() or 'buket' in it['title'].lower() or 'bucket' in it['title'].lower():
        cat_code, cat_name = ('PACKAGING', 'Pizza & Burger Boxes')
    if 'culinary sauce' in it['title'].lower() or 'mayonies' in it['title'].lower() or 'veniger' in it['title'].lower():
        cat_code, cat_name = ('SAUCES', 'Ketchup & Sauces')

    it['resolved_cat_code'] = cat_code
    it['resolved_cat_name'] = cat_name

# Count per category
counts = {}
for it in items:
    c = it['resolved_cat_code']
    counts[c] = counts.get(c, 0) + 1

print('Category counts:')
for c, cnt in counts.items():
    print(f'  {c}: {cnt}')
