import os
import json
import shutil
from PIL import Image, ImageDraw, ImageFont

FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
f_title = ImageFont.truetype(FONT_BOLD, 22)
f_sub = ImageFont.truetype(FONT_BOLD, 15)
f_warn = ImageFont.truetype(FONT_BOLD, 16)

W = 1200
H = 15 * 220 + 90
canvas = Image.new("RGB", (W, H), (15, 18, 25))
draw = ImageDraw.Draw(canvas)

draw.text((W // 2, 45), "RAIS AGENCIES — 15 SCENARIOS VISUAL AUDIT CONTACT SHEET", fill=(212, 175, 55), font=f_title, anchor="mm")

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

for sc_id in range(1, 16):
    y = 80 + (sc_id - 1) * 220
    sc = manifest[str(sc_id)]
    
    # Label card
    draw.rounded_rectangle([25, y + 10, 360, y + 205], radius=12, fill=(24, 28, 40), outline=(50, 60, 80))
    draw.text((40, y + 25), f"Scenario {sc_id:02d}: {sc['title'][:20]}", fill=(212, 175, 55), font=f_title)
    char_base = os.path.basename(sc["character"])
    draw.text((40, y + 65), f"Char: {char_base[:24]}", fill=(180, 190, 210), font=f_sub)
    draw.text((40, y + 95), f"SKU1: {sc['sku1']['name'][:24]}", fill=(160, 170, 190), font=f_sub)
    draw.text((40, y + 125), f"SKU2: {sc['sku2']['name'][:24]}", fill=(160, 170, 190), font=f_sub)
    
    # Frame thumbnails
    f1 = f"audit_frames/sc{sc_id:02d}_shot1.jpg"
    f2 = f"audit_frames/sc{sc_id:02d}_shot2.jpg"
    f3 = f"audit_frames/sc{sc_id:02d}_shot3.jpg"
    
    tw, th = 110, 195
    for idx, (label, f_path) in enumerate([("Scene 1 (Char)", f1), ("Scene 2 (Food)", f2), ("Scene 3 (Cards)", f3)]):
        x_pos = 385 + idx * (tw + 15)
        if os.path.exists(f_path):
            im = Image.open(f_path).resize((tw, th), Image.Resampling.LANCZOS)
            canvas.paste(im, (x_pos, y + 10))
            draw.rectangle([x_pos, y + 10, x_pos + tw, y + 10 + th], outline=(70, 80, 100), width=1)
            
    # Check duplicates
    dup = ""
    if char_base == "character_test_scene_b_b2b.jpg":
        dup = "DEFECT: Duplicate B2B Warehouse (used in 6 scenarios)"
    elif char_base == "ayesha_cricket.jpg" and sc_id != 3:
        dup = "DEFECT: Duplicate Cricket Living Room"
    elif char_base == "ayesha_midnight.jpg" and sc_id != 2:
        dup = "DEFECT: Duplicate Midnight Kitchen"
    elif char_base == "ayesha_after_school.jpg" and sc_id != 4:
        dup = "DEFECT: Duplicate School Table"
    elif char_base == "character_test_scene_a_rain.jpg" and sc_id != 1:
        dup = "DEFECT: Duplicate Monsoon Window"
        
    if dup:
        draw.rounded_rectangle([780, y + 60, 1170, y + 130], radius=8, fill=(60, 20, 20), outline=(220, 70, 70))
        draw.text((795, y + 85), dup, fill=(255, 120, 120), font=f_warn)
    else:
        draw.rounded_rectangle([780, y + 60, 1170, y + 130], radius=8, fill=(20, 45, 30), outline=(60, 180, 90))
        draw.text((795, y + 85), "Unique Environment Asset", fill=(120, 240, 150), font=f_warn)

out_cs = "public/images/audit_contact_sheet.jpg"
canvas.save(out_cs, quality=92)
print(f"Contact sheet saved to {out_cs}")

# Copy to artifact directory
app_artifact_dir = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"
shutil.copy2(out_cs, os.path.join(app_artifact_dir, "audit_contact_sheet.jpg"))
print("Copied to artifact directory")
