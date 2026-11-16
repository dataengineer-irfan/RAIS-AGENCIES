import json
import os

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Days from Oct 28, 2026 to Nov 11, 2026
dates = [
    ("Day 01", "2026-10-28", "Wednesday"),
    ("Day 02", "2026-10-29", "Thursday"),
    ("Day 03", "2026-10-30", "Friday"),
    ("Day 04", "2026-10-31", "Saturday"),
    ("Day 05", "2026-11-01", "Sunday"),
    ("Day 06", "2026-11-02", "Monday"),
    ("Day 07", "2026-11-03", "Tuesday"),
    ("Day 08", "2026-11-04", "Wednesday"),
    ("Day 09", "2026-11-05", "Thursday"),
    ("Day 10", "2026-11-06", "Friday"),
    ("Day 11", "2026-11-07", "Saturday"),
    ("Day 12", "2026-11-08", "Sunday"),
    ("Day 13", "2026-11-09", "Monday"),
    ("Day 14", "2026-11-10", "Tuesday"),
    ("Day 15", "2026-11-11", "Wednesday"),
]

doc = []
doc.append("# RAIS AGENCIES — 15-DAY 2-PER-DAY INSTAGRAM REELS MASTER PUBLISHING PLAN")
doc.append("**30 Reels Total | Exactly 2 Reels Daily (12:30 PM & 7:30 PM IST) | 100% Catalogue-Accurate 18.0s Videos**\n")
doc.append("Official Business: **RAIS Agencies** | Official WhatsApp: **9347453135** | Location: **Near Reddies Colony, Rayachoty (516269)**\n")

doc.append("> [!TIP] **WHY THE 2-PER-DAY SCHEDULE WORKS BEST:**")
doc.append("> - **Slot 1 (12:30 PM IST — Lunch Peak):** Posts the **Telugu** version targeting Rayachoty and Andhra local cafe owners, foodies, and families browsing over lunch break.")
doc.append("> - **Slot 2 (07:30 PM IST — Dinner / Evening Peak):** Posts the **Hindi** version targeting regional restaurant owners, commercial QSRs, and cloud kitchen operators browsing after dinner rush.")
doc.append("> - **Zero Spam / Zero Ban Risk:** 2 Reels/day stays well within Meta's safe limits while giving each video an optimal 7-hour breathing window for maximum algorithmic reach.\n")

doc.append("---")
doc.append("## Executive 15-Day Grid Summary\n")
doc.append("| Day | Date & Day | Slot 1 (12:30 PM IST) [Telugu] | Slot 2 (07:30 PM IST) [Hindi] | Category |")
doc.append("|:---:|:---:|---|---|:---:|")

for idx, (d_name, d_date, d_dow) in enumerate(dates):
    sc_id = idx + 1
    sc = manifest[str(sc_id)]
    sc_title = sc["title"]
    hero = f"{sc['sku1']['name']} ({sc['sku1']['brand']})"
    b2b_tag = "B2B Commercial" if sc.get("is_b2b") else "Consumer Snacking"
    doc.append(f"| **{d_name}** | {d_date} ({d_dow[:3]}) | **Sc {sc_id:02d} TE:** {hero} | **Sc {sc_id:02d} HI:** {hero} | *{b2b_tag}* |")

doc.append("\n---\n")
doc.append("## Day-by-Day Complete Publishing Blueprint with Captions & Files\n")

base_video_dir = "c:/Users/affra/Documents/RAIS_WEBAPP/RAIS_Antigravity_Website_Starter/rais-website/public/videos/final_30_reels"

