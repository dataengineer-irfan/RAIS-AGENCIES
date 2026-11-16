import os
import sys
import json
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
CAMPAIGN_DIR = "public/videos/campaigns"
MANIFEST_PATH = "scripts/product_manifest.json"

with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

def run_probe(file_path):
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
    lra = 0.0
    true_peak = -99.0
    
    lines = out.splitlines()
    for idx, line in enumerate(lines):
        if "Integrated loudness:" in line:
            for next_line in lines[idx:idx+6]:
                if "I:" in next_line and "LUFS" in next_line:
                    try:
                        i_lufs = float(next_line.split("I:")[1].replace("LUFS", "").strip())
                    except Exception:
                        pass
        if "Loudness range:" in line:
            for next_line in lines[idx:idx+6]:
                if "LRA:" in next_line and "LU" in next_line:
                    try:
                        lra = float(next_line.split("LRA:")[1].replace("LU", "").strip())
                    except Exception:
                        pass
        if "True peak:" in line:
            for next_line in lines[idx:idx+6]:
                if "Peak:" in next_line and "dBFS" in next_line:
                    try:
                        true_peak = float(next_line.split("Peak:")[1].replace("dBFS", "").strip())
                    except Exception:
                        pass
    return i_lufs, lra, true_peak

def main():
    print("=" * 100)
    print("RAIS AGENCIES — 30-REEL MASTER CAMPAIGN AUTOMATED QA AUDIT")
    print("=" * 100)
    
    results = []
    environments_seen = set()
    
    for sc_id in range(1, 16):
        sc = MANIFEST[str(sc_id)]
        folder = sc["folder"]
        char_img = os.path.basename(sc["character"])
        environments_seen.add(char_img)
        
        for lang in ["hi", "te"]:
            filename = f"master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4"
            filepath = f"{CAMPAIGN_DIR}/{folder}/{filename}"
            
            if not os.path.exists(filepath):
                print(f"[MISSING] {filepath}")
                continue
                
            size_mb = os.path.getsize(filepath) / (1024 * 1024)
            dur, res_str, fps, has_v, has_a = run_probe(filepath)
            i_lufs, lra, true_peak = measure_ebur128(filepath)
            mean_14, max_14 = measure_window_volume(filepath, 14.0, 2.5)
            
            res_dict = {
                "sc_id": sc_id,
                "title": sc["title"],
                "lang": lang,
                "file": filepath,
                "size_mb": round(size_mb, 2),
                "dur": round(dur, 2),
                "res": res_str,
                "fps": fps,
                "i_lufs": round(i_lufs, 2),
                "true_peak": round(true_peak, 2),
                "mean_14_16": round(mean_14, 2),
                "max_14_16": round(max_14, 2),
                "environment": char_img,
                "sku1": sc["sku1"]["name"],
                "sku2": sc["sku2"]["name"],
                "passed": (dur >= 21.0 and res_str == "1080x1920" and fps == 30.0 and has_v and has_a and mean_14 > -30.0)
            }
            results.append(res_dict)
            status = "PASS" if res_dict["passed"] else "FAIL"
            print(f"[{status}] Sc {sc_id:02d} ({lang.upper()}) | {dur:.2f}s | {res_str} @ {fps:.0f}fps | Env: {char_img[:20]} | 14-16s Mean: {mean_14:.1f}dB | LUFS: {i_lufs:.1f}")

    print("\n" + "=" * 100)
    print("AUDIT SUMMARY:")
    print(f"Total Videos Verified: {len(results)} / 30")
    print(f"Total Unique Environments: {len(environments_seen)} / 15")
    pass_count = sum(1 for r in results if r["passed"])
    print(f"Passed All Checks: {pass_count} / {len(results)}")
    print("=" * 100)
    
    with open("scripts/qa_audit_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()
