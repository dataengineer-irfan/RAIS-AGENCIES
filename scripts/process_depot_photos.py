import os
from PIL import Image

wapp_dir = r"C:\Users\affra\Pictures\wapp\New folder"
web_prod_dir = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\public\assets\products"
backend_prod_dir = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-growth-engine\backend\static\assets\products"

os.makedirs(web_prod_dir, exist_ok=True)
os.makedirs(backend_prod_dir, exist_ok=True)

def save_both(img, filename):
    p1 = os.path.join(web_prod_dir, filename)
    p2 = os.path.join(backend_prod_dir, filename)
    img.save(p1, "JPEG", quality=92)
    img.save(p2, "JPEG", quality=92)
    print(f"Saved {filename} ({img.size}) to web and backend static.")

# 1. Meal Time Dark Soya Sauce (5kg Can) & Green Chilli Sauce (5kg Can)
# From WhatsApp Image 2026-11-24 at 3.24.00 PM.jpeg (1600x1376)
sauces_both_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.24.00 PM.jpeg")
if os.path.exists(sauces_both_path):
    with Image.open(sauces_both_path) as img:
        # Dark Soya Sauce (Left can)
        soya = img.crop((55, 60, 820, 1370))
        save_both(soya, "enhanced_sauces-025.jpg")
        save_both(soya, "meal_time_dark_soya_5kg.jpg")

        # Green Chilli Sauce (Right can)
        green_chilli = img.crop((855, 30, 1600, 1370))
        save_both(green_chilli, "enhanced_sauces-027.jpg")
        save_both(green_chilli, "meal_time_green_chilli_5kg.jpg")

# 2. Golden Crown Panko Bread Crumbs
panko_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.19.14 PM.jpeg")
if os.path.exists(panko_path):
    with Image.open(panko_path) as img:
        panko_crop = img.crop((50, 60, 1030, 1260))
        save_both(panko_crop, "enhanced_sauces-024.jpg")
        save_both(panko_crop, "golden_crown_panko_breadcrumbs.jpg")

# 3. Milky Mist Diced Mozzarella 1kg Packet
mozz_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.19.15 PM (1).jpeg")
if os.path.exists(mozz_path):
    with Image.open(mozz_path) as img:
        # Clean crop to the packet (ignoring top black phone UI bar)
        mozz_crop = img.crop((120, 300, 600, 680))
        save_both(mozz_crop, "enhanced_dairy-004.jpg")
        save_both(mozz_crop, "milky_mist_diced_mozzarella_1kg.jpg")

# 4. Meal Time Veg Mayonnaise (Eggless) Pouch
mayo_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.19.15 PM (2).jpeg")
if os.path.exists(mayo_path):
    with Image.open(mayo_path) as img:
        mayo_crop = img.crop((10, 10, 825, 1270))
        save_both(mayo_crop, "enhanced_sauces-006.jpg")
        save_both(mayo_crop, "meal_time_veg_mayo_1kg.jpg")

# 5. Fresh2Go 8.5" Tortilla Wrap
tortilla_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.19.15 PM.jpeg")
if os.path.exists(tortilla_path):
    with Image.open(tortilla_path) as img:
        tortilla_crop = img.crop((60, 10, 860, 810))
        save_both(tortilla_crop, "enhanced_bakery-005.jpg")
        save_both(tortilla_crop, "fresh2go_tortilla_wrap_85in.jpg")

# 6. Chef's Art Extra Hot & Spicy Marinade
marinade_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.19.17 PM.jpeg")
if os.path.exists(marinade_path):
    with Image.open(marinade_path) as img:
        marinade_crop = img.crop((10, 10, 815, 1030))
        save_both(marinade_crop, "enhanced_spices-008.jpg")
        save_both(marinade_crop, "chefs_art_hot_spicy_marinade.jpg")

# 7. MANAMA Syrups (Blue Curacao, Mojito, Strawberry)
syrups_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.19.18 PM.jpeg")
if os.path.exists(syrups_path):
    with Image.open(syrups_path) as img:
        syrup_crop = img.crop((20, 60, 3100, 4100))
        save_both(syrup_crop, "enhanced_syrups-001.jpg")
        save_both(syrup_crop, "manama_bar_syrups_shelf.jpg")

# 8. Mrs. Foodrite Veg Mayonnaise Sachets (8g)
sachets_path = os.path.join(wapp_dir, "WhatsApp Image 2026-11-24 at 3.19.16 PM.jpeg")
if os.path.exists(sachets_path):
    with Image.open(sachets_path) as img:
        sachets_crop = img.crop((10, 80, 855, 1140))
        save_both(sachets_crop, "enhanced_sauces-018.jpg")
        save_both(sachets_crop, "foodrite_mayo_sachets_bag.jpg")

print("All depot product photos processed successfully!")