for idx, (d_name, d_date, d_dow) in enumerate(dates):
    sc_id = idx + 1
    sc = manifest[str(sc_id)]
    sc_title = sc["title"]
    hero = sc["sku1"]["name"]
    brand = sc["sku1"]["brand"]
    paired = sc["sku2"]["name"]
    p_type = sc["sku2"].get("paired_type", "Gourmet Pairing")
    is_b2b = sc.get("is_b2b", False)
    
    clean_folder = sc['folder'].replace('scenario_', '')
    te_filename = f"sc{sc_id:02d}_telugu_{clean_folder}.mp4"
    hi_filename = f"sc{sc_id:02d}_hindi_{clean_folder}.mp4"
    
    te_path = f"{base_video_dir}/{te_filename}"
    hi_path = f"{base_video_dir}/{hi_filename}"
    
    doc.append(f"### {d_name}: {d_date} ({d_dow}) — Scenario {sc_id:02d}: {sc_title}")
    doc.append(f"- **Focus Mode**: {'Commercial B2B Supply (Restaurants, Cafes & Delivery)' if is_b2b else 'Consumer & Family Snacking (Cafes & Homes)'}")
    doc.append(f"- **Featured Hero SKU**: **{hero}** ({brand})")
    doc.append(f"- **Paired Feature**: **{paired}** ({p_type})")
    doc.append(f"- **Reel Video Length**: Exactly **18.0 seconds** (1080×1920 9:16 Vertical HD)\n")
    
    # Slot 1: Telugu (12:30 PM)
    doc.append(f"#### ☀️ SLOT 1: 12:30 PM IST — TELUGU EDITION")
    doc.append(f"- **Target Audience**: Rayachoty food lovers, local fast food points, tiffin centers, college students & families.")
    doc.append(f"- **Direct File Link**: [{te_filename}](file:///{te_path})")
    doc.append(f"- **Copy-Paste Caption:**")
    
    te_caption = f"""{sc['audio_te'][0]} {sc['audio_te'][1]}
{sc['audio_te'][2]}

రాయచోటిలోని హోటళ్ళు, ఫాస్ట్ ఫుడ్ సెంటర్లు, కేఫ్‌లు మరియు కుటుంబాలకు అత్యుత్తమ నాణ్యమైన ఫ్రోజెన్ ఫుడ్స్ హోల్‌సేల్ రేట్లకే లభిస్తాయి! 

✨ బ్రాండెడ్ క్వాలిటీ: {brand.upper()}
📦 డైరెక్ట్ డిపో స్టాక్: -18°C కోల్డ్ స్టోరేజ్

📲 డైరెక్ట్ వాట్సాప్ ఆర్డర్: wa.me/919347453135 (9347453135)
💬 ఇన్‌స్టాగ్రామ్ DM: @raisfrozenfoods
🌐 వెబ్‌సైట్ & ఫుల్ 66-SKU క్యాటలాగ్: https://dataengineer-irfan.github.io/RAIS-AGENCIES/
📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)"""
    doc.append(f"```text\n{te_caption}\n```\n")
    
    # Slot 2: Hindi (07:30 PM)
    doc.append(f"#### 🌙 SLOT 2: 07:30 PM IST — HINDI EDITION")
    doc.append(f"- **Target Audience**: Regional restaurant managers, QSR franchise owners, cloud kitchens & dinner-hour buyers.")
    doc.append(f"- **Direct File Link**: [{hi_filename}](file:///{hi_path})")
    doc.append(f"- **Copy-Paste Caption:**")
    
    hi_caption = f"""{sc['audio_hi'][0]} {sc['audio_hi'][1]}
{sc['audio_hi'][2]}

रायचोटी और आसपास के सभी रेस्टोरेंट्स, कैफे, फूड स्टॉल्स और परिवारों के लिए 100% ऑथेंटिक फ्रोजन फूड्स!

✨ ब्रांड: {brand.upper()}
📦 रेडी कोल्ड-स्टोरेज स्टॉक (-18°C)

📲 डायरेक्ट WhatsApp आर्डर: wa.me/919347453135 (9347453135)
💬 इंस्टाग्राम DM: @raisfrozenfoods
🌐 वेबसाइट और पूरा 66-SKU कैटलॉग: https://dataengineer-irfan.github.io/RAIS-AGENCIES/
📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)"""
    doc.append(f"```text\n{hi_caption}\n```\n")
    doc.append("---\n")

out_plan_file = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\rais_2_per_day_15_day_instagram_master_plan.md"
with open(out_plan_file, "w", encoding="utf-8") as f:
    f.write("\n".join(doc))

print(f"Master 2-Per-Day Plan successfully created at: {out_plan_file}")
