import subprocess
import os

FFMPEG_EXE = r"C:\Users\affra\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
OUTPUT_BED = "public/audio/campaign_01_bgm.mp3"

def generate_bgm():
    os.makedirs(os.path.dirname(OUTPUT_BED), exist_ok=True)
    # Generate a soft, warm ambient pad with gentle filtered rain sound (25.30 seconds)
    # Using synth frequencies with soft modulation, lowpass filter and low volume
    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "lavfi",
        "-i", "anoisesrc=d=25.30:c=pink:r=44100:a=0.04,lowpass=f=800[rain];"
              "sine=f=220:d=25.30,volume=0.03[tone1];"
              "sine=f=330:d=25.30,volume=0.02[tone2];"
              "sine=f=440:d=25.30,volume=0.015[tone3];"
              "[rain][tone1][tone2][tone3]amix=inputs=4:duration=first:dropout_transition=2,volume=0.18",
        "-ac", "2",
        "-b:a", "128k",
        OUTPUT_BED
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"Generated BGM bed: {OUTPUT_BED}")
    else:
        print("BGM generation error:", res.stderr)

if __name__ == "__main__":
    generate_bgm()
