import os
import sys
import asyncio
import subprocess
import shutil
from campaign_scenarios_data import SCENARIOS
from render_scenario_1_revised import (
    FFMPEG_EXE, generate_audio_bed, compile_scene_clips,
    assemble_full_reel, verify_technical_specs
)

async def synthesize_shot_audio(text: str, voice: str, output_path: str, rate: str = "+10%"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    import edge_tts
    comm = edge_tts.Communicate(text, voice, rate=rate)
    await comm.save(output_path)

def create_padded_voice_track(shot_audios, shot_durations, output_path, total_duration):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    filter_parts = []
    for i, (audio_file, shot_dur) in enumerate(zip(shot_audios, shot_durations)):
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

async def build_scenario(sc_id: int):
    sc_data = SCENARIOS[sc_id]
    print(f"\n=======================================================")
    print(f" PROCESSING SCENARIO {sc_id}: {sc_data['title']}")
    print(f" Folder: {sc_data['folder']}")
    print(f"=======================================================")
    
    camp_dir = os.path.join("public/videos/campaigns", sc_data["folder"])
    os.makedirs(camp_dir, exist_ok=True)
    
    shot_durations = [s["duration"] for s in sc_data["shots"]]
    total_dur = sum(shot_durations) # 21.36s
    
    # ----------------------------------------------------
    # 1. HINDI MASTER
    # ----------------------------------------------------
    print(f"--- Synthesizing Hindi Voiceover for Scenario {sc_id} ---")
    work_dir_hi = os.path.join("public/videos/cache", f"sc_{sc_id}_hi")
    os.makedirs(work_dir_hi, exist_ok=True)
    
    shot_audios_hi = []
    scenes_hi = []
    for s in sc_data["shots"]:
        shot_aud_path = os.path.join(work_dir_hi, f"shot_{s['id']}_hi.mp3")
        await synthesize_shot_audio(s["text_hi"], "hi-IN-SwaraNeural", shot_aud_path)
        shot_audios_hi.append(shot_aud_path)
        
        scenes_hi.append({
            "id": s["id"],
            "name": s["name"],
            "duration": s["duration"],
            "frames": s["frames"],
            "image": s["image"],
            "badge": s["badge"],
            "primary_text": s["text_hi"],
            "secondary_text": s["sub_en"]
        })
        
    voice_track_hi = os.path.join(work_dir_hi, "voice_hi_aligned.mp3")
    create_padded_voice_track(shot_audios_hi, shot_durations, voice_track_hi, total_dur)
    
    bgm_path = os.path.join(work_dir_hi, "bgm_bed.mp3")
    generate_audio_bed(total_dur, bgm_path)
    
    clips_hi = compile_scene_clips(scenes_hi, work_dir_hi)
    out_video_hi = os.path.join(camp_dir, "master_hindi_21s.mp4")
    assemble_full_reel(clips_hi, voice_track_hi, bgm_path, out_video_hi, work_dir_hi)
    verify_technical_specs(out_video_hi)
    shutil.rmtree(work_dir_hi, ignore_errors=True)
    
    # ----------------------------------------------------
    # 2. TELUGU MASTER
    # ----------------------------------------------------
    print(f"--- Synthesizing Telugu Voiceover for Scenario {sc_id} ---")
    work_dir_te = os.path.join("public/videos/cache", f"sc_{sc_id}_te")
    os.makedirs(work_dir_te, exist_ok=True)
    
    shot_audios_te = []
    scenes_te = []
    for s in sc_data["shots"]:
        shot_aud_path = os.path.join(work_dir_te, f"shot_{s['id']}_te.mp3")
        await synthesize_shot_audio(s["text_te"], "te-IN-ShrutiNeural", shot_aud_path)
        shot_audios_te.append(shot_aud_path)
        
        scenes_te.append({
            "id": s["id"],
            "name": s["name"],
            "duration": s["duration"],
            "frames": s["frames"],
            "image": s["image"],
            "badge": s["badge"],
            "primary_text": s["text_te"],
            "secondary_text": s["sub_en"]
        })
        
    voice_track_te = os.path.join(work_dir_te, "voice_te_aligned.mp3")
    create_padded_voice_track(shot_audios_te, shot_durations, voice_track_te, total_dur)
    
    bgm_path_te = os.path.join(work_dir_te, "bgm_bed.mp3")
    generate_audio_bed(total_dur, bgm_path_te)
    
    clips_te = compile_scene_clips(scenes_te, work_dir_te)
    out_video_te = os.path.join(camp_dir, "master_telugu_21s.mp4")
    assemble_full_reel(clips_te, voice_track_te, bgm_path_te, out_video_te, work_dir_te)
    verify_technical_specs(out_video_te)
    shutil.rmtree(work_dir_te, ignore_errors=True)
    
    print(f"\n[SCENARIO {sc_id} COMPLETE]: {camp_dir}")

async def main():
    target_ids = [int(arg) for arg in sys.argv[1:] if arg.isdigit()]
    if not target_ids:
        # Default to first batch (Scenarios 2, 3, 4, 5)
        target_ids = [2, 3, 4, 5]
        
    print(f"Building Campaign Scenarios: {target_ids}")
    for sc_id in target_ids:
        if sc_id in SCENARIOS:
            await build_scenario(sc_id)
            
    print("\n[ALL REQUESTED SCENARIOS COMPILED SUCCESSFULLY]")

if __name__ == "__main__":
    asyncio.run(main())
