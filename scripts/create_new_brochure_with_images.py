import os
import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Target URLs and info
CATALOGUE_URL = "https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html"
HOTLINE = "+91 93474 53135"
DEPOT_ADDR = "Beside Indel Money Bank, Sundupalli Road, Near Reddies Colony, Rayachoti – 516269"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_DIR = os.path.join(BASE_DIR, "public", "images", "ref-assets")
PROD_DIR = os.path.join(BASE_DIR, "public", "images", "products")
PUB_IMG = os.path.join(BASE_DIR, "public", "images")

# Canvas dimensions (2400 x 3400 px, 300 DPI A4/A3 print proportion)
W, H = 2400, 3400
canvas = Image.new('RGB', (W, H), '#080f24')
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_brand = ImageFont.truetype("arialbd.ttf", 92)
    font_h1 = ImageFont.truetype("arialbd.ttf", 58)
    font_h2 = ImageFont.truetype("arialbd.ttf", 44)
    font_h3 = ImageFont.truetype("arialbd.ttf", 34)
    font_body = ImageFont.truetype("arial.ttf", 28)
    font_body_bold = ImageFont.truetype("arialbd.ttf", 28)
    font_small = ImageFont.truetype("arial.ttf", 22)
    font_badge = ImageFont.truetype("arialbd.ttf", 24)
    font_item_bold = ImageFont.truetype("arialbd.ttf", 24)
    font_item_sub = ImageFont.truetype("arial.ttf", 20)
    font_cat_icon = ImageFont.truetype("arialbd.ttf", 20)
except Exception:
    font_brand = font_h1 = font_h2 = font_h3 = font_body = font_body_bold = font_small = font_badge = font_item_bold = font_item_sub = font_cat_icon = ImageFont.load_default()

def make_circular_thumbnail(img_path, size=48, border_color="#f59e0b", border_w=2):
    """Creates an anti-aliased circular thumbnail with an accent ring."""
    try:
        im = Image.open(img_path).convert('RGBA')
        # scale up slightly for supersampling antialiasing
        ss_size = size * 2
        im_res = im.resize((ss_size, ss_size), Image.Resampling.LANCZOS)
        
        mask = Image.new('L', (ss_size, ss_size), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0, ss_size, ss_size), fill=255)
        
        circle_im = Image.new('RGBA', (ss_size, ss_size), (0, 0, 0, 0))
        circle_im.paste(im_res, (0, 0), mask)
        
        draw_circle = ImageDraw.Draw(circle_im)
        draw_circle.ellipse((1, 1, ss_size - 2, ss_size - 2), outline=border_color, width=border_w * 2)
        
        # scale down to final size
        return circle_im.resize((size, size), Image.Resampling.LANCZOS)
    except Exception as e:
        print(f"Error creating thumb for {img_path}: {e}")
        # fallback square with text
        fallback = Image.new('RGBA', (size, size), '#1e293b')
        draw_fb = ImageDraw.Draw(fallback)
        draw_fb.rectangle([(0, 0), (size-1, size-1)], outline=border_color, width=border_w)
        return fallback

# 1. Header Gradient & Decorative Mesh (0 to 280)
for y in range(0, 280):
    ratio = y / 280.0
    r = int(8 + (15 - 8) * ratio)
    g = int(15 + (35 - 15) * ratio)
    b = int(36 + (85 - 36) * ratio)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Gold accent line under header
draw.rectangle([(0, 274), (W, 280)], fill="#f59e0b")

# Top contact bar (0 to 65)
draw.rectangle([(0, 0), (W, 65)], fill="#040817")
draw.text((70, 32), "🦁 RAIS AGENCIES — MASTER FOOD SERVICE & COLD-CHAIN HUB", fill="#f59e0b", font=font_badge, anchor="lm")
draw.text((W - 70, 32), f"📞 WHOLESALE HOTLINE: {HOTLINE}", fill="#22c55e", font=font_body_bold, anchor="rm")

