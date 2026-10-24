import os
import subprocess
import asyncio
from PIL import Image, ImageDraw, ImageFont

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_PATH = r"C:\Windows\Fonts\Nirmala.ttc"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"

def make_overlay(scene, work_dir):
    if not scene.get("badge"):
        return None
    overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Top branded pill in safe area
    try:
        top_font = ImageFont.truetype(FONT_BOLD, 26)
    except:
        top_font = ImageFont.load_default()
    draw.rounded_rectangle([160, 90, 920, 155], radius=30, fill=(10, 15, 26, 225), outline=(212, 175, 55, 220), width=2)
    draw.text((540, 122), "RAIS AGENCIES • RAYACHOTY", font=top_font, fill=(212, 175, 55), anchor="mm")
    
    # Lower-third card in Instagram safe area (y: 1410 to 1720)
    cy1, cy2 = 1410, 1720
    draw.rounded_rectangle([50, cy1, 1030, cy2], radius=24, fill=(8, 12, 22, 240), outline=(212, 175, 55, 230), width=3)
    draw.line([(80, cy1 + 60), (1000, cy1 + 60)], fill=(212, 175, 55, 120), width=1)
    
    # Badge tag
    badge_font = ImageFont.truetype(FONT_BOLD, 22)
    draw.text((540, cy1 + 30), scene["badge"], font=badge_font, fill=(212, 175, 55), anchor="mm")
    
    # Primary subtitle line (Hindi / Telugu)
    primary_font = ImageFont.truetype(FONT_PATH, 28)
    draw.text((542, cy1 + 102), scene["primary_text"], font=primary_font, fill=(0, 0, 0, 240), anchor="mm")
    draw.text((540, cy1 + 100), scene["primary_text"], font=primary_font, fill=(255, 255, 255, 255), anchor="mm")
    
    # Secondary translation line (English)
    sec_font = ImageFont.truetype(FONT_BOLD, 24)
    draw.text((540, cy1 + 160), scene["secondary_text"], font=sec_font, fill=(229, 192, 123, 255), anchor="mm")
    
    out_path = os.path.join(work_dir, f"overlay_sc{scene['id']}.png")
    overlay.save(out_path)
    return out_path

def generate_audio_bed(duration: float, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fade_start = duration - 2.0
    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={duration:.2f}:c=pink:r=44100:a=0.032,lowpass=f=750[rain];"
              f"sine=f=220:d={duration:.2f},volume=0.022[t1];"
              f"sine=f=330:d={duration:.2f},volume=0.018[t2];"
              f"sine=f=440:d={duration:.2f},volume=0.012[t3];"
              f"[rain][t1][t2][t3]amix=inputs=4:duration=first:dropout_transition=2,volume=0.14,afade=t=out:st={fade_start:.2f}:d=2.0",
        "-ac", "2",
        "-b:a", "128k",
        output_path
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"Generated audio bed: {output_path} (Duration: {duration}s)")

def compile_scene_clips(scenes, work_dir):
    clip_paths = []
    for sc in scenes:
        clip_path = os.path.join(work_dir, f"clip_{sc['id']}.mp4")
        overlay_path = make_overlay(sc, work_dir)
        print(f"Compiling Scene {sc['id']}: {sc['name']} ({sc['duration']}s / {sc['frames']} frames)...")
        
        if overlay_path:
            vf = (
                f"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,"
                f"crop=1080:1920,"
                f"zoompan=z='min(zoom+0.0004,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={sc['frames']}:s=1080x1920:fps=30[z];"
                f"[z][1:v]overlay=0:0:shortest=1[out]"
            )
            cmd = [
                FFMPEG_EXE, "-y",
                "-loop", "1", "-i", sc["image"],
                "-loop", "1", "-i", overlay_path,
                "-filter_complex", vf,
                "-map", "[out]",
                "-t", str(sc["duration"]),
                "-c:v", "libx264", "-preset", "fast", "-crf", "18",
                "-pix_fmt", "yuv420p", "-r", "30",
                clip_path
            ]
        else:
            # Fullscreen branded card with subtle drift
            vf = (
                f"scale=1080:1920,"
                f"zoompan=z='min(zoom+0.00015,1.025)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={sc['frames']}:s=1080x1920:fps=30"
            )
            cmd = [
                FFMPEG_EXE, "-y",
                "-loop", "1", "-i", sc["image"],
                "-vf", vf,
                "-t", str(sc["duration"]),
                "-c:v", "libx264", "-preset", "fast", "-crf", "18",
                "-pix_fmt", "yuv420p", "-r", "30",
                clip_path
            ]
        subprocess.run(cmd, capture_output=True, check=True)
        clip_paths.append(clip_path)
    return clip_paths

def assemble_full_reel(clip_paths, voice_audio, bgm_audio, output_video, work_dir):
    # Concat clips
    concat_list = os.path.join(work_dir, "concat_list.txt")
    with open(concat_list, "w") as f:
        for p in clip_paths:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    temp_video = os.path.join(work_dir, "merged_video.mp4")
    cmd_concat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        temp_video
    ]
    subprocess.run(cmd_concat, capture_output=True, check=True)
    
    # Audio mux with smooth balance
    cmd_mux = [
        FFMPEG_EXE, "-y",
        "-i", temp_video,
        "-i", voice_audio,
        "-i", bgm_audio,
        "-filter_complex",
        "[1:a]volume=1.0[voice];[2:a]volume=0.14[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
        "-shortest",
        output_video
    ]
    subprocess.run(cmd_mux, capture_output=True, check=True)
    print(f"Master Export Ready: {output_video}")
    return output_video

def verify_technical_specs(video_path: str):
    res = subprocess.run([FFMPEG_EXE, "-i", video_path], capture_output=True, text=True)
    lines = [l.strip() for l in res.stderr.splitlines() if any(k in l for k in ["Duration", "Stream #0:0", "Stream #0:1"])]
    stat = os.stat(video_path)
    print(f"\n==================================================")
    print(f" TECHNICAL VERIFICATION: {os.path.basename(video_path)}")
    print(f"==================================================")
    print(f"Path: {video_path}")
    print(f"File Size: {stat.st_size:,} bytes")
    for l in lines:
        print(f"  {l}")
    print(f"==================================================\n")
    return True
