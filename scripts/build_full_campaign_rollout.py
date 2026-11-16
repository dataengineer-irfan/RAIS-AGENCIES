import os
import sys
sys.path.insert(0, os.path.dirname(__file__))
import math
import random
import subprocess
import asyncio
import json
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
BASE_WORK_DIR = "public/videos/campaigns_work"

# Load manifest
with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

# ============================================================
# AUDIO GENERATOR (Edge-TTS)
# ============================================================
async def generate_scenario_audio(sc_id, sc, lang, work_dir):
    import edge_tts
    os.makedirs(f"{work_dir}/audio", exist_ok=True)
    voice = "hi-IN-SwaraNeural" if lang == "hi" else "te-IN-ShrutiNeural"
    texts = sc["audio_hi"] if lang == "hi" else sc["audio_te"]
    
    shot_audio_files = []
    durs = []
    for idx, text in enumerate(texts):
        out_f = f"{work_dir}/audio/shot_{idx+1}_{lang}.mp3"
        rate = "+14%" if lang == "hi" else "+10%"
        comm = edge_tts.Communicate(text, voice, rate=rate)
        await comm.save(out_f)
        shot_audio_files.append(out_f)
        
        # Measure duration
        cmd_dur = [FFMPEG_EXE, "-i", out_f]
        res = subprocess.run(cmd_dur, capture_output=True, text=True)
        dur = 3.5
        for line in res.stderr.splitlines():
            if "Duration: " in line:
                t = line.split("Duration: ")[1].split(",")[0].strip()
                h, m, s = t.split(":")
                dur = float(h)*3600 + float(m)*60 + float(s)
                break
        durs.append(dur)
        
    # Dynamic non-overlapping delays
    t1 = 0.30
    t2 = max(4.90, t1 + durs[0] + 0.15)
    t3 = max(9.50, t2 + durs[1] + 0.15)
    t4 = max(14.70, t3 + durs[2] + 0.15)
    
    d1_ms = int(t1 * 1000)
    d2_ms = int(t2 * 1000)
    d3_ms = int(t3 * 1000)
    d4_ms = int(t4 * 1000)
        
    full_narration_wav = f"{work_dir}/audio/narration_{lang}.wav"
    cmd = [
        FFMPEG_EXE, "-y",
        "-i", shot_audio_files[0],
        "-i", shot_audio_files[1],
        "-i", shot_audio_files[2],
        "-i", shot_audio_files[3],
        "-filter_complex",
        f"[0:a]adelay={d1_ms}|{d1_ms}[a0];"
        f"[1:a]adelay={d2_ms}|{d2_ms}[a1];"
        f"[2:a]adelay={d3_ms}|{d3_ms}[a2];"
        f"[3:a]adelay={d4_ms}|{d4_ms}[a3];"
        "[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0",
        "-ac", "2", "-ar", "44100",
        full_narration_wav
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    
    # Generate BGM bed with 2s fadeout
    total_dur = 21.36
    bgm_wav = f"{work_dir}/audio/bgm_bed.wav"
    fade_start = total_dur - 2.0
    if not os.path.exists(bgm_wav):
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
        
    return full_narration_wav, bgm_wav

# ============================================================
# SHOT 1: CHARACTER ANIMATION ENGINE
# ============================================================
def render_character_shot(sc_id, sc, lang, work_dir, out_clip):
    overlay_path = f"public/images/all_overlays/overlay_sc{sc_id}_shot1_{lang}.png"
    overlay = Image.open(overlay_path).convert("RGBA")
    
    char_path = sc["character"]
    base_img = Image.open(char_path).convert("RGBA")
    
    scaled_w, scaled_h = 1485, 1485
    base_scaled = base_img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    base_arr = np.array(base_img, dtype=np.float32)
    
    frames_dir = f"{work_dir}/shot1_{lang}_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
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
            
        warped_arr = base_arr.copy()
        if prog > 0.02:
            # Warp left & right eyes
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
        char_scaled = char_frame.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
        
        breathe_y = int(3.5 * math.sin(2 * math.pi * f / 75.0))
        head_x = int(2.0 * math.sin(2 * math.pi * f / 144.0))
        
        canvas = Image.new("RGBA", (1080, 1920), (10, 14, 22, 255))
        canvas.paste(char_scaled, (-180 + head_x, 120 + breathe_y))
        
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
            
        # Lighting warmth pulse
        light_warmth = int(7 * math.sin(2 * math.pi * f / 60.0))
        if light_warmth > 0:
            canvas = Image.alpha_composite(canvas, Image.new("RGBA", (1080, 1920), (255, 200, 120, light_warmth)))
            
        canvas = Image.alpha_composite(canvas, overlay)
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
# SHOT 2: PRODUCT 1 REVEAL WITH BILLOWING STEAM / AROMA
# ============================================================
def render_product1_shot(sc_id, sc, lang, work_dir, out_clip):
    overlay_path = f"public/images/all_overlays/overlay_sc{sc_id}_shot2_{lang}.png"
    overlay = Image.open(overlay_path).convert("RGBA")
    
    prod_path = sc["sku1"]["asset"]
    base_prod = Image.open(prod_path).convert("RGBA")
    bw, bh = base_prod.size
    
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
        
    frames_dir = f"{work_dir}/shot2_{lang}_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    for f in range(138):
        zoom = 1.0 + 0.05 * (f / 138.0)
        target_w = int(1080 * zoom)
        target_h = int(1920 * zoom)
        scale = max(target_w / bw, target_h / bh)
        scaled_img = base_prod.resize((int(bw * scale), int(bh * scale)), Image.Resampling.LANCZOS)
        
        cw, ch = scaled_img.size
        cx = (cw - 1080) // 2
        cy = (ch - 1920) // 2
        canvas = scaled_img.crop((cx, cy, cx + 1080, cy + 1920)).convert("RGBA")
        
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
        canvas = Image.alpha_composite(canvas, overlay)
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
# SHOT 3: PRODUCT 2 & DUAL PACKAGING CARDS REVEAL
# ============================================================
def render_product2_shot(sc_id, sc, lang, work_dir, out_clip):
    overlay_path = f"public/images/all_overlays/overlay_sc{sc_id}_shot3_{lang}.png"
    overlay = Image.open(overlay_path).convert("RGBA")
    
    sku2 = sc["sku2"]
    bg_asset = sku2["asset"]
    paired_asset = sku2.get("paired_asset", "public/images/products/kraft_burger_box.jpg")
    
    bg_img = Image.open(bg_asset).convert("RGBA")
    pair_img = Image.open(paired_asset).convert("RGBA")
    
    font_bold = FONT_BOLD
    f_tag = ImageFont.truetype(font_bold, 20)
    f_name = ImageFont.truetype(font_bold, 24)
    
    # Card 1: SKU 2 Pack
    card1 = Image.new("RGBA", (450, 560), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(card1)
    d1.rounded_rectangle([0, 0, 450, 560], radius=24, fill=(10, 15, 26, 245), outline=(212, 175, 55, 230), width=3)
    d1.rounded_rectangle([20, 20, 430, 60], radius=12, fill=(212, 175, 55, 45), outline=(212, 175, 55, 180), width=1)
    d1.text((225, 40), f"{sku2['brand'].upper()}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    bw, bh = bg_img.size
    fit_w = 360
    b_fit = bg_img.resize((fit_w, int(bh * (fit_w / bw))), Image.Resampling.LANCZOS)
    b_mask = Image.new("L", b_fit.size, 0)
    ImageDraw.Draw(b_mask).rounded_rectangle([0, 0, b_fit.width, b_fit.height], radius=16, fill=255)
    card1.paste(b_fit, (45, 90), b_mask)
    d1.text((225, 500), sku2["name"][:24], fill=(255, 255, 255), font=f_name, anchor="mm")
    d1.text((225, 530), f"SKU: {sku2['code']} • {sku2['pack']}", fill=(212, 175, 55), font=f_tag, anchor="mm")
    
    # Card 2: Paired Packaging / Supply Asset
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
    
    frames_dir = f"{work_dir}/shot3_{lang}_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    for f in range(156):
        # Background: subtle dark aesthetic food background
        canvas = Image.new("RGBA", (1080, 1920), (8, 12, 20, 255))
        # Large centered preview of background item in upper half
        bg_preview = bg_img.resize((960, int(bh * (960 / bw))), Image.Resampling.LANCZOS)
        canvas.paste(bg_preview, (60, 120))
        
        # Scrim
        scrim = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        draw_s = ImageDraw.Draw(scrim)
        for y in range(600, 1920):
            alpha = int(220 * ((y - 600) / 1320.0))
            draw_s.line([(0, y), (1080, y)], fill=(6, 10, 18, alpha))
        canvas = Image.alpha_composite(canvas, scrim)
        
        # Entrance float
        offset_y = int(50 * (1.0 - (f / 25.0)**2)) if f < 25 else 0
        bob1 = int(3.5 * math.sin(2 * math.pi * f / 60.0))
        bob2 = int(3.5 * math.cos(2 * math.pi * f / 60.0))
        
        canvas.paste(card1, (60, 780 + offset_y + bob1), card1)
        canvas.paste(card2, (570, 780 + offset_y + bob2), card2)
        
        canvas = Image.alpha_composite(canvas, overlay)
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
# MASTER CAMPAIGN RENDERER FOR A SINGLE SCENARIO
# ============================================================
async def process_scenario(sc_id):
    sc = MANIFEST[str(sc_id)]
    folder = sc["folder"]
    work_dir = f"{BASE_WORK_DIR}/sc_{sc_id:02d}"
    out_dir = f"public/videos/campaigns/{folder}"
    os.makedirs(work_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\n==========================================")
    print(f"PROCESSING SCENARIO {sc_id:02d}: {sc['title']}")
    print(f"==========================================")
    
    clip4 = f"{BASE_WORK_DIR}/shared_clip_4.mp4"
    if not os.path.exists(clip4):
        print("[MASTER] Rendering shared polished brand end card (clip 4)...")
        from animate_pilot_scenario_1 import render_scene_4
        render_scene_4(clip4)
        
    for lang in ["hi", "te"]:
        out_mp4 = f"{out_dir}/master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4"
        if sc_id == 1 and lang == "hi" and os.path.exists("public/videos/pilot_scenario_01_hi.mp4"):
            shutil.copy2("public/videos/pilot_scenario_01_hi.mp4", out_mp4)
            print(f"[REUSED PILOT] Mirrored verified pilot to: {out_mp4}")
            continue
        print(f"\n--- Building Scenario {sc_id:02d} ({lang.upper()}) -> {out_mp4} ---")
        
        # Audio
        narration_wav, bgm_wav = await generate_scenario_audio(sc_id, sc, lang, work_dir)
        
        # Video Clips
        clip1 = f"{work_dir}/clip1_{lang}.mp4"
        clip2 = f"{work_dir}/clip2_{lang}.mp4"
        clip3 = f"{work_dir}/clip3_{lang}.mp4"
        
        render_character_shot(sc_id, sc, lang, work_dir, clip1)
        render_product1_shot(sc_id, sc, lang, work_dir, clip2)
        render_product2_shot(sc_id, sc, lang, work_dir, clip3)
        
        # Merge scenes
        concat_list = f"{work_dir}/concat_{lang}.txt"
        with open(concat_list, "w") as f:
            for p in [clip1, clip2, clip3, clip4]:
                f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
                
        temp_video = f"{work_dir}/merged_{lang}.mp4"
        cmd_concat = [
            FFMPEG_EXE, "-y",
            "-f", "concat", "-safe", "0",
            "-i", concat_list,
            "-c", "copy",
            temp_video
        ]
        subprocess.run(cmd_concat, capture_output=True, check=True)
        
        # Final Mux
        cmd_mux = [
            FFMPEG_EXE, "-y",
            "-i", temp_video,
            "-i", narration_wav,
            "-i", bgm_wav,
            "-filter_complex",
            "[1:a]volume=1.0[voice];[2:a]volume=0.10,afade=t=out:st=19.36:d=2.0[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
            "-t", "21.36",
            out_mp4
        ]
        subprocess.run(cmd_mux, capture_output=True, check=True)
        print(f"[SUCCESS] Exported: {out_mp4}")

async def main():
    print("=== STARTING FULL CAMPAIGN ROLLOUT (ALL 15 SCENARIOS) ===")
    os.makedirs(BASE_WORK_DIR, exist_ok=True)
    
    # Process all scenarios 1 to 15
    for sc_id in range(1, 16):
        await process_scenario(sc_id)
        
    print("\n=== FULL ROLLOUT COMPLETE: ALL 30 VIDEOS GENERATED ===")

if __name__ == "__main__":
    asyncio.run(main())
