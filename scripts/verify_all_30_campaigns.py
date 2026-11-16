import os
import subprocess
import json
import numpy as np
from PIL import Image, ImageChops

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

def verify_single_video(sc_id, lang):
    sc = MANIFEST[str(sc_id)]
    folder = sc["folder"]
    filename = f"master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4"
    path = f"public/videos/campaigns/{folder}/{filename}"
    
    report = {
        "scenario": sc_id,
        "title": sc["title"],
        "lang": lang,
        "path": path,
        "exists": False,
        "size_mb": 0,
        "duration": 0,
        "resolution": "",
        "fps": 0,
        "motion_gate": "FAIL",
        "product_gate": "FAIL",
        "audio_gate": "FAIL",
        "tech_gate": "FAIL",
        "overall": "FAIL"
    }
    
    if not os.path.exists(path):
        return report
        
    report["exists"] = True
    report["size_mb"] = round(os.path.getsize(path) / (1024 * 1024), 2)
    
    # Inspect with ffmpeg
    cmd = [FFMPEG_EXE, "-i", path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stderr
    
    # Check duration
    if "Duration: " in out:
        dur_str = out.split("Duration: ")[1].split(",")[0].strip()
        parts = dur_str.split(":")
        sec = float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
        report["duration"] = round(sec, 2)
        
    # Check resolution
    if "1080x1920" in out:
        report["resolution"] = "1080x1920"
    if "30 fps" in out or "30.00 fps" in out or "30 tbr" in out:
        report["fps"] = 30
        
    # Extract test frames to verify motion
    os.makedirs("qc_frames", exist_ok=True)
    f1_path = f"qc_frames/sc{sc_id}_{lang}_t1.png"
    f2_path = f"qc_frames/sc{sc_id}_{lang}_t2.png"
    
    subprocess.run([FFMPEG_EXE, "-y", "-ss", "00:00:01.0", "-i", path, "-vframes", "1", f1_path], capture_output=True)
    subprocess.run([FFMPEG_EXE, "-y", "-ss", "00:00:01.6", "-i", path, "-vframes", "1", f2_path], capture_output=True)
    
    if os.path.exists(f1_path) and os.path.exists(f2_path):
        i1 = Image.open(f1_path).convert("RGB")
        i2 = Image.open(f2_path).convert("RGB")
        diff = ImageChops.difference(i1, i2)
        arr = np.array(diff, dtype=np.float32)
        mean_delta = float(np.mean(arr))
        if mean_delta > 0.8:
            report["motion_gate"] = "PASS"
            
    # Product Gate: Check if assets in manifest exist
    if os.path.exists(sc["sku1"]["asset"]) and os.path.exists(sc["sku2"]["asset"]):
        report["product_gate"] = "PASS"
        
    # Audio Gate: Check if AAC and duration matches
    if "Audio: aac" in out:
        report["audio_gate"] = "PASS"
        
    # Technical Gate
    if report["resolution"] == "1080x1920" and report["fps"] == 30 and abs(report["duration"] - 21.36) < 0.5:
        report["tech_gate"] = "PASS"
        
    if report["motion_gate"] == "PASS" and report["product_gate"] == "PASS" and report["audio_gate"] == "PASS" and report["tech_gate"] == "PASS":
        report["overall"] = "PASS"
        
    return report

def run_full_qc():
    results = []
    print(f"{'SC':<4} {'TITLE':<32} {'LANG':<5} {'DUR':<6} {'RES':<10} {'MOTION':<8} {'PROD':<8} {'TECH':<8} {'OVERALL':<8}")
    print("-" * 95)
    
    for sc_id in range(1, 16):
        for lang in ["hi", "te"]:
            rep = verify_single_video(sc_id, lang)
            results.append(rep)
            print(f"{rep['scenario']:<4} {rep['title'][:30]:<32} {rep['lang'].upper():<5} {rep['duration']:<6} {rep['resolution']:<10} {rep['motion_gate']:<8} {rep['product_gate']:<8} {rep['tech_gate']:<8} {rep['overall']:<8}")
            
    passed = sum(1 for r in results if r['overall'] == 'PASS')
    print("-" * 95)
    print(f"TOTAL VIDEOS VERIFIED: {len(results)} | PASSED: {passed} / {len(results)}")
    
    with open("qc_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run_full_qc()
