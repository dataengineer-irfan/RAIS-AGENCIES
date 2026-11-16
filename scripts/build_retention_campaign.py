import os
import sys
import math
import random
import shutil
import asyncio
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
BASE_WORK_DIR = "public/videos/campaigns_retention_work"
CAMPAIGN_DIR = "public/videos/campaigns"
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

os.makedirs(BASE_WORK_DIR, exist_ok=True)
os.makedirs(CAMPAIGN_DIR, exist_ok=True)

import json
with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

# ============================================================
# SHARED BRAND END CARD (161 frames, 16.0s - 21.37s)
# ============================================================
def render_shared_endcard(out_clip):
    if os.path.exists(out_clip):
        print(f"[REUSE] Shared End Card clip already exists: {out_clip}")
        return
        
    print("--- Rendering Shared Brand End Card (161 frames) ---")
    frames_dir = f"{BASE_WORK_DIR}/shared_endcard_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    width, height = 1080, 1920
    master = Image.new("RGBA", (width, height), (7, 11, 20, 255))
    draw = ImageDraw.Draw(master)
    
    # Outer gold border & brackets
    draw.rectangle([60, 100, width - 60, height - 120], outline=(212, 175, 55, 140), width=3)
    draw.rectangle([75, 115, width - 75, height - 135], outline=(212, 175, 55, 50), width=1)
    c_len = 80
    draw.line([(60, 100 + c_len), (60, 100), (60 + c_len, 100)], fill=(212, 175, 55, 255), width=6)
    draw.line([(width - 60 - c_len, 100), (width - 60, 100), (width - 60, 100 + c_len)], fill=(212, 175, 55, 255), width=6)
    draw.line([(60, height - 120 - c_len), (60, height - 120), (60 + c_len, height - 120)], fill=(212, 175, 55, 255), width=6)
    draw.line([(width - 60 - c_len, height - 120), (width - 60, height - 120), (width - 60, height - 120 - c_len)], fill=(212, 175, 55, 255), width=6)
    
    center_x = width // 2
    f_logo = ImageFont.truetype(FONT_BOLD, 160)
    f_title = ImageFont.truetype(FONT_BOLD, 76)
    f_subtitle = ImageFont.truetype(FONT_BOLD, 36)
    f_city = ImageFont.truetype(FONT_BOLD, 44)
    f_question = ImageFont.truetype(FONT_BOLD, 40)
    f_cta_btn = ImageFont.truetype(FONT_BOLD, 48)
    
    logo_y = 520
    diamond_r = 160
    pts = [
        (center_x, logo_y - diamond_r),
        (center_x + diamond_r, logo_y),
        (center_x, logo_y + diamond_r),
        (center_x - diamond_r, logo_y)
    ]
    draw.polygon(pts, fill=(15, 22, 38, 255), outline=(212, 175, 55, 255))
    draw.line(pts + [pts[0]], fill=(212, 175, 55, 255), width=7)
    
    in_r = 135
    in_pts = [
        (center_x, logo_y - in_r),
        (center_x + in_r, logo_y),
        (center_x, logo_y + in_r),
        (center_x - in_r, logo_y)
    ]
    draw.polygon(in_pts, fill=(10, 14, 26, 255), outline=(212, 175, 55, 120))
    draw.line(in_pts + [in_pts[0]], fill=(212, 175, 55, 120), width=2)
    draw.text((center_x, logo_y - 20), "R", fill=(212, 175, 55, 255), font=f_logo, anchor="mm")
    
    text_y = logo_y + diamond_r + 90
    draw.text((center_x + 3, text_y + 3), "RAIS AGENCIES", fill=(0, 0, 0, 240), font=f_title, anchor="mm")
    draw.text((center_x, text_y), "RAIS AGENCIES", fill=(255, 255, 255, 255), font=f_title, anchor="mm")
    
    sub_y = text_y + 68
    draw.text((center_x, sub_y), "FROZEN FOOD PRODUCTS & PACKAGING SUPPLIES", fill=(212, 175, 55, 255), font=f_subtitle, anchor="mm")
    
    city_y = sub_y + 78
    draw.rounded_rectangle([center_x - 220, city_y - 32, center_x + 220, city_y + 32], radius=16, fill=(18, 26, 44, 230), outline=(212, 175, 55, 160), width=2)
    draw.text((center_x, city_y), "RAYACHOTY", fill=(255, 255, 255, 255), font=f_city, anchor="mm")
    
    div_y = city_y + 95
    draw.line([(center_x - 300, div_y), (center_x + 300, div_y)], fill=(212, 175, 55, 100), width=2)
    
    q_y = div_y + 80
    draw.text((center_x, q_y), "Food Business or Personal Enquiry?", fill=(226, 232, 240, 255), font=f_question, anchor="mm")
    
    btn_y = q_y + 75
    btn_w = 820
    btn_h = 130
    btn_box = [(center_x - btn_w // 2, btn_y), (center_x + btn_w // 2, btn_y + btn_h)]
    
    wa_y = btn_y + btn_h + 40
    wa_h = 100
    wa_box = [(center_x - btn_w // 2, wa_y), (center_x + btn_w // 2, wa_y + wa_h)]
    
    for f in range(161):
        canvas = master.copy()
        c_draw = ImageDraw.Draw(canvas)
        
        c_draw.rounded_rectangle(btn_box, radius=24, fill=(180, 40, 90, 255), outline=(212, 175, 55, 240), width=3)
        c_draw.text((center_x, btn_y + btn_h // 2), "DM on Instagram: @raisagencies", fill=(255, 255, 255, 255), font=f_cta_btn, anchor="mm")
        
        pulse_alpha = int(160 + 75 * math.sin(2 * math.pi * f / 40.0))
        c_draw.rounded_rectangle(wa_box, radius=20, fill=(15, 60, 35, 255), outline=(37, 211, 102, pulse_alpha), width=3)
        f_wa = ImageFont.truetype(FONT_BOLD, 42)
        c_draw.text((center_x, wa_y + wa_h // 2), "WhatsApp: +91 91772 78688", fill=(255, 255, 255, 255), font=f_wa, anchor="mm")
        
        canvas.convert("RGB").save(f"{frames_dir}/frame_{f:04d}.jpg", quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip
    ]
    subprocess.run(cmd, capture_output=True, check=True)

# ============================================================
# SHOT 1A: IMMEDIATE VISUAL HOOK (0.0s - 0.7s, 21 frames)
# High-energy dynamic food/action macro close-up
# ============================================================
def render_shot_1a_hook(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot1a_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    # Select hero food asset for immediate hook
    prod_path = sc["sku1"]["asset"]
    base_prod = Image.open(prod_path).convert("RGBA")
    pw, ph = base_prod.size
    
    max_scale = max(1080.0 * 1.35 / pw, 1920.0 * 1.35 / ph)
    scaled = base_prod.resize((int(pw * max_scale), int(ph * max_scale)), Image.Resampling.LANCZOS)
    sw, sh = scaled.size
    
    random.seed(300 + sc_id)
    particles = []
    for _ in range(50):
        particles.append({
            'x': random.uniform(280, 800),
            'y': random.uniform(700, 1400),
            'radius': random.uniform(24, 46),
            'speed_y': random.uniform(6.0, 12.0),
            'speed_x': random.uniform(-2.5, 2.5),
            'alpha_max': random.uniform(0.35, 0.65),
            'life': random.uniform(0.0, 0.4)
        })
        
    for f in range(21):
        zoom = 1.0 + 0.12 * (f / 21.0)
        crop_w = int(1080 / zoom)
        crop_h = int(1920 / zoom)
        cx = (sw - crop_w) // 2
        cy = (sh - crop_h) // 2
        canvas = scaled.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        # Steam / energy particle burst
        steam_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(steam_layer)
        for p in particles:
            p['life'] += 0.04
            p['y'] -= p['speed_y']
            p['x'] += p['speed_x']
            p['radius'] += 1.8
            cur_a = int(255 * p['alpha_max'] * max(0.0, 1.0 - p['life']))
            if cur_a > 0:
                r = p['radius']
                s_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(245, 250, 255, cur_a))
                
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=20))
        canvas = Image.alpha_composite(canvas, steam_layer)
        
        # Sizzle flash at frame 0..3 (warm light flash)
        if f < 4:
            flash_a = int(60 * (1.0 - f / 4.0))
            flash = Image.new("RGBA", (1080, 1920), (255, 220, 160, flash_a))
            canvas = Image.alpha_composite(canvas, flash)
            
        canvas.convert("RGB").save(f"{frames_dir}/frame_{f:04d}.jpg", quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip
    ]
    subprocess.run(cmd, capture_output=True, check=True)

# ============================================================
# SHOT 1B: CHARACTER REACTION (0.7s - 2.0s, 39 frames)
# Dedicated scenario environment with breathing & blinking
# ============================================================
def render_shot_1b_character(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot1b_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    char_path = sc["character"]
    char_img = Image.open(char_path).convert("RGBA")
    
    # Seamless blurred background
    bg_master = char_img.resize((1080, 1920), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(radius=30))
    dimmer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 75))
    bg_blurred = Image.alpha_composite(bg_master, dimmer)
    
    cw, ch = char_img.size
    fit_scale = 1920.0 / ch
    fit_w = int(cw * fit_scale)
    fit_h = 1920
    char_master = char_img.resize((fit_w, fit_h), Image.Resampling.LANCZOS)
    
    for f in range(39):
        # Camera tracking & breathing
        cam_zoom = 1.0 + 0.04 * (f / 39.0)
        cur_w = int(fit_w * cam_zoom)
        cur_h = int(fit_h * cam_zoom)
        char_scaled = char_master.resize((cur_w, cur_h), Image.Resampling.BILINEAR)
        
        breathe_y = int(4.0 * math.sin(2 * math.pi * f / 30.0))
        head_x = int(3.5 * math.sin(2 * math.pi * f / 39.0))
        
        canvas = bg_blurred.copy()
        base_x = (1080 - cur_w) // 2 + head_x
        base_y = (1920 - cur_h) // 2 + breathe_y
        canvas.paste(char_scaled, (base_x, base_y))
        
        # Specular warm lighting sweep
        light_sweep = int(12 * math.sin(math.pi * f / 39.0))
        if light_sweep > 0:
            sweep = Image.new("RGBA", (1080, 1920), (255, 215, 150, light_sweep))
            canvas = Image.alpha_composite(canvas, sweep)
            
        canvas.convert("RGB").save(f"{frames_dir}/frame_{f:04d}.jpg", quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip
    ]
    subprocess.run(cmd, capture_output=True, check=True)

# ============================================================
# SHOT 2: HERO FOOD REVEAL (2.0s - 4.0s, 60 frames)
# Steaming / sizzling hero food with luxury gold badge
# ============================================================
def render_shot_2_hero_food(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot2_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    sku1 = sc["sku1"]
    prod_path = sku1["asset"]
    prod_img = Image.open(prod_path).convert("RGBA")
    pw, ph = prod_img.size
    
    max_scale = max(1080.0 * 1.08 / pw, 1920.0 * 1.08 / ph)
    scaled = prod_img.resize((int(pw * max_scale), int(ph * max_scale)), Image.Resampling.LANCZOS)
    sw, sh = scaled.size
    
    badge = Image.new("RGBA", (840, 140), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge)
    b_draw.rounded_rectangle([0, 0, 840, 140], radius=20, fill=(10, 15, 26, 235), outline=(212, 175, 55, 230), width=2)
    f_sub = ImageFont.truetype(FONT_BOLD, 22)
    f_main = ImageFont.truetype(FONT_BOLD, 32)
    b_draw.text((420, 38), f"{sku1['brand'].upper()} • {sku1['pack'].upper()} • {sku1['code']}", fill=(212, 175, 55), font=f_sub, anchor="mm")
    b_draw.text((420, 88), sku1["name"].upper(), fill=(255, 255, 255), font=f_main, anchor="mm")
    
    random.seed(400 + sc_id)
    particles = []
    for _ in range(50):
        particles.append({
            'x': random.uniform(340, 740),
            'y': random.uniform(600, 1200),
            'radius': random.uniform(20, 36),
            'speed_y': random.uniform(3.5, 6.0),
            'drift_phase': random.uniform(0, math.pi * 2),
            'alpha_max': random.uniform(0.22, 0.40),
            'life': random.uniform(0.0, 1.0)
        })
        
    for f in range(60):
        zoom = 1.0 + 0.05 * (f / 60.0)
        crop_w = int(1080 / (zoom / 1.05))
        crop_h = int(1920 / (zoom / 1.05))
        cx = (sw - crop_w) // 2
        cy = (sh - crop_h) // 2
        canvas = scaled.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        steam_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(steam_layer)
        for p in particles:
            p['life'] += 0.02
            p['y'] -= p['speed_y']
            p['x'] += math.sin(p['drift_phase'] + p['life'] * 8.0) * 1.5
            p['radius'] += 0.7
            if p['life'] < 0.25:
                cur_a = int(255 * p['alpha_max'] * (p['life'] / 0.25))
            else:
                cur_a = int(255 * p['alpha_max'] * max(0.0, 1.0 - (p['life'] - 0.25) / 0.75))
            if p['life'] >= 1.0 or p['y'] < 380:
                p['life'] = 0.0
                p['y'] = random.uniform(1100, 1180)
                p['x'] = random.uniform(340, 740)
                cur_a = 0
            if cur_a > 0:
                r = p['radius']
                s_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(245, 248, 255, cur_a))
                
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=18))
        canvas = Image.alpha_composite(canvas, steam_layer)
        
        vignette = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(vignette)
        for y in range(1450, 1920):
            v_a = int(150 * ((y - 1450) / 470.0))
            v_draw.line([(0, y), (1080, y)], fill=(0, 0, 0, v_a))
        canvas = Image.alpha_composite(canvas, vignette)
        
        badge_y = 1620 + int(3.0 * math.sin(2 * math.pi * f / 60.0))
        canvas.paste(badge, (120, badge_y), badge)
        canvas.convert("RGB").save(f"{frames_dir}/frame_{f:04d}.jpg", quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip
    ]
    subprocess.run(cmd, capture_output=True, check=True)

# ============================================================
# SHOT 3: SCENARIO-SPECIFIC CONNECTION (4.0s - 6.0s, 60 frames)
# In-context food presentation & packaging assembly
# ============================================================
def render_shot_3_connection(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot3_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    sku2 = sc["sku2"]
    bg_asset = sku2["asset"]
    paired_asset = sku2.get("paired_asset", "public/images/products/kraft_burger_box.jpg")
    
    bg_img = Image.open(bg_asset).convert("RGBA")
    pair_img = Image.open(paired_asset).convert("RGBA")
    bw, bh = bg_img.size
    
    f_tag = ImageFont.truetype(FONT_BOLD, 20)
    f_name = ImageFont.truetype(FONT_BOLD, 24)
    
    # Pre-render Card 1: SKU 2
    card1 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(card1)
    d1.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d1.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d1.text((225, 40), sku2["brand"].upper(), fill=(212, 175, 55), font=f_tag, anchor="mm")
    fit_w = 360
    b_fit = bg_img.resize((fit_w, int(bh * (fit_w / bw))), Image.Resampling.LANCZOS)
    b_mask = Image.new("L", b_fit.size, 0)
    ImageDraw.Draw(b_mask).rounded_rectangle([0, 0, b_fit.width, b_fit.height], radius=16, fill=255)
    card1.paste(b_fit, (45, 90), b_mask)
    d1.text((225, 500), sku2["name"][:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d1.text((225, 530), f"SKU: {sku2['code']} • {sku2['pack']}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    # Pre-render Card 2: Packaging
    card2 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(card2)
    d2.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d2.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d2.text((225, 40), "COMMERCIAL PACKAGING", fill=(212, 175, 55), font=f_tag, anchor="mm")
    pw, ph = pair_img.size
    p_fit = pair_img.resize((370, int(ph * (370 / pw))), Image.Resampling.LANCZOS)
    p_mask = Image.new("L", p_fit.size, 0)
    ImageDraw.Draw(p_mask).rounded_rectangle([0, 0, p_fit.width, p_fit.height], radius=16, fill=255)
    card2.paste(p_fit, (40, 100), p_mask)
    d2.text((225, 500), sku2.get("paired_name", "Kraft Packaging")[:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d2.text((225, 530), f"SKU: {sku2.get('paired_code', 'RAIS-BOX-02')}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    bg_preview = bg_img.resize((960, int(bh * (960 / bw))), Image.Resampling.LANCZOS)
    scrim = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(scrim)
    for y in range(600, 1920):
        alpha = int(220 * ((y - 600) / 1320.0))
        draw_s.line([(0, y), (1080, y)], fill=(6, 10, 18, alpha))
        
    for f in range(60):
        canvas = Image.new("RGBA", (1080, 1920), (8, 12, 20, 255))
        canvas.paste(bg_preview, (60, 120))
        canvas = Image.alpha_composite(canvas, scrim)
        
        offset_y = int(60 * (1.0 - (f / 15.0)**2)) if f < 15 else 0
        bob1 = int(3.5 * math.sin(2 * math.pi * f / 40.0))
        bob2 = int(3.5 * math.cos(2 * math.pi * f / 40.0))
        
        canvas.paste(card1, (60, 840 + offset_y + bob1), card1)
        canvas.paste(card2, (570, 840 + offset_y + bob2), card2)
        canvas.convert("RGB").save(f"{frames_dir}/frame_{f:04d}.jpg", quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip
    ]
    subprocess.run(cmd, capture_output=True, check=True)

# ============================================================
# SHOT 4: HERO CULINARY IMMERSION (6.0s - 11.5s, 165 frames)
# Deep culinary steam and macro food push-in
# ============================================================
def render_shot_4_culinary_immersion(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot4_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    sku1 = sc["sku1"]
    prod_path = sku1["asset"]
    base_prod = Image.open(prod_path).convert("RGBA")
    pw, ph = base_prod.size
    
    max_scale = max(1080.0 * 1.06 / pw, 1920.0 * 1.06 / ph)
    scaled = base_prod.resize((int(pw * max_scale), int(ph * max_scale)), Image.Resampling.LANCZOS)
    sw, sh = scaled.size
    
    badge = Image.new("RGBA", (840, 140), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge)
    b_draw.rounded_rectangle([0, 0, 840, 140], radius=20, fill=(10, 15, 26, 235), outline=(212, 175, 55, 230), width=2)
    f_sub = ImageFont.truetype(FONT_BOLD, 22)
    f_main = ImageFont.truetype(FONT_BOLD, 32)
    b_draw.text((420, 38), f"{sku1['brand'].upper()} • {sku1['pack'].upper()}", fill=(212, 175, 55), font=f_sub, anchor="mm")
    b_draw.text((420, 88), sku1["name"].upper(), fill=(255, 255, 255), font=f_main, anchor="mm")
    
    random.seed(500 + sc_id)
    particles = []
    for _ in range(65):
        particles.append({
            'x': random.uniform(320, 760),
            'y': random.uniform(550, 1200),
            'radius': random.uniform(18, 34),
            'speed_y': random.uniform(3.2, 5.5),
            'drift_phase': random.uniform(0, math.pi * 2),
            'alpha_max': random.uniform(0.20, 0.36),
            'life': random.uniform(0.0, 1.0)
        })
        
    for f in range(165):
        zoom = 1.0 + 0.06 * (f / 165.0)
        crop_w = int(1080 / (zoom / 1.05))
        crop_h = int(1920 / (zoom / 1.05))
        cx = (sw - crop_w) // 2
        cy = (sh - crop_h) // 2
        canvas = scaled.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        steam_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(steam_layer)
        for p in particles:
            p['life'] += 0.016
            p['y'] -= p['speed_y']
            p['x'] += math.sin(p['drift_phase'] + p['life'] * 8.0) * 1.5
            p['radius'] += 0.65
            if p['life'] < 0.25:
                cur_a = int(255 * p['alpha_max'] * (p['life'] / 0.25))
            else:
                cur_a = int(255 * p['alpha_max'] * max(0.0, 1.0 - (p['life'] - 0.25) / 0.75))
            if p['life'] >= 1.0 or p['y'] < 380:
                p['life'] = 0.0
                p['y'] = random.uniform(1100, 1180)
                p['x'] = random.uniform(320, 760)
                cur_a = 0
            if cur_a > 0:
                r = p['radius']
                s_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(245, 248, 255, cur_a))
                
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=18))
        canvas = Image.alpha_composite(canvas, steam_layer)
        
        vignette = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(vignette)
        for y in range(1450, 1920):
            v_a = int(150 * ((y - 1450) / 470.0))
            v_draw.line([(0, y), (1080, y)], fill=(0, 0, 0, v_a))
        canvas = Image.alpha_composite(canvas, vignette)
        
        badge_y = 1620 + int(3.0 * math.sin(2 * math.pi * f / 60.0))
        canvas.paste(badge, (120, badge_y), badge)
        canvas.convert("RGB").save(f"{frames_dir}/frame_{f:04d}.jpg", quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip
    ]
    subprocess.run(cmd, capture_output=True, check=True)

# ============================================================
# SHOT 5: DUAL PACKAGING CARDS (11.5s - 16.0s, 135 frames)
# Floating 3D perspective cards
# ============================================================
def render_shot_5_packaging_cards(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot5_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    sku2 = sc["sku2"]
    bg_asset = sku2["asset"]
    paired_asset = sku2.get("paired_asset", "public/images/products/kraft_burger_box.jpg")
    
    bg_img = Image.open(bg_asset).convert("RGBA")
    pair_img = Image.open(paired_asset).convert("RGBA")
    bw, bh = bg_img.size
    
    f_tag = ImageFont.truetype(FONT_BOLD, 20)
    f_name = ImageFont.truetype(FONT_BOLD, 24)
    
    card1 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(card1)
    d1.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d1.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d1.text((225, 40), sku2["brand"].upper(), fill=(212, 175, 55), font=f_tag, anchor="mm")
    fit_w = 360
    b_fit = bg_img.resize((fit_w, int(bh * (fit_w / bw))), Image.Resampling.LANCZOS)
    b_mask = Image.new("L", b_fit.size, 0)
    ImageDraw.Draw(b_mask).rounded_rectangle([0, 0, b_fit.width, b_fit.height], radius=16, fill=255)
    card1.paste(b_fit, (45, 90), b_mask)
    d1.text((225, 500), sku2["name"][:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d1.text((225, 530), f"SKU: {sku2['code']} • {sku2['pack']}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    card2 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(card2)
    d2.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d2.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d2.text((225, 40), "COMMERCIAL PACKAGING", fill=(212, 175, 55), font=f_tag, anchor="mm")
    pw, ph = pair_img.size
    p_fit = pair_img.resize((370, int(ph * (370 / pw))), Image.Resampling.LANCZOS)
    p_mask = Image.new("L", p_fit.size, 0)
    ImageDraw.Draw(p_mask).rounded_rectangle([0, 0, p_fit.width, p_fit.height], radius=16, fill=255)
    card2.paste(p_fit, (40, 100), p_mask)
    d2.text((225, 500), sku2.get("paired_name", "Kraft Packaging")[:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d2.text((225, 530), f"SKU: {sku2.get('paired_code', 'RAIS-BOX-02')}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    bg_preview = bg_img.resize((960, int(bh * (960 / bw))), Image.Resampling.LANCZOS)
    scrim = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(scrim)
    for y in range(600, 1920):
        alpha = int(220 * ((y - 600) / 1320.0))
        draw_s.line([(0, y), (1080, y)], fill=(6, 10, 18, alpha))
        
    for f in range(135):
        canvas = Image.new("RGBA", (1080, 1920), (8, 12, 20, 255))
        canvas.paste(bg_preview, (60, 120))
        canvas = Image.alpha_composite(canvas, scrim)
        
        offset_y = int(45 * (1.0 - (f / 20.0)**2)) if f < 20 else 0
        bob1 = int(3.5 * math.sin(2 * math.pi * f / 60.0))
        bob2 = int(3.5 * math.cos(2 * math.pi * f / 60.0))
        
        canvas.paste(card1, (60, 840 + offset_y + bob1), card1)
        canvas.paste(card2, (570, 840 + offset_y + bob2), card2)
        canvas.convert("RGB").save(f"{frames_dir}/frame_{f:04d}.jpg", quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip
    ]
    subprocess.run(cmd, capture_output=True, check=True)

# ============================================================
# AUDIO ENGINE & CALIBRATED MIXING
# ============================================================
async def generate_scenario_audio(sc_id, sc, work_dir):
    import edge_tts
    audio_dir = f"{work_dir}/audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    audio_tracks = {}
    for lang, voice, rate in [("hi", "hi-IN-SwaraNeural", "+20%"), ("te", "te-IN-ShrutiNeural", "+14%")]:
        texts = sc["audio_hi"] if lang == "hi" else sc["audio_te"]
        files = []
        for idx, t in enumerate(texts):
            f_out = f"{audio_dir}/narration_{lang}_{idx+1}.mp3"
            comm = edge_tts.Communicate(t, voice, rate=rate)
            await comm.save(f_out)
            files.append(f_out)
            
        full_wav = f"{audio_dir}/full_narration_{lang}.wav"
        t_delays = [150, 4300, 9600, 14400] if lang == "hi" else [150, 4800, 9400, 14400]
        cmd_mix = [
            FFMPEG_EXE, "-y",
            "-i", files[0],
            "-i", files[1],
            "-i", files[2],
            "-i", files[3],
            "-filter_complex",
            f"[0:a]adelay={t_delays[0]}|{t_delays[0]}[a0];"
            f"[1:a]adelay={t_delays[1]}|{t_delays[1]}[a1];"
            f"[2:a]adelay={t_delays[2]}|{t_delays[2]}[a2];"
            f"[3:a]adelay={t_delays[3]}|{t_delays[3]}[a3];"
            "[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0",
            "-ac", "2", "-ar", "44100",
            full_wav
        ]
        subprocess.run(cmd_mix, capture_output=True, check=True)
        audio_tracks[lang] = full_wav
        
    total_dur = 21.36
    bgm_wav = f"{audio_dir}/bgm_bed.wav"
    fade_start = total_dur - 2.0
    cmd_bgm = [
        FFMPEG_EXE, "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={total_dur:.2f}:c=pink:r=44100:a=0.035,lowpass=f=750[rain];"
              f"sine=f=220:d={total_dur:.2f},volume=0.025[t1];"
              f"sine=f=330:d={total_dur:.2f},volume=0.02[t2];"
              f"sine=f=440:d={total_dur:.2f},volume=0.015[t3];"
              f"[rain][t1][t2][t3]amix=inputs=4:duration=first:dropout_transition=0:normalize=0,volume=0.10,afade=t=out:st={fade_start:.2f}:d=2.0",
        "-ac", "2", "-ar", "44100",
        bgm_wav
    ]
    subprocess.run(cmd_bgm, capture_output=True, check=True)
    audio_tracks["bgm"] = bgm_wav
    return audio_tracks

# ============================================================
# MASTER PROCESSOR FOR A SINGLE SCENARIO
# ============================================================
async def process_scenario_retention(sc_id, shared_endcard_clip):
    sc = MANIFEST[str(sc_id)]
    folder = sc["folder"]
    work_dir = f"{BASE_WORK_DIR}/sc_{sc_id:02d}"
    out_dir = f"{CAMPAIGN_DIR}/{folder}"
    os.makedirs(work_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\n=======================================================")
    print(f"COMPILING SCENARIO {sc_id:02d}: {sc['title']}")
    print(f"Environment: {os.path.basename(sc['character'])}")
    print(f"=======================================================")
    
    c1a = f"{work_dir}/shot1a.mp4"
    c1b = f"{work_dir}/shot1b.mp4"
    c2 = f"{work_dir}/shot2.mp4"
    c3 = f"{work_dir}/shot3.mp4"
    c4 = f"{work_dir}/shot4.mp4"
    c5 = f"{work_dir}/shot5.mp4"
    c6 = shared_endcard_clip
    
    render_shot_1a_hook(sc_id, sc, work_dir, c1a)
    render_shot_1b_character(sc_id, sc, work_dir, c1b)
    render_shot_2_hero_food(sc_id, sc, work_dir, c2)
    render_shot_3_connection(sc_id, sc, work_dir, c3)
    render_shot_4_culinary_immersion(sc_id, sc, work_dir, c4)
    render_shot_5_packaging_cards(sc_id, sc, work_dir, c5)
    
    concat_list = f"{work_dir}/concat_shots.txt"
    with open(concat_list, "w") as f:
        for p in [c1a, c1b, c2, c3, c4, c5, c6]:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    video_merged = f"{work_dir}/video_merged.mp4"
    cmd_cat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        video_merged
    ]
    subprocess.run(cmd_cat, capture_output=True, check=True)
    
    audio_tracks = await generate_scenario_audio(sc_id, sc, work_dir)
    
    for lang in ["hi", "te"]:
        out_filename = f"master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4"
        out_mp4 = f"{out_dir}/{out_filename}"
        n_wav = audio_tracks[lang]
        bgm_wav = audio_tracks["bgm"]
        
        cmd_mux = [
            FFMPEG_EXE, "-y",
            "-i", video_merged,
            "-i", n_wav,
            "-i", bgm_wav,
            "-filter_complex",
            "[1:a]volume=1.0[voice];[2:a]volume=0.10,afade=t=out:st=19.36:d=2.0[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "copy",
            "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
            "-t", "21.36",
            out_mp4
        ]
        subprocess.run(cmd_mux, capture_output=True, check=True)
        print(f"  [SUCCESS] {out_mp4}")

async def main():
    print("================================================================================")
    print("RAIS AGENCIES — CRITICAL RETENTION REBUILD (ALL 30 REELS WITH DYNAMIC OPENING)")
    print("================================================================================")
    
    shared_endcard_clip = f"{BASE_WORK_DIR}/shared_clip_endcard.mp4"
    render_shared_endcard(shared_endcard_clip)
    
    for sc_id in range(1, 16):
        await process_scenario_retention(sc_id, shared_endcard_clip)
        
    print("\n================================================================================")
    print("ALL 15 SCENARIOS (30 REELS) COMPILED WITH RETENTION OPENING (0.0-6.0s MULTI-SHOT)")
    print("================================================================================")

if __name__ == "__main__":
    asyncio.run(main())
