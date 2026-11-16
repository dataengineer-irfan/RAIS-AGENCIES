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

windows = [(0.2, 3.2), (3.3, 7.8), (7.9, 12.8), (13.0, 17.5)]
delays = [0.2, 3.3, 7.9, 13.0]

total = 0
overflows = 0

print("=== 18-SECOND TIMELINE SYNC AUDIT ===")
for sc in range(1, 16):
    for lang in ["hi", "te"]:
        for l in range(1, 5):
            total += 1
            f = f"scripts/sync_audit/sc{sc:02d}_{lang}_{l}.mp3"
            d = get_dur(f)
            start_t = delays[l-1]
            end_t = start_t + d
            max_t = windows[l-1][1]
            diff = end_t - max_t
            if diff > 0.15:
                overflows += 1
                print(f"  [OVERFLOW] Sc {sc:02d} {lang.upper()} L{l}: Start {start_t}s + Dur {d:.2f}s = End {end_t:.2f}s (Max {max_t}s) -> Over by {diff:.2f}s")

print(f"\nTotal lines: {total} | Overflows > 0.15s: {overflows}")
