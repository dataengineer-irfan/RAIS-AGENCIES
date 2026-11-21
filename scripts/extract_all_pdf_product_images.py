import os
import fitz
import re

pdf_path = r'C:\Users\affra\Desktop\RAIS\RAIS_Master_Food_Service_Catalogues_and_Quotations\1_Public_Catalogues_No_Prices\Commercial_Product_Catalogue_Anonymous.pdf'
doc = fitz.open(pdf_path)

out_dir = r'c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\public\images\pdf_products'
os.makedirs(out_dir, exist_ok=True)

product_mapping = {}

for pno in range(len(doc)):
    page = doc[pno]
    img_infos = page.get_image_info(xrefs=True)
    words = page.get_text("words")
    
    for info in img_infos:
        bbox = info['bbox']
        xref = info['xref']
        col = "left" if bbox[0] < 200 else "right"
        
        # Match words in row
        row_words = [w[4] for w in words if abs(w[1] - bbox[1]) < 14 and ((col == "left" and w[0] < 260) or (col == "right" and w[0] >= 260))]
        row_text = " ".join(row_words)
        
        # Extract number if any number 1-90 appears near start
        m = re.search(r'\b([1-9]|[1-8][0-9]|90)\b', row_text)
        if m:
            num = int(m.group(1))
            name = row_text
        else:
            num = None
            name = row_text
            
        # Extract image bytes
        base_img = doc.extract_image(xref)
        img_bytes = base_img["image"]
        img_ext = base_img["ext"]
        
        if num:
            filename = f"prod_{num:02d}.{img_ext}"
            filepath = os.path.join(out_dir, filename)
            with open(filepath, "wb") as f:
                f.write(img_bytes)
            product_mapping[num] = {
                'num': num,
                'name': name,
                'xref': xref,
                'path': filepath,
                'rel_path': f"images/pdf_products/{filename}"
            }

print(f"Total products mapped: {len(product_mapping)} of 90")
missing = [i for i in range(1, 91) if i not in product_mapping]
print(f"Missing nums: {missing}")
