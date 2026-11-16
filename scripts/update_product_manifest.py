import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load all 66 SKUs
with open("scripts/catalogue_66_skus.json", "r", encoding="utf-8") as f:
    skus_list = json.load(f)
skus_by_code = {p["sku"]: p for p in skus_list}

def get_sku_info(sku_code):
    item = skus_by_code.get(sku_code)
    if not item:
        raise ValueError(f"SKU code {sku_code} not found in 66-SKU catalogue!")
    return {
        "code": item["sku"],
        "name": item["title"],
        "brand": item["brand"],
        "pack": item.get("pack", "Standard Pack"),
        "category": item.get("category", "Frozen Food"),
        "asset": f"public/images/products_catalogue/{os.path.basename(item['img_src'])}"
    }

scenarios_config = {
    "1": {
        "title": "Rainy-Day Crispy Cravings",
        "folder": "scenario_01_monsoon_cravings",
        "character": "public/images/character_test_scene_a_rain.jpg",
        "sku1_code": "rais-chk-04",  # Triken Chicken Momos
        "sku2_code": "rais-veg-01",  # Amul French Fries 6mm
        "paired_code": "rais-box-04", # Burger Box 4"x4" Printed
        "audio_hi": [
            "बारिश का मौसम और कुछ गरमा-गरम खाने का मन?",
            "ट्राई कीजिए Triken Chicken Momos का असली टेस्ट!",
            "साथ में क्रिस्पी Amul French Fries और फूड पैकेजिंग बॉक्सेस!",
            "होलसेल सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies रायचोटी!"
        ],
        "audio_te": [
            "చల్లని వర్షం పడుతుంటే వేడి వేడిగా ఏదైనా తినాలనిపిస్తుందా?",
            "ట్రై చేయండి రుచికరమైన Triken Chicken Momos!",
            "గోల్డెన్ Amul French Fries మరియు ప్రీమియం ప్యాకేజింగ్ బాక్సెస్!",
            "హోల్‌సేల్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies రాయచోటి!"
        ],
        "sub_en": [
            "Rainy weather outside and craving something hot & crispy?",
            "Try authentic Triken Chicken Momos — pure delicious taste!",
            "Crispy Amul French Fries and food packaging boxes!",
            "For wholesale supply, WhatsApp 9347453135 — RAIS Agencies, Rayachoty!"
        ]
    },
    "2": {
        "title": "Midnight Hunger Attack",
        "folder": "scenario_02_midnight_hunger",
        "character": "public/images/characters/ayesha_midnight.jpg",
        "sku1_code": "rais-chk-05",  # ITC Master Chef Chicken Nuggets
        "sku2_code": "rais-sau-08",  # Foodrite Salad Mayonnaise
        "paired_code": "rais-veg-02", # Hup Hup French Fries 6mm
        "audio_hi": [
            "रात के 12 बजे और अचानक ज़ोरों की भूख?",
            "तैयार कीजिए क्रिस्पी Master Chef Chicken Nuggets!",
            "साथ में क्रीमी Foodrite Mayonnaise और Hup Hup French Fries!",
            "होलसेल डिलीवरी के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "రాత్రి 12 గంటలకు సడెన్ గా ఆకలి వేస్తోందా?",
            "నిమిషాల్లో రెడీ చేసుకోండి క్రిస్పీ Master Chef Chicken Nuggets!",
            "క్రీమీ Foodrite Mayonnaise మరియు Hup Hup French Fries!",
            "హోల్‌సేల్ డెలివరీ కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "12 AM midnight and suddenly starving?",
            "Ready in minutes: crispy Master Chef Chicken Nuggets!",
            "Paired with creamy Foodrite Mayonnaise & Hup Hup French Fries!",
            "For wholesale supply, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "3": {
        "title": "Cricket Match Snack Attack",
        "folder": "scenario_03_cricket_match",
        "character": "public/images/characters/ayesha_cricket.jpg",
        "sku1_code": "rais-chk-03",  # Nutrich Chicken Popcorn Ball
        "sku2_code": "rais-sau-04",  # Del Monte Tandoori Mayo
        "paired_code": "rais-pac-kfcb", # KFC Bucket
        "audio_hi": [
            "क्रिकेट मैच का रोमांच और दोस्तों के साथ स्नैक टाइम!",
            "परोसिए हॉट और क्रंची Nutrich Chicken Popcorn Balls!",
            "साथ में स्पाइसी Del Monte Tandoori Mayo और स्नैक बकेट्स!",
            "रेस्टोरेंट और कैफे सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "క్రికెట్ మ్యాచ్ చూస్తూ ఫ్రెండ్స్‌తో ఎంజాయ్ చేయండి!",
            "హాట్ అండ్ క్రిస్పీ Nutrich Chicken Popcorn Balls!",
            "స్పైసీ Del Monte Tandoori Mayo మరియు స్నాక్ బకెట్స్!",
            "హోల్‌సేల్ ఆర్డర్ల కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Exciting cricket match and snack time with friends!",
            "Serve hot and crunchy Nutrich Chicken Popcorn Balls!",
            "Paired with spicy Del Monte Tandoori Mayo & snack buckets!",
            "For restaurant orders, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "4": {
        "title": "After-School Hunger Rush",
        "folder": "scenario_04_after_school_hunger",
        "character": "public/images/characters/ayesha_after_school.jpg",
        "sku1_code": "rais-veg-mcca", # McCain Smiles
        "sku2_code": "rais-sau-01",  # Del Monte Tomato Ketchup 1.1kg
        "paired_code": "rais-veg-07", # ITC Cheesy Corn Triangle
        "audio_hi": [
            "स्कूल के बाद बच्चों की भूख का सबसे मजेदार समाधान!",
            "सिर्फ 3 मिनट में तैयार McCain Smiles!",
            "साथ में Del Monte Tomato Ketchup और Cheesy Corn Triangles!",
            "होलसेल सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies रायचोटी!"
        ],
        "audio_te": [
            "స్కూల్ నుంచి రాగానే పిల్లల కోసం ఇన్‌స్టంట్ స్నాక్స్!",
            "3 నిమిషాల్లో రెడీ అయ్యే రుచికరమైన McCain Smiles!",
            "Del Monte Tomato Ketchup మరియు Cheesy Corn Triangles!",
            "హోల్‌సేల్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies రాయచోటి!"
        ],
        "sub_en": [
            "The perfect instant treat after a long school day!",
            "Ready in just 3 minutes: delicious McCain Smiles!",
            "Served with Del Monte Tomato Ketchup & Cheesy Corn Triangles!",
            "For wholesale supply, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "5": {
        "title": "Family Gathering Party Platter",
        "folder": "scenario_05_friends_arrive",
        "character": "public/images/characters/ayesha_family.jpg",
        "sku1_code": "rais-veg-03",  # ITC Veg Momos
        "sku2_code": "rais-veg-vegs", # Veg Spring Rolls
        "paired_code": "rais-sau-06", # Del Monte Pizza Pasta Sauce
        "audio_hi": [
            "घर पर अचानक मेहमान आ जाएं तो टेंशन बिल्कुल नहीं!",
            "परोसिए फ्रेश ITC Veg Momos और क्रिस्पी स्प्रिंग रोल्स!",
            "साथ में Del Monte Pizza Pasta Sauce का लाजवाब स्वाद!",
            "पार्टी और कैफे सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "ఇంటికి బంధువులు వస్తే టెన్షన్ పడకండి!",
            "రుచికరమైన ITC Veg Momos మరియు క్రిస్పీ Veg Spring Rolls!",
            "రిచ్ Del Monte Pizza Pasta Sauce తో!",
            "హోల్‌సేల్ ఆర్డర్స్ కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Guests arrived home without notice? No worries!",
            "Serve fresh ITC Veg Momos & crispy Veg Spring Rolls!",
            "Paired with rich Del Monte Pizza Pasta Sauce!",
            "For cafe supply, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "6": {
        "title": "QSR Commercial Kitchen Efficiency",
        "folder": "scenario_06_busy_day_convenience",
        "character": "public/images/characters/ayesha_qsr_kitchen.jpg",
        "sku1_code": "rais-chk-06",  # Nutrich Chicken Burger Patty
        "sku2_code": "rais-veg-burg", # Burger Bun
        "paired_code": "rais-box-05", # Burger Box 5"x5" Printed
        "audio_hi": [
            "फास्ट फूड रेस्टोरेंट और कैफे में तेज और परफेक्ट सर्विस!",
            "तैयार कीजिए Nutrich Chicken Burger Patty के साथ टेस्टी बर्गर!",
            "साथ में फ्रेश Burger Buns और कस्टमाइज्ड बर्गर बॉक्सेस!",
            "कमर्शियल किचन सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "ఫాస్ట్ ఫుడ్ కేఫ్‌లలో వేగవంతమైన సర్వీస్ మరియు టేస్ట్!",
            "రుచికరమైన Nutrich Chicken Burger Patty తో బర్గర్లు చేయండి!",
            "తాజా Burger Buns మరియు ప్రింటెడ్ బర్గర్ బాక్సెస్!",
            "కమర్షియల్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Fast service and unbeatable taste for busy commercial kitchens!",
            "Craft gourmet burgers with Nutrich Chicken Burger Patties!",
            "Complete with fresh Burger Buns & printed burger boxes!",
            "For commercial orders, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "7": {
        "title": "Birthday Party Celebration Platter",
        "folder": "scenario_07_birthday_party",
        "character": "public/images/characters/ayesha_birthday.jpg",
        "sku1_code": "rais-veg-07",  # ITC Cheesy Corn Triangle
        "sku2_code": "rais-moj-02",  # Blue Curacao Manama
        "paired_code": "rais-pac-tiss", # Tissue Papers Pack
        "audio_hi": [
            "बर्थडे पार्टी और सेलिब्रेशन को बनाइए और भी खास!",
            "परोसिए चीज़ी ITC Cheesy Corn Triangles!",
            "साथ में रिफ्रेशिंग Blue Curacao मोहीतो और पार्टी सप्लाइज!",
            "इवेंट्स और कैफे सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "బర్త్‌డే పార్టీలను మరింత ఉత్సాహంగా జరుపుకోండి!",
            "చీజీ టేస్ట్‌తో ITC Cheesy Corn Triangles!",
            "రిఫ్రెషింగ్ Blue Curacao మొహీతో మరియు పార్టీ సప్లైస్!",
            "ఈవెంట్ ఆర్డర్ల కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Make birthday parties and celebrations unforgettable!",
            "Serve delicious ITC Cheesy Corn Triangles!",
            "Paired with refreshing Blue Curacao mojito & party supplies!",
            "For catering supply, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "8": {
        "title": "Street Food Cart Quick Bites",
        "folder": "scenario_08_restaurant_rush_hour",
        "character": "public/images/characters/ayesha_streetfood.jpg",
        "sku1_code": "rais-chi-fing", # Fingers Chicken
        "sku2_code": "rais-sau-02",  # Foodrite Tomato Ketchup
        "paired_code": "rais-pac-mayo", # Mayonnaise Cups 35mm
        "audio_hi": [
            "शाम की स्ट्रीट फूड रौनक और गरमा-गरम क्रिस्पी स्नैक्स!",
            "कस्टमर्स का दिल जीतिए फ्रेश Chicken Fingers के साथ!",
            "साथ में Foodrite Tomato Ketchup और 35mm मेयोनेज़ कप्स!",
            "स्ट्रीट फूड और कियोस्क सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "సాయంత్రం స్ట్రీట్ ఫుడ్ సెంటర్‌లో రష్‌ను మేనేజ్ చేయండి!",
            "క్రిస్పీ Chicken Fingers మీ కస్టమర్ల కోసం!",
            "Foodrite Tomato Ketchup మరియు మేయోనేజ్ కప్స్!",
            "క్రియోస్క్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Delight your evening street food crowd with sizzling snacks!",
            "Serve crispy, golden Chicken Fingers that customers love!",
            "Paired with Foodrite Tomato Ketchup & 35mm mayo portion cups!",
            "For kiosk supplies, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "9": {
        "title": "Office Pantry & Corporate Tea Break",
        "folder": "scenario_09_burger_shop_transformation",
        "character": "public/images/characters/ayesha_office.jpg",
        "sku1_code": "rais-veg-05",  # ITC Paneer Patty
        "sku2_code": "rais-sau-05",  # Del Monte Creamy Cheese Sauce
        "paired_code": "rais-chk-01", # Signature Tortilla 10 Inches
        "audio_hi": [
            "ऑफिस टी-ब्रेक में कलीग्स के साथ शेयर कीजिए स्वादिष्ट स्नैक्स!",
            "तैयार कीजिए स्पाइसी ITC Paneer Patty रैप्स और रोल्स!",
            "साथ में Del Monte Creamy Cheese Sauce और Signature Tortilla!",
            "कॉर्पोरेट कैफे सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "ఆఫీస్ టీ-బ్రేక్‌లో కొలీగ్స్‌తో ఎంజాయ్ చేసే స్నాక్స్!",
            "టేస్టీ ITC Paneer Patty తో క్రిస్పీ రోల్స్ చేయండి!",
            "Del Monte Creamy Cheese Sauce మరియు Signature Tortilla!",
            "కార్పొరేట్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies రాయచోటి!"
        ],
        "sub_en": [
            "Power up office tea-breaks with wholesome gourmet bites!",
            "Prepare fresh wraps with spicy ITC Paneer Patties!",
            "Drizzled with Del Monte Creamy Cheese Sauce in Signature Tortillas!",
            "For corporate orders, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "10": {
        "title": "Balcony Rain & Evening Chai Bliss",
        "folder": "scenario_10_summer_refreshment",
        "character": "public/images/characters/ayesha_balcony.jpg",
        "sku1_code": "rais-veg-06",  # Godrej Paneer Pops
        "sku2_code": "rais-brd-03",  # VKL Peri Peri Powder
        "paired_code": "rais-veg-butt", # Butter Paper Pack
        "audio_hi": [
            "बालकनी में बारिश की बूंदें और गरमा-गरम चाय की चुस्की!",
            "साथ में क्रिस्पी Godrej Paneer Pops का लाजवाब क्रंच!",
            "ऊपर से छिड़किए ज़िंगी VKL Peri Peri मसाला!",
            "होलसेल और कैफे ऑर्डर के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "బాల్కనీలో చల్లని వర్షం చూస్తూ వేడి టీ తో ఎంజాయ్ చేయండి!",
            "క్రిస్పీ Godrej Paneer Pops సూపర్ టేస్టీగా ఉంటాయి!",
            "స్పైసీ VKL Peri Peri మసాలా స్ప్రింక్లర్ తో!",
            "కేఫ్ హోల్‌సేల్ కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Gentle balcony rain paired with hot evening tea!",
            "Enjoy crunchy, golden Godrej Paneer Pops right at home!",
            "Sprinkled with zesty VKL Peri Peri seasoning!",
            "For wholesale supply, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "11": {
        "title": "Weekend Movie Night Crunch",
        "folder": "scenario_11_the_irresistible_crunch",
        "character": "public/images/characters/ayesha_movie.jpg",
        "sku1_code": "rais-veg-02",  # Hup Hup French Fries 6mm
        "sku2_code": "rais-sau-mrfo", # Foodrite Chocolate Dressing
        "paired_code": "rais-sau-09", # Foodrite Mayonnaise Sachets
        "audio_hi": [
            "वीकेंड मूवी नाइट और परिवार के साथ फेवरेट फिल्म!",
            "एंजॉय कीजिए सुपर क्रिस्पी Hup Hup French Fries 6mm!",
            "साथ में Foodrite Chocolate Dressing और मेयोनेज़ सैशे!",
            "होलसेल सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies रायचोटी!"
        ],
        "audio_te": [
            "వీకెండ్ మూవీ చూస్తూ ఫ్యామిలీతో సరదాగా గడపండి!",
            "గోల్డెన్ అండ్ క్రిస్పీ Hup Hup French Fries 6mm!",
            "Foodrite Chocolate Dressing మరియు మాయో సాచెట్స్!",
            "హోల్‌సేల్ ఆర్డర్ల కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Weekend movie marathon with loved ones on the couch!",
            "Munch on extra crispy Hup Hup French Fries 6mm!",
            "Paired with Foodrite Chocolate Dressing & mayo sachets!",
            "For wholesale supply, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "12": {
        "title": "Road Trip Highway Rest Stop",
        "folder": "scenario_12_restaurant_stock_planning",
        "character": "public/images/characters/ayesha_roadtrip.jpg",
        "sku1_code": "rais-veg-04",  # Chilli Fill Veg Burger Patty
        "sku2_code": "rais-moj-01",  # Lime and Mint Mojito Manama
        "paired_code": "rais-box-04", # Burger Box 4"x4" Printed
        "audio_hi": [
            "हाईवे रोड ट्रिप और सफर का मजेदार रिफ्रेशिंग ब्रेक!",
            "खाइए स्पाइसी Chilli Fill Veg Burger Patty का फ्रेश बर्गर!",
            "साथ में चिल्ड Lime & Mint मोहीतो और टेकअवे बर्गर बॉक्सेस!",
            "ढाबा और हाईवे कैफे सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "హైవే రోడ్ ట్రిప్‌లో రిఫ్రెషింగ్ ఫుడ్ బ్రేక్ తీసుకోండి!",
            "రుచికరమైన Chilli Fill Veg Burger Patty బర్గర్స్!",
            "కూల్ Lime & Mint మొహీతో మరియు టేక్‌అవే ప్యాకేజింగ్!",
            "హైవే కేఫ్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Exciting highway road trips and scenic rest stop cravings!",
            "Grab a hot burger made with Chilli Fill Veg Burger Patty!",
            "Paired with chilled Lime & Mint mojito & takeaway boxes!",
            "For highway café supplies, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "13": {
        "title": "Post-Workout Wholesome Protein Reward",
        "folder": "scenario_13_weekend_movie_night",
        "character": "public/images/characters/ayesha_fitness.jpg",
        "sku1_code": "rais-chs-04",  # Milky Mist Paneer Diced Cubes
        "sku2_code": "rais-veg-08",  # Sweet Corn Rais Fresh
        "paired_code": "rais-brd-04", # Oregano Rais Select
        "audio_hi": [
            "वर्कआउट के बाद हेल्दी और टेस्टी प्रोटीन डाइट!",
            "बनाइए फ्रेश Milky Mist Diced Paneer और Sweet Corn बाउल!",
            "ऊपर से छिड़किए खुशबूदार Big Bell Oregano हर्ब्स!",
            "हेल्थ कैफे और जिम सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "audio_te": [
            "వర్కౌట్ తర్వాత హెల్తీ మరియు ప్రోటీన్ రిచ్ స్నాక్!",
            "తాజా Milky Mist Paneer Diced Cubes మరియు Sweet Corn!",
            "ఆరోమాటిక్ Oregano హెర్బ్స్ తో మరింత రుచి!",
            "హెల్త్ కేఫ్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Wholesome protein nourishment after an intense workout!",
            "Toss fresh Milky Mist Diced Paneer & sweet corn salad!",
            "Seasoned with aromatic Big Bell Oregano herbal sprinkle!",
            "For health cafe supplies, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "14": {
        "title": "Late-Night QSR Takeaway Rush",
        "folder": "scenario_14_packaging_matters",
        "character": "public/images/characters/ayesha_late_qsr.jpg",
        "sku1_code": "rais-veg-pizz", # Pizza Base 8 Inch
        "sku2_code": "rais-chs-01",  # Milky Mist Mozzarella Diced Cheese 2kg
        "paired_code": "rais-box-03", # Pizza Box 8"x8" Printed Laminated
        "audio_hi": [
            "लेट-नाइट डिलीवरी में हर पिज्जा पहुंचे गरमा-गरम और चीज़ी!",
            "परफेक्ट क्रस्ट के लिए फ्रेश Pizza Base 8 Inch!",
            "भरपूर स्ट्रेच के लिए Milky Mist Mozzarella Cheese और बॉक्सेस!",
            "पिज्जा आउटलेट सप्लाइ के लिए WhatsApp 9347453135 — RAIS Agencies रायचोटी!"
        ],
        "audio_te": [
            "లేట్-నైట్ డెలివరీలో పిజ్జాలు వేడిగా, ఫ్రెష్ గా చేరాలి!",
            "పర్ఫెక్ట్ క్రస్ట్ కోసం తాజా Pizza Base 8 Inch!",
            "రిచ్ Milky Mist Mozzarella Cheese మరియు ప్రింటెడ్ పిజ్జా బాక్సెస్!",
            "పిజ్జా ఔట్‌లెట్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies!"
        ],
        "sub_en": [
            "Keep late-night pizza orders hot, cheesy, and safely packaged!",
            "Craft artisanal pies with ready-to-bake 8\" Pizza Bases!",
            "Loaded with Milky Mist Mozzarella Cheese in laminated boxes!",
            "For pizza outlet supply, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    },
    "15": {
        "title": "Cold-Chain Logistics & Reliable B2B Food Partner",
        "folder": "scenario_15_meet_your_food_partner",
        "character": "public/images/character_test_scene_b_b2b.jpg",
        "sku1_code": "rais-brd-02",  # VKL Crispy Cajun Breading Mix
        "sku2_code": "rais-chs-03",  # Milky Mist Cheese Slice
        "paired_code": "rais-box-01", # Pizza Box 9x9 Plain
        "audio_hi": [
            "रेस्टोरेंट और कैफे बिजनेस के लिए एक भरोसेमंद फूड पार्टनर!",
            "प्रीमियम VKL Crispy Cajun Breading Mix और Milky Mist Cheese Slices!",
            "पूरी तरह कोल्ड-चेन फ्रोजन फूड और पैकेजिंग सप्लाइज!",
            "होलसेल पार्टनरशिप के लिए WhatsApp 9347453135 — RAIS Agencies रायचोटी!"
        ],
        "audio_te": [
            "మీ రెస్టారెంట్ మరియు కేఫ్ బిజినెస్‌కు నమ్మకమైన ఫుడ్ పార్ట్నర్!",
            "ప్రీమియం VKL Crispy Cajun Breading మరియు Milky Mist Cheese Slices!",
            "కోల్డ్-చైన్ ఫ్రోజెన్ ఫుడ్స్ మరియు ప్యాకేజింగ్ సొల్యూషన్స్!",
            "హోల్‌సేల్ సప్లై కోసం WhatsApp 9347453135 — RAIS Agencies రాయచోటి!"
        ],
        "sub_en": [
            "Your trusted end-to-end food partner for cafes and restaurants!",
            "Premium VKL Crispy Cajun Breading Mix & Milky Mist Cheese Slices!",
            "100% cold-chain preserved frozen foods & packaging solutions!",
            "For wholesale distribution, WhatsApp 9347453135 — RAIS Agencies!"
        ]
    }
}

manifest = {}
for sc_id, cfg in scenarios_config.items():
    sku1 = get_sku_info(cfg["sku1_code"])
    sku2 = get_sku_info(cfg["sku2_code"])
    paired = get_sku_info(cfg["paired_code"])
    
    sku2["paired_code"] = paired["code"]
    sku2["paired_name"] = paired["name"]
    sku2["paired_asset"] = paired["asset"]
    
    manifest[sc_id] = {
        "title": cfg["title"],
        "folder": cfg["folder"],
        "character": cfg["character"],
        "sku1": sku1,
        "sku2": sku2,
        "audio_hi": cfg["audio_hi"],
        "audio_te": cfg["audio_te"],
        "sub_en": cfg["sub_en"]
    }

with open("scripts/product_manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("Updated scripts/product_manifest.json with synchronized audio scripts!")
