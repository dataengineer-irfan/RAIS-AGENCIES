import os
import sys
import json
import urllib.request
import urllib.parse
import time
from datetime import datetime

# UTF-8 encoding for Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "meta_config.json")
STATE_FILE = os.path.join(BASE_DIR, "publishing_state.json")
PUBLIC_VIDEO_BASE = "https://dataengineer-irfan.github.io/RAIS-AGENCIES/videos/final_30_reels"

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_page_token(user_token, page_id):
    url = f"https://graph.facebook.com/v19.0/{page_id}?fields=access_token&access_token={user_token}"
    req = urllib.request.urlopen(url)
    res = json.loads(req.read().decode())
    return res.get("access_token", user_token)

def publish_next_in_queue():
    config = load_json(CONFIG_FILE)
    state = load_json(STATE_FILE)
    
    user_token = config["user_token"]
    page_id = config["page_id"]
    ig_user_id = config["ig_user_id"]
    
    queue = state.get("queue", [])
    if not queue:
        print("🎉 ALL 30 REELS HAVE BEEN PUBLISHED! Queue is empty.")
        return None
        
    next_item = queue[0]
    print(f"\n========================================================")
    print(f"🚀 PUBLISHING NEXT REEL: Day {next_item['day']} Slot {next_item['slot']} ({next_item['lang']})")
    print(f"   Product: {next_item['product']} | Theme: {next_item.get('theme', '')}")
    print(f"========================================================")
    
    page_token = get_page_token(user_token, page_id)
    video_url = f"{PUBLIC_VIDEO_BASE}/{next_item['file']}"
    
    # 1. Create Media Container
    create_url = f"https://graph.facebook.com/v19.0/{ig_user_id}/media"
    payload = urllib.parse.urlencode({
        "media_type": "REELS",
        "video_url": video_url,
        "caption": next_item["caption"],
        "access_token": page_token
    }).encode("utf-8")
    
    try:
        req = urllib.request.Request(create_url, data=payload, method="POST")
        resp = urllib.request.urlopen(req)
        container_data = json.loads(resp.read().decode())
        container_id = container_data.get("id")
        print(f"✅ Container created on Meta: {container_id}")
    except Exception as e:
        print(f"❌ Failed to create container: {e}")
        return False
        
    # 2. Poll until FINISHED
    status_url = f"https://graph.facebook.com/v19.0/{container_id}?fields=status_code&access_token={page_token}"
    print("⏳ Waiting for Meta processing & encoding...")
    for attempt in range(15):
        time.sleep(5)
        try:
            req = urllib.request.urlopen(status_url)
            status_data = json.loads(req.read().decode())
            status_code = status_data.get("status_code")
            print(f"   Status (Check {attempt + 1}): {status_code}")
            if status_code == "FINISHED":
                print("   ✅ Encoding complete!")
                break
            elif status_code == "ERROR":
                print(f"   ❌ Meta encoding error: {status_data}")
                return False
        except Exception as e:
            print(f"   ⚠️ Polling warning: {e}")
            
    # 3. Publish container
    publish_url = f"https://graph.facebook.com/v19.0/{ig_user_id}/media_publish"
    pub_payload = urllib.parse.urlencode({
        "creation_id": container_id,
        "access_token": page_token
    }).encode("utf-8")
    
    try:
        pub_req = urllib.request.Request(publish_url, data=pub_payload, method="POST")
        pub_resp = urllib.request.urlopen(pub_req)
        publish_data = json.loads(pub_resp.read().decode())
        post_id = publish_data.get("id")
        
        # Get permalink
        info_url = f"https://graph.facebook.com/v19.0/{post_id}?fields=permalink&access_token={page_token}"
        info_req = urllib.request.urlopen(info_url)
        info_data = json.loads(info_req.read().decode())
        permalink = info_data.get("permalink", f"https://www.instagram.com/p/{post_id}/")
        
        print(f"\n🎉 SUCCESS! Published LIVE to Instagram (@raisfrozenfoods)!")
        print(f"   Instagram Post ID: {post_id}")
        print(f"   Live Reel Link: {permalink}")

        # 4. Cross-Publish to Facebook Page
        fb_post_id = None
        fb_video_url = f"https://graph.facebook.com/v19.0/{page_id}/videos"
        fb_payload = urllib.parse.urlencode({
            "file_url": video_url,
            "description": next_item["caption"],
            "access_token": page_token
        }).encode("utf-8")
        
        try:
            print("\n📘 Publishing to Facebook Page (RAIS Agencies)...")
            fb_req = urllib.request.Request(fb_video_url, data=fb_payload, method="POST")
            fb_resp = urllib.request.urlopen(fb_req)
            fb_data = json.loads(fb_resp.read().decode())
            fb_post_id = fb_data.get("id")
            print(f"🎉 SUCCESS! Published LIVE to Facebook Page!")
            print(f"   Facebook Video ID: {fb_post_id}")
        except Exception as e:
            print(f"   ℹ️ Facebook Page publish note: {e}")
        
        # Move from queue to published
        published_record = {
            "id": next_item["id"],
            "day": next_item["day"],
            "slot": next_item["slot"],
            "lang": next_item["lang"],
            "product": next_item["product"],
            "instagramPostId": post_id,
            "facebookVideoId": fb_post_id,
            "permalink": permalink,
            "publishedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        state["published"].append(published_record)
        state["queue"].pop(0)
        save_json(STATE_FILE, state)
        print(f"💾 Updated state tracker! Remaining in queue: {len(state['queue'])}")
        return True
    except Exception as e:
        print(f"❌ Failed to publish: {e}")
        return False

if __name__ == "__main__":
    publish_next_in_queue()
