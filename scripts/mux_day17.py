import os
import sys
import subprocess
import shutil
import imageio_ffmpeg

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
video = r'rais-website\scratch\day17_production\day17_master_video_18s.mp4'

for lang in ['telugu', 'hindi']:
    prefix = 'te' if lang == 'telugu' else 'hi'
    audio = f'rais-website/scratch/day17_audio/day17_{prefix}_mixed.wav'
    out_mp4 = f'rais-website/public/videos/day17_{lang}_18s.mp4'
    desktop_mp4 = f'C:/Users/affra/Desktop/RAIS_Day17_{lang.title()}_18s.mp4'
    final_30_mp4 = f'rais-website/public/videos/final_30_reels/sc02_{lang}_02_midnight_hunger.mp4'
    
    cmd = [
        ffmpeg, '-y',
        '-i', video,
        '-i', audio,
        '-c:v', 'copy',
        '-c:a', 'aac', '-b:a', '192k',
        '-t', '18.0',
        out_mp4
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f'{lang.upper()} mux result: {res.returncode}')
    if res.returncode == 0:
        shutil.copy2(out_mp4, desktop_mp4)
        shutil.copy2(out_mp4, final_30_mp4)
        print(f'  ✓ Saved: {desktop_mp4} ({os.path.getsize(desktop_mp4)} bytes)')
    else:
        print(f'  ✗ Error: {res.stderr}')

print("\nAll done!")