# Logo + Header Content
logo_path = os.path.join(REF_DIR, "rais_logo_icon.png")
if os.path.exists(logo_path):
    try:
        logo_im = Image.open(logo_path).convert('RGBA')
        logo_thumb = make_circular_thumbnail(logo_path, size=150, border_color="#f59e0b", border_w=4)
        canvas.paste(logo_thumb, (90, 95), logo_thumb)
    except Exception as e:
        print("Logo paste error:", e)

draw.text((270, 125), "RAIS AGENCIES", fill="#ffffff", font=font_brand, anchor="lt")
draw.text((270, 205), "COMMERCIAL WHOLESALE FOOD SERVICE DISTRIBUTION HUB", fill="#38bdf8", font=font_h3, anchor="lt")
draw.text((270, 245), f"📍 Depot: {DEPOT_ADDR}  |  📞 Hotline: {HOTLINE}", fill="#cbd5e1", font=font_small, anchor="lt")

# 2. Top Visual Category Icons Row (y: 295 to 455) - EXACTLY LIKE OLD BROCHURE!
cat_bar_y = 295
draw.rounded_rectangle([(60, cat_bar_y), (W - 60, cat_bar_y + 160)], radius=20, fill="#0c1738", outline="#1e3a8a", width=2)

top_category_icons = [
    ("FRENCH FRIES", os.path.join(REF_DIR, "hero_fries_cutout.png")),
    ("NUGGETS", os.path.join(PROD_DIR, "itc_chicken_nuggets.webp")),
    ("BURGER PATTIES", os.path.join(REF_DIR, "hero_burger_stack.png")),
    ("POPCORN", os.path.join(REF_DIR, "hero_popcorn_cutout.png")),
    ("MOMOS / CHICKEN", os.path.join(REF_DIR, "hero_momos_cutout.png")),
    ("CHEESE & DAIRY", os.path.join(REF_DIR, "hero_cheese_cutout.png")),
    ("MAYO & SAUCES", os.path.join(PROD_DIR, "delmonte_tomato_ketchup.png")),
    ("PACKAGING", os.path.join(PROD_DIR, "kraft_pizza_box.jpg"))
]

icon_w = (W - 140) // 8
for i, (label, img_p) in enumerate(top_category_icons):
    center_x = 70 + i * icon_w + icon_w // 2
    thumb_y = cat_bar_y + 15
    if os.path.exists(img_p):
        thumb = make_circular_thumbnail(img_p, size=88, border_color="#f59e0b", border_w=3)
        canvas.paste(thumb, (center_x - 44, thumb_y), thumb)
    # Label
    draw.text((center_x, cat_bar_y + 128), label, fill="#e2e8f0", font=font_cat_icon, anchor="mm")

# 3. Interactive Hero QR & Sourcing Card (y: 470 to 800)
hero_y = 470
hero_h = 330
draw.rounded_rectangle([(60, hero_y), (W - 60, hero_y + hero_h)], radius=22, fill="#091430", outline="#38bdf8", width=2)

# QR Code inside hero card
qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=8, border=2)
qr.add_data(CATALOGUE_URL)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="#0b1329", back_color="#ffffff").convert('RGB')
qr_size = 270
qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)

qr_x = 100
qr_box_y = hero_y + 30
draw.rounded_rectangle([(qr_x - 10, qr_box_y - 10), (qr_x + qr_size + 10, qr_box_y + qr_size + 10)], radius=14, fill="#ffffff")
canvas.paste(qr_resized, (qr_x, qr_box_y))

text_x = qr_x + qr_size + 45
draw.text((text_x, hero_y + 45), "SCAN FOR LIVE 90-SKU CATALOGUE & DAILY WHOLESALE PRICE LIST", fill="#fcd34d", font=font_h2, anchor="lt")
draw.text((text_x, hero_y + 105), "Direct Cold-Chain Delivery & Depot Pickup across Rayachoty & Annamayya District", fill="#ffffff", font=font_body_bold, anchor="lt")
draw.text((text_x, hero_y + 150), "Point your smartphone camera to access instant wholesale prices, stock, and 1-click WhatsApp quote builder.", fill="#94a3b8", font=font_body, anchor="lt")

