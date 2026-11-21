import os
import json
import re
import base64
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WAPP_DIR = r"C:\Users\affra\Pictures\wapp"
ASSETS_PROD_DIR = os.path.join(BASE_DIR, "public", "assets", "products")
IMAGES_PROD_DIR = os.path.join(BASE_DIR, "public", "images", "products")
PUB_IMG_DIR = os.path.join(BASE_DIR, "public", "images")
CATALOGUE_HTML = os.path.join(BASE_DIR, "public", "catalogue.html")
NO_PRICES_HTML = os.path.join(BASE_DIR, "public", "RAIS_Product_Catalogue_No_Prices.html")

# 1. Exact Mapping of Original WhatsApp Photos & Studio Photography
# Maps SKU to the best original photo path
WAPP_PHOTO_MAP = {
    # Non-Veg Chicken Snacks
    "CHICKEN-001": os.path.join(ASSETS_PROD_DIR, "triken_chicken_momos.jpg"),
    "CHICKEN-002": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.32 PM (1).jpeg"), # ITC Crunchy Chicken Nuggets
    "CHICKEN-003": os.path.join(IMAGES_PROD_DIR, "itc_chicken_fingers.webp"),
    "CHICKEN-004": os.path.join(ASSETS_PROD_DIR, "chicken_patty.jpg"),
    "CHICKEN-005": os.path.join(IMAGES_PROD_DIR, "itc_chicken_popcorn.webp"),
    "CHICKEN-006": os.path.join(ASSETS_PROD_DIR, "spring_rolls.jpg"),

    # Veg Snacks & Fries
    "VEG-001": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.35 PM.jpeg"), # AMUL French Fries 9mm original pack
    "VEG-002": os.path.join(IMAGES_PROD_DIR, "mccain_aloo_tikki.png"),
    "VEG-003": os.path.join(IMAGES_PROD_DIR, "itc_crispy_cheese_fills.webp"),
    "VEG-004": os.path.join(IMAGES_PROD_DIR, "paneer_pops.png"),
    "VEG-005": os.path.join(IMAGES_PROD_DIR, "itc_cheese_jalapeno_nuggets.webp"),
    "VEG-006": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.36 PM.jpeg"), # Hup Hup French Fries 6mm original pack
    "VEG-007": os.path.join(ASSETS_PROD_DIR, "veg_momos.jpg"),
    "VEG-008": os.path.join(PUB_IMG_DIR, "cheesy_triangle.jpg"),
    "VEG-009": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.32 PM.jpeg"), # Chill Fill Veg Burger Patty original pack
    "VEG-010": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.34 PM.jpeg"), # ITC Spicy Paneer Patty original pack
    "VEG-011": os.path.join(IMAGES_PROD_DIR, "mccain_smiles.png"),
    "VEG-012": os.path.join(IMAGES_PROD_DIR, "mccain_smiles.png"),
    "VEG-013": os.path.join(ASSETS_PROD_DIR, "spring_rolls.jpg"),
    "VEG-014": os.path.join(ASSETS_PROD_DIR, "veggie_balls.jpg"),

    # Dairy Essentials & Sweet Corn
    "DAIRY-001": os.path.join(ASSETS_PROD_DIR, "nutrilite_butter.jpg"),
    "DAIRY-002": os.path.join(ASSETS_PROD_DIR, "nutrilite_butter.jpg"),
    "DAIRY-003": os.path.join(ASSETS_PROD_DIR, "milky_mist_cheese_slices.jpg"),
    "DAIRY-004": os.path.join(ASSETS_PROD_DIR, "milky_mist_mozzarella_1kg.jpg"),
    "DAIRY-005": os.path.join(ASSETS_PROD_DIR, "milky_mist_mozzarella_2kg.jpg"),
    "DAIRY-006": os.path.join(ASSETS_PROD_DIR, "paneer_diced_cubes.jpg"),
    "DAIRY-007": os.path.join(IMAGES_PROD_DIR, "itc_potato_shots.webp"),
    "DAIRY-008": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.33 PM.jpeg"), # American Sweet Corn pack

    # Bakery, Buns & Bases
    "BAKERY-001": os.path.join(ASSETS_PROD_DIR, "burger_buns.jpg"),
    "BAKERY-002": os.path.join(ASSETS_PROD_DIR, "pizza_base.jpg"),
    "BAKERY-003": os.path.join(ASSETS_PROD_DIR, "pizza_base.jpg"),
    "BAKERY-004": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 5.51.39 PM.jpeg"), # Signature Tortilla 10" pack
    "BAKERY-005": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 5.51.38 PM (2).jpeg"), # Signature Tortilla 8.5" pack

    # Gourmet Sauces & Mayonnaise
    "SAUCES-001": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.30 PM.jpeg"), # Foodrite/Mealtime Mayo
    "SAUCES-002": os.path.join(IMAGES_PROD_DIR, "delmonte_tomato_ketchup.png"),
    "SAUCES-003": os.path.join(IMAGES_PROD_DIR, "delmonte_tomato_ketchup.png"),
    "SAUCES-004": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.08 PM (1).jpeg"), # Culinary Sauce 5kg
    "SAUCES-005": os.path.join(IMAGES_PROD_DIR, "delmonte_tandoori_mayo.png"),
    "SAUCES-006": os.path.join(IMAGES_PROD_DIR, "delmonte_tomato_ketchup.png"),
    "SAUCES-007": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.28 PM (1).jpeg"), # Del Monte Creamy Cheese
    "SAUCES-008": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.08 PM (3).jpeg"), # Del Monte Ketchup 8g Sachets
    "SAUCES-009": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.28 PM.jpeg"), # Del Monte Pizza Pasta Sauce
    "SAUCES-010": os.path.join(IMAGES_PROD_DIR, "delmonte_tomato_ketchup.png"),
    "SAUCES-011": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.22 PM.jpeg"), # Del Monte BBQ Sauce 1kg
    "SAUCES-012": os.path.join(IMAGES_PROD_DIR, "delmonte_eggless_mayo.png"),
    "SAUCES-013": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.08 PM.jpeg"), # Foodrite Mayonnaise 8g Sachets
    "SAUCES-014": os.path.join(IMAGES_PROD_DIR, "foodrite_mayonnaise.jpg"),
    "SAUCES-015": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.05 PM (1).jpeg"), # Foodrite Tomato Ketchup Pouch
    "SAUCES-016": os.path.join(IMAGES_PROD_DIR, "foodrite_tomato_ketchup.jpg"),
    "SAUCES-017": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.06 PM (1).jpeg"), # FDR 5kg Can Tomato Sauce
    "SAUCES-018": os.path.join(IMAGES_PROD_DIR, "delmonte_ketchup_sachet.png"),
    "SAUCES-019": os.path.join(IMAGES_PROD_DIR, "delmonte_pizza_pasta_sauce.png"),
    "SAUCES-020": os.path.join(IMAGES_PROD_DIR, "delmonte_tomato_ketchup.png"),
    "SAUCES-021": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.25 PM.jpeg"), # Del Monte Spicy Pizza Pasta
    "SAUCES-022": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.06 PM.jpeg"), # Tomato Sauce 5kg Can Side
    "SAUCES-023": os.path.join(ASSETS_PROD_DIR, "cooking_vinegar.jpg"),
    "SAUCES-024": os.path.join(ASSETS_PROD_DIR, "butter_paper_pack.jpg"),

    # Mojito Syrups & Crushes
    "SYRUPS-001": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.20 PM.jpeg"), # MANAMA Blue Curacao
    "SYRUPS-002": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-003": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-004": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-005": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.18 PM.jpeg"), # MANAMA Strawberry Mojito
    "SYRUPS-006": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 5.51.38 PM (1).jpeg"), # MANAMA Lime & Mint Trio
    "SYRUPS-007": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-008": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-009": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-010": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-011": os.path.join(ASSETS_PROD_DIR, "manama_syrups_front.jpg"),
    "SYRUPS-012": os.path.join(ASSETS_PROD_DIR, "foodrite_chocolate_dressing.jpg"),

    # Spices, Seasonings & Breading
    "SPICES-001": os.path.join(IMAGES_PROD_DIR, "chilli_powder.jpg"),
    "SPICES-002": os.path.join(IMAGES_PROD_DIR, "chilli_powder.jpg"),
    "SPICES-003": os.path.join(IMAGES_PROD_DIR, "spices_blend.jpg"),
    "SPICES-004": os.path.join(ASSETS_PROD_DIR, "chilli_flakes.jpg"),
    "SPICES-005": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.26 PM.jpeg"), # Big Bell / VKL Oregano
    "SPICES-006": os.path.join(IMAGES_PROD_DIR, "turmeric_powder.jpg"),
    "SPICES-007": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.24 PM.jpeg"), # VKL Crispy Cajun Breading Mix
    "SPICES-008": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.23 PM.jpeg"), # VKL Extra H&S Marinade
    "SPICES-009": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.05 PM.jpeg"), # VKL Peri Peri Sprinkler

    # Packaging Solutions
    "PACKAGING-001": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.07 PM (1).jpeg"), # Printed Burger Box 4x4
    "PACKAGING-002": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.07 PM (1).jpeg"), # Printed Burger Box 5x5
    "PACKAGING-003": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 5.51.38 PM.jpeg"), # KFC Bucket
    "PACKAGING-004": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.08 PM (2).jpeg"), # Butter Paper Pack
    "PACKAGING-005": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 5.51.37 PM.jpeg"), # Pizza & Burger Boxes Display
    "PACKAGING-006": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 5.51.38 PM.jpeg"), # KFC Bucket
    "PACKAGING-007": os.path.join(ASSETS_PROD_DIR, "mayo_portion_cups.jpg"),
    "PACKAGING-008": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.07 PM.jpeg"), # Pizza Box 8x8 Printed
    "PACKAGING-009": os.path.join(ASSETS_PROD_DIR, "pizza_boxes_assortment.jpg"),
    "PACKAGING-010": os.path.join(ASSETS_PROD_DIR, "pizza_boxes_assortment.jpg"),
    "PACKAGING-011": os.path.join(ASSETS_PROD_DIR, "tissue_papers_pack.jpg"),
    "PACKAGING-012": os.path.join(WAPP_DIR, "WhatsApp Image 2026-10-25 at 6.30.07 PM.jpeg") # Pizza Box 8x8 Laminated
}

