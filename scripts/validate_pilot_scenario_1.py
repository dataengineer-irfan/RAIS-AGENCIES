import os
import shutil
import subprocess
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFont

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
ARTIFACT_DIR = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"
VIDEO_PATH = "public/videos/pilot_scenario_01_hi.mp4"

def extract_validation_frames():
    os.makedirs("validation_proofs", exist_ok=True)
    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    
    timestamps = [
        ("t_01_0s_ayesha_open", 1.0),
        ("t_01_6s_ayesha_blink1", 1.63),
        ("t_02_5s_ayesha_breathe", 2.5),
        ("t_03_8s_ayesha_blink2", 3.83),
        ("t_06_0s_momos_steam1", 6.0),
        ("t_08_0s_momos_steam2", 8.0),
        ("t_11_0s_itc_fries_kraft", 11.0),
        ("t_13_5s_fries_packaging", 13.5),
        ("t_18_0s_brand_endcard", 18.0)
    ]
    
    extracted_paths = {}
    for name, ts in timestamps:
        out_png = f"validation_proofs/{name}.png"
        cmd = [
            FFMPEG_EXE, "-y",
            "-ss", f"{ts:.3f}",
            "-i", VIDEO_PATH,
            "-vframes", "1",
            out_png
        ]
        subprocess.run(cmd, capture_output=True, check=True)
        # Copy to artifact dir for markdown embedding
        art_dest = os.path.join(ARTIFACT_DIR, f"{name}.png")
        shutil.copy2(out_png, art_dest)
        extracted_paths[name] = out_png
        print(f"[EXTRACT] Captured frame at t={ts:.2f}s: {out_png}")
        
    # Quantitative Motion Diff Analysis
    print("\n--- QUANTITATIVE MOTION METRICS ---")
    pairs = [
        ("Scene 1 Blink & Rain", "t_01_0s_ayesha_open", "t_01_6s_ayesha_blink1"),
        ("Scene 1 Rain & Breathing", "t_01_6s_ayesha_blink1", "t_02_5s_ayesha_breathe"),
        ("Scene 2 Steam Billow", "t_06_0s_momos_steam1", "t_08_0s_momos_steam2"),
        ("Scene 3 Card Float & Shimmer", "t_11_0s_itc_fries_kraft", "t_13_5s_fries_packaging")
    ]
    
    diff_results = []
    for label, name1, name2 in pairs:
        im1 = Image.open(extracted_paths[name1]).convert("RGB")
        im2 = Image.open(extracted_paths[name2]).convert("RGB")
        diff = ImageChops.difference(im1, im2)
        arr = np.array(diff, dtype=np.float32)
        mean_diff = float(np.mean(arr))
        max_diff = float(np.max(arr))
        pct_changed = float(np.count_nonzero(arr > 3) / arr.size * 100.0)
        
        diff_results.append({
            'label': label,
            'mean_diff': mean_diff,
            'max_diff': max_diff,
            'pct_changed': pct_changed
        })
        print(f"[{label}] Mean pixel delta: {mean_diff:.2f} | Max delta: {max_diff:.1f} | Dynamic area: {pct_changed:.1f}%")

    # Create Side-by-side Blink Proof
    im_open = Image.open(extracted_paths["t_01_0s_ayesha_open"])
    im_blink = Image.open(extracted_paths["t_01_6s_ayesha_blink1"])
    # Crop eye area in 1080x1920: y around 380..580, x around 200..600
    # In full frame, eye crop is at:
    crop_box = (150, 360, 650, 640)
    eye_open = im_open.crop(crop_box).resize((500, 350))
    eye_blink = im_blink.crop(crop_box).resize((500, 350))
    
    sbs_blink = Image.new("RGB", (1040, 440), (12, 16, 26))
    d_sbs = ImageDraw.Draw(sbs_blink)
    sbs_blink.paste(eye_open, (15, 60))
    sbs_blink.paste(eye_blink, (525, 60))
    
    font_bold = "C:/Windows/Fonts/arialbd.ttf"
    f_title = ImageFont.truetype(font_bold, 24)
    f_lbl = ImageFont.truetype(font_bold, 20)
    
    d_sbs.text((520, 25), "AYESHA EYE-BLINK VERIFICATION PROOF (SCENE 1)", fill=(212, 175, 55), font=f_title, anchor="mm")
    d_sbs.text((265, 420), "t = 1.00s (Resting Eye)", fill=(255, 255, 255), font=f_lbl, anchor="mm")
    d_sbs.text((775, 420), "t = 1.63s (Blink Descent Peak)", fill=(212, 175, 55), font=f_lbl, anchor="mm")
    
    sbs_path = "validation_proofs/proof_sbs_blink.png"
    sbs_blink.save(sbs_path)
    shutil.copy2(sbs_path, os.path.join(ARTIFACT_DIR, "proof_sbs_blink.png"))
    print(f"[PROOF] Saved side-by-side blink proof: {sbs_path}")
    
    # Create Side-by-side Steam Proof
    im_steam1 = Image.open(extracted_paths["t_06_0s_momos_steam1"])
    im_steam2 = Image.open(extracted_paths["t_08_0s_momos_steam2"])
    steam_box = (250, 600, 850, 1200)
    s1_crop = im_steam1.crop(steam_box).resize((500, 500))
    s2_crop = im_steam2.crop(steam_box).resize((500, 500))
    
    sbs_steam = Image.new("RGB", (1040, 590), (12, 16, 26))
    d_stm = ImageDraw.Draw(sbs_steam)
    sbs_steam.paste(s1_crop, (15, 60))
    sbs_steam.paste(s2_crop, (525, 60))
    d_stm.text((520, 25), "ITC MOMOS BILLOWING STEAM VERIFICATION PROOF (SCENE 2)", fill=(212, 175, 55), font=f_title, anchor="mm")
    d_stm.text((265, 570), "t = 6.00s (Initial Rising Wisps)", fill=(255, 255, 255), font=f_lbl, anchor="mm")
    d_stm.text((775, 570), "t = 8.00s (Diffusing Volumetric Plumes)", fill=(212, 175, 55), font=f_lbl, anchor="mm")
    
    steam_proof_path = "validation_proofs/proof_sbs_steam.png"
    sbs_steam.save(steam_proof_path)
    shutil.copy2(steam_proof_path, os.path.join(ARTIFACT_DIR, "proof_sbs_steam.png"))
    print(f"[PROOF] Saved side-by-side steam proof: {steam_proof_path}")

if __name__ == "__main__":
    extract_validation_frames()
