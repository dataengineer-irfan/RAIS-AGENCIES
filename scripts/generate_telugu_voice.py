import asyncio
import edge_tts
import os
import subprocess

SCRIPT_TELUGU = """వర్షం పడుతుందా? మరి వేడి వేడిగా, క్రిస్పీగా ఏదైనా తినాలనిపిస్తుందా?
చికెన్ స్నాక్స్, ఫ్రెంచ్ ఫ్రైస్, ఇంకా మీ ఫేవరెట్ ఫ్రోజెన్ ఫుడ్ ప్రొడక్ట్స్!
రాయచోటి హోటల్స్, రెస్టారెంట్స్ మరియు ఫాస్ట్ ఫుడ్ సెంటర్స్ కోసం... డైరెక్ట్ హోల్‌సేల్ సప్లై!
మీ బిజినెస్‌కి కావలసిన క్వాలిటీ ప్రొడక్ట్స్ కోసం ఇప్పుడే ఇన్స్టాగ్రామ్ లో మెసేజ్ చేయండి.
రాయ్స్ ఏజెన్సీస్ రాయచోటి — మీ ట్రస్టెడ్ ఫ్రోజెన్ ఫుడ్ పార్ట్నర్!"""

VOICE = "te-IN-ShrutiNeural"
OUTPUT_FILE = "public/audio/campaign_01_narration.mp3"

async def generate():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    communicate = edge_tts.Communicate(SCRIPT_TELUGU, VOICE, rate="+18%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    print(f"Generated narration: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(generate())
