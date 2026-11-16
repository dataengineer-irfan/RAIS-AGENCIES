import os
import sys
import json
import time
import requests
import urllib.request
import urllib.parse
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

STATE_FILE = "scripts/publishing_state.json"

def load_publishing_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"published_slots": [], "history": []}

def save_publishing_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def upload_video_cdn(filepath, filename):
    # Try uguu.se first (fastest & robust)
    print("  [CDN] Attempting upload to uguu.se...", flush=True)
    try:
        with open(filepath, 'rb') as f:
            r = requests.post('https://uguu.se/upload', files={'files[]': (filename, f, 'video/mp4')}, timeout=60)
            if r.status_code == 200:
                data = r.json()
                if data.get('success') and data.get('files'):
                    url = data['files'][0]['url']
                    print(f"  [CDN SUCCESS] Direct HTTPS URL: {url}", flush=True)
                    return url
    except Exception as e:
        print(f"  [CDN WARNING] uguu.se failed: {e}", flush=True)

    # Fallback to catbox.moe
    print("  [CDN] Attempting fallback upload to catbox.moe...", flush=True)
    try:
        with open(filepath, 'rb') as vf:
            resp = requests.post(
                'https://catbox.moe/user/api.php',
                data={'reqtype': 'fileupload'},
                files={'fileToUpload': (filename, vf, 'video/mp4')},
                timeout=30
            )
            if resp.status_code == 200 and resp.text.startswith('http'):
                url = resp.text.strip()
                print(f"  [CDN SUCCESS] Catbox URL: {url}", flush=True)
                return url
    except Exception as e:
        print(f"  [CDN WARNING] Catbox fallback failed: {e}", flush=True)

    return None

