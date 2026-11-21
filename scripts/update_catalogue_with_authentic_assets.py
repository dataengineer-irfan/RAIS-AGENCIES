import json
import re
import os
import base64

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PROD_DIR = os.path.join(BASE_DIR, "public", "images", "pdf_products")

def get_b64(path):
    if os.path.exists(path):
        with open(path, 'rb') as f:
            b = f.read()
            return f"data:image/jpeg;base64,{base64.b64encode(b).decode('utf-8')}"
    return ""

def update_catalogue_file(filepath):
    print(f"Updating {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update text mentions of 90 SKU
    content = content.replace("Explore 90+ verified commercial food service SKUs", "Explore verified commercial food service products")
    content = content.replace("📦 90 Commercial Food Service SKUs", "📦 Commercial Wholesale Master Catalogue")
    content = content.replace("Search 90 SKUs (e.g. 'fries'", "Search commercial products (e.g. 'fries'")
    content = content.replace('All Products <span class="cat-count">90</span>', 'All Products <span class="cat-count" id="allCountBadge">All</span>')
    content = content.replace("Showing <strong>90 of 90</strong> products", "Showing <strong>all verified products</strong>")
    content = content.replace("open the live 90-SKU wholesale catalogue", "open the live wholesale master catalogue")
    content = content.replace("90-SKU Master Food Service Catalogue", "Commercial Wholesale Food Service Master Catalogue")
    content = content.replace("Showing ${filtered.length} of ${products.length} products", "Showing ${filtered.length} products")
    content = content.replace("Showing ${filtered.length} of 90 products", "Showing ${filtered.length} products")

    # 2. Update products array with authentic extracted images
    m = re.search(r'const products = (\[.*?\]);', content, re.DOTALL)
    if not m:
        print("Could not find products array in", filepath)
        return

    products = json.loads(m.group(1))
    print(f"Found {len(products)} products in {filepath}")

    for idx, p in enumerate(products):
        p_num = idx + 1
        pdf_img_path = os.path.join(PDF_PROD_DIR, f"prod_{p_num:02d}.jpeg")
        if os.path.exists(pdf_img_path):
            p['b64'] = get_b64(pdf_img_path)
            p['img_file'] = f"pdf_products/prod_{p_num:02d}.jpeg"
            p['local_asset'] = f"images/pdf_products/prod_{p_num:02d}.jpeg"

    # Replace products array in content
    new_products_json = json.dumps(products, ensure_ascii=False)
    content = content[:m.start(1)] + new_products_json + content[m.end(1):]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully updated {filepath} with authentic images and cleaned 90-SKU text.")

update_catalogue_file(os.path.join(BASE_DIR, "public", "catalogue.html"))
update_catalogue_file(os.path.join(BASE_DIR, "public", "RAIS_Product_Catalogue_No_Prices.html"))
