import urllib.request
import re

url = "https://www.instagram.com/reel/DfaSjTiu6sb/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9"
}

try:
    req = urllib.request.Request(url, headers=headers)
    resp = urllib.request.urlopen(req)
    html = resp.read().decode("utf-8", errors="ignore")
    
    title_m = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html)
    desc_m = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']+)["\']', html)
    img_m = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
    video_m = re.search(r'<meta\s+property=["\']og:video["\']\s+content=["\']([^"\']+)["\']', html)
    
    print("OG Title:", title_m.group(1) if title_m else "N/A")
    print("OG Desc:", desc_m.group(1) if desc_m else "N/A")
    print("OG Image:", img_m.group(1) if img_m else "N/A")
    print("OG Video:", video_m.group(1) if video_m else "N/A")
    
except Exception as e:
    print("Fetch error:", e)
