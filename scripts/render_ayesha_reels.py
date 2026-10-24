import os
import subprocess
from campaign_pipeline import generate_audio_bed, compile_campaign_reel, verify_video

CONFIG = {
    "work_dir": "public/videos/ayesha_build_cache",
    "output_video": "public/videos/campaign_ayesha_monsoon_hi.mp4",
    "narration_audio": "public/audio/campaign_ref_ayesha_hi.mp3",
    "bgm_audio": "public/audio/campaign_ref_ayesha_bgm.mp3",
    "scenes": [
        {
            "id": 1,
            "name": "ayesha_rain_craving",
            "duration": 4.0,
            "frames": 120,
            "image": "public/images/character_test_scene_a_rain.jpg",
            "badge": "AYESHA • RAIS 3D VIRTUAL PRESENTER",
            "primary_text": "बारिश का मौसम और कुछ गरमा-गरम क्रिस्पी खाने का मन?",
            "secondary_text": "Rain outside? Craving something piping hot & crispy?"
        },
        {
            "id": 2,
            "name": "itc_momos_reveal",
            "duration": 4.5,
            "frames": 135,
            "image": "public/images/products/chicken_momos.jpg",
            "badge": "ITC MASTER CHEF & TOP BRANDS",
            "primary_text": "आईटीसी मास्टर शेफ चिकन मोमोज और क्रिस्पी फ्रेंच फ्राइज!",
            "secondary_text": "ITC Master Chef Chicken Momos & Crispy French Fries!"
        },
        {
            "id": 3,
            "name": "ayesha_wholesale_counter",
            "duration": 4.5,
            "frames": 135,
            "image": "public/images/character_test_scene_b_b2b.jpg",
            "badge": "HOTELS • RESTAURANTS • FAST FOOD",
            "primary_text": "रायचोती के होटल्स और रेस्टोरेंट्स के लिए डायरेक्ट होलसेल सप्लाई!",
            "secondary_text": "Direct Wholesale Supply for Rayachoty B2B Businesses!"
        },
        {
            "id": 4,
            "name": "french_fries_basket",
            "duration": 4.0,
            "frames": 120,
            "image": "public/images/products/french_fries_basket.jpg",
            "badge": "COLD CHAIN LOGISTICS • -18°C GUARANTEED",
            "primary_text": "बेस्ट होलसेल रेट्स के लिए अभी इंस्टाग्राम पर डीएम करें!",
            "secondary_text": "DM @raisfrozenfoods now for verified wholesale supply!"
        },
        {
            "id": 5,
            "name": "brand_end_card",
            "duration": 4.36,
            "frames": 131,
            "image": "public/images/scene_05_brand_cta.png",
            "badge": None
        }
    ]
}

def main():
    print("Generating dual-track audio bed for Ayesha campaign (21.36s)...")
    generate_audio_bed(21.36, CONFIG["bgm_audio"])
    
    print("Compiling Master Reel...")
    out_video = compile_campaign_reel(CONFIG)
    
    print("Running Technical Verification...")
    verify_video(out_video)
    
    # Clean cache
    import shutil
    shutil.rmtree(CONFIG["work_dir"], ignore_errors=True)
    print("\n[SUCCESS] Master Ayesha Campaign Video Ready!")

if __name__ == "__main__":
    main()
