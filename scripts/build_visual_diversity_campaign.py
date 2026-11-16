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
BASE_WORK_DIR = "public/videos/campaigns_multishot_work"
CAMPAIGN_DIR = "public/videos/campaigns"
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

import json
with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

# ============================================================
# SHARED SHOT 5: BRAND END CARD (161 frames, 16.0s - 21.36s)
# ============================================================
def render_shared_endcard(out_clip):
    if os.path.exists(out_clip):
        print(f"[REUSE] Shared End Card clip already exists: {out_clip}")
        return
        
    print("--- Rendering Shared Shot 5: RAIS Brand End Card (161 frames) ---")
    frames_dir = f"{BASE_WORK_DIR}/shared_endcard_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    width, height = 1080, 1920
    master = Image.new("RGBA", (width, height), (7, 11, 20, 255))
    draw = ImageDraw.Draw(master)
    
    # Outer gold border
    draw.rectangle([60, 100, width - 60, height - 120], outline=(212, 175, 55, 140), width=3)
    draw.rectangle([75, 115, width - 75, height - 135], outline=(212, 175, 55, 50), width=1)
    
    # Gold corner brackets
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
    
    # Central RAIS Gold Diamond Logo
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
    
    # Brand Name
    text_y = logo_y + diamond_r + 90
    draw.text((center_x + 3, text_y + 3), "RAIS AGENCIES", fill=(0, 0, 0, 240), font=f_title, anchor="mm")
    draw.text((center_x, text_y), "RAIS AGENCIES", fill=(255, 255, 255, 255), font=f_title, anchor="mm")
    
    # Categories
    sub_y = text_y + 68
    draw.text((center_x, sub_y), "FROZEN FOOD PRODUCTS & PACKAGING SUPPLIES", fill=(212, 175, 55, 255), font=f_subtitle, anchor="mm")
    
    # Location
    city_y = sub_y + 78
    draw.rounded_rectangle([center_x - 220, city_y - 32, center_x + 220, city_y + 32], radius=16, fill=(18, 26, 44, 230), outline=(212, 175, 55, 160), width=2)
    draw.text((center_x, city_y), "RAYACHOTY", fill=(255, 255, 255, 255), font=f_city, anchor="mm")
    
    # Divider
    div_y = city_y + 95
    draw.line([(center_x - 300, div_y), (center_x + 300, div_y)], fill=(212, 175, 55, 100), width=2)
    
    # Enquiry Prompt
    q_y = div_y + 80
    draw.text((center_x, q_y), "Food Business or Personal Enquiry?", fill=(226, 232, 240, 255), font=f_question, anchor="mm")
    
    # CTA Box
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
    print(f"Shared End Card rendered: {out_clip}")

