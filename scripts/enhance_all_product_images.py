import os
import json
import re
import base64
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_PROD_DIR = os.path.join(BASE_DIR, "public", "assets", "products")
IMAGES_PROD_DIR = os.path.join(BASE_DIR, "public", "images", "products")
PUBLIC_IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")
CATALOGUE_HTML = os.path.join(BASE_DIR, "public", "catalogue.html")
CATALOGUE_TS = os.path.join(BASE_DIR, "src", "data", "catalogue.ts")

# 1. High-Resolution Studio Photography Match Map
# Maps SKUs directly to studio-grade 1024x1024 / 1200x896 photography in public/images/products
STUDIO_PHOTO_MAP = {
    # Chicken Snacks
    "CHICKEN-001": os.path.join(IMAGES_PROD_DIR, "chicken_momos.jpg"),
    "CHICKEN-002": os.path.join(IMAGES_PROD_DIR, "itc_chicken_nuggets.webp"),
    "CHICKEN-003": os.path.join(IMAGES_PROD_DIR, "itc_chicken_fingers.webp"),
    "CHICKEN-004": os.path.join(IMAGES_PROD_DIR, "itc_chicken_patty.webp"),
    "CHICKEN-005": os.path.join(IMAGES_PROD_DIR, "itc_chicken_popcorn.webp"),
    "CHICKEN-006": os.path.join(PUBLIC_IMAGES_DIR, "chicken_nuggets.jpg"),

    # Veg Snacks & Fries
    "VEG-001": os.path.join(IMAGES_PROD_DIR, "french_fries_basket.jpg"),
    "VEG-002": os.path.join(IMAGES_PROD_DIR, "mccain_aloo_tikki.png"),
    "VEG-003": os.path.join(IMAGES_PROD_DIR, "itc_crispy_cheese_fills.webp"),
    "VEG-004": os.path.join(IMAGES_PROD_DIR, "paneer_pops.png"),
    "VEG-005": os.path.join(IMAGES_PROD_DIR, "itc_cheese_jalapeno_nuggets.webp"),
    "VEG-006": os.path.join(IMAGES_PROD_DIR, "amul_french_fries_6mm.jpg"),
    "VEG-007": os.path.join(IMAGES_PROD_DIR, "veg_momos.jpg"),
    "VEG-008": os.path.join(IMAGES_PROD_DIR, "itc_cheesy_corn_triangles.webp"),
    "VEG-009": os.path.join(IMAGES_PROD_DIR, "itc_veg_burger_patty.webp"),
    "VEG-010": os.path.join(IMAGES_PROD_DIR, "mccain_veggie_burger_patty.webp"),
    "VEG-011": os.path.join(IMAGES_PROD_DIR, "itc_french_fries.webp"),
    "VEG-012": os.path.join(IMAGES_PROD_DIR, "mccain_smiles.png"),
    "VEG-013": os.path.join(IMAGES_PROD_DIR, "mccain_veggie_nuggets.png"),
    "VEG-014": os.path.join(IMAGES_PROD_DIR, "itc_potato_shots.webp"),

    # Dairy Essentials & Sweet Corn
    "DAIRY-001": os.path.join(PUBLIC_IMAGES_DIR, "mozzarella_cheese.jpg"),
    "DAIRY-003": os.path.join(PUBLIC_IMAGES_DIR, "mozzarella_cheese.jpg"),
    "DAIRY-004": os.path.join(PUBLIC_IMAGES_DIR, "mozzarella_cheese.jpg"),
    "DAIRY-005": os.path.join(PUBLIC_IMAGES_DIR, "mozzarella_cheese.jpg"),
    "DAIRY-006": os.path.join(IMAGES_PROD_DIR, "paneer_pops.png"),
    "DAIRY-007": os.path.join(PUBLIC_IMAGES_DIR, "cheesy_triangle.jpg"),
    "DAIRY-008": os.path.join(IMAGES_PROD_DIR, "sweet_corn.jpg"),

    # Bakery & Bases
    "BAKERY-001": os.path.join(PUBLIC_IMAGES_DIR, "burger_boxes.jpg"),
    "BAKERY-002": os.path.join(IMAGES_PROD_DIR, "pizza_base.jpg"),
    "BAKERY-003": os.path.join(IMAGES_PROD_DIR, "pizza_base.jpg"),
    "BAKERY-004": os.path.join(IMAGES_PROD_DIR, "tortilla_wraps.jpg"),
    "BAKERY-005": os.path.join(IMAGES_PROD_DIR, "tortilla_wraps.jpg"),

    # Gourmet Sauces & Mayo
    "SAUCES-001": os.path.join(IMAGES_PROD_DIR, "foodrite_mayonnaise.jpg"),
    "SAUCES-005": os.path.join(IMAGES_PROD_DIR, "delmonte_tandoori_mayo.png"),
    "SAUCES-006": os.path.join(IMAGES_PROD_DIR, "delmonte_tomato_ketchup.png"),
    "SAUCES-007": os.path.join(PUBLIC_IMAGES_DIR, "gourmet_sauces.jpg"),
    "SAUCES-008": os.path.join(IMAGES_PROD_DIR, "delmonte_ketchup_sachet.png"),
    "SAUCES-009": os.path.join(IMAGES_PROD_DIR, "delmonte_pizza_pasta_sauce.png"),
    "SAUCES-011": os.path.join(IMAGES_PROD_DIR, "delmonte_bbq_sauce.png"),
    "SAUCES-012": os.path.join(IMAGES_PROD_DIR, "delmonte_eggless_mayo.png"),
    "SAUCES-013": os.path.join(IMAGES_PROD_DIR, "delmonte_ketchup_sachet.png"),
    "SAUCES-014": os.path.join(IMAGES_PROD_DIR, "foodrite_mayonnaise.jpg"),
    "SAUCES-015": os.path.join(IMAGES_PROD_DIR, "foodrite_tomato_ketchup.jpg"),
    "SAUCES-016": os.path.join(PUBLIC_IMAGES_DIR, "gourmet_sauces.jpg"),
    "SAUCES-017": os.path.join(IMAGES_PROD_DIR, "foodrite_tomato_ketchup.jpg"),
    "SAUCES-019": os.path.join(IMAGES_PROD_DIR, "delmonte_pizza_pasta_sauce.png"),
    "SAUCES-020": os.path.join(PUBLIC_IMAGES_DIR, "gourmet_sauces.jpg"),
    "SAUCES-021": os.path.join(IMAGES_PROD_DIR, "delmonte_pizza_pasta_sauce.png"),
    "SAUCES-022": os.path.join(IMAGES_PROD_DIR, "foodrite_tomato_ketchup.jpg"),

    # Mojito Syrups & Crushes
    "SYRUPS-001": os.path.join(IMAGES_PROD_DIR, "mojito_blue_curacao.jpg"),
    "SYRUPS-006": os.path.join(IMAGES_PROD_DIR, "mojito_lime_mint.jpg"),

    # Spices & Seasonings
    "SPICES-001": os.path.join(IMAGES_PROD_DIR, "chilli_powder.jpg"),
    "SPICES-002": os.path.join(IMAGES_PROD_DIR, "chilli_powder.jpg"),
    "SPICES-003": os.path.join(IMAGES_PROD_DIR, "spices_blend.jpg"),
    "SPICES-006": os.path.join(IMAGES_PROD_DIR, "turmeric_powder.jpg"),

    # Food Packaging & Disposables
    "PACKAGING-001": os.path.join(IMAGES_PROD_DIR, "kraft_burger_box.jpg"),
    "PACKAGING-002": os.path.join(IMAGES_PROD_DIR, "kraft_burger_box.jpg"),
    "PACKAGING-003": os.path.join(IMAGES_PROD_DIR, "chicken_bucket.jpg"),
    "PACKAGING-005": os.path.join(PUBLIC_IMAGES_DIR, "burger_boxes.jpg"),
    "PACKAGING-006": os.path.join(IMAGES_PROD_DIR, "chicken_bucket.jpg"),
    "PACKAGING-008": os.path.join(IMAGES_PROD_DIR, "kraft_pizza_box.jpg"),
    "PACKAGING-009": os.path.join(IMAGES_PROD_DIR, "kraft_pizza_box.jpg"),
    "PACKAGING-010": os.path.join(IMAGES_PROD_DIR, "kraft_pizza_box.jpg"),
    "PACKAGING-012": os.path.join(IMAGES_PROD_DIR, "kraft_pizza_box.jpg")
}

