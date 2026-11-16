import os
import shutil
import json

base_dir = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website"
video_dir = os.path.join(base_dir, "public", "videos", "final_30_reels")
dest_dir = r"C:\Users\affra\Desktop\RAIS_Daily_2_Reels_Queue"
os.makedirs(dest_dir, exist_ok=True)

# Map all 30 reels (Day 1 to 15, 2 slots per day)
# Days 2 to 15 are the 28 remaining reels!
reels_schedule = [
    # Day 1 (Already published)
    {"day": 1, "slot": 1, "lang": "Telugu", "file": "sc01_telugu_01_monsoon_cravings.mp4", "product": "Chicken Momos", "time": "12:30 PM", "status": "Published"},
    {"day": 1, "slot": 2, "lang": "Hindi", "file": "sc01_hindi_01_monsoon_cravings.mp4", "product": "Chicken Momos", "time": "07:30 PM", "status": "Published"},
    
    # Day 2
    {"day": 2, "slot": 1, "lang": "Telugu", "file": "sc02_telugu_02_midnight_hunger.mp4", "product": "Chicken Nuggets", "time": "12:30 PM", "theme": "Midnight Hunger"},
    {"day": 2, "slot": 2, "lang": "Hindi", "file": "sc02_hindi_02_midnight_hunger.mp4", "product": "Chicken Nuggets", "time": "07:30 PM", "theme": "Midnight Hunger"},
    
    # Day 3
    {"day": 3, "slot": 1, "lang": "Telugu", "file": "sc03_telugu_03_cricket_match.mp4", "product": "Crispy French Fries", "time": "12:30 PM", "theme": "Cricket Match Snacks"},
    {"day": 3, "slot": 2, "lang": "Hindi", "file": "sc03_hindi_03_cricket_match.mp4", "product": "Crispy French Fries", "time": "07:30 PM", "theme": "Cricket Match Snacks"},
    
    # Day 4
    {"day": 4, "slot": 1, "lang": "Telugu", "file": "sc04_telugu_04_after_school_hunger.mp4", "product": "Veggie Pizza Pocket", "time": "12:30 PM", "theme": "After School Hunger"},
    {"day": 4, "slot": 2, "lang": "Hindi", "file": "sc04_hindi_04_after_school_hunger.mp4", "product": "Veggie Pizza Pocket", "time": "07:30 PM", "theme": "After School Hunger"},
    
    # Day 5
    {"day": 5, "slot": 1, "lang": "Telugu", "file": "sc05_telugu_05_friends_arrive.mp4", "product": "Cheesy Corn Triangles", "time": "12:30 PM", "theme": "Friends Gathering"},
    {"day": 5, "slot": 2, "lang": "Hindi", "file": "sc05_hindi_05_friends_arrive.mp4", "product": "Cheesy Corn Triangles", "time": "07:30 PM", "theme": "Friends Gathering"},
    
    # Day 6
    {"day": 6, "slot": 1, "lang": "Telugu", "file": "sc06_telugu_06_busy_day_convenience.mp4", "product": "Veg Burger Patty", "time": "12:30 PM", "theme": "Busy Day Quick Meals"},
    {"day": 6, "slot": 2, "lang": "Hindi", "file": "sc06_hindi_06_busy_day_convenience.mp4", "product": "Veg Burger Patty", "time": "07:30 PM", "theme": "Busy Day Quick Meals"},
    
    # Day 7
    {"day": 7, "slot": 1, "lang": "Telugu", "file": "sc07_telugu_07_birthday_party.mp4", "product": "Chicken Popcorn", "time": "12:30 PM", "theme": "Birthday Party Platter"},
    {"day": 7, "slot": 2, "lang": "Hindi", "file": "sc07_hindi_07_birthday_party.mp4", "product": "Chicken Popcorn", "time": "07:30 PM", "theme": "Birthday Party Platter"},
    
    # Day 8
    {"day": 8, "slot": 1, "lang": "Telugu", "file": "sc08_telugu_08_restaurant_rush_hour.mp4", "product": "Mozzarella Cheese 2kg", "time": "12:30 PM", "theme": "Restaurant Rush Hour"},
    {"day": 8, "slot": 2, "lang": "Hindi", "file": "sc08_hindi_08_restaurant_rush_hour.mp4", "product": "Mozzarella Cheese 2kg", "time": "07:30 PM", "theme": "Restaurant Rush Hour"},
    
    # Day 9
    {"day": 9, "slot": 1, "lang": "Telugu", "file": "sc09_telugu_09_burger_shop_transformation.mp4", "product": "Chicken Patty & Mayo", "time": "12:30 PM", "theme": "Burger Shop Upgrade"},
    {"day": 9, "slot": 2, "lang": "Hindi", "file": "sc09_hindi_09_burger_shop_transformation.mp4", "product": "Chicken Patty & Mayo", "time": "07:30 PM", "theme": "Burger Shop Upgrade"},
    
    # Day 10
    {"day": 10, "slot": 1, "lang": "Telugu", "file": "sc10_telugu_10_summer_refreshment.mp4", "product": "Mojito Syrups Trio", "time": "12:30 PM", "theme": "Summer Drinks & Mojitos"},
    {"day": 10, "slot": 2, "lang": "Hindi", "file": "sc10_hindi_10_summer_refreshment.mp4", "product": "Mojito Syrups Trio", "time": "07:30 PM", "theme": "Summer Drinks & Mojitos"},
    
    # Day 11
    {"day": 11, "slot": 1, "lang": "Telugu", "file": "sc11_telugu_11_the_irresistible_crunch.mp4", "product": "Crispy Cajun Breading", "time": "12:30 PM", "theme": "Crispy Fried Chicken"},
    {"day": 11, "slot": 2, "lang": "Hindi", "file": "sc11_hindi_11_the_irresistible_crunch.mp4", "product": "Crispy Cajun Breading", "time": "07:30 PM", "theme": "Crispy Fried Chicken"},
    
    # Day 12
    {"day": 12, "slot": 1, "lang": "Telugu", "file": "sc12_telugu_12_restaurant_stock_planning.mp4", "product": "Wholesale Depot Inventory", "time": "12:30 PM", "theme": "Weekend Stock Planning"},
    {"day": 12, "slot": 2, "lang": "Hindi", "file": "sc12_hindi_12_restaurant_stock_planning.mp4", "product": "Wholesale Depot Inventory", "time": "07:30 PM", "theme": "Weekend Stock Planning"},
    
    # Day 13
    {"day": 13, "slot": 1, "lang": "Telugu", "file": "sc13_telugu_13_weekend_movie_night.mp4", "product": "Potato Smiles & Nuggets", "time": "12:30 PM", "theme": "Weekend Movie Night"},
    {"day": 13, "slot": 2, "lang": "Hindi", "file": "sc13_hindi_13_weekend_movie_night.mp4", "product": "Potato Smiles & Nuggets", "time": "07:30 PM", "theme": "Weekend Movie Night"},
    
    # Day 14
    {"day": 14, "slot": 1, "lang": "Telugu", "file": "sc14_telugu_14_packaging_matters.mp4", "product": "Burger & Pizza Boxes", "time": "12:30 PM", "theme": "Premium Takeaway Packaging"},
    {"day": 14, "slot": 2, "lang": "Hindi", "file": "sc14_hindi_14_packaging_matters.mp4", "product": "Burger & Pizza Boxes", "time": "07:30 PM", "theme": "Premium Takeaway Packaging"},
    
    # Day 15
    {"day": 15, "slot": 1, "lang": "Telugu", "file": "sc15_telugu_15_meet_your_food_partner.mp4", "product": "RAIS Full Supply Suite", "time": "12:30 PM", "theme": "Rayachoti Food Partner"},
    {"day": 15, "slot": 2, "lang": "Hindi", "file": "sc15_hindi_15_meet_your_food_partner.mp4", "product": "RAIS Full Supply Suite", "time": "07:30 PM", "theme": "Rayachoti Food Partner"},
]

