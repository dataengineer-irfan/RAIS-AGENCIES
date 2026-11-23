import os
import re
import json

ROOT_DIR = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\src"

SUSPICIOUS_PATTERNS = [
    (r"alert\(.*(?:simulat|demo|mock|in production|future).*\)", "Mock Alert Popup"),
    (r"is_simulated\s*:\s*true", "Flagged as Simulated True"),
    (r"SIMULATED_DEMO", "Simulated Demo Enum"),
    (r"SIMULATED_TEST_MODE", "Simulated Test Mode"),
    (r"simulatedPostId", "Simulated Post ID"),
    (r"Sri Krishna Cafe & Bakers", "Legacy Fake Reviewer"),
    (r"Dummy|dummy", "Dummy Reference"),
    (r"Placeholder|placeholder", "Placeholder Reference"),
    (r"Lorem|lorem", "Lorem Ipsum Dummy Text")
]

def run_audit():
    findings = []
    file_count = 0
    
    for root, dirs, files in os.walk(ROOT_DIR):
        for f in files:
            if not f.endswith(('.ts', '.tsx', '.json', '.html')):
                continue
            file_count += 1
            fpath = os.path.join(root, f)
            relpath = os.path.relpath(fpath, ROOT_DIR)
            
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as file:
                lines = file.readlines()
                for idx, line in enumerate(lines, 1):
                    # Skip mocktail references (beverage)
                    if "mocktail" in line.lower() or "mocktails" in line.lower():
                        continue
                    for pattern, label in SUSPICIOUS_PATTERNS:
                        if re.search(pattern, line, re.IGNORECASE):
                            findings.append({
                                "file": relpath,
                                "line": idx,
                                "type": label,
                                "content": line.strip()
                            })
                            
    print(f"Scanned {file_count} files across src/.")
    print(f"Found {len(findings)} potential mock/simulated/placeholder items:")
    for item in findings:
        print(f"[{item['type']}] {item['file']}:{item['line']} -> {item['content'][:120]}")
        
    out_file = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\scripts\mock_audit_results.json"
    with open(out_file, 'w', encoding='utf-8') as out:
        json.dump(findings, out, indent=2)

if __name__ == '__main__':
    run_audit()
