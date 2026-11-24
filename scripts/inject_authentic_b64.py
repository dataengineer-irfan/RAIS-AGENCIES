import json
import re
import base64
from io import BytesIO
from PIL import Image

def make_b64(img_path):
    with Image.open(img_path) as im:
        im.thumbnail((220, 220))
        buf = BytesIO()
        im.convert('RGB').save(buf, format='JPEG', quality=85)
        b = base64.b64encode(buf.getvalue()).decode('utf-8')
        return f"data:image/jpeg;base64,{b}"

soya_b64 = make_b64('rais-website/public/assets/products/enhanced_sauces-025.jpg')
red_chilli_b64 = make_b64('rais-website/public/assets/products/enhanced_sauces-026.jpg')
green_chilli_b64 = make_b64('rais-website/public/assets/products/enhanced_sauces-027.jpg')
panko_b64 = make_b64('rais-website/public/assets/products/enhanced_sauces-024.jpg')
mozz_b64 = make_b64('rais-website/public/assets/products/enhanced_dairy-004.jpg')

files_to_update = [
    'rais-growth-engine/backend/static/catalogue.html',
    'rais-growth-engine/backend/static/RAIS_Product_Catalogue_No_Prices.html',
    'rais-website/public/catalogue.html',
    'rais-website/public/RAIS_Product_Catalogue_No_Prices.html'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    m = re.search(r'const products = (\[.*?\]);', content, re.DOTALL)
    if not m:
        continue

    products = json.loads(m.group(1))

    for p in products:
        sku = p.get('sku')
        if sku == 'SAUCES-025':
            p['product_name'] = 'Meal Time Dark Soya Sauce (5kg / 1kg)'
            p['brand'] = 'Meal Time'
            p['pack'] = '5kg Can / 1kg Bottle'
            p['local_asset'] = '/assets/products/enhanced_sauces-025.jpg'
            p['b64'] = soya_b64
        elif sku == 'SAUCES-026':
            p['product_name'] = 'Meal Time Red Chilli Sauce (5kg / 1kg)'
            p['brand'] = 'Meal Time'
            p['pack'] = '5kg Can / 1kg Bottle'
            p['local_asset'] = '/assets/products/enhanced_sauces-026.jpg'
            p['b64'] = red_chilli_b64
        elif sku == 'SAUCES-027':
            p['product_name'] = 'Meal Time Green Chilli Sauce (5kg / 1kg)'
            p['brand'] = 'Meal Time'
            p['pack'] = '5kg Can / 1kg Bottle'
            p['local_asset'] = '/assets/products/enhanced_sauces-027.jpg'
            p['b64'] = green_chilli_b64
        elif sku == 'SAUCES-024':
            p['product_name'] = 'Golden Crown Panko Bread Crumbs (1kg)'
            p['brand'] = 'Golden Crown'
            p['pack'] = '1kg Pouch'
            p['local_asset'] = '/assets/products/enhanced_sauces-024.jpg'
            p['b64'] = panko_b64
        elif sku == 'DAIRY-004':
            p['local_asset'] = '/assets/products/enhanced_dairy-004.jpg'
            p['b64'] = mozz_b64

    new_json = json.dumps(products, ensure_ascii=False)
    content_updated = content[:m.start(1)] + new_json + content[m.end(1):]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content_updated)

    print(f"Updated {filepath} with authentic depot photos.")

print("All catalogue files updated!")
