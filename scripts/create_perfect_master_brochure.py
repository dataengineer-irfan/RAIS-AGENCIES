import os
import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_DIR = os.path.join(BASE_DIR, "public", "images", "ref-assets")
PROD_DIR = os.path.join(BASE_DIR, "public", "images", "products")
ASSETS_PROD_DIR = os.path.join(BASE_DIR, "public", "assets", "products")
ENHANCED_DIR = os.path.join(BASE_DIR, "public", "assets", "enhanced_insta_photos")
PUB_IMG = os.path.join(BASE_DIR, "public", "images")

# URLs & Info
CATALOGUE_URL = "https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html"
WHATSAPP_URL = "https://wa.me/919347453135?text=Hi%20RAIS%20Agencies,%20I%20would%20like%20to%20enquire%20about%20your%20Wholesale%20Product%20Catalogue."
HOTLINE = "9347453135"
HOTLINE_DISPLAY = "+91 93474 53135"
DEPOT_ADDR = "Beside Indel Money Bank, Sundupalli Road, Near Reddies Colony, Rayachoty – 516269"

# Canvas dimensions (2400 x 3400, 300 DPI)
W, H = 2400, 3400
canvas = Image.new('RGB', (W, H), '#050a1a')
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_brand = ImageFont.truetype("arialbd.ttf", 94)
    font_sub_brand = ImageFont.truetype("arialbd.ttf", 36)
    font_h1 = ImageFont.truetype("segoeuib.ttf", 46)
    font_h2 = ImageFont.truetype("segoeuib.ttf", 36)
    font_table_hdr = ImageFont.truetype("segoeuib.ttf", 26)
    font_body_bold = ImageFont.truetype("segoeuib.ttf", 24)
    font_body = ImageFont.truetype("segoeui.ttf", 24)
    font_item_name = ImageFont.truetype("segoeuib.ttf", 23)
    font_small = ImageFont.truetype("segoeui.ttf", 20)
    font_small_bold = ImageFont.truetype("segoeuib.ttf", 20)
    font_badge = ImageFont.truetype("segoeuib.ttf", 22)
    font_cat_icon = ImageFont.truetype("segoeuib.ttf", 21)
    font_status = ImageFont.truetype("segoeuib.ttf", 19)
except Exception:
    font_brand = font_sub_brand = font_h1 = font_h2 = font_table_hdr = font_body_bold = font_body = font_item_name = font_small = font_small_bold = font_badge = font_cat_icon = font_status = ImageFont.load_default()

def make_circular_thumbnail(img_path, size=52, border_color="#f59e0b", border_w=2):
    """Creates a high-definition anti-aliased circular thumbnail with an accent border."""
    try:
        im = Image.open(img_path).convert('RGBA')
        ss_size = size * 3
        w, h = im.size
        
        # Fit inside square with white canvas
        scale = min(ss_size / w, ss_size / h)
        new_w = max(1, int(w * scale))
        new_h = max(1, int(h * scale))
        im_res = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        sq = Image.new('RGBA', (ss_size, ss_size), (255, 255, 255, 255))
        sq.paste(im_res, ((ss_size - new_w)//2, (ss_size - new_h)//2), im_res)
        
        mask = Image.new('L', (ss_size, ss_size), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0, ss_size, ss_size), fill=255)
        
        circle_im = Image.new('RGBA', (ss_size, ss_size), (0, 0, 0, 0))
        circle_im.paste(sq, (0, 0), mask)
        
        draw_circle = ImageDraw.Draw(circle_im)
        draw_circle.ellipse((2, 2, ss_size - 3, ss_size - 3), outline=border_color, width=border_w * 3)
        
        return circle_im.resize((size, size), Image.Resampling.LANCZOS)
    except Exception as e:
        print(f"Thumb error for {img_path}: {e}")
        fallback = Image.new('RGBA', (size, size), '#1e293b')
        draw_fb = ImageDraw.Draw(fallback)
        draw_fb.ellipse([(2, 2), (size-3, size-3)], fill='#0f172a', outline=border_color, width=border_w)
        return fallback

def generate_qr(data, size=180, dark_color="#000000", light_color="#ffffff"):
    qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=6, border=1)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color=dark_color, back_color=light_color).convert('RGB')
    return img.resize((size, size), Image.Resampling.LANCZOS)

