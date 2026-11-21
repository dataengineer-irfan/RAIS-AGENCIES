import os
import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_DIR = os.path.join(BASE_DIR, "public", "images", "ref-assets")
PROD_DIR = os.path.join(BASE_DIR, "public", "images", "products")
PDF_PROD_DIR = os.path.join(BASE_DIR, "public", "images", "pdf_products")
WAPP_DIR = os.path.join(BASE_DIR, "public", "images", "wapp_latest")
PUB_IMG = os.path.join(BASE_DIR, "public", "images")

# URLs & Info
CATALOGUE_URL = "https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html"
WHATSAPP_URL = "https://wa.me/919347453135?text=Hi%20RAIS%20Agencies,%20I%20would%20like%20to%20order%20from%20your%20Wholesale%20Catalogue."
MAPS_URL = "https://maps.google.com/?q=RAIS+Agencies+Rayachoty"
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
    font_item_name = ImageFont.truetype("segoeuib.ttf", 22)
    font_small = ImageFont.truetype("segoeui.ttf", 20)
    font_small_bold = ImageFont.truetype("segoeuib.ttf", 20)
    font_badge = ImageFont.truetype("segoeuib.ttf", 22)
    font_price = ImageFont.truetype("arialbd.ttf", 25)
    font_cat_icon = ImageFont.truetype("segoeuib.ttf", 21)
except Exception:
    font_brand = font_sub_brand = font_h1 = font_h2 = font_table_hdr = font_body_bold = font_body = font_item_name = font_small = font_small_bold = font_badge = font_price = font_cat_icon = ImageFont.load_default()

