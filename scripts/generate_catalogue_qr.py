import os
import qrcode
import qrcode.image.svg
from PIL import Image, ImageDraw, ImageFont

# Target URL - PRODUCTION ZERO LOCALHOST
CATALOGUE_URL = "https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html"

# Output directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "public", "images")
DIST_IMG_DIR = os.path.join(BASE_DIR, "dist", "images")
BACKEND_IMG_DIR = os.path.join(os.path.dirname(BASE_DIR), "rais-growth-engine", "backend", "static", "images")
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

for d in [PUBLIC_IMG_DIR, DIST_IMG_DIR, BACKEND_IMG_DIR, ARTIFACT_DIR]:
    os.makedirs(d, exist_ok=True)

print(f"Target URL: {CATALOGUE_URL}")

# 1. Generate High-Res PNG QR Code (2048x2048)
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H, # 30% error tolerance
    box_size=40,
    border=4,
)
qr.add_data(CATALOGUE_URL)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="#0f172a", back_color="#ffffff").convert('RGB')
qr_png_path = os.path.join(PUBLIC_IMG_DIR, "catalogue_qr_code.png")
qr_img.save(qr_png_path, "PNG", dpi=(300, 300))
print(f"Generated High-Res QR PNG: {qr_png_path} ({qr_img.size})")

# 2. Generate SVG QR Code
svg_factory = qrcode.image.svg.SvgPathImage
qr_svg = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=2,
    image_factory=svg_factory
)
qr_svg.add_data(CATALOGUE_URL)
qr_svg.make(fit=True)
svg_img = qr_svg.make_image()
qr_svg_path = os.path.join(PUBLIC_IMG_DIR, "catalogue_qr_code.svg")
svg_img.save(qr_svg_path)
print(f"Generated Vector QR SVG: {qr_svg_path}")

# 3. Generate Commercial Print-Ready Standee / Counter Flyer (1200 x 1600 px)
card_w, card_h = 1200, 1600
card = Image.new('RGB', (card_w, card_h), '#0b1329') # Deep Navy
draw = ImageDraw.Draw(card)

# Load fonts (fallback to default if ttf not found)
try:
    font_title_bold = ImageFont.truetype("arialbd.ttf", 64)
    font_h1 = ImageFont.truetype("arialbd.ttf", 52)
    font_h2 = ImageFont.truetype("arialbd.ttf", 36)
    font_body = ImageFont.truetype("arial.ttf", 28)
    font_badge = ImageFont.truetype("arialbd.ttf", 26)
    font_small = ImageFont.truetype("arial.ttf", 24)
except Exception:
    font_title_bold = font_h1 = font_h2 = font_body = font_badge = font_small = ImageFont.load_default()

# Header Gradient Bar
for y in range(0, 180):
    ratio = y / 180.0
    # Gradient from #091124 to #1e3a8a
    r = int(9 + (30 - 9) * ratio)
    g = int(17 + (58 - 17) * ratio)
    b = int(36 + (138 - 36) * ratio)
    draw.line([(0, y), (card_w, y)], fill=(r, g, b))

# Accent gold line
draw.rectangle([(0, 180), (card_w, 186)], fill="#f59e0b")

# Header Text
draw.text((card_w // 2, 70), "RAIS AGENCIES", fill="#ffffff", font=font_title_bold, anchor="mm")
draw.text((card_w // 2, 135), "WHOLESALE FOOD SERVICE DISTRIBUTION HUB", fill="#38bdf8", font=font_badge, anchor="mm")

# Subtitle Card
draw.text((card_w // 2, 240), "SCAN FOR COMPLETE 90-SKU PRODUCT CATALOGUE", fill="#fcd34d", font=font_h2, anchor="mm")
draw.text((card_w // 2, 285), "Instant Wholesale Pricing, Stock Availability & Cold-Chain Orders", fill="#94a3b8", font=font_small, anchor="mm")

# Category Pills Background
pills_text = "FROZEN SNACKS  *  DAIRY  *  GOURMET SAUCES  *  BAKERY BASES  *  SYRUPS  *  PACKAGING"
draw.text((card_w // 2, 335), pills_text, fill="#38bdf8", font=font_small, anchor="mm")

# White QR Container Box with rounded shadow effect
box_pad = 70
box_top = 380
box_size = 720
box_left = (card_w - box_size) // 2

# Draw subtle glow/shadow
for i in range(12, 0, -2):
    draw.rounded_rectangle(
        [(box_left - i, box_top - i), (box_left + box_size + i, box_top + box_size + i)],
        radius=24,
        fill="#1e293b"
    )

# Clean White QR Card
draw.rounded_rectangle(
    [(box_left, box_top), (box_left + box_size, box_top + box_size)],
    radius=20,
    fill="#ffffff"
)

# Resize QR Code to fit inside white box
inner_qr_size = box_size - 60
qr_resized = qr_img.resize((inner_qr_size, inner_qr_size), Image.Resampling.LANCZOS)
card.paste(qr_resized, (box_left + 30, box_top + 30))

# "Scan with Camera" badge below QR box
badge_y = box_top + box_size + 45
draw.rounded_rectangle([(card_w//2 - 260, badge_y - 24), (card_w//2 + 260, badge_y + 24)], radius=24, fill="#0284c7")
draw.text((card_w // 2, badge_y), "POINT PHONE CAMERA TO SCAN", fill="#ffffff", font=font_badge, anchor="mm")

# Key Distributor Brands Ribbon
brand_y = badge_y + 80
draw.text((card_w // 2, brand_y), "OFFICIAL COMMERCIAL FOOD SERVICE PARTNERS", fill="#64748b", font=font_small, anchor="mm")
brands_line = "AMUL  *  MILKY MIST  *  DEL MONTE  *  ITC MASTER CHEF  *  TRIKEN  *  GODREJ"
draw.text((card_w // 2, brand_y + 40), brands_line, fill="#e2e8f0", font=font_h2, anchor="mm")

# Depot & Ordering Information Card
footer_top = brand_y + 100
draw.rounded_rectangle([(80, footer_top), (card_w - 80, card_h - 70)], radius=16, fill="#0f172a", outline="#334155", width=2)

draw.text((card_w // 2, footer_top + 45), "DEPOT & WAREHOUSE PICKUP / REGIONAL DELIVERY", fill="#f59e0b", font=font_badge, anchor="mm")
draw.text((card_w // 2, footer_top + 85), "Beside Indel Money Bank, Sundupalli Road, Near Reddies Colony, Rayachoti - 516269", fill="#ffffff", font=font_body, anchor="mm")

hotline_text = "Direct Wholesale Hotline: +91 93474 53135 (Call / WhatsApp)"
draw.text((card_w // 2, footer_top + 130), hotline_text, fill="#22c55e", font=font_h2, anchor="mm")

standee_path = os.path.join(PUBLIC_IMG_DIR, "catalogue_qr_standee_card.png")
card.save(standee_path, "PNG", dpi=(300, 300))
print(f"Generated Print-Ready Standee Card: {standee_path} ({card.size})")

# Copy generated files to dist, backend, and artifact dir
import shutil
for f in ["catalogue_qr_code.png", "catalogue_qr_code.svg", "catalogue_qr_standee_card.png"]:
    src = os.path.join(PUBLIC_IMG_DIR, f)
    for target_dir in [DIST_IMG_DIR, BACKEND_IMG_DIR, ARTIFACT_DIR]:
        dst = os.path.join(target_dir, f)
        shutil.copy2(src, dst)
        print(f"Copied {f} -> {dst}")

print("QR Code generation complete!")