# ==========================================
# 1. HEADER SECTION (y: 0 to 440)
# ==========================================
for y in range(0, 440):
    ratio = y / 440.0
    r = int(5 + (12 - 5) * ratio)
    g = int(10 + (22 - 10) * ratio)
    b = int(26 + (55 - 26) * ratio)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

draw.rectangle([(0, 434), (W, 440)], fill="#f59e0b")

# Draw Diamond Crest Logo
logo_cx, logo_cy = 160, 220
crest_size = 130
diamond = [
    (logo_cx, logo_cy - crest_size),
    (logo_cx + crest_size, logo_cy),
    (logo_cx, logo_cy + crest_size),
    (logo_cx - crest_size, logo_cy)
]
draw.polygon(diamond, fill="#07112c", outline="#f59e0b", width=6)
inner_diamond = [
    (logo_cx, logo_cy - crest_size + 14),
    (logo_cx + crest_size - 14, logo_cy),
    (logo_cx, logo_cy + crest_size - 14),
    (logo_cx - crest_size + 14, logo_cy)
]
draw.polygon(inner_diamond, outline="#0284c7", width=2)
draw.text((logo_cx, logo_cy - 20), "RAIS", fill="#f59e0b", font=font_h1, anchor="mm")
draw.text((logo_cx, logo_cy + 25), "FOODS", fill="#38bdf8", font=font_badge, anchor="mm")

# Brand Title & Slogans
draw.text((330, 110), "RAIS AGENCIES", fill="#ffffff", font=font_brand)
draw.text((335, 215), "RAYACHOTY'S PREMIER FOOD SERVICE & COLD-CHAIN DISTRIBUTOR", fill="#38bdf8", font=font_h2)
draw.text((335, 265), "Cold-Chain Frozen Foods • Sauces & Condiments • Mojito Syrups • Premium Packaging", fill="#94a3b8", font=font_body)
draw.text((335, 315), "📍 " + DEPOT_ADDR, fill="#cbd5e1", font=font_small_bold)

# Hotline Banner on top right
hotline_box = [(W - 680, 75), (W - 80, 230)]
draw.rounded_rectangle(hotline_box, radius=16, fill="#0f1c3f", outline="#f59e0b", width=3)
draw.text((W - 380, 115), "📞 ORDER HOTLINE / WHATSAPP", fill="#f59e0b", font=font_table_hdr, anchor="mm")
draw.text((W - 380, 175), HOTLINE_DISPLAY, fill="#ffffff", font=font_h1, anchor="mm")

# QR Codes in Header
qr_cat = generate_qr(CATALOGUE_URL, size=150)
qr_wa = generate_qr(WHATSAPP_URL, size=150)

cat_qr_x = W - 370
wa_qr_x = W - 180
qr_y = 255

canvas.paste(qr_cat, (cat_qr_x - 170, qr_y))
draw.text((cat_qr_x - 95, qr_y + 160), "📱 ONLINE CATALOGUE", fill="#38bdf8", font=font_status, anchor="mm")

canvas.paste(qr_wa, (wa_qr_x, qr_y))
draw.text((wa_qr_x + 75, qr_y + 160), "💬 DIRECT WHATSAPP", fill="#22c55e", font=font_status, anchor="mm")


# ==========================================
# 2. TOP CATEGORY VISUAL ICONS ROW (y: 455 to 640)
# ==========================================
cat_bar_y = 455
cat_bar_h = 175
draw.rounded_rectangle([(60, cat_bar_y), (W - 60, cat_bar_y + cat_bar_h)], radius=20, fill="#0a1434", outline="#1e3a8a", width=2)