def enhance_image(img_path, target_size=(600, 600)):
    """
    Takes an image, resizes to target_size with Lanczos, applies unsharp mask,
    vibrant saturation boost and contrast tuning, returning a clean JPEG base64 string.
    """
    try:
        im = Image.open(img_path).convert('RGB')
        
        # If image is smaller than target_size, upscale with Lanczos
        # If larger, resize down to target_size for optimal fast web loading & crispness
        im_resized = im.resize(target_size, Image.Resampling.LANCZOS)
        
        # Apply subtle edge enhancement
        im_sharp = im_resized.filter(ImageFilter.UnsharpMask(radius=1.8, percent=140, threshold=2))
        
        # Enhance color vibrancy
        color_enhancer = ImageEnhance.Color(im_sharp)
        im_color = color_enhancer.enhance(1.15)
        
        # Enhance contrast
        contrast_enhancer = ImageEnhance.Contrast(im_color)
        im_final = contrast_enhancer.enhance(1.08)
        
        # Save to buffer
        buf = BytesIO()
        im_final.save(buf, format="JPEG", quality=88, optimize=True)
        b64_str = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode('utf-8')
        return b64_str, im_final
    except Exception as e:
        print(f"Error enhancing {img_path}: {e}")
        return None, None

# Load catalogue.html
with open(CATALOGUE_HTML, 'r', encoding='utf-8') as f:
    cat_html = f.read()

