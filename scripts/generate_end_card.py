from PIL import Image, ImageDraw, ImageFont
import os

def create_end_card():
    width = 1080
    height = 1920
    
    # Background: deep dark navy slate
    img = Image.new("RGBA", (width, height), (8, 16, 38, 255))
    draw = ImageDraw.Draw(img)

    # Subtle geometric border
    draw.rectangle([40, 40, width - 40, height - 40], outline=(251, 191, 36, 120), width=3)
    draw.rectangle([55, 55, width - 55, height - 55], outline=(6, 182, 212, 80), width=1)

    # Gold corner accents
    corner_size = 60
    # Top-left
    draw.line([(40, 40 + corner_size), (40, 40), (40 + corner_size, 40)], fill=(251, 191, 36, 255), width=8)
    # Top-right
    draw.line([(width - 40 - corner_size, 40), (width - 40, 40), (width - 40, 40 + corner_size)], fill=(251, 191, 36, 255), width=8)
    # Bottom-left
    draw.line([(40, height - 40 - corner_size), (40, height - 40), (40 + corner_size, height - 40)], fill=(251, 191, 36, 255), width=8)
    # Bottom-right
    draw.line([(width - 40 - corner_size, height - 40), (width - 40, height - 40), (width - 40, height - 40 - corner_size)], fill=(251, 191, 36, 255), width=8)

    # Draw Central RAIS Diamond Logo
    center_x = width // 2
    logo_y = 520
    diamond_radius = 160

    # Diamond outline in gold
    points = [
        (center_x, logo_y - diamond_radius),
        (center_x + diamond_radius, logo_y),
        (center_x, logo_y + diamond_radius),
        (center_x - diamond_radius, logo_y)
    ]
    draw.polygon(points, fill=(15, 23, 42, 255), outline=(251, 191, 36, 255))
    draw.line(points + [points[0]], fill=(251, 191, 36, 255), width=6)

    # Inner diamond
    inner_r = 135
    inner_points = [
        (center_x, logo_y - inner_r),
        (center_x + inner_r, logo_y),
        (center_x, logo_y + inner_r),
        (center_x - inner_r, logo_y)
    ]
    draw.polygon(inner_points, fill=(4, 9, 24, 255), outline=(251, 191, 36, 160))

    # Diamond initial "R"
    try:
        font_logo = ImageFont.truetype("arialbd.ttf", 150)
        font_h1 = ImageFont.truetype("arialbd.ttf", 72)
        font_h2 = ImageFont.truetype("arialbd.ttf", 40)
        font_body = ImageFont.truetype("arial.ttf", 36)
        font_btn = ImageFont.truetype("arialbd.ttf", 44)
    except:
        font_logo = font_h1 = font_h2 = font_body = font_btn = ImageFont.load_default()

    draw.text((center_x, logo_y - 20), "R", fill=(251, 191, 36, 255), font=font_logo, anchor="mm")
    
    # Brand Name Text
    brand_y = logo_y + diamond_radius + 85
    draw.text((center_x, brand_y), "RAIS AGENCIES", fill=(255, 255, 255, 255), font=font_h1, anchor="mm")
    draw.text((center_x, brand_y + 70), "FROZEN FOOD PRODUCTS", fill=(6, 182, 212, 255), font=font_h2, anchor="mm")
    draw.text((center_x, brand_y + 130), "RAYACHOTY (516269)", fill=(251, 191, 36, 255), font=font_h2, anchor="mm")

    # Native Telugu tagline
    try:
        font_te = ImageFont.truetype("C:/Windows/Fonts/Nirmala.ttc", 28)
        draw.text((center_x, brand_y + 190), "రాయ్స్ ఏజెన్సీస్ రాయచోటి — మీ ట్రస్టెడ్ ఫ్రోజెన్ ఫుడ్ పార్ట్నర్!", fill=(245, 245, 245, 255), font=font_te, anchor="mm")
    except Exception as e:
        print("Telugu font error:", e)

    # Divider line
    div_y = brand_y + 245
    draw.line([(center_x - 300, div_y), (center_x + 300, div_y)], fill=(6, 182, 212, 100), width=2)

    # Wholesale Focus & Call to Action
    cta_y = div_y + 100
    draw.text((center_x, cta_y), "B2B WHOLESALE COLD STORAGE DEPOT", fill=(203, 213, 225, 255), font=font_body, anchor="mm")
    draw.text((center_x, cta_y + 60), "Hotels · Restaurants · Fast Food Centers", fill=(148, 163, 184, 255), font=font_body, anchor="mm")

    # Instagram Button
    btn_y = cta_y + 180
    btn_w = 760
    btn_h = 110
    btn_box = [(center_x - btn_w // 2, btn_y), (center_x + btn_w // 2, btn_y + btn_h)]
    draw.rounded_rectangle(btn_box, radius=24, fill=(193, 53, 132, 255), outline=(255, 255, 255, 120), width=2)
    draw.text((center_x, btn_y + btn_h // 2), "DM: @raisfrozenfoods", fill=(255, 255, 255, 255), font=font_btn, anchor="mm")

    # WhatsApp Button
    wa_y = btn_y + 150
    wa_box = [(center_x - btn_w // 2, wa_y), (center_x + btn_w // 2, wa_y + btn_h)]
    draw.rounded_rectangle(wa_box, radius=24, fill=(37, 211, 102, 255))
    draw.text((center_x, wa_y + btn_h // 2), "WhatsApp: 9347453135", fill=(10, 10, 10, 255), font=font_btn, anchor="mm")

    # Footer note
    draw.text((center_x, height - 120), "Near Reddies Colony, Rayachoty, Annamayya Dist (516269)", fill=(148, 163, 184, 255), font=font_body, anchor="mm")
    draw.text((center_x, height - 70), "-18°C Cold Chain Guaranteed", fill=(6, 182, 212, 255), font=font_body, anchor="mm")

    output_path = "public/images/scene_05_brand_cta.png"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"End card generated successfully: {output_path}")

if __name__ == "__main__":
    create_end_card()
