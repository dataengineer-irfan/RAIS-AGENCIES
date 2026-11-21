import os
import qrcode
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Target URLs and info
CATALOGUE_URL = "https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html"
HOTLINE = "+91 93474 53135"
DEPOT_ADDR = "Beside Indel Money Bank, Sundupalli Road, Near Reddies Colony, Rayachoti – 516269"

# Canvas dimensions (2400 x 3400 px, 300 DPI A4/A3 print proportion)
W, H = 2400, 3400
canvas = Image.new('RGB', (W, H), '#080f24')
draw = ImageDraw.Draw(canvas)

# Fonts
try:
    font_brand = ImageFont.truetype("arialbd.ttf", 100)
    font_h1 = ImageFont.truetype("arialbd.ttf", 64)
    font_h2 = ImageFont.truetype("arialbd.ttf", 46)
    font_h3 = ImageFont.truetype("arialbd.ttf", 36)
    font_body = ImageFont.truetype("arial.ttf", 30)
    font_body_bold = ImageFont.truetype("arialbd.ttf", 30)
    font_small = ImageFont.truetype("arial.ttf", 24)
    font_badge = ImageFont.truetype("arialbd.ttf", 26)
    font_item = ImageFont.truetype("arial.ttf", 26)
    font_item_bold = ImageFont.truetype("arialbd.ttf", 26)
except Exception:
    font_brand = font_h1 = font_h2 = font_h3 = font_body = font_body_bold = font_small = font_badge = font_item = font_item_bold = ImageFont.load_default()

# 1. Header Gradient & Decorative Mesh
for y in range(0, 380):
    ratio = y / 380.0
    r = int(8 + (15 - 8) * ratio)
    g = int(15 + (35 - 15) * ratio)
    b = int(36 + (85 - 36) * ratio)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Gold accent line under header
draw.rectangle([(0, 374), (W, 380)], fill="#f59e0b")

# Top contact bar
draw.rectangle([(0, 0), (W, 75)], fill="#040817")
draw.text((80, 38), "🦁 RAIS AGENCIES — MASTER FOOD SERVICE DISTRIBUTOR", fill="#f59e0b", font=font_badge, anchor="lm")
draw.text((W - 80, 38), f"📞 WHOLESALE HOTLINE: {HOTLINE}", fill="#22c55e", font=font_body_bold, anchor="rm")

