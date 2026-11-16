import os
import math
import random
import subprocess
import asyncio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_PATH = r"C:\Windows\Fonts\Nirmala.ttc"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
WORK_DIR = "public/videos/pilot_scenario_01_work"

# ============================================================
# 1. AUDIO & NARRATION GENERATOR
# ============================================================
async def generate_narration():
    import edge_tts
    os.makedirs(f"{WORK_DIR}/audio", exist_ok=True)
    
    shots_hi = [
        (1, "बारिश का मौसम और कुछ गरमा-गरम क्रिस्पी खाने का मन?", "+8%"),
        (2, "ट्राई कीजिए ITC Master Chef Chicken Momos — रेस्टोरेंट जैसा ऑथेंटिक टेस्ट!", "+10%"),
        (3, "साथ में क्रिस्पी French Fries और प्रीमियम Kraft टेकअवे पैकेजिंग!", "+10%"),
        (4, "होलसेल सप्लाई और ऑर्डर्स के लिए, Instagram पर DM करें — RAIS Agencies, रायचोटी!", "+10%")
    ]
    
    shot_audio_files = []
    for sc_id, text, rate in shots_hi:
        out_f = f"{WORK_DIR}/audio/shot_{sc_id}.mp3"
        comm = edge_tts.Communicate(text, "hi-IN-SwaraNeural", rate=rate)
        await comm.save(out_f)
        shot_audio_files.append(out_f)
        print(f"[AUDIO] Generated narration shot {sc_id}: {out_f}")
        
    # Generate full concatenated speech with timing gaps
    # Shot durations: 4.80s, 4.60s, 5.20s, 6.76s
    full_narration_wav = f"{WORK_DIR}/audio/full_narration.wav"
    
    # Filter complex to pad and align each shot audio exactly to shot boundaries
    cmd = [
        FFMPEG_EXE, "-y",
        "-i", shot_audio_files[0],
        "-i", shot_audio_files[1],
        "-i", shot_audio_files[2],
        "-i", shot_audio_files[3],
        "-filter_complex",
        "[0:a]adelay=300|300[a0];"
        "[1:a]adelay=4900|4900[a1];"
        "[2:a]adelay=9600|9600[a2];"
        "[3:a]adelay=14900|14900[a3];"
        "[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0",
        "-ac", "2", "-ar", "44100",
        full_narration_wav
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"[AUDIO] Full synchronized narration aligned: {full_narration_wav}")
    
    # Generate acoustic bgm + rain bed with 2-second smooth fadeout
    total_dur = 21.36
    bgm_wav = f"{WORK_DIR}/audio/bgm_bed.wav"
    fade_start = total_dur - 2.0
    cmd_bgm = [
        FFMPEG_EXE, "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={total_dur:.2f}:c=pink:r=44100:a=0.035,lowpass=f=750[rain];"
              f"sine=f=220:d={total_dur:.2f},volume=0.025[t1];"
              f"sine=f=330:d={total_dur:.2f},volume=0.02[t2];"
              f"sine=f=440:d={total_dur:.2f},volume=0.015[t3];"
              f"[rain][t1][t2][t3]amix=inputs=4:duration=first:dropout_transition=2,volume=0.15,afade=t=out:st={fade_start:.2f}:d=2.0",
        "-ac", "2", "-ar", "44100",
        bgm_wav
    ]
    subprocess.run(cmd_bgm, capture_output=True, check=True)
    print(f"[AUDIO] Audio bed with 2s fadeout generated: {bgm_wav}")
    return full_narration_wav, bgm_wav

