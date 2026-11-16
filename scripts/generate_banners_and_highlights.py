import os
import sys
import math
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

BANNER_DIR = "public/images/banners"
HIGHLIGHT_DIR = "public/images/highlights"
os.makedirs(BANNER_DIR, exist_ok=True)
os.makedirs(HIGHLIGHT_DIR, exist_ok=True)

FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REG = r"C:\Windows\Fonts\arial.ttf"
FONT_SEGOE_B = r"C:\Windows\Fonts\segoeuib.ttf"

# Colors
C_DARK_BG = (10, 15, 26)
C_NAVY_GRAD = (18, 28, 48)
C_GOLD = (212, 175, 55)
C_GOLD_LIGHT = (245, 218, 122)
C_GOLD_DARK = (160, 130, 40)
C_WHITE = (248, 250, 252)
C_MUTED = (148, 163, 184)
C_GREEN = (37, 211, 102)

def draw_diamond(draw, cx, cy, radius, fill_color, outline_color, line_width=4):
    pts = [
        (cx, cy - radius),
        (cx + radius, cy),
        (cx, cy + radius),
        (cx - radius, cy)
    ]
    if fill_color is not None:
        draw.polygon(pts, fill=fill_color)
    if outline_color is not None:
        draw.line(pts + [pts[0]], fill=outline_color, width=line_width)
    return pts

