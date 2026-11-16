import os
import sys
import json
import time
from datetime import datetime, date

sys.stdout.reconfigure(encoding='utf-8')

STATE_FILE = "scripts/publishing_state.json"
SCHEDULE_FILE = "scripts/product_manifest.json"

from publish_single_reel import publish_reel

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"published_slots": [], "history": [], "mode": "MANUAL_UPLOAD"}

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)

import urllib.request

def get_permalink(post_id):
    try:
        if os.path.exists(".env"):
            with open(".env", "r", encoding="utf-8") as f:
                env_vars = dict(line.strip().split("=", 1) for line in f if "=" in line and not line.startswith("#"))
            token = env_vars.get("VITE_INSTAGRAM_ACCESS_TOKEN")
            url = f"https://graph.instagram.com/{post_id}?fields=permalink&access_token={token}"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as r:
                res = json.loads(r.read().decode('utf-8'))
                return res.get('permalink')
    except Exception as e:
        print(f"Warning: could not fetch permalink: {e}")
    return None

def get_slot_key(sc_id, lang):
    return f"sc{sc_id:02d}_{lang}"

def run_scheduler_tick():
    """
    Checks the schedule and publishes if a slot is due.
    Slot 1: Telugu (due 12:30 PM onwards)
    Slot 2: Hindi (due 07:30 PM onwards)
    """
    state = load_state()
    if state.get("automated_scheduling") == "DISABLED" or state.get("mode") == "MANUAL_UPLOAD":
        print("[SCHEDULER DISABLED] Automated publishing schedule is completely REMOVED. Manual upload mode is active.")
        return

    now = datetime.now()
    cur_hour = now.hour
    cur_minute = now.minute

    print(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Checking Instagram 2-Per-Day Publishing Schedule...")

    # Determine which day of the 15-day campaign we are on
    # Let's count how many slots have been successfully published
    pub_count = len(state["published_slots"])
    print(f"Total published slots so far: {pub_count} / 30")

    if pub_count >= 30:
        print("All 30 Reels have been successfully published! Campaign complete.")
        return

    # Determine next pending slot
    next_sc_id = (pub_count // 2) + 1
    next_lang = "te" if (pub_count % 2 == 0) else "hi"
    slot_name = "Slot 1 (Telugu - Lunch)" if next_lang == "te" else "Slot 2 (Hindi - Dinner)"

    print(f"Next in queue: Scenario {next_sc_id:02d} [{next_lang.upper()}] ({slot_name})")

    # Time checks:
    # Telugu Slot: scheduled for 12:30 PM (hour 12, min >= 30, or after 12:30)
    # Hindi Slot: scheduled for 07:30 PM (hour >= 19, min >= 30, or after 19:30)
    is_due = False
    if next_lang == "te":
        if cur_hour > 12 or (cur_hour == 12 and cur_minute >= 30):
            is_due = True
    else: # Hindi
        if cur_hour > 19 or (cur_hour == 19 and cur_minute >= 30):
            is_due = True

    slot_key = get_slot_key(next_sc_id, next_lang)

    if is_due:
        print(f"Time matches! Publishing Scenario {next_sc_id} ({next_lang.upper()}) now...")
        post_id = publish_reel(next_sc_id, next_lang)
        if post_id:
            permalink = get_permalink(post_id)
            history_item = {
                "scenario": next_sc_id,
                "lang": next_lang,
                "post_id": post_id,
                "published_at": datetime.now().isoformat(),
                "status": "SUCCESS"
            }
            if permalink:
                history_item["permalink"] = permalink
            state["published_slots"].append(slot_key)
            state["history"].append(history_item)
            save_state(state)
            print(f"[SUCCESS] Recorded publication of {slot_key} (Post ID: {post_id})")
            if permalink:
                print(f"[LIVE URL] {permalink}")
        else:
            print(f"[ERROR] Publishing failed for {slot_key}")
    else:
        target_time = "12:30 PM" if next_lang == "te" else "07:30 PM"
        print(f"Standing by. Next slot {slot_name} will publish automatically at {target_time} today.")

if __name__ == "__main__":
    if "--publish-next" in sys.argv:
        # Force publish next slot immediately
        state = load_state()
        pub_count = len(state["published_slots"])
        next_sc_id = (pub_count // 2) + 1
        next_lang = "te" if (pub_count % 2 == 0) else "hi"
        slot_key = get_slot_key(next_sc_id, next_lang)
        print(f"Manual trigger: Publishing {slot_key} immediately...")
        post_id = publish_reel(next_sc_id, next_lang)
        if post_id:
            permalink = get_permalink(post_id)
            history_item = {
                "scenario": next_sc_id,
                "lang": next_lang,
                "post_id": post_id,
                "published_at": datetime.now().isoformat(),
                "status": "SUCCESS"
            }
            if permalink:
                history_item["permalink"] = permalink
            state["published_slots"].append(slot_key)
            state["history"].append(history_item)
            save_state(state)
            print(f"[SUCCESS] Recorded publication of {slot_key} (Post ID: {post_id})")
            if permalink:
                print(f"[LIVE URL] {permalink}")
    elif "--daemon" in sys.argv:
        print("Starting 2-Per-Day Instagram Daemon (checks every 5 minutes)...")
        while True:
            try:
                run_scheduler_tick()
            except Exception as e:
                print(f"Error in scheduler tick: {e}")
            time.sleep(300) # 5 minutes
    else:
        run_scheduler_tick()
