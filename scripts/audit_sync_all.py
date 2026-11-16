import json
import asyncio
import edge_tts
import os
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

async def test_all_scenarios():
    with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
        manifest = json.load(f)
    
    os.makedirs("scripts/sync_audit", exist_ok=True)
    windows = [(0.2, 3.2), (3.3, 7.8), (7.9, 12.8), (13.0, 17.5)]
    delays = [0.2, 3.3, 7.9, 13.0]
    
    total_lines = 0
    overflow_count = 0
    
    for sc_id in range(1, 16):
        sc = manifest[str(sc_id)]
        print(f"\n--- Scenario {sc_id:02d}: {sc['title']} ---")
        for lang, voice in [("hi", "hi-IN-SwaraNeural"), ("te", "te-IN-ShrutiNeural")]:
            texts = sc["audio_hi"] if lang == "hi" else sc["audio_te"]
            for idx, text in enumerate(texts):
                rate = "+32%" if idx == 3 else ("+26%" if lang == "hi" else "+22%")
                total_lines += 1
                f_out = f"scripts/sync_audit/sc{sc_id:02d}_{lang}_{idx+1}.mp3"
                comm = edge_tts.Communicate(text, voice, rate=rate)
                await comm.save(f_out)
                dur = get_dur(f_out)
                start_t = delays[idx]
                end_t = start_t + dur
                max_w = windows[idx][1]
                overflow = end_t - max_w
                status = "PERFECT" if overflow <= 0.0 else (f"CLOSE (+{overflow:.2f}s)" if overflow <= 0.2 else f"OVERFLOW (+{overflow:.2f}s)")
                if overflow > 0.2:
                    overflow_count += 1
                print(f"  [{lang.upper()} L{idx+1}] Start: {start_t:.1f}s | Dur: {dur:.2f}s | End: {end_t:.2f}s | Cut: {max_w:.1f}s -> {status}")
                if overflow > 0.2:
                    print(f"    --> Text: {text}")

    print(f"\nTotal lines tested: {total_lines}, Overflows > 0.2s: {overflow_count}")

if __name__ == "__main__":
    asyncio.run(test_all_scenarios())
