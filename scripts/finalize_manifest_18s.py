import json

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Ensure all Line 1s are crisp (< 2.6s):
manifest["7"]["audio_hi"][0] = "बर्थडे सेलिब्रेशन को बनाइए खास!"
manifest["9"]["audio_hi"][0] = "अपने कैफे को दें प्रीमियम मेनू!"
manifest["12"]["audio_hi"][0] = "रोड ट्रिप में मजेदार रिफ्रेशिंग ब्रेक!"
manifest["14"]["audio_hi"][0] = "लेट-नाइट डिलीवरी में चीज़ी पिज्जा!"
manifest["15"]["audio_hi"][0] = "रेस्टोरेंट कैफे का फूड पार्टनर!"

# Ensure all Line 4s are fast and punchy:
for sc_id in range(1, 16):
    s = str(sc_id)
    manifest[s]["audio_hi"][3] = "WhatsApp 9347453135 — RAIS Agencies!"
    manifest[s]["audio_te"][3] = "WhatsApp 9347453135 — RAIS Agencies!"

with open("scripts/product_manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("Updated product_manifest.json with ultra-crisp lines for 18-second delivery!")
