import re

file_path = "src/data/reelsCalendar.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace presenterName: 'Ananya' with presenterName: 'Ayesha'
content = re.sub(r"presenterName:\s*'Ananya'", "presenterName: 'Ayesha'", content)

# Replace presenterAttire
content = re.sub(r"presenterAttire:\s*'[^']+'", "presenterAttire: 'Modest Turquoise/Mint Embroidered Hijab & Pastel Attire'", content)

# Update mediaUrl for Day 1
content = content.replace("assetUrl('/videos/campaign_01_monsoon_crispy.mp4')", "assetUrl('/videos/campaigns/scenario_01_monsoon_cravings/master_hindi_21s.mp4')")

# Map campaign mediaUrls for Days 2 to 15
scenario_map = {
    2: "scenario_02_midnight_hunger",
    3: "scenario_03_cricket_match",
    4: "scenario_04_after_school_hunger",
    5: "scenario_05_friends_arrive",
    6: "scenario_06_busy_day_convenience",
    7: "scenario_07_birthday_party",
    8: "scenario_08_restaurant_rush_hour",
    9: "scenario_09_burger_shop_transformation",
    10: "scenario_10_summer_refreshment",
    11: "scenario_11_the_irresistible_crunch",
    12: "scenario_12_restaurant_stock_planning",
    13: "scenario_13_weekend_movie_night",
    14: "scenario_14_packaging_matters",
    15: "scenario_15_meet_your_food_partner"
}

for day, folder in scenario_map.items():
    pattern = rf"(id:\s*'reel-day-{day:02d}',[\s\S]*?videoSpecs:\s*\{{[^}}]*?)(durationSeconds:\s*\d+,)"
    replacement = rf"\1\2\n      mediaUrl: assetUrl('/videos/campaigns/{folder}/master_hindi_21s.mp4'),"
    content = re.sub(pattern, replacement, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("[SUCCESS] src/data/reelsCalendar.ts updated with Ayesha presenter and scenario campaign media URLs!")