top_category_icons = [
    ("FRENCH FRIES", os.path.join(ENHANCED_DIR, "02_Veg_Snacks", "amul_french_fries_9mm.jpg")),
    ("NUGGETS", os.path.join(ENHANCED_DIR, "01_Frozen_Chicken", "itc_master_chef_crunchy_chicken_nuggets_1kg.jpg")),
    ("BURGER PATTIES", os.path.join(ENHANCED_DIR, "02_Veg_Snacks", "chill_fill_veg_burger_patty.jpg")),
    ("POPCORN", os.path.join(ENHANCED_DIR, "01_Frozen_Chicken", "itc_master_chef_chicken_popcorn_1kg.jpg")),
    ("FRIED CHICKEN", os.path.join(ENHANCED_DIR, "07_Packaging_Disposables", "fried_chicken_buckets_carton_display.jpg")),
    ("CHEESE & DAIRY", os.path.join(ENHANCED_DIR, "03_Dairy_Cheese", "milky_mist_mozzarella_2kg_pack_studio.jpg")),
    ("MAYO & SAUCES", os.path.join(ENHANCED_DIR, "04_Sauces_Condiments", "delmonte_eggless_mayonnaise_premium_pouch.jpg")),
    ("PACKAGING", os.path.join(ENHANCED_DIR, "07_Packaging_Disposables", "pizza_boxes_8x8_printed_plain_flat.jpg"))
]

cat_w = (W - 140) // 8
for i, (label, img_path) in enumerate(top_category_icons):
    cx = 70 + i * cat_w + cat_w // 2
    thumb_y = cat_bar_y + 16
    thumb = make_circular_thumbnail(img_path, size=100, border_color="#f59e0b", border_w=3)
    canvas.paste(thumb, (cx - 50, thumb_y), thumb)
    draw.text((cx, cat_bar_y + 145), label, fill="#ffffff", font=font_cat_icon, anchor="mm")