def publish_reel(sc_id, lang, dry_run=False):
    with open(".env", "r", encoding="utf-8") as f:
        env_vars = dict(line.strip().split("=", 1) for line in f if "=" in line and not line.startswith("#"))
        
    token = env_vars.get("VITE_INSTAGRAM_ACCESS_TOKEN")
    account_id = env_vars.get("VITE_INSTAGRAM_ACCOUNT_ID")
    username = env_vars.get("VITE_INSTAGRAM_USERNAME")

    with open("scripts/product_manifest.json", "r", encoding="utf-8") as f:
        manifest = json.load(f)

    sc = manifest[str(sc_id)]
    clean_folder = sc['folder'].replace('scenario_', '')
    filename = f"sc{sc_id:02d}_{'hindi' if lang=='hi' else 'telugu'}_{clean_folder}.mp4"
    filepath = f"public/videos/final_30_reels/{filename}"

    if not os.path.exists(filepath):
        print(f"ERROR: File not found: {filepath}", flush=True)
        return None

    file_size_mb = os.path.getsize(filepath) / (1024 * 1024)
    print(f"\n=======================================================", flush=True)
    print(f"PUBLISHING TO INSTAGRAM: @{username}", flush=True)
    print(f"Scenario {sc_id:02d} ({lang.upper()}): {sc['title']}", flush=True)
    print(f"File: {filepath} ({file_size_mb:.2f} MB)", flush=True)
    print(f"=======================================================", flush=True)

    hero = sc['sku1']
    if lang == 'te':
        caption = f"""{sc['audio_te'][0]} {sc['audio_te'][1]}
{sc['audio_te'][2]}

రాయచోటిలోని హోటళ్ళు, ఫాస్ట్ ఫుడ్ సెంటర్లు, కేఫ్‌లు మరియు కుటుంబాలకు అత్యుత్తమ నాణ్యమైన ఫ్రోజెన్ ఫుడ్స్ హోల్‌సేల్ రేట్లకే లభిస్తాయి! 

✨ బ్రాండెడ్ క్వాలిటీ: {hero['brand'].upper()}
📦 డైరెక్ట్ డిపో స్టాక్: -18°C కోల్డ్ స్టోరేజ్

📲 డైరెక్ట్ వాట్సాప్ ఆర్డర్: wa.me/919347453135 (9347453135)
💬 ఇన్‌స్టాగ్రామ్ DM: @raisfrozenfoods
🌐 వెబ్‌సైట్ & ఫుల్ 66-SKU క్యాటలాగ్: https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html
📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)"""
    else:
        caption = f"""{sc['audio_hi'][0]} {sc['audio_hi'][1]}
{sc['audio_hi'][2]}

रायचोटी और आसपास के सभी रेस्टोरेंट्स, कैफे, फूड स्टॉल्स और परिवारों के लिए 100% ऑथेंटिक फ्रोजन फूड्स!

✨ ब्रांड: {hero['brand'].upper()}
📦 रेडी कोल्ड-स्टोरेज स्टॉक (-18°C)

📲 डायरेक्ट WhatsApp आर्डर: wa.me/919347453135 (9347453135)
💬 इंस्टाग्राम DM: @raisfrozenfoods
🌐 वेबसाइट और पूरा 66-SKU कैटलॉग: https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html
📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)"""

    if dry_run:
        print("[DRY RUN] Caption preview:", flush=True)
        print(caption, flush=True)
        print("[DRY RUN] Completed without posting.", flush=True)
        return True

    # Step 1: Upload to direct public HTTPS URL
    print("Step 1: Uploading video to public HTTPS CDN...", flush=True)
    public_video_url = upload_video_cdn(filepath, filename)
    if not public_video_url:
        print("ERROR: Could not get a public CDN URL.", flush=True)
        return None

    # Step 2: Create Reel Media Container on Meta
    print("Step 2: Creating Meta Reel media container...", flush=True)
    url_container = f"https://graph.instagram.com/{account_id}/media"
    data = urllib.parse.urlencode({
        "media_type": "REELS",
        "video_url": public_video_url,
        "caption": caption,
        "access_token": token
    }).encode('utf-8')

    req = urllib.request.Request(url_container, data=data, method="POST")
    try:
        with urllib.request.urlopen(req) as r:
            container_res = json.loads(r.read().decode('utf-8'))
            creation_id = container_res.get('id')
            print(f"  [SUCCESS] Meta Container ID: {creation_id}", flush=True)
    except urllib.error.HTTPError as e:
        print(f"Meta container creation error {e.code}: {e.read().decode('utf-8')}", flush=True)
        return None

    # Step 3: Poll Container Status until FINISHED
    print("Step 3: Waiting for Meta servers to transcode video...", flush=True)
    status = "IN_PROGRESS"
    attempts = 0
    while status in ["IN_PROGRESS", "SUBMITTED"] and attempts < 35:
        time.sleep(4)
        attempts += 1
        url_status = f"https://graph.instagram.com/{creation_id}?fields=status_code,status&access_token={token}"
        req_status = urllib.request.Request(url_status)
        try:
            with urllib.request.urlopen(req_status) as r:
                res_status = json.loads(r.read().decode('utf-8'))
                status = res_status.get('status_code', 'UNKNOWN')
                print(f"  Polling attempt {attempts}: status = {status}", flush=True)
        except Exception as e:
            print(f"  Polling warning: {e}", flush=True)

    if status != "FINISHED":
        print(f"ERROR: Video processing failed on Meta with status: {status}", flush=True)
        return None

    # Step 4: Publish Reel live on Instagram
    print("Step 4: Publishing Reel live to @raisfrozenfoods...", flush=True)
    url_publish = f"https://graph.instagram.com/{account_id}/media_publish"
    data_pub = urllib.parse.urlencode({
        "creation_id": creation_id,
        "access_token": token
    }).encode('utf-8')

    req_pub = urllib.request.Request(url_publish, data=data_pub, method="POST")
    try:
        with urllib.request.urlopen(req_pub) as r:
            pub_res = json.loads(r.read().decode('utf-8'))
            post_id = pub_res.get('id')
    except urllib.error.HTTPError as e:
        print(f"Media publish error {e.code}: {e.read().decode('utf-8')}", flush=True)
        return None

    print("\n" + "=" * 60, flush=True)
    print("🎉 REEL SUCCESSFULLY PUBLISHED LIVE TO INSTAGRAM!", flush=True)
    print(f"Account: @{username}", flush=True)
    print(f"Instagram Post ID: {post_id}", flush=True)

    # Step 5: Fetch Permalink
    time.sleep(2)
    permalink = f"https://www.instagram.com/reel/{post_id}/"
    url_media = f"https://graph.instagram.com/{post_id}?fields=permalink,id&access_token={token}"
    try:
        req_media = urllib.request.Request(url_media)
        with urllib.request.urlopen(req_media) as r:
            media_res = json.loads(r.read().decode('utf-8'))
            if media_res.get('permalink'):
                permalink = media_res['permalink']
    except Exception:
        pass
    print(f"Live Reel URL: {permalink}", flush=True)
    print("=" * 60, flush=True)

    # Step 6: Add Verified Top Comment
    print("\nStep 5: Posting official pinned top comment with direct links...", flush=True)
    comment_text = (
        "📲 WhatsApp Direct Order: https://wa.me/919347453135 (9347453135)\n"
        "🌐 Full 66-SKU Digital Catalogue: https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html\n"
        "📍 RAIS Agencies — Near Reddies Colony, Rayachoty (516269)\n"
        "💬 DM us here: @raisfrozenfoods"
    )
    url_comment = f"https://graph.instagram.com/{post_id}/comments"
    data_comment = urllib.parse.urlencode({
        "message": comment_text,
        "access_token": token
    }).encode('utf-8')
    try:
        req_comm = urllib.request.Request(url_comment, data=data_comment, method="POST")
        with urllib.request.urlopen(req_comm) as r:
            c_res = json.loads(r.read().decode('utf-8'))
            print(f"  [SUCCESS] Top Comment Posted (ID: {c_res.get('id')})", flush=True)
    except Exception as e:
        print(f"  [NOTE] Comment notice: {e}", flush=True)

    # Step 7: Update publishing_state.json
    state = load_publishing_state()
    slot_id = f"sc{sc_id:02d}_{lang}"
    if slot_id not in state["published_slots"]:
        state["published_slots"].append(slot_id)
    
    state["history"].append({
        "scenario": sc_id,
        "lang": lang,
        "post_id": post_id,
        "permalink": permalink,
        "published_at": datetime.now().isoformat(),
        "status": "SUCCESS"
    })
    save_publishing_state(state)
    print(f"  [SUCCESS] Publishing state updated: {slot_id}", flush=True)

    return {
        "post_id": post_id,
        "permalink": permalink,
        "scenario": sc_id,
        "lang": lang
    }

if __name__ == "__main__":
    sc_id = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    lang = sys.argv[2] if len(sys.argv) > 2 else "te"
    dry_run = "--dry-run" in sys.argv
    res = publish_reel(sc_id, lang, dry_run=dry_run)
    if res:
        print(f"\nCOMPLETED_POST_ID: {res['post_id'] if isinstance(res, dict) else res}", flush=True)