# ============================================================
# 2. OVERLAY GRAPHICS GENERATOR (Lower-Third Subtitles)
# ============================================================
def create_shot_overlay(badge, primary_hi, sub_en, catalogue_sku=None):
    overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Top branded header pill
    f_top = ImageFont.truetype(FONT_PATH, 24)
    draw.rounded_rectangle([180, 80, 900, 140], radius=28, fill=(10, 15, 26, 220), outline=(212, 175, 55, 220), width=2)
    draw.text((540, 110), "RAIS AGENCIES • RAYACHOTY • WHOLESALE", font=f_top, fill=(212, 175, 55), anchor="mm")
    
    # Lower-third container
    cy1, cy2 = 1420, 1750
    draw.rounded_rectangle([50, cy1, 1030, cy2], radius=24, fill=(8, 12, 22, 235), outline=(212, 175, 55, 220), width=3)
    draw.line([(80, cy1 + 60), (1000, cy1 + 60)], fill=(212, 175, 55, 120), width=1)
    
    # Badge tag
    f_badge = ImageFont.truetype(FONT_PATH, 22)
    badge_label = badge if not catalogue_sku else f"{badge}  |  {catalogue_sku}"
    draw.text((540, cy1 + 30), badge_label, font=f_badge, fill=(212, 175, 55), anchor="mm")
    
    # Primary subtitle (Hindi)
    f_hi = ImageFont.truetype(FONT_PATH, 30)
    # drop shadow
    draw.text((542, cy1 + 107), primary_hi, font=f_hi, fill=(0, 0, 0, 240), anchor="mm")
    draw.text((540, cy1 + 105), primary_hi, font=f_hi, fill=(255, 255, 255, 255), anchor="mm")
    
    # Secondary subtitle (English)
    f_en = ImageFont.truetype(FONT_PATH, 24)
    draw.text((540, cy1 + 165), sub_en, font=f_en, fill=(229, 192, 123, 255), anchor="mm")
    
    return overlay

# ============================================================
# 3. SCENE 1: CHARACTER ANIMATION & MONSOON RAIN (4.80s, 144 frames)
# ============================================================
def render_scene_1(out_clip_path):
    print("[SCENE 1] Rendering Ayesha character animation & dynamic monsoon rain (144 frames)...")
    base_img = Image.open("public/images/character_test_scene_a_rain.jpg").convert("RGBA")
    
    # In 1080x1920: scale base (1024x1024) to fill top/mid with window on right
    # Scale factor 1.45: 1485 x 1485
    scaled_w, scaled_h = 1485, 1485
    base_scaled = base_img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    
    # Rain particle simulator on the window area
    random.seed(42)
    num_drops = 160
    drops = []
    for _ in range(num_drops):
        drops.append({
            'x': random.uniform(620, 1080),
            'y': random.uniform(0, 1920),
            'speed': random.uniform(32, 46),
            'length': random.uniform(35, 65),
            'alpha': random.randint(120, 210),
            'width': random.choice([1, 2, 2, 3])
        })
        
    overlay = Image.open("public/images/overlays/overlay_shot_1.png").convert("RGBA")
    
    frames_dir = f"{WORK_DIR}/scene_1_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    # Pre-calculate base array
    base_arr = np.array(base_img, dtype=np.float32)
    
    for f in range(144):
        # 1. Blink calculation
        # Blink 1: frames 46..52 (peak at 49)
        # Blink 2: frames 112..118 (peak at 115)
        prog = 0.0
        if 46 <= f <= 52:
            prog = math.sin((f - 46) / 6.0 * math.pi)
        elif 112 <= f <= 118:
            prog = math.sin((f - 112) / 6.0 * math.pi)
            
        warped_arr = base_arr.copy()
        if prog > 0.02:
            # Left Eye: center (420, 332), rx=46, ry=24
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
                    
            # Right Eye: center (536, 336), rx=36, ry=22
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
        char_scaled = char_frame.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
        
        # 2. Breathing displacement & head micro-motion
        breathe_y = int(3.5 * math.sin(2 * math.pi * f / 75.0))
        head_x = int(2.0 * math.sin(2 * math.pi * f / 144.0))
        
        # Compose onto 1080x1920 canvas
        canvas = Image.new("RGBA", (1080, 1920), (10, 14, 22, 255))
        # Base placement: x offset -180, y offset 120
        paste_x = -180 + head_x
        paste_y = 120 + breathe_y
        canvas.paste(char_scaled, (paste_x, paste_y))
        
        # 3. Dynamic Falling Monsoon Rain
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
        
        # 4. Subtle cozy warm lighting pulse (indoor light)
        light_warmth = int(8 * math.sin(2 * math.pi * f / 60.0))
        if light_warmth > 0:
            warm_scrim = Image.new("RGBA", (1080, 1920), (255, 200, 120, light_warmth))
            canvas = Image.alpha_composite(canvas, warm_scrim)
            
        # 5. Composite branded overlay
        canvas = Image.alpha_composite(canvas, overlay)
        
        frame_file = f"{frames_dir}/frame_{f:04d}.jpg"
        canvas.convert("RGB").save(frame_file, quality=95)
        
    # Compile Scene 1 with FFmpeg
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip_path
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"[SCENE 1] Clip rendered successfully: {out_clip_path}")

