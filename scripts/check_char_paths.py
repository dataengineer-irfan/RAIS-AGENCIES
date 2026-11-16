import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

char_envs = [
    (1, "public/images/character_test_scene_a_rain.jpg"),
    (2, "public/images/characters/ayesha_midnight.jpg"),
    (3, "public/images/characters/ayesha_cricket.jpg"),
    (4, "public/images/characters/ayesha_after_school.jpg"),
    (5, "public/images/characters/ayesha_family.jpg"),
    (6, "public/images/characters/ayesha_qsr_kitchen.jpg"),
    (7, "public/images/characters/ayesha_birthday.jpg"),
    (8, "public/images/characters/ayesha_streetfood_clean_1792920813490.jpg"),
    (9, "public/images/characters/ayesha_office.jpg"),
    (10, "public/images/characters/ayesha_balcony_solo_1792920759910.jpg"),
    (11, "public/images/characters/ayesha_movie_1792920984328.jpg"),
    (12, "public/images/characters/ayesha_roadtrip_1792920808893.jpg"),
    (13, "public/images/characters/ayesha_fitness_1792920804179.jpg"),
    (14, "public/images/characters/ayesha_late_qsr_notext_1792920711605.jpg"),
    (15, "public/images/character_test_scene_b_b2b.jpg"),
]

missing = []
for sc_id, path in char_envs:
    if not os.path.exists(path):
        # check fallback
        base = os.path.basename(path)
        alt = f"public/images/characters/{base}"
        if os.path.exists(alt):
            print(f"[OK Alt] Sc {sc_id:02d}: {alt}")
        else:
            missing.append((sc_id, path))
    else:
        sz = os.path.getsize(path)
        print(f"[OK] Sc {sc_id:02d} ({sz/1024:.1f} KB): {path}")

print("=" * 60)
print(f"Total checked: {len(char_envs)}, Missing: {len(missing)}")
