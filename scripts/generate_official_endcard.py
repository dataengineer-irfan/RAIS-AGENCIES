import os
import sys
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
WORK_DIR = "public/videos/campaigns_multishot_work/official_endcard_frames"
os.makedirs(WORK_DIR, exist_ok=True)
OUT_CLIP = "public/videos/campaigns_multishot_work/shared_clip_endcard_official.mp4"

width, height = 1080, 1920
master = Image.new("RGBA", (width, height), (8, 12, 22, 255))
draw = ImageDraw.Draw(master)

# Outer gold luxury borders
draw.rectangle([50, 80, width - 50, height - 100], outline=(212, 175, 55, 140), width=3)
draw.rectangle([65, 95, width - 65, height - 115], outline=(212, 175, 55, 50), width=1)

# Corner ornamental brackets
c_len = 80
draw.line([(50, 80 + c_len), (50, 80), (50 + c_len, 80)], fill=(212, 175, 55, 255), width=6)
draw.line([(width - 50 - c_len, 80), (width - 50, 80), (width - 50, 80 + c_len)], fill=(212, 175, 55, 255), width=6)
draw.line([(50, height - 100 - c_len), (50, height - 100), (50 + c_len, height - 100)], fill=(212, 175, 55, 255), width=6)
draw.line([(width - 50 - c_len, height - 100), (width - 50, height - 100), (width - 50, height - 100 - c_len)], fill=(212, 175, 55, 255), width=6)

center_x = width // 2
f_logo = ImageFont.truetype(FONT_BOLD, 170)
f_title = ImageFont.truetype(FONT_BOLD, 74)
f_subtitle = ImageFont.truetype(FONT_BOLD, 36)
f_city = ImageFont.truetype(FONT_BOLD, 32)
f_address = ImageFont.truetype(FONT_BOLD, 26)
f_prompt = ImageFont.truetype(FONT_BOLD, 36)
f_cta = ImageFont.truetype(FONT_BOLD, 46)
f_wa = ImageFont.truetype(FONT_BOLD, 48)

# Central RAIS Gold Diamond Logo
logo_y = 480
diamond_r = 165
pts = [
    (center_x, logo_y - diamond_r),
    (center_x + diamond_r, logo_y),
    (center_x, logo_y + diamond_r),
    (center_x - diamond_r, logo_y)
]
draw.polygon(pts, fill=(15, 22, 38, 255), outline=(212, 175, 55, 255))
draw.line(pts + [pts[0]], fill=(212, 175, 55, 255), width=7)

in_r = 140
in_pts = [
    (center_x, logo_y - in_r),
    (center_x + in_r, logo_y),
    (center_x, logo_y + in_r),
    (center_x - in_r, logo_y)
]
draw.polygon(in_pts, fill=(10, 14, 26, 255), outline=(212, 175, 55, 120))
draw.line(in_pts + [in_pts[0]], fill=(212, 175, 55, 120), width=2)
draw.text((center_x, logo_y - 20), "R", fill=(212, 175, 55, 255), font=f_logo, anchor="mm")

# Brand Name
text_y = logo_y + diamond_r + 85
draw.text((center_x + 3, text_y + 3), "RAIS AGENCIES", fill=(0, 0, 0, 240), font=f_title, anchor="mm")
draw.text((center_x, text_y), "RAIS AGENCIES", fill=(255, 255, 255, 255), font=f_title, anchor="mm")

# Descriptor (FROZEN FOOD PRODUCTS)
sub_y = text_y + 64
draw.text((center_x, sub_y), "FROZEN FOOD PRODUCTS", fill=(212, 175, 55, 255), font=f_subtitle, anchor="mm")

# Location Pill
loc_y = sub_y + 68
pill_w = 760
pill_h = 60
draw.rounded_rectangle([center_x - pill_w // 2, loc_y - pill_h // 2, center_x + pill_w // 2, loc_y + pill_h // 2], radius=16, fill=(18, 26, 44, 230), outline=(212, 175, 55, 160), width=2)
draw.text((center_x, loc_y), "RAYACHOTY, ANDHRA PRADESH", fill=(255, 255, 255, 255), font=f_city, anchor="mm")

# Full Address
addr_y = loc_y + 54
draw.text((center_x, addr_y), "Near Reddies Colony, Rayachoty – 516269", fill=(180, 195, 215, 255), font=f_address, anchor="mm")

# Divider
div_y = addr_y + 55
draw.line([(center_x - 320, div_y), (center_x + 320, div_y)], fill=(212, 175, 55, 100), width=2)

# Enquiry prompt
q_y = div_y + 60
draw.text((center_x, q_y), "For Restaurant & Cafe Orders:", fill=(226, 232, 240, 255), font=f_prompt, anchor="mm")

# Buttons: WhatsApp, Instagram & Web Catalogue
f_web = ImageFont.truetype(FONT_BOLD, 32)
wa_y = q_y + 55
btn_w = 900
btn_h = 105
wa_box = [(center_x - btn_w // 2, wa_y), (center_x + btn_w // 2, wa_y + btn_h)]

ig_y = wa_y + btn_h + 24
ig_box = [(center_x - btn_w // 2, ig_y), (center_x + btn_w // 2, ig_y + btn_h)]

web_y = ig_y + btn_h + 24
web_box = [(center_x - btn_w // 2, web_y), (center_x + btn_w // 2, web_y + btn_h)]

print("Rendering 174 frames of Official End Card (12.2s - 18.0s) with @raisfrozenfoods & Catalogue...")

for f in range(174):
    canvas = master.copy()
    c_draw = ImageDraw.Draw(canvas)
    
    # 1. WhatsApp Box with pulsing green neon outline
    pulse_alpha = int(170 + 70 * math.sin(2 * math.pi * f / 35.0))
    c_draw.rounded_rectangle(wa_box, radius=22, fill=(12, 55, 30, 255), outline=(37, 211, 102, pulse_alpha), width=4)
    c_draw.text((center_x, wa_y + btn_h // 2), "WhatsApp Order: 9347453135", fill=(255, 255, 255, 255), font=f_wa, anchor="mm")
    
    # 2. Instagram Box with @raisfrozenfoods
    c_draw.rounded_rectangle(ig_box, radius=22, fill=(160, 35, 80, 255), outline=(212, 175, 55, 240), width=3)
    c_draw.text((center_x, ig_y + btn_h // 2), "Instagram DM: @raisfrozenfoods", fill=(255, 255, 255, 255), font=f_cta, anchor="mm")
    
    # 3. Web Catalogue Box
    c_draw.rounded_rectangle(web_box, radius=22, fill=(18, 28, 52, 255), outline=(50, 150, 255, 200), width=2)
    c_draw.text((center_x, web_y + btn_h // 2), "🌐 Web: dataengineer-irfan.github.io/RAIS-AGENCIES", fill=(140, 210, 255, 255), font=f_web, anchor="mm")
    
    canvas.convert("RGB").save(f"{WORK_DIR}/frame_{f:04d}.jpg", quality=95)

cmd = [
    FFMPEG_EXE, "-y",
    "-framerate", "30",
    "-i", f"{WORK_DIR}/frame_%04d.jpg",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
    "-pix_fmt", "yuv420p", "-r", "30",
    OUT_CLIP
]
subprocess.run(cmd, capture_output=True, check=True)
print(f"[SUCCESS] Official End Card rendered: {OUT_CLIP} ({os.path.getsize(OUT_CLIP)/1024:.1f} KB)")
