import json
import re

files_to_update = [
    'rais-growth-engine/backend/static/catalogue.html',
    'rais-growth-engine/backend/static/RAIS_Product_Catalogue_No_Prices.html',
    'rais-website/public/catalogue.html',
    'rais-website/public/RAIS_Product_Catalogue_No_Prices.html'
]

new_items = [
    {
        'category': '3. Dairy, Cheese & Spreads',
        'req_name': 'Sudarshan Fresh Cream 1L',
        'product_name': 'Sudarshan Dairy Fresh Cream (1L Pack)',
        'brand': 'Sudarshan',
        'price_raw': 210,
        'price_val': 210.0,
        'is_numeric': True,
        'img_file': 'fresh_cream.jpg',
        'sku': 'DAIRY-009',
        'pack': '1L Pack',
        'cat_short': 'Dairy, Cheese & Spreads',
        'local_asset': '/assets/products/enhanced_dairy-009.jpg'
    },
    {
        'category': '5. Gourmet Sauces, Mayonnaise & Condiments',
        'req_name': 'Meal Time Dark Soya Sauce',
        'product_name': 'Meal Time Dark Soya Sauce (1kg / 5L Can)',
        'brand': 'Meal Time',
        'price_raw': 85,
        'price_val': 85.0,
        'is_numeric': True,
        'img_file': 'dark_soya_sauce.jpg',
        'sku': 'SAUCES-025',
        'pack': '1kg Bottle',
        'cat_short': 'Gourmet Sauces, Mayonnaise & Condiments',
        'local_asset': '/assets/products/enhanced_sauces-025.jpg'
    },
    {
        'category': '5. Gourmet Sauces, Mayonnaise & Condiments',
        'req_name': 'Meal Time Red Chilli Sauce',
        'product_name': 'Meal Time Red Chilli Sauce (1kg / 5L Can)',
        'brand': 'Meal Time',
        'price_raw': 85,
        'price_val': 85.0,
        'is_numeric': True,
        'img_file': 'red_chilli_sauce.jpg',
        'sku': 'SAUCES-026',
        'pack': '1kg Bottle',
        'cat_short': 'Gourmet Sauces, Mayonnaise & Condiments',
        'local_asset': '/assets/products/enhanced_sauces-026.jpg'
    },
    {
        'category': '5. Gourmet Sauces, Mayonnaise & Condiments',
        'req_name': 'Meal Time Green Chilli Sauce',
        'product_name': 'Meal Time Green Chilli Sauce (1kg / 5L Can)',
        'brand': 'Meal Time',
        'price_raw': 85,
        'price_val': 85.0,
        'is_numeric': True,
        'img_file': 'green_chilli_sauce.jpg',
        'sku': 'SAUCES-027',
        'pack': '1kg Bottle',
        'cat_short': 'Gourmet Sauces, Mayonnaise & Condiments',
        'local_asset': '/assets/products/enhanced_sauces-027.jpg'
    },
    {
        'category': '7. Crushes, Syrups & Beverage Concentrates',
        'req_name': 'Del Monte Chocolate Syrup',
        'product_name': 'Del Monte Rich Chocolate Syrup (1kg Bottle)',
        'brand': 'Del Monte',
        'price_raw': 195,
        'price_val': 195.0,
        'is_numeric': True,
        'img_file': 'delmonte_chocolate_syrup.jpg',
        'sku': 'SYRUPS-013',
        'pack': '1kg Bottle',
        'cat_short': 'Crushes, Syrups & Beverage Concentrates',
        'local_asset': '/assets/products/enhanced_syrups-013.jpg'
    },
    {
        'category': '7. Crushes, Syrups & Beverage Concentrates',
        'req_name': 'Foodcraft Chocolate Syrup',
        'product_name': 'Foodcraft Commercial Chocolate Syrup (1kg / 5kg Can)',
        'brand': 'Foodcraft',
        'price_raw': 175,
        'price_val': 175.0,
        'is_numeric': True,
        'img_file': 'foodcraft_chocolate_syrup.jpg',
        'sku': 'SYRUPS-014',
        'pack': '1kg Bottle',
        'cat_short': 'Crushes, Syrups & Beverage Concentrates',
        'local_asset': '/assets/products/enhanced_syrups-014.jpg'
    }
]

for filepath in files_to_update:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        m = re.search(r'const products = (\[.*?\]);', content, re.DOTALL)
        if not m:
            print(f"Skipping {filepath}: No const products array")
            continue

        products = json.loads(m.group(1))
        
        # Borrow b64 from existing items for clean display
        sauce_b64 = next((p['b64'] for p in products if p.get('sku') == 'SAUCES-023'), '')
        dairy_b64 = next((p['b64'] for p in products if p.get('sku') == 'DAIRY-001'), '')
        syrup_b64 = next((p['b64'] for p in products if p.get('sku') == 'SYRUPS-001'), '')

        # Update existing items
        for p in products:
            sku = p.get('sku')
            if sku == 'SAUCES-002':
                p['brand'] = 'Habit'
                p['product_name'] = 'Habit Canned Whole Baby Corn (800g)'
            elif sku == 'SAUCES-003':
                p['brand'] = 'Habit'
                p['product_name'] = 'Habit Canned Button Mushroom (800g)'
            elif sku == 'SAUCES-004':
                p['brand'] = "Spic's"
                p['product_name'] = "Spic's Culinary Sauce (1 KG)"
            elif sku == 'SAUCES-010':
                p['brand'] = 'Del Monte'
                p['product_name'] = 'Del Monte Sliced Jalapenos (3kg Tin / 1kg Pouch)'
            elif sku == 'SAUCES-020':
                p['brand'] = "Spic's"
                p['product_name'] = "Spic's Hot Chilli Sauce (5 KG Bulk Can)"
            elif sku == 'SAUCES-023':
                p['brand'] = 'Commercial Kitchen'
                p['product_name'] = 'Commercial Synthetic White Vinegar (1 Ltr / 5L Can)'

        existing_skus = {p.get('sku') for p in products}

        # Add missing items
        for item in new_items:
            if item['sku'] not in existing_skus:
                item_copy = dict(item)
                if 'DAIRY' in item['sku']:
                    item_copy['b64'] = dairy_b64
                elif 'SYRUPS' in item['sku']:
                    item_copy['b64'] = syrup_b64
                else:
                    item_copy['b64'] = sauce_b64
                products.append(item_copy)

        new_json = json.dumps(products, ensure_ascii=False)
        content_updated = content[:m.start(1)] + new_json + content[m.end(1):]

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content_updated)

        print(f"Updated {filepath}: now {len(products)} products.")
    except Exception as e:
        print(f"Error updating {filepath}: {e}")
