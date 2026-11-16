import json
import os

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

dates = [
    ("2026-10-28"),
    ("2026-10-29"),
    ("2026-10-30"),
    ("2026-10-31"),
    ("2026-11-01"),
    ("2026-11-02"),
    ("2026-11-03"),
    ("2026-11-04"),
    ("2026-11-05"),
    ("2026-11-06"),
    ("2026-11-07"),
    ("2026-11-08"),
    ("2026-11-09"),
    ("2026-11-10"),
    ("2026-11-11"),
]

reels_entries = []

item_num = 1
for day_idx, d_str in enumerate(dates):
    sc_id = day_idx + 1
    sc = manifest[str(sc_id)]
    clean_folder = sc['folder'].replace('scenario_', '')
    hero = sc['sku1']
    paired = sc['sku2']
    
    # 1. Slot 1: Telugu (12:30 PM)
    te_file = f"/videos/final_30_reels/sc{sc_id:02d}_telugu_{clean_folder}.mp4"
    te_caption = f"{sc['audio_te'][0]} {sc['audio_te'][1]} {sc['audio_te'][2]}\\n\\nరాయచోటిలోని హోటళ్ళు, ఫాస్ట్ ఫుడ్ సెంటర్లు మరియు కుటుంబాలకు అత్యుత్తమ నాణ్యమైన ఫ్రోజెన్ ఫుడ్స్ హోల్‌సేల్ రేట్లకే లభిస్తాయి!\\n\\n📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)\\n📲 వాట్సాప్ ఆర్డర్: 9347453135"
    
    te_entry = f"""  {{
    id: 'reel-slot-{item_num:02d}',
    dayNumber: {day_idx + 1},
    scheduledDate: '{d_str}',
    scheduledTime: '12:30',
    theme: '{'packaging_supplies' if sc.get('is_b2b') else 'frozen_products'}',
    title: 'Day {day_idx + 1} Slot 1 (Telugu) — {sc['title']}',
    targetAudience: 'Rayachoty local cafes, tiffin centers, foodies & families',
    productSku: '{hero['code']}',
    productName: '{hero['name']}',
    brand: '{hero['brand']}',
    packSize: '{hero.get('pack', '1kg Pack')}',
    productImage: assetUrl('{hero['asset'].replace('public/', '/')}'),
    hookTelugu: '{sc['audio_te'][0]}',
    scriptTelugu: '{sc['audio_te'][1]} {sc['audio_te'][2]}',
    scriptEnglishBrief: '{sc['title']} - Telugu Edition with {hero['name']}',
    caption: '{te_caption}',
    hashtags: ['#Rayachoty', '#RayachotyFood', '#RAISAgencies', '#TeluguFoodie', '#{hero['brand'].replace(' ', '')}', '#{hero['name'].replace(' ', '')}'],
    ctaKeyword: 'ORDER',
    videoSpecs: {{
      aspectRatio: '9:16',
      resolution: '1080x1920',
      durationSeconds: 18,
      presenterName: 'Ayesha',
      presenterAttire: 'Modest Turquoise/Mint Hijab & Pastel Attire',
      audioMood: 'Cinematic commercial with synchronized speech and music fade',
      mediaUrl: assetUrl('{te_file}')
    }},
    status: 'scheduled',
    retryCount: 0
  }}"""
    reels_entries.append(te_entry)
    item_num += 1

    # 2. Slot 2: Hindi (19:30 PM)
    hi_file = f"/videos/final_30_reels/sc{sc_id:02d}_hindi_{clean_folder}.mp4"
    hi_caption = f"{sc['audio_hi'][0]} {sc['audio_hi'][1]} {sc['audio_hi'][2]}\\n\\nरायचोटी और आसपास के सभी रेस्टोरेंट्स, कैफे और परिवारों के लिए 100% ऑथेंटिक फ्रोजन फूड्स!\\n\\n📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)\\n📲 तुरंत WhatsApp करें: 9347453135"

    hi_entry = f"""  {{
    id: 'reel-slot-{item_num:02d}',
    dayNumber: {day_idx + 1},
    scheduledDate: '{d_str}',
    scheduledTime: '19:30',
    theme: '{'packaging_supplies' if sc.get('is_b2b') else 'frozen_products'}',
    title: 'Day {day_idx + 1} Slot 2 (Hindi) — {sc['title']}',
    targetAudience: 'Regional restaurant managers, QSR franchises & cloud kitchens',
    productSku: '{hero['code']}',
    productName: '{hero['name']}',
    brand: '{hero['brand']}',
    packSize: '{hero.get('pack', '1kg Pack')}',
    productImage: assetUrl('{hero['asset'].replace('public/', '/')}'),
    hookTelugu: '{sc['audio_hi'][0]}',
    scriptTelugu: '{sc['audio_hi'][1]} {sc['audio_hi'][2]}',
    scriptEnglishBrief: '{sc['title']} - Hindi Edition with {hero['name']}',
    caption: '{hi_caption}',
    hashtags: ['#Rayachoty', '#RAISAgencies', '#RayachotyFood', '#FrozenFoodWholesale', '#{hero['brand'].replace(' ', '')}', '#{hero['name'].replace(' ', '')}'],
    ctaKeyword: 'CATALOGUE',
    videoSpecs: {{
      aspectRatio: '9:16',
      resolution: '1080x1920',
      durationSeconds: 18,
      presenterName: 'Ayesha',
      presenterAttire: 'Modest Turquoise/Mint Hijab & Pastel Attire',
      audioMood: 'Cinematic commercial with synchronized speech and music fade',
      mediaUrl: assetUrl('{hi_file}')
    }},
    status: 'scheduled',
    retryCount: 0
  }}"""
    reels_entries.append(hi_entry)
    item_num += 1

ts_content = f"""import {{ ReelCalendarItem }} from './automationTypes';
import {{ assetUrl }} from '../utils/assetUrl';

export const REELS_30_DAYS: ReelCalendarItem[] = [
{',\n'.join(reels_entries)}
];
"""

out_ts_file = "src/data/reelsCalendar.ts"
with open(out_ts_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Updated {out_ts_file} with {len(reels_entries)} scheduled reels across 15 days (2 per day)!")
