import os
import sys
import subprocess
import shutil
import asyncio
import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
BASE_DIR = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website"
SCRATCH_DIR = os.path.join(BASE_DIR, "scratch")
OUT_DIR = os.path.join(BASE_DIR, "public", "videos")
DESKTOP_DIR = r"C:\Users\affra\Desktop"
SOURCE_REEL = os.path.join(SCRATCH_DIR, "full_instagram_reel_DfaSjTiu6sb.mp4")
IMG_ROUTE = os.path.join(BASE_DIR, "public", "images", "ref-assets", "rais_location_indel_bank_route.jpg")

os.makedirs(SCRATCH_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Fonts
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
        # Crop to 9:16 ratio top portion
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
        
        # Vignette overlay
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
    
    out_path = os.path.join(SCRATCH_DIR, "official_endcard_1080x1920.png")
    canvas.convert("RGB").save(out_path)
    return out_path

async def generate_hindi_voice():
    """Generates punchy commercial Hindi female voice matching the Telugu delivery."""
    text = "आपके बिजनेस के लिए जरूरी फ्रोजन फूड्स, बेकरी प्रोडक्ट्स और पैकेजिंग सॉल्यूशंस... सब कुछ एक ही जगह! राइस एजेंसीज रायचोटी होलसेल!"
    hi_mp3 = os.path.join(SCRATCH_DIR, "hindi_voice_punchy.mp3")
    c = edge_tts.Communicate(text, 'hi-IN-SwaraNeural', rate='+30%')
    await c.save(hi_mp3)
    return hi_mp3

def build_pilot_video(lang="telugu"):
    is_te = (lang.lower() == "telugu")
    print(f"\n=======================================================")
    print(f"🎬 BUILDING DAY 16 LIVE-REAL PILOT: {lang.upper()}")
    print(f"=======================================================")
    
    endcard_img = create_endcard_graphic()
    
    # 1. Prepare Audio
    if is_te:
        # Use authentic audio from Reel (8.04s)
        audio_src = os.path.join(SCRATCH_DIR, "reel_audio.wav")
    else:
        # Generate and use Hindi punchy voice
        asyncio.run(generate_hindi_voice())
        audio_src = os.path.join(SCRATCH_DIR, "hindi_voice_punchy.mp3")
    
    # 2. Extract and upscale live motion video from the Reel (0.0s to 8.0s)
    live_motion_mp4 = os.path.join(SCRATCH_DIR, "live_motion_1080x1920.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-i", SOURCE_REEL,
        "-t", "8.0",
        "-vf", "scale=1080:1920:flags=lanczos,fps=30",
        "-c:v", "libx264", "-crf", "17", "-an",
        live_motion_mp4
    ], check=True, capture_output=True)
    
    # 3. Create a 3.0s animated endcard video (1080x1920, 30fps) with subtle zoom
    endcard_mp4 = os.path.join(SCRATCH_DIR, "endcard_3s.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-loop", "1", "-i", endcard_img,
        "-t", "3.0",
        "-vf", "scale=1080:1920,zoompan=z='min(zoom+0.001,1.03)':d=90:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
        "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p",
        endcard_mp4
    ], check=True, capture_output=True)
    
    # 4. Concat live motion (8s) + endcard (3s) -> 11s total video
    concat_list = os.path.join(SCRATCH_DIR, "concat_list.txt")
    with open(concat_list, "w") as f:
        f.write(f"file '{os.path.abspath(live_motion_mp4).replace(chr(92), '/')}'\n")
        f.write(f"file '{os.path.abspath(endcard_mp4).replace(chr(92), '/')}'\n")
        
    merged_video_mp4 = os.path.join(SCRATCH_DIR, f"merged_video_{lang}.mp4")
    subprocess.run([
        FFMPEG, "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list,
        "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p",
        merged_video_mp4
    ], check=True, capture_output=True)
    
    # 5. Composite Final MP4 with Audio
    out_mp4 = os.path.join(OUT_DIR, f"pilot_day16_{lang}_live_real.mp4")
    desktop_mp4 = os.path.join(DESKTOP_DIR, f"RAIS_Day16_LiveReal_{lang.title()}.mp4")
    
    # If Hindi, blend voice with music bed
    if not is_te:
        # Mix voice over the original upbeat commercial bed
        # Extract audio bed from reel_audio.wav or use background track
        mixed_audio = os.path.join(SCRATCH_DIR, "hindi_mixed_audio.wav")
        subprocess.run([
            FFMPEG, "-y",
            "-i", audio_src,
            "-i", os.path.join(SCRATCH_DIR, "reel_audio.wav"),
            "-filter_complex", "[0:a]volume=1.2[v];[1:a]volume=0.35,aloop=loop=-1:size=2e+09[bg];[v][bg]amix=inputs=2:duration=first[out]",
            "-map", "[out]",
            mixed_audio
        ], check=True, capture_output=True)
        final_audio = mixed_audio
    else:
        final_audio = audio_src
        
    cmd = [
        FFMPEG, "-y",
        "-i", merged_video_mp4,
        "-i", final_audio,
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-t", "11.0",
        out_mp4
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.copy2(out_mp4, desktop_mp4)
    print(f"🎉 RENDER COMPLETE: {desktop_mp4} ({os.path.getsize(desktop_mp4)} bytes)")
    return desktop_mp4

if __name__ == "__main__":
    te_path = build_pilot_video("telugu")
    hi_path = build_pilot_video("hindi")
    print(f"\n✅ All pilots updated and saved to Desktop:")
    print(f"   - {te_path}")
    print(f"   - {hi_path}")
