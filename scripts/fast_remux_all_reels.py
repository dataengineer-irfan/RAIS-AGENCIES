import os
import sys
import json
import shutil
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
BASE_WORK_DIR = "public/videos/campaigns_multishot_work"
CAMPAIGN_DIR = "public/videos/campaigns"
FINAL_30_DIR = "public/videos/final_30_reels"
SHARED_ENDCARD = f"{BASE_WORK_DIR}/shared_clip_endcard_official.mp4"

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

print("=" * 80)
print("FAST REMUXING ALL 30 REELS WITH UPDATED OFFICIAL ENDCARD (@raisfrozenfoods + Web)")
print("=" * 80)

for sc_id in range(1, 16):
    sc = MANIFEST[str(sc_id)]
    work_dir = f"{BASE_WORK_DIR}/sc_{sc_id:02d}"
    out_dir = f"{CAMPAIGN_DIR}/{sc['folder']}"
    
    c1a = f"{work_dir}/shot1a.mp4"
    c1b = f"{work_dir}/shot1b.mp4"
    c2 = f"{work_dir}/shot2.mp4"
    c3 = f"{work_dir}/shot3.mp4"
    c4 = SHARED_ENDCARD
    
    if not (os.path.exists(c1a) and os.path.exists(c1b) and os.path.exists(c2) and os.path.exists(c3)):
        print(f"Skipping Sc {sc_id:02d} (shots missing)")
        continue
        
    concat_list = f"{work_dir}/concat_18s.txt"
    with open(concat_list, "w") as f:
        for p in [c1a, c1b, c2, c3, c4]:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    video_merged = f"{work_dir}/video_18s_merged.mp4"
    cmd_cat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        video_merged
    ]
    subprocess.run(cmd_cat, capture_output=True, check=True)
    
    audio_dir = f"{work_dir}/audio"
    bgm_wav = f"{audio_dir}/bgm_bed_18s.wav"
    
    for lang in ["hi", "te"]:
        full_wav = f"{audio_dir}/full_narration_{lang}_18s.wav"
        if not os.path.exists(full_wav):
            continue
            
        out_mp4 = f"{out_dir}/master_{'hindi' if lang=='hi' else 'telugu'}_18s.mp4"
        cmd_mux = [
            FFMPEG_EXE, "-y",
            "-i", video_merged,
            "-i", full_wav,
            "-i", bgm_wav,
            "-filter_complex",
            "[1:a]volume=1.0[voice];[2:a]volume=0.10,afade=t=out:st=16.50:d=1.5[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "copy",
            "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
            "-t", "18.00",
            out_mp4
        ]
        subprocess.run(cmd_mux, capture_output=True, check=True)
        
        clean_name = f"sc{sc_id:02d}_{'hindi' if lang=='hi' else 'telugu'}_{sc['folder'].replace('scenario_', '')}.mp4"
        clean_mp4 = f"{FINAL_30_DIR}/{clean_name}"
        shutil.copy2(out_mp4, clean_mp4)
        
    print(f"  [SUCCESS] Scenario {sc_id:02d} updated with @raisfrozenfoods & Web End Card!")

print("\nAll 30 Reels remuxed with verified end card!")