# Trust badges inside hero card
badge_y = hero_y + 215
badges = [
    ("❄️ -18°C Cold-Chain Fleet", "#0284c7"),
    ("⚡ Same-Day Depot Dispatch", "#d97706"),
    ("📦 Commercial Bulk Packs", "#15803d"),
    ("💬 WhatsApp PO Sourcing", "#059669")
]
cur_bx = text_x
for b_text, b_col in badges:
    b_w = int(draw.textlength(b_text, font=font_small)) + 26
    draw.rounded_rectangle([(cur_bx, badge_y), (cur_bx + b_w, badge_y + 38)], radius=19, fill=b_col)
    draw.text((cur_bx + b_w // 2, badge_y + 19), b_text, fill="#ffffff", font=font_small, anchor="mm")
    cur_bx += b_w + 12

direct_url = "Live Catalogue: https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html"
draw.text((text_x, hero_y + 280), direct_url, fill="#38bdf8", font=font_small, anchor="lt")

# 4. 8 Commercial Category Grids WITH PRODUCT IMAGES BESIDE EACH ITEM! (y: 815 to 2970)
categories = [
    {
        "title": "1. FROZEN NON-VEG SNACKS (CHICKEN)",
        "icon": "🍗",
        "header_bg": "#831843",
        "brands": "TRIKEN • ITC MASTER CHEF • NUTRICH • RAIS MASTER",
        "items": [
            ("CHICKEN MOMOS", "TRIKEN", "Commercial Poly Pack", os.path.join(PROD_DIR, "chicken_momos.jpg")),
            ("CRUNCHY CHICKEN NUGGETS", "ITC Master Chef", "1 KG Bulk Pack", os.path.join(PROD_DIR, "itc_chicken_nuggets.webp")),
            ("CHICKEN BURGER PATTY", "Nutrich", "1 KG Master Pack", os.path.join(PROD_DIR, "itc_chicken_patty.webp")),
            ("CHICKEN POPCORN BALLS", "Nutrich", "1 KG Commercial Pack", os.path.join(PROD_DIR, "itc_chicken_popcorn.webp")),
            ("CHICKEN BREAST FINGERS", "RAIS Master", "1.1 KG Pack", os.path.join(PROD_DIR, "itc_chicken_fingers.webp")),
            ("CHICKEN SPRING ROLLS", "RAIS Master", "500g Pack", os.path.join(PUB_IMG, "chicken_nuggets.jpg"))
        ]
    },
    {
        "title": "2. FROZEN VEG SNACKS & FRIES",
        "icon": "🍟",
        "header_bg": "#14532d",
        "brands": "AMUL • MCCAIN • GODREJ • ITC MASTER CHEF • CHILL FILL",
        "items": [
            ("AMUL FRENCH FRIES (9MM / 6MM)", "AMUL / Hup Hup", "2.5 KG Bulk Pack", os.path.join(PROD_DIR, "french_fries_basket.jpg")),
            ("ALOO TIKKI / VEG BURGER PATTY", "Chill Fill / McCain", "1.5 KG Pack", os.path.join(PROD_DIR, "mccain_aloo_tikki.png")),
            ("GODREJ PANEER POPS", "Godrej", "1 KG Pack", os.path.join(PROD_DIR, "paneer_pops.png")),
            ("GODREJ TANDOORI PANEER NUGGETS", "Godrej", "1 KG Pack", os.path.join(PROD_DIR, "itc_cheese_jalapeno_nuggets.webp")),
            ("ITC CHEESY CORN TRIANGLES", "ITC Master Chef", "1 KG Pack", os.path.join(PUB_IMG, "cheesy_triangle.jpg")),
            ("MCCAIN SMILES & MASALA FRIES", "McCain", "1.5 KG Commercial Pack", os.path.join(PROD_DIR, "mccain_smiles.png"))
        ]
    },
    {
        "title": "3. DAIRY ESSENTIALS & SWEET CORN",
        "icon": "🧀",
        "header_bg": "#713f12",
        "brands": "MILKY MIST • AMUL • FRESH AGRO • NUTRILITE",
        "items": [
            ("MILKY MIST MOZZARELLA DICED", "Milky Mist", "1 KG & 2 KG Packs", os.path.join(PUB_IMG, "mozzarella_cheese.jpg")),
            ("MILKY MIST CHEESE SLICES", "Milky Mist", "765g (Burger/Sandwich)", os.path.join(REF_DIR, "hero_cheese_cutout.png")),
            ("MILKY MIST FRESH PANEER CUBES", "Milky Mist", "1 KG Pack", os.path.join(PROD_DIR, "paneer_pops.png")),
            ("AMUL FRESH CREAM (1 LITRE)", "Amul", "1 Ltr Tetra Pack", os.path.join(REF_DIR, "hero_butter_cutout.png")),
            ("NUTRILITE TABLE BUTTER", "Nutrilite", "500g Commercial Pack", os.path.join(REF_DIR, "hero_butter_cutout.png")),
            ("AMERICAN SWEET CORN (KERNELS)", "Fresh Agro", "1 KG Frozen Pack", os.path.join(PROD_DIR, "sweet_corn.jpg"))
        ]
    },
    {
        "title": "4. BAKERY, BUNS & PIZZA BASES",
        "icon": "🍔",
        "header_bg": "#7c2d12",
        "brands": "BAKE FRESH • SIGNATURE • COMMERCIAL HORECA",
        "items": [
            ("COMMERCIAL BURGER BUNS", "Bake Fresh", "Fresh Bakery Crates", os.path.join(REF_DIR, "hero_burger_stack.png")),
            ("PIZZA BASE 8 INCH & 9 INCH", "Bake Fresh", "Packet of 5 / Daily Fresh", os.path.join(PROD_DIR, "pizza_base.jpg")),
            ("SIGNATURE TORTILLA WRAP 8.5 INCH", "Signature", "Commercial Packet", os.path.join(PROD_DIR, "tortilla_wraps.jpg")),
            ("SIGNATURE TORTILLA WRAP 10 INCH", "Signature", "Commercial Packet", os.path.join(PROD_DIR, "tortilla_wraps.jpg")),
            ("GARLIC BREAD & TOAST BASES", "Bake Fresh", "HORECA Grade", os.path.join(REF_DIR, "cat_breadmix_ice.png")),
            ("WHITE BREAD CRUMBS", "Commercial Grade", "1 KG Pack", os.path.join(REF_DIR, "cat_breadmix_ice.png"))
        ]
    },
    {
        "title": "5. GOURMET SAUCES, MAYO & CONDIMENTS",
        "icon": "🥫",
        "header_bg": "#701a75",
        "brands": "DEL MONTE • FOODRITE • MAYANK GOLD • SPIC'S",
        "items": [
            ("DEL MONTE TOMATO KETCHUP 1.1KG", "Del Monte", "1.1 KG Bottle / Sachet", os.path.join(PROD_DIR, "delmonte_tomato_ketchup.png")),
            ("DEL MONTE KETCHUP 8G DISPENSER", "Del Monte", "Commercial Dispenser Box", os.path.join(PROD_DIR, "delmonte_ketchup_sachet.png")),
            ("FOODRITE SALAD MAYONNAISE 1KG", "Foodrite", "1 KG Poly Pack", os.path.join(PROD_DIR, "foodrite_mayonnaise.jpg")),
            ("FOODRITE MAYONNAISE 8G SACHETS", "Foodrite", "Packet of 100+ Sachets", os.path.join(PROD_DIR, "delmonte_ketchup_sachet.png")),
            ("DEL MONTE TANDOORI MAYO & CHEESE", "Del Monte", "1 KG Chef Pack", os.path.join(PROD_DIR, "delmonte_tandoori_mayo.png")),
            ("DEL MONTE PIZZA PASTA SAUCE & BBQ", "Del Monte", "1 KG Chef Pouch", os.path.join(PROD_DIR, "delmonte_pizza_pasta_sauce.png"))
        ]
    },
    {
        "title": "6. MOJITO SYRUPS & FRUIT CRUSHES",
        "icon": "🍹",
        "header_bg": "#0c4a6e",
        "brands": "MANAMA • FOODRITE BEVERAGES",
        "items": [
            ("MANAMA BLUE CURACAO MOJITO SYRUP", "MANAMA", "1 Litre Glass Bottle", os.path.join(PROD_DIR, "mojito_blue_curacao.jpg")),
            ("MANAMA LIME AND MINT MOJITO SYRUP", "MANAMA", "1 Litre Glass Bottle", os.path.join(PROD_DIR, "mojito_lime_mint.jpg")),
            ("MANAMA GREEN APPLE & CHILLI GUAVA", "MANAMA", "1 Litre Bottle", os.path.join(REF_DIR, "cat_mojitos_ice.png")),
            ("MANAMA SPICY MANGO & ORANGE SYRUP", "MANAMA", "1 Litre Bottle", os.path.join(REF_DIR, "cat_mojitos_ice.png")),
            ("FOODRITE STRAWBERRY & BLUEBERRY CRUSH", "Foodrite", "1 KG Commercial Bottle", os.path.join(REF_DIR, "cat_mojitos_ice.png")),
            ("MR FOODRITE THICK CHOCOLATE TOPPING", "Foodrite", "1 KG Squeeze Bottle", os.path.join(REF_DIR, "cat_mojitos_ice.png"))
        ]
    },
    {
        "title": "7. SPICES, SEASONINGS & BREADING",
        "icon": "🌶️",
        "header_bg": "#7f1d1d",
        "brands": "VKL SEASONINGS • PURE SPICES • BHARAT",
        "items": [
            ("VKL CRISPY CAJUN BREADING MIX", "VKL", "1 KG Pack (Broast/Fried Chk)", os.path.join(REF_DIR, "cat_spices_ice.png")),
            ("VKL EXTRA H & S MARINADE", "VKL", "1 KG Commercial Pack", os.path.join(REF_DIR, "cat_spices_ice.png")),
            ("VKL PERI PERI SPRINKLER POWDER", "Pure Spices / VKL", "250g Sprinkler Pack", os.path.join(PROD_DIR, "spices_blend.jpg")),
            ("OREGANO & HERB SEASONING", "VKL / Big Bell", "500g Commercial Pack", os.path.join(PROD_DIR, "spices_blend.jpg")),
            ("CHILLI FLAKES FOR PIZZAS", "BHARAT", "1 KG Bulk Pack", os.path.join(PROD_DIR, "chilli_powder.jpg")),
            ("PURE CHILLY, TURMERIC & CORIANDER", "Pure Spices", "1 KG Commercial Packs", os.path.join(PROD_DIR, "turmeric_powder.jpg"))
        ]
    },
    {
        "title": "8. FOOD PACKAGING & DISPOSABLES",
        "icon": "📦",
        "header_bg": "#1e293b",
        "brands": "PACKAGING SOLUTIONS • FOOD-GRADE KRAFT",
        "items": [
            ("PIZZA BOX 8\"x8\" PRINTED / LAMINATED", "Packaging Sol.", "100 Nos Pack", os.path.join(PROD_DIR, "kraft_pizza_box.jpg")),
            ("PLAIN PIZZA BOX 9\"x9\" & 10\"x10\"", "Packaging Sol.", "100 Nos Pack", os.path.join(PROD_DIR, "kraft_pizza_box.jpg")),
            ("BURGER BOX 4\"x4\" & 5\"x5\" PRINTED", "Packaging Sol.", "100 Nos Pack", os.path.join(PROD_DIR, "kraft_burger_box.jpg")),
            ("CHICKEN BUCKET / KFC STYLE BUCKETS", "Packaging Sol.", "Sleeve of 34 Pieces", os.path.join(PROD_DIR, "chicken_bucket.jpg")),
            ("PORTION MAYO CUPS 35MM WITH LIDS", "Packaging Sol.", "1 Packet / Case", os.path.join(REF_DIR, "cat_packaging_ice.png")),
            ("FOOD-GRADE BUTTER PAPER & TISSUES", "Packaging Sol.", "1 KG Roll / Pack", os.path.join(REF_DIR, "cat_packaging_ice.png"))
        ]
    }
]

grid_y_start = 820
col_w = (W - 140 - 30) // 2
row_h = 515

for idx, cat in enumerate(categories):
    col = idx % 2
    row = idx // 2
    
    card_x = 65 + col * (col_w + 30)
    card_y = grid_y_start + row * (row_h + 20)

    # Outer Card
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + col_w, card_y + row_h)],
        radius=18,
        fill="#0a132c",
        outline="#1e293b",
        width=2
    )

    # Category Header Banner
    header_h = 56
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + col_w, card_y + header_h)],
        radius=16,
        fill=cat["header_bg"]
    )
    draw.rectangle([(card_x, card_y + header_h - 10), (card_x + col_w, card_y + header_h)], fill=cat["header_bg"])

    # Header text
    draw.text((card_x + 20, card_y + header_h // 2), f"{cat['icon']} {cat['title']}", fill="#ffffff", font=font_h3, anchor="lm")

    # Brands sub-bar
    draw.rectangle([(card_x, card_y + header_h), (card_x + col_w, card_y + header_h + 34)], fill="#0f1c3f")
    draw.text((card_x + 20, card_y + header_h + 17), f"OFFICIAL BRANDS: {cat['brands']}", fill="#38bdf8", font=font_small, anchor="lm")

    # Items listing WITH PRODUCT THUMBNAILS BESIDE EACH ITEM!
    item_start_y = card_y + header_h + 42
    for item_idx, (p_name, p_brand, p_pack, p_img) in enumerate(cat["items"]):
        line_y = item_start_y + item_idx * 62
        
        # Zebra background
        if item_idx % 2 == 0:
            draw.rectangle([(card_x + 8, line_y - 2), (card_x + col_w - 8, line_y + 54)], fill="#0d1938")
        
        # Circular Product Thumbnail Image Beside Item Name
        thumb_size = 48
        thumb_pos_x = card_x + 16
        thumb_pos_y = line_y + 2
        
        if os.path.exists(p_img):
            thumb_im = make_circular_thumbnail(p_img, size=thumb_size, border_color="#f59e0b", border_w=2)
            canvas.paste(thumb_im, (thumb_pos_x, thumb_pos_y), thumb_im)
        else:
            # bullet fallback
            draw.text((card_x + 20, line_y + 24), "•", fill="#f59e0b", font=font_body_bold, anchor="lm")

        # Product Name (shifted to make space for thumbnail)
        text_start_x = card_x + thumb_size + 30
        draw.text((text_start_x, line_y + 12), p_name, fill="#ffffff", font=font_item_bold, anchor="lt")
        
        # Brand & Pack Details
        draw.text((text_start_x, line_y + 36), f"{p_brand}  •  {p_pack}", fill="#94a3b8", font=font_item_sub, anchor="lt")
        
        # Ready Stock / Cold-Chain tag on right
        draw.rounded_rectangle([(card_x + col_w - 145, line_y + 12), (card_x + col_w - 15, line_y + 44)], radius=8, fill="#14532d")
        draw.text((card_x + col_w - 80, line_y + 28), "✓ IN STOCK", fill="#86efac", font=font_item_sub, anchor="mm")

# 5. Premium Brand Partners Ribbon (y: 2990 to 3120) WITH BRAND BADGES!
partner_y = 2990
draw.rounded_rectangle([(60, partner_y), (W - 60, partner_y + 110)], radius=18, fill="#0c1738", outline="#f59e0b", width=2)
draw.text((W // 2, partner_y + 30), "OFFICIAL COMMERCIAL FOOD SERVICE & HORECA PARTNERS", fill="#f59e0b", font=font_badge, anchor="mm")

# Brand logos / styled badges
partner_brands = [
    ("AMUL", "#e11d48", "#ffffff"),
    ("MILKY MIST", "#047857", "#ffffff"),
    ("DEL MONTE", "#9d174d", "#ffffff"),
    ("ITC MASTER CHEF", "#1e3a8a", "#ffffff"),
    ("TRIKEN", "#ea580c", "#ffffff"),
    ("GODREJ", "#15803d", "#ffffff"),
    ("FOODRITE", "#b91c1c", "#ffffff"),
    ("MANAMA", "#0284c7", "#ffffff"),
    ("MCCAIN", "#b45309", "#ffffff"),
    ("VKL", "#6b21a8", "#ffffff")
]

brand_card_w = (W - 160) // len(partner_brands)
for b_idx, (b_name, b_bg, b_fg) in enumerate(partner_brands):
    bc_x = 80 + b_idx * brand_card_w
    bc_y = partner_y + 55
    draw.rounded_rectangle([(bc_x + 4, bc_y), (bc_x + brand_card_w - 4, bc_y + 42)], radius=8, fill=b_bg)
    draw.text((bc_x + brand_card_w // 2, bc_y + 21), b_name, fill=b_fg, font=font_cat_icon, anchor="mm")

# 6. Bottom Action & Depot Footer (y: 3125 to 3370)
footer_y = 3125
footer_h = 230
draw.rounded_rectangle([(60, footer_y), (W - 60, footer_y + footer_h)], radius=22, fill="#040817", outline="#22c55e", width=3)

# Hotline CTA Box inside footer
draw.text((110, footer_y + 45), "CALL OR WHATSAPP FOR DAILY WHOLESALE RATES & FLEET DELIVERY:", fill="#cbd5e1", font=font_body, anchor="lt")
draw.text((110, footer_y + 100), f"💬 WhatsApp / Call: {HOTLINE}", fill="#22c55e", font=font_h1, anchor="lt")
draw.text((110, footer_y + 165), f"Depot: {DEPOT_ADDR}", fill="#94a3b8", font=font_body, anchor="lt")

# Right side order button badge
btn_w, btn_h = 490, 110
btn_x = W - 110 - btn_w
btn_y = footer_y + 60
draw.rounded_rectangle([(btn_x, btn_y), (btn_x + btn_w, btn_y + btn_h)], radius=20, fill="#22c55e")
draw.text((btn_x + btn_w // 2, btn_y + 38), "ORDER ON WHATSAPP", fill="#040817", font=font_h3, anchor="mm")
draw.text((btn_x + btn_w // 2, btn_y + 78), HOTLINE, fill="#040817", font=font_body_bold, anchor="mm")

# Save outputs
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "public", "images")
DIST_IMG_DIR = os.path.join(BASE_DIR, "dist", "images")
BACKEND_IMG_DIR = os.path.join(os.path.dirname(BASE_DIR), "rais-growth-engine", "backend", "static", "images")
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

brochure_jpg = os.path.join(PUBLIC_IMG_DIR, "brochure.jpg")
brochure_png = os.path.join(PUBLIC_IMG_DIR, "RAIS_Agencies_Wholesale_Brochure_2026.png")

canvas.save(brochure_jpg, "JPEG", quality=95, dpi=(300, 300))
canvas.save(brochure_png, "PNG", dpi=(300, 300))
print(f"Generated new brochure with images: {brochure_jpg} ({canvas.size})")

import shutil
for target_dir in [DIST_IMG_DIR, BACKEND_IMG_DIR, ARTIFACT_DIR]:
    if os.path.exists(target_dir):
        shutil.copy2(brochure_jpg, os.path.join(target_dir, "brochure.jpg"))
        shutil.copy2(brochure_png, os.path.join(target_dir, "RAIS_Agencies_Wholesale_Brochure_2026.png"))
        print(f"Copied brochure -> {target_dir}")

print("Brochure with product thumbnail images & brand badges generation complete!")