def draw_vector_pin(draw, cx, cy, size=24, color=C_GOLD, bg_color=(20, 30, 52)):
    r = size // 2
    # Top circle
    draw.ellipse([cx - r, cy - size, cx + r, cy], fill=color)
    # Bottom pointer
    draw.polygon([(cx - r, cy - r), (cx + r, cy - r), (cx, cy + r // 2 + 2)], fill=color)
    # Inner hole
    hole_r = max(2, r // 3)
    draw.ellipse([cx - hole_r, cy - size//2 - hole_r, cx + hole_r, cy - size//2 + hole_r], fill=bg_color)

def draw_vector_whatsapp(draw, cx, cy, radius=22, fill_color=C_GREEN):
    # Green circular badge
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=fill_color)
    # Chat bubble tail
    draw.polygon([(cx - radius + 3, cy + radius - 4), (cx - radius - 5, cy + radius + 5), (cx - 2, cy + radius - 2)], fill=fill_color)
    # White phone receiver inside
    pr = radius // 2
    draw.arc([cx - pr, cy - pr, cx + pr, cy + pr], start=135, end=315, fill=C_WHITE, width=4)
    draw.ellipse([cx - pr - 2, cy - 2, cx - pr + 4, cy + 4], fill=C_WHITE)
    draw.ellipse([cx - 2, cy - pr - 2, cx + 4, cy - pr + 4], fill=C_WHITE)

def draw_vector_check(draw, x, y, size=18, color=C_GOLD):
    # Stylized clean checkmark
    draw.line([(x, y + size // 2), (x + size // 3, y + size - 2), (x + size, y)], fill=color, width=3)

def draw_luxury_borders(draw, w, h, margin=30, accent_len=60):
    draw.rectangle([margin, margin, w - margin, h - margin], outline=(212, 175, 55, 120), width=2)
    draw.rectangle([margin + 10, margin + 10, w - margin - 10, h - margin - 10], outline=(212, 175, 55, 45), width=1)
    
    m = margin
    draw.line([(m, m + accent_len), (m, m), (m + accent_len, m)], fill=C_GOLD, width=4)
    draw.line([(w - m - accent_len, m), (w - m, m), (w - m, m + accent_len)], fill=C_GOLD, width=4)
    draw.line([(m, h - m - accent_len), (m, h - m), (m + accent_len, h - m)], fill=C_GOLD, width=4)
    draw.line([(w - m - accent_len, h - m), (w - m, h - m), (w - m, h - m - accent_len)], fill=C_GOLD, width=4)

def create_gradient_bg(w, h, c1=C_DARK_BG, c2=C_NAVY_GRAD):
    base = Image.new("RGBA", (w, h), c1)
    grad = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    for x in range(w):
        alpha = int(255 * (x / float(w)) * 0.75)
        g_draw.line([(x, 0), (x, h)], fill=(c2[0], c2[1], c2[2], alpha))
    return Image.alpha_composite(base, grad)

def generate_facebook_cover():
    w, h = 1640, 856
    img = create_gradient_bg(w, h, (8, 12, 22), (20, 32, 54))
    
    # Blend character/depot background on right half
    char_path = "public/images/character_test_scene_b_b2b.jpg"
    if os.path.exists(char_path):
        char_img = Image.open(char_path).convert("RGBA")
        target_h = h
        target_w = int(char_img.width * (target_h / char_img.height))
        char_resized = char_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        mask = Image.new("L", (target_w, target_h), 0)
        m_draw = ImageDraw.Draw(mask)
        for x in range(target_w):
            val = int(255 * max(0.0, min(1.0, (x - target_w * 0.15) / (target_w * 0.65))))
            m_draw.line([(x, 0), (x, target_h)], fill=val)
            
        pos_x = w - target_w + 100
        img.paste(char_resized, (pos_x, 0), mask)
        
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    o_draw = ImageDraw.Draw(overlay)
    for x in range(int(w * 0.68)):
        fade = int(245 * (1.0 - (x / (w * 0.68))))
        o_draw.line([(x, 0), (x, h)], fill=(8, 12, 22, fade))
    img = Image.alpha_composite(img, overlay)
    
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw, w, h, margin=40, accent_len=80)
    
    f_brand = ImageFont.truetype(FONT_BOLD, 78)
    f_sub = ImageFont.truetype(FONT_SEGOE_B, 25)
    f_bullets = ImageFont.truetype(FONT_SEGOE_B, 22)
    f_pill = ImageFont.truetype(FONT_BOLD, 22)
    f_wa = ImageFont.truetype(FONT_BOLD, 30)
    f_url = ImageFont.truetype(FONT_BOLD, 20)
    
    # Central Logo Diamond (Left)
    logo_cx = 160
    logo_cy = 160
    draw_diamond(draw, logo_cx, logo_cy, 65, (15, 24, 42, 255), C_GOLD, line_width=4)
    f_r = ImageFont.truetype(FONT_BOLD, 75)
    r_box = draw.textbbox((0, 0), "R", font=f_r)
    rw = r_box[2] - r_box[0]
    rh = r_box[3] - r_box[1]
    draw.text((logo_cx - rw // 2 - 2, logo_cy - rh // 2 - 8), "R", font=f_r, fill=C_GOLD_LIGHT)
    
    draw.text((250, 110), "RAIS AGENCIES", font=f_brand, fill=C_GOLD_LIGHT)
    draw.text((255, 205), "AUTHORIZED FROZEN FOOD DISTRIBUTOR & WHOLESALE DEPOT", font=f_sub, fill=C_WHITE)
    draw.line([(255, 248), (950, 248)], fill=C_GOLD, width=3)
    
    cats = [
        "Triken & Master Chef Chicken Momos (Steam & Fried)",
        "Golden French Fries, Chicken Popcorn & Nuggets",
        "Burger Patties, Gourmet Buns, Sauces & Mozzarella",
        "Commercial Kraft Takeaway Packaging & Food Trays"
    ]
    cur_y = 280
    for cat in cats:
        draw_diamond(draw, 150, cur_y + 12, 7, C_GOLD, C_GOLD_LIGHT, line_width=1)
        draw.text((175, cur_y), cat, font=f_bullets, fill=(235, 240, 250))
        cur_y += 44
        
    # Location Pill Box
    cur_y += 20
    box_x1, box_y1 = 140, cur_y
    box_x2, box_y2 = 840, cur_y + 60
    draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=12, fill=(20, 30, 52, 230), outline=C_GOLD, width=2)
    # Draw vector pin icon
    draw_vector_pin(draw, box_x1 + 35, box_y1 + 40, size=24, color=C_GOLD, bg_color=(20, 30, 52))
    draw.text((box_x1 + 60, box_y1 + 17), "Near Reddies Colony, Rayachoty, A.P. – 516269", font=f_pill, fill=C_GOLD_LIGHT)
    
    # WhatsApp CTA Box
    cur_y += 85
    wa_x1, wa_y1 = 140, cur_y
    wa_x2, wa_y2 = 760, cur_y + 70
    draw.rounded_rectangle([wa_x1, wa_y1, wa_x2, wa_y2], radius=14, fill=(18, 55, 35, 240), outline=C_GREEN, width=3)
    draw_vector_whatsapp(draw, wa_x1 + 45, wa_y1 + 35, radius=22, fill_color=C_GREEN)
    draw.text((wa_x1 + 85, wa_y1 + 17), "WhatsApp: +91 93474 53135", font=f_wa, fill=C_WHITE)
    
    # Handles at bottom
    cur_y += 105
    draw.text((145, cur_y), "INSTAGRAM: @raisfrozenfoods   |   WEB: dataengineer-irfan.github.io/RAIS-AGENCIES", font=f_url, fill=C_GOLD_LIGHT)
    
    out_path = os.path.join(BANNER_DIR, "rais_facebook_cover_banner_1640x856.png")
    img.save(out_path, format="PNG")
    print(f"Generated Facebook Cover: {out_path}")
    return out_path

def generate_whatsapp_business_cover():
    w, h = 1211, 681
    img = create_gradient_bg(w, h, (10, 15, 26), (22, 34, 58))
    
    burger_path = "public/images/ref-assets/hero_burger_stack.png"
    if os.path.exists(burger_path):
        b_img = Image.open(burger_path).convert("RGBA")
        bw = int(w * 0.42)
        bh = int(b_img.height * (bw / b_img.width))
        b_resized = b_img.resize((bw, bh), Image.Resampling.LANCZOS)
        img.paste(b_resized, (w - bw - 40, h - bh - 20), b_resized)
        
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw, w, h, margin=25, accent_len=50)
    
    f_brand = ImageFont.truetype(FONT_BOLD, 62)
    f_sub = ImageFont.truetype(FONT_SEGOE_B, 22)
    f_item = ImageFont.truetype(FONT_SEGOE_B, 19)
    f_box = ImageFont.truetype(FONT_BOLD, 22)
    f_wa = ImageFont.truetype(FONT_BOLD, 28)
    
    logo_cx, logo_cy = 110, 110
    draw_diamond(draw, logo_cx, logo_cy, 52, (16, 26, 46, 255), C_GOLD, line_width=3)
    f_r = ImageFont.truetype(FONT_BOLD, 60)
    r_box = draw.textbbox((0, 0), "R", font=f_r)
    draw.text((logo_cx - (r_box[2]-r_box[0])//2 - 2, logo_cy - (r_box[3]-r_box[1])//2 - 7), "R", font=f_r, fill=C_GOLD_LIGHT)
    
    draw.text((190, 75), "RAIS AGENCIES", font=f_brand, fill=C_GOLD_LIGHT)
    draw.text((195, 150), "FROZEN FOOD WHOLESALE & DISTRIBUTION", font=f_sub, fill=C_WHITE)
    draw.line([(195, 185), (780, 185)], fill=C_GOLD, width=2)
    
    items = [
        "66+ Commercial SKUs Ready in Cold Storage",
        "Triken Momos, French Fries, Nuggets, Patties & Sauces",
        "Supplying Rayachoty Cafes, QSRs & Food Caterers",
        "Food-Grade Kraft Clamshell Takeaway Boxes"
    ]
    cur_y = 210
    for item in items:
        draw_vector_check(draw, 90, cur_y + 2, size=16, color=C_GOLD)
        draw.text((120, cur_y), item, font=f_item, fill=(235, 240, 250))
        cur_y += 38
        
    cur_y += 15
    draw.rounded_rectangle([90, cur_y, 670, cur_y + 48], radius=8, fill=(20, 30, 52, 230), outline=C_GOLD, width=1)
    draw_vector_pin(draw, 115, cur_y + 34, size=20, color=C_GOLD, bg_color=(20, 30, 52))
    draw.text((135, cur_y + 12), "Near Reddies Colony, Rayachoty – 516269", font=f_box, fill=C_GOLD_LIGHT)
    
    cur_y += 65
    draw.rounded_rectangle([90, cur_y, 650, cur_y + 58], radius=10, fill=(18, 55, 35, 240), outline=C_GREEN, width=2)
    draw_vector_whatsapp(draw, 125, cur_y + 29, radius=18, fill_color=C_GREEN)
    draw.text((160, cur_y + 14), "WhatsApp: +91 93474 53135", font=f_wa, fill=C_WHITE)
    
    cur_y += 75
    f_sub2 = ImageFont.truetype(FONT_SEGOE_B, 18)
    draw.text((95, cur_y), "INSTAGRAM: @raisfrozenfoods   |   WEB: dataengineer-irfan.github.io/RAIS-AGENCIES", font=f_sub2, fill=C_GOLD_LIGHT)
    
    out_path = os.path.join(BANNER_DIR, "rais_whatsapp_business_cover_1211x681.png")
    img.save(out_path, format="PNG")
    print(f"Generated WhatsApp Cover: {out_path}")
    return out_path

def generate_instagram_profile_avatar():
    size = 1080
    img = Image.new("RGBA", (size, size), (8, 12, 22, 255))
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2
    
    r_outer = 480
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=(212, 175, 55, 180), width=6)
    r_inner = 460
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], outline=(212, 175, 55, 70), width=2)
    
    diamond_r = 240
    draw_diamond(draw, cx, cy - 30, diamond_r, (15, 24, 44, 255), C_GOLD, line_width=10)
    
    inner_r = 210
    draw_diamond(draw, cx, cy - 30, inner_r, None, (212, 175, 55, 100), line_width=2)
    
    f_r = ImageFont.truetype(FONT_BOLD, 260)
    r_box = draw.textbbox((0, 0), "R", font=f_r)
    rw = r_box[2] - r_box[0]
    rh = r_box[3] - r_box[1]
    draw.text((cx - rw // 2 - 5, (cy - 30) - rh // 2 - 25), "R", font=f_r, fill=C_GOLD_LIGHT)
    
    f_brand = ImageFont.truetype(FONT_BOLD, 68)
    b_box = draw.textbbox((0, 0), "RAIS AGENCIES", font=f_brand)
    bw = b_box[2] - b_box[0]
    draw.text((cx - bw // 2, cy + 250), "RAIS AGENCIES", font=f_brand, fill=C_GOLD_LIGHT)
    
    f_sub = ImageFont.truetype(FONT_SEGOE_B, 30)
    s_box = draw.textbbox((0, 0), "FROZEN FOODS • RAYACHOTY", font=f_sub)
    sw = s_box[2] - s_box[0]
    draw.text((cx - sw // 2, cy + 335), "FROZEN FOODS • RAYACHOTY", font=f_sub, fill=C_WHITE)
    
    out_path = os.path.join(BANNER_DIR, "rais_instagram_profile_avatar_1080x1080.png")
    img.save(out_path, format="PNG")
    print(f"Generated Profile Avatar: {out_path}")
    return out_path

def generate_story_highlights():
    highlights = [
        {
            "id": "highlight_01_momos",
            "title": "MOMOS",
            "sub": "TRIKEN & MASTER CHEF",
            "source_img": "public/images/ref-assets/hero_momos_cutout.png",
            "is_cutout": True
        },
        {
            "id": "highlight_02_snacks",
            "title": "SNACKS",
            "sub": "FRIES & NUGGETS",
            "source_img": "public/images/ref-assets/hero_popcorn_cutout.png",
            "is_cutout": True
        },
        {
            "id": "highlight_03_burgers",
            "title": "BURGERS",
            "sub": "PATTIES & SAUCES",
            "source_img": "public/images/ref-assets/hero_burger_stack.png",
            "is_cutout": True
        },
        {
            "id": "highlight_04_packaging",
            "title": "PACKAGING",
            "sub": "KRAFT BOXES & TRAYS",
            "source_img": "public/images/burger_boxes.jpg",
            "is_cutout": False
        },
        {
            "id": "highlight_05_depot",
            "title": "OUR DEPOT",
            "sub": "RAYACHOTY 516269",
            "source_img": "public/images/character_test_scene_b_b2b.jpg",
            "is_cutout": False,
            "badge_icon": "pin"
        },
        {
            "id": "highlight_06_order",
            "title": "HOW TO ORDER",
            "sub": "WHATSAPP CATALOGUE",
            "source_img": None,
            "badge_icon": "whatsapp"
        }
    ]
    
    size = 1080
    cx, cy = size // 2, size // 2
    out_files = []
    
    for h in highlights:
        img = Image.new("RGBA", (size, size), (8, 12, 22, 255))
        draw = ImageDraw.Draw(img)
        
        # Outer Instagram crop circle guide
        r_crop = 480
        draw.ellipse([cx - r_crop, cy - r_crop, cx + r_crop, cy + r_crop], fill=(13, 20, 36, 255))
        draw.ellipse([cx - r_crop, cy - r_crop, cx + r_crop, cy + r_crop], outline=C_GOLD, width=10)
        draw.ellipse([cx - (r_crop - 25), cy - (r_crop - 25), cx + (r_crop - 25), cy + (r_crop - 25)], outline=(212, 175, 55, 90), width=3)
        
        # Central Diamond
        diamond_cy = cy - 70
        draw_diamond(draw, cx, diamond_cy, 220, (18, 28, 48, 255), C_GOLD, line_width=4)
        draw_diamond(draw, cx, diamond_cy, 190, None, (212, 175, 55, 80), line_width=2)
        
        # Insert image or vector artwork
        if h["source_img"] and os.path.exists(h["source_img"]):
            s_img = Image.open(h["source_img"]).convert("RGBA")
            if h["is_cutout"]:
                cw = 300
                ch = int(s_img.height * (cw / s_img.width))
                s_img = s_img.resize((cw, ch), Image.Resampling.LANCZOS)
                img.paste(s_img, (cx - cw // 2, diamond_cy - ch // 2), s_img)
            else:
                # Square cropped with circular/diamond mask
                crop_dim = min(s_img.width, s_img.height)
                left = (s_img.width - crop_dim) // 2
                top = (s_img.height - crop_dim) // 2
                cropped = s_img.crop((left, top, left + crop_dim, top + crop_dim))
                cw = 240
                cropped = cropped.resize((cw, cw), Image.Resampling.LANCZOS)
                
                # Mask to inner circle
                mask = Image.new("L", (cw, cw), 0)
                m_draw = ImageDraw.Draw(mask)
                m_draw.ellipse([0, 0, cw, cw], fill=255)
                
                img.paste(cropped, (cx - cw // 2, diamond_cy - cw // 2), mask)
                # Gold circular outline over crop
                draw.ellipse([cx - cw // 2, diamond_cy - cw // 2, cx + cw // 2, diamond_cy + cw // 2], outline=C_GOLD, width=3)
        
        # If special vector badge icon
        if h.get("badge_icon") == "whatsapp":
            draw_vector_whatsapp(draw, cx, diamond_cy - 10, radius=90, fill_color=C_GREEN)
            f_wa_text = ImageFont.truetype(FONT_BOLD, 36)
            wb = draw.textbbox((0, 0), "9347453135", font=f_wa_text)
            draw.text((cx - (wb[2]-wb[0])//2, diamond_cy + 105), "9347453135", font=f_wa_text, fill=C_GOLD_LIGHT)
        elif h.get("badge_icon") == "pin":
            # Gold pin over image
            draw_vector_pin(draw, cx, diamond_cy + 130, size=34, color=C_GOLD_LIGHT, bg_color=(18, 28, 48))
            
        # Title Ribbon
        f_title = ImageFont.truetype(FONT_BOLD, 74)
        t_box = draw.textbbox((0, 0), h["title"], font=f_title)
        tw = t_box[2] - t_box[0]
        draw.text((cx - tw // 2, cy + 195), h["title"], font=f_title, fill=C_GOLD_LIGHT)
        
        # Subtitle
        f_sub = ImageFont.truetype(FONT_SEGOE_B, 30)
        s_box = draw.textbbox((0, 0), h["sub"], font=f_sub)
        sw = s_box[2] - s_box[0]
        draw.text((cx - sw // 2, cy + 280), h["sub"], font=f_sub, fill=C_WHITE)
        
        # Gold small brand footer
        f_rais = ImageFont.truetype(FONT_BOLD, 22)
        r_box = draw.textbbox((0, 0), "RAIS AGENCIES", font=f_rais)
        rw = r_box[2] - r_box[0]
        draw.text((cx - rw // 2, cy + 340), "RAIS AGENCIES", font=f_rais, fill=(212, 175, 55, 180))
        
        out_f = os.path.join(HIGHLIGHT_DIR, f"{h['id']}.png")
        img.save(out_f, format="PNG")
        out_files.append(out_f)
        print(f"Generated Highlight: {out_f}")
        
    return out_files

def generate_master_showcase_contact_sheet(fb_banner, wa_banner, avatar, highlights):
    canvas_w, canvas_h = 2400, 1800
    sheet = Image.new("RGBA", (canvas_w, canvas_h), (6, 9, 16, 255))
    draw = ImageDraw.Draw(sheet)
    
    draw_luxury_borders(draw, canvas_w, canvas_h, margin=30, accent_len=100)
    
    f_head = ImageFont.truetype(FONT_BOLD, 68)
    draw.text((80, 70), "RAIS AGENCIES — OFFICIAL SOCIAL MEDIA BRANDING SUITE", font=f_head, fill=C_GOLD_LIGHT)
    f_sub = ImageFont.truetype(FONT_SEGOE_B, 28)
    draw.text((85, 155), "Instagram Profile Avatar  |  Facebook Page Cover  |  WhatsApp Business Banner  |  6 Instagram Story Highlights", font=f_sub, fill=C_MUTED)
    draw.line([(80, 205), (canvas_w - 80, 205)], fill=C_GOLD, width=3)
    
    # 1. Facebook Banner
    fb_img = Image.open(fb_banner).convert("RGBA")
    fb_preview_w = 1200
    fb_preview_h = int(fb_img.height * (fb_preview_w / fb_img.width))
    fb_resized = fb_img.resize((fb_preview_w, fb_preview_h), Image.Resampling.LANCZOS)
    sheet.paste(fb_resized, (80, 260))
    draw.rectangle([80, 260, 80 + fb_preview_w, 260 + fb_preview_h], outline=C_GOLD, width=2)
    f_lbl = ImageFont.truetype(FONT_BOLD, 24)
    draw.text((85, 260 + fb_preview_h + 15), "1. FACEBOOK PAGE / WEBSITE BANNER (1640 x 856 px)", font=f_lbl, fill=C_GOLD_LIGHT)
    
    # 2. Profile Avatar
    av_img = Image.open(avatar).convert("RGBA")
    av_preview_size = 420
    av_resized = av_img.resize((av_preview_size, av_preview_size), Image.Resampling.LANCZOS)
    sheet.paste(av_resized, (1340, 260))
    draw.rectangle([1340, 260, 1340 + av_preview_size, 260 + av_preview_size], outline=C_GOLD, width=2)
    draw.text((1340, 260 + av_preview_size + 15), "2. INSTAGRAM / FB AVATAR (1080 x 1080 px)", font=f_lbl, fill=C_GOLD_LIGHT)
    
    # 3. WhatsApp Business Cover
    wa_img = Image.open(wa_banner).convert("RGBA")
    wa_preview_w = 500
    wa_preview_h = int(wa_img.height * (wa_preview_w / wa_img.width))
    wa_resized = wa_img.resize((wa_preview_w, wa_preview_h), Image.Resampling.LANCZOS)
    sheet.paste(wa_resized, (1810, 260))
    draw.rectangle([1810, 260, 1810 + wa_preview_w, 260 + wa_preview_h], outline=C_GOLD, width=2)
    draw.text((1810, 260 + wa_preview_h + 15), "3. WHATSAPP BUSINESS BANNER", font=f_lbl, fill=C_GOLD_LIGHT)
    
    # 4. Instagram Story Highlights Row
    hl_y = 980
    draw.text((80, hl_y), "4. INSTAGRAM STORY HIGHLIGHTS (SET OF 6 CIRCULAR STOREFRONT COVERS - 1080 x 1080 px)", font=f_lbl, fill=C_GOLD_LIGHT)
    draw.line([(80, hl_y + 40), (canvas_w - 80, hl_y + 40)], fill=(212, 175, 55, 100), width=1)
    
    icon_size = 320
    spacing = 50
    start_x = 80
    for idx, hl_path in enumerate(highlights):
        hl_img = Image.open(hl_path).convert("RGBA")
        hl_res = hl_img.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        px = start_x + idx * (icon_size + spacing)
        sheet.paste(hl_res, (px, hl_y + 70))
        draw.rectangle([px, hl_y + 70, px + icon_size, hl_y + 70 + icon_size], outline=(212, 175, 55, 80), width=1)
        
    f_ft = ImageFont.truetype(FONT_SEGOE_B, 24)
    draw.text((80, canvas_h - 100), "RAIS Agencies — Near Reddies Colony, Rayachoty (516269)   |   WhatsApp: +91 93474 53135   |   Instagram: @raisfrozenfoods", font=f_ft, fill=C_GOLD_LIGHT)
    
    out_sheet = os.path.join(BANNER_DIR, "rais_brand_assets_showcase.jpg")
    sheet.convert("RGB").save(out_sheet, quality=95)
    print(f"Generated Master Contact Sheet: {out_sheet}")
    
    artifact_dir = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"
    artifact_copy = os.path.join(artifact_dir, "rais_brand_assets_showcase.jpg")
    shutil.copyfile(out_sheet, artifact_copy)
    print(f"Copied to Artifact Directory: {artifact_copy}")
    return out_sheet

if __name__ == "__main__":
    fb = generate_facebook_cover()
    wa = generate_whatsapp_business_cover()
    av = generate_instagram_profile_avatar()
    hls = generate_story_highlights()
    generate_master_showcase_contact_sheet(fb, wa, av, hls)
    print("All branding suite assets generated successfully!")
