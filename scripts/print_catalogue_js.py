import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('public/catalogue.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
for i, s in enumerate(scripts):
    if s.strip():
        print(f"=== SCRIPT {i} ===")
        print(s.strip())
