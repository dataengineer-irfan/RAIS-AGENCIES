import re
import json

with open("rais-website/scratch/matched_script.txt", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Search for caption or text
caption_pattern = re.compile(r'"caption":\s*\{[^}]*"text":\s*"([^"]+)"')
m = caption_pattern.search(content)
if m:
    print("CAPTION FOUND:")
    print(m.group(1).encode('utf-8').decode('unicode_escape'))
else:
    # search for any mentions of text near hashtags or mentions
    texts = re.findall(r'"text":\s*"([^"]+)"', content)
    print(f"Total text fields found: {len(texts)}")
    for t in texts:
        if len(t) > 20 and ("RAIS" in t or "Diwali" in t or "#" in t or "food" in t.lower() or "rayachoty" in t.lower()):
            print("MATCHED TEXT:", t)
