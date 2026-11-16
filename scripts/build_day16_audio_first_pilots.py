import os
import sys
import math
import subprocess
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
BASE_DIR = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website"
REF_DIR = os.path.join(BASE_DIR, "public", "images", "ref-assets")
AUDIO_DIR = os.path.join(BASE_DIR, "public", "audio", "audio_master_v2")
OUT_DIR = os.path.join(BASE_DIR, "public", "videos")
WORK_DIR = os.path.join(BASE_DIR, "scratch", "pilot_day16_work")
DESKTOP_DIR = r"C:\Users\affra\Desktop"

os.makedirs(WORK_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# Master asset paths
IMG_PRESENTER = os.path.join(REF_DIR, "rais_red_suit_presenter_master.jpg")
IMG_STOREFRONT = os.path.join(REF_DIR, "rais_storefront_official.jpg")
IMG_ROUTE = os.path.join(REF_DIR, "rais_location_indel_bank_route.jpg")

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

def fit_crop_916(im, target_w=1080, target_h=1920):
    """Crops and fits an image to vertical 9:16 (1080x1920)."""
    im_ratio = im.width / im.height
    target_ratio = target_w / target_h
    
    if im_ratio > target_ratio:
        new_h = im.height
        new_w = int(new_h * target_ratio)
        left = (im.width - new_w) // 2
        top = 0
    else:
        new_w = im.width
        new_h = int(new_w / target_ratio)
        left = 0
        top = (im.height - new_h) // 2
        
    cropped = im.crop((left, top, left + new_w, top + new_h))
    return cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

def create_endcard_graphic(target_w=1080, target_h=1920):
    """Generates the official mandatory black-and-gold RAIS Agencies contact card."""
    canvas = Image.new("RGBA", (target_w, target_h), (8, 12, 22, 255))
    
    # Load landmark route image in top half
    if os.path.exists(IMG_ROUTE):
        route_im = Image.open(IMG_ROUTE).convert("RGBA")
        route_fitted = fit_crop_916(route_im, target_w, 880)
        canvas.paste(route_fitted, (0, 0))
        
        # Vignette overlay on route image
        vignette = Image.new("RGBA", (target_w, 880), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(vignette)
        for y in range(400, 880):
            alpha = int(255 * ((y - 400) / 480))
            v_draw.line([(0, y), (target_w, y)], fill=(8, 12, 22, alpha))
        canvas = Image.alpha_composite(canvas, Image.new("RGBA", (target_w, target_h), (0,0,0,0)))
        canvas.paste(vignette, (0, 0), vignette)
        
    draw = ImageDraw.Draw(canvas)
    
    # Gold divider line
    draw.line([(60, 875), (target_w - 60, 875)], fill=(212, 175, 55, 230), width=4)
    
    # Official Typography (Mandatory Text)
    f_brand_big = get_font(FONT_ENG_BOLD, 74)
    f_sub_gold = get_font(FONT_ENG_BOLD, 36)
    f_addr_bold = get_font(FONT_ENG_BOLD, 34)
    f_addr_reg = get_font(FONT_ENG_REG, 30)
    f_pill = get_font(FONT_ENG_BOLD, 34)
    f_phone = get_font(FONT_ENG_BOLD, 68)
    
    # 1. RAIS AGENCIES
    draw.text((target_w // 2, 940), "RAIS AGENCIES", fill=(245, 190, 35), font=f_brand_big, anchor="mm")
    draw.text((target_w // 2, 1005), "FROZEN FOOD PRODUCTS", fill=(255, 255, 255), font=f_sub_gold, anchor="mm")
    
    # Subtle box for address & landmark
    addr_box = [80, 1060, target_w - 80, 1370]
    draw.rounded_rectangle(addr_box, radius=20, fill=(15, 22, 38, 220), outline=(212, 175, 55, 150), width=2)
    
    draw.text((target_w // 2, 1115), "Near Reddies Colony,", fill=(241, 245, 249), font=f_addr_bold, anchor="mm")
    draw.text((target_w // 2, 1175), "Beside Indel Money Bank,", fill=(251, 191, 36), font=f_addr_bold, anchor="mm")
    draw.text((target_w // 2, 1235), "Rayachoty – 516269, Andhra Pradesh.", fill=(226, 232, 240), font=f_addr_reg, anchor="mm")
    draw.text((target_w // 2, 1305), "T. Sundupalli Road Hub", fill=(148, 163, 184), font=f_addr_reg, anchor="mm")
    
    # Wholesale Orders | Bulk Orders Pill
    draw.rounded_rectangle([100, 1420, target_w - 100, 1500], radius=16, fill=(180, 83, 9), outline=(245, 158, 11), width=2)
    draw.text((target_w // 2, 1460), "WHOLESALE ORDERS | BULK ORDERS", fill=(255, 255, 255), font=f_pill, anchor="mm")
    
    # Call Now Container
    call_box = [80, 1550, target_w - 80, 1780]
    draw.rounded_rectangle(call_box, radius=24, fill=(16, 185, 129, 30), outline=(16, 185, 129, 230), width=4)
    
    draw.text((target_w // 2, 1605), "📞 CALL NOW", fill=(52, 211, 153), font=f_sub_gold, anchor="mm")
    draw.text((target_w // 2, 1690), "9347453135", fill=(255, 255, 255), font=f_phone, anchor="mm")
    
    # Bottom Tagline
    draw.text((target_w // 2, 1840), "Good Food... Good Mood... with RAIS!", fill=(212, 175, 55), font=f_sub_gold, anchor="mm")
    
    return canvas.convert("RGB")

def render_pilot_video(lang="telugu"):
    is_te = (lang.lower() == "telugu")
    print(f"\n========================================================")
    print(f"🎬 RENDERING DAY 16 PILOT: {lang.upper()} (20.0s, 600 frames)")
    print(f"========================================================")
    
    frames_dir = os.path.join(WORK_DIR, f"frames_{lang}")
    os.makedirs(frames_dir, exist_ok=True)
    
    # Load base images
    im_presenter = fit_crop_916(Image.open(IMG_PRESENTER).convert("RGB"))
    im_storefront = fit_crop_916(Image.open(IMG_STOREFRONT).convert("RGB"))
    im_endcard = create_endcard_graphic()
    
    # Product sizzle image: composite of momos, fries, burger
    im_products = fit_crop_916(Image.open(IMG_PRESENTER).convert("RGB"))
    # Crop to products table in presenter image
    table_crop = Image.open(IMG_PRESENTER).crop((0, 480, 682, 1024))
    im_products = fit_crop_916(table_crop)
    
    total_frames = 600 # 20 seconds at 30 fps
    
    # Fonts for subtitles & banners
    f_sub_title = get_font(FONT_INDIAN, 46, index=0)
    f_sub_sec = get_font(FONT_INDIAN, 36, index=0)
    f_badge = get_font(FONT_ENG_BOLD, 26)
    
    print("Generating 600 synchronized video frames...")
    
    for f in range(total_frames):
        t = f / 30.0 # current time in seconds
        
        # 1. Base Image Selection & Camera Motion
        if t < 5.0:
            # Scene 1: Red-Suit Presenter Hook (0.0s - 5.0s)
            zoom = 1.0 + 0.05 * (t / 5.0)
            cw, ch = int(1080 / zoom), int(1920 / zoom)
            cx = (1080 - cw) // 2
            cy = (1920 - ch) // 3
            frame = im_presenter.crop((cx, cy, cx + cw, cy + ch)).resize((1080, 1920), Image.Resampling.LANCZOS)
            
            # Subtitle & Hook Banner
            draw = ImageDraw.Draw(frame)
            banner_box = [50, 1580, 1030, 1820]
            draw.rounded_rectangle(banner_box, radius=20, fill=(10, 16, 30), outline=(245, 158, 11), width=3)
            draw.text((540, 1625), "✦ RAIS AGENCIES • RAYACHOTY ✦", fill=(212, 175, 55), font=f_badge, anchor="mm")
            
            sub1 = "రాయచోటి రెస్టారెంట్స్ & కేఫ్‌ల కోసం!" if is_te else "रायचोटी के रेस्टोरेंट्स & कैफे के लिए!"
            sub2 = "ప్రీమియం ఫ్రోజెన్ ఫుడ్స్ హోల్‌సేల్ సప్లై" if is_te else "प्रीमियम फ्रोजन फूड्स होलसेल सप्लाई"
            draw.text((540, 1690), sub1, fill=(255, 255, 255), font=f_sub_title, anchor="mm")
            draw.text((540, 1760), sub2, fill=(52, 211, 153), font=f_sub_sec, anchor="mm")
            
        elif t < 10.0:
            # Scene 2: Core Wholesale Products & Sizzle (5.0s - 10.0s)
            p_t = (t - 5.0) / 5.0
            zoom = 1.0 + 0.06 * p_t
            cw, ch = int(1080 / zoom), int(1920 / zoom)
            cx = int((1080 - cw) * p_t)
            cy = (1920 - ch) // 2
            frame = im_products.crop((cx, cy, cx + cw, cy + ch)).resize((1080, 1920), Image.Resampling.LANCZOS)
            
            draw = ImageDraw.Draw(frame)
            banner_box = [50, 1580, 1030, 1820]
            draw.rounded_rectangle(banner_box, radius=20, fill=(10, 16, 30), outline=(56, 189, 248), width=3)
            draw.text((540, 1625), "🥟 MOMOS  •  🍟 FRIES  •  🍔 PATTIES  •  🧀 CHEESE", fill=(56, 189, 248), font=f_badge, anchor="mm")
            
            sub1 = "మొమోస్, ఫ్రెంచ్ ఫ్రైస్, బర్గర్ ప్యాటీస్!" if is_te else "मोमोज, फ्रेंच फ्राइज, बर्गर पैटी!"
            sub2 = "డైరెక్ట్ B2B హోల్‌సేల్ రేట్స్ (No Middlemen)" if is_te else "डायरेक्ट B2B होलसेल रेट्स (No Middlemen)"
            draw.text((540, 1690), sub1, fill=(255, 255, 255), font=f_sub_title, anchor="mm")
            draw.text((540, 1760), sub2, fill=(251, 191, 36), font=f_sub_sec, anchor="mm")
            
        elif t < 15.0:
            # Scene 3: Official Storefront & Cold-Chain (10.0s - 15.0s)
            s_t = (t - 10.0) / 5.0
            zoom = 1.0 + 0.04 * s_t
            cw, ch = int(1080 / zoom), int(1920 / zoom)
            cx = (1080 - cw) // 2
            cy = int((1920 - ch) * 0.2 + (1920 - ch) * 0.4 * s_t)
            frame = im_storefront.crop((cx, cy, cx + cw, cy + ch)).resize((1080, 1920), Image.Resampling.LANCZOS)
            
            draw = ImageDraw.Draw(frame)
            banner_box = [50, 1580, 1030, 1820]
            draw.rounded_rectangle(banner_box, radius=20, fill=(10, 16, 30), outline=(52, 211, 153), width=3)
            draw.text((540, 1625), "100% COLD CHAIN (-18°C) • LOCAL DELIVERY", fill=(52, 211, 153), font=f_badge, anchor="mm")
            
            sub1 = "వంద శాతం క్వాలిటీతో RAIS ఏజెన్సీస్!" if is_te else "100% क्वालिटी के साथ RAIS Agencies!"
            sub2 = "మీ బిజినెస్‌కి నమ్మకమైన హోల్‌సేల్ సప్లై" if is_te else "आपके बिजनेस का सच्चा होलसेल पार्टनर"
            draw.text((540, 1690), sub1, fill=(255, 255, 255), font=f_sub_title, anchor="mm")
            draw.text((540, 1760), sub2, fill=(241, 245, 249), font=f_sub_sec, anchor="mm")
            
        else:
            # Scene 4: Landmark Route & Official Contact Card (15.0s - 20.0s)
            # Static authoritative endcard lock with subtle gold pulse
            frame = im_endcard.copy()
            draw = ImageDraw.Draw(frame)
            
            pulse = math.sin((t - 15.0) * math.pi * 2) * 0.5 + 0.5
            ring_col = (int(16 + 36 * pulse), int(185 + 50 * pulse), int(129 + 80 * pulse))
            draw.rounded_rectangle([76, 1546, 1004, 1784], radius=26, outline=ring_col, width=3)
            
            # Bottom Subtitle
            sub_last = "ఇండెల్ మనీ బ్యాంక్ పక్కన, రాయచోటి. కాల్ చేయండి!" if is_te else "इन्डेल मनी बैंक के पास, रायचोटी। अभी कॉल करें!"
            draw.text((540, 1895), sub_last, fill=(255, 255, 255), font=f_sub_sec, anchor="mm")
            
        frame.save(os.path.join(frames_dir, f"frame_{f:04d}.jpg"), quality=93)
        if f % 120 == 0:
            print(f"  - Rendered frame {f}/600 ({int(f/600*100)}%)")
            
    print("All 600 frames rendered successfully!")
    
    # 2. Compile MP4 with Mastered Audio
    audio_file = os.path.join(AUDIO_DIR, f"day16_pilot_{lang}_mastered.mp3")
    out_mp4 = os.path.join(OUT_DIR, f"pilot_day16_{lang}_20s.mp4")
    desktop_mp4 = os.path.join(DESKTOP_DIR, f"RAIS_Day16_Pilot_{lang.title()}_20s.mp4")
    
    cmd = [
        FFMPEG, "-y",
        "-framerate", "30",
        "-i", os.path.join(frames_dir, "frame_%04d.jpg"),
        "-i", audio_file,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-b:v", "4500k",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "48000",
        "-t", "20.0",
        "-shortest",
        out_mp4
    ]
    
    print(f"Compiling final MP4 video via ffmpeg...")
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if p.returncode == 0:
        print(f"🎉 SUCCESS! Rendered {out_mp4} ({os.path.getsize(out_mp4)} bytes)")
        import shutil
        shutil.copy2(out_mp4, desktop_mp4)
        print(f"   Copied to Desktop: {desktop_mp4}")
        return True, out_mp4
    else:
        print(f"❌ ffmpeg compile failed: {p.stderr}")
        return False, None

if __name__ == "__main__":
    render_pilot_video("telugu")
    render_pilot_video("hindi")
