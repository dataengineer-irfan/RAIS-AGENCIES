import os
import subprocess
import shutil
from render_scenario_1_revised import (
    FFMPEG_EXE, generate_audio_bed, compile_scene_clips,
    assemble_full_reel, verify_technical_specs
)

def create_padded_voice_track(shot_audios, shot_durations, output_path, total_duration):
    """
    Pad each shot audio with silence so it aligns precisely with its visual shot duration.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    filter_parts = []
    for i, (audio_file, shot_dur) in enumerate(zip(shot_audios, shot_durations)):
        # Pad each audio to its exact shot duration
        filter_parts.append(f"[{i}:a]apad=whole_dur={shot_dur:.2f}[a{i}]")
    
    concat_inputs = "".join(f"[a{i}]" for i in range(len(shot_audios)))
    filter_complex = f"{';'.join(filter_parts)};{concat_inputs}concat=n={len(shot_audios)}:v=0:a=1[outa]"
    
    cmd = [FFMPEG_EXE, "-y"]
    for a in shot_audios:
        cmd.extend(["-i", a])
    cmd.extend([
        "-filter_complex", filter_complex,
        "-map", "[outa]",
        "-c:a", "libmp3lame", "-b:a", "192k",
        "-t", f"{total_duration:.2f}",
        output_path
    ])
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"Aligned voice track generated: {output_path}")

def build_hindi_master():
    print("\n>>> BUILDING REVISED HINDI MASTER REEL (21.36s)...")
    work_dir = "public/videos/build_cache_hi"
    os.makedirs(work_dir, exist_ok=True)
    
    scenes_hi = [
        {
            "id": 1,
            "name": "ayesha_rain_craving",
            "duration": 4.80,
            "frames": 144,
            "image": "public/images/character_test_scene_a_rain.jpg",
            "badge": "AYESHA • RAIS 3D VIRTUAL PRESENTER",
            "primary_text": "बारिश का मौसम और कुछ गरमा-गरम क्रिस्पी खाने का मन?",
            "secondary_text": "Pleasant rainy weather & craving something crispy?"
        },
        {
            "id": 2,
            "name": "itc_momos_reveal",
            "duration": 4.60,
            "frames": 138,
            "image": "public/images/products/chicken_momos.jpg",
            "badge": "GENUINE CATALOGUE ITEM • ITC MASTER CHEF",
            "primary_text": "ट्राई कीजिए ITC Master Chef Chicken Momos!",
            "secondary_text": "Try delicious ITC Master Chef Chicken Momos!"
        },
        {
            "id": 3,
            "name": "french_fries_and_packaging",
            "duration": 5.20,
            "frames": 156,
            "image": "public/images/products/french_fries_basket.jpg",
            "badge": "AUTHENTIC FOOD & PACKAGING SUPPLIES",
            "primary_text": "गोल्डन क्रिस्पी French Fries और Kraft पैकेजिंग बॉक्सेस!",
            "secondary_text": "Golden crispy French Fries & Kraft packaging boxes!"
        },
        {
            "id": 4,
            "name": "simplified_brand_cta",
            "duration": 6.76,
            "frames": 203,
            "image": "public/images/scene_05_brand_cta.png",
            "badge": None
        }
    ]
    
    shot_durations = [sc["duration"] for sc in scenes_hi]
    total_dur = sum(shot_durations) # exactly 21.36s
    
    # 1. Align voice
    voice_path = os.path.join(work_dir, "voice_hi_aligned.mp3")
    create_padded_voice_track(
        [
            "public/audio/shot1_hi_tight.mp3",
            "public/audio/shot2_hi_tight.mp3",
            "public/audio/shot3_hi_tight.mp3",
            "public/audio/shot4_hi_tight.mp3"
        ],
        shot_durations,
        voice_path,
        total_dur
    )
    
    # 2. Generate BGM bed
    bgm_path = os.path.join(work_dir, "bgm_bed_2136.mp3")
    generate_audio_bed(total_dur, bgm_path)
    
    # 3. Compile clips
    clips = compile_scene_clips(scenes_hi, work_dir)
    
    # 4. Assemble Reel
    out_video = "public/videos/campaign_ayesha_monsoon_hi.mp4"
    assemble_full_reel(clips, voice_path, bgm_path, out_video, work_dir)
    verify_technical_specs(out_video)
    
    # Clean cache
    shutil.rmtree(work_dir, ignore_errors=True)
    return out_video

def build_telugu_master():
    print("\n>>> BUILDING MATCHING REVISED TELUGU MASTER REEL (21.36s)...")
    work_dir = "public/videos/build_cache_te"
    os.makedirs(work_dir, exist_ok=True)
    
    scenes_te = [
        {
            "id": 1,
            "name": "ayesha_rain_craving",
            "duration": 4.80,
            "frames": 144,
            "image": "public/images/character_test_scene_a_rain.jpg",
            "badge": "AYESHA • RAIS 3D VIRTUAL PRESENTER",
            "primary_text": "బయట చల్లని వర్షం... వేడి వేడిగా, క్రిస్పీగా తినాలనిపిస్తుందా?",
            "secondary_text": "Cool rain outside... craving something piping hot & crispy?"
        },
        {
            "id": 2,
            "name": "itc_momos_reveal",
            "duration": 4.60,
            "frames": 138,
            "image": "public/images/products/chicken_momos.jpg",
            "badge": "GENUINE CATALOGUE ITEM • ITC MASTER CHEF",
            "primary_text": "ట్రై చేయండి రుచికరమైన ITC Master Chef Chicken Momos!",
            "secondary_text": "Try delicious ITC Master Chef Chicken Momos!"
        },
        {
            "id": 3,
            "name": "french_fries_and_packaging",
            "duration": 5.20,
            "frames": 156,
            "image": "public/images/products/french_fries_basket.jpg",
            "badge": "AUTHENTIC FOOD & PACKAGING SUPPLIES",
            "primary_text": "గోల్డెన్ క్రిస్పీ French Fries మరియు Kraft ప్యాకేజింగ్ బాక్సెస్!",
            "secondary_text": "Golden crispy French Fries & Kraft packaging boxes!"
        },
        {
            "id": 4,
            "name": "simplified_brand_cta",
            "duration": 6.76,
            "frames": 203,
            "image": "public/images/scene_05_brand_cta.png",
            "badge": None
        }
    ]
    
    shot_durations = [sc["duration"] for sc in scenes_te]
    total_dur = sum(shot_durations) # exactly 21.36s
    
    # 1. Align voice
    voice_path = os.path.join(work_dir, "voice_te_aligned.mp3")
    create_padded_voice_track(
        [
            "public/audio/shot1_te_tight.mp3",
            "public/audio/shot2_te_tight.mp3",
            "public/audio/shot3_te_tight.mp3",
            "public/audio/shot4_te_tight.mp3"
        ],
        shot_durations,
        voice_path,
        total_dur
    )
    
    # 2. Generate BGM bed
    bgm_path = os.path.join(work_dir, "bgm_bed_2136.mp3")
    generate_audio_bed(total_dur, bgm_path)
    
    # 3. Compile clips
    clips = compile_scene_clips(scenes_te, work_dir)
    
    # 4. Assemble Reel
    out_video = "public/videos/campaign_01_monsoon_crispy.mp4"
    assemble_full_reel(clips, voice_path, bgm_path, out_video, work_dir)
    verify_technical_specs(out_video)
    
    # Clean cache
    shutil.rmtree(work_dir, ignore_errors=True)
    return out_video

if __name__ == "__main__":
    build_hindi_master()
    build_telugu_master()
    print("\n[ALL REVISED REELS COMPILED AND VERIFIED]")
