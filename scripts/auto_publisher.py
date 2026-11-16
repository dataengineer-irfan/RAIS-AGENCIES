import os
import sys
import time
import json
import urllib.request
import urllib.parse
from datetime import datetime

# Configure UTF-8 for Windows Console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# ==============================================================================
# RAIS AGENCIES — OFFICIAL META INSTAGRAM REELS AUTO-PUBLISHER
# ==============================================================================

PAGE_ID = "1473424802510788"
IG_USER_ID = "17841415745851781"
PUBLIC_VIDEO_BASE = "https://dataengineer-irfan.github.io/RAIS-AGENCIES/videos/final_30_reels"

def get_page_token(user_token: str) -> str:
    """Exchanges User Access Token for Page Access Token."""
    url = f"https://graph.facebook.com/v19.0/{PAGE_ID}?fields=access_token&access_token={user_token}"
    req = urllib.request.urlopen(url)
    res = json.loads(req.read().decode())
    return res.get("access_token", user_token)

def publish_single_reel(user_token: str, video_filename: str, caption_text: str):
    """
    Publishes a single Reel to @raisfrozenfoods via official 3-step Meta Graph API:
    1. POST /{ig_user_id}/media (Create REELS container)
    2. Poll /{container_id} until status_code == 'FINISHED'
    3. POST /{ig_user_id}/media_publish (Publish container to feed)
    """
    page_token = get_page_token(user_token)
    video_url = f"{PUBLIC_VIDEO_BASE}/{video_filename}"
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 🎬 Initiating Reel Upload for: {video_filename}")
    print(f" - Public Video URL: {video_url}")
    
    # Step 1: Create Container
    create_url = f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media"
    payload = urllib.parse.urlencode({
        "media_type": "REELS",
        "video_url": video_url,
        "caption": caption_text,
        "access_token": page_token
    }).encode("utf-8")
    
    try:
        req = urllib.request.Request(create_url, data=payload, method="POST")
        resp = urllib.request.urlopen(req)
        container_data = json.loads(resp.read().decode())
        container_id = container_data.get("id")
        print(f" ✅ Media Container Created! Container ID: {container_id}")
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        print(f" ❌ Container creation failed: {e.code} - {err_msg}")
        return False, err_msg
        
    # Step 2: Poll Container Status until Meta processes the video
    status_url = f"https://graph.facebook.com/v19.0/{container_id}?fields=status_code&access_token={page_token}"
    print(" ⏳ Waiting for Meta video processing...")
    
    for attempt in range(15):
        time.sleep(5)
        try:
            req = urllib.request.urlopen(status_url)
            status_data = json.loads(req.read().decode())
            status_code = status_data.get("status_code")
            print(f"   - Processing status (Attempt {attempt + 1}): {status_code}")
            
            if status_code == "FINISHED":
                print("   ✅ Meta finished encoding video!")
                break
            elif status_code == "ERROR":
                print(f"   ❌ Meta video encoding failed: {status_data}")
                return False, "Encoding error"
        except Exception as e:
            print(f"   ⚠️ Polling warning: {e}")
            
    # Step 3: Publish Media to Instagram
    publish_url = f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media_publish"
    pub_payload = urllib.parse.urlencode({
        "creation_id": container_id,
        "access_token": page_token
    }).encode("utf-8")
    
    ig_post_id = None
    try:
        pub_req = urllib.request.Request(publish_url, data=pub_payload, method="POST")
        pub_resp = urllib.request.urlopen(pub_req)
        publish_data = json.loads(pub_resp.read().decode())
        ig_post_id = publish_data.get("id")
        print(f" 🎉 SUCCESS! Reel published LIVE on @raisfrozenfoods!")
        print(f"    Instagram Post ID: {ig_post_id}")
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        print(f" ❌ Instagram Media Publish failed: {e.code} - {err_msg}")
        return False, err_msg

    # Step 4: Cross-Publish to Facebook Page (if pages_manage_posts is granted)
    fb_post_id = None
    print("\n 📘 Attempting Dual-Publish to Facebook Page...")
    fb_video_url = f"https://graph.facebook.com/v19.0/{PAGE_ID}/videos"
    fb_payload = urllib.parse.urlencode({
        "file_url": video_url,
        "description": caption_text,
        "access_token": page_token
    }).encode("utf-8")
    
    try:
        fb_req = urllib.request.Request(fb_video_url, data=fb_payload, method="POST")
        fb_resp = urllib.request.urlopen(fb_req)
        fb_data = json.loads(fb_resp.read().decode())
        fb_post_id = fb_data.get("id")
        print(f" 🎉 SUCCESS! Reel cross-published to Facebook Page!")
        print(f"    Facebook Video ID: {fb_post_id}")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"    ℹ️ Facebook Page direct publish note: {e.code}")
        if "pages_manage_posts" in err_body:
            print("    ⚠️ To enable direct Facebook Page publishing, add 'pages_manage_posts' permission.")
    except Exception as e:
        print(f"    ℹ️ Facebook notice: {e}")

    return True, {"instagram_post_id": ig_post_id, "facebook_post_id": fb_post_id}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python auto_publisher.py <USER_TOKEN> [video_filename] [caption]")
        sys.exit(1)
        
    token = sys.argv[1]
    vid = sys.argv[2] if len(sys.argv) > 2 else "sc02_telugu_02_midnight_hunger.mp4"
    cap = sys.argv[3] if len(sys.argv) > 3 else "ITC Master Chef Chicken Nuggets #Rayachoti #RaisFrozenFoods"
    
    publish_single_reel(token, vid, cap)
