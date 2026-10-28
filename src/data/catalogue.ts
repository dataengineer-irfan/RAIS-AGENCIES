import { assetUrl } from '../utils/assetUrl';

export interface ProductItem {
  sku: string;
  categoryCode: string;
  categoryName: string;
  name: string;
  brand: string;
  pack: string;
  hsn: string;
  image?: string; // Verified authentic packaging photography
  isFeatured?: boolean;
  description: string;
}

export interface CategoryItem {
  code: string;
  name: string;
  description: string;
  itemCount: number;
  accent: string;
  iconName: string;
  image?: string;
}

const RAW_CATEGORIES: CategoryItem[] = [
  {
    code: 'CHICKEN',
    name: 'Chicken Items',
    description: 'Frozen chicken patties, nuggets, momos, popcorn & tortillas',
    itemCount: 7,
    accent: 'from-amber-500/20 to-orange-500/20',
    iconName: 'Flame',
    image: '/assets/products/triken_chicken_momos.jpg'
  },
  {
    code: 'VEG',
    name: 'Veg Items',
    description: 'French fries, veg momos, burger patties, paneer pops, bakery & sweet corn',
    itemCount: 16,
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconName: 'Leaf',
    image: '/assets/products/amul_french_fries_6mm.jpg'
  },
  {
    code: 'SAUCES',
    name: 'Ketchup & Sauces',
    description: 'Mayonnaise, tomato ketchup, pizza pasta sauces, dips & bulk packs',
    itemCount: 17,
    accent: 'from-red-500/20 to-rose-500/20',
    iconName: 'Droplets',
    image: '/assets/products/delmonte_ketchup_bottle.jpg'
  },
  {
    code: 'BREADING',
    name: 'Bread Mix & Powders',
    description: 'Crispy Cajun breading, marinades, peri-peri powder & oregano seasoning',
    itemCount: 5,
    accent: 'from-yellow-500/20 to-amber-500/20',
    iconName: 'Sparkles',
    image: '/assets/products/vkl_crispy_cajun_breading.jpg'
  },
  {
    code: 'CHEESE',
    name: 'Cheese & Slices',
    description: 'Mozzarella diced cheese, cheese slices, butter & fresh paneer cubes',
    itemCount: 5,
    accent: 'from-yellow-400/20 to-amber-600/20',
    iconName: 'Layers',
    image: '/assets/products/milky_mist_mozzarella_1kg.jpg'
  },
  {
    code: 'PACKAGING',
    name: 'Pizza & Burger Boxes',
    description: 'Corrugated pizza boxes, burger clamshells, chicken buckets & cups',
    itemCount: 9,
    accent: 'from-stone-500/20 to-amber-700/20',
    iconName: 'Box',
    image: '/assets/products/burger_box_printed.jpg'
  },
  {
    code: 'SPICES',
    name: 'Culinary Spices',
    description: 'Chilly powder, turmeric powder, coriander powder & cumin',
    itemCount: 4,
    accent: 'from-orange-500/20 to-amber-700/20',
    iconName: 'Flame',
    image: '/assets/products/chilly_powder.jpg'
  },
  {
    code: 'MOJITOS',
    name: 'Mojitos & Syrups',
    description: 'Beverage syrups, mocktail bases & fruit crushes',
    itemCount: 3,
    accent: 'from-cyan-500/20 to-blue-500/20',
    iconName: 'Wine',
    image: '/assets/products/manama_syrups_trio.jpg'
  }
];

