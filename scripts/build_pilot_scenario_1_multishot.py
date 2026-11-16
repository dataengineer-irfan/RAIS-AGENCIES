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
FONT_REG = r"C:\Windows\Fonts\arial.ttf"
WORK_DIR = "public/videos/pilot_scenario_01_multishot_work"
OUT_DIR = "public/videos"
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"

os.makedirs(WORK_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# ============================================================
# SHOT 1: MONSOON RAIN WINDOW HOOK (0.0s - 3.2s, 96 frames)
# ============================================================
def render_shot_1(out_clip):
    print("--- Rendering Shot 1: Rain Window Macro Hook (96 frames) ---")
    frames_dir = f"{WORK_DIR}/shot1_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    # Base rain window image
    src_rain = "qc_frames/test_rain_window_hook.jpg"
    if not os.path.exists(src_rain):
        # Fallback crop from character image
        full = Image.open("public/images/character_test_scene_a_rain.jpg").convert("RGBA")
        base = full.crop((550, 0, 1024, 1024)).resize((1080, 1920), Image.Resampling.LANCZOS)
    else:
        base = Image.open(src_rain).convert("RGBA")
        
    bw, bh = base.size
    
    # Dynamic rain droplet streaks
    random.seed(42)
    drops = []
    for _ in range(120):
        drops.append({
            'x': random.uniform(50, 1030),
            'y': random.uniform(0, 1920),
            'speed': random.uniform(25, 42),
            'length': random.uniform(40, 80),
            'alpha': random.randint(140, 230),
            'width': random.choice([2, 2, 3, 4])
        })
        
    for f in range(96):
        # Cinematic macro slow zoom
        zoom = 1.0 + 0.08 * (f / 96.0)
        crop_w = int(1080 / zoom)
        crop_h = int(1920 / zoom)
        cx = (bw - crop_w) // 2
        cy = (bh - crop_h) // 2
        canvas = base.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        # Draw dynamic raindrops running down glass
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
            # Droplet bead head
            r = d['width'] + 1
            r_draw.ellipse([x1 - r, y2 - r, x1 + r, y2 + r], fill=(240, 248, 255, min(255, d['alpha'] + 40)))
            
        canvas = Image.alpha_composite(canvas, rain_layer)
        
        # Subtle vignette
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
    print(f"Shot 1 complete: {out_clip}")

# ============================================================
# SHOT 2: AYESHA CRAVING REACTION (3.2s - 7.0s, 114 frames)
# ============================================================
def render_shot_2(out_clip):
    print("--- Rendering Shot 2: Ayesha Window Craving Reaction (114 frames) ---")
    frames_dir = f"{WORK_DIR}/shot2_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    char_path = "public/images/character_test_scene_a_rain.jpg"
    base_img = Image.open(char_path).convert("RGBA")
    base_arr = np.array(base_img, dtype=np.float32)
    
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
    
    for f in range(114):
        # Eyelid blink at frames 35..41 and 88..94
        prog = 0.0
        if 35 <= f <= 41:
            prog = math.sin((f - 35) / 6.0 * math.pi)
        elif 88 <= f <= 94:
            prog = math.sin((f - 88) / 6.0 * math.pi)
            
        cam_zoom = 1.0 + 0.04 * (f / 114.0)
        cur_w = int(1520 * cam_zoom)
        cur_h = int(1520 * cam_zoom)
        
        if prog > 0.02:
            warped_arr = base_arr.copy()
            # Right eye
            for x in range(374, 466):
                norm_x = (x - 420) / 46.0
                if abs(norm_x) < 1.0:
                    weight_x = math.cos(norm_x * (math.pi / 2.0)) ** 1.5
                    y_bot = int(354 - 8 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    y_top = int(308 + 5 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    cur_travel = int(prog * (y_bot - y_top) * 1.1)
                    col_src = base_arr[285:y_top + 4, x:x+1, :]
                    dst_h = col_src.shape[0] + cur_travel
                    im_col = Image.fromarray(col_src.astype(np.uint8))
                    im_res = im_col.resize((1, dst_h), Image.Resampling.BILINEAR)
                    col_res = np.array(im_res, dtype=np.float32)
                    dest_slice = base_arr[285:285 + dst_h, x:x+1, :]
                    warped_arr[285:285 + dst_h, x:x+1, :] = col_res * weight_x + dest_slice * (1.0 - weight_x)
            # Left eye
            for x in range(500, 572):
                norm_x = (x - 536) / 36.0
                if abs(norm_x) < 1.0:
                    weight_x = math.cos(norm_x * (math.pi / 2.0)) ** 1.5
                    y_bot = int(357 - 6 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    y_top = int(314 + 4 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    cur_travel = int(prog * (y_bot - y_top) * 1.1)
                    col_src = base_arr[290:y_top + 4, x:x+1, :]
                    dst_h = col_src.shape[0] + cur_travel
                    im_col = Image.fromarray(col_src.astype(np.uint8))
                    im_res = im_col.resize((1, dst_h), Image.Resampling.BILINEAR)
                    col_res = np.array(im_res, dtype=np.float32)
                    dest_slice = base_arr[290:290 + dst_h, x:x+1, :]
                    warped_arr[290:290 + dst_h, x:x+1, :] = col_res * weight_x + dest_slice * (1.0 - weight_x)
            char_frame = Image.fromarray(np.clip(warped_arr, 0, 255).astype(np.uint8))
        else:
            char_frame = base_img
            
        char_scaled = char_frame.resize((cur_w, cur_h), Image.Resampling.BILINEAR)
        
        breathe_y = int(3.5 * math.sin(2 * math.pi * f / 57.0))
        head_x = int(3.0 * math.sin(2 * math.pi * f / 114.0))
        head_y = int(1.5 * math.cos(2 * math.pi * f / 114.0))
        
        canvas = bg_blurred.copy()
        base_x = int(-220 - (cur_w - 1520) / 2) + head_x
        base_y = int(180 - (cur_h - 1520) / 2) + breathe_y + head_y
        canvas.paste(char_scaled, (base_x, base_y))
        
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
    print(f"Shot 2 complete: {out_clip}")

# ============================================================
# SHOT 3: ITC MASTER CHEF STEAMING MOMOS REVEAL (7.0s - 11.5s, 135 frames)
# ============================================================
def render_shot_3(out_clip):
    print("--- Rendering Shot 3: Steaming Momos Reveal (135 frames) ---")
    frames_dir = f"{WORK_DIR}/shot3_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    prod_path = "public/images/products/chicken_momos.jpg"
    base_prod = Image.open(prod_path).convert("RGBA")
    bw, bh = base_prod.size
    
    max_scale = max(1080.0 * 1.06 / bw, 1920.0 * 1.06 / bh)
    scaled_master = base_prod.resize((int(bw * max_scale), int(bh * max_scale)), Image.Resampling.LANCZOS)
    mw, mh = scaled_master.size
    
    # Pre-render luxury floating product badge
    badge = Image.new("RGBA", (780, 140), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge)
    b_draw.rounded_rectangle([0, 0, 780, 140], radius=20, fill=(10, 15, 26, 235), outline=(212, 175, 55, 230), width=2)
    f_badge_sub = ImageFont.truetype(FONT_BOLD, 22)
    f_badge_main = ImageFont.truetype(FONT_BOLD, 34)
    b_draw.text((390, 38), "ITC MASTER CHEF • 500g PACK • RAIS-CHK-04", fill=(212, 175, 55), font=f_badge_sub, anchor="mm")
    b_draw.text((390, 88), "AUTHENTIC CHICKEN MOMOS", fill=(255, 255, 255), font=f_badge_main, anchor="mm")
    
    # Steam simulation
    random.seed(101)
    particles = []
    for _ in range(75):
        particles.append({
            'x': random.uniform(340, 740),
            'y': random.uniform(550, 1200),
            'radius': random.uniform(18, 34),
            'speed_y': random.uniform(3.2, 5.5),
            'drift_phase': random.uniform(0, math.pi * 2),
            'alpha_max': random.uniform(0.22, 0.38),
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
        canvas.paste(badge, (150, badge_y), badge)
        
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
    print(f"Shot 3 complete: {out_clip}")

# ============================================================
# SHOT 4: CRISPY FRIES + KRAFT PACKAGING (11.5s - 16.0s, 135 frames)
# ============================================================
def render_shot_4(out_clip):
    print("--- Rendering Shot 4: Crispy Fries & Kraft Takeaway Box (135 frames) ---")
    frames_dir = f"{WORK_DIR}/shot4_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    bg_asset = "public/images/products/itc_french_fries.webp"
    paired_asset = "public/images/products/kraft_burger_box.jpg"
    
    bg_img = Image.open(bg_asset).convert("RGBA")
    pair_img = Image.open(paired_asset).convert("RGBA")
    bw, bh = bg_img.size
    
    f_tag = ImageFont.truetype(FONT_BOLD, 20)
    f_name = ImageFont.truetype(FONT_BOLD, 24)
    
    # Pre-render Card 1: Fries Pack
    card1 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(card1)
    d1.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d1.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d1.text((225, 40), "ITC MASTER CHEF", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    fit_w = 360
    b_fit = bg_img.resize((fit_w, int(bh * (fit_w / bw))), Image.Resampling.LANCZOS)
    b_mask = Image.new("L", b_fit.size, 0)
    ImageDraw.Draw(b_mask).rounded_rectangle([0, 0, b_fit.width, b_fit.height], radius=16, fill=255)
    card1.paste(b_fit, (45, 90), b_mask)
    d1.text((225, 500), "Crispy French Fries", fill=(255, 255, 255), font=f_name, anchor="mm")
    d1.text((225, 530), "SKU: RAIS-VEG-01 • 2.5kg", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    # Pre-render Card 2: Kraft Clamshell Box
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
    d2.text((225, 500), "Kraft Burger Box 4\"x4\"", fill=(255, 255, 255), font=f_name, anchor="mm")
    d2.text((225, 530), "SKU: RAIS-BOX-02", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    # Background fries preview
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
    print(f"Shot 4 complete: {out_clip}")

# ============================================================
# SHOT 5: RAIS AGENCIES BRAND END CARD (16.0s - 21.36s, 161 frames)
# ============================================================
def render_shot_5(out_clip):
    print("--- Rendering Shot 5: Mobile-First Brand End Card (161 frames) ---")
    frames_dir = f"{WORK_DIR}/shot5_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    # Create master end card canvas
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
    
    # Master CTA Button Box
    btn_y = q_y + 75
    btn_w = 820
    btn_h = 130
    btn_box = [(center_x - btn_w // 2, btn_y), (center_x + btn_w // 2, btn_y + btn_h)]
    
    # WhatsApp Box
    wa_y = btn_y + btn_h + 40
    wa_h = 100
    wa_box = [(center_x - btn_w // 2, wa_y), (center_x + btn_w // 2, wa_y + wa_h)]
    
    # Render frames with subtle pulse glow on WhatsApp CTA
    for f in range(161):
        canvas = master.copy()
        c_draw = ImageDraw.Draw(canvas)
        
        # Instagram CTA Button
        c_draw.rounded_rectangle(btn_box, radius=24, fill=(180, 40, 90, 255), outline=(212, 175, 55, 240), width=3)
        c_draw.text((center_x, btn_y + btn_h // 2), "DM on Instagram: @raisagencies", fill=(255, 255, 255, 255), font=f_cta_btn, anchor="mm")
        
        # WhatsApp CTA Button with pulsing gold border
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
    print(f"Shot 5 complete: {out_clip}")

# ============================================================
# MASTER MULTI-SHOT COMPILER
# ============================================================
async def main():
    print("============================================================")
    print("RAIS AGENCIES — SCENARIO 1 MULTI-SHOT PILOT RENDERER")
    print("============================================================")
    
    clip1 = f"{WORK_DIR}/shot1.mp4"
    clip2 = f"{WORK_DIR}/shot2.mp4"
    clip3 = f"{WORK_DIR}/shot3.mp4"
    clip4 = f"{WORK_DIR}/shot4.mp4"
    clip5 = f"{WORK_DIR}/shot5.mp4"
    
    render_shot_1(clip1)
    render_shot_2(clip2)
    render_shot_3(clip3)
    render_shot_4(clip4)
    render_shot_5(clip5)
    
    # Concat 5 shots
    concat_list = f"{WORK_DIR}/concat_shots.txt"
    with open(concat_list, "w") as f:
        for p in [clip1, clip2, clip3, clip4, clip5]:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    video_merged = f"{WORK_DIR}/video_5shots_merged.mp4"
    cmd_cat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        video_merged
    ]
    subprocess.run(cmd_cat, capture_output=True, check=True)
    print(f"[VIDEO MERGE COMPLETE] {video_merged}")
    
    # Generate calibrated Narration Audio for Hindi and Telugu
    import edge_tts
    
    audio_dir = f"{WORK_DIR}/audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    # 1. Hindi Narration
    texts_hi = [
        "बारिश का मौसम और कुछ गरमा-गरम क्रिस्पी खाने का मन?",
        "ट्राई कीजिए ITC Master Chef Chicken Momos — रेस्टोरेंट जैसा टेस्ट!",
        "गोल्डन क्रिस्पी French Fries और Kraft पैकेजिंग बॉक्सेस!",
        "इन्क्वायरी और होलसेल सप्लाई के लिए, Instagram पर DM करें — RAIS Agencies, रायचोटी!"
    ]
    files_hi = []
    for idx, t in enumerate(texts_hi):
        f_out = f"{audio_dir}/narration_hi_{idx+1}.mp3"
        comm = edge_tts.Communicate(t, "hi-IN-SwaraNeural", rate="+20%")
        await comm.save(f_out)
        files_hi.append(f_out)
        
    # Hindi audio alignment (t1=0.2s, t2=4.4s, t3=9.8s, t4=14.3s)
    narration_hi_wav = f"{audio_dir}/full_narration_hi.wav"
    cmd_hi_mix = [
        FFMPEG_EXE, "-y",
        "-i", files_hi[0],
        "-i", files_hi[1],
        "-i", files_hi[2],
        "-i", files_hi[3],
        "-filter_complex",
        "[0:a]adelay=200|200[a0];"
        "[1:a]adelay=4400|4400[a1];"
        "[2:a]adelay=9800|9800[a2];"
        "[3:a]adelay=14300|14300[a3];"
        "[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0",
        "-ac", "2", "-ar", "44100",
        narration_hi_wav
    ]
    subprocess.run(cmd_hi_mix, capture_output=True, check=True)
    
    # 2. Telugu Narration
    texts_te = [
        "బయట చల్లని వర్షం... వేడి వేడిగా, క్రిస్పీగా ఏదైనా తినాలనిపిస్తుందా?",
        "ట్రై చేయండి రుచికరమైన ITC Master Chef Chicken Momos!",
        "గోల్డెన్ క్రిస్పీ French Fries మరియు Kraft ప్యాకేజింగ్ బాక్సెస్!",
        "హోల్‌సేల్ సప్లై కోసం Instagram లో DM చేయండి — RAIS Agencies, రాయచోటి!"
    ]
    files_te = []
    for idx, t in enumerate(texts_te):
        f_out = f"{audio_dir}/narration_te_{idx+1}.mp3"
        comm = edge_tts.Communicate(t, "te-IN-ShrutiNeural", rate="+14%")
        await comm.save(f_out)
        files_te.append(f_out)
        
    # Telugu audio alignment (t1=0.2s, t2=5.0s, t3=9.4s, t4=14.3s)
    narration_te_wav = f"{audio_dir}/full_narration_te.wav"
    cmd_te_mix = [
        FFMPEG_EXE, "-y",
        "-i", files_te[0],
        "-i", files_te[1],
        "-i", files_te[2],
        "-i", files_te[3],
        "-filter_complex",
        "[0:a]adelay=200|200[a0];"
        "[1:a]adelay=5000|5000[a1];"
        "[2:a]adelay=9400|9400[a2];"
        "[3:a]adelay=14300|14300[a3];"
        "[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0",
        "-ac", "2", "-ar", "44100",
        narration_te_wav
    ]
    subprocess.run(cmd_te_mix, capture_output=True, check=True)
    
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
    
    # Export Final Pilot MP4s
    out_hi = f"{OUT_DIR}/pilot_scenario_01_hi_multishot.mp4"
    out_te = f"{OUT_DIR}/pilot_scenario_01_te_multishot.mp4"
    
    for lang, n_wav, out_p in [("Hindi", narration_hi_wav, out_hi), ("Telugu", narration_te_wav, out_te)]:
        cmd_final = [
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
            out_p
        ]
        subprocess.run(cmd_final, capture_output=True, check=True)
        print(f"[EXPORT COMPLETE] {lang} Pilot: {out_p}")
        
        # Copy to brain artifact directory
        dest_art = os.path.join(ARTIFACT_DIR, os.path.basename(out_p))
        shutil.copy2(out_p, dest_art)
        print(f"[ARTIFACT SAVED] {dest_art}")

    print("\n============================================================")
    print("SCENARIO 1 MULTI-SHOT PILOT BUILD COMPLETED SUCCESSFULLY")
    print("============================================================")

if __name__ == "__main__":
    asyncio.run(main())
