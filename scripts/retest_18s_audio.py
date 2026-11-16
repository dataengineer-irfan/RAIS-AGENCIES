import json
import asyncio
import edge_tts
import os
import shutil
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')
FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"

def get_dur(f):
    res = subprocess.run([FFMPEG_EXE, "-i", f], capture_output=True, text=True)
    for l in res.stderr.splitlines():
        if "Duration:" in l:
            t = l.split("Duration:")[1].split(",")[0].strip()
            h, m, s = t.split(":")
            return float(h)*3600 + float(m)*60 + float(s)
    return 0.0

async def main():
    audit_dir = "scripts/sync_audit_18s"
    if os.path.exists(audit_dir):
        shutil.rmtree(audit_dir)
    os.makedirs(audit_dir, exist_ok=True)
    
    with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
        manifest = json.load(f)
        
    windows = [(0.2, 3.2), (3.3, 7.8), (7.9, 12.8), (13.0, 17.2)]
    delays = [0.2, 3.3, 7.9, 13.0]
    
    total = 0
    overflows = 0
    
    print("=== TESTING 18-SECOND NARRATION DURATIONS ===")
    for sc_id in range(1, 16):
        sc = manifest[str(sc_id)]
        for lang, voice in [("hi", "hi-IN-SwaraNeural"), ("te", "te-IN-ShrutiNeural")]:
            texts = sc["audio_hi"] if lang == "hi" else sc["audio_te"]
            for idx, text in enumerate(texts):
                total += 1
                rate = "+35%" if idx == 3 else ("+28%" if lang == "hi" else "+24%")
                f_out = f"{audit_dir}/sc{sc_id:02d}_{lang}_{idx+1}.mp3"
                comm = edge_tts.Communicate(text, voice, rate=rate)
                await comm.save(f_out)
                dur = get_dur(f_out)
                start_t = delays[idx]
                end_t = start_t + dur
                max_w = windows[idx][1]
                diff = end_t - max_w
                if diff > 0.15:
                    overflows += 1
                    print(f"  [OVERFLOW] Sc {sc_id:02d} ({lang.upper()}) L{idx+1}: {start_t:.1f}s + {dur:.2f}s = {end_t:.2f}s (Max {max_w:.1f}s) -> +{diff:.2f}s")
                    print(f"    Text: {text}")
                else:
                    print(f"  [OK] Sc {sc_id:02d} ({lang.upper()}) L{idx+1}: {start_t:.1f}s -> {end_t:.2f}s (Max {max_w:.1f}s) | Dur: {dur:.2f}s")
                    
    print(f"\nAudit complete! Total lines: {total} | Overflows > 0.15s: {overflows}")

if __name__ == "__main__":
    asyncio.run(main())
