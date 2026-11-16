import json

with open(r'C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if '"step_index":5333' in line:
            data = json.loads(line)
            with open('full_prompt.txt', 'w', encoding='utf-8') as out:
                out.write(data['content'])
            print("Extracted prompt of length:", len(data['content']))
            break