# Header Title
draw.text((W // 2, 160), "RAIS AGENCIES", fill="#ffffff", font=font_brand, anchor="mm")
draw.text((W // 2, 235), "WHOLESALE FOOD SERVICE & COLD-CHAIN LOGISTICS HUB", fill="#38bdf8", font=font_h3, anchor="mm")
draw.text((W // 2, 290), "Rayachoty & Annamayya District, Andhra Pradesh", fill="#cbd5e1", font=font_body, anchor="mm")
draw.text((W // 2, 335), f"📍 Depot: {DEPOT_ADDR}", fill="#94a3b8", font=font_small, anchor="mm")

# 2. Hero Interactive QR & Sourcing Card (y: 410 to 860)
hero_y = 410
hero_h = 440
draw.rounded_rectangle([(70, hero_y), (W - 70, hero_y + hero_h)], radius=24, fill="#0c1738", outline="#1e3a8a", width=3)

# QR Code inside hero card
qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=2)
qr.add_data(CATALOGUE_URL)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="#0b1329", back_color="#ffffff").convert('RGB')
qr_size = 360
qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)

# White box for QR code
qr_x = 120
qr_box_y = hero_y + 40
draw.rounded_rectangle([(qr_x - 12, qr_box_y - 12), (qr_x + qr_size + 12, qr_box_y + qr_size + 12)], radius=16, fill="#ffffff")
canvas.paste(qr_resized, (qr_x, qr_box_y))

# Text beside QR
text_x = qr_x + qr_size + 50
draw.text((text_x, hero_y + 60), "SCAN TO VIEW LIVE 90-SKU PRODUCT CATALOGUE", fill="#fcd34d", font=font_h2, anchor="lt")
draw.text((text_x, hero_y + 125), "Instant Wholesale Pricing, Stock Availability & Cold-Chain Orders", fill="#ffffff", font=font_body_bold, anchor="lt")
draw.text((text_x, hero_y + 175), "Point your smartphone camera at the QR code to open our complete commercial catalogue.", fill="#94a3b8", font=font_body, anchor="lt")
draw.text((text_x, hero_y + 220), "Includes full specifications, packaging details, and 1-click WhatsApp quote requests.", fill="#94a3b8", font=font_body, anchor="lt")

# Trust badges inside hero card
badge_y = hero_y + 300
badges = [
    ("❄️ -18°C Deep Freeze Fleet", "#0284c7", "#e0f2fe"),
    ("⚡ Same-Day Depot Dispatch", "#d97706", "#fef3c7"),
    ("📦 Commercial Bulk Packs", "#15803d", "#dcfce7"),
    ("💬 WhatsApp Sourcing", "#059669", "#d1fae5")
]
cur_bx = text_x
for b_text, b_col, b_bg in badges:
    b_w = int(draw.textlength(b_text, font=font_small)) + 30
    draw.rounded_rectangle([(cur_bx, badge_y), (cur_bx + b_w, badge_y + 44)], radius=22, fill=b_col)
    draw.text((cur_bx + b_w // 2, badge_y + 22), b_text, fill="#ffffff", font=font_small, anchor="mm")
    cur_bx += b_w + 14

direct_url = "Live Catalogue URL: https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html"
draw.text((text_x, hero_y + 375), direct_url, fill="#38bdf8", font=font_small, anchor="lt")

# 3. 8 Commercial Category Grids (y: 880 to 2950)
categories = [
    {
        "title": "1. FROZEN NON-VEG SNACKS (CHICKEN)",
        "icon": "🍗",
        "header_bg": "#831843",
        "brands": "TRIKEN • ITC MASTER CHEF • NUTRICH • RAIS MASTER",
        "items": [
            ("CHICKEN MOMOS", "TRIKEN", "Commercial Poly Pack"),
            ("CRUNCHY CHICKEN NUGGETS", "ITC Master Chef", "1 KG Bulk Pack"),
            ("CHICKEN BURGER PATTY", "Nutrich", "1 KG Master Pack"),
            ("CHICKEN POPCORN BALLS", "Nutrich", "1 KG Commercial Pack"),
            ("CHICKEN BREAST FINGERS", "RAIS Master", "1.1 KG Pack"),
            ("CHICKEN SPRING ROLLS", "RAIS Master", "500g Pack")
        ]
    },
    {
        "title": "2. FROZEN VEG SNACKS & FRIES",
        "icon": "🍟",
        "header_bg": "#14532d",
        "brands": "AMUL • MCCAIN • GODREJ • ITC MASTER CHEF • CHILL FILL",
        "items": [
            ("AMUL FRENCH FRIES (9MM & 6MM)", "AMUL / Hup Hup", "2.5 KG Bulk Pack"),
            ("ALOO TIKKI / VEG BURGER PATTY", "Chill Fill / McCain", "1.5 KG Pack"),
            ("GODREJ PANEER POPS", "Godrej", "1 KG Pack"),
            ("GODREJ TANDOORI PANEER NUGGETS", "Godrej", "1 KG Pack"),
            ("ITC CHEESY CORN TRIANGLES", "ITC Master Chef", "1 KG Pack"),
            ("MCCAIN SMILES & MASALA FRIES", "McCain", "1.5 KG Commercial Pack")
        ]
    },
    {
        "title": "3. DAIRY ESSENTIALS & SWEET CORN",
        "icon": "🧀",
        "header_bg": "#713f12",
        "brands": "MILKY MIST • AMUL • FRESH AGRO • NUTRILITE",
        "items": [
            ("MILKY MIST MOZZARELLA DICED", "Milky Mist", "1 KG & 2 KG Packs"),
            ("MILKY MIST CHEESE SLICES", "Milky Mist", "765g (Burger/Sandwich)"),
            ("MILKY MIST FRESH PANEER CUBES", "Milky Mist", "1 KG Pack"),
            ("AMUL FRESH CREAM (1 LITRE)", "Amul", "1 Ltr Tetra Pack"),
            ("NUTRILITE TABLE BUTTER", "Nutrilite", "500g Commercial Pack"),
            ("AMERICAN SWEET CORN (SWEET KERNELS)", "Fresh Agro", "1 KG Frozen Pack")
        ]
    },
    {
        "title": "4. BAKERY, BUNS & PIZZA BASES",
        "icon": "🍔",
        "header_bg": "#7c2d12",
        "brands": "BAKE FRESH • SIGNATURE • COMMERCIAL HORECA",
        "items": [
            ("COMMERCIAL BURGER BUNS", "Bake Fresh", "Fresh Bakery Crates"),
            ("PIZZA BASE 8 INCH & 9 INCH", "Bake Fresh", "Packet of 5 / Daily Fresh"),
            ("SIGNATURE TORTILLA WRAP 8.5 INCH", "Signature", "Commercial Packet"),
            ("SIGNATURE TORTILLA WRAP 10 INCH", "Signature", "Commercial Packet"),
            ("GARLIC BREAD & TOAST BASES", "Bake Fresh", "HORECA Grade"),
            ("WHITE BREAD CRUMBS", "Commercial Grade", "1 KG Pack")
        ]
    },
    {
        "title": "5. GOURMET SAUCES, MAYO & CONDIMENTS",
        "icon": "🥫",
        "header_bg": "#701a75",
        "brands": "DEL MONTE • FOODRITE • MAYANK GOLD • SPIC'S",
        "items": [
            ("DEL MONTE TOMATO KETCHUP 1.1KG", "Del Monte", "1.1 KG Bottle / Sachet"),
            ("DEL MONTE KETCHUP 8G DISPENSER", "Del Monte", "Commercial Dispenser Box"),
            ("FOODRITE SALAD MAYONNAISE 1KG", "Foodrite", "1 KG Poly Pack"),
            ("FOODRITE MAYONNAISE 8G SACHETS", "Foodrite", "Packet of 100+ Sachets"),
            ("DEL MONTE TANDOORI MAYO & CHEESE BLEND", "Del Monte", "1 KG Chef Pack"),
            ("DEL MONTE PIZZA PASTA SAUCE & BBQ", "Del Monte", "1 KG Chef Pouch")
        ]
    },
    {
        "title": "6. MOJITO SYRUPS & FRUIT CRUSHES",
        "icon": "🍹",
        "header_bg": "#0c4a6e",
        "brands": "MANAMA • FOODRITE BEVERAGES",
        "items": [
            ("MANAMA BLUE CURACAO MOJITO SYRUP", "MANAMA", "1 Litre Glass Bottle"),
            ("MANAMA LIME AND MINT MOJITO SYRUP", "MANAMA", "1 Litre Glass Bottle"),
            ("MANAMA GREEN APPLE & CHILLI GUAVA", "MANAMA", "1 Litre Bottle"),
            ("MANAMA SPICY MANGO & ORANGE SYRUP", "MANAMA", "1 Litre Bottle"),
            ("FOODRITE STRAWBERRY & BLUEBERRY CRUSH", "Foodrite", "1 KG Commercial Bottle"),
            ("MR FOODRITE THICK CHOCOLATE TOPPING", "Foodrite", "1 KG Squeeze Bottle")
        ]
    },
    {
        "title": "7. SPICES, SEASONINGS & BREADING",
        "icon": "🌶️",
        "header_bg": "#7f1d1d",
        "brands": "VKL SEASONINGS • PURE SPICES • BHARAT",
        "items": [
            ("VKL CRISPY CAJUN BREADING MIX", "VKL", "1 KG Pack (Broast/Fried Chk)"),
            ("VKL EXTRA H & S MARINADE", "VKL", "1 KG Commercial Pack"),
            ("VKL PERI PERI SPRINKLER POWDER", "Pure Spices / VKL", "250g Sprinkler Pack"),
            ("OREGANO & HERB SEASONING", "VKL / Big Bell", "500g Commercial Pack"),
            ("CHILLI FLAKES FOR PIZZAS", "BHARAT", "1 KG Bulk Pack"),
            ("PURE CHILLY, TURMERIC & CORIANDER", "Pure Spices", "1 KG Commercial Packs")
        ]
    },
    {
        "title": "8. FOOD PACKAGING & DISPOSABLES",
        "icon": "📦",
        "header_bg": "#1e293b",
        "brands": "PACKAGING SOLUTIONS • FOOD-GRADE KRAFT",
        "items": [
            ("PIZZA BOX 8\"x8\" PRINTED / LAMINATED", "Packaging Sol.", "100 Nos Pack"),
            ("PLAIN PIZZA BOX 9\"x9\" & 10\"x10\"", "Packaging Sol.", "100 Nos Pack"),
            ("BURGER BOX 4\"x4\" & 5\"x5\" PRINTED", "Packaging Sol.", "100 Nos Pack"),
            ("CHICKEN BUCKET / KFC STYLE BUCKETS", "Packaging Sol.", "Sleeve of 34 Pieces"),
            ("PORTION MAYO CUPS 35MM WITH LIDS", "Packaging Sol.", "1 Packet / Case"),
            ("FOOD-GRADE BUTTER PAPER & TISSUES", "Packaging Sol.", "1 KG Roll / Pack")
        ]
    }
]

# Grid parameters (2 columns x 4 rows)
grid_y_start = 885
col_w = (W - 140 - 30) // 2
row_h = 490

for idx, cat in enumerate(categories):
    col = idx % 2
    row = idx // 2
    
    card_x = 70 + col * (col_w + 30)
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
    header_h = 60
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + col_w, card_y + header_h)],
        radius=16,
        fill=cat["header_bg"]
    )
    # Square bottom edges of header
    draw.rectangle([(card_x, card_y + header_h - 10), (card_x + col_w, card_y + header_h)], fill=cat["header_bg"])

    # Header text
    draw.text((card_x + 20, card_y + header_h // 2), f"{cat['icon']} {cat['title']}", fill="#ffffff", font=font_h3, anchor="lm")

    # Brands sub-bar
    draw.rectangle([(card_x, card_y + header_h), (card_x + col_w, card_y + header_h + 36)], fill="#0f1c3f")
    draw.text((card_x + 20, card_y + header_h + 18), f"PARTNERS: {cat['brands']}", fill="#38bdf8", font=font_small, anchor="lm")

    # Items listing
    item_start_y = card_y + header_h + 46
    for item_idx, (p_name, p_brand, p_pack) in enumerate(cat["items"]):
        line_y = item_start_y + item_idx * 58
        
        # Zebra subtle background
        if item_idx % 2 == 0:
            draw.rectangle([(card_x + 8, line_y - 4), (card_x + col_w - 8, line_y + 48)], fill="#0d1938")
        
        # Bullet
        draw.text((card_x + 20, line_y + 20), "•", fill="#f59e0b", font=font_body_bold, anchor="lm")
        # Product Name
        draw.text((card_x + 42, line_y + 12), p_name, fill="#ffffff", font=font_item_bold, anchor="lt")
        # Pack info
        draw.text((card_x + 42, line_y + 36), f"{p_brand}  |  {p_pack}", fill="#94a3b8", font=font_small, anchor="lt")
        
        # "Cold-Chain / In Stock" badge on the right
        draw.text((card_x + col_w - 20, line_y + 24), "✓ Ready Stock", fill="#22c55e", font=font_small, anchor="rm")

# 4. Premium Brand Partners Ribbon (y: 2950 to 3080)
partner_y = 2960
draw.rounded_rectangle([(70, partner_y), (W - 70, partner_y + 115)], radius=18, fill="#0c1738", outline="#334155", width=2)
draw.text((W // 2, partner_y + 32), "OFFICIAL COMMERCIAL FOOD SERVICE & HORECA PARTNERS", fill="#f59e0b", font=font_badge, anchor="mm")
partner_names = "AMUL  •  MILKY MIST  •  DEL MONTE  •  ITC MASTER CHEF  •  TRIKEN  •  GODREJ  •  FOODRITE  •  MANAMA  •  VKL  •  BAKE FRESH"
draw.text((W // 2, partner_y + 75), partner_names, fill="#ffffff", font=font_h3, anchor="mm")

# 5. Bottom Action & Depot Footer (y: 3100 to 3370)
footer_y = 3100
footer_h = 240
draw.rounded_rectangle([(70, footer_y), (W - 70, footer_y + footer_h)], radius=22, fill="#040817", outline="#f59e0b", width=3)

# Hotline CTA Box inside footer
draw.text((120, footer_y + 50), "CALL OR WHATSAPP FOR DAILY WHOLESALE RATES & FLEET DELIVERY:", fill="#cbd5e1", font=font_body, anchor="lt")
draw.text((120, footer_y + 110), f"💬 WhatsApp / Call: {HOTLINE}", fill="#22c55e", font=font_h1, anchor="lt")
draw.text((120, footer_y + 175), f"Depot: {DEPOT_ADDR}", fill="#94a3b8", font=font_body, anchor="lt")

# Right side order button badge
btn_w, btn_h = 480, 110
btn_x = W - 120 - btn_w
btn_y = footer_y + 65
draw.rounded_rectangle([(btn_x, btn_y), (btn_x + btn_w, btn_y + btn_h)], radius=20, fill="#22c55e")
draw.text((btn_x + btn_w // 2, btn_y + 40), "ORDER ON WHATSAPP", fill="#040817", font=font_h3, anchor="mm")
draw.text((btn_x + btn_w // 2, btn_y + 80), HOTLINE, fill="#040817", font=font_body_bold, anchor="mm")

# Output paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "public", "images")
DIST_IMG_DIR = os.path.join(BASE_DIR, "dist", "images")
BACKEND_IMG_DIR = os.path.join(os.path.dirname(BASE_DIR), "rais-growth-engine", "backend", "static", "images")
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

# Save as brochure.jpg (replacing old brochure!) and new 2026 brochure PNG
brochure_jpg = os.path.join(PUBLIC_IMG_DIR, "brochure.jpg")
brochure_png = os.path.join(PUBLIC_IMG_DIR, "RAIS_Agencies_Wholesale_Brochure_2026.png")

canvas.save(brochure_jpg, "JPEG", quality=95, dpi=(300, 300))
canvas.save(brochure_png, "PNG", dpi=(300, 300))
print(f"Generated new brochure: {brochure_jpg} ({canvas.size})")

# Copy to dist, backend, and artifact dir
import shutil
for target_dir in [DIST_IMG_DIR, BACKEND_IMG_DIR, ARTIFACT_DIR]:
    if os.path.exists(target_dir):
        shutil.copy2(brochure_jpg, os.path.join(target_dir, "brochure.jpg"))
        shutil.copy2(brochure_png, os.path.join(target_dir, "RAIS_Agencies_Wholesale_Brochure_2026.png"))
        print(f"Copied brochure -> {target_dir}")

print("Brochure creation complete!")
