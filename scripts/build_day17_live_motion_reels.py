import os
import sys
import subprocess
import shutil
import math
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
BASE_DIR = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website"
SCRATCH_DIR = os.path.join(BASE_DIR, "scratch", "day17_production")
OUT_DIR = os.path.join(BASE_DIR, "public", "videos")
FINAL_30_DIR = os.path.join(BASE_DIR, "public", "videos", "final_30_reels")
DESKTOP_DIR = r"C:\Users\affra\Desktop"
SOURCE_REEL = os.path.join(BASE_DIR, "scratch", "full_instagram_reel_DfaSjTiu6sb.mp4")
IMG_ROUTE = os.path.join(BASE_DIR, "public", "images", "ref-assets", "rais_location_indel_bank_route.jpg")
IMG_STOREFRONT = os.path.join(BASE_DIR, "public", "images", "ref-assets", "rais_storefront_official.jpg")
IMG_PRESENTER = os.path.join(BASE_DIR, "public", "images", "ref-assets", "rais_red_suit_presenter_master.jpg")
PURE_BGM = os.path.join(BASE_DIR, "render_work_backup", "campaigns_multishot_work", "sc_02", "audio", "bgm_bed_18s.wav")

os.makedirs(SCRATCH_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(FINAL_30_DIR, exist_ok=True)

# Fonts
FONT_INDIAN = r"C:\Windows\Fonts\Nirmala.ttc"
FONT_ENG_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_ENG_REG = r"C:\Windows\Fonts\arial.ttf"

def get_font(path, size, index=0):
    try:
        if path.endswith('.ttc'):
            return ImageFont.truetype(path, size, index=index)
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def create_endcard_graphic(target_w=1080, target_h=1920):
    """Generates the official mandatory black-and-gold RAIS Agencies contact card."""
    canvas = Image.new("RGBA", (target_w, target_h), (8, 12, 22, 255))
    
    if os.path.exists(IMG_ROUTE):
        route_im = Image.open(IMG_ROUTE).convert("RGBA")
        im_ratio = route_im.width / route_im.height
        target_ratio = target_w / 880
        if im_ratio > target_ratio:
            nh = route_im.height
            nw = int(nh * target_ratio)
            l = (route_im.width - nw) // 2
            cropped = route_im.crop((l, 0, l + nw, nh))
        else:
            nw = route_im.width
            nh = int(nw / target_ratio)
            t = (route_im.height - nh) // 2
            cropped = route_im.crop((0, t, nw, t + nh))
        route_fitted = cropped.resize((target_w, 880), Image.Resampling.LANCZOS)
        canvas.paste(route_fitted, (0, 0))
        
        vignette = Image.new("RGBA", (target_w, 880), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(vignette)
        for y in range(400, 880):
            alpha = int(255 * ((y - 400) / 480))
            v_draw.line([(0, y), (target_w, y)], fill=(8, 12, 22, alpha))
        canvas.paste(vignette, (0, 0), vignette)
        
    draw = ImageDraw.Draw(canvas)
    draw.line([(60, 875), (target_w - 60, 875)], fill=(212, 175, 55, 230), width=4)
    
    f_brand_big = get_font(FONT_ENG_BOLD, 74)
    f_sub_gold = get_font(FONT_ENG_BOLD, 36)
    f_addr_bold = get_font(FONT_ENG_BOLD, 34)
    f_addr_reg = get_font(FONT_ENG_REG, 30)
    f_pill = get_font(FONT_ENG_BOLD, 34)
    f_phone = get_font(FONT_ENG_BOLD, 68)
    
    draw.text((target_w // 2, 940), "RAIS AGENCIES", fill=(245, 190, 35), font=f_brand_big, anchor="mm")
    draw.text((target_w // 2, 1005), "FROZEN FOOD PRODUCTS", fill=(255, 255, 255), font=f_sub_gold, anchor="mm")
    
    addr_box = [80, 1060, target_w - 80, 1370]
    draw.rounded_rectangle(addr_box, radius=20, fill=(15, 22, 38, 220), outline=(212, 175, 55, 150), width=2)
    draw.text((target_w // 2, 1115), "Near Reddies Colony,", fill=(241, 245, 249), font=f_addr_bold, anchor="mm")
    draw.text((target_w // 2, 1175), "Beside Indel Money Bank,", fill=(251, 191, 36), font=f_addr_bold, anchor="mm")
    draw.text((target_w // 2, 1235), "Rayachoty – 516269, Andhra Pradesh.", fill=(226, 232, 240), font=f_addr_reg, anchor="mm")
    draw.text((target_w // 2, 1305), "T. Sundupalli Road Hub", fill=(148, 163, 184), font=f_addr_reg, anchor="mm")
    
    draw.rounded_rectangle([100, 1420, target_w - 100, 1500], radius=16, fill=(180, 83, 9), outline=(245, 158, 11), width=2)
    draw.text((target_w // 2, 1460), "WHOLESALE ORDERS | BULK ORDERS", fill=(255, 255, 255), font=f_pill, anchor="mm")
    
    call_box = [80, 1550, target_w - 80, 1780]
    draw.rounded_rectangle(call_box, radius=24, fill=(16, 185, 129, 30), outline=(16, 185, 129, 230), width=4)
    draw.text((target_w // 2, 1605), "📞 CALL NOW", fill=(52, 211, 153), font=f_sub_gold, anchor="mm")
    draw.text((target_w // 2, 1690), "9347453135", fill=(255, 255, 255), font=f_phone, anchor="mm")
    
    draw.text((target_w // 2, 1840), "Good Food... Good Mood... with RAIS!", fill=(212, 175, 55), font=f_sub_gold, anchor="mm")
    
    out_path = os.path.join(SCRATCH_DIR, "day17_official_endcard.png")
    canvas.convert("RGB").save(out_path)
    return out_path

def build_scene_videos():
    """Extracts, formats, and generates all 5 cinematic video scenes for Day 17 (Total 18.0s)."""
    print("\n--- Generating Video Scenes for Day 17 ---")
    
    # Scene 1: Hook (0.0s - 3.5s = 3.5s)
    # Storefront + Red-Suit Presenter Hook with smooth camera push-in
    s1_mp4 = os.path.join(SCRATCH_DIR, "s1_store_hook.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-loop", "1", "-i", IMG_PRESENTER,
        "-t", "3.5",
        "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0015,1.06)':d=105:x='iw/2-(iw/zoom/2)':y='ih/3-(ih/zoom/3)':s=1080x1920:fps=30",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        s1_mp4
    ], check=True, capture_output=True)
    print("  ✓ Scene 1 (Storefront & Presenter Hook, 3.5s) ready")
    
    # Scene 2: Real Girl Speaking in Kitchen (3.5s - 7.5s = 4.0s)
    # Extracted from live reel (1.5s to 3.0s = 1.5s), looped / optical-flow stretched to 4.0s
    s2_raw = os.path.join(SCRATCH_DIR, "s2_raw_kitchen.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-ss", "00:00:01.5", "-i", SOURCE_REEL, "-t", "1.5",
        "-vf", "scale=1080:1920:flags=lanczos,fps=30",
        "-c:v", "libx264", "-crf", "18", "-an",
        s2_raw
    ], check=True, capture_output=True)
    
    # Loop back & forth to make 4.0s of continuous natural talking motion
    s2_mp4 = os.path.join(SCRATCH_DIR, "s2_kitchen_girl_4s.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-i", s2_raw,
        "-filter_complex",
        "[0:v]reverse[r];[0:v][r][0:v]concat=n=3:v=1[v];[v]trim=duration=4.0,setpts=PTS-STARTPTS[out]",
        "-map", "[out]",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        s2_mp4
    ], check=True, capture_output=True)
    print("  ✓ Scene 2 (Real Girl in Kitchen Speaking, 4.0s) ready")
    
    # Scene 3: Live Food Sizzle (7.5s - 11.5s = 4.0s)
    # Crispy fries falling, burger, pizza mozzarella cheese pull, RAIS takeout boxes
    s3_raw = os.path.join(SCRATCH_DIR, "s3_raw_food.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-ss", "00:00:03.0", "-i", SOURCE_REEL, "-t", "2.5",
        "-vf", "scale=1080:1920:flags=lanczos,fps=30",
        "-c:v", "libx264", "-crf", "18", "-an",
        s3_raw
    ], check=True, capture_output=True)
    
    s3_mp4 = os.path.join(SCRATCH_DIR, "s3_food_sizzle_4s.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-i", s3_raw,
        "-filter_complex",
        "[0:v]trim=duration=2.5[a];[0:v]setpts=0.6*PTS,trim=duration=1.5[b];[a][b]concat=n=2:v=1[v];[v]trim=duration=4.0,setpts=PTS-STARTPTS[out]",
        "-map", "[out]",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        s3_mp4
    ], check=True, capture_output=True)
    print("  ✓ Scene 3 (Live Food Sizzle, 4.0s) ready")
    
    # Scene 4: Real Girl Speaking at Brand Wall (11.5s - 14.5s = 3.0s)
    s4_raw = os.path.join(SCRATCH_DIR, "s4_raw_brand.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-ss", "00:00:05.5", "-i", SOURCE_REEL, "-t", "2.5",
        "-vf", "scale=1080:1920:flags=lanczos,fps=30",
        "-c:v", "libx264", "-crf", "18", "-an",
        s4_raw
    ], check=True, capture_output=True)
    
    s4_mp4 = os.path.join(SCRATCH_DIR, "s4_brand_girl_3s.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-i", s4_raw,
        "-filter_complex",
        "[0:v]reverse[r];[0:v][r]concat=n=2:v=1[v];[v]trim=duration=3.0,setpts=PTS-STARTPTS[out]",
        "-map", "[out]",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        s4_mp4
    ], check=True, capture_output=True)
    print("  ✓ Scene 4 (Real Girl Speaking at RAIS Wall, 3.0s) ready")
    
    # Scene 5: Landmark Route & Official Contact Card (14.5s - 18.0s = 3.5s)
    endcard_img = create_endcard_graphic()
    s5_mp4 = os.path.join(SCRATCH_DIR, "s5_endcard_3.5s.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-loop", "1", "-i", endcard_img,
        "-t", "3.5",
        "-vf", "scale=1080:1920,zoompan=z='min(zoom+0.001,1.03)':d=105:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        s5_mp4
    ], check=True, capture_output=True)
    print("  ✓ Scene 5 (Official Contact Endcard, 3.5s) ready")
    
    # Concatenate all 5 scenes -> Total 18.0 seconds
    concat_txt = os.path.join(SCRATCH_DIR, "concat_all_scenes.txt")
    with open(concat_txt, "w") as f:
        f.write(f"file '{os.path.abspath(s1_mp4).replace(chr(92), '/')}'\n")
        f.write(f"file '{os.path.abspath(s2_mp4).replace(chr(92), '/')}'\n")
        f.write(f"file '{os.path.abspath(s3_mp4).replace(chr(92), '/')}'\n")
        f.write(f"file '{os.path.abspath(s4_mp4).replace(chr(92), '/')}'\n")
        f.write(f"file '{os.path.abspath(s5_mp4).replace(chr(92), '/')}'\n")
        
    master_video_mp4 = os.path.join(SCRATCH_DIR, "day17_master_video_18s.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-f", "concat", "-safe", "0", "-i", concat_txt,
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        master_video_mp4
    ], check=True, capture_output=True)
    print(f"🎉 MASTER 18.0s VIDEO COMPILED: {master_video_mp4} ({os.path.getsize(master_video_mp4)} bytes)")
    return master_video_mp4

def compile_final_reel(lang="telugu", video_source=None):
    is_te = (lang.lower() == "telugu")
    print(f"\n=======================================================")
    print(f"🎬 PRODUCING DAY 17 MASTER REEL: {lang.upper()} (18.0 SECONDS)")
    print(f"=======================================================")
    
    # 1. Master Audio with Pure Instrumental BGM
    audio_wav = f"rais-website/scratch/day17_audio/day17_{'te' if is_te else 'hi'}_mixed.wav"
    
    # Subtitles config
    if is_te:
        sub_hook = "రాత్రి వేళ ఆకలి వేస్తోందా?"
        sub_prod = "క్రిస్పీ చికెన్ నగ్గెట్స్ & ఫ్రెంచ్ ఫ్రైస్!"
        sub_brand = "రాయచోటి RAIS ఏజెన్సీస్ • హోల్‌సేల్ సప్లై"
        sub_call = "ఆర్డర్స్ కోసం ఇప్పుడే కాల్ చేయండి: 93474 53135"
    else:
        sub_hook = "रात में अचानक भूख लगे या कैफे में रश?"
        sub_prod = "क्रिस्पी चिकन नगेट्स & फ्रेंच फ्राइज!"
        sub_brand = "रायचोटी RAIS एजेंसीज • डायरेक्ट B2B सप्लाई"
        sub_call = "ऑर्डर्स के लिए अभी कॉल करें: 93474 53135"
        
    # Build subtitles overlay filter
    # Font path for ffmpeg drawtext (escape backslashes and colon)
    font_arg = "C\\\\:/Windows/Fonts/Nirmala.ttc"
    
    drawtext_filter = (
        f"[0:v]"
        # Hook (0 - 3.5s)
        f"drawtext=fontfile='{font_arg}':text='{sub_hook}':fontsize=42:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=16:x=(w-text_w)/2:y=h-360:enable='between(t,0.5,3.4)',"
        # Product (3.5 - 7.5s)
        f"drawtext=fontfile='{font_arg}':text='{sub_prod}':fontsize=44:fontcolor=yellow:box=1:boxcolor=black@0.65:boxborderw=16:x=(w-text_w)/2:y=h-360:enable='between(t,3.6,7.4)',"
        # Brand (7.5 - 11.5s)
        f"drawtext=fontfile='{font_arg}':text='{sub_brand}':fontsize=40:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=16:x=(w-text_w)/2:y=h-360:enable='between(t,7.6,11.4)',"
        # Call (11.5 - 14.5s)
        f"drawtext=fontfile='{font_arg}':text='{sub_call}':fontsize=38:fontcolor=lightgreen:box=1:boxcolor=black@0.65:boxborderw=16:x=(w-text_w)/2:y=h-360:enable='between(t,11.6,14.4)'"
        f"[v_sub]"
    )
    
    out_mp4 = os.path.join(OUT_DIR, f"day17_{lang}_18s.mp4")
    desktop_mp4 = os.path.join(DESKTOP_DIR, f"RAIS_Day17_{lang.title()}_18s.mp4")
    final_30_mp4 = os.path.join(FINAL_30_DIR, f"sc02_{lang}_02_midnight_hunger.mp4")
    
    cmd = [
        FFMPEG, "-y",
        "-i", video_source,
        "-i", audio_wav,
        "-filter_complex", drawtext_filter,
        "-map", "[v_sub]",
        "-map", "1:a",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", "18.0",
        out_mp4
    ]
    
    print("Compiling final reel with subtitles and mastered audio...")
    subprocess.run(cmd, check=True)
    
    # Save copies to Desktop and final_30_reels
    shutil.copy2(out_mp4, desktop_mp4)
    shutil.copy2(out_mp4, final_30_mp4)
    print(f"🎉 SUCCESS! Rendered {desktop_mp4} ({os.path.getsize(desktop_mp4)} bytes)")
    return desktop_mp4

if __name__ == "__main__":
    master_video = build_scene_videos()
    te_out = compile_final_reel("telugu", master_video)
    hi_out = compile_final_reel("hindi", master_video)
    print("\n✅ Day 17 (Telugu and Hindi) Production Complete!")
    print(f"   Telugu: {te_out}")
    print(f"   Hindi:  {hi_out}")
