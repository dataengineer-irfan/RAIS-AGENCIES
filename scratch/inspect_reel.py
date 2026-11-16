import urllib.request
import urllib.parse
import json

with open(r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\scripts\meta_config.json", encoding="utf-8") as f:
    cfg = json.load(f)

token = cfg["user_token"]
page_id = cfg["page_id"]
ig_id = cfg["ig_user_id"]

url_page = f"https://graph.facebook.com/v19.0/{page_id}?fields=access_token&access_token={token}"
try:
    resp = urllib.request.urlopen(url_page)
    page_token = json.loads(resp.read().decode())["access_token"]
    print("Page token obtained successfully!")
except Exception as e:
    print("Failed to get page token:", e)
    page_token = token

# 1. Check recent media of @raisfrozenfoods
media_url = f"https://graph.facebook.com/v19.0/{ig_id}/media?fields=id,shortcode,permalink,caption,media_type,timestamp,like_count,comments_count&limit=15&access_token={page_token}"
try:
    req_m = urllib.request.urlopen(media_url)
    items = json.loads(req_m.read().decode()).get("data", [])
    print(f"\nFetched {len(items)} media items from @raisfrozenfoods:")
    for item in items:
        sc = item.get("shortcode", "")
        permalink = item.get("permalink", "")
        cap = (item.get("caption") or "")[:60].replace("\n", " ")
        print(f" - ID: {item.get('id')} | Shortcode: {sc} | Permalink: {permalink} | Caption: {cap}")
        if "DfaSjTiu6sb" in permalink or sc == "DfaSjTiu6sb":
            print("\n*** MATCH FOUND! ***")
            print(json.dumps(item, indent=2, ensure_ascii=False))
except Exception as e:
    print("Error querying media:", e)

# 2. Try oembed
oembed_url = f"https://graph.facebook.com/v19.0/instagram_oembed?url=https://www.instagram.com/reel/DfaSjTiu6sb/&access_token={page_token}"
try:
    req_oe = urllib.request.urlopen(oembed_url)
    res_oe = json.loads(req_oe.read().decode())
    print("\noEmbed info:")
    print(json.dumps(res_oe, indent=2, ensure_ascii=False))
except Exception as e:
    print("oEmbed error:", e)
