import json

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Optimize Line 1 in Hindi and Telugu to fit crisply in the 0.2s - 3.6s window:
manifest["3"]["audio_hi"][0] = "क्रिकेट मैच का रोमांच और दोस्तों का स्नैक टाइम!"
manifest["4"]["audio_hi"][0] = "स्कूल के बाद बच्चों के लिए टेस्टी स्नैक्स!"
manifest["5"]["audio_hi"][0] = "घर पर अचानक मेहमान आएं तो नो टेंशन!"
manifest["6"]["audio_hi"][0] = "फास्ट फूड कैफे के लिए बेस्ट सर्विस!"
manifest["7"]["audio_hi"][0] = "बर्थडे पार्टी और सेलिब्रेशन को बनाइए खास!"
manifest["8"]["audio_hi"][0] = "शाम के वक्त गरमा-गरम क्रिस्पी स्नैक्स!"
manifest["9"]["audio_hi"][0] = "ऑफिस टी-ब्रेक में कलीग्स के लिए स्वादिष्ट स्नैक्स!"
manifest["10"]["audio_hi"][0] = "बालकनी में बारिश और गरमा-गरम चाय!"
manifest["10"]["audio_te"][0] = "బాల్కనీలో చల్లని వర్షం మరియు వేడి టీ!"
manifest["11"]["audio_hi"][0] = "वीकेंड मूवी नाइट परिवार और दोस्तों के साथ!"
manifest["12"]["audio_hi"][0] = "हाईवे रोड ट्रिप में मजेदार रिफ्रेशिंग ब्रेक!"
manifest["14"]["audio_hi"][0] = "लेट-नाइट डिलीवरी में गरमा-गरम चीज़ी पिज्जा!"
manifest["15"]["audio_hi"][0] = "रेस्टोरेंट कैफे का भरोसेमंद फूड पार्टनर!"

with open("scripts/product_manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("Updated product_manifest.json with punchy, tight-synced lines!")
