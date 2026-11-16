import asyncio
import edge_tts
import subprocess
import os
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

async def verify_tight_sync():
    os.makedirs("scripts/sync_test", exist_ok=True)
    
    # Precise timeline windows:
    # Shot 1 (0.0s - 3.6s): Hook + Craving
    # Shot 2 (3.6s - 8.4s): Hero Product (4.8s window)
    # Shot 3 (8.4s - 13.0s): Paired Product & Packaging (4.6s window)
    # Shot 4 (13.0s - 21.37s): Official Brand End Card (8.37s window)
    
    lines_hi = [
        "बारिश का मौसम और कुछ गरमा-गरम खाने का मन?",
        "ट्राई कीजिए Triken Chicken Momos का असली टेस्ट!",
        "साथ में क्रिस्पी Amul French Fries और फूड पैकेजिंग बॉक्सेस!",
        "होलसेल सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies रायचोटी!"
    ]
    
    delays = [200, 3600, 8400, 13000]
    
    print("\n=== Testing Optimized Hindi Speech ===")
    for idx, text in enumerate(lines_hi):
        f_out = f"scripts/sync_test/hi_tight_{idx+1}.mp3"
        comm = edge_tts.Communicate(text, "hi-IN-SwaraNeural", rate="+25%")
        await comm.save(f_out)
        d = get_dur(f_out)
        start_t = delays[idx] / 1000.0
        end_t = start_t + d
        print(f"  Line {idx+1}: Start={start_t:.2f}s | Duration={d:.2f}s | End={end_t:.2f}s | Text: {text}")

if __name__ == "__main__":
    asyncio.run(verify_tight_sync())
