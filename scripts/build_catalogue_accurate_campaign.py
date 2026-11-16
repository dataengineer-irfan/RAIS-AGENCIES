import os
import sys
import math
import random
import shutil
import asyncio
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import json

sys.stdout.reconfigure(encoding='utf-8')

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
BASE_WORK_DIR = "public/videos/campaigns_multishot_work"
CAMPAIGN_DIR = "public/videos/campaigns"
FINAL_30_DIR = "public/videos/final_30_reels"
SHARED_ENDCARD = f"{BASE_WORK_DIR}/shared_clip_endcard_official.mp4"

os.makedirs(BASE_WORK_DIR, exist_ok=True)
os.makedirs(FINAL_30_DIR, exist_ok=True)

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

# ============================================================
# SHOT 1A: IMMEDIATE VISUAL HOOK (21 frames, 0.0s - 0.7s)
# ============================================================
def render_shot_1a_hook(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot1a_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    prod_path = sc["sku1"]["asset"]
    prod_img = Image.open(prod_path).convert("RGBA")
    pw, ph = prod_img.size
    
    max_scale = max(1080.0 * 1.35 / pw, 1920.0 * 1.35 / ph)
    scaled = prod_img.resize((int(pw * max_scale), int(ph * max_scale)), Image.Resampling.LANCZOS)
    sw, sh = scaled.size
    
    random.seed(100 + sc_id)
    particles = []
    for _ in range(60):
        particles.append({
            'x': random.uniform(280, 800),
            'y': random.uniform(800, 1450),
            'radius': random.uniform(22, 44),
            'speed_y': random.uniform(6.0, 12.0),
            'speed_x': random.uniform(-2.5, 2.5),
            'alpha_max': random.uniform(0.35, 0.65),
            'life': random.uniform(0.0, 0.35)
        })
        
    for f in range(21):
        zoom = 1.0 + 0.14 * (f / 21.0)
        crop_w = int(1080 / zoom)
        crop_h = int(1920 / zoom)
        cx = (sw - crop_w) // 2
        cy = (sh - crop_h) // 2
        canvas = scaled.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        steam_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(steam_layer)
        for p in particles:
            p['life'] += 0.045
            p['y'] -= p['speed_y']
            p['x'] += p['speed_x']
            p['radius'] += 1.8
            cur_a = int(255 * p['alpha_max'] * max(0.0, 1.0 - p['life']))
            if cur_a > 0:
                r = p['radius']
                s_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(245, 250, 255, cur_a))
                
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=20))
        canvas = Image.alpha_composite(canvas, steam_layer)
        
        if f < 4:
            flash_a = int(70 * (1.0 - f / 4.0))
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
# SHOT 1B: CHARACTER REACTION (87 frames, 0.7s - 3.6s)
# Total Shot 1 = 108 frames (0.0s - 3.6s)
# ============================================================
def render_shot_1b_character(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot1b_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    char_img = Image.open(sc["character"]).convert("RGBA")
    cw, ch = char_img.size
    fit_scale = 1920.0 / ch
    fit_w = int(cw * fit_scale)
    fit_h = 1920
    char_master = char_img.resize((fit_w, fit_h), Image.Resampling.LANCZOS)
    
    # Background plate with cinematic depth-of-field blur
    bg_master = char_img.resize((1080, 1920), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(radius=28))
    dimmer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 70))
    bg_blurred = Image.alpha_composite(bg_master, dimmer)
    
    is_rain = (sc_id in [1, 10])
    random.seed(200 + sc_id)
    particles = []
    if is_rain:
        for _ in range(120):
            particles.append({
                'x': random.uniform(10, 1070),
                'y': random.uniform(0, 1920),
                'speed': random.uniform(36, 54),
                'length': random.uniform(55, 95),
                'alpha': random.randint(160, 235),
                'width': random.choice([2, 3])
            })
    else:
        # Floating golden ambient bokeh particles
        for _ in range(45):
            particles.append({
                'x': random.uniform(40, 1040),
                'y': random.uniform(250, 1800),
                'radius': random.uniform(8, 24),
                'speed_y': random.uniform(1.2, 2.8),
                'speed_x': random.uniform(-0.8, 0.8),
                'alpha': random.randint(40, 90)
            })
            
    for f in range(75):
        progress = f / 74.0
        
        # 1. Smooth Cinematic Camera Push-In (1.00 -> 1.05)
        cam_zoom = 1.0 + 0.05 * progress
        
        # 2. Camera Pedestal Glide (soft upward framing toward character's eyes/expression)
        pedestal_y = int(-16.0 * progress)
        
        # 3. Organic micro-breathing (subtle 2.5px vertical float, zero distortion)
        micro_float = int(2.5 * math.sin(2 * math.pi * f / 40.0))
        
        cur_w = int(fit_w * cam_zoom)
        cur_h = int(fit_h * cam_zoom)
        char_frame = char_master.resize((cur_w, cur_h), Image.Resampling.BILINEAR)
        
        canvas = bg_blurred.copy()
        base_x = (1080 - cur_w) // 2
        base_y = (1920 - cur_h) // 2 + pedestal_y + micro_float
        canvas.paste(char_frame, (base_x, base_y), char_frame)
        
        # 4. Cinematic Atmospheric Particles
        part_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        p_draw = ImageDraw.Draw(part_layer)
        if is_rain:
            for d in particles:
                d['y'] += d['speed']
                if d['y'] > 1920:
                    d['y'] = random.uniform(-90, 0)
                    d['x'] = random.uniform(10, 1070)
                p_draw.line([(d['x'], d['y']), (d['x'], d['y'] + d['length'])], fill=(225, 245, 255, d['alpha']), width=d['width'])
        else:
            for p in particles:
                p['y'] -= p['speed_y']
                p['x'] += p['speed_x']
                if p['y'] < 150:
                    p['y'] = random.uniform(1700, 1850)
                    p['x'] = random.uniform(40, 1040)
                r = p['radius']
                p_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(255, 220, 140, p['alpha']))
                
        canvas = Image.alpha_composite(canvas, part_layer)
        
        # 5. Cinematic studio volumetric light sweep (moves smoothly across frame)
        sweep_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        sw_draw = ImageDraw.Draw(sweep_layer)
        sweep_center_x = int(-200 + progress * 1480)
        sw_draw.ellipse([sweep_center_x - 350, 200, sweep_center_x + 350, 1600], fill=(255, 225, 160, 20))
        canvas = Image.alpha_composite(canvas, sweep_layer)
        
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
# SHOT 2: HERO PRODUCT REVEAL (132 frames, 3.2s - 7.6s, 4.4 seconds)
# Exactly when Line 2 plays!
# ============================================================
def render_shot_2_hero_product(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot2_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    sku1 = sc["sku1"]
    prod_path = sku1["asset"]
    base_prod = Image.open(prod_path).convert("RGBA")
    pw, ph = base_prod.size
    
    max_scale = max(1080.0 * 1.08 / pw, 1920.0 * 1.08 / ph)
    scaled = base_prod.resize((int(pw * max_scale), int(ph * max_scale)), Image.Resampling.LANCZOS)
    sw, sh = scaled.size
    
    badge = Image.new("RGBA", (860, 140), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge)
    b_draw.rounded_rectangle([0, 0, 860, 140], radius=20, fill=(10, 15, 26, 235), outline=(212, 175, 55, 230), width=2)
    f_sub = ImageFont.truetype(FONT_BOLD, 22)
    f_main = ImageFont.truetype(FONT_BOLD, 30)
    b_draw.text((430, 38), f"{sku1['brand'].upper()} • {sku1['code'].upper()} • {sku1['pack'].upper()}", fill=(212, 175, 55), font=f_sub, anchor="mm")
    b_draw.text((430, 88), sku1["name"].upper()[:28], fill=(255, 255, 255), font=f_main, anchor="mm")
    
    random.seed(300 + sc_id)
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
        
    for f in range(132):
        zoom = 1.0 + 0.05 * (f / 132.0)
        crop_w = int(1080 / (zoom / 1.05))
        crop_h = int(1920 / (zoom / 1.05))
        cx = (sw - crop_w) // 2
        cy = (sh - crop_h) // 2
        canvas = scaled.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        steam_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(steam_layer)
        for p in particles:
            p['life'] += 0.015
            p['y'] -= p['speed_y']
            p['x'] += math.sin(p['drift_phase'] + p['life'] * 8.0) * 1.5
            p['radius'] += 0.5
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
                s_draw.ellipse([p['x'] - p['radius'], p['y'] - p['radius'], p['x'] + p['radius'], p['y'] + p['radius']], fill=(245, 248, 255, cur_a))
                
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=18))
        canvas = Image.alpha_composite(canvas, steam_layer)
        
        vignette = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(vignette)
        for y in range(1450, 1920):
            v_a = int(150 * ((y - 1450) / 470.0))
            v_draw.line([(0, y), (1080, y)], fill=(0, 0, 0, v_a))
        canvas = Image.alpha_composite(canvas, vignette)
        
        badge_y = 1620 + int(3.0 * math.sin(2 * math.pi * f / 60.0))
        canvas.paste(badge, (110, badge_y), badge)
        
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
# SHOT 3: CONTEXTUAL PAIRING (138 frames, 7.6s - 12.2s, 4.6 seconds)
# Exactly when Line 3 plays!
# ============================================================
def render_shot_3_connection(sc_id, sc, work_dir, out_clip):
    frames_dir = f"{work_dir}/shot3_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    sku2 = sc["sku2"]
    bg_asset = sku2["asset"]
    paired_asset = sku2.get("paired_asset", "public/images/products_catalogue/mealtime_veg_mayo.jpg")
    
    bg_img = Image.open(bg_asset).convert("RGBA")
    pair_img = Image.open(paired_asset).convert("RGBA")
    bw, bh = bg_img.size
    
    f_tag = ImageFont.truetype(FONT_BOLD, 20)
    f_name = ImageFont.truetype(FONT_BOLD, 22)
    
    card1 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(card1)
    d1.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d1.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d1.text((225, 40), sku2["brand"].upper()[:22], fill=(212, 175, 55), font=f_tag, anchor="mm")
    fit_w = 360
    b_fit = bg_img.resize((fit_w, int(bh * (fit_w / bw))), Image.Resampling.LANCZOS)
    b_mask = Image.new("L", b_fit.size, 0)
    ImageDraw.Draw(b_mask).rounded_rectangle([0, 0, b_fit.width, b_fit.height], radius=16, fill=255)
    card1.paste(b_fit, (45, 85), b_mask)
    d1.text((225, 495), sku2["name"][:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d1.text((225, 525), f"SKU: {sku2['code'].upper()} • {sku2['pack']}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    card2 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(card2)
    d2.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d2.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    
    # Dynamic contextual header: "GOURMET DIP & SAUCE" for consumers, "COMMERCIAL PACKAGING" for B2B
    paired_type = sku2.get("paired_type", "COMMERCIAL PACKAGING" if sc.get("is_b2b") else "GOURMET DIP & SAUCE")
    d2.text((225, 40), paired_type[:22], fill=(212, 175, 55), font=f_tag, anchor="mm")
    pw, ph = pair_img.size
    p_fit = pair_img.resize((370, int(ph * (370 / pw))), Image.Resampling.LANCZOS)
    p_mask = Image.new("L", p_fit.size, 0)
    ImageDraw.Draw(p_mask).rounded_rectangle([0, 0, p_fit.width, p_fit.height], radius=16, fill=255)
    card2.paste(p_fit, (40, 95), p_mask)
    d2.text((225, 495), sku2.get("paired_name", "Sauce / Dip")[:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    paired_brand = sku2.get("paired_brand", "rais master").upper()
    d2.text((225, 525), f"SKU: {sku2.get('paired_code', '').upper()} • {paired_brand[:12]}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    bg_preview = bg_img.resize((960, int(bh * (960 / bw))), Image.Resampling.LANCZOS)
    scrim = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(scrim)
    for y in range(600, 1920):
        alpha = int(220 * ((y - 600) / 1320.0))
        draw_s.line([(0, y), (1080, y)], fill=(6, 10, 18, alpha))
        
    for f in range(138):
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
# PROCESS ENTIRE SCENARIO WITH EXACT 18-SECOND TIMELINE SYNC
# ============================================================
async def process_scenario(sc_id):
    sc = MANIFEST[str(sc_id)]
    work_dir = f"{BASE_WORK_DIR}/sc_{sc_id:02d}"
    out_dir = f"{CAMPAIGN_DIR}/{sc['folder']}"
    os.makedirs(work_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    
    hi_18s = f"{out_dir}/master_hindi_18s.mp4"
    te_18s = f"{out_dir}/master_telugu_18s.mp4"
    if os.path.exists(hi_18s) and os.path.exists(te_18s):
        cmd_chk = [FFMPEG_EXE, "-i", hi_18s]
        chk_res = subprocess.run(cmd_chk, capture_output=True, text=True)
        if "Duration: 00:00:18" in chk_res.stderr:
            print(f"Scenario {sc_id:02d} already rendered at 18.0s! Skipping...")
            return
            
    print(f"\n=======================================================")
    print(f"PROCESSING SCENARIO {sc_id:02d} [18-SEC]: {sc['title']}")
    print(f"Hero SKU: [{sc['sku1']['code']}] {sc['sku1']['name']} ({sc['sku1']['brand']})")
    print(f"Paired SKU: [{sc['sku2']['code']}] {sc['sku2']['name']} (Type: {sc['sku2'].get('paired_type', 'Gourmet')})")
    print(f"=======================================================")
    
    c1a = f"{work_dir}/shot1a.mp4"       # 21 frames (0.0s - 0.7s)
    c1b = f"{work_dir}/shot1b.mp4"       # 75 frames (0.7s - 3.2s)
    c2 = f"{work_dir}/shot2.mp4"         # 132 frames (3.2s - 7.6s)
    c3 = f"{work_dir}/shot3.mp4"         # 138 frames (7.6s - 12.2s)
    c4 = SHARED_ENDCARD                  # 174 frames (12.2s - 18.0s)
    # Total = 21 + 75 + 132 + 138 + 174 = 540 frames = 18.00s!
    
    render_shot_1a_hook(sc_id, sc, work_dir, c1a)
    render_shot_1b_character(sc_id, sc, work_dir, c1b)
    render_shot_2_hero_product(sc_id, sc, work_dir, c2)
    render_shot_3_connection(sc_id, sc, work_dir, c3)
    
    concat_list = f"{work_dir}/concat_18s.txt"
    with open(concat_list, "w") as f:
        for p in [c1a, c1b, c2, c3, c4]:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    video_merged = f"{work_dir}/video_18s_merged.mp4"
    cmd_cat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        video_merged
    ]
    subprocess.run(cmd_cat, capture_output=True, check=True)
    
    import edge_tts
    audio_dir = f"{work_dir}/audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    total_dur = 18.00
    bgm_wav = f"{audio_dir}/bgm_bed_18s.wav"
    fade_start = 16.50
    cmd_bgm = [
        FFMPEG_EXE, "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={total_dur:.2f}:c=pink:r=44100:a=0.030,lowpass=f=750[rain];"
              f"sine=f=220:d={total_dur:.2f},volume=0.02[t1];"
              f"sine=f=330:d={total_dur:.2f},volume=0.015[t2];"
              f"sine=f=440:d={total_dur:.2f},volume=0.012[t3];"
              f"[rain][t1][t2][t3]amix=inputs=4:duration=first:dropout_transition=0:normalize=0,volume=0.09,afade=t=out:st={fade_start:.2f}:d=1.5",
        "-ac", "2", "-ar", "44100",
        bgm_wav
    ]
    subprocess.run(cmd_bgm, capture_output=True, check=True)
    
    # Exact Delays matched to 18-Second Visual Shot Cuts:
    # Line 1 (Hook): 200ms -> plays during Shot 1 (0.0s - 3.2s)
    # Line 2 (Hero Product): 3300ms -> plays during Shot 2 (3.2s - 7.6s)
    # Line 3 (Paired Item): 7700ms -> plays during Shot 3 (7.6s - 12.2s)
    # Line 4 (End Card + WhatsApp): 12200ms -> plays during Shot 4 End Card (12.2s - 18.0s)
    delays = [200, 3300, 7700, 12200]
    
    for lang, voice in [("hi", "hi-IN-SwaraNeural"), ("te", "te-IN-ShrutiNeural")]:
        texts = sc["audio_hi"] if lang == "hi" else sc["audio_te"]
        files = []
        for idx, t in enumerate(texts):
            f_out = f"{audio_dir}/narration_{lang}_{idx+1}.mp3"
            rate = "+45%" if idx == 3 else ("+28%" if lang == "hi" else "+24%")
            comm = edge_tts.Communicate(t, voice, rate=rate)
            await comm.save(f_out)
            files.append(f_out)
            
        full_wav = f"{audio_dir}/full_narration_{lang}_18s.wav"
        cmd_mix = [
            FFMPEG_EXE, "-y",
            "-i", files[0],
            "-i", files[1],
            "-i", files[2],
            "-i", files[3],
            "-filter_complex",
            f"[0:a]adelay={delays[0]}|{delays[0]}[a0];"
            f"[1:a]adelay={delays[1]}|{delays[1]}[a1];"
            f"[2:a]adelay={delays[2]}|{delays[2]}[a2];"
            f"[3:a]adelay={delays[3]}|{delays[3]}[a3];"
            "[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0",
            "-ac", "2", "-ar", "44100",
            full_wav
        ]
        subprocess.run(cmd_mix, capture_output=True, check=True)
        
        out_mp4 = f"{out_dir}/master_{'hindi' if lang=='hi' else 'telugu'}_18s.mp4"
        cmd_mux = [
            FFMPEG_EXE, "-y",
            "-i", video_merged,
            "-i", full_wav,
            "-i", bgm_wav,
            "-filter_complex",
            "[1:a]volume=1.0[voice];[2:a]volume=0.10,afade=t=out:st=16.50:d=1.5[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "copy",
            "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
            "-t", "18.00",
            out_mp4
        ]
        subprocess.run(cmd_mux, capture_output=True, check=True)
        
        clean_name = f"sc{sc_id:02d}_{'hindi' if lang=='hi' else 'telugu'}_{sc['folder'].replace('scenario_', '')}.mp4"
        clean_mp4 = f"{FINAL_30_DIR}/{clean_name}"
        shutil.copy2(out_mp4, clean_mp4)
        print(f"  [SUCCESS] {out_mp4} -> {clean_mp4}")

async def main():
    print("=" * 80)
    print("STARTING FULL 15-SCENARIO CATALOGUE-ACCURATE REBUILD (30 REELS)")
    print("=" * 80)
    for sc_id in range(1, 16):
        await process_scenario(sc_id)
    print("\n" + "=" * 80)
    print("ALL 15 SCENARIOS (30 REELS) SUCCESSFULLY RENDERED & STORED IN FINAL_30_REELS")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(main())
