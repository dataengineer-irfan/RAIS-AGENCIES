import os
import re

print("AUDITING LINKS ACROSS SRC FOLDER:")
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fl:
                lines = fl.readlines()
                for idx, line in enumerate(lines):
                    if any(k in line.lower() for k in ['catalogue', 'catalog', 'wa.me', 'whatsapp', 'instagram.com', 'dm', 'href', 'to=']):
                        if not line.strip().startswith('//') and not line.strip().startswith('*'):
                            print(f"{path}:{idx+1} -> {line.strip()[:140]}")
