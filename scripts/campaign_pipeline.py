import os
import subprocess
import json
import asyncio
from PIL import Image, ImageDraw, ImageFont

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_PATH = r"C:\Windows\Fonts\Nirmala.ttc"

async def generate_narration(text: str, voice: str, output_path: str, rate: str = "+15%"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    import edge_tts
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(output_path)
    print(f"Generated narration: {output_path}")

def generate_audio_bed(duration: float, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={duration:.2f}:c=pink:r=44100:a=0.035,lowpass=f=750[rain];"
              f"sine=f=220:d={duration:.2f},volume=0.025[tone1];"
              f"sine=f=330:d={duration:.2f},volume=0.02[tone2];"
              f"sine=f=440:d={duration:.2f},volume=0.015[tone3];"
              "[rain][tone1][tone2][tone3]amix=inputs=4:duration=first:dropout_transition=2,volume=0.15",
        "-ac", "2",
        "-b:a", "128k",
        output_path
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"Generated audio bed: {output_path}")

def make_overlay(scene, work_dir):
    if not scene.get("badge"):
        return None
    overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Top branded pill
    top_font = ImageFont.truetype(FONT_PATH, 24)
    draw.rounded_rectangle([180, 80, 900, 140], radius=28, fill=(10, 15, 26, 220), outline=(212, 175, 55, 220), width=2)
    draw.text((540, 110), "RAIS AGENCIES • RAYACHOTY • WHOLESALE", font=top_font, fill=(212, 175, 55), anchor="mm")
    
    # Lower-third card
    cy1, cy2 = 1440, 1740
    draw.rounded_rectangle([50, cy1, 1030, cy2], radius=24, fill=(8, 12, 22, 235), outline=(212, 175, 55, 220), width=3)
    draw.line([(80, cy1 + 65), (1000, cy1 + 65)], fill=(212, 175, 55, 120), width=1)
    
    # Badge tag
    badge_font = ImageFont.truetype(FONT_PATH, 22)
    draw.text((540, cy1 + 32), scene["badge"], font=badge_font, fill=(212, 175, 55), anchor="mm")
    
    # Primary subtitle line
    primary_font = ImageFont.truetype(FONT_PATH, 28)
    draw.text((542, cy1 + 105), scene["primary_text"], font=primary_font, fill=(0, 0, 0, 220), anchor="mm")
    draw.text((540, cy1 + 103), scene["primary_text"], font=primary_font, fill=(255, 255, 255, 255), anchor="mm")
    
    # Secondary translation line
    sec_font = ImageFont.truetype(FONT_PATH, 24)
    draw.text((540, cy1 + 165), scene["secondary_text"], font=sec_font, fill=(229, 192, 123, 255), anchor="mm")
    
    out_path = os.path.join(work_dir, f"overlay_sc{scene['id']}.png")
    overlay.save(out_path)
    return out_path

def compile_campaign_reel(campaign_config: dict) -> str:
    work_dir = campaign_config["work_dir"]
    output_video = campaign_config["output_video"]
    os.makedirs(work_dir, exist_ok=True)
    os.makedirs(os.path.dirname(output_video), exist_ok=True)
    
    clip_paths = []
    
    for sc in campaign_config["scenes"]:
        clip_path = os.path.join(work_dir, f"clip_{sc['id']}.mp4")
        overlay_path = make_overlay(sc, work_dir)
        
        print(f"Compiling Scene {sc['id']}: {sc['name']} ({sc['duration']}s)...")
        if overlay_path:
            vf = (
                f"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,"
                f"crop=1080:1920,"
                f"zoompan=z='min(zoom+0.0005,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={sc['frames']}:s=1080x1920:fps=30[z];"
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
            # Fullscreen card
            vf = (
                f"scale=1080:1920,"
                f"zoompan=z='min(zoom+0.0002,1.03)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={sc['frames']}:s=1080x1920:fps=30"
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

    # Mux with Audio
    narration_audio = campaign_config["narration_audio"]
    bgm_audio = campaign_config["bgm_audio"]
    
    cmd_mux = [
        FFMPEG_EXE, "-y",
        "-i", temp_video,
        "-i", narration_audio,
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
    print(f"Master Video Compiled: {output_video}")
    return output_video

def verify_video(video_path: str):
    res = subprocess.run([FFMPEG_EXE, "-i", video_path], capture_output=True, text=True)
    lines = [l.strip() for l in res.stderr.splitlines() if any(k in l for k in ["Duration", "Stream #0:0", "Stream #0:1"])]
    stat = os.stat(video_path)
    print("\n--- TECHNICAL VALIDATION ---")
    print(f"Path: {video_path}")
    print(f"Size: {stat.st_size:,} bytes")
    for l in lines:
        print(f"  {l}")
    return True
