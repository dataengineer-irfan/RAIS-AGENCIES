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

async def verify_scenario_sync():
    os.makedirs("scripts/sync_test", exist_ok=True)
    
    # Precise timeline points:
    # Shot 1 (Hook + Ayesha): 0.0s - 3.8s (delay: 200ms)
    # Shot 2 (Hero Momos): 3.8s - 8.4s (delay: 3800ms)
    # Shot 3 (Fries + Box): 8.4s - 13.2s (delay: 8400ms)
    # Shot 4 (End Card): 13.2s - 21.37s (delay: 13200ms)
    
    lines_hi = [
        "बारिश का मौसम और कुछ गरमा-गरम खाने का मन?",
        "ट्राई कीजिए Triken Chicken Momos — रेस्टोरेंट जैसा असली स्वाद!",
        "साथ में क्रिस्पी Amul French Fries और फूड पैकेजिंग बॉक्सेस!",
        "होलसेल और कैफे सप्लाइ के लिए WhatsApp करें 9347453135 — RAIS Agencies रायचोटी!"
    ]
    
    lines_te = [
        "చల్లని వర్షం పడుతుంటే వేడి వేడిగా ఏదైనా తినాలనిపిస్తుందా?",
        "ట్రై చేయండి రుచికరమైన Triken Chicken Momos!",
        "గోల్డెన్ Amul French Fries మరియు ప్రీమియం ప్యాకేజింగ్ బాక్సెస్!",
        "హోల్‌సేల్ సప్లై కోసం WhatsApp చేయండి 9347453135 — RAIS Agencies రాయచోటి!"
    ]
    
    delays = [200, 3800, 8400, 13200]
    
    for lang, voice, rate, lines in [("hi", "hi-IN-SwaraNeural", "+25%", lines_hi), ("te", "te-IN-ShrutiNeural", "+18%", lines_te)]:
        print(f"\n=== Testing {lang.upper()} Timeline Synchronization ===")
        files = []
        for idx, text in enumerate(lines):
            f_out = f"scripts/sync_test/{lang}_line_{idx+1}.mp3"
            comm = edge_tts.Communicate(text, voice, rate=rate)
            await comm.save(f_out)
            d = get_dur(f_out)
            start_t = delays[idx] / 1000.0
            end_t = start_t + d
            files.append(f_out)
            print(f"  Line {idx+1}: Start={start_t:.2f}s | Duration={d:.2f}s | End={end_t:.2f}s | Text: {text[:35]}...")
            
        # Check that each line fits inside its video shot window!
        # Window 1: 0.0 - 3.8s
        # Window 2: 3.8 - 8.4s
        # Window 3: 8.4 - 13.2s
        # Window 4: 13.2 - 21.37s
        d1 = get_dur(files[0])
        d2 = get_dur(files[1])
        d3 = get_dur(files[2])
        d4 = get_dur(files[3])
        
        print(f"  Window 1 (0.0s - 3.8s, Hook): Line 1 ends at {0.2 + d1:.2f}s (OK: {0.2 + d1 <= 4.0})")
        print(f"  Window 2 (3.8s - 8.4s, Momos): Line 2 ends at {3.8 + d2:.2f}s (OK: {3.8 + d2 <= 8.5})")
        print(f"  Window 3 (8.4s - 13.2s, Fries+Box): Line 3 ends at {8.4 + d3:.2f}s (OK: {8.4 + d3 <= 13.3})")
        print(f"  Window 4 (13.2s - 21.37s, End Card): Line 4 ends at {13.2 + d4:.2f}s (OK: {13.2 + d4 <= 21.37})")

if __name__ == "__main__":
    asyncio.run(verify_scenario_sync())
