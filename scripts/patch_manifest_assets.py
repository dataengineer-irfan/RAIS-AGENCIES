import json
import os

with open('scripts/product_manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Patch mappings
# Sc 3
manifest["3"]["sku1"]["asset"] = "public/images/products_catalogue/hero_popcorn.png"
manifest["3"]["sku2"]["asset"] = "public/images/products_catalogue/cheesy_triangle.jpg"

# Sc 5
manifest["5"]["sku1"]["asset"] = "public/images/products_catalogue/veg_momos.jpg"

# Sc 7
manifest["7"]["sku1"]["asset"] = "public/images/products_catalogue/cheesy_triangle.jpg"
manifest["7"]["sku2"]["asset"] = "public/images/products_catalogue/manama_strawberry_mojito.jpg"

# Sc 9
manifest["9"]["sku1"]["asset"] = "public/images/products_catalogue/itc_spicy_paneer_patty.jpg"

# Sc 10
manifest["10"]["sku1"]["asset"] = "public/images/products_catalogue/veggie_balls.jpg"
manifest["10"]["sku2"]["asset"] = "public/images/products_catalogue/vkl_peri_peri_sprinkler.jpg"

# Sc 11
manifest["11"]["sku2"]["asset"] = "public/images/products_catalogue/foodrite_chocolate_dressing.jpg"

# Sc 12
manifest["12"]["sku1"]["asset"] = "public/images/products_catalogue/chill_fill_veg_patty.jpg"
manifest["12"]["sku2"]["asset"] = "public/images/products_catalogue/manama_strawberry_mojito.jpg"

# Sc 13
manifest["13"]["sku1"]["asset"] = "public/images/products_catalogue/paneer_diced_cubes.jpg"
manifest["13"]["sku2"]["paired_asset"] = "public/images/products_catalogue/veg_momos.jpg"

# Sc 14
manifest["14"]["sku2"]["paired_asset"] = "public/images/products_catalogue/boxes_display_pizza_burger.jpg"

# Sc 15
manifest["15"]["character"] = "public/images/character_test_scene_b_b2b.jpg"
manifest["15"]["sku1"]["asset"] = "public/images/products_catalogue/vkl_crispy_cajun_breading.jpg"
manifest["15"]["sku2"]["paired_asset"] = "public/images/products_catalogue/pizza_burger_boxes_pile.jpg"

# Save updated manifest
with open('scripts/product_manifest.json', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("Manifest successfully patched! Verifying all assets now...")
all_ok = True
for sc_id, sc in sorted(manifest.items(), key=lambda x: int(x[0])):
    char = sc.get('character', '')
    p1 = sc['sku1'].get('asset', '')
    p2 = sc['sku2'].get('asset', '')
    p2_pair = sc['sku2'].get('paired_asset', '')
    for name, path in [('char', char), ('sku1', p1), ('sku2', p2), ('p2_pair', p2_pair)]:
        if path and not os.path.exists(path):
            print(f"FAILED: Sc {sc_id} -> {name}: {path} does NOT exist!")
            all_ok = False

if all_ok:
    print("SUCCESS: 100% of all characters, hero SKUs, paired SKUs, and packaging assets exist and are verified!")