# ============================================================
# 4. SCENE 2: STEAMING MOMOS REVEAL (4.60s, 138 frames)
# ============================================================
def render_scene_2(out_clip_path):
    print("[SCENE 2] Rendering steaming ITC Chicken Momos reveal (138 frames)...")
    base_momos = Image.open("public/images/products/chicken_momos.jpg").convert("RGBA")
    
    # 80 procedural billowing steam particles
    random.seed(101)
    particles = []
    for _ in range(80):
        particles.append({
            'x': random.uniform(320, 760),
            'y': random.uniform(500, 1150),
            'radius': random.uniform(18, 32),
            'speed_y': random.uniform(3.0, 5.5),
            'drift_phase': random.uniform(0, math.pi * 2),
            'alpha_max': random.uniform(0.22, 0.40),
            'life': random.uniform(0.0, 1.0)
        })
        
    overlay = Image.open("public/images/overlays/overlay_shot_2.png").convert("RGBA")
    
    frames_dir = f"{WORK_DIR}/scene_2_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    bw, bh = base_momos.size
    
    for f in range(138):
        # Subtle slow cinematic macro zoom (1.00 -> 1.05)
        zoom = 1.0 + 0.05 * (f / 138.0)
        target_w = int(1080 * zoom)
        target_h = int(1920 * zoom)
        
        # Scale base to cover target
        scale = max(target_w / bw, target_h / bh)
        scaled_img = base_momos.resize((int(bw * scale), int(bh * scale)), Image.Resampling.LANCZOS)
        
        cw, ch = scaled_img.size
        cx = (cw - 1080) // 2
        cy = (ch - 1920) // 2
        canvas = scaled_img.crop((cx, cy, cx + 1080, cy + 1920)).convert("RGBA")
        
        # Steam simulation layer
        steam_layer = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(steam_layer)
        
        for p in particles:
            p['life'] += 0.016
            p['y'] -= p['speed_y']
            p['x'] += math.sin(p['drift_phase'] + p['life'] * 8.0) * 1.6
            p['radius'] += 0.70
            
            if p['life'] < 0.25:
                cur_a = int(255 * p['alpha_max'] * (p['life'] / 0.25))
            else:
                cur_a = int(255 * p['alpha_max'] * max(0.0, 1.0 - (p['life'] - 0.25) / 0.75))
                
            if p['life'] >= 1.0 or p['y'] < 380:
                p['life'] = 0.0
                p['y'] = random.uniform(1050, 1140)
                p['x'] = random.uniform(320, 760)
                p['radius'] = random.uniform(18, 30)
                cur_a = 0
                
            if cur_a > 0:
                r = p['radius']
                s_draw.ellipse([p['x'] - r, p['y'] - r, p['x'] + r, p['y'] + r], fill=(245, 248, 255, cur_a))
                
        # Gaussian blur for soft volumetric smoke/steam
        steam_layer = steam_layer.filter(ImageFilter.GaussianBlur(radius=18))
        canvas = Image.alpha_composite(canvas, steam_layer)
        
        # Overlay
        canvas = Image.alpha_composite(canvas, overlay)
        
        frame_file = f"{frames_dir}/frame_{f:04d}.jpg"
        canvas.convert("RGB").save(frame_file, quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip_path
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"[SCENE 2] Clip rendered successfully: {out_clip_path}")