def make_circular_thumbnail(img_path, size=52, border_color="#f59e0b", border_w=2):
    """Creates a high-definition anti-aliased circular thumbnail with an accent border."""
    try:
        im = Image.open(img_path).convert('RGBA')
        ss_size = size * 3
        # crop square from center
        w, h = im.size
        min_dim = min(w, h)
        im_crop = im.crop(((w - min_dim)//2, (h - min_dim)//2, (w + min_dim)//2, (h + min_dim)//2))
        im_res = im_crop.resize((ss_size, ss_size), Image.Resampling.LANCZOS)
        
        mask = Image.new('L', (ss_size, ss_size), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0, ss_size, ss_size), fill=255)
        
        circle_im = Image.new('RGBA', (ss_size, ss_size), (0, 0, 0, 0))
        circle_im.paste(im_res, (0, 0), mask)
        
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
# Deep navy gradient header
for y in range(0, 440):
    ratio = y / 440.0
    r = int(5 + (12 - 5) * ratio)
    g = int(10 + (22 - 10) * ratio)
    b = int(26 + (55 - 26) * ratio)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Gold separator
draw.rectangle([(0, 434), (W, 440)], fill="#f59e0b")

# Draw Diamond Crest Logo
logo_cx, logo_cy = 160, 220
crest_size = 130
# Diamond points
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
draw.polygon(inner_diamond, outline="#38bdf8", width=3)

# Inside Logo: Red "R" and "RAIS" ribbon
draw.text((logo_cx, logo_cy - 25), "R", fill="#dc2626", font=font_brand, anchor="mm")
draw.rectangle([(logo_cx - 85, logo_cy + 50), (logo_cx + 85, logo_cy + 95)], fill="#07112c")
draw.text((logo_cx, logo_cy + 72), "RAIS", fill="#ffffff", font=font_sub_brand, anchor="mm")

# Header Text
text_start_x = 340
draw.text((text_start_x, 80), "RAIS AGENCIES", fill="#ffffff", font=font_brand, anchor="lt")
draw.text((text_start_x + 850, 85), "EST. RAYACHOTY", fill="#f59e0b", font=font_badge, anchor="lt")

# Subheader with snowflakes
draw.text((text_start_x, 195), "❄️  FROZEN FOOD PRODUCTS & COMMERCIAL FOOD SERVICE  ❄️", fill="#f59e0b", font=font_sub_brand, anchor="lt")
draw.text((text_start_x, 255), "Wholesale Sourcing Partner for QSRs, Cafes, Bakeries, Cloud Kitchens & HORECA", fill="#94a3b8", font=font_body, anchor="lt")

# Contact line
draw.text((text_start_x, 310), f"📍 {DEPOT_ADDR}", fill="#cbd5e1", font=font_small, anchor="lt")
draw.text((text_start_x, 345), f"📞 Order & Dispatch Hotline: {HOTLINE_DISPLAY}  |  💬 WhatsApp Daily Trade Desk", fill="#22c55e", font=font_body_bold, anchor="lt")

# Right Top QR Boxes (WhatsApp Order & Live Catalogue)
qr_card_w, qr_card_h = 320, 370
# QR 1: WhatsApp Order
qr1_x = 1680
qr1_y = 35
draw.rounded_rectangle([(qr1_x, qr1_y), (qr1_x + qr_card_w, qr1_y + qr_card_h)], radius=18, fill="#081432", outline="#22c55e", width=3)
# Header banner inside QR 1
draw.rounded_rectangle([(qr1_x, qr1_y), (qr1_x + qr_card_w, qr1_y + 55)], radius=16, fill="#15803d")
draw.rectangle([(qr1_x, qr1_y + 40), (qr1_x + qr_card_w, qr1_y + 55)], fill="#15803d")
draw.text((qr1_x + qr_card_w//2, qr1_y + 27), "💬 WhatsApp Order", fill="#ffffff", font=font_badge, anchor="mm")

# QR 1 Image
qr1_img = generate_qr(WHATSAPP_URL, size=230)
qr1_img_x = qr1_x + (qr_card_w - 230)//2
qr1_img_y = qr1_y + 70
draw.rounded_rectangle([(qr1_img_x - 6, qr1_img_y - 6), (qr1_img_x + 236, qr1_img_y + 236)], radius=10, fill="#ffffff")
canvas.paste(qr1_img, (qr1_img_x, qr1_img_y))
draw.text((qr1_x + qr_card_w//2, qr1_y + 335), "SCAN TO ORDER", fill="#f59e0b", font=font_body_bold, anchor="mm")

# QR 2: Live Master Catalogue
qr2_x = 2030
qr2_y = 35
draw.rounded_rectangle([(qr2_x, qr2_y), (qr2_x + qr_card_w, qr2_y + qr_card_h)], radius=18, fill="#081432", outline="#38bdf8", width=3)
# Header banner inside QR 2
draw.rounded_rectangle([(qr2_x, qr2_y), (qr2_x + qr_card_w, qr2_y + 55)], radius=16, fill="#0369a1")
draw.rectangle([(qr2_x, qr2_y + 40), (qr2_x + qr_card_w, qr2_y + 55)], fill="#0369a1")
draw.text((qr2_x + qr_card_w//2, qr2_y + 27), "🌐 Master Catalogue", fill="#ffffff", font=font_badge, anchor="mm")

# QR 2 Image
qr2_img = generate_qr(CATALOGUE_URL, size=230)
qr2_img_x = qr2_x + (qr_card_w - 230)//2
qr2_img_y = qr2_y + 70
draw.rounded_rectangle([(qr2_img_x - 6, qr2_img_y - 6), (qr2_img_x + 236, qr2_img_y + 236)], radius=10, fill="#ffffff")
canvas.paste(qr2_img, (qr2_img_x, qr2_img_y))
draw.text((qr2_x + qr_card_w//2, qr2_y + 335), "SCAN FOR LIVE RATES", fill="#38bdf8", font=font_body_bold, anchor="mm")


# ==========================================
# 2. TOP CATEGORY VISUAL ICONS ROW (y: 455 to 640)
# ==========================================
cat_bar_y = 455
cat_bar_h = 175
draw.rounded_rectangle([(60, cat_bar_y), (W - 60, cat_bar_y + cat_bar_h)], radius=20, fill="#0a1434", outline="#1e3a8a", width=2)

top_category_icons = [
    ("FRENCH FRIES", os.path.join(REF_DIR, "hero_fries_cutout.png")),
    ("NUGGETS", os.path.join(PROD_DIR, "itc_chicken_nuggets.webp")),
    ("BURGER PATTIES", os.path.join(REF_DIR, "hero_burger_stack.png")),
    ("POPCORN", os.path.join(REF_DIR, "hero_popcorn_cutout.png")),
    ("FRIED CHICKEN", os.path.join(PDF_PROD_DIR, "prod_03.jpeg")),
    ("CHEESE & DAIRY", os.path.join(REF_DIR, "hero_cheese_cutout.png")),
    ("MAYO & SAUCES", os.path.join(PDF_PROD_DIR, "prod_48.jpeg")),
    ("PACKAGING", os.path.join(PDF_PROD_DIR, "prod_86.jpeg"))
]

cat_w = (W - 140) // 8
for i, (label, img_path) in enumerate(top_category_icons):
    cx = 70 + i * cat_w + cat_w // 2
    thumb_y = cat_bar_y + 16
    thumb = make_circular_thumbnail(img_path, size=100, border_color="#f59e0b", border_w=3)
    canvas.paste(thumb, (cx - 50, thumb_y), thumb)
    draw.text((cx, cat_bar_y + 145), label, fill="#ffffff", font=font_cat_icon, anchor="mm")


# ==========================================
# 3. TABLES RENDERING HELPER
# ==========================================
def draw_commercial_table(card_x, card_y, card_w, card_h, header_title, header_bg, header_icon, items):
    """
    Renders an authentic, high-definition commercial table with exact columns:
    S.NO. | IMG | PRODUCT DETAILS | QUANTITY | PRICE (₹)
    """
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
    
    # Column layout
    sno_w = 60
    img_w = 65
    qty_w = 200
    price_w = 130
    details_w = card_w - sno_w - img_w - qty_w - price_w - 30
    
    col_sno_x = card_x + 15
    col_img_x = col_sno_x + sno_w
    col_det_x = col_img_x + img_w
    col_qty_x = col_det_x + details_w
    col_pri_x = col_qty_x + qty_w
    
    draw.text((col_sno_x + sno_w//2, col_hdr_y + col_hdr_h//2), "S.NO.", fill="#94a3b8", font=font_table_hdr, anchor="mm")
    draw.text((col_det_x + 20, col_hdr_y + col_hdr_h//2), "PRODUCT DETAILS", fill="#94a3b8", font=font_table_hdr, anchor="lm")
    draw.text((col_qty_x + qty_w//2, col_hdr_y + col_hdr_h//2), "QUANTITY", fill="#94a3b8", font=font_table_hdr, anchor="mm")
    draw.text((col_pri_x + price_w//2, col_hdr_y + col_hdr_h//2), "PRICE (₹)", fill="#f59e0b", font=font_table_hdr, anchor="mm")
    
    # Rows
    row_y_start = col_hdr_y + col_hdr_h
    row_h = (card_h - header_h - col_hdr_h) / len(items)
    
    for idx, (sno, name, qty, price, img_p) in enumerate(items):
        ry = row_y_start + idx * row_h
        
        # Zebra striping
        if idx % 2 == 0:
            draw.rectangle([(card_x + 4, ry), (card_x + card_w - 4, ry + row_h)], fill="#0a1532")
        
        # Row bottom divider
        draw.line([(card_x + 10, ry + row_h), (card_x + card_w - 10, ry + row_h)], fill="#1e293b", width=1)
        
        # S.NO.
        draw.text((col_sno_x + sno_w//2, ry + row_h//2), str(sno), fill="#e2e8f0", font=font_body_bold, anchor="mm")
        
        # Circular Product Thumbnail Image
        thumb_size = 46
        thumb = make_circular_thumbnail(img_p, size=thumb_size, border_color="#f59e0b", border_w=2)
        canvas.paste(thumb, (col_img_x + (img_w - thumb_size)//2, int(ry + (row_h - thumb_size)//2)), thumb)
        
        # Product Name
        draw.text((col_det_x + 10, ry + row_h//2), name, fill="#ffffff", font=font_item_name, anchor="lm")
        
        # Quantity
        draw.text((col_qty_x + qty_w//2, ry + row_h//2), qty, fill="#cbd5e1", font=font_small, anchor="mm")
        
        # Price Badge
        draw.text((col_pri_x + price_w//2, ry + row_h//2), price, fill="#ef4444", font=font_price, anchor="mm")


# ==========================================
# 4. TABLES DEFINITIONS & RENDERING (y: 650 to 2640)
# ==========================================
col_w = 1115
left_x = 70
right_x = W - 70 - col_w

# --- TABLE 1: CHICKEN ITEMS (Left Top) ---
chicken_items = [
    (1, "SIGNATURE TORTILLAH 8 INCHES FROZEN", "1 PACKET", "85/-", os.path.join(PDF_PROD_DIR, "prod_33.jpeg")),
    (2, "SIGNATURE TORTILLAH 8.5 INCHES", "1 PACKET", "90/-", os.path.join(PDF_PROD_DIR, "prod_33.jpeg")),
    (3, "NUTRICH CHICKEN POPCORN BALL", "1 KG PACKET", "330/-", os.path.join(PDF_PROD_DIR, "prod_05.jpeg")),
    (4, "I.T.C CHICKEN MOMOS", "1 PACKET", "170/-", os.path.join(PDF_PROD_DIR, "prod_01.jpeg")),
    (5, "ITC CHICKEN NUGGETS", "1 KG PACKET", "355/-", os.path.join(PDF_PROD_DIR, "prod_02.jpeg")),
    (6, "NUTRICH CHICKEN BURGER PATTY", "1 KG PACKET", "325/-", os.path.join(PDF_PROD_DIR, "prod_04.jpeg"))
]
t1_y = 650
t1_h = 475
draw_commercial_table(left_x, t1_y, col_w, t1_h, "CHICKEN ITEMS", "#831843", "🍗", chicken_items)

# --- TABLE 2: KETCHUP & SAUCES (Right Top) ---
ketchup_items = [
    (1, "DELMONT TOMATO KETCHUP 1.1kg", "1 PACKET", "120/-", os.path.join(PDF_PROD_DIR, "prod_48.jpeg")),
    (2, "FOODRITE TOMATO KETCHUP", "1 KG PACKET", "75/-", os.path.join(PDF_PROD_DIR, "prod_57.jpeg")),
    (3, "DELMONTE KETCHUP (8 GRAM PKT)", "1 PACKET", "80/-", os.path.join(PDF_PROD_DIR, "prod_50.jpeg")),
    (4, "DELMONT TANDOORI MAYO", "1 KG PACKET", "285/-", os.path.join(PDF_PROD_DIR, "prod_47.jpeg")),
    (5, "DELMONTE CREAMY CHEESE SAUCE", "1 KG PACKET", "190/-", os.path.join(PDF_PROD_DIR, "prod_49.jpeg")),
    (6, "DELMONTE PIZZA PASTA SAUCE", "1 KG PACKET", "155/-", os.path.join(PDF_PROD_DIR, "prod_51.jpeg")),
    (7, "MAYANK GOLD KETCHUP (9 GRAM PKT)", "1 PACKET", "70/-", os.path.join(PDF_PROD_DIR, "prod_60.jpeg")),
    (8, "FOODRITE SALAD MAYONNAISE", "1 KG PACKET", "135/-", os.path.join(PDF_PROD_DIR, "prod_56.jpeg")),
    (9, "FOODRITE MAYONNAISE (8 GRAM PKT)", "1 PACKET", "190/-", os.path.join(PDF_PROD_DIR, "prod_55.jpeg"))
]
t2_y = 650
t2_h = 670
draw_commercial_table(right_x, t2_y, col_w, t2_h, "KETCHUP & SAUCES", "#c2410c", "🥫", ketchup_items)

# --- TABLE 3: VEG ITEMS (Left Middle) ---
veg_items = [
    (1, "HUP HUP FRENCH FRIES 9MM", "2.5 KG PACKET", "310/-", os.path.join(PDF_PROD_DIR, "prod_07.jpeg")),
    (2, "HUP HUP FRENCH FRIES 6MM", "2.5 KG PACKET", "320/-", os.path.join(PDF_PROD_DIR, "prod_12.jpeg")),
    (3, "I.T.C VEG MOMOS", "1 PACKET", "165/-", os.path.join(PDF_PROD_DIR, "prod_13.jpeg")),
    (4, "CHILLI FILL VEG BURGER PATTY", "1.2 KG PACKET", "245/-", os.path.join(PDF_PROD_DIR, "prod_15.jpeg")),
    (5, "ITC PANEER PATTY", "1.02KG PACKET", "530/-", os.path.join(PDF_PROD_DIR, "prod_16.jpeg")),
    (6, "GODREJ PANEER POPS", "1 KG PACKET", "510/-", os.path.join(PDF_PROD_DIR, "prod_10.jpeg")),
    (7, "ITC CHEESY CORN TRIANGLE", "1 KG PACKET", "350/-", os.path.join(PDF_PROD_DIR, "prod_14.jpeg")),
    (8, "SWEET CORN (KERNELS)", "1 KG PACKET", "90/-", os.path.join(PDF_PROD_DIR, "prod_28.jpeg")),
    (9, "GODREJ TANDOORI PANEER NUGGETS", "1 KG PACKET", "360/-", os.path.join(PDF_PROD_DIR, "prod_11.jpeg"))
]
t3_y = t1_y + t1_h + 20
t3_h = 670
draw_commercial_table(left_x, t3_y, col_w, t3_h, "VEG ITEMS", "#15803d", "🥬", veg_items)

# --- TABLE 4: BREAD MIX & POWDERS (Right Middle 1) ---
bread_items = [
    (1, "VKL EXTRA H & S MARINDE", "1 KG PACKET", "370/-", os.path.join(PDF_PROD_DIR, "prod_41.jpeg")),
    (2, "VKL CRISPY CAJUN BREADING MIX", "1 KG PACKET", "300/-", os.path.join(PDF_PROD_DIR, "prod_40.jpeg")),
    (3, "VKL PERI PERI POWDER", "250 GRAMS PACKET", "165/-", os.path.join(PDF_PROD_DIR, "prod_42.jpeg")),
    (4, "OREGANO & HERB SEASONING", "1 KG PACKET", "230/-", os.path.join(PDF_PROD_DIR, "prod_38.jpeg"))
]
t4_y = t2_y + t2_h + 20
t4_h = 350
draw_commercial_table(right_x, t4_y, col_w, t4_h, "BREAD MIX & POWDERS", "#312e81", "🥣", bread_items)

# --- TABLE 5: CHEESE & SLICES (Right Middle 2) ---
cheese_items = [
    (1, "MILKY MIST MOZEROLLA DICED CHEESE", "2 KG PACKET", "920/-", os.path.join(PDF_PROD_DIR, "prod_25.jpeg")),
    (2, "MILKY MIST MOZEROLLA DICED CHEESE", "1 KG PACKET", "475/-", os.path.join(PDF_PROD_DIR, "prod_24.jpeg")),
    (3, "MILKY MIST CHEESE SLICE", "765 GRAMS PACKET", "440/-", os.path.join(PDF_PROD_DIR, "prod_23.jpeg")),
    (4, "MILKY MIST PANEER (DICED CUBES)", "1 KG PACKET", "460/-", os.path.join(PDF_PROD_DIR, "prod_26.jpeg"))
]
t5_y = t4_y + t4_h + 20
t5_h = 350
draw_commercial_table(right_x, t5_y, col_w, t5_h, "CHEESE & SLICES", "#854d0e", "🧀", cheese_items)

# --- TABLE 6: PIZZA BOXES & BURGER BOXES (Left Bottom) ---
box_items = [
    (1, "PIZZA BOX 8\"x8\" PLAIN", "100 NOS", "600/-", os.path.join(PDF_PROD_DIR, "prod_87.jpeg")),
    (2, "BURGER BOX 4\"x4\"", "100 NOS", "400/-", os.path.join(PDF_PROD_DIR, "prod_79.jpeg")),
    (3, "PIZZA BOX 8\"x8\" PRINTED", "100 NOS", "650/-", os.path.join(PDF_PROD_DIR, "prod_86.jpeg")),
    (4, "BURGER BOX 4\"x4\" PRINTED", "100 NOS", "450/-", os.path.join(PDF_PROD_DIR, "prod_79.jpeg")),
    (5, "BURGER BOX 5\"x5\" PRINTED", "100 NOS", "500/-", os.path.join(PDF_PROD_DIR, "prod_80.jpeg"))
]
t6_y = t3_y + t3_h + 20
t6_h = 420
draw_commercial_table(left_x, t6_y, col_w, t6_h, "PIZZA BOXES & BURGER BOXES", "#1e293b", "📦", box_items)

# --- TABLE 7: SPICES (Right Bottom) ---
spices_items = [
    (1, "CHILLY POWDER NO 1 (PICKLE)", "1 KG PACKET", "300/-", os.path.join(PDF_PROD_DIR, "prod_35.jpeg")),
    (2, "CHILLY POWDER", "1 KG PACKET", "280/-", os.path.join(PDF_PROD_DIR, "prod_34.jpeg")),
    (3, "TURMERIC POWDER", "1 KG PACKET", "185/-", os.path.join(PDF_PROD_DIR, "prod_39.jpeg")),
    (4, "CORIANDER POWDER", "1 KG PACKET", "200/-", os.path.join(PDF_PROD_DIR, "prod_36.jpeg"))
]
t7_y = t5_y + t5_h + 20
t7_h = 350
draw_commercial_table(right_x, t7_y, col_w, t7_h, "SPICES (CHEF GRADE)", "#991b1b", "🌶️", spices_items)

# Draw "NEW" ribbon on spices card
draw.rounded_rectangle([(right_x + col_w - 110, t7_y + 12), (right_x + col_w - 20, t7_y + 44)], radius=8, fill="#ef4444")
draw.text((right_x + col_w - 65, t7_y + 28), "★ NEW", fill="#ffffff", font=font_small_bold, anchor="mm")

# --- TABLE 8: MOJITOS (Spanning Table at Bottom) ---
mojitos_items = [
    (1, "LIME AND MINT MOJITO SYRUP", "1 BOTTLE (1L)", "360/-", os.path.join(PDF_PROD_DIR, "prod_72.jpeg")),
    (2, "BLUECURCO MOJITO SYRUP", "1 BOTTLE (1L)", "350/-", os.path.join(PDF_PROD_DIR, "prod_67.jpeg"))
]
t8_y = max(t6_y + t6_h, t7_y + t7_h) + 20
t8_w = W - 140
t8_h = 240
draw_commercial_table(left_x, t8_y, t8_w, t8_h, "MOJITOS & REFRESHERS (MANAMA)", "#0f766e", "🍹", mojitos_items)


# ==========================================
# 5. BRAND PARTNERS BAR (y: 2980 to 3130)
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
# 6. BOTTOM ASSURANCE FOOTER (y: 3140 to 3370)
# ==========================================
footer_y = 3145
footer_h = 220
draw.rounded_rectangle([(60, footer_y), (W - 60, footer_y + footer_h)], radius=20, fill="#040817", outline="#22c55e", width=3)

# 4 Pillars of Assurance (Icons & Badges)
pillars = [
    ("🛡️ 100% QUALITY ASSURED", "Food-grade certified genuine products"),
    ("❄️ -18°C COLD-CHAIN FLEET", "Zero temperature break guaranteed"),
    ("🚚 ON-TIME DEPOT DELIVERY", "Daily dispatch across Annamayya Dist."),
    ("💰 BEST WHOLESALE RATES", "Direct distributor B2B pricing")
]

pillar_w = (W - 160) // 4
for p_idx, (p_title, p_sub) in enumerate(pillars):
    px = 80 + p_idx * pillar_w
    py = footer_y + 35
    # Inner box
    draw.rounded_rectangle([(px + 6, py), (px + pillar_w - 6, py + 150)], radius=14, fill="#0a1738")
    draw.text((px + pillar_w//2, py + 45), p_title, fill="#38bdf8", font=font_body_bold, anchor="mm")
    draw.text((px + pillar_w//2, py + 95), p_sub, fill="#94a3b8", font=font_small, anchor="mm")

# Bottom hotline & copyright line
draw.text((W // 2, footer_y + footer_h - 15), f"RAIS AGENCIES RAYACHOTY  •  HOTLINE: {HOTLINE_DISPLAY}  •  SCAN QR CODES FOR LIVE RATES & WHATSAPP ORDERS", fill="#f59e0b", font=font_small, anchor="mm")


# ==========================================
# 7. SAVE OUTPUTS
# ==========================================
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "public", "images")
DIST_IMG_DIR = os.path.join(BASE_DIR, "dist", "images")
BACKEND_IMG_DIR = os.path.join(os.path.dirname(BASE_DIR), "rais-growth-engine", "backend", "static", "images")
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

brochure_jpg = os.path.join(PUBLIC_IMG_DIR, "brochure.jpg")
brochure_png = os.path.join(PUBLIC_IMG_DIR, "RAIS_Agencies_Wholesale_Brochure_2026.png")

canvas.save(brochure_jpg, "JPEG", quality=95, dpi=(300, 300))
canvas.save(brochure_png, "PNG", dpi=(300, 300))
print(f"Generated enhanced brochure: {brochure_jpg} ({canvas.size})")

import shutil
for target_dir in [DIST_IMG_DIR, BACKEND_IMG_DIR, ARTIFACT_DIR]:
    if os.path.exists(target_dir):
        shutil.copy2(brochure_jpg, os.path.join(target_dir, "brochure.jpg"))
        shutil.copy2(brochure_png, os.path.join(target_dir, "RAIS_Agencies_Wholesale_Brochure_2026.png"))
        print(f"Copied brochure -> {target_dir}")

print("Master Brochure generation completed successfully!")