m = re.search(r'const products = (\[.*?\]);', cat_html, re.DOTALL)
if not m:
    print("Could not find products array in catalogue.html")
    exit(1)

products = json.loads(m.group(1))
print(f"Enhancing images for {len(products)} products...")

enhanced_count = 0
studio_match_count = 0

for i, p in enumerate(products):
    sku = p.get('sku', '')
    curr_file = p.get('img_file', '')
    
    # Priority 1: Check Studio Match Map
    matched_path = None
    if sku in STUDIO_PHOTO_MAP and os.path.exists(STUDIO_PHOTO_MAP[sku]):
        matched_path = STUDIO_PHOTO_MAP[sku]
        studio_match_count += 1
    
    # Priority 2: Check assets/products
    if not matched_path:
        test_path = os.path.join(ASSETS_PROD_DIR, curr_file)
        if os.path.exists(test_path):
            matched_path = test_path
            
    # Priority 3: Check images/products
    if not matched_path:
        test_path2 = os.path.join(IMAGES_PROD_DIR, curr_file)
        if os.path.exists(test_path2):
            matched_path = test_path2
            
    if matched_path:
        new_b64, im_saved = enhance_image(matched_path)
        if new_b64:
            p['b64'] = new_b64
            p['img_file'] = os.path.basename(matched_path)
            enhanced_count += 1
            
            # Also save enhanced high-res image back to assets/products for React website!
            saved_name = f"enhanced_{sku.lower()}.jpg"
            save_path = os.path.join(ASSETS_PROD_DIR, saved_name)
            im_saved.save(save_path, "JPEG", quality=90)
            p['local_asset'] = f"/assets/products/{saved_name}"

print(f"Successfully enhanced {enhanced_count} products ({studio_match_count} studio photography matches)!")

# Rebuild catalogue.html with new enriched products array
new_products_json = json.dumps(products)
new_cat_html = re.sub(r'const products = \[.*?\];', f'const products = {new_products_json};', cat_html, flags=re.DOTALL)

with open(CATALOGUE_HTML, 'w', encoding='utf-8') as f:
    f.write(new_cat_html)
print(f"Updated {CATALOGUE_HTML}")

# Update RAIS_Product_Catalogue_No_Prices.html
NO_PRICES_HTML = os.path.join(BASE_DIR, "public", "RAIS_Product_Catalogue_No_Prices.html")
with open(NO_PRICES_HTML, 'w', encoding='utf-8') as f:
    f.write(new_cat_html)
print(f"Updated {NO_PRICES_HTML}")

# Update dist and backend static
import shutil
DIST_HTML = os.path.join(BASE_DIR, "dist", "catalogue.html")
if os.path.exists(os.path.dirname(DIST_HTML)):
    shutil.copy2(CATALOGUE_HTML, DIST_HTML)
    shutil.copy2(NO_PRICES_HTML, os.path.join(BASE_DIR, "dist", "RAIS_Product_Catalogue_No_Prices.html"))
    print("Copied to dist/")

BACKEND_STATIC = os.path.join(os.path.dirname(BASE_DIR), "rais-growth-engine", "backend", "static")
if os.path.exists(BACKEND_STATIC):
    shutil.copy2(CATALOGUE_HTML, os.path.join(BACKEND_STATIC, "catalogue.html"))
    shutil.copy2(NO_PRICES_HTML, os.path.join(BACKEND_STATIC, "RAIS_Product_Catalogue_No_Prices.html"))
    print("Copied to backend static/")

print("Catalogue image enhancement complete!")
