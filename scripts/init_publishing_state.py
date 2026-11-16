import os
import sys
import json
import time
from datetime import datetime
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

STATE_FILE = "scripts/publishing_state.json"

# Load or initialize state
if os.path.exists(STATE_FILE):
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        state = json.load(f)
else:
    state = {
        "published_slots": [],
        "history": []
    }

# Record the post just published
if "sc01_te" not in state["published_slots"]:
    state["published_slots"].append("sc01_te")
    state["history"].append({
        "scenario": 1,
        "lang": "te",
        "post_id": "18196925830401487",
        "permalink": "https://www.instagram.com/reel/De_H6oxAZ8a/",
        "published_at": datetime.now().isoformat(),
        "status": "SUCCESS"
    })
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

print("Publishing state updated:")
print(json.dumps(state, indent=2))