# ============================================================
# 5. SCENE 3: FRIES & KRAFT PACKAGING DUAL REVEAL (5.20s, 156 frames)
# ============================================================
def render_scene_3(out_clip_path):
    print("[SCENE 3] Rendering ITC French Fries & Kraft packaging dual reveal (156 frames)...")
    fries_bg = Image.open("public/images/products/french_fries_basket.jpg").convert("RGBA")
    itc_pack = Image.open("public/images/products/itc_french_fries.webp").convert("RGBA")
    kraft_box = Image.open("public/images/products/kraft_burger_box.jpg").convert("RGBA")
    
    font_bold = FONT_BOLD
    f_tag = ImageFont.truetype(font_bold, 20)
    f_name = ImageFont.truetype(font_bold, 24)
    
    # Pre-render Card 1: ITC Master Chef Pack
    card1 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(card1)
    d1.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d1.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d1.text((225, 40), "GENUINE CATALOGUE ITEM", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    pw, ph = itc_pack.size
    itc_fit = itc_pack.resize((360, int(ph * (360 / pw))), Image.Resampling.LANCZOS)
    card1.paste(itc_fit, (45, 80))
    d1.text((225, 500), "ITC Master Chef Fries", fill=(255, 255, 255), font=f_name, anchor="mm")
    d1.text((225, 530), "SKU: RAIS-VEG-01 • 2.5kg", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    # Pre-render Card 2: Kraft Burger Box
    card2 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(card2)
    d2.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d2.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d2.text((225, 40), "COMMERCIAL PACKAGING", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    kw, kh = kraft_box.size
    kraft_fit = kraft_box.resize((380, int(kh * (380 / kw))), Image.Resampling.LANCZOS)
    mask = Image.new("L", kraft_fit.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, kraft_fit.width, kraft_fit.height], radius=16, fill=255)
    card2.paste(kraft_fit, (35, 110), mask)
    d2.text((225, 500), "Kraft Burger Box 4\"x4\"", fill=(255, 255, 255), font=f_name, anchor="mm")
    d2.text((225, 530), "SKU: RAIS-BOX-02 • 100 Pcs", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    overlay = Image.open("public/images/overlays/overlay_shot_3.png").convert("RGBA")
    
    frames_dir = f"{WORK_DIR}/scene_3_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    bg_w, bg_h = fries_bg.size
    
    for f in range(156):
        # Camera drift
        zoom = 1.0 + 0.04 * (f / 156.0)
        target_w = int(1080 * zoom)
        target_h = int(1920 * zoom)
        scale = max(target_w / bg_w, target_h / bg_h)
        bg_scaled = fries_bg.resize((int(bg_w * scale), int(bg_h * scale)), Image.Resampling.LANCZOS)
        
        cw, ch = bg_scaled.size
        cx = (cw - 1080) // 2
        cy = (ch - 1920) // 2
        canvas = bg_scaled.crop((cx, cy, cx + 1080, cy + 1920)).convert("RGBA")
        
        # Scrim
        scrim = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        draw_s = ImageDraw.Draw(scrim)
        for y in range(700, 1920):
            alpha = int(195 * ((y - 700) / 1220.0))
            draw_s.line([(0, y), (1080, y)], fill=(6, 10, 18, alpha))
        canvas = Image.alpha_composite(canvas, scrim)
        
        # Dynamic float entrance for cards (ease-out over first 20 frames)
        if f < 25:
            t = f / 25.0
            ease = 1.0 - (1.0 - t)**3 # cubic ease-out
            card_offset_y = int(60 * (1.0 - ease))
            card_alpha = ease
        else:
            card_offset_y = 0
            card_alpha = 1.0
            
        # Subtle floating bob
        bob1 = int(4 * math.sin(2 * math.pi * f / 60.0))
        bob2 = int(4 * math.cos(2 * math.pi * f / 60.0))
        
        canvas.paste(card1, (60, 780 + card_offset_y + bob1), card1)
        canvas.paste(card2, (570, 780 + card_offset_y + bob2), card2)
        
        # Overlay
        canvas = Image.alpha_composite(canvas, overlay)
        
        frame_file = f"{frames_dir}/frame_{f:04d}.jpg"
        canvas.convert("RGB").save(frame_file, quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip_path
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"[SCENE 3] Clip rendered successfully: {out_clip_path}")

# ============================================================
# 6. SCENE 4: BRAND END CARD POLISH (6.76s, 203 frames)
# ============================================================
def render_scene_4(out_clip_path):
    print("[SCENE 4] Rendering simplified brand end card with animated gold shimmer (203 frames)...")
    base_card = Image.open("public/images/scene_05_brand_cta.png").convert("RGBA")
    
    frames_dir = f"{WORK_DIR}/scene_4_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    for f in range(203):
        canvas = base_card.copy()
        draw = ImageDraw.Draw(canvas)
        
        # Subtle gold shimmer pulse on the CTA button and logo
        pulse = 0.5 + 0.5 * math.sin(2 * math.pi * f / 45.0) # period 1.5s
        glow_alpha = int(40 + 70 * pulse)
        
        # Shimmer highlight along the outer gold border
        btn_y = 1250 # CTA button area
        btn_box = [(150, btn_y), (930, btn_y + 130)]
        draw.rounded_rectangle(btn_box, radius=32, outline=(255, 220, 100, glow_alpha), width=3)
        
        frame_file = f"{frames_dir}/frame_{f:04d}.jpg"
        canvas.convert("RGB").save(frame_file, quality=95)
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", "30",
        "-i", f"{frames_dir}/frame_%04d.jpg",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p", "-r", "30",
        out_clip_path
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"[SCENE 4] Clip rendered successfully: {out_clip_path}")

# ============================================================
# 7. MASTER CONCATENATION & AUDIO MUX
# ============================================================
def compile_pilot_video(clip1, clip2, clip3, clip4, narration_wav, bgm_wav, output_mp4):
    print("[MASTER] Merging clips and muxing synchronized audio...")
    concat_list = f"{WORK_DIR}/concat_list.txt"
    with open(concat_list, "w") as f:
        for p in [clip1, clip2, clip3, clip4]:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    temp_video = f"{WORK_DIR}/merged_scenes.mp4"
    cmd_concat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        temp_video
    ]
    subprocess.run(cmd_concat, capture_output=True, check=True)
    
    # Mux with Narration and BGM
    cmd_mux = [
        FFMPEG_EXE, "-y",
        "-i", temp_video,
        "-i", narration_wav,
        "-i", bgm_wav,
        "-filter_complex",
        "[1:a]volume=1.0[voice];[2:a]volume=0.18[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
        "-t", "21.36",
        output_mp4
    ]
    subprocess.run(cmd_mux, capture_output=True, check=True)
    print(f"[SUCCESS] Final Pilot MP4 compiled: {output_mp4}")

async def main():
    print("=== STARTING PILOT REMEDIATION (SCENARIO 1 HINDI ONLY) ===")
    os.makedirs(WORK_DIR, exist_ok=True)
    
    narration_wav, bgm_wav = await generate_narration()
    
    clip1 = f"{WORK_DIR}/clip_1.mp4"
    clip2 = f"{WORK_DIR}/clip_2.mp4"
    clip3 = f"{WORK_DIR}/clip_3.mp4"
    clip4 = f"{WORK_DIR}/clip_4.mp4"
    
    render_scene_1(clip1)
    render_scene_2(clip2)
    render_scene_3(clip3)
    render_scene_4(clip4)
    
    out_pilot = "public/videos/pilot_scenario_01_hi.mp4"
    compile_pilot_video(clip1, clip2, clip3, clip4, narration_wav, bgm_wav, out_pilot)
    
    # Also update scenario 1 campaign folder
    campaign_out = "public/videos/campaigns/scenario_01_monsoon_cravings/master_hindi_21s.mp4"
    import shutil
    shutil.copy2(out_pilot, campaign_out)
    print(f"[SUCCESS] Mirrored pilot to: {campaign_out}")
    print("=== PILOT PRODUCTION COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(main())
