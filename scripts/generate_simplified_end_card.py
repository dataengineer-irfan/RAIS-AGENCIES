from PIL import Image, ImageDraw, ImageFont
import os

def create_simplified_end_card():
    width = 1080
    height = 1920
    
    # Premium deep charcoal slate background (matching RAIS brand)
    img = Image.new("RGBA", (width, height), (7, 11, 20, 255))
    draw = ImageDraw.Draw(img)

    # Clean outer gold border (Instagram safe zone)
    draw.rectangle([60, 100, width - 60, height - 120], outline=(212, 175, 55, 140), width=3)
    draw.rectangle([75, 115, width - 75, height - 135], outline=(212, 175, 55, 50), width=1)

    # Gold corner corner brackets
    c_len = 80
    # Top-left
    draw.line([(60, 100 + c_len), (60, 100), (60 + c_len, 100)], fill=(212, 175, 55, 255), width=6)
    # Top-right
    draw.line([(width - 60 - c_len, 100), (width - 60, 100), (width - 60, 100 + c_len)], fill=(212, 175, 55, 255), width=6)
    # Bottom-left
    draw.line([(60, height - 120 - c_len), (60, height - 120), (60 + c_len, height - 120)], fill=(212, 175, 55, 255), width=6)
    # Bottom-right
    draw.line([(width - 60 - c_len, height - 120), (width - 60, height - 120), (width - 60, height - 120 - c_len)], fill=(212, 175, 55, 255), width=6)

    center_x = width // 2
    
    # Fonts
    font_bold = "C:/Windows/Fonts/arialbd.ttf"
    font_reg = "C:/Windows/Fonts/arial.ttf"
    font_nirmala = "C:/Windows/Fonts/Nirmala.ttc"
    
    f_logo = ImageFont.truetype(font_bold, 160)
    f_title = ImageFont.truetype(font_bold, 76)
    f_subtitle = ImageFont.truetype(font_bold, 36)
    f_city = ImageFont.truetype(font_bold, 44)
    f_question = ImageFont.truetype(font_bold, 40)
    f_cta_btn = ImageFont.truetype(font_bold, 50)

    # 1. Central RAIS Gold Diamond Logo
    logo_y = 540
    diamond_r = 170

    # Outer diamond
    pts = [
        (center_x, logo_y - diamond_r),
        (center_x + diamond_r, logo_y),
        (center_x, logo_y + diamond_r),
        (center_x - diamond_r, logo_y)
    ]
    draw.polygon(pts, fill=(15, 22, 38, 255), outline=(212, 175, 55, 255))
    draw.line(pts + [pts[0]], fill=(212, 175, 55, 255), width=7)

    # Inner diamond
    in_r = 145
    in_pts = [
        (center_x, logo_y - in_r),
        (center_x + in_r, logo_y),
        (center_x, logo_y + in_r),
        (center_x - in_r, logo_y)
    ]
    draw.polygon(in_pts, fill=(10, 14, 26, 255), outline=(212, 175, 55, 120))
    draw.line(in_pts + [in_pts[0]], fill=(212, 175, 55, 120), width=2)

    # Initial "R" in Gold
    draw.text((center_x, logo_y - 20), "R", fill=(212, 175, 55, 255), font=f_logo, anchor="mm")

    # 2. Prominent Brand Name
    text_y = logo_y + diamond_r + 90
    # Subtle drop shadow
    draw.text((center_x + 3, text_y + 3), "RAIS AGENCIES", fill=(0, 0, 0, 240), font=f_title, anchor="mm")
    draw.text((center_x, text_y), "RAIS AGENCIES", fill=(255, 255, 255, 255), font=f_title, anchor="mm")

    # 3. Business Categories Subtitle
    sub_y = text_y + 70
    draw.text((center_x, sub_y), "FROZEN FOOD PRODUCTS & PACKAGING SUPPLIES", fill=(212, 175, 55, 255), font=f_subtitle, anchor="mm")

    # 4. Location Badge
    city_y = sub_y + 80
    draw.rounded_rectangle([center_x - 220, city_y - 32, center_x + 220, city_y + 32], radius=16, fill=(18, 26, 44, 230), outline=(212, 175, 55, 160), width=2)
    draw.text((center_x, city_y), "RAYACHOTY", fill=(255, 255, 255, 255), font=f_city, anchor="mm")

    # Divider gold line with accent diamond
    div_y = city_y + 110
    draw.line([(center_x - 320, div_y), (center_x + 320, div_y)], fill=(212, 175, 55, 100), width=2)
    d_sz = 12
    draw.polygon([(center_x, div_y - d_sz), (center_x + d_sz, div_y), (center_x, div_y + d_sz), (center_x - d_sz, div_y)], fill=(212, 175, 55, 255))

    # 5. Enquiry Prompt (Approved text from brief)
    q_y = div_y + 90
    draw.text((center_x, q_y), "Food Business or Personal Enquiry?", fill=(226, 232, 240, 255), font=f_question, anchor="mm")

    # 6. Single Prominent Mobile-First CTA Button
    btn_y = q_y + 100
    btn_w = 780
    btn_h = 130
    btn_box = [(center_x - btn_w // 2, btn_y), (center_x + btn_w // 2, btn_y + btn_h)]
    
    # Instagram gradient fill simulation: deep violet to crimson with gold border
    draw.rounded_rectangle(btn_box, radius=32, fill=(160, 25, 100, 255), outline=(255, 215, 0, 240), width=4)
    # Inner glow
    draw.rounded_rectangle([btn_box[0][0] + 4, btn_box[0][1] + 4, btn_box[1][0] - 4, btn_box[1][1] - 4], radius=28, fill=(185, 30, 110, 255))
    
    draw.text((center_x, btn_y + btn_h // 2), "DM US ON INSTAGRAM", fill=(255, 255, 255, 255), font=f_cta_btn, anchor="mm")

    # Save end card
    output_path = "public/images/scene_05_brand_cta.png"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"[SUCCESS] Simplified prominent end card generated: {output_path}")

if __name__ == "__main__":
    create_simplified_end_card()
