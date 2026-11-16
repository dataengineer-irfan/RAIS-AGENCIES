import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

test_assets = [
    # Sc 1
    (r"C:\Users\affra\Documents\RAIS\assets\products\triken_chicken_momos.jpg", "Sc 1 Momos"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\amul_french_fries_6mm.jpg", "Sc 1 Fries"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\burger_box_printed.jpg", "Sc 1 Box"),
    # Sc 2
    (r"C:\Users\affra\Documents\RAIS\assets\products\itc_crunchy_chicken_nuggets.jpg", "Sc 2 Nuggets"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\mealtime_veg_mayo.jpg", "Sc 2 Mayo"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\hup_hup_french_fries.jpg", "Sc 2 Fries"),
    # Sc 3
    (r"C:\Users\affra\Documents\RAIS\assets\products\hero_popcorn.png", "Sc 3 Popcorn"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\delmonte_tandoori_mayo.jpg", "Sc 3 Mayo"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\kfc_bucket.jpg", "Sc 3 Bucket"),
    # Sc 4
    (r"C:\Users\affra\Documents\RAIS\assets\products\mccain_smiles.jpg", "Sc 4 Smiles"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\delmonte_ketchup_bottle.jpg", "Sc 4 Ketchup"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\cheesy_triangle.jpg", "Sc 4 Triangle"),
    # Sc 5
    (r"C:\Users\affra\Documents\RAIS\assets\products\veg_momos.jpg", "Sc 5 Veg Momos"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\spring_rolls.jpg", "Sc 5 Spring Rolls"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\delmonte_pizza_pasta_sauce.jpg", "Sc 5 Sauce"),
    # Sc 6
    (r"C:\Users\affra\Documents\RAIS\assets\products\chicken_patty.jpg", "Sc 6 Patty"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\burger_buns.jpg", "Sc 6 Buns"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\burger_box_printed.jpg", "Sc 6 Box"),
    # Sc 7
    (r"C:\Users\affra\Documents\RAIS\assets\products\cheesy_triangle.jpg", "Sc 7 Triangle"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\manama_syrups_trio.jpg", "Sc 7 Syrups"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\tissue_papers_pack.jpg", "Sc 7 Tissues"),
    # Sc 8
    (r"C:\Users\affra\Documents\RAIS\assets\products\chicken_fingers.jpg", "Sc 8 Fingers"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\foodrite_tomato_ketchup_pouch.jpg", "Sc 8 Ketchup"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\mayo_portion_cups.jpg", "Sc 8 Mayo Cups"),
    # Sc 9
    (r"C:\Users\affra\Documents\RAIS\assets\products\itc_spicy_paneer_patty.jpg", "Sc 9 Paneer Patty"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\delmonte_creamy_cheese.jpg", "Sc 9 Cheese Sauce"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\fresh2go_tortilla_10.jpg", "Sc 9 Tortilla"),
    # Sc 10
    (r"C:\Users\affra\Documents\RAIS\assets\products\cheesy_triangle.jpg", "Sc 10 Paneer Pops"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\vkl_peri_peri_sprinkler.jpg", "Sc 10 Peri Peri"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\butter_paper_pack.jpg", "Sc 10 Butter Paper"),
    # Sc 11
    (r"C:\Users\affra\Documents\RAIS\assets\products\hup_hup_french_fries.jpg", "Sc 11 Fries"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\foodrite_chocolate_dressing.jpg", "Sc 11 Chocolate"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\foodrite_mayo_sachets.jpg", "Sc 11 Mayo Sachets"),
    # Sc 12
    (r"C:\Users\affra\Documents\RAIS\assets\products\chill_fill_veg_patty.jpg", "Sc 12 Patty"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\manama_syrups_trio.jpg", "Sc 12 Mojito"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\burger_box_printed.jpg", "Sc 12 Box"),
    # Sc 13
    (r"C:\Users\affra\Documents\RAIS\assets\products\paneer_diced_cubes.jpg", "Sc 13 Paneer"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\sweet_corn_pack.jpg", "Sc 13 Corn"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\big_bell_oregano.jpg", "Sc 13 Oregano"),
    # Sc 14
    (r"C:\Users\affra\Documents\RAIS\assets\products\pizza_base.jpg", "Sc 14 Pizza Base"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\milky_mist_mozzarella_2kg.jpg", "Sc 14 Mozzarella"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\boxes_pizza_burger_display2.jpg", "Sc 14 Pizza Box"),
    # Sc 15
    (r"C:\Users\affra\Documents\RAIS\assets\products\vkl_crispy_cajun_breading.jpg", "Sc 15 Breading"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\milky_mist_cheese_slices.jpg", "Sc 15 Slices"),
    (r"C:\Users\affra\Documents\RAIS\assets\products\boxes_display_pizza_burger.jpg", "Sc 15 Boxes"),
]

missing = []
for p, label in test_assets:
    if not os.path.exists(p):
        missing.append((p, label))
    else:
        sz = os.path.getsize(p)
        print(f"[OK] {label:<20} ({sz/1024:.1f} KB) -> {os.path.basename(p)}")

print("=" * 60)
print(f"Total checked: {len(test_assets)}, Missing: {len(missing)}")