const RAW_PRODUCTS: ProductItem[] = [
  {
    sku: 'RAIS-CHK-04',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Chicken Momos',
    brand: 'Triken',
    pack: '1 PACKET',
    hsn: '1602',
    image: '/assets/products/triken_chicken_momos.jpg',
    isFeatured: true,
    description: 'Authentic Triken Chicken Momos in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHK-05',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Chicken Nuggets',
    brand: 'ITC Master Chef',
    pack: '1 KG PACKET',
    hsn: '1602',
    image: '/assets/products/itc_crunchy_chicken_nuggets.jpg',
    isFeatured: true,
    description: 'Authentic ITC Master Chef Chicken Nuggets in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHI-FING',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Fingers Chicken',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '1602',
    image: '/assets/products/chicken_fingers.jpg',
    description: 'Authentic RAIS Select Fingers Chicken in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHK-06',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Nutrich Chicken Burger Patty',
    brand: 'Nutrich',
    pack: '1 KG PACKET',
    hsn: '1602',
    image: '/assets/products/chicken_patty.jpg',
    description: 'Authentic Nutrich Nutrich Chicken Burger Patty in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHK-03',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Nutrich Chicken Popcorn Ball',
    brand: 'Nutrich',
    pack: '1 KG PACKET',
    hsn: '1602',
    image: '/assets/products/hero_popcorn.png',
    description: 'Authentic Nutrich Nutrich Chicken Popcorn Ball in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHK-01',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Signature Tortillah 10 Inches',
    brand: 'Signature',
    pack: '1 PACKET',
    hsn: '1602',
    image: '/assets/products/fresh2go_tortilla_10.jpg',
    description: 'Authentic Signature Signature Tortillah 10 Inches in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHK-02',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Signature Tortillah 8.5 Inches',
    brand: 'Signature',
    pack: '1 PACKET',
    hsn: '1602',
    image: '/assets/products/fresh2go_tortilla_8_5.jpg',
    description: 'Authentic Signature Signature Tortillah 8.5 Inches in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-01',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Amul French Fries 6MM',
    brand: 'Amul',
    pack: '2.5 KG PACKET',
    hsn: '2004',
    image: '/assets/products/amul_french_fries_6mm.jpg',
    isFeatured: true,
    description: 'Authentic Amul Amul French Fries 6MM in commercial 2.5 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-BURG',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Burger Bun',
    brand: 'RAIS Select',
    pack: '1 Pack',
    hsn: '2004',
    image: '/assets/products/burger_buns.jpg',
    description: 'Authentic RAIS Select Burger Bun in commercial 1 wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-04',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Chilli Fill Veg Burger Patty',
    brand: 'Chilli Fill',
    pack: '1.2 KG PACKET',
    hsn: '2004',
    image: '/assets/products/chill_fill_veg_patty.jpg',
    description: 'Authentic Chilli Fill Chilli Fill Veg Burger Patty in commercial 1.2 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-06',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Godrej Paneer Pops',
    brand: 'Godrej',
    pack: '1 KG PACKET',
    hsn: '2004',
    image: '/assets/products/cheesy_triangle.jpg',
    description: 'Authentic Godrej Godrej Paneer Pops in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-09',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Godrej Tandoori Paneer Nuggets',
    brand: 'Godrej',
    pack: '1 KG PACKET',
    hsn: '2004',
    image: '/assets/products/cheesy_triangle.jpg',
    description: 'Authentic Godrej Godrej Tandoori Paneer Nuggets in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-02',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Hup Hup French Fries 6MM',
    brand: 'Hup Hup',
    pack: '2.5 KG PACKET',
    hsn: '2004',
    image: '/assets/products/hup_hup_french_fries.jpg',
    description: 'Authentic Hup Hup Hup Hup French Fries 6MM in commercial 2.5 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-03',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'I.t.c Veg Momos',
    brand: 'ITC Master Chef',
    pack: '1 PACKET',
    hsn: '2004',
    image: '/assets/products/veg_momos.jpg',
    description: 'Authentic ITC Master Chef I.t.c Veg Momos in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-07',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'ITC Cheesy Corn Triangle',
    brand: 'ITC Master Chef',
    pack: '1 KG PACKET',
    hsn: '2004',
    image: '/assets/products/cheesy_triangle.jpg',
    description: 'Authentic ITC Master Chef ITC Cheesy Corn Triangle in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-ITCC',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'ITC Crispy Veg Burger Patty 1.2 KG',
    brand: 'ITC Master Chef',
    pack: '1.2 KG PACKET',
    hsn: '2004',
    image: '/assets/products/chill_fill_veg_patty.jpg',
    description: 'Authentic ITC Master Chef ITC Crispy Veg Burger Patty 1.2 KG in commercial 1.2 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-05',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'ITC Paneer Patty',
    brand: 'ITC Master Chef',
    pack: '1.02KG PACKET',
    hsn: '2004',
    image: '/assets/products/itc_spicy_paneer_patty.jpg',
    description: 'Authentic ITC Master Chef ITC Paneer Patty in commercial 1.02KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-MCCA',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Mccain Smiles',
    brand: 'RAIS Select',
    pack: '1.5 kg',
    hsn: '2004',
    image: '/assets/products/mccain_smiles.jpg',
    description: 'Authentic RAIS Select Mccain Smiles in commercial 1.5 kg wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-PIZZ',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Pizza Base 8 Inch',
    brand: 'RAIS Select',
    pack: '1 PACKET',
    hsn: '2004',
    image: '/assets/products/pizza_base.jpg',
    description: 'Authentic RAIS Select Pizza Base 8 Inch in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-PIZB',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Pizza Base 9 Inch',
    brand: 'RAIS Select',
    pack: '5 PEICES Pack',
    hsn: '2004',
    image: '/assets/products/pizza_base.jpg',
    description: 'Authentic RAIS Select Pizza Base 9 Inch in commercial 5 PEICES wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-08',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Sweet Corn',
    brand: 'RAIS Fresh',
    pack: '1 KG PACKET',
    hsn: '2004',
    image: '/assets/products/sweet_corn_pack.jpg',
    description: 'Authentic RAIS Fresh Sweet Corn in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-VEGS',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Veg Spring Rolls',
    brand: 'RAIS Select',
    pack: '500GR  PACKET Pack',
    hsn: '2004',
    image: '/assets/products/spring_rolls.jpg',
    description: 'Authentic RAIS Select Veg Spring Rolls in commercial 500GR  PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-VEGG',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Veggie Balls',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '2004',
    image: '/assets/products/veggie_balls.jpg',
    description: 'Authentic RAIS Select Veggie Balls in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-CULI',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Culinary Sauce',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/culinary_sauce_5kg.jpg',
    description: 'Authentic RAIS Select Culinary Sauce in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-BARB',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Barbique Sauce',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/delmonte_barbeque_sauce.jpg',
    description: 'Authentic RAIS Select Del Monte Barbique Sauce in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-05',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Creamy Cheese Sauce',
    brand: 'Del Monte',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/delmonte_creamy_cheese.jpg',
    description: 'Authentic Del Monte Del Monte Creamy Cheese Sauce in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-03',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Ketchup (8 Gram Pkt)',
    brand: 'Del Monte',
    pack: '1 PACKET',
    hsn: '2103',
    image: '/assets/products/ketchup_sachets.jpg',
    description: 'Authentic Del Monte Del Monte Ketchup (8 Gram Pkt) in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-DELM',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Mayonnaise 1kg',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/mealtime_veg_mayo.jpg',
    description: 'Authentic RAIS Select Del Monte Mayonnaise 1kg in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-06',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Pizza Pasta Sauce',
    brand: 'Del Monte',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/delmonte_pizza_pasta_sauce.jpg',
    description: 'Authentic Del Monte Del Monte Pizza Pasta Sauce in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-04',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Tandoori Mayo',
    brand: 'Del Monte',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/delmonte_tandoori_mayo.jpg',
    description: 'Authentic Del Monte Del Monte Tandoori Mayo in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-01',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Tomato Ketchup 1.1kg',
    brand: 'Del Monte',
    pack: '1 PACKET',
    hsn: '2103',
    image: '/assets/products/delmonte_ketchup_bottle.jpg',
    isFeatured: true,
    description: 'Authentic Del Monte Del Monte Tomato Ketchup 1.1kg in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-09',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Mayonnaise (8 Gram Pkt)',
    brand: 'Foodrite',
    pack: '1 PACKET',
    hsn: '2103',
    image: '/assets/products/foodrite_mayo_sachets.jpg',
    description: 'Authentic Foodrite Foodrite Mayonnaise (8 Gram Pkt) in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-08',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Salad Mayonnaise',
    brand: 'Foodrite',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/mealtime_veg_mayo.jpg',
    description: 'Authentic Foodrite Foodrite Salad Mayonnaise in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-02',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Tomato Ketchup',
    brand: 'Foodrite',
    pack: '1 KG PACKET',
    hsn: '2103',
    image: '/assets/products/foodrite_tomato_ketchup_pouch.jpg',
    description: 'Authentic Foodrite Foodrite Tomato Ketchup in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-KECH',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Ketchup FDR 5kg Tomato',
    brand: 'RAIS Select',
    pack: '5 KG CAN',
    hsn: '2103',
    image: '/assets/products/red_sauce_can_5kg.jpg',
    description: 'Authentic RAIS Select Ketchup FDR 5kg Tomato in commercial 5 KG CAN wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-07',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Mayank Gold Ketchup (9 Gram Pkt)',
    brand: 'Mayank Gold',
    pack: '1 PACKET',
    hsn: '2103',
    image: '/assets/products/ketchup_sachets.jpg',
    description: 'Authentic Mayank Gold Mayank Gold Ketchup (9 Gram Pkt) in commercial 1 PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-PAC-MAYO',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Mayonnaise Cups 35 MM',
    brand: 'RAIS Select',
    pack: '1 packet',
    hsn: '2103',
    image: '/assets/products/mayo_portion_cups.jpg',
    description: 'Authentic RAIS Select Mayonnaise Cups 35 MM in commercial 1 packet wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-MRFO',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Mr Foodrite Thick Chocolate Dressing',
    brand: 'RAIS Select',
    pack: '1 KG',
    hsn: '2103',
    image: '/assets/products/foodrite_chocolate_dressing.jpg',
    description: 'Authentic RAIS Select Mr Foodrite Thick Chocolate Dressing in commercial 1 KG wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SAU-TOMA',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Tomato Sauce 5kg',
    brand: 'RAIS Select',
    pack: '5 KG  CAN',
    hsn: '2103',
    image: '/assets/products/red_sauce_can_5kg.jpg',
    description: 'Authentic RAIS Select Tomato Sauce 5kg in commercial 5 KG  CAN wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-VENI',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Vinegar',
    brand: 'RAIS Select',
    pack: '1 ltr',
    hsn: '2103',
    image: '/assets/products/cooking_vinegar.jpg',
    description: 'Authentic RAIS Select Vinegar in commercial 1 ltr wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-CHIL',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'Chilli Flakes VKL',
    brand: 'RAIS Select',
    pack: '500 grams',
    hsn: '1901',
    image: '/assets/products/chilly_powder.jpg',
    description: 'Authentic RAIS Select Chilli Flakes VKL in commercial 500 grams wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BRD-04',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'Oregano',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '1901',
    image: '/assets/products/big_bell_oregano.jpg',
    description: 'Authentic RAIS Select Oregano in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BRD-02',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'VKL Crispy Cajun Breading Mix',
    brand: 'VKL',
    pack: '1 KG PACKET',
    hsn: '1901',
    image: '/assets/products/vkl_crispy_cajun_breading.jpg',
    isFeatured: true,
    description: 'Authentic VKL VKL Crispy Cajun Breading Mix in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BRD-01',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'VKL Extra H & S Marinade',
    brand: 'VKL',
    pack: '1 KG PACKET',
    hsn: '1901',
    image: '/assets/products/vkl_extra_hs_marinade.jpg',
    description: 'Authentic VKL VKL Extra H & S Marinade in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BRD-03',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'VKL Peri Peri Powder',
    brand: 'VKL',
    pack: '250 GRAMS PACKET Pack',
    hsn: '1901',
    image: '/assets/products/vkl_peri_peri_sprinkler.jpg',
    description: 'Authentic VKL VKL Peri Peri Powder in commercial 250 GRAMS PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHE-BUTT',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Butter Nutrilite',
    brand: 'RAIS Select',
    pack: '500 GRAMS PACKET Pack',
    hsn: '0406',
    image: '/assets/products/nutrilite_butter.jpg',
    description: 'Authentic RAIS Select Butter Nutrilite in commercial 500 GRAMS PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHS-03',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Cheese Slice',
    brand: 'Milky Mist',
    pack: '765 GRAMS PACKET Pack',
    hsn: '0406',
    image: '/assets/products/milky_mist_cheese_slices.jpg',
    description: 'Authentic Milky Mist Milky Mist Cheese Slice in commercial 765 GRAMS PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHS-02',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Mozzarella Diced Cheese (1kg)',
    brand: 'Milky Mist',
    pack: '1 KG PACKET',
    hsn: '0406',
    image: '/assets/products/milky_mist_mozzarella_1kg.jpg',
    description: 'Authentic Milky Mist Milky Mist Mozzarella Diced Cheese (1kg) in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHS-01',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Mozzarella Diced Cheese (2kg)',
    brand: 'Milky Mist',
    pack: '2 KG PACKET',
    hsn: '0406',
    image: '/assets/products/milky_mist_mozzarella_2kg.jpg',
    isFeatured: true,
    description: 'Authentic Milky Mist Milky Mist Mozzarella Diced Cheese (2kg) in commercial 2 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-CHS-04',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Paneer (diced Cubes)',
    brand: 'Milky Mist',
    pack: '1 KG PACKET',
    hsn: '0406',
    image: '/assets/products/paneer_diced_cubes.jpg',
    description: 'Authentic Milky Mist Milky Mist Paneer (diced Cubes) in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BOX-04',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Burger Box 4',
    brand: 'Packaging Solutions',
    pack: '100 NOS Pack',
    hsn: '4819',
    image: '/assets/products/burger_box_printed.jpg',
    isFeatured: true,
    description: 'Authentic Packaging Solutions Burger Box 4 in commercial 100 NOS wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BOX-05',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Burger Box 5',
    brand: 'Packaging Solutions',
    pack: '100 NOS Pack',
    hsn: '4819',
    image: '/assets/products/burger_box_printed.jpg',
    description: 'Authentic Packaging Solutions Burger Box 5 in commercial 100 NOS wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-VEG-BUTT',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Butter Paper',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '4819',
    image: '/assets/products/butter_paper_pack.jpg',
    description: 'Authentic RAIS Select Butter Paper in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BOX-02',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Chicken Box 4',
    brand: 'Packaging Solutions',
    pack: '100 NOS Pack',
    hsn: '4819',
    image: '/assets/products/pizza_burger_boxes_pile.jpg',
    description: 'Authentic Packaging Solutions Chicken Box 4 in commercial 100 NOS wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-PAC-BUKE',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Chicken Buckets',
    brand: 'RAIS Select',
    pack: '34 Pack',
    hsn: '4819',
    image: '/assets/products/kfc_bucket.jpg',
    description: 'Authentic RAIS Select Chicken Buckets in commercial 34 wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-PAC-KFCB',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'KFC Bucket',
    brand: 'RAIS Select',
    pack: '34 PEICES Pack',
    hsn: '4819',
    image: '/assets/products/kfc_bucket.jpg',
    description: 'Authentic RAIS Select KFC Bucket in commercial 34 PEICES wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BOX-03',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Pizza Box 8',
    brand: 'Packaging Solutions',
    pack: '1.2 KG PACKET',
    hsn: '4819',
    image: '/assets/products/boxes_pizza_burger_display2.jpg',
    description: 'Authentic Packaging Solutions Pizza Box 8 in commercial 1.2 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-BOX-01',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Pizza Box 9×9 Plain',
    brand: 'Packaging Solutions',
    pack: '100 NOS Pack',
    hsn: '4819',
    image: '/assets/products/boxes_display_pizza_burger.jpg',
    description: 'Authentic Packaging Solutions Pizza Box 9×9 Plain in commercial 100 NOS wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-PAC-TISS',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Tissue Papers',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '4819',
    image: '/assets/products/tissue_papers_pack.jpg',
    description: 'Authentic RAIS Select Tissue Papers in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SPC-02',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Chilly Powder',
    brand: 'RAIS Spices',
    pack: '1 KG PACKET',
    hsn: '0910',
    image: '/assets/products/chilly_powder.jpg',
    description: 'Authentic RAIS Spices Chilly Powder in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SPC-01',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Chilly Powder NO 1 (pickle)',
    brand: 'RAIS Spices',
    pack: '1 KG PACKET',
    hsn: '0910',
    image: '/assets/products/chilly_powder.jpg',
    description: 'Authentic RAIS Spices Chilly Powder NO 1 (pickle) in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SPC-04',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Coriander Powder',
    brand: 'RAIS Spices',
    pack: '1 KG PACKET',
    hsn: '0910',
    image: '/assets/products/coriander_powder.jpg',
    description: 'Authentic RAIS Spices Coriander Powder in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-SPC-03',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Turmeric Powder',
    brand: 'RAIS Spices',
    pack: '1 KG PACKET',
    hsn: '0910',
    image: '/assets/products/turmeric_powder.jpg',
    description: 'Authentic RAIS Spices Turmeric Powder in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-MOJ-02',
    categoryCode: 'MOJITOS',
    categoryName: 'Mojitos & Syrups',
    name: 'Blue Curacao Syrup',
    brand: 'RAIS Beverages',
    pack: '1 BOTTLE',
    hsn: '2106',
    image: '/assets/products/manama_syrups_trio.jpg',
    description: 'Authentic RAIS Beverages Blue Curacao Syrup in commercial 1 BOTTLE wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-MOJ-01',
    categoryCode: 'MOJITOS',
    categoryName: 'Mojitos & Syrups',
    name: 'Lime and Mint',
    brand: 'RAIS Beverages',
    pack: '1 BOTTLE',
    hsn: '2106',
    image: '/assets/products/manama_syrups_trio.jpg',
    description: 'Authentic RAIS Beverages Lime and Mint in commercial 1 BOTTLE wholesale packing for QSRs, hotels, and cafes.'
  },
  {
    sku: 'RAIS-MOJ-STRA',
    categoryCode: 'MOJITOS',
    categoryName: 'Mojitos & Syrups',
    name: 'Strawberry Mojito Syrup',
    brand: 'RAIS Select',
    pack: '1 KG PACKET',
    hsn: '2106',
    image: '/assets/products/manama_strawberry_mojito.jpg',
    description: 'Authentic RAIS Select Strawberry Mojito Syrup in commercial 1 KG PACKET wholesale packing for QSRs, hotels, and cafes.'
  },

];

