import json
import os

with open('scripts/product_manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

print("AUDITING MANIFEST ASSET PATHS ACROSS ALL 15 SCENARIOS:")
for sc_id, sc in sorted(manifest.items(), key=lambda x: int(x[0])):
    char = sc.get('character', '')
    p1 = sc['sku1'].get('asset', '')
    p2 = sc['sku2'].get('asset', '')
    p2_pair = sc['sku2'].get('paired_asset', '')
    
    print(f"\n--- Scenario {sc_id}: {sc['title']} ---")
    print(f"  Character: {char} (Exists: {os.path.exists(char)})")
    print(f"  SKU 1: [{sc['sku1']['code']}] {sc['sku1']['name']} -> {p1} (Exists: {os.path.exists(p1)})")
    print(f"  SKU 2: [{sc['sku2']['code']}] {sc['sku2']['name']} -> {p2} (Exists: {os.path.exists(p2)})")
    if p2_pair:
        print(f"  P2 Pair: [{sc['sku2'].get('paired_code')}] {sc['sku2'].get('paired_name')} -> {p2_pair} (Exists: {os.path.exists(p2_pair)})")
