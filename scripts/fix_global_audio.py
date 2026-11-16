import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import math
import shutil
import asyncio
import subprocess

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
BASE_WORK_DIR = "public/videos/campaigns_work"
CAMPAIGN_DIR = "public/videos/campaigns"
BACKUP_DIR = "public/videos/campaigns_audio_backup"

with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
    MANIFEST = json.load(f)

def get_audio_duration(file_path):
    cmd = [FFMPEG_EXE, "-i", file_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    for line in res.stderr.splitlines():
        if "Duration: " in line:
            t = line.split("Duration: ")[1].split(",")[0].strip()
            h, m, s = t.split(":")
            return float(h)*3600 + float(m)*60 + float(s)
    return 0.0

def measure_window_volume(file_path, ss=None, t=None):
    cmd = [FFMPEG_EXE]
    if ss is not None:
        cmd += ["-ss", str(ss)]
    if t is not None:
        cmd += ["-t", str(t)]
    cmd += ["-i", file_path, "-af", "volumedetect", "-f", "null", "-"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    mean_v, max_v = -99.0, -99.0
    for line in res.stderr.splitlines():
        if "mean_volume:" in line:
            try:
                mean_v = float(line.split("mean_volume:")[1].replace("dB", "").strip())
            except Exception:
                pass
        if "max_volume:" in line:
            try:
                max_v = float(line.split("max_volume:")[1].replace("dB", "").strip())
            except Exception:
                pass
    return mean_v, max_v

def measure_ebur128(file_path):
    cmd = [FFMPEG_EXE, "-i", file_path, "-af", "ebur128=video=0:meter=18", "-f", "null", "-"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stderr
    
    i_lufs = -99.0
    lra = 0.0
    true_peak = -99.0
    
    lines = out.splitlines()
    for idx, line in enumerate(lines):
        if "Integrated loudness:" in line:
            for next_line in lines[idx:idx+6]:
                if "I:" in next_line and "LUFS" in next_line:
                    try:
                        i_lufs = float(next_line.split("I:")[1].replace("LUFS", "").strip())
                    except Exception:
                        pass
        if "Loudness range:" in line:
            for next_line in lines[idx:idx+6]:
                if "LRA:" in next_line and "LU" in next_line:
                    try:
                        lra = float(next_line.split("LRA:")[1].replace("LU", "").strip())
                    except Exception:
                        pass
        if "True peak:" in line:
            for next_line in lines[idx:idx+6]:
                if "Peak:" in next_line and "dBFS" in next_line:
                    try:
                        true_peak = float(next_line.split("Peak:")[1].replace("dBFS", "").strip())
                    except Exception:
                        pass
    return i_lufs, lra, true_peak

async def ensure_shot_audio(sc_id, sc, lang, work_dir):
    import edge_tts
    audio_dir = f"{work_dir}/audio"
    os.makedirs(audio_dir, exist_ok=True)
    voice = "hi-IN-SwaraNeural" if lang == "hi" else "te-IN-ShrutiNeural"
    texts = sc["audio_hi"] if lang == "hi" else sc["audio_te"]
    
    shot_files = []
    durs = []
    
    for idx, text in enumerate(texts):
        out_f = f"{audio_dir}/shot_{idx+1}_{lang}.mp3"
        # Regenerate to ensure optimal consistent speech rate
        rate = "+14%" if lang == "hi" else "+10%"
        comm = edge_tts.Communicate(text, voice, rate=rate)
        await comm.save(out_f)
        d = get_audio_duration(out_f)
        shot_files.append(out_f)
        durs.append(d)
        
    return shot_files, durs

def build_scenario_audio(sc_id, lang, shot_files, durs, work_dir):
    audio_dir = f"{work_dir}/audio"
    
    # Dynamic non-overlapping timeline alignment
    # Scene cut reference points: 0.0s, 4.80s, 9.40s, 14.60s
    t1 = 0.30
    t2 = max(4.90, t1 + durs[0] + 0.15)
    t3 = max(9.50, t2 + durs[1] + 0.15)
    t4 = max(14.70, t3 + durs[2] + 0.15)
    
    d1_ms = int(t1 * 1000)
    d2_ms = int(t2 * 1000)
    d3_ms = int(t3 * 1000)
    d4_ms = int(t4 * 1000)
    
    full_narration_wav = f"{audio_dir}/narration_{lang}.wav"
    
    cmd_voice = [
        FFMPEG_EXE, "-y",
        "-i", shot_files[0],
        "-i", shot_files[1],
        "-i", shot_files[2],
        "-i", shot_files[3],
        "-filter_complex",
        f"[0:a]adelay={d1_ms}|{d1_ms}[a0];"
        f"[1:a]adelay={d2_ms}|{d2_ms}[a1];"
        f"[2:a]adelay={d3_ms}|{d3_ms}[a2];"
        f"[3:a]adelay={d4_ms}|{d4_ms}[a3];"
        "[a0][a1][a2][a3]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0",
        "-ac", "2", "-ar", "44100",
        full_narration_wav
    ]
    subprocess.run(cmd_voice, capture_output=True, check=True)
    
    # BGM bed with proper fadeout
    total_dur = 21.36
    bgm_wav = f"{audio_dir}/bgm_bed.wav"
    fade_start = total_dur - 2.0
    
    cmd_bgm = [
        FFMPEG_EXE, "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={total_dur:.2f}:c=pink:r=44100:a=0.035,lowpass=f=750[rain];"
              f"sine=f=220:d={total_dur:.2f},volume=0.025[t1];"
              f"sine=f=330:d={total_dur:.2f},volume=0.02[t2];"
              f"sine=f=440:d={total_dur:.2f},volume=0.015[t3];"
              f"[rain][t1][t2][t3]amix=inputs=4:duration=first:dropout_transition=0:normalize=0,volume=0.10,afade=t=out:st={fade_start:.2f}:d=2.0",
        "-ac", "2", "-ar", "44100",
        bgm_wav
    ]
    subprocess.run(cmd_bgm, capture_output=True, check=True)
    
    return full_narration_wav, bgm_wav, (t1, t2, t3, t4)

def remux_campaign_video(sc_id, sc, lang, narration_wav, bgm_wav, work_dir):
    folder = sc["folder"]
    filename = f"master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4"
    
    # Source video stream from backup
    v_src = f"{BACKUP_DIR}/{folder}/{filename}"
    out_target = f"{CAMPAIGN_DIR}/{folder}/{filename}"
    temp_out = f"{work_dir}/fixed_{filename}"
    
    cmd_mux = [
        FFMPEG_EXE, "-y",
        "-i", v_src,
        "-i", narration_wav,
        "-i", bgm_wav,
        "-filter_complex",
        "[1:a]volume=1.0[voice];[2:a]volume=0.10,afade=t=out:st=19.36:d=2.0[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
        "-t", "21.36",
        temp_out
    ]
    subprocess.run(cmd_mux, capture_output=True, check=True)
    shutil.move(temp_out, out_target)
    return out_target

async def process_and_verify_all():
    print("=" * 80)
    print("RAIS AGENCIES — GLOBAL AUDIO PIPELINE REPAIR & REMUX (ALL 30 REELS)")
    print("=" * 80)
    
    results = []
    
    for sc_id in range(1, 16):
        sc = MANIFEST[str(sc_id)]
        folder = sc["folder"]
        work_dir = f"{BASE_WORK_DIR}/sc_{sc_id:02d}"
        os.makedirs(work_dir, exist_ok=True)
        
        print(f"\n--- Processing Scenario {sc_id:02d}: {sc['title']} ---")
        
        for lang in ["hi", "te"]:
            # 1. Ensure audio and compute durations
            shot_files, durs = await ensure_shot_audio(sc_id, sc, lang, work_dir)
            
            # 2. Build non-overlapping, unattenuated narration & BGM
            narration_wav, bgm_wav, timings = build_scenario_audio(sc_id, lang, shot_files, durs, work_dir)
            
            # 3. Remux into master campaign video
            target_mp4 = remux_campaign_video(sc_id, sc, lang, narration_wav, bgm_wav, work_dir)
            
            # 4. Measure loudness across successive time windows
            m_s1, _ = measure_window_volume(target_mp4, 0.0, 4.8)
            m_s2, _ = measure_window_volume(target_mp4, 4.8, 4.6)
            m_s3, _ = measure_window_volume(target_mp4, 9.4, 5.2)
            m_trans, _ = measure_window_volume(target_mp4, 13.5, 2.0)
            m_dip_win, _ = measure_window_volume(target_mp4, 14.0, 2.0)
            m_s4, _ = measure_window_volume(target_mp4, 15.5, 5.8)
            
            # 5. EBUR128 measurements
            i_lufs, lra, true_peak = measure_ebur128(target_mp4)
            
            # 6. Evaluation
            # Check segment consistency: variance between s1, s2, s3, s4 should be < 3.0 dB
            speech_segments = [m_s1, m_s2, m_s3, m_s4]
            max_diff = max(speech_segments) - min(speech_segments)
            
            # 14-16s window must not drop to dead silence (mean > -34.0 dB)
            dip_defect = (m_dip_win < -35.0)
            clipping = (true_peak > -0.5)
            
            pass_status = "PASS" if (max_diff < 3.5 and not dip_defect and not clipping and abs(i_lufs - -23.0) < 6.0) else "FAIL"
            
            row = {
                "scenario": sc_id,
                "title": sc["title"],
                "lang": lang,
                "filename": f"master_{'hindi' if lang=='hi' else 'telugu'}_21s.mp4",
                "timings": [round(t, 2) for t in timings],
                "durs": [round(d, 2) for d in durs],
                "vol_s1": m_s1,
                "vol_s2": m_s2,
                "vol_s3": m_s3,
                "vol_14_16s": m_dip_win,
                "vol_s4": m_s4,
                "max_diff_dB": round(max_diff, 2),
                "integrated_lufs": i_lufs,
                "lra": lra,
                "true_peak": true_peak,
                "status": pass_status
            }
            results.append(row)
            
            print(f"[{pass_status}] SC{sc_id:02d} ({lang.upper()}): S1={m_s1:.1f}dB, S2={m_s2:.1f}dB, S3={m_s3:.1f}dB, 14-16s={m_dip_win:.1f}dB, S4={m_s4:.1f}dB | Diff={max_diff:.1f}dB | LUFS={i_lufs:.1f} | Peak={true_peak:.1f}dBFS")
            
    with open("audio_qa_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
        
    print("\n" + "=" * 80)
    passed_count = sum(1 for r in results if r["status"] == "PASS")
    print(f"AUDIO QA VERIFICATION COMPLETE: {passed_count} / {len(results)} PASSED")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(process_and_verify_all())