export const CATEGORIES: CategoryItem[] = RAW_CATEGORIES.map((c) => ({
  ...c,
  image: c.image ? assetUrl(c.image) : undefined
}));

export const PRODUCTS: ProductItem[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  image: p.image ? assetUrl(p.image) : undefined
}));

export const BUSINESS_INFO = {
  name: 'RAIS AGENCIES',
  tagline: 'Wholesale Frozen Food Products & Packaging Solutions',
  subtagline: 'FROZEN FOOD PRODUCTS',
  address: 'Near Reddies Colony, Rayachoty - 516269, Annamayya District, Andhra Pradesh, India',
  phones: ['9347453135', '9573261696'],
  primaryPhone: '9347453135',
  whatsappNumber: '919347453135',
  whatsappUrl: 'https://wa.me/919347453135',
  websiteUrl: 'https://dataengineer-irfan.github.io/RAIS-AGENCIES/',
  catalogueUrl: 'https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html',
  instagramUrl: 'https://instagram.com/raisfrozenfoods',
  instagramDmUrl: 'https://ig.me/m/raisfrozenfoods',
  upiId: '9347453135@ybl',
  partnerBrands: [
    'ITC Master Chef',
    'Milky Mist',
    'Del Monte',
    'Amul',
    'Nutrich',
    'Triken',
    'Hup Hup',
    'Chilli Fill',
    'Godrej',
    'Signature',
    'Foodrite',
    'Mayank Gold',
    'VKL',
    'RAIS Select',
    'Packaging Solutions'
  ]
};
