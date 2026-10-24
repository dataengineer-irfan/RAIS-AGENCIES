import os
import subprocess
import json
from PIL import Image, ImageDraw, ImageFont

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_PATH = r"C:\Windows\Fonts\Nirmala.ttc"
WORK_DIR = "public/videos/build_cache"
FINAL_OUTPUT = "public/videos/campaign_01_monsoon_crispy.mp4"

SCENES = [
    {
        "id": 1,
        "name": "monsoon_craving",
        "duration": 4.0,
        "frames": 120,
        "image": "public/images/3d_presenter_ananya_rain.jpg",
        "badge": "3D PRESENTER ANANYA • RAYACHOTY MONSOON",
        "telugu": "వర్షం పడుతుందా? వేడి వేడిగా, క్రిస్పీగా తినాలనిపిస్తుందా?",
        "english": "Rain outside? Craving something piping hot and crispy?"
    },
    {
        "id": 2,
        "name": "crispy_food_reveal",
        "duration": 5.0,
        "frames": 150,
        "image": "public/images/products/chicken_momos.jpg",
        "badge": "ITC MASTER CHEF & TOP BRANDS • 100% QUALITY",
        "telugu": "చికెన్ స్నాక్స్, ఫ్రెంచ్ ఫ్రైస్, ఇంకా మీ ఫేవరెట్ ఫ్రోజెన్ ఫుడ్స్!",
        "english": "Chicken snacks, French Fries & delicious frozen delights!"
    },
    {
        "id": 3,
        "name": "family_community",
        "duration": 6.0,
        "frames": 180,
        "image": "public/images/3d_presenter_serving_family.jpg",
        "badge": "HOTELS • RESTAURANTS • FAST FOOD CENTRES",
        "telugu": "రాయచోటి హోటల్స్, రెస్టారెంట్స్ కోసం డైరెక్ట్ హోల్‌సేల్ సప్లై!",
        "english": "Direct wholesale cold supply for Rayachoty B2B businesses!"
    },
    {
        "id": 4,
        "name": "cold_chain_showcase",
        "duration": 5.0,
        "frames": 150,
        "image": "public/images/3d_presenter_product_showcase.jpg",
        "badge": "COLD CHAIN LOGISTICS • -18°C GUARANTEED",
        "telugu": "మీ బిజినెస్‌కి కావలసిన క్వాలిటీ ప్రొడక్ట్స్ కోసం ఇప్పుడే DM చేయండి!",
        "english": "DM @raisfrozenfoods now for verified wholesale supply!"
    },
    {
        "id": 5,
        "name": "brand_end_card",
        "duration": 5.30,
        "frames": 159,
        "image": "public/images/scene_05_brand_cta.png",
        "badge": None, # Native on card
        "telugu": None,
        "english": None
    }
]

def make_overlay(scene):
    if not scene["badge"]:
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
    
    # Inner gold accent divider
    draw.line([(80, cy1 + 65), (1000, cy1 + 65)], fill=(212, 175, 55, 120), width=1)
    
    # Badge tag
    badge_font = ImageFont.truetype(FONT_PATH, 22)
    draw.text((540, cy1 + 32), scene["badge"], font=badge_font, fill=(212, 175, 55), anchor="mm")
    
    # Telugu line
    te_font = ImageFont.truetype(FONT_PATH, 28)
    draw.text((542, cy1 + 105), scene["telugu"], font=te_font, fill=(0, 0, 0, 220), anchor="mm")
    draw.text((540, cy1 + 103), scene["telugu"], font=te_font, fill=(255, 255, 255, 255), anchor="mm")
    
    # English line
    en_font = ImageFont.truetype(FONT_PATH, 24)
    draw.text((540, cy1 + 165), scene["english"], font=en_font, fill=(229, 192, 123, 255), anchor="mm")
    
    out_path = os.path.join(WORK_DIR, f"overlay_sc{scene['id']}.png")
    overlay.save(out_path)
    return out_path

def render_scenes():
    os.makedirs(WORK_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(FINAL_OUTPUT), exist_ok=True)
    
    clip_paths = []
    
    for sc in SCENES:
        clip_path = os.path.join(WORK_DIR, f"clip_{sc['id']}.mp4")
        overlay_path = make_overlay(sc)
        
        print(f"Rendering Scene {sc['id']}: {sc['name']} ({sc['duration']}s)...")
        
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
            # Scene 5 brand end card
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
            
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error rendering scene {sc['id']}: {res.stderr}")
            return False
        
        clip_paths.append(clip_path)
        print(f"  Scene {sc['id']} rendered: {clip_path}")
        
    # Concat clips
    concat_list = os.path.join(WORK_DIR, "concat_list.txt")
    with open(concat_list, "w") as f:
        for p in clip_paths:
            f.write(f"file '{os.path.abspath(p).replace('\\', '/')}'\n")
            
    temp_video = os.path.join(WORK_DIR, "video_merged_silent.mp4")
    cmd_concat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        temp_video
    ]
    res_concat = subprocess.run(cmd_concat, capture_output=True, text=True)
    if res_concat.returncode != 0:
        print("Concat error:", res_concat.stderr)
        return False
    print("Video segments concatenated successfully.")
    
    # Audio Muxing
    narration_path = "public/audio/campaign_01_narration.mp3"
    bgm_path = "public/audio/campaign_01_bgm.mp3"
    
    print("Muxing audio & video streams...")
    cmd_final = [
        FFMPEG_EXE, "-y",
        "-i", temp_video,
        "-i", narration_path,
        "-i", bgm_path,
        "-filter_complex",
        "[1:a]volume=1.0[voice];[2:a]volume=0.14[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
        "-shortest",
        FINAL_OUTPUT
    ]
    res_final = subprocess.run(cmd_final, capture_output=True, text=True)
    if res_final.returncode != 0:
        print("Final muxing error:", res_final.stderr)
        return False
        
    print(f"\n[SUCCESS] FINAL VIDEO RENDERED SUCCESSFULLY AT: {FINAL_OUTPUT}")
    return True

if __name__ == "__main__":
    success = render_scenes()
    if not success:
        exit(1)
