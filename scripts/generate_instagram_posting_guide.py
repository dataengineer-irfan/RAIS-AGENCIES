import json
import os

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

guide = []
guide.append("# RAIS AGENCIES — INSTAGRAM 30-REEL CAMPAIGN PUBLISHING GUIDE")
guide.append("Official WhatsApp: 9347453135 | Location: Rayachoty, Andhra Pradesh (516269)\n")
guide.append("> [!WARNING] **NEVER POST 30 REELS SIMULTANEOUSLY ('AT ONE SHOT')**")
guide.append("> 1. **Meta Daily Rate Limit**: Instagram limits accounts to 25-50 posts per 24 hours.")
guide.append("> 2. **Spam & Shadowban Risk**: Dumping 30 reels at once triggers Meta spam bots, causing immediate shadowbans or account suspension.")
guide.append("> 3. **Algorithm Reach**: To maximize views and wholesale customer inquiries, publish **1 to 2 Reels daily** during peak hours (**12:30 PM** & **7:30 PM**).\n")

guide.append("## 30-Day Drip Publishing Schedule & Captions\n")

for sc_id in range(1, 16):
    sc = manifest[str(sc_id)]
    sc_name = sc["title"]
    hero = sc["sku1"]["name"]
    brand = sc["sku1"]["brand"]
    paired = sc["sku2"]["name"]
    paired_type = sc["sku2"].get("paired_type", "Gourmet Pairing")
    
    # Files
    hi_file = f"sc{sc_id:02d}_hindi_{sc['folder'].replace('scenario_', '')}.mp4"
    te_file = f"sc{sc_id:02d}_telugu_{sc['folder'].replace('scenario_', '')}.mp4"
    
    guide.append(f"### Scenario {sc_id:02d}: {sc_name}")
    guide.append(f"- **Hero Product**: {hero} ({brand})")
    guide.append(f"- **Paired Item**: {paired} ({paired_type})")
    guide.append(f"- **Telugu File**: `{te_file}`")
    guide.append(f"- **Hindi File**: `{hi_file}`")
    
    # Captions
    guide.append("\n**Telugu Caption (Copy & Paste):**")
    te_caption = f"""{sc['audio_te'][1]} {sc['audio_te'][2]}
రాయచోటి మరియు పరిసర ప్రాంతాల హోటళ్లు, ఫాస్ట్ ఫుడ్ సెంటర్లు & కుటుంబాలకు బల్క్ సప్లై అందుబాటులో ఉంది!

📞 ఆర్డర్ కొరకు ఇప్పుడే వాట్సాప్ చేయండి: 9347453135
📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)

#RAISAgencies #Rayachoty #RayachotyFood #FrozenFoodAndhra #KadapaFood #TeluguFoodie #{brand.replace(' ', '')} #{hero.replace(' ', '')} #WholesaleFood"""
    guide.append(f"```text\n{te_caption}\n```")
    
    guide.append("\n**Hindi Caption (Copy & Paste):**")
    hi_caption = f"""{sc['audio_hi'][1]} {sc['audio_hi'][2]}
रायचोटी के रेस्टोरेंट्स, कैफे और परिवारों के लिए बेस्ट क्वालिटी फ्रोजन फूड्स और पैकेजिंग!

📞 तुरंत ऑर्डर करें WhatsApp पर: 9347453135
📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)

#RAISAgencies #Rayachoty #RayachotyFood #FrozenFoodWholesale #QSRSupplies #{brand.replace(' ', '')} #{hero.replace(' ', '')} #FoodSuppliers"""
    guide.append(f"```text\n{hi_caption}\n```\n")
    guide.append("---\n")

out_file = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\rais_instagram_30_reels_publishing_guide.md"
with open(out_file, "w", encoding="utf-8") as f:
    f.write("\n".join(guide))

print(f"Publishing guide created: {out_file}")
