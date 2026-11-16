import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('public/catalogue.html', 'rb') as f:
    raw = f.read()

# Check if valid UTF-8
try:
    text = raw.decode('utf-8')
    print('Valid UTF-8: True')
except Exception as e:
    print('Valid UTF-8: False', e)
    text = raw.decode('utf-8', errors='replace')

# Look for replacement characters
bad_count = text.count('\ufffd')
print('Replacement character \ufffd count:', bad_count)

# Check for 
q_count = text.count('')
print(' count:', q_count)

# Check all categories and product cards
import re
cards = re.findall(r'<div[^>]*class="[^"]*product-card[^"]*"', text)
print('Product cards found:', len(cards))

cats = re.findall(r'id="category-[^"]*"', text)
print('Categories found:', len(cats))

# Check JavaScript errors or broken tags
script_tags = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
print('Script blocks found:', len(script_tags))
for idx, s in enumerate(script_tags):
    print(f'Script {idx} length:', len(s.strip()))