# ============================================================
# SHOT 1: DEDICATED ENVIRONMENT HOOK (96 frames, 0.0s - 3.2s)
# ============================================================
def render_shot_1_hook(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot1_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    char_path = sc["character"]
    base_img = Image.open(char_path).convert("RGBA")
    bw, bh = base_img.size
    
    # Environment macro crop
    # Crop the most scenic atmospheric part of the background
    if sc_id in [1, 10]:
        # Monsoon / Balcony: crop the rain window / balcony exterior
        hook_base = base_img.crop((int(bw * 0.45), 0, bw, bh)).resize((1080, 1920), Image.Resampling.LANCZOS)
    elif sc_id in [2, 11]:
        # Midnight / Cinema: crop the illuminated room interior
        hook_base = base_img.crop((0, 0, int(bw * 0.65), bh)).resize((1080, 1920), Image.Resampling.LANCZOS)
    elif sc_id in [6, 14]:
        # Commercial QSR: crop commercial kitchen equipment
        hook_base = base_img.crop((int(bw * 0.35), 0, bw, bh)).resize((1080, 1920), Image.Resampling.LANCZOS)
    else:
        # Default scenic wide crop
        hook_base = base_img.resize((1080, 1920), Image.Resampling.LANCZOS)
        
    random.seed(500 + sc_id)
    is_rain = (sc.get("char_motion") == "blink_and_rain")
    
    drops = []
    if is_rain:
        for _ in range(120):
            drops.append({
                'x': random.uniform(50, 1030),
                'y': random.uniform(0, 1920),
                'speed': random.uniform(28, 44),
                'length': random.uniform(40, 75),
                'alpha': random.randint(140, 230),
                'width': random.choice([2, 2, 3])
            })
            
    hw, hh = hook_base.size
    for f in range(96):
        zoom = 1.0 + 0.08 * (f / 96.0)
        crop_w = int(1080 / zoom)
        crop_h = int(1920 / zoom)
        cx = (hw - crop_w) // 2
        cy = (hh - crop_h) // 2
        canvas = hook_base.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        if is_rain:
            rain_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
            r_draw = ImageDraw.Draw(rain_layer)
            for d in drops:
                d['y'] += d['speed']
                if d['y'] > 1920:
                    d['y'] = random.uniform(-80, 0)
                    d['x'] = random.uniform(50, 1030)
                x1, y1 = d['x'], d['y']
                y2 = y1 + d['length']
                r_draw.line([(x1, y1), (x1, y2)], fill=(225, 240, 255, d['alpha']), width=d['width'])
            canvas = Image.alpha_composite(canvas, rain_layer)
            
        vignette = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(vignette)
        for y in range(1500, 1920):
            v_a = int(130 * ((y - 1500) / 420.0))
            v_draw.line([(0, y), (1080, y)], fill=(0, 0, 0, v_a))
        canvas = Image.alpha_composite(canvas, vignette)
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
# SHOT 2: CHARACTER REACTION (114 frames, 3.2s - 7.0s)
# ============================================================
def render_shot_2_character(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot2_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    char_path = sc["character"]
    base_img = Image.open(char_path).convert("RGBA")
    
    # Seamless background blur
    bg_master = base_img.resize((1080, 1920), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(radius=32))
    dimmer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 80))
    bg_blurred = Image.alpha_composite(bg_master, dimmer)
    
    # Subtle vignette
    vignette = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for y in range(1450, 1920):
        v_a = int(120 * ((y - 1450) / 470.0))
        v_draw.line([(0, y), (1080, y)], fill=(0, 0, 0, v_a))
    bg_blurred = Image.alpha_composite(bg_blurred, vignette)
    
    # Pre-scale character
    bw, bh = base_img.size
    fit_scale = 1920.0 / bh
    fit_w = int(bw * fit_scale)
    fit_h = 1920
    char_master = base_img.resize((fit_w, fit_h), Image.Resampling.LANCZOS)
    
    for f in range(114):
        cam_zoom = 1.0 + 0.04 * (f / 114.0)
        cur_w = int(fit_w * cam_zoom)
        cur_h = int(fit_h * cam_zoom)
        char_scaled = char_master.resize((cur_w, cur_h), Image.Resampling.BILINEAR)
        
        breathe_y = int(3.5 * math.sin(2 * math.pi * f / 57.0))
        head_x = int(3.0 * math.sin(2 * math.pi * f / 114.0))
        head_y = int(1.5 * math.cos(2 * math.pi * f / 114.0))
        
        canvas = bg_blurred.copy()
        base_x = (1080 - cur_w) // 2 + head_x
        base_y = (1920 - cur_h) // 2 + breathe_y + head_y
        canvas.paste(char_scaled, (base_x, base_y))
        
        # Subtle lighting warmth
        light_warmth = int(6 * math.sin(2 * math.pi * f / 57.0))
        if light_warmth > 0:
            canvas = Image.alpha_composite(canvas, Image.new("RGBA", (1080, 1920), (255, 210, 140, light_warmth)))
            
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
# SHOT 3: HERO PRODUCT REVEAL (135 frames, 7.0s - 11.5s)
# ============================================================
def render_shot_3_hero_food(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot3_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    sku1 = sc["sku1"]
    prod_path = sku1["asset"]
    base_prod = Image.open(prod_path).convert("RGBA")
    bw, bh = base_prod.size
    
    max_scale = max(1080.0 * 1.06 / bw, 1920.0 * 1.06 / bh)
    scaled_master = base_prod.resize((int(bw * max_scale), int(bh * max_scale)), Image.Resampling.LANCZOS)
    mw, mh = scaled_master.size
    
    # Pre-render luxury floating product badge
    badge = Image.new("RGBA", (840, 140), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge)
    b_draw.rounded_rectangle([0, 0, 840, 140], radius=20, fill=(10, 15, 26, 235), outline=(212, 175, 55, 230), width=2)
    f_badge_sub = ImageFont.truetype(FONT_BOLD, 22)
    f_badge_main = ImageFont.truetype(FONT_BOLD, 32)
    b_draw.text((420, 38), f"{sku1['brand'].upper()} • {sku1['pack'].upper()} • {sku1['code']}", fill=(212, 175, 55), font=f_badge_sub, anchor="mm")
    b_draw.text((420, 88), sku1["name"].upper(), fill=(255, 255, 255), font=f_badge_main, anchor="mm")
    
    # Steam simulation
    random.seed(200 + sc_id)
    particles = []
    for _ in range(70):
        particles.append({
            'x': random.uniform(340, 740),
            'y': random.uniform(550, 1200),
            'radius': random.uniform(18, 34),
            'speed_y': random.uniform(3.2, 5.5),
            'drift_phase': random.uniform(0, math.pi * 2),
            'alpha_max': random.uniform(0.20, 0.36),
            'life': random.uniform(0.0, 1.0)
        })
        
    for f in range(135):
        zoom = 1.0 + 0.05 * (f / 135.0)
        crop_w = int(1080 / (zoom / 1.05))
        crop_h = int(1920 / (zoom / 1.05))
        cx = (mw - crop_w) // 2
        cy = (mh - crop_h) // 2
        canvas = scaled_master.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        # Steam layer
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
                p['x'] = random.uniform(340, 740)
                cur_a = 0
            if cur_a > 0:
                r = p['radius']
                s_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(245, 248, 255, cur_a))
                
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=18))
        canvas = Image.alpha_composite(canvas, steam_layer)
        
        # Vignette & Floating Badge
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
# SHOT 4: IN-CONTEXT FOOD & PACKAGING (135 frames, 11.5s - 16.0s)
# ============================================================
def render_shot_4_packaging(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot4_frames"
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
    d2.text((225, 40), "AUTHENTIC PACKAGING", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    pw, ph = pair_img.size
    p_fit = pair_img.resize((370, int(ph * (370 / pw))), Image.Resampling.LANCZOS)
    p_mask = Image.new("L", p_fit.size, 0)
    ImageDraw.Draw(p_mask).rounded_rectangle([0, 0, p_fit.width, p_fit.height], radius=16, fill=255)
    card2.paste(p_fit, (40, 100), p_mask)
    d2.text((225, 500), sku2.get("paired_name", "Kraft Packaging")[:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d2.text((225, 530), f"SKU: {sku2.get('paired_code', 'RAIS-BOX-02')}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    # Background preview
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
# AUDIO ENGINE & SYNC
# ============================================================
async def generate_scenario_audio(sc_id, sc, work_dir):
    import edge_tts
    audio_dir = f"{work_dir}/audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    # Generate speech
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
        t_delays = [200, 4400, 9800, 14300] if lang == "hi" else [200, 5000, 9400, 14300]
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
        
    # BGM bed
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
# PROCESS SINGLE SCENARIO ROLLOUT
# ============================================================
async def process_scenario_multishot(sc_id, shared_endcard_clip):
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
    
    clip1 = f"{work_dir}/shot1.mp4"
    clip2 = f"{work_dir}/shot2.mp4"
    clip3 = f"{work_dir}/shot3.mp4"
    clip4 = f"{work_dir}/shot4.mp4"
    clip5 = shared_endcard_clip
    
    render_shot_1_hook(sc_id, sc, work_dir, clip1)
    render_shot_2_character(sc_id, sc, work_dir, clip2)
    render_shot_3_hero_food(sc_id, sc, work_dir, clip3)
    render_shot_4_packaging(sc_id, sc, work_dir, clip4)
    
    # Merge video shots
    concat_list = f"{work_dir}/concat_shots.txt"
    with open(concat_list, "w") as f:
        for p in [clip1, clip2, clip3, clip4, clip5]:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    video_merged = f"{work_dir}/video_5shots_merged.mp4"
    cmd_cat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        video_merged
    ]
    subprocess.run(cmd_cat, capture_output=True, check=True)
    
    # Generate synchronized audio
    audio_tracks = await generate_scenario_audio(sc_id, sc, work_dir)
    
    # Export final campaign videos in Hindi & Telugu
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
    print("RAIS AGENCIES — MASTER 15-SCENARIO VISUAL DIVERSITY FULL ROLLOUT (30 REELS)")
    print("================================================================================")
    os.makedirs(BASE_WORK_DIR, exist_ok=True)
    
    shared_endcard_clip = f"{BASE_WORK_DIR}/shared_clip_5_endcard.mp4"
    render_shared_endcard(shared_endcard_clip)
    
    # Process Scenarios 1 to 15
    for sc_id in range(1, 16):
        await process_scenario_multishot(sc_id, shared_endcard_clip)
        
    print("\n================================================================================")
    print("ALL 15 SCENARIOS (30 REELS) COMPILED WITH UNIQUE VISUAL WORLDS & MULTI-SHOT NARRATIVE")
    print("================================================================================")

if __name__ == "__main__":
    asyncio.run(main())