def process_image(img_path, target_size=(600, 600)):
    """Square-crops, resizes to target_size, enhances, and returns base64 + image object."""
    try:
        im = Image.open(img_path).convert('RGB')
        w, h = im.size
        min_dim = min(w, h)
        
        # Center square crop
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        im_cropped = im.crop((left, top, left + min_dim, top + min_dim))
        im_resized = im_cropped.resize(target_size, Image.Resampling.LANCZOS)
        
        # Sharpening and vibrancy
        im_sharp = im_resized.filter(ImageFilter.UnsharpMask(radius=1.6, percent=130, threshold=2))
        color_enhancer = ImageEnhance.Color(im_sharp)
        im_color = color_enhancer.enhance(1.12)
        contrast_enhancer = ImageEnhance.Contrast(im_color)
        im_final = contrast_enhancer.enhance(1.06)
        
        buf = BytesIO()
        im_final.save(buf, format="JPEG", quality=88, optimize=True)
        b64_str = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode('utf-8')
        return b64_str, im_final
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return None, None

# Load catalogue.html
with open(CATALOGUE_HTML, 'r', encoding='utf-8') as f:
    cat_html = f.read()

m = re.search(r'const products = (\[.*?\]);', cat_html, re.DOTALL)
if not m:
    print("Could not find products array in catalogue.html")
    exit(1)