# Create organized folders for Day 2 to Day 15 (28 reels)
copied_count = 0
summary_rows = []

for item in reels_schedule:
    day = item["day"]
    slot = item["slot"]
    lang = item["lang"]
    src_file = os.path.join(video_dir, item["file"])
    
    folder_name = f"Day_{day:02d}"
    day_folder = os.path.join(dest_dir, folder_name)
    os.makedirs(day_folder, exist_ok=True)
    
    target_video_name = f"Day{day:02d}_Slot{slot}_{lang}_{item['product'].replace(' ', '_')}.mp4"
    dest_file = os.path.join(day_folder, target_video_name)
    
    if os.path.exists(src_file):
        shutil.copy2(src_file, dest_file)
        copied_count += 1
    
    # Create caption text file
    caption_content = f"""============================================================
RAIS AGENCIES — DAY {day} (SLOT {slot} - {item['time']})
Language: {lang} | Product: {item['product']}
Scheduled Post Time: {item['time']} (Daily 2 Schedule)
============================================================

CAPTION TO COPY:

Rayachoti లో హోటల్స్, కేఫ్‌లు & రెస్టారెంట్ల కోసం ప్రీమియం ఫ్రోజెన్ ఫుడ్స్ హోల్‌సేల్ సప్లై! 🍟🥟🍔
Looking for fresh, high-margin {item['product']} for your commercial kitchen in Rayachoti? 
RAIS Agencies is your direct wholesale partner!

✅ 100% Cold-Chain Integrity (-18°C)
✅ Direct Wholesale & B2B Rates (No Middlemen)
✅ Prompt Local Delivery Across Rayachoti

📲 ఆర్డర్స్ & హోల్‌సేల్ క్యాటలాగ్ కోసం ఇప్పుడే WhatsApp చేయండి:
📞 9347453135 | 9573261696
🌐 raisfoods.in (https://dataengineer-irfan.github.io/RAIS-AGENCIES/)
📑 Catalogue: https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html

📍 Depot Address:
Rayachoti Sundapalli Road, Near Reddies Colony (Opposite Reddy Colony Board), Rayachoty - 516269, A.P.

#Rayachoti #Rayachoty #RAISAgencies #RaisFrozenFoods #FrozenFoodsWholesale #{item['product'].replace(' ', '')} #Kadapa #AnnamayyaDistrict #HotelsAndCafes
"""
    caption_path = os.path.join(day_folder, f"Day{day:02d}_Slot{slot}_{lang}_Caption.txt")
    with open(caption_path, "w", encoding="utf-8") as cf:
        cf.write(caption_content)

print(f"Successfully organized {copied_count} video files into {dest_dir}")