# ==========================================
# 3. TABLES RENDERING HELPER (NO RATES, JUST PRODUCTS)
# ==========================================
def draw_commercial_table_no_rates(card_x, card_y, card_w, card_h, header_title, header_bg, header_icon, items):
    # Outer Card
    draw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + card_h)], radius=16, fill="#071026", outline="#1e293b", width=2)
    
    # Table Header Banner
    header_h = 56
    draw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + header_h)], radius=14, fill=header_bg)
    draw.rectangle([(card_x, card_y + header_h - 10), (card_x + card_w, card_y + header_h)], fill=header_bg)
    draw.text((card_x + 22, card_y + header_h//2), f"{header_icon} {header_title}", fill="#ffffff", font=font_h2, anchor="lm")
    
    # Column Sub-Header
    col_hdr_y = card_y + header_h
    col_hdr_h = 38
    draw.rectangle([(card_x, col_hdr_y), (card_x + card_w, col_hdr_y + col_hdr_h)], fill="#0f1c3f")
    draw.line([(card_x, col_hdr_y + col_hdr_h), (card_x + card_w, col_hdr_y + col_hdr_h)], fill="#334155", width=1)
    
    sno_w = 60
    img_w = 70
    status_w = 140
    qty_w = 210
    details_w = card_w - sno_w - img_w - qty_w - status_w - 30
    
    col_sno_x = card_x + 15
    col_img_x = col_sno_x + sno_w
    col_det_x = col_img_x + img_w
    col_qty_x = col_det_x + details_w
    col_sta_x = col_qty_x + qty_w
    
    draw.text((col_sno_x + sno_w//2, col_hdr_y + col_hdr_h//2), "S.NO.", fill="#94a3b8", font=font_table_hdr, anchor="mm")
    draw.text((col_det_x + 15, col_hdr_y + col_hdr_h//2), "PRODUCT DETAILS", fill="#94a3b8", font=font_table_hdr, anchor="lm")
    draw.text((col_qty_x + qty_w//2, col_hdr_y + col_hdr_h//2), "QUANTITY / PACK", fill="#94a3b8", font=font_table_hdr, anchor="mm")
    draw.text((col_sta_x + status_w//2, col_hdr_y + col_hdr_h//2), "STATUS", fill="#38bdf8", font=font_table_hdr, anchor="mm")
    
    # Rows
    row_y_start = col_hdr_y + col_hdr_h
    row_h = (card_h - header_h - col_hdr_h) / len(items)
    
    for idx, (sno, name, qty, img_p) in enumerate(items):
        ry = row_y_start + idx * row_h
        
        # Zebra striping
        if idx % 2 == 0:
            draw.rectangle([(card_x + 4, ry), (card_x + card_w - 4, ry + row_h)], fill="#0a1532")
        
        # Row bottom divider
        draw.line([(card_x + 10, ry + row_h), (card_x + card_w - 10, ry + row_h)], fill="#1e293b", width=1)
        
        # S.NO.
        draw.text((col_sno_x + sno_w//2, ry + row_h//2), str(sno), fill="#e2e8f0", font=font_body_bold, anchor="mm")
        
        # Circular Product Thumbnail Image (Pure clean product photos)
        thumb_size = 46
        thumb = make_circular_thumbnail(img_p, size=thumb_size, border_color="#f59e0b", border_w=2)
        canvas.paste(thumb, (col_img_x + (img_w - thumb_size)//2, int(ry + (row_h - thumb_size)//2)), thumb)
        
        # Product Name
        draw.text((col_det_x + 12, ry + row_h//2), name, fill="#ffffff", font=font_item_name, anchor="lm")
        
        # Quantity / Pack
        draw.text((col_qty_x + qty_w//2, ry + row_h//2), qty, fill="#cbd5e1", font=font_small, anchor="mm")
        
        # Status Pill (✓ IN STOCK)
        pill_w, pill_h = 115, 30
        pill_x = col_sta_x + (status_w - pill_w)//2
        pill_y = int(ry + (row_h - pill_h)//2)
        draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=8, fill="#15803d")
        draw.text((pill_x + pill_w//2, pill_y + pill_h//2), "✓ IN STOCK", fill="#ffffff", font=font_status, anchor="mm")


# ==========================================
# 4. TABLES DEFINITIONS WITH AUTHENTIC ORIGINAL PHOTOS
# ==========================================
col_w = 1115
left_x = 70
right_x = W - 70 - col_w

# --- TABLE 1: CHICKEN ITEMS (Left Top) ---
chicken_items = [
    (1, "SIGNATURE TORTILLA 8.5 INCHES", "1 PACKET", os.path.join(ENHANCED_DIR, "05_Bakery_Breading", "fresh2go_tortilla_wrap_8_5_inch.jpg")),
    (2, "SIGNATURE TORTILLA 10 INCHES", "1 PACKET", os.path.join(ENHANCED_DIR, "05_Bakery_Breading", "signature_tortilla_wraps_stack.jpg")),
    (3, "NUTRICH CHICKEN POPCORN BALL", "1 KG PACKET", os.path.join(ENHANCED_DIR, "01_Frozen_Chicken", "itc_master_chef_chicken_popcorn_1kg.jpg")),
    (4, "TRIKEN CHICKEN MOMOS", "1 PACKET", os.path.join(ENHANCED_DIR, "01_Frozen_Chicken", "triken_chicken_momos_pack_details.jpg")),
    (5, "ITC CRUNCHY CHICKEN NUGGETS", "1 KG PACKET", os.path.join(ENHANCED_DIR, "01_Frozen_Chicken", "itc_master_chef_crunchy_chicken_nuggets_1kg.jpg")),
    (6, "ITC CHICKEN BREAST STRIPS", "1 KG PACKET", os.path.join(ENHANCED_DIR, "01_Frozen_Chicken", "itc_chicken_breast_strips_1kg.jpg"))
]
t1_y = 650
t1_h = 475
draw_commercial_table_no_rates(left_x, t1_y, col_w, t1_h, "CHICKEN ITEMS", "#831843", "🍗", chicken_items)

# --- TABLE 2: KETCHUP & SAUCES (Right Top) ---
ketchup_items = [
    (1, "DELMONT TOMATO KETCHUP 1.1kg", "1 PACKET (1.1 KG)", os.path.join(PROD_DIR, "delmonte_tomato_ketchup.png")),
    (2, "FOODRITE TOMATO KETCHUP", "1 KG PACKET", os.path.join(PROD_DIR, "foodrite_tomato_ketchup.jpg")),
    (3, "DELMONTE KETCHUP (8g SACHET)", "DISPENSER BOX", os.path.join(PROD_DIR, "delmonte_ketchup_sachet.png")),
    (4, "DELMONT TANDOORI MAYO", "1 KG PACKET", os.path.join(PROD_DIR, "delmonte_tandoori_mayo.png")),
    (5, "DELMONTE CREAMY CHEESE SAUCE", "1 KG PACKET", os.path.join(ASSETS_PROD_DIR, "delmonte_creamy_cheese.jpg")),
    (6, "DELMONTE PIZZA PASTA SAUCE", "1 KG PACKET", os.path.join(PROD_DIR, "delmonte_pizza_pasta_sauce.png")),
    (7, "MAYANK GOLD KETCHUP (9g SACHET)", "DISPENSER BOX", os.path.join(PROD_DIR, "delmonte_ketchup_sachet.png")),
    (8, "FOODRITE SALAD MAYONNAISE", "1 KG PACKET", os.path.join(PROD_DIR, "foodrite_mayonnaise.jpg")),
    (9, "DELMONTE EGGLESS MAYONNAISE", "1 KG POUCH", os.path.join(ENHANCED_DIR, "04_Sauces_Condiments", "delmonte_eggless_mayonnaise_premium_pouch.jpg"))
]
t2_y = 650
t2_h = 670
draw_commercial_table_no_rates(right_x, t2_y, col_w, t2_h, "KETCHUP & SAUCES", "#c2410c", "🥫", ketchup_items)

# --- TABLE 3: VEG ITEMS (Left Middle) ---
veg_items = [
    (1, "AMUL FRENCH FRIES 9MM", "2.5 KG PACKET", os.path.join(ENHANCED_DIR, "02_Veg_Snacks", "amul_french_fries_9mm.jpg")),
    (2, "HUP HUP FRENCH FRIES 6MM", "2.5 KG PACKET", os.path.join(ENHANCED_DIR, "02_Veg_Snacks", "hup_hup_french_fries_6mm.jpg")),
    (3, "I.T.C VEG MOMOS", "1 PACKET", os.path.join(ASSETS_PROD_DIR, "veg_momos.jpg")),
    (4, "CHILL FILL VEG BURGER PATTY", "1.2 KG PACKET", os.path.join(ENHANCED_DIR, "02_Veg_Snacks", "chill_fill_veg_burger_patty.jpg")),
    (5, "MILKY MIST MALAI PANEER CUBES", "1 KG PACKET", os.path.join(ENHANCED_DIR, "03_Dairy_Cheese", "milky_mist_malai_paneer_cubes_1kg.jpg")),
    (6, "GODREJ PANEER POPS", "1 KG PACKET", os.path.join(PROD_DIR, "paneer_pops.png")),
    (7, "ITC CHEESY CORN TRIANGLE", "1 KG PACKET", os.path.join(ASSETS_PROD_DIR, "cheesy_triangle.jpg")),
    (8, "SWEET CORN (KERNELS)", "1 KG FROZEN PACK", os.path.join(ENHANCED_DIR, "02_Veg_Snacks", "american_sweet_corn_1kg.jpg")),
    (9, "CHILL FILL POTATO CHEESE SHOTZ", "1 KG PACKET", os.path.join(ENHANCED_DIR, "02_Veg_Snacks", "chill_fill_potato_cheese_shotz_1kg.jpg"))
]
t3_y = t1_y + t1_h + 20
t3_h = 670
draw_commercial_table_no_rates(left_x, t3_y, col_w, t3_h, "VEG ITEMS", "#15803d", "🥬", veg_items)

# --- TABLE 4: BREAD MIX & POWDERS (Right Middle 1) ---
bread_items = [
    (1, "VKL EXTRA H & S MARINADE", "1 KG PACKET", os.path.join(ASSETS_PROD_DIR, "vkl_extra_hs_marinade.jpg")),
    (2, "VKL CRISPY CAJUN BREADING MIX", "1 KG PACKET", os.path.join(ENHANCED_DIR, "05_Bakery_Breading", "vkl_crispy_cajun_breading_mix_pack.jpg")),
    (3, "VKL PERI PERI POWDER", "250 GRAMS PACKET", os.path.join(ASSETS_PROD_DIR, "vkl_peri_peri_sprinkler.jpg")),
    (4, "OREGANO & HERB SEASONING", "1 KG PACKET", os.path.join(ASSETS_PROD_DIR, "big_bell_oregano.jpg"))
]
t4_y = t2_y + t2_h + 20
t4_h = 350
draw_commercial_table_no_rates(right_x, t4_y, col_w, t4_h, "BREAD MIX & POWDERS", "#312e81", "🥣", bread_items)

# --- TABLE 5: CHEESE & SLICES (Right Middle 2) ---
cheese_items = [
    (1, "MILKY MIST MOZZARELLA 2KG PACK", "2 KG PACKET", os.path.join(ENHANCED_DIR, "03_Dairy_Cheese", "milky_mist_mozzarella_2kg_pack_studio.jpg")),
    (2, "MILKY MIST MOZZARELLA DICED CHEESE", "1 KG PACKET", os.path.join(ENHANCED_DIR, "03_Dairy_Cheese", "mozzarella_cheese_diced_cubes_plate.jpg")),
    (3, "MILKY MIST CHEESE SLICE", "765 GRAMS PACKET", os.path.join(ASSETS_PROD_DIR, "milky_mist_cheese_slices.jpg")),
    (4, "MILKY MIST PANEER (DICED CUBES)", "1 KG PACKET", os.path.join(ENHANCED_DIR, "03_Dairy_Cheese", "milky_mist_malai_paneer_cubes_1kg.jpg"))
]
t5_y = t4_y + t4_h + 20
t5_h = 350
draw_commercial_table_no_rates(right_x, t5_y, col_w, t5_h, "CHEESE & SLICES", "#854d0e", "🧀", cheese_items)

# --- TABLE 6: PIZZA BOXES & BURGER BOXES (Left Bottom) ---
box_items = [
    (1, "PIZZA BOX 8\"x8\" PRINTED / PLAIN", "100 NOS", os.path.join(ENHANCED_DIR, "07_Packaging_Disposables", "pizza_boxes_8x8_printed_plain_flat.jpg")),
    (2, "BURGER BOX 4\"x4\" PRINTED", "100 NOS", os.path.join(ENHANCED_DIR, "07_Packaging_Disposables", "burger_pastry_boxes_4x4_printed_flat.jpg")),
    (3, "BURGER BOX 5\"x5\" PRINTED", "100 NOS", os.path.join(ENHANCED_DIR, "07_Packaging_Disposables", "burger_pastry_boxes_4x4_printed_flat.jpg")),
    (4, "FRIED CHICKEN BUCKETS (34 PCS)", "1 CASE", os.path.join(ENHANCED_DIR, "07_Packaging_Disposables", "fried_chicken_buckets_carton_display.jpg")),
    (5, "DISPOSABLE BOWLS & FOOD CONTAINERS", "1 CASE", os.path.join(ENHANCED_DIR, "07_Packaging_Disposables", "clear_plastic_round_bowls_lids_stacks.jpg"))
]
t6_y = t3_y + t3_h + 20
t6_h = 420
draw_commercial_table_no_rates(left_x, t6_y, col_w, t6_h, "PIZZA BOXES & BURGER BOXES", "#1e293b", "📦", box_items)

# --- TABLE 7: SPICES (Right Bottom) ---
spices_items = [
    (1, "CHILLY POWDER NO 1 (PICKLE)", "1 KG PACKET", os.path.join(PROD_DIR, "chilli_powder.jpg")),
    (2, "CHILLY POWDER", "1 KG PACKET", os.path.join(PROD_DIR, "chilli_powder.jpg")),
    (3, "TURMERIC POWDER", "1 KG PACKET", os.path.join(PROD_DIR, "turmeric_powder.jpg")),
    (4, "CORIANDER POWDER", "1 KG PACKET", os.path.join(PROD_DIR, "spices_blend.jpg"))
]
t7_y = t5_y + t5_h + 20
t7_h = 350
draw_commercial_table_no_rates(right_x, t7_y, col_w, t7_h, "SPICES (CHEF GRADE)", "#991b1b", "🌶️", spices_items)

draw.rounded_rectangle([(right_x + col_w - 110, t7_y + 12), (right_x + col_w - 20, t7_y + 44)], radius=8, fill="#ef4444")
draw.text((right_x + col_w - 65, t7_y + 28), "★ NEW", fill="#ffffff", font=font_small_bold, anchor="mm")

# --- TABLE 8: MOJITOS (Spanning Table at Bottom) ---
mojitos_items = [
    (1, "LIME AND MINT MOJITO SYRUP", "1 BOTTLE (1 LITRE)", os.path.join(PROD_DIR, "mojito_lime_mint.jpg")),
    (2, "BLUECURCO MOJITO SYRUP", "1 BOTTLE (1 LITRE)", os.path.join(PROD_DIR, "mojito_blue_curacao.jpg"))
]
t8_y = max(t6_y + t6_h, t7_y + t7_h) + 20
t8_w = W - 140
t8_h = 240
draw_commercial_table_no_rates(left_x, t8_y, t8_w, t8_h, "MOJITOS & REFRESHERS (MANAMA)", "#0f766e", "🍹", mojitos_items)


# ==========================================
# 5. BRAND PARTNERS BAR (y: 2975 to 3130)
# ==========================================
brand_bar_y = 2975
draw.rounded_rectangle([(60, brand_bar_y), (W - 60, brand_bar_y + 140)], radius=18, fill="#07112c", outline="#f59e0b", width=2)
draw.text((W // 2, brand_bar_y + 28), "⭐ OUR AUTHORIZED COMMERCIAL BRANDS ⭐", fill="#f59e0b", font=font_table_hdr, anchor="mm")

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
    ("VKL", "#6b21a8", "#ffffff"),
    ("AYAMAS", "#c2410c", "#ffffff"),
    ("VENKY'S", "#0369a1", "#ffffff")
]

brand_card_w = (W - 160) // len(partner_brands)
for b_idx, (b_name, b_bg, b_fg) in enumerate(partner_brands):
    bc_x = 80 + b_idx * brand_card_w
    bc_y = brand_bar_y + 60
    draw.rounded_rectangle([(bc_x + 4, bc_y), (bc_x + brand_card_w - 4, bc_y + 55)], radius=10, fill=b_bg)
    draw.text((bc_x + brand_card_w // 2, bc_y + 28), b_name, fill=b_fg, font=font_small_bold, anchor="mm")


# ==========================================
# 6. BOTTOM ASSURANCE FOOTER (y: 3145 to 3370)
# ==========================================
footer_y = 3145
footer_h = 220
draw.rounded_rectangle([(60, footer_y), (W - 60, footer_y + footer_h)], radius=20, fill="#040817", outline="#22c55e", width=3)

pillars = [
    ("🛡️ 100% QUALITY ASSURED", "Food-grade certified genuine products"),
    ("❄️ -18°C COLD-CHAIN FLEET", "Zero temperature break guaranteed"),
    ("🚚 ON-TIME DEPOT DELIVERY", "Daily dispatch across Annamayya Dist."),
    ("📦 DIRECT WHOLESALE SUPPLY", "Bulk sourcing for QSR, Cafe & HORECA")
]

pillar_w = (W - 160) // 4
for p_idx, (p_title, p_sub) in enumerate(pillars):
    px = 80 + p_idx * pillar_w
    py = footer_y + 35
    draw.rounded_rectangle([(px + 6, py), (px + pillar_w - 6, py + 150)], radius=14, fill="#0a1738")
    draw.text((px + pillar_w//2, py + 45), p_title, fill="#38bdf8", font=font_body_bold, anchor="mm")
    draw.text((px + pillar_w//2, py + 95), p_sub, fill="#94a3b8", font=font_small, anchor="mm")

draw.text((W // 2, footer_y + footer_h - 15), f"RAIS AGENCIES RAYACHOTY  •  HOTLINE: {HOTLINE_DISPLAY}  •  SCAN QR CODES FOR FULL PRODUCT CATALOGUE & WHATSAPP ORDERS", fill="#f59e0b", font=font_small, anchor="mm")

# Save outputs
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "public", "images")
DIST_IMG_DIR = os.path.join(BASE_DIR, "dist", "images")
BACKEND_IMG_DIR = os.path.join(os.path.dirname(BASE_DIR), "rais-growth-engine", "backend", "static", "images")
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

brochure_jpg = os.path.join(PUBLIC_IMG_DIR, "brochure.jpg")
brochure_png = os.path.join(PUBLIC_IMG_DIR, "RAIS_Agencies_Wholesale_Brochure_2026.png")

canvas.save(brochure_jpg, "JPEG", quality=95, dpi=(300, 300))
canvas.save(brochure_png, "PNG", dpi=(300, 300))
print(f"Generated enhanced brochure with original photos: {brochure_jpg} ({canvas.size})")

import shutil
for target_dir in [DIST_IMG_DIR, BACKEND_IMG_DIR, ARTIFACT_DIR]:
    if os.path.exists(target_dir):
        shutil.copy2(brochure_jpg, os.path.join(target_dir, "brochure.jpg"))
        shutil.copy2(brochure_png, os.path.join(target_dir, "RAIS_Agencies_Wholesale_Brochure_2026.png"))
        print(f"Copied brochure -> {target_dir}")

print("Master Brochure with original photos complete!")