products = json.loads(m.group(1))
print(f"Applying original photos to {len(products)} products...")

updated_count = 0
wapp_count = 0

for i, p in enumerate(products):
    sku = p.get('sku', '')
    
    # 1. Check exact WAPP_PHOTO_MAP
    chosen_path = None
    if sku in WAPP_PHOTO_MAP and os.path.exists(WAPP_PHOTO_MAP[sku]):
        chosen_path = WAPP_PHOTO_MAP[sku]
        if "wapp" in chosen_path.lower():
            wapp_count += 1
            
    # 2. Fallback: check enhanced_*.jpg in assets/products
    if not chosen_path:
        test_enh = os.path.join(ASSETS_PROD_DIR, f"enhanced_{sku.lower()}.jpg")
        if os.path.exists(test_enh):
            chosen_path = test_enh
            
    # 3. Fallback: check images/products
    if not chosen_path:
        curr_file = p.get('img_file', '')
        test_img = os.path.join(IMAGES_PROD_DIR, curr_file)
        if os.path.exists(test_img):
            chosen_path = test_img
            
    if chosen_path:
        b64_str, im_final = process_image(chosen_path)
        if b64_str:
            p['b64'] = b64_str
            # Save enhanced version in assets/products
            saved_name = f"enhanced_{sku.lower()}.jpg"
            save_path = os.path.join(ASSETS_PROD_DIR, saved_name)
            im_final.save(save_path, "JPEG", quality=90)
            p['local_asset'] = f"/assets/products/{saved_name}"
            p['img_file'] = os.path.basename(chosen_path)
            updated_count += 1

print(f"Successfully updated {updated_count} products with original/enhanced high-res photos ({wapp_count} direct WhatsApp originals)!")

# Rebuild catalogue.html
new_products_json = json.dumps(products)
new_cat_html = re.sub(r'const products = \[.*?\];', f'const products = {new_products_json};', cat_html, flags=re.DOTALL)

with open(CATALOGUE_HTML, 'w', encoding='utf-8') as f:
    f.write(new_cat_html)
print(f"Updated {CATALOGUE_HTML}")

# Update NO_PRICES_HTML
with open(NO_PRICES_HTML, 'w', encoding='utf-8') as f:
    f.write(new_cat_html)
print(f"Updated {NO_PRICES_HTML}")

# Update dist
import shutil
DIST_DIR = os.path.join(BASE_DIR, "dist")
if os.path.exists(DIST_DIR):
    shutil.copy2(CATALOGUE_HTML, os.path.join(DIST_DIR, "catalogue.html"))
    shutil.copy2(NO_PRICES_HTML, os.path.join(DIST_DIR, "RAIS_Product_Catalogue_No_Prices.html"))
    
    # Also copy assets/products to dist/assets/products
    dist_assets_prod = os.path.join(DIST_DIR, "assets", "products")
    os.makedirs(dist_assets_prod, exist_ok=True)
    for f in os.listdir(ASSETS_PROD_DIR):
        if f.startswith("enhanced_") and f.endswith(".jpg"):
            shutil.copy2(os.path.join(ASSETS_PROD_DIR, f), os.path.join(dist_assets_prod, f))
    print("Copied updated catalogues and enhanced assets to dist/")

print("Original photos application complete!")
