import os
import sys
import math
import random
import shutil
import asyncio
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
BASE_WORK_DIR = "public/videos/campaigns_clean_work"
CAMPAIGN_DIR = "public/videos/campaigns"

import json
with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

# ============================================================
# SHOT 1: ENHANCED SEAMLESS CINEMATIC CHARACTER (ZERO SUBTITLES)
# ============================================================
def render_character_shot_clean(sc_id, sc, work_dir, out_clip):
    char_path = sc["character"]
    base_img = Image.open(char_path).convert("RGBA")
    base_arr = np.array(base_img, dtype=np.float32)
    
    frames_dir = f"{work_dir}/shot1_clean_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    # 1. Pre-render seamless vertical blurred background once
    bg_master = base_img.resize((1080, 1920), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(radius=32))
    dimmer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 85))
    bg_blurred = Image.alpha_composite(bg_master, dimmer)
    
    # Subtle bottom vignette
    vignette = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for y in range(1450, 1920):
        v_a = int(120 * ((y - 1450) / 470.0))
        v_draw.line([(0, y), (1080, y)], fill=(0, 0, 0, v_a))
    bg_blurred = Image.alpha_composite(bg_blurred, vignette)
    
    has_rain = (sc.get("char_motion") == "blink_and_rain")
    drops = []
    if has_rain:
        random.seed(42 + sc_id)
        for _ in range(160):
            drops.append({
                'x': random.uniform(620, 1080),
                'y': random.uniform(0, 1920),
                'speed': random.uniform(32, 46),
                'length': random.uniform(35, 65),
                'alpha': random.randint(120, 210),
                'width': random.choice([1, 2, 2, 3])
            })
            
    for f in range(144):
        # Eyelid blink at frames 46..52 and 112..118
        prog = 0.0
        if 46 <= f <= 52:
            prog = math.sin((f - 46) / 6.0 * math.pi)
        elif 112 <= f <= 118:
            prog = math.sin((f - 112) / 6.0 * math.pi)
            
        cam_zoom = 1.0 + 0.04 * (f / 144.0)
        cur_w = int(1520 * cam_zoom)
        cur_h = int(1520 * cam_zoom)
        
        if prog > 0.02:
            warped_arr = base_arr.copy()
            for x in range(374, 466):
                norm_x = (x - 420) / 46.0
                if abs(norm_x) < 1.0:
                    weight_x = math.cos(norm_x * (math.pi / 2.0)) ** 1.5
                    y_bot = int(354 - 8 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    y_top = int(308 + 5 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    cur_travel = int(prog * (y_bot - y_top) * 1.1)
                    col_src = base_arr[285:y_top + 4, x:x+1, :]
                    src_h = col_src.shape[0]
                    dst_h = src_h + cur_travel
                    im_col = Image.fromarray(col_src.astype(np.uint8))
                    im_res = im_col.resize((1, dst_h), Image.Resampling.BILINEAR)
                    col_res = np.array(im_res, dtype=np.float32)
                    dest_slice = base_arr[285:285 + dst_h, x:x+1, :]
                    warped_arr[285:285 + dst_h, x:x+1, :] = col_res * weight_x + dest_slice * (1.0 - weight_x)
                    
            for x in range(500, 572):
                norm_x = (x - 536) / 36.0
                if abs(norm_x) < 1.0:
                    weight_x = math.cos(norm_x * (math.pi / 2.0)) ** 1.5
                    y_bot = int(357 - 6 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    y_top = int(314 + 4 * (1.0 - math.sqrt(max(0.0, 1.0 - norm_x**2))))
                    cur_travel = int(prog * (y_bot - y_top) * 1.1)
                    col_src = base_arr[290:y_top + 4, x:x+1, :]
                    src_h = col_src.shape[0]
                    dst_h = src_h + cur_travel
                    im_col = Image.fromarray(col_src.astype(np.uint8))
                    im_res = im_col.resize((1, dst_h), Image.Resampling.BILINEAR)
                    col_res = np.array(im_res, dtype=np.float32)
                    dest_slice = base_arr[290:290 + dst_h, x:x+1, :]
                    warped_arr[290:290 + dst_h, x:x+1, :] = col_res * weight_x + dest_slice * (1.0 - weight_x)
            char_frame = Image.fromarray(np.clip(warped_arr, 0, 255).astype(np.uint8))
        else:
            char_frame = base_img
            
        char_scaled = char_frame.resize((cur_w, cur_h), Image.Resampling.BILINEAR)
        
        breathe_y = int(4.0 * math.sin(2 * math.pi * f / 72.0))
        head_x = int(4.0 * math.sin(2 * math.pi * f / 144.0))
        head_y = int(2.0 * math.cos(2 * math.pi * f / 144.0))
        
        canvas = bg_blurred.copy()
        base_x = int(-220 - (cur_w - 1520) / 2) + head_x
        base_y = int(180 - (cur_h - 1520) / 2) + breathe_y + head_y
        canvas.paste(char_scaled, (base_x, base_y))
        
        if has_rain:
            rain_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
            r_draw = ImageDraw.Draw(rain_layer)
            wind_slant = 5
            for d in drops:
                d['y'] += d['speed']
                d['x'] -= (d['speed'] / 35.0) * wind_slant
                if d['y'] > 1920:
                    d['y'] = random.uniform(-60, 0)
                    d['x'] = random.uniform(620, 1120)
                if d['x'] < 620:
                    d['x'] = 1080 + random.uniform(0, 40)
                x1, y1 = d['x'], d['y']
                x2 = x1 - (d['length'] / 35.0) * wind_slant
                y2 = y1 + d['length']
                r_draw.line([(x1, y1), (x2, y2)], fill=(215, 235, 255, d['alpha']), width=d['width'])
            canvas = Image.alpha_composite(canvas, rain_layer)
            
        light_warmth = int(7 * math.sin(2 * math.pi * f / 60.0))
        if light_warmth > 0:
            canvas = Image.alpha_composite(canvas, Image.new("RGBA", (1080, 1920), (255, 200, 120, light_warmth)))
            
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
# SHOT 2: OPTIMIZED APPETIZING FOOD REVEAL (ZERO SUBTITLES)
# ============================================================
def render_product1_shot_clean(sc_id, sc, work_dir, out_clip):
    prod_path = sc["sku1"]["asset"]
    base_prod = Image.open(prod_path).convert("RGBA")
    bw, bh = base_prod.size
    
    max_scale = max(1080.0 * 1.06 / bw, 1920.0 * 1.06 / bh)
    scaled_master = base_prod.resize((int(bw * max_scale), int(bh * max_scale)), Image.Resampling.LANCZOS)
    mw, mh = scaled_master.size
    
    random.seed(100 + sc_id)
    particles = []
    for _ in range(70):
        particles.append({
            'x': random.uniform(320, 760),
            'y': random.uniform(500, 1150),
            'radius': random.uniform(18, 32),
            'speed_y': random.uniform(3.0, 5.2),
            'drift_phase': random.uniform(0, math.pi * 2),
            'alpha_max': random.uniform(0.20, 0.38),
            'life': random.uniform(0.0, 1.0)
        })
        
    frames_dir = f"{work_dir}/shot2_clean_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    vignette = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for y in range(1500, 1920):
        v_a = int(140 * ((y - 1500) / 420.0))
        v_draw.line([(0, y), (1080, y)], fill=(0, 0, 0, v_a))
        
    for f in range(138):
        zoom = 1.0 + 0.05 * (f / 138.0)
        crop_w = int(1080 / (zoom / 1.05))
        crop_h = int(1920 / (zoom / 1.05))
        cx = (mw - crop_w) // 2
        cy = (mh - crop_h) // 2
        canvas = scaled_master.crop((cx, cy, cx + crop_w, cy + crop_h)).resize((1080, 1920), Image.Resampling.BILINEAR)
        
        # Steam simulation
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
                p['y'] = random.uniform(1050, 1140)
                p['x'] = random.uniform(320, 760)
                cur_a = 0
            if cur_a > 0:
                r = p['radius']
                s_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(245, 248, 255, cur_a))
                
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=18))
        canvas = Image.alpha_composite(canvas, steam_layer)
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
# SHOT 3: OPTIMIZED DUAL PACKAGING CARDS (ZERO SUBTITLES)
# ============================================================
def render_product2_shot_clean(sc_id, sc, work_dir, out_clip):
    sku2 = sc["sku2"]
    bg_asset = sku2["asset"]
    paired_asset = sku2.get("paired_asset", "public/images/products/kraft_burger_box.jpg")
    
    bg_img = Image.open(bg_asset).convert("RGBA")
    pair_img = Image.open(paired_asset).convert("RGBA")
    bw, bh = bg_img.size
    
    font_bold = FONT_BOLD
    f_tag = ImageFont.truetype(font_bold, 20)
    f_name = ImageFont.truetype(font_bold, 24)
    
    # Pre-render Card 1: SKU 2 Pack
    card1 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(card1)
    d1.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d1.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d1.text((225, 40), f"{sku2['brand'].upper()}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    fit_w = 360
    b_fit = bg_img.resize((fit_w, int(bh * (fit_w / bw))), Image.Resampling.LANCZOS)
    b_mask = Image.new("L", b_fit.size, 0)
    ImageDraw.Draw(b_mask).rounded_rectangle([0, 0, b_fit.width, b_fit.height], radius=16, fill=255)
    card1.paste(b_fit, (45, 90), b_mask)
    d1.text((225, 500), sku2["name"][:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d1.text((225, 530), f"SKU: {sku2['code']} • {sku2['pack']}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    # Pre-render Card 2: Paired Packaging
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
    
    # Pre-render background preview and scrim once outside loop
    bg_preview = bg_img.resize((960, int(bh * (960 / bw))), Image.Resampling.LANCZOS)
    scrim = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(scrim)
    for y in range(600, 1920):
        alpha = int(220 * ((y - 600) / 1320.0))
        draw_s.line([(0, y), (1080, y)], fill=(6, 10, 18, alpha))
        
    frames_dir = f"{work_dir}/shot3_clean_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    for f in range(156):
        canvas = Image.new("RGBA", (1080, 1920), (8, 12, 20, 255))
        canvas.paste(bg_preview, (60, 120))
        canvas = Image.alpha_composite(canvas, scrim)
        
        offset_y = int(50 * (1.0 - (f / 25.0)**2)) if f < 25 else 0
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
# MASTER PROCESSOR FOR A SINGLE SCENARIO
# ============================================================
def process_clean_scenario(sc_id):
    sc = MANIFEST[str(sc_id)]
    folder = sc["folder"]
    work_dir = f"{BASE_WORK_DIR}/sc_{sc_id:02d}"
    out_dir = f"{CAMPAIGN_DIR}/{folder}"
    os.makedirs(work_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\n==========================================")
    print(f"PROCESSING CLEAN SCENARIO {sc_id:02d}: {sc['title']}")
    print(f"==========================================")
    
    clip1 = f"{work_dir}/clip1_clean.mp4"
    clip2 = f"{work_dir}/clip2_clean.mp4"
    clip3 = f"{work_dir}/clip3_clean.mp4"
    clip4 = "public/videos/campaigns_work/shared_clip_4.mp4"
    
    render_character_shot_clean(sc_id, sc, work_dir, clip1)
    render_product1_shot_clean(sc_id, sc, work_dir, clip2)
    render_product2_shot_clean(sc_id, sc, work_dir, clip3)
    
    concat_list = f"{work_dir}/concat_clean.txt"
    with open(concat_list, "w") as f:
        for p in [clip1, clip2, clip3, clip4]:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    temp_clean_video = f"{work_dir}/merged_clean.mp4"
    cmd_concat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        temp_clean_video
    ]
    subprocess.run(cmd_concat, capture_output=True, check=True)
    
    # Fast remux with copy: instantaneous audio muxing
    for lang in ["hi", "te"]:
        out_mp4 = f"{out_dir}/master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4"
        audio_src_dir = f"public/videos/campaigns_work/sc_{sc_id:02d}/audio"
        narration_wav = f"{audio_src_dir}/narration_{lang}.wav"
        bgm_wav = f"{audio_src_dir}/bgm_bed.wav"
        
        cmd_mux = [
            FFMPEG_EXE, "-y",
            "-i", temp_clean_video,
            "-i", narration_wav,
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
        print(f"[CLEAN EXPORT] {out_mp4}")

def main():
    os.makedirs(BASE_WORK_DIR, exist_ok=True)
    for sc_id in range(1, 16):
        process_clean_scenario(sc_id)
    print("\n=== ALL 30 REELS COMPILED SUBTITLE-FREE WITH ENHANCED CAMERA MOTION ===")

if __name__ == "__main__":
    main()
