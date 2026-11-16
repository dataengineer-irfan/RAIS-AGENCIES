import json

MANIFEST = {
    1: {
        "title": "Rainy-Day Crispy Cravings",
        "folder": "scenario_01_monsoon_cravings",
        "character": "public/images/character_test_scene_a_rain.jpg",
        "char_motion": "blink_and_rain",
        "sku1": {
            "code": "RAIS-CHK-04",
            "name": "ITC Chicken Momos",
            "brand": "ITC Master Chef",
            "pack": "500g Pack",
            "asset": "public/images/products/chicken_momos.jpg",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-VEG-01",
            "name": "ITC Crispy French Fries",
            "brand": "ITC Master Chef",
            "pack": "2.5kg Pack",
            "asset": "public/images/products/itc_french_fries.webp",
            "paired_asset": "public/images/products/kraft_burger_box.jpg",
            "paired_name": "Kraft Burger Box 4\"x4\"",
            "paired_code": "RAIS-BOX-02",
            "motion": "cards_float"
        },
        "audio_hi": [
            "बारिश का मौसम और कुछ गरमा-गरम क्रिस्पी खाने का मन?",
            "ट्राई कीजिए ITC Master Chef Chicken Momos — रेस्टोरेंट जैसा टेस्ट!",
            "गोल्डन क्रिस्पी French Fries और Kraft पैकेजिंग बॉक्सेस!",
            "इन्क्वायरी और होलसेल सप्लाई के लिए, Instagram पर DM करें — RAIS Agencies, रायचोटी!"
        ],
        "audio_te": [
            "బయట చల్లని వర్షం... వేడి వేడిగా, క్రిస్పీగా ఏదైనా తినాలనిపిస్తుందా?",
            "ట్రై చేయండి రుచికరమైన ITC Master Chef Chicken Momos!",
            "గోల్డెన్ క్రిస్పీ French Fries మరియు Kraft ప్యాకేజింగ్ బాక్సెస్!",
            "హోల్‌సేల్ సప్లై కోసం Instagram లో DM చేయండి — RAIS Agencies, రాయచోటి!"
        ],
        "sub_en": [
            "Pleasant rainy weather & craving something crispy?",
            "Try delicious ITC Master Chef Chicken Momos — authentic restaurant taste!",
            "Golden crispy French Fries & Kraft packaging boxes!",
            "For enquiries & wholesale supply, DM us on Instagram — RAIS Agencies, Rayachoty!"
        ]
    },
    2: {
        "title": "Midnight Hunger Attack",
        "folder": "scenario_02_midnight_hunger",
        "character": "public/images/characters/ayesha_midnight.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-CHK-05",
            "name": "ITC Chicken Nuggets",
            "brand": "ITC Master Chef",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_nuggets.webp",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-SAU-08",
            "name": "Foodrite Salad Mayonnaise",
            "brand": "Foodrite",
            "pack": "1kg Pack",
            "asset": "public/images/products/foodrite_mayonnaise.jpg",
            "paired_asset": "public/images/products/itc_french_fries.webp",
            "paired_name": "ITC French Fries 9mm",
            "paired_code": "RAIS-VEG-01",
            "motion": "cards_float"
        },
        "audio_hi": [
            "रात के 12 बजे और अचानक ज़ोरों की भूख?",
            "मिनटों में तैयार कीजिए क्रिस्पी ITC Master Chef Chicken Nuggets!",
            "साथ में क्रीमी Foodrite Mayonnaise और गोल्डन French Fries!",
            "रायचोटी और आंध्र प्रदेश में होलसेल डिलीवरी के लिए DM करें — RAIS Agencies!"
        ],
        "audio_te": [
            "రాత్రి 12 గంటలకు సడెన్ గా ఆకలి వేస్తోందా?",
            "నిమిషాల్లో రెడీ చేసుకోండి క్రిస్పీ ITC Chicken Nuggets!",
            "వీటితో పాటు క్రీమీ Foodrite Mayonnaise మరియు French Fries!",
            "రాయచోటి మరియు ఆంధ్రప్రదేశ్ హోల్‌సేల్ కోసం DM చేయండి — RAIS Agencies!"
        ],
        "sub_en": [
            "12 AM midnight and suddenly starving?",
            "Ready in minutes: crispy ITC Master Chef Chicken Nuggets!",
            "Paired with creamy Foodrite Mayonnaise & golden French Fries!",
            "For wholesale supply across Andhra Pradesh, DM RAIS Agencies, Rayachoty!"
        ]
    },
    3: {
        "title": "Cricket Match Snack Attack",
        "folder": "scenario_03_cricket_match",
        "character": "public/images/characters/ayesha_cricket.jpg",
        "char_motion": "blink_and_cheer",
        "sku1": {
            "code": "RAIS-CHK-03",
            "name": "Nutrich Chicken Popcorn",
            "brand": "Nutrich",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_popcorn.webp",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-VEG-07",
            "name": "ITC Cheesy Corn Triangles",
            "brand": "ITC Master Chef",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_cheesy_corn_triangles.webp",
            "paired_asset": "public/images/products/delmonte_tandoori_mayo.png",
            "paired_name": "Del Monte Tandoori Mayo",
            "paired_code": "RAIS-SAU-04",
            "motion": "cards_float"
        },
        "audio_hi": [
            "क्रिकेट मैच का रोमांच और दोस्तों के साथ पार्टी स्नैक्स!",
            "सर्व कीजिए क्रंची Chicken Popcorn और चीज़ी कॉर्न ट्राएंगल्स!",
            "साथ में ज़ायकेदार Del Monte तंदूरी मेयो — परफेक्ट मैच कॉम्बिनेशन!",
            "कैफे और रेस्टोरेंट होलसेल ऑर्डर्स के लिए DM करें — RAIS Agencies, रायचोटी!"
        ],
        "audio_te": [
            "క్రికెట్ మ్యాచ్ చూస్తూ ఫ్రెండ్స్ తో ఎంజాయ్ చేసే పార్టీ స్నాక్స్!",
            "సర్వ్ చేయండి క్రంచీ Chicken Popcorn & Cheesy Corn Triangles!",
            "వీటితో పాటు టేస్టీ Del Monte Tandoori Mayo — పర్ఫెక్ట్ కాంబినేషన్!",
            "కేఫ్ & రెస్టారెంట్ హోల్‌సేల్ ఆర్డర్స్ కోసం DM చేయండి — RAIS Agencies!"
        ],
        "sub_en": [
            "Exciting cricket match & ultimate party snacks with friends!",
            "Serve crunchy Chicken Popcorn & Cheesy Corn Triangles!",
            "Paired with zesty Del Monte Tandoori Mayo — match winner combination!",
            "For cafe & restaurant wholesale orders, DM RAIS Agencies, Rayachoty!"
        ]
    },
    4: {
        "title": "After-School Hunger",
        "folder": "scenario_04_after_school_hunger",
        "character": "public/images/characters/ayesha_after_school.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-VEG-11",
            "name": "McCain Smiles Potato Faces",
            "brand": "McCain",
            "pack": "1.5kg Pack",
            "asset": "public/images/products/mccain_smiles.png",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHK-08",
            "name": "Crispy Chicken Fingers",
            "brand": "Venky's",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_fingers.webp",
            "paired_asset": "public/images/products/delmonte_ketchup_sachet.png",
            "paired_name": "Del Monte Ketchup Sachets",
            "paired_code": "RAIS-SAU-07",
            "motion": "cards_float"
        },
        "audio_hi": [
            "स्कूल के बाद बच्चों की भूख? झटपट बनाइए स्माइली स्नैक्स!",
            "बच्चों के फेवरेट McCain Smiles और क्रिस्पी Chicken Fingers!",
            "साथ में आसान Del Monte टोमैटो केचप सैशे — सेफ और हाइजीनिक!",
            "होलसेल और कैफे सप्लाई के लिए Instagram पर DM करें — RAIS Agencies!"
        ],
        "audio_te": [
            "స్కూల్ నుంచి రాగానే పిల్లల ఆకలి? నిమిషాల్లో స్మైలీ స్నాక్స్!",
            "పిల్లల ఫేవరెట్ McCain Smiles & క్రిస్పీ Chicken Fingers!",
            "వీటితో పాటు Del Monte Tomato Ketchup Sachets — హైజీనిక్ సర్వింగ్!",
            "హోల్‌సేల్ & కేఫ్ సప్లై కోసం Instagram లో DM చేయండి — RAIS Agencies!"
        ],
        "sub_en": [
            "Kids hungry after school? Quick, delicious smiley snacks ready in minutes!",
            "Kids' favourite McCain Smiles & crispy Chicken Fingers!",
            "Served with convenient Del Monte single-serve ketchup sachets!",
            "For wholesale & cafe supply across AP, DM RAIS Agencies!"
        ]
    },
    5: {
        "title": "Friends Suddenly Arrive",
        "folder": "scenario_05_friends_arrive",
        "character": "public/images/characters/ayesha_after_school.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-VEG-03",
            "name": "ITC Master Chef Veg Momos",
            "brand": "ITC Master Chef",
            "pack": "500g Pack",
            "asset": "public/images/products/veg_momos.jpg",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHK-05",
            "name": "ITC Chicken Nuggets",
            "brand": "ITC Master Chef",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_nuggets.webp",
            "paired_asset": "public/images/products/kraft_pizza_box.jpg",
            "paired_name": "Kraft Pizza Box 8\"x8\"",
            "paired_code": "RAIS-BOX-01",
            "motion": "cards_float"
        },
        "audio_hi": [
            "अचानक दोस्त घर आ गए? नो टेंशन, स्नैक प्लैटर है तैयार!",
            "गरमा-गरम ITC Veg Momos और क्रिस्पी Chicken Nuggets!",
            "साथ में प्रीमियम Kraft टेकअवे बॉक्सेस — पार्टी मूड ऑन!",
            "अपने फूड बिजनेस के लिए बेस्ट होलसेल डील्स पाएं — DM RAIS Agencies!"
        ],
        "audio_te": [
            "సడెన్ గా ఫ్రెండ్స్ ఇంటికి వచ్చారా? నో టెన్షన్, స్నాక్ ప్లాటర్ రెడీ!",
            "వేడి వేడి ITC Veg Momos & క్రిస్పీ Chicken Nuggets!",
            "వీటితో పాటు ప్రీమియం Kraft టేక్‌అవే బాక్సెస్ — పార్టీ మూడ్ ఆన్!",
            "మీ ఫుడ్ బిజినెస్ కోసం బెస్ట్ హోల్‌సేల్ డీల్స్ — DM RAIS Agencies!"
        ],
        "sub_en": [
            "Friends arrive unexpectedly? Zero stress, instant snack platter ready!",
            "Piping hot ITC Veg Momos & crispy Chicken Nuggets!",
            "Paired with heavy-duty Kraft takeaway packaging boxes!",
            "Get top wholesale food deals for your business — DM RAIS Agencies!"
        ]
    },
    6: {
        "title": "Busy-Day Food Solution",
        "folder": "scenario_06_busy_day_convenience",
        "character": "public/images/character_test_scene_b_b2b.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-CHK-01",
            "name": "Signature Tortilla Wraps 8\"",
            "brand": "Signature",
            "pack": "1 Packet (10 Nos)",
            "asset": "public/images/products/tortilla_wraps.jpg",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHK-06",
            "name": "Nutrich Chicken Burger Patty",
            "brand": "Nutrich",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_patty.webp",
            "paired_asset": "public/images/products/delmonte_tandoori_mayo.png",
            "paired_name": "Del Monte Tandoori Mayo",
            "paired_code": "RAIS-SAU-04",
            "motion": "cards_float"
        },
        "audio_hi": [
            "बिजी दिन और क्विक मील की तलाश? रोल्स और रैप्स बनाएं झटपट!",
            "सॉफ्ट Signature Tortilla Wraps और जूसी चिकन पैटी!",
            "साथ में Del Monte तंदूरी मेयो — रेस्टोरेंट स्टाइल स्वाद!",
            "रेगुलर होलसेल सप्लाई के लिए अभी कांटेक्ट करें — RAIS Agencies, रायचोटी!"
        ],
        "audio_te": [
            "బిజీ డే లో క్విక్ మీల్ కావాలా? రోల్స్ మరియు ర్యాప్స్ నిమిషాల్లో!",
            "సాఫ్ట్ Signature Tortilla Wraps & జ్యూసీ చికెన్ ప్యాటీ!",
            "వీటితో పాటు Del Monte Tandoori Mayo — రెస్టారెంట్ స్టైల్ రుచి!",
            "రెగ్యులర్ హోల్‌సేల్ సప్లై కోసం కాంటాక్ట్ చేయండి — RAIS Agencies, రాయచోటి!"
        ],
        "sub_en": [
            "Busy schedule and craving a quick meal? Gourmet rolls in minutes!",
            "Soft Signature Tortilla Wraps & juicy seasoned Chicken Patties!",
            "Drizzled with Del Monte Tandoori Mayo — authentic cafe roll flavor!",
            "For reliable commercial wholesale supply, DM RAIS Agencies, Rayachoty!"
        ]
    },
    7: {
        "title": "Birthday Party Preparation",
        "folder": "scenario_07_birthday_party",
        "character": "public/images/characters/ayesha_cricket.jpg",
        "char_motion": "blink_and_cheer",
        "sku1": {
            "code": "RAIS-VEG-11",
            "name": "McCain Smiles Potato Faces",
            "brand": "McCain",
            "pack": "1.5kg Pack",
            "asset": "public/images/products/mccain_smiles.png",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHK-03",
            "name": "Nutrich Chicken Popcorn",
            "brand": "Nutrich",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_popcorn.webp",
            "paired_asset": "public/images/products/delmonte_pizza_pasta_sauce.png",
            "paired_name": "Del Monte Pizza Pasta Sauce",
            "paired_code": "RAIS-SAU-06",
            "motion": "cards_float"
        },
        "audio_hi": [
            "बर्थडे पार्टी का मेनू प्लान कर रहे हैं? बच्चों और बड़ों का फेवरेट स्नैक कॉम्बो!",
            "McCain Smiles और क्रंची Chicken Popcorn!",
            "साथ में रिच Del Monte पिज्जा पास्ता सॉस — पार्टी हिट!",
            "पार्टी कैटरिंग और होलसेल डिस्काउंट के लिए DM करें — RAIS Agencies!"
        ],
        "audio_te": [
            "బర్త్‌డే పార్టీ మెనూ ప్లాన్ చేస్తున్నారా? అందరికీ నచ్చే సూపర్ స్నాక్స్!",
            "McCain Smiles మరియు క్రంచీ Chicken Popcorn!",
            "వీటితో పాటు రిచ్ Del Monte Pizza Pasta Sauce — పార్టీ హిట్!",
            "పార్టీ క్యాటరింగ్ & హోల్‌సేల్ డిస్కౌంట్స్ కోసం DM చేయండి — RAIS Agencies!"
        ],
        "sub_en": [
            "Planning birthday party catering? Unbeatable crowd-pleaser snack combo!",
            "McCain Smiles & crunchy Chicken Popcorn bites!",
            "Served with rich Del Monte Pizza Pasta Sauce — certified party hit!",
            "For bulk party supply & wholesale pricing, DM RAIS Agencies, Rayachoty!"
        ]
    },
    8: {
        "title": "Restaurant Owner's Rush Hour",
        "folder": "scenario_08_restaurant_rush_hour",
        "character": "public/images/character_test_scene_b_b2b.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-VEG-01",
            "name": "ITC Master Chef French Fries",
            "brand": "ITC Master Chef",
            "pack": "2.5kg Pack",
            "asset": "public/images/products/itc_french_fries.webp",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-SAU-11",
            "name": "Foodrite Bulk Tomato Ketchup",
            "brand": "Foodrite",
            "pack": "5kg Can",
            "asset": "public/images/products/foodrite_tomato_ketchup.jpg",
            "paired_asset": "public/images/products/mozzarella_cheese.jpg",
            "paired_name": "Milky Mist Mozzarella Diced",
            "paired_code": "RAIS-CHS-01",
            "motion": "cards_float"
        },
        "audio_hi": [
            "रेस्टोरेंट का रश आवर? फास्ट प्रिपरेशन और कंसिस्टेंट क्वालिटी बेहद ज़रूरी!",
            "हाई यील्ड ITC Master Chef French Fries — क्रिस्पी हर बार!",
            "साथ में कमर्शियल 5kg Foodrite Ketchup और Milky Mist Mozzarella!",
            "बिना रुकावट रेस्टोरेंट सप्लाई के लिए पार्टनर बनाएं — RAIS Agencies, रायचोटी!"
        ],
        "audio_te": [
            "రెస్టారెంట్ రష్ అవర్? ఫాస్ట్ ప్రిపరేషన్ & క్వాలిటీ చాలా ముఖ్యం!",
            "హై యీల్డ్ ITC Master Chef French Fries — ఎప్పుడూ క్రిస్పీ!",
            "వీటితో పాటు కమర్షియల్ 5kg Foodrite Ketchup & Milky Mist Mozzarella!",
            "ఎల్లప్పుడూ రెస్టారెంట్ సప్లై కోసం పార్టనర్ చేసుకోండి — RAIS Agencies, రాయచోటి!"
        ],
        "sub_en": [
            "High-traffic restaurant rush hour? Speed and consistency are paramount!",
            "High-yield ITC Master Chef French Fries — perfectly golden every single fry!",
            "Backed by commercial 5kg Foodrite Ketchup & Milky Mist Mozzarella Cheese!",
            "For uninterrupted wholesale kitchen supply across AP, partner with RAIS Agencies!"
        ]
    },
    9: {
        "title": "Burger Shop Transformation",
        "folder": "scenario_09_burger_shop_transformation",
        "character": "public/images/characters/ayesha_burger.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-CHK-06",
            "name": "Nutrich Chicken Burger Patty",
            "brand": "Nutrich",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_patty.webp",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-VEG-12",
            "name": "ITC Crispy Veg Burger Patty",
            "brand": "ITC Master Chef",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_veg_burger_patty.webp",
            "paired_asset": "public/images/products/kraft_burger_box.jpg",
            "paired_name": "Kraft Burger Box 4\"x4\"",
            "paired_code": "RAIS-BOX-02",
            "motion": "cards_float"
        },
        "audio_hi": [
            "अपने बर्गर कैफे को बनाएं शहर का सबसे पॉपुलर स्पॉट!",
            "सर्व कीजिए प्रीमियम चिकन और वेज बर्गर पैटीज!",
            "और हैवी-ड्यूटी Kraft टेकअवे बर्गर बॉक्सेस — डिलीवरी में क्रश-फ्री!",
            "होलसेल कैफे सप्लाई सीधे रायचोटी से — DM RAIS Agencies!"
        ],
        "audio_te": [
            "మీ బర్గర్ కేఫ్‌ను సిటీలోనే బెస్ట్ పాపులర్ స్పాట్‌గా మార్చండి!",
            "సర్వ్ చేయండి ప్రీమియం చికెన్ & వెజ్ బర్గర్ ప్యాటీస్!",
            "మరియు హెవీ డ్యూటీ Kraft బర్గర్ బాక్సెస్ — డెలివరీలో సేఫ్!",
            "హోల్‌సేల్ కేఫ్ సప్లై నేరుగా రాయచోటి నుంచి — DM RAIS Agencies!"
        ],
        "sub_en": [
            "Transform your burger joint into the town's most loved hotspot!",
            "Serve juicy, perfectly calibrated Chicken & Crispy Veg Burger Patties!",
            "Packaged in heavy-duty Kraft fluted clamshells for crush-free deliveries!",
            "Direct B2B wholesale supply from Rayachoty — DM RAIS Agencies!"
        ]
    },
    10: {
        "title": "Summer Refreshment & Mojitos",
        "folder": "scenario_10_summer_refreshment",
        "character": "public/images/character_test_scene_b_b2b.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-MOJ-01",
            "name": "Blue Curacao Beverage Syrup",
            "brand": "Monin Style",
            "pack": "750ml Bottle",
            "asset": "public/images/products/mojito_blue_curacao.jpg",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-MOJ-02",
            "name": "Lime Mint Mojito Base",
            "brand": "Barista Grade",
            "pack": "750ml Bottle",
            "asset": "public/images/products/mojito_lime_mint.jpg",
            "paired_asset": "public/images/products/sweet_corn.jpg",
            "paired_name": "Sweet Corn Kernels 1kg",
            "paired_code": "RAIS-VEG-08",
            "motion": "cards_float"
        },
        "audio_hi": [
            "गर्मियों के मौसम में कैफे ड्रिंक्स का चिलिंग एक्सपीरियंस!",
            "वाइब्रेंट Blue Curacao और रिफ्रेशिंग Lime Mint मोजीतो सीरप!",
            "साथ में स्वीट कॉर्न स्नैक्स — समर मेनू का अल्टीमेट हिट!",
            "कैफे बेवरेज सीरप और होलसेल सप्लाई के लिए DM करें — RAIS Agencies!"
        ],
        "audio_te": [
            "ఎండల్లో మీ కేఫ్ డ్రింక్స్ కు సూపర్ చిల్లింగ్ ఎక్స్‌పీరియన్స్!",
            "వైబ్రెంట్ Blue Curacao & రిఫ్రెషింగ్ Lime Mint మోజీతో సిరప్స్!",
            "వీటితో పాటు స్వీట్ కార్న్ స్నాక్స్ — సమ్మర్ మెనూ సూపర్ హిట్!",
            "కేఫ్ సిరప్స్ & హోల్‌సేల్ సప్లై కోసం DM చేయండి — RAIS Agencies!"
        ],
        "sub_en": [
            "Beat the heat with refreshing, vibrant mocktails for your cafe menu!",
            "Vibrant Blue Curacao & invigorating Lime Mint Mojito syrups!",
            "Paired with sweet corn kernels for instant refreshing appetizers!",
            "Wholesale cafe syrups delivered across Andhra Pradesh — DM RAIS Agencies!"
        ]
    },
    11: {
        "title": "The Irresistible Crunch",
        "folder": "scenario_11_the_irresistible_crunch",
        "character": "public/images/character_test_scene_a_rain.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-BRD-02",
            "name": "VKL Crispy Cajun Breading Mix",
            "brand": "VKL",
            "pack": "1kg Pack",
            "asset": "public/images/products/spices_blend.jpg",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHK-08",
            "name": "Crispy Chicken Fingers",
            "brand": "Venky's",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_fingers.webp",
            "paired_asset": "public/images/products/delmonte_bbq_sauce.png",
            "paired_name": "Del Monte BBQ Sauce",
            "paired_code": "RAIS-SAU-10",
            "motion": "cards_float"
        },
        "audio_hi": [
            "वह अल्टीमेट क्रंच जो हर बाइट में बोले!",
            "VKL केजुन ब्रेडिंग मिक्स से बनाएं गोल्डन क्रिस्पी फ्राइड चिकन!",
            "साथ में स्मोकी Del Monte बारबेक्यू सॉस — लाजवाब कॉम्बिनेशन!",
            "फ्राइड चिकन और QSR सप्लाई के लिए अभी संपर्क करें — RAIS Agencies!"
        ],
        "audio_te": [
            "ప్రతి బైట్ లో వినిపించే అల్టిమేట్ క్రిస్పీ క్రంచ్!",
            "VKL Cajun Breading తో చేసుకోండి గోల్డెన్ క్రిస్పీ ఫ్రైడ్ చికెన్!",
            "వీటితో పాటు స్మోకీ Del Monte BBQ సాస్ — సూపర్ కాంబినేషన్!",
            "ఫ్రైడ్ చికెన్ & QSR సప్లై కోసం ఇప్పుడే కాంటాక్ట్ చేయండి — RAIS Agencies!"
        ],
        "sub_en": [
            "That irresistible golden ripple crunch in every single bite!",
            "VKL Cajun Breading Mix delivering restaurant-grade crispy coatings!",
            "Paired with rich, smoky Del Monte Barbecue Sauce dip!",
            "For fried chicken & QSR commercial supplies, DM RAIS Agencies, Rayachoty!"
        ]
    },
    12: {
        "title": "Restaurant Stock Running Low",
        "folder": "scenario_12_restaurant_stock_planning",
        "character": "public/images/character_test_scene_b_b2b.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-VEG-01",
            "name": "Hup Hup French Fries 9mm",
            "brand": "Hup Hup",
            "pack": "2.5kg Pack",
            "asset": "public/images/products/itc_french_fries.webp",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHK-05",
            "name": "ITC Master Chef Chicken Nuggets",
            "brand": "ITC Master Chef",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_nuggets.webp",
            "paired_asset": "public/images/products/foodrite_mayonnaise.jpg",
            "paired_name": "Foodrite Salad Mayonnaise",
            "paired_code": "RAIS-SAU-08",
            "motion": "cards_float"
        },
        "audio_hi": [
            "वीकेंड पर किचन स्टॉक खत्म? नो पैनिक, RAIS Agencies है ना!",
            "फ्रोजन फ्राइज, नगेट्स, बर्गर पैटीज और सॉसेज का पूरा स्टॉक!",
            "आंध्र प्रदेश में रिलायबल डिलीवरी — कभी न रुके आपका बिजनेस!",
            "रेगुलर रेस्टोरेंट सप्लाई के लिए आज ही आर्डर बुक करें — RAIS Agencies!"
        ],
        "audio_te": [
            "వీకెండ్ లో కిచెన్ స్టాక్ అయిపోతుందా? నో ప్యానిక్, RAIS Agencies ఉందిగా!",
            "ఫ్రోజెన్ ఫ్రైస్, నగ్గెట్స్, బర్గర్ ప్యాటీస్ & సాసెస్ ఫుల్ స్టాక్!",
            "ఆంధ్రప్రదేశ్ లో నమ్మకమైన డెలివరీ — మీ బిజినెస్ ఎప్పుడూ ఆగదు!",
            "రెస్టారెంట్ సప్లై కోసం ఇప్పుడే ఆర్డర్ బుక్ చేయండి — RAIS Agencies!"
        ],
        "sub_en": [
            "Weekend rush depleting your kitchen stock? Zero panic, RAIS Agencies is here!",
            "Complete wholesale inventory of fries, nuggets, patties, and bulk sauces!",
            "Reliable cold-chain supply across Rayachoty and Andhra Pradesh!",
            "Book your recurring wholesale restaurant supply today with RAIS Agencies!"
        ]
    },
    13: {
        "title": "Weekend Movie Night",
        "folder": "scenario_13_weekend_movie_night",
        "character": "public/images/characters/ayesha_midnight.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-VEG-16",
            "name": "Bakery Fresh Pizza Base 8\"",
            "brand": "Fresh Bake",
            "pack": "1 Packet (2 Nos)",
            "asset": "public/images/products/pizza_base.jpg",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHS-01",
            "name": "Milky Mist Mozzarella Diced",
            "brand": "Milky Mist",
            "pack": "2kg Pack",
            "asset": "public/images/products/mozzarella_cheese.jpg",
            "paired_asset": "public/images/products/kraft_pizza_box.jpg",
            "paired_name": "Kraft Pizza Box 8\"x8\"",
            "paired_code": "RAIS-BOX-01",
            "motion": "cards_float"
        },
        "audio_hi": [
            "वीकेंड मूवी नाइट और होममेड चीज़ी पिज्जा का मज़ा!",
            "फ्रेश पिज्जा बेस पर Milky Mist मोज़ेरेला चीज़ का परफेक्ट स्ट्रेच!",
            "साथ में Del Monte पिज्जा सॉस और Kraft पिज्जा डिलीवरी बॉक्सेस!",
            "पिज्जा आउटलेट्स और बेकरी होलसेल सप्लाई — DM RAIS Agencies!"
        ],
        "audio_te": [
            "వీకెండ్ మూవీ నైట్ & వేడి వేడి చీజీ పిజ్జా ఎంజాయ్ చేయండి!",
            "ఫ్రెష్ పిజ్జా బేస్ & Milky Mist Mozzarella Cheese సూపర్ స్ట్రెచ్!",
            "వీటితో పాటు Del Monte Pizza Sauce మరియు Kraft Pizza Boxes!",
            "పిజ్జా ఔట్‌లెట్స్ & బేకరీ హోల్‌సేల్ సప్లై కోసం — DM RAIS Agencies!"
        ],
        "sub_en": [
            "Weekend movie night and delicious piping-hot homemade cheesy pizza!",
            "Fresh pizza bases topped with gooey, stretchy Milky Mist Mozzarella Cheese!",
            "Accompanied by Del Monte pizza pasta sauce & Kraft fluted pizza boxes!",
            "For pizzeria & commercial cafe supplies across AP, DM RAIS Agencies!"
        ]
    },
    14: {
        "title": "Packaging That Matters Too",
        "folder": "scenario_14_packaging_matters",
        "character": "public/images/character_test_scene_b_b2b.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-BOX-01",
            "name": "Pizza Box 8\"x8\" Plain Kraft",
            "brand": "Packaging Solutions",
            "pack": "100 Nos",
            "asset": "public/images/products/kraft_pizza_box.jpg",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-BOX-02",
            "name": "Burger Box 4\"x4\" Plain Kraft",
            "brand": "Packaging Solutions",
            "pack": "100 Nos",
            "asset": "public/images/products/kraft_burger_box.jpg",
            "paired_asset": "public/images/products/chicken_bucket.jpg",
            "paired_name": "Fried Chicken Bucket 500ml",
            "paired_code": "RAIS-BOX-03",
            "motion": "cards_float"
        },
        "audio_hi": [
            "टेस्टी फूड को चाहिए सेफ और इको-फ्रेंडली पैकेजिंग!",
            "प्रीमियम Kraft कोरुगेटेड पिज्जा बॉक्सेस और बर्गर क्लैमशेल्स!",
            "खाना रहे गर्म और फ्रेश डिलीवरी तक — ग्राहकों को भाए आपका ब्रांड!",
            "होलसेल फूड पैकेजिंग सप्लाइज रायचोटी में — DM RAIS Agencies!"
        ],
        "audio_te": [
            "టేస్టీ ఫుడ్ కి కావాలి సేఫ్ & ఎకో-ఫ్రెండ్లీ ప్యాకేజింగ్!",
            "ప్రీమియం Kraft కొరుగేటెడ్ పిజ్జా బాక్సెస్ & బర్గర్ క్లామ్‌షెల్స్!",
            "ఫుడ్ ఎప్పుడూ వేడిగా, ఫ్రెష్‌గా డెలివరీ అవుతుంది — కస్టమర్ల నమ్మకం!",
            "హోల్‌సేల్ ఫుడ్ ప్యాకేజింగ్ సప్లైస్ రాయచోటిలో — DM RAIS Agencies!"
        ],
        "sub_en": [
            "Great food deserves eco-friendly, heat-retaining food packaging!",
            "Heavy-duty corrugated Kraft pizza boxes & clamshell burger boxes!",
            "Preserving temperature, crispness, and aroma until customer doorstep!",
            "Direct wholesale takeaway packaging in Rayachoty — DM RAIS Agencies!"
        ]
    },
    15: {
        "title": "Meet Your Frozen-Food Partner",
        "folder": "scenario_15_meet_your_food_partner",
        "character": "public/images/character_test_scene_b_b2b.jpg",
        "char_motion": "blink_and_breathe",
        "sku1": {
            "code": "RAIS-VEG-01",
            "name": "ITC Master Chef French Fries",
            "brand": "ITC Master Chef",
            "pack": "2.5kg Pack",
            "asset": "public/images/products/itc_french_fries.webp",
            "motion": "steam_wisps"
        },
        "sku2": {
            "code": "RAIS-CHK-05",
            "name": "ITC Master Chef Chicken Nuggets",
            "brand": "ITC Master Chef",
            "pack": "1kg Pack",
            "asset": "public/images/products/itc_chicken_nuggets.webp",
            "paired_asset": "public/images/products/kraft_burger_box.jpg",
            "paired_name": "Kraft Burger Box 4\"x4\"",
            "paired_code": "RAIS-BOX-02",
            "motion": "cards_float"
        },
        "audio_hi": [
            "नमस्ते! मिलिए RAIS Agencies से — आपका कम्प्लीट फूड पार्टनर!",
            "टॉप ब्रांड्स: ITC Master Chef, McCain, Del Monte और Milky Mist!",
            "फ्रोजन फूड्स से लेकर प्रीमियम Kraft पैकेजिंग तक — सब कुछ एक ही छत के नीचे!",
            "रायचोटी और पूरे आंध्र प्रदेश में होलसेल सप्लाई — आज ही Instagram पर DM करें!"
        ],
        "audio_te": [
            "నమస్తే! కలవండి RAIS Agencies — మీ కంప్లీట్ ఫుడ్ సప్లై పార్టనర్!",
            "టాప్ బ్రాండ్స్: ITC Master Chef, McCain, Del Monte & Milky Mist!",
            "ఫ్రోజెన్ ఫుడ్స్ నుండి ప్రీమియం Kraft ప్యాకేజింగ్ వరకు — అన్నీ ఒక్కచోటే!",
            "రాయచోటి మరియు ఆంధ్రప్రదేశ్ హోల్‌సేల్ కోసం — Instagram లో DM చేయండి!"
        ],
        "sub_en": [
            "Welcome! Meet RAIS Agencies — your dedicated frozen food & packaging partner!",
            "Authorized supplies: ITC Master Chef, McCain, Del Monte, and Milky Mist!",
            "From premium frozen snacks to food-grade takeaway packaging under one roof!",
            "Wholesale distribution across Rayachoty and Andhra Pradesh — DM RAIS Agencies!"
        ]
    }
}

with open("scripts/product_manifest.json", "w", encoding="utf-8") as f:
    json.dump(MANIFEST, f, indent=2, ensure_ascii=False)

print("Saved product_manifest.json with all 15 scenarios.")
