import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 2048, 1152
img = Image.new('RGBA', (W, H), (6, 12, 26, 255))
draw = ImageDraw.Draw(img)

# 1. Base vertical gradient
for y in range(H):
    dist_from_center = abs(y - H / 2) / (H / 2)
    factor = 1.0 - dist_from_center
    r = int(6 + 12 * factor)
    g = int(12 + 22 * factor)
    b = int(26 + 48 * factor)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# 2. Add subtle horizontal glow & atmospheric radial lights
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)

# Center-left cyan/teal cold-chain glow
for rad in range(600, 0, -25):
    alpha = int(28 * (1.0 - rad / 600))
    glow_draw.ellipse([900 - rad, 576 - rad // 2, 900 + rad, 576 + rad // 2], fill=(6, 182, 212, alpha))

# Warm golden glow around food cutouts
for rad in range(450, 0, -20):
    alpha = int(25 * (1.0 - rad / 450))
    glow_draw.ellipse([1550 - rad, 576 - rad // 2, 1550 + rad, 576 + rad // 2], fill=(245, 158, 11, alpha))

# Logo backdrop glow
for rad in range(300, 0, -15):
    alpha = int(35 * (1.0 - rad / 300))
    glow_draw.ellipse([540 - rad, 576 - rad, 540 + rad, 576 + rad], fill=(217, 119, 6, alpha))

img = Image.alpha_composite(img, glow)
draw = ImageDraw.Draw(img)

# 3. Add background decorative guidelines / TV backdrop details
# Top bar outside safe zone (Visible on TV & large monitors)
top_font = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 24)
sub_top_font = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 20)

draw.line([(200, 180), (W - 200, 180)], fill=(30, 58, 110, 120), width=1)
draw.text((W // 2, 220), "RAYACHOTY'S PREMIER B2B COMMERCIAL FOOD SERVICE DEPOT", fill=(100, 140, 200, 160), font=top_font, anchor="mm")
draw.text((W // 2, 260), "HOTELS  •  RESTAURANTS  •  CAFES (QSR)  •  FAST FOOD  •  CATERING", fill=(6, 182, 212, 180), font=sub_top_font, anchor="mm")
draw.line([(200, 300), (W - 200, 300)], fill=(30, 58, 110, 120), width=1)

# Bottom bar outside safe zone (Visible on TV & large monitors)
draw.line([(200, 850), (W - 200, 850)], fill=(30, 58, 110, 120), width=1)
draw.text((W // 2, 890), "GUARANTEED -18°C COLD CHAIN  •  DIRECT WHOLESALE MARGINS  •  ON-TIME RAYACHOTY LOCAL DISPATCH", fill=(148, 163, 184, 180), font=sub_top_font, anchor="mm")
draw.text((W // 2, 930), "Official Store: raisfoods.in  |  Instagram: @raisfrozenfoods", fill=(245, 158, 11, 200), font=top_font, anchor="mm")
draw.line([(200, 970), (W - 200, 970)], fill=(30, 58, 110, 120), width=1)

# 4. Safe Area Framing & Subtle Accent Lines (Safe Area: X 406..1641, Y 407..745)
# Draw subtle safe area border accents for sleek high-tech food aesthetics
accent_layer = Imagenew = Image.new('RGBA', (W, H), (0, 0, 0, 0))
acc_draw = ImageDraw.Draw(accent_layer)
acc_draw.rounded_rectangle([406, 407, 1641, 745], radius=24, outline=(14, 116, 144, 110), width=1)
img = Image.alpha_composite(img, accent_layer)

# 5. Place Brand Avatar / Logo Icon
assets_dir = r'c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\public\images'
avatar_path = os.path.join(assets_dir, 'banners', 'rais_instagram_profile_avatar_1080x1080.png')

if os.path.exists(avatar_path):
    avatar_im = Image.open(avatar_path).convert('RGBA')
    # Resize avatar to fit in safe area cleanly
    av_size = 260
    avatar_resized = avatar_im.resize((av_size, av_size), Image.Resampling.LANCZOS)
    
    # Outer gold ring
    ring = Image.new('RGBA', (av_size + 20, av_size + 20), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring)
    ring_draw.ellipse([2, 2, av_size + 18, av_size + 18], outline=(245, 158, 11, 220), width=3)
    ring_draw.ellipse([6, 6, av_size + 14, av_size + 14], outline=(6, 182, 212, 140), width=1)
    
    av_x = 440
    av_y = 576 - av_size // 2
    img.paste(ring, (av_x - 10, av_y - 10), ring)
    img.paste(avatar_resized, (av_x, av_y), avatar_resized)

# 6. Place App & Food Cutouts on the Right Side of Safe Area
burger_path = os.path.join(assets_dir, 'ref-assets', 'hero_burger_stack.png')
momos_path = os.path.join(assets_dir, 'ref-assets', 'hero_momos_cutout.png')

if os.path.exists(burger_path):
    burger_im = Image.open(burger_path).convert('RGBA')
    bg_w, bg_h = 270, 270
    burger_resized = burger_im.resize((bg_w, bg_h), Image.Resampling.LANCZOS)
    # Burger placement on far right
    b_x = 1380
    b_y = 576 - bg_h // 2
    img.paste(burger_resized, (b_x, b_y), burger_resized)

if os.path.exists(momos_path):
    momos_im = Image.open(momos_path).convert('RGBA')
    m_w, m_h = 220, 220
    momos_resized = momos_im.resize((m_w, m_h), Image.Resampling.LANCZOS)
    # Momos slightly overlapping lower left of burger
    m_x = 1270
    m_y = 576 - m_h // 2 + 30
    img.paste(momos_resized, (m_x, m_y), momos_resized)

# 7. Typography in Safe Area (Center block: X ~ 730 to 1280, Y 425 to 730)
draw = ImageDraw.Draw(img)

font_brand = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 56)
font_sub = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 24)
font_cat = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 20)
font_items = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 20)
font_pill = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 19)

text_x = 730

# Line 1: Brand Title with Gold Highlight
draw.text((text_x, 442), "RAIS AGENCIES", fill=(251, 191, 36), font=font_brand) # Amber-400

# Line 2: Frozen Food Distribution
draw.text((text_x + 2, 514), "FROZEN FOODS & PACKAGING SUPPLY", fill=(255, 255, 255), font=font_sub)

# Line 3: Who we serve
draw.text((text_x + 2, 550), "Hotels  •  Restaurants  •  Cafes (QSR)  •  Caterers", fill=(56, 189, 248), font=font_cat) # Sky-400

# Line 4: Core products
draw.text((text_x + 2, 584), "Momos  •  French Fries  •  Burger Patties  •  Cheese  •  Sauces", fill=(226, 232, 240), font=font_items) # Slate-200

# Line 5: Location & WhatsApp Pill
pill_box = [text_x, 626, text_x + 550, 672]
draw.rounded_rectangle(pill_box, radius=12, fill=(15, 28, 63, 230), outline=(16, 185, 129, 220), width=2) # Emerald border
draw.text((text_x + 18, 637), "📍 Rayachoti (516269)   |   📞 WhatsApp: 9347453135", fill=(52, 211, 153), font=font_pill) # Emerald-400

# Save outputs
desktop_dest = r'C:\Users\affra\Desktop\RAIS_YouTube_Banner_2048x1152.png'
repo_dest = os.path.join(assets_dir, 'banners', 'rais_youtube_banner_2048x1152.png')

img.save(desktop_dest, format='PNG', optimize=True)
img.save(repo_dest, format='PNG', optimize=True)

print("Generated YouTube Banner successfully at:")
print(" -", desktop_dest)
print(" -", repo_dest)
