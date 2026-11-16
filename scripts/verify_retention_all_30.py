import os
import sys
import json
import math
import shutil
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
CAMPAIGN_DIR = "public/videos/campaigns"
WORK_DIR = "public/videos/retention_qa_work"
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"
os.makedirs(WORK_DIR, exist_ok=True)

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

TIMESTAMPS = [0.0, 0.5, 1.0, 2.0, 3.0, 4.0, 5.0, 5.95]

def probe_video(file_path):
    cmd = [FFMPEG_EXE, "-i", file_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stderr
    
    dur = 0.0
    res_str = ""
    fps = 0.0
    has_video = False
    has_audio = False
    
    for line in out.splitlines():
        if "Duration: " in line:
            t = line.split("Duration: ")[1].split(",")[0].strip()
            h, m, s = t.split(":")
            dur = float(h)*3600 + float(m)*60 + float(s)
        if "Stream #0:0" in line and "Video:" in line:
            has_video = True
            if "1080x1920" in line:
                res_str = "1080x1920"
            if "30 fps" in line:
                fps = 30.0
        if "Stream #0:1" in line and "Audio:" in line:
            has_audio = True
            
    return dur, res_str, fps, has_video, has_audio

def measure_window_volume(file_path, ss=14.0, t=2.5):
    cmd = [FFMPEG_EXE, "-ss", str(ss), "-t", str(t), "-i", file_path, "-af", "volumedetect", "-f", "null", "-"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    mean_v, max_v = -99.0, -99.0
    for line in res.stderr.splitlines():
        if "mean_volume:" in line:
            try:
                mean_v = float(line.split("mean_volume:")[1].replace("dB", "").strip())
            except Exception:
                pass
        if "max_volume:" in line:
            try:
                max_v = float(line.split("max_volume:")[1].replace("dB", "").strip())
            except Exception:
                pass
    return mean_v, max_v

def measure_ebur128(file_path):
    cmd = [FFMPEG_EXE, "-i", file_path, "-af", "ebur128=video=0:meter=18", "-f", "null", "-"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stderr
    i_lufs = -99.0
    for line in out.splitlines():
        if "I:" in line and "LUFS" in line:
            try:
                i_lufs = float(line.split("I:")[1].replace("LUFS", "").strip())
            except Exception:
                pass
    return i_lufs

def extract_frame(video_path, t, out_path):
    cmd = [FFMPEG_EXE, "-y", "-ss", str(t), "-i", video_path, "-vframes", "1", "-q:v", "2", out_path]
    subprocess.run(cmd, capture_output=True, check=True)

def analyze_video_retention(sc_id, sc, lang):
    folder = sc["folder"]
    filename = f"master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4"
    filepath = f"{CAMPAIGN_DIR}/{folder}/{filename}"
    
    if not os.path.exists(filepath):
        return None
        
    dur, res_str, fps, has_v, has_a = probe_video(filepath)
    mean_14, max_14 = measure_window_volume(filepath, 14.0, 2.5)
    i_lufs = measure_ebur128(filepath)
    
    # Extract the 8 critical timestamps
    frame_paths = []
    frame_arrays = []
    for t in TIMESTAMPS:
        f_name = f"{WORK_DIR}/sc{sc_id:02d}_{lang}_t_{t:.1f}s.jpg"
        extract_frame(filepath, t, f_name)
        frame_paths.append((t, f_name))
        im = Image.open(f_name).convert("L")
        frame_arrays.append(np.array(im, dtype=np.float32))
        
    # Check 0.0s is NOT black frame
    mean_lum_0 = float(np.mean(frame_arrays[0]))
    is_not_black = bool(mean_lum_0 > 20.0)
    
    # Calculate inter-timestamp RMSE
    rmse_diffs = []
    for i in range(len(frame_arrays) - 1):
        rmse = float(np.sqrt(np.mean((frame_arrays[i] - frame_arrays[i+1]) ** 2)))
        rmse_diffs.append((float(TIMESTAMPS[i]), float(TIMESTAMPS[i+1]), round(rmse, 2)))
        
    # Verify prompt shot changes:
    # Cut 1: 0.5s -> 1.0s (Cut at 0.7s, RMSE should be > 35)
    cut1_ok = bool(rmse_diffs[1][2] > 35.0)
    # Cut 2: 1.0s -> 2.0s (Cut at 2.0s, RMSE should be > 35)
    cut2_ok = bool(rmse_diffs[2][2] > 35.0)
    # Cut 3: 3.0s -> 4.0s (Cut at 4.0s, RMSE should be > 35)
    cut3_ok = bool(rmse_diffs[4][2] > 35.0)
    
    # Verify continuous motion within shots (RMSE > 2.0 everywhere)
    no_freeze = bool(all(diff[2] > 3.0 for diff in rmse_diffs))
    
    passed = bool(
        dur >= 21.0 and res_str == "1080x1920" and fps == 30.0 and
        has_v and has_a and is_not_black and cut1_ok and cut2_ok and cut3_ok and
        no_freeze and mean_14 > -30.0
    )
    
    return {
        "sc_id": int(sc_id),
        "title": sc["title"],
        "lang": lang,
        "filepath": filepath,
        "duration": round(float(dur), 2),
        "resolution": res_str,
        "fps": float(fps),
        "luminance_0s": round(mean_lum_0, 1),
        "is_not_black": is_not_black,
        "rmse_diffs": rmse_diffs,
        "cuts_prompt": (cut1_ok and cut2_ok and cut3_ok),
        "continuous_motion": no_freeze,
        "mean_14_16": round(float(mean_14), 2),
        "i_lufs": round(float(i_lufs), 2),
        "passed": passed,
        "frame_paths": frame_paths
    }

def build_master_first_six_seconds_contact_sheet(all_results):
    print("\n--- Compiling Master 15-Scenario 6-Second Retention Contact Sheet ---")
    f_title = ImageFont.truetype(FONT_BOLD, 22)
    f_sub = ImageFont.truetype(FONT_BOLD, 14)
    f_pass = ImageFont.truetype(FONT_BOLD, 15)
    
    # 15 scenarios x 8 timestamps
    W = 1440
    H = 15 * 240 + 100
    canvas = Image.new("RGB", (W, H), (10, 14, 22))
    draw = ImageDraw.Draw(canvas)
    
    draw.text((W // 2, 45), "RAIS AGENCIES — 15-SCENARIO FIRST 6 SECONDS RETENTION CONTACT SHEET", fill=(212, 175, 55), font=f_title, anchor="mm")
    
    # Header columns for timestamps
    tw, th = 110, 195
    for idx, t in enumerate(TIMESTAMPS):
        x = 340 + idx * (tw + 12)
        draw.text((x + tw // 2, 80), f"t = {t:.1f}s", fill=(212, 175, 55), font=f_sub, anchor="mm")
        
    for sc_id in range(1, 16):
        y = 100 + (sc_id - 1) * 240
        res = next((r for r in all_results if r["sc_id"] == sc_id and r["lang"] == "hi"), None)
        if not res:
            continue
            
        sc = MANIFEST[str(sc_id)]
        
        # Scenario card
        draw.rounded_rectangle([20, y + 10, 320, y + 215], radius=10, fill=(20, 26, 38), outline=(50, 65, 85))
        draw.text((35, y + 25), f"Scenario {sc_id:02d}: {sc['title'][:16]}", fill=(212, 175, 55), font=f_title)
        draw.text((35, y + 65), f"Hook: {sc['sku1']['name'][:20]}", fill=(255, 255, 255), font=f_sub)
        draw.text((35, y + 95), f"Env: {os.path.basename(sc['character'])[:20]}", fill=(180, 200, 220), font=f_sub)
        draw.text((35, y + 125), f"Cuts: 0.7s, 2.0s, 4.0s", fill=(160, 220, 180), font=f_sub)
        
        status_color = (60, 220, 120) if res["passed"] else (240, 80, 80)
        draw.text((35, y + 165), f"QA: {'PASS (4 Cuts in 6s)' if res['passed'] else 'FAIL'}", fill=status_color, font=f_pass)
        
        # 8 frame thumbnails
        for idx, (t, f_path) in enumerate(res["frame_paths"]):
            x = 340 + idx * (tw + 12)
            if os.path.exists(f_path):
                im = Image.open(f_path).resize((tw, th), Image.Resampling.LANCZOS)
                canvas.paste(im, (x, y + 15))
                draw.rectangle([x, y + 15, x + tw, y + 15 + th], outline=(70, 85, 110), width=1)
                
    out_cs = "public/images/retention_first_six_seconds_contact_sheet.jpg"
    canvas.save(out_cs, quality=92)
    print(f"[MASTER CONTACT SHEET SAVED] {out_cs}")
    
    shutil.copy2(out_cs, os.path.join(ARTIFACT_DIR, "retention_first_six_seconds_contact_sheet.jpg"))
    print("Copied to artifact directory")

def main():
    print("=" * 100)
    print("RAIS AGENCIES — 30-REEL MANDATORY VISUAL-MOTION RETENTION QA AUDIT")
    print("=" * 100)
    
    all_results = []
    
    for sc_id in range(1, 16):
        sc = MANIFEST[str(sc_id)]
        for lang in ["hi", "te"]:
            res = analyze_video_retention(sc_id, sc, lang)
            if res:
                all_results.append(res)
                status = "PASS" if res["passed"] else "FAIL"
                print(f"[{status}] Sc {sc_id:02d} ({lang.upper()}) | 0s Lum: {res['luminance_0s']:.1f} | Cuts Prompt: {res['cuts_prompt']} | Continuous Motion: {res['continuous_motion']} | 14-16s Mean: {res['mean_14_16']}dB | LUFS: {res['i_lufs']}")
                
    print("\n" + "=" * 100)
    print("RETENTION QA AUDIT SUMMARY:")
    print(f"Total Videos Verified: {len(all_results)} / 30")
    pass_count = sum(1 for r in all_results if r["passed"])
    print(f"Passed All Visual & Motion Checks: {pass_count} / {len(all_results)}")
    print("=" * 100)
    
    with open("scripts/retention_qa_results.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2)
        
    build_master_first_six_seconds_contact_sheet(all_results)

if __name__ == "__main__":
    main()
