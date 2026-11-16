import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

md_out = []
md_out.append("# RAIS AGENCIES — 15-SCENARIO CATALOGUE-TO-REEL PRODUCT MANIFEST\n")
md_out.append("This document tracks the deterministic mapping of the authoritative 66-SKU RAIS Wholesale Product Catalogue (`frontend/public/RAIS_Product_Catalogue_No_Prices.html`) across all 15 scenarios and 30 Instagram Reels.\n")
md_out.append("| Scenario # | Scenario Concept | Hero SKU & Title | Brand | Pack Size | Paired SKU / Packaging | Character Environment | Hindi MP4 | Telugu MP4 |")
md_out.append("|---|---|---|---|---|---|---|---|---|")

for sc_id in range(1, 16):
    sc = manifest[str(sc_id)]
    s1 = sc["sku1"]
    s2 = sc["sku2"]
    
    char_env = os.path.basename(sc["character"])
    f_hi = f"sc{sc_id:02d}_hindi_{sc['folder'].replace('scenario_', '')}.mp4"
    f_te = f"sc{sc_id:02d}_telugu_{sc['folder'].replace('scenario_', '')}.mp4"
    
    hero_str = f"**`{s1['code']}`**<br>{s1['name']}"
    brand_str = s1["brand"].title()
    pack_str = s1.get("pack", "Standard Pack")
    paired_str = f"**`{s2['code']}`** {s2['name']}<br>+ **`{s2.get('paired_code', '')}`** {s2.get('paired_name', '')}"
    
    row = f"| **{sc_id:02d}** | {sc['title']} | {hero_str} | {brand_str} | {pack_str} | {paired_str} | `{char_env}` | [`{f_hi}`](file:///c:/Users/affra/Documents/RAIS_WEBAPP/RAIS_Antigravity_Website_Starter/rais-website/public/videos/final_30_reels/{f_hi}) | [`{f_te}`](file:///c:/Users/affra/Documents/RAIS_WEBAPP/RAIS_Antigravity_Website_Starter/rais-website/public/videos/final_30_reels/{f_te}) |"
    md_out.append(row)

report_text = "\n".join(md_out)
with open("scripts/PRODUCT_MANIFEST_CATALOGUE_ACCURATE.md", "w", encoding="utf-8") as f:
    f.write(report_text)

print("Generated scripts/PRODUCT_MANIFEST_CATALOGUE_ACCURATE.md successfully!")
