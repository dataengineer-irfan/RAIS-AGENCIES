import os
import sys
import json
import urllib.request
import urllib.parse
from datetime import datetime

# UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "meta_config.json")
REPLIED_FILE = os.path.join(BASE_DIR, "replied_comments.json")

def load_json(filepath, default):
    if not os.path.exists(filepath):
        return default
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except:
            return default

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_page_token(user_token, page_id):
    url = f"https://graph.facebook.com/v19.0/{page_id}?fields=access_token&access_token={user_token}"
    req = urllib.request.urlopen(url)
    res = json.loads(req.read().decode())
    return res.get("access_token", user_token)

def check_and_reply_comments():
    config = load_json(CONFIG_FILE, {})
    replied_ids = set(load_json(REPLIED_FILE, []))
    
    user_token = config.get("user_token")
    page_id = config.get("page_id")
    ig_user_id = config.get("ig_user_id")
    
    if not user_token or not ig_user_id:
        print("Missing API credentials.")
        return
        
    page_token = get_page_token(user_token, page_id)
    
    # 1. Fetch recent media (reels/posts)
    media_url = f"https://graph.facebook.com/v19.0/{ig_user_id}/media?fields=id,caption&limit=5&access_token={page_token}"
    try:
        req = urllib.request.urlopen(media_url)
        media_list = json.loads(req.read().decode()).get("data", [])
    except Exception as e:
        print(f"Failed to fetch media: {e}")
        return
        
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Scanning comments on {len(media_list)} recent posts...")
    
    KEYWORDS = ["PRICE", "RATE", "COST", "ORDER", "WHOLESALE", "MOMOS", "FRIES", "CHEESE", "NUGGETS", "DETAILS", "WHERE", "DELIVERY", "CALL", "WHATSAPP", "HOW MUCH"]
    
    new_replies_count = 0
    
    for media in media_list:
        media_id = media["id"]
        comm_url = f"https://graph.facebook.com/v19.0/{media_id}/comments?fields=id,text,username,timestamp&access_token={page_token}"
        try:
            comm_req = urllib.request.urlopen(comm_url)
            comments = json.loads(comm_req.read().decode()).get("data", [])
        except:
            continue
            
        for comm in comments:
            comm_id = comm["id"]
            if comm_id in replied_ids:
                continue
                
            comm_text = comm.get("text", "").upper()
            username = comm.get("username", "customer")
            
            # Skip self-comments
            if username.lower() == "raisfrozenfoods":
                replied_ids.add(comm_id)
                continue
                
            is_match = any(k in comm_text for k in KEYWORDS)
            
            if is_match or len(comm_text) > 0: # Reply warmly to genuine inquiries
                reply_msg = f"Hello @{username}! For wholesale carton rates, orders & fast delivery in Rayachoti (516269), please WhatsApp us at 9347453135 or view our full catalogue here: https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html 🍟📦"
                
                # Send reply via Meta Graph API
                reply_url = f"https://graph.facebook.com/v19.0/{comm_id}/replies"
                payload = urllib.parse.urlencode({
                    "message": reply_msg,
                    "access_token": page_token
                }).encode("utf-8")
                
                try:
                    r_req = urllib.request.Request(reply_url, data=payload, method="POST")
                    urllib.request.urlopen(r_req)
                    print(f" ✅ Replied to @{username}: '{comm.get('text')}'")
                    replied_ids.add(comm_id)
                    new_replies_count += 1
                except Exception as e:
                    print(f" ⚠️ Reply failed for comment {comm_id}: {e}")
                    replied_ids.add(comm_id) # Prevent loop on failure
                    
    save_json(REPLIED_FILE, list(replied_ids))
    print(f"Scan complete. {new_replies_count} new inquiries auto-responded.")

if __name__ == "__main__":
    check_and_reply_comments()
