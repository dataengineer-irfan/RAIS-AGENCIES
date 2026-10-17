export interface ProductItem {
  sku: string;
  categoryCode: string;
  categoryName: string;
  name: string;
  brand: string;
  pack: string;
  hsn: string;
  image?: string; // ONLY provided when verified authentic studio photography exists
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

export const CATEGORIES: CategoryItem[] = [
  {
    code: 'CHICKEN',
    name: 'Chicken Items',
    description: 'Frozen chicken patties, nuggets, momos, popcorn & tortillas',
    itemCount: 8,
    accent: 'from-amber-500/20 to-orange-500/20',
    iconName: 'Flame',
    image: '/images/chicken_patty.jpg'
  },
  {
    code: 'VEG',
    name: 'Veg Items',
    description: 'French fries, veg momos, burger patties, paneer pops, bakery & sweet corn',
    itemCount: 16,
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconName: 'Leaf',
    image: '/images/cheesy_triangle.jpg'
  },
  {
    code: 'SAUCES',
    name: 'Ketchup & Sauces',
    description: 'Mayonnaise, tomato ketchup, pizza pasta sauces, dips & bulk packs',
    itemCount: 12,
    accent: 'from-red-500/20 to-rose-500/20',
    iconName: 'Droplets',
    image: '/images/gourmet_sauces.jpg'
  },
  {
    code: 'BREADING',
    name: 'Bread Mix & Powders',
    description: 'Crispy Cajun breading, marinades, peri-peri powder & oregano seasoning',
    itemCount: 5,
    accent: 'from-yellow-500/20 to-amber-500/20',
    iconName: 'Sparkles',
    image: '/images/products/spices_blend.jpg'
  },
  {
    code: 'CHEESE',
    name: 'Cheese & Slices',
    description: 'Mozzarella diced cheese, cheese slices, butter & fresh paneer cubes',
    itemCount: 6,
    accent: 'from-yellow-400/20 to-amber-600/20',
    iconName: 'Layers',
    image: '/images/mozzarella_cheese.jpg'
  },
  {
    code: 'PACKAGING',
    name: 'Pizza & Burger Boxes',
    description: 'Corrugated pizza boxes, burger clamshells, chicken buckets & cups',
    itemCount: 9,
    accent: 'from-stone-500/20 to-amber-700/20',
    iconName: 'Box',
    image: '/images/burger_boxes.jpg'
  },
  {
    code: 'SPICES',
    name: 'Culinary Spices',
    description: 'Chilly powder, turmeric powder, coriander powder & cumin',
    itemCount: 5,
    accent: 'from-orange-500/20 to-amber-700/20',
    iconName: 'Flame',
    image: '/images/products/chilli_powder.jpg'
  },
  {
    code: 'MOJITOS',
    name: 'Mojitos & Syrups',
    description: 'Beverage syrups, mocktail bases & fruit crushes',
    itemCount: 3,
    accent: 'from-cyan-500/20 to-blue-500/20',
    iconName: 'Wine',
    image: '/images/products/mojito_lime_mint.jpg'
  }
];

export const PRODUCTS: ProductItem[] = [
  // ==========================================
  // 1. Chicken Items (8 SKUs)
  // ==========================================
  {
    sku: 'RAIS-CHK-01',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Signature Tortillah 8 Inches Frozen',
    brand: 'Signature',
    pack: '1 Packet',
    hsn: '1905',
    image: '/images/products/tortilla_wraps.jpg',
    isFeatured: true,
    description: 'Thin-crust wheat flour tortillas for commercial wraps and shawarmas.'
  },
  {
    sku: 'RAIS-CHK-02',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Signature Tortillah 8.5 Inches',
    brand: 'Signature',
    pack: '1 Packet (10 Nos)',
    hsn: '1905',
    image: '/images/products/tortilla_wraps.jpg',
    description: 'Pliable 8.5-inch tortillas for high-heat grill press rolling.'
  },
  {
    sku: 'RAIS-CHK-03',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Nutrich Chicken Popcorn Ball',
    brand: 'Nutrich',
    pack: '1 kg Packet',
    hsn: '1602',
    image: '/images/products/itc_chicken_popcorn.webp',
    description: 'Bite-sized seasoned chicken bites with crisp crumb coating for fryers.'
  },
  {
    sku: 'RAIS-CHK-04',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'I.T.C Chicken Momos',
    brand: 'ITC Master Chef',
    pack: '1 Packet (500g)',
    hsn: '1902',
    image: '/images/products/chicken_momos.jpg',
    description: 'Steamed or fried chicken dumplings with spiced poultry filling.'
  },
  {
    sku: 'RAIS-CHK-05',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'ITC Chicken Nuggets',
    brand: 'ITC Master Chef',
    pack: '1 kg Packet',
    hsn: '1602',
    image: '/images/products/itc_chicken_nuggets.webp',
    isFeatured: true,
    description: 'Minced poultry nuggets in golden tempura-style breading.'
  },
  {
    sku: 'RAIS-CHK-06',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Nutrich Chicken Burger Patty',
    brand: 'Nutrich',
    pack: '1 kg Packet',
    hsn: '1602',
    image: '/images/products/itc_chicken_patty.webp',
    isFeatured: true,
    description: 'Seasoned commercial chicken patties calibrated for hamburger buns.'
  },
  {
    sku: 'RAIS-CHK-07',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Signature Tortillah 10 Inches',
    brand: 'Signature',
    pack: '1 Packet (10 Nos)',
    hsn: '1905',
    image: '/images/products/tortilla_wraps.jpg',
    description: 'Large 10-inch tortillas designed for jumbo burritos and commercial rolls.'
  },
  {
    sku: 'RAIS-CHK-08',
    categoryCode: 'CHICKEN',
    categoryName: 'Chicken Items',
    name: 'Crispy Chicken Fingers',
    brand: 'Venky\'s',
    pack: '1 kg Packet',
    hsn: '1602',
    image: '/images/products/itc_chicken_fingers.webp',
    description: 'Whole chicken tender finger strips with herb breading.'
  },

  // ==========================================
  // 2. Veg Items (16 SKUs)
  // ==========================================
  {
    sku: 'RAIS-VEG-01',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Hup Hup French Fries 9mm',
    brand: 'Hup Hup',
    pack: '2.5 kg Packet',
    hsn: '2004',
    image: '/images/products/itc_french_fries.webp',
    isFeatured: true,
    description: 'Straight-cut 9mm potato fries for restaurant deep fryers.'
  },
  {
    sku: 'RAIS-VEG-02',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Hup Hup French Fries 6mm (Shoestring)',
    brand: 'Hup Hup',
    pack: '2.5 kg Packet',
    hsn: '2004',
    image: '/images/products/french_fries_basket.jpg',
    description: 'Thin 6mm shoestring cut fries with quick preparation time.'
  },
  {
    sku: 'RAIS-VEG-03',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'I.T.C Veg Momos',
    brand: 'ITC Master Chef',
    pack: '1 Packet (500g)',
    hsn: '1902',
    image: '/images/products/veg_momos.jpg',
    isFeatured: true,
    description: 'Cabbage, carrot, and onion stuffed dumplings for steaming or frying.'
  },
  {
    sku: 'RAIS-VEG-04',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Chilli Fill Veg Burger Patty',
    brand: 'Chilli Fill',
    pack: '1.2 kg Packet',
    hsn: '2004',
    image: '/images/products/mccain_veggie_burger_patty.webp',
    description: 'Herb-seasoned mixed vegetable patty for burgers and sandwiches.'
  },
  {
    sku: 'RAIS-VEG-05',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'ITC Paneer Patty',
    brand: 'ITC Master Chef',
    pack: '1.02 kg Packet',
    hsn: '0406',
    image: '/images/products/paneer_pops.png',
    description: 'Cottage cheese patty in crisp breadcrumbs for café menus.'
  },
  {
    sku: 'RAIS-VEG-06',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Godrej Paneer Pops',
    brand: 'Godrej',
    pack: '1 kg Packet',
    hsn: '0406',
    image: '/images/products/paneer_pops.png',
    description: 'Diced paneer poppers coated in seasoned crunchy batter.'
  },
  {
    sku: 'RAIS-VEG-07',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'ITC Cheesy Corn Triangle',
    brand: 'ITC Master Chef',
    pack: '1 kg Packet',
    hsn: '2004',
    image: '/images/products/itc_cheesy_corn_triangles.webp',
    isFeatured: true,
    description: 'Mozzarella and sweet American corn enclosed in crisp triangular crust.'
  },
  {
    sku: 'RAIS-VEG-08',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Sweet Corn Frozen Kernels',
    brand: 'RAIS Fresh',
    pack: '1 kg Packet',
    hsn: '0710',
    image: '/images/products/sweet_corn.jpg',
    description: 'Individually Quick Frozen (IQF) sweet corn kernels.'
  },
  {
    sku: 'RAIS-VEG-09',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Godrej Tandoori Paneer Nuggets',
    brand: 'Godrej',
    pack: '1 kg Packet',
    hsn: '0406',
    image: '/images/products/paneer_pops.png',
    description: 'Tandoori spiced paneer cubes in crunchy crumb coating.'
  },
  {
    sku: 'RAIS-VEG-10',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Amul French Fries 6mm',
    brand: 'Amul',
    pack: '2.5 kg Packet',
    hsn: '2004',
    image: '/images/products/french_fries_basket.jpg',
    description: 'Commercial grade potato fries produced by Amul processing.'
  },
  {
    sku: 'RAIS-VEG-11',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'McCain Smiles Potato Faces',
    brand: 'McCain',
    pack: '1.5 kg Packet',
    hsn: '2004',
    image: '/images/products/mccain_smiles.png',
    isFeatured: true,
    description: 'Smiley-face seasoned mashed potato shapes for quick-service menus.'
  },
  {
    sku: 'RAIS-VEG-12',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'ITC Crispy Veg Burger Patty',
    brand: 'ITC Master Chef',
    pack: '1 kg Packet',
    hsn: '2004',
    image: '/images/products/itc_veg_burger_patty.webp',
    description: 'Vegetable blend patty with potatoes, peas, and green herbs.'
  },
  {
    sku: 'RAIS-VEG-13',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Crispy Veg Spring Rolls',
    brand: 'ITC Master Chef',
    pack: '1 Packet (10 Nos)',
    hsn: '2106',
    image: '/images/products/itc_veggie_pizza_pocket.webp',
    description: 'Pastry rolls filled with seasoned shredded vegetables.'
  },
  {
    sku: 'RAIS-VEG-14',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Crunchy Veggie Balls',
    brand: 'McCain',
    pack: '1 kg Packet',
    hsn: '2004',
    image: '/images/products/mccain_veggie_nuggets.png',
    description: 'Vegetable spheres crafted for quick appetizers and Manchurian dishes.'
  },
  {
    sku: 'RAIS-VEG-15',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Pizza Base 8 Inch Par-Baked',
    brand: 'Fresh Bakery',
    pack: '1 Packet (2 Nos)',
    hsn: '1905',
    image: '/images/products/pizza_base.jpg',
    description: 'Pre-fermented stone-baked thin crust pizza bases for deck ovens.'
  },
  {
    sku: 'RAIS-VEG-16',
    categoryCode: 'VEG',
    categoryName: 'Veg Items',
    name: 'Pizza Base 9 Inch Par-Baked',
    brand: 'Fresh Bakery',
    pack: '1 Packet (2 Nos)',
    hsn: '1905',
    image: '/images/products/pizza_base.jpg',
    description: 'Standard 9-inch medium pizza crusts for commercial kitchens.'
  },

  // ==========================================
  // 3. Ketchup & Sauces (12 SKUs)
  // ==========================================
  {
    sku: 'RAIS-SAU-01',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Tomato Ketchup 1.1kg',
    brand: 'Del Monte',
    pack: '1 Packet (1.1kg)',
    hsn: '2103',
    image: '/images/products/delmonte_tomato_ketchup.png',
    isFeatured: true,
    description: 'Tangy tomato ketchup for commercial dispenser squeeze bottles.'
  },
  {
    sku: 'RAIS-SAU-02',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Tomato Ketchup 1kg',
    brand: 'Foodrite',
    pack: '1 kg Packet',
    hsn: '2103',
    image: '/images/products/foodrite_tomato_ketchup.jpg',
    description: 'Commercial grade tomato ketchup tailored for fast-food operations.'
  },
  {
    sku: 'RAIS-SAU-03',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Ketchup (8g Sachets)',
    brand: 'Del Monte',
    pack: '1 Packet (100 Sachets)',
    hsn: '2103',
    image: '/images/products/delmonte_ketchup_sachet.png',
    description: 'Single-serve portion control tomato ketchup sachets for takeaway packs.'
  },
  {
    sku: 'RAIS-SAU-04',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Tandoori Mayo',
    brand: 'Del Monte',
    pack: '1 kg Packet',
    hsn: '2103',
    image: '/images/products/delmonte_tandoori_mayo.png',
    isFeatured: true,
    description: 'Tandoori spiced mayonnaise for rolls, burgers, and dipping.'
  },
  {
    sku: 'RAIS-SAU-05',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Creamy Cheese Sauce',
    brand: 'Del Monte',
    pack: '1 kg Packet',
    hsn: '2103',
    image: '/images/gourmet_sauces.jpg',
    description: 'Smooth pouring cheese sauce for nachos, loaded fries and burgers.'
  },
  {
    sku: 'RAIS-SAU-06',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte Pizza Pasta Sauce',
    brand: 'Del Monte',
    pack: '1 kg Packet',
    hsn: '2103',
    image: '/images/products/delmonte_pizza_pasta_sauce.png',
    description: 'Seasoned tomato herb paste for pizza bases and pasta prep.'
  },
  {
    sku: 'RAIS-SAU-07',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Mayank Gold Ketchup (9g Sachets)',
    brand: 'Mayank Gold',
    pack: '1 Packet',
    hsn: '2103',
    image: '/images/products/delmonte_ketchup_sachet.png',
    description: 'Single-serve tomato ketchup sachets for parcels and deliveries.'
  },
  {
    sku: 'RAIS-SAU-08',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Salad Mayonnaise 1kg',
    brand: 'Foodrite',
    pack: '1 kg Packet',
    hsn: '2103',
    image: '/images/products/foodrite_mayonnaise.jpg',
    isFeatured: true,
    description: 'Eggless white mayonnaise formulated for sandwiches and rolls.'
  },
  {
    sku: 'RAIS-SAU-09',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Mayonnaise (8g Sachets)',
    brand: 'Foodrite',
    pack: '1 Packet',
    hsn: '2103',
    image: '/images/products/foodrite_mayonnaise.jpg',
    description: 'Single-use mayonnaise sachets for delivery parcel inserts.'
  },
  {
    sku: 'RAIS-SAU-10',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Del Monte BBQ Barbecue Sauce 1kg',
    brand: 'Del Monte',
    pack: '1 kg Packet',
    hsn: '2103',
    image: '/images/products/delmonte_bbq_sauce.png',
    description: 'Smoky barbecue sauce for grilled chicken, burgers and wings.'
  },
  {
    sku: 'RAIS-SAU-11',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Bulk Tomato Ketchup 5kg',
    brand: 'Foodrite',
    pack: '5 kg Dispenser Can',
    hsn: '2103',
    image: '/images/products/foodrite_tomato_ketchup.jpg',
    description: 'Large volume bulk ketchup container for high-throughput restaurant kitchens.'
  },
  {
    sku: 'RAIS-SAU-12',
    categoryCode: 'SAUCES',
    categoryName: 'Ketchup & Sauces',
    name: 'Foodrite Sweet Chilli Garlic Dip',
    brand: 'Foodrite',
    pack: '1 kg Bottle',
    hsn: '2103',
    image: '/images/gourmet_sauces.jpg',
    description: 'Sweet garlic dip sauce for momos, spring rolls, and nuggets.'
  },

  // ==========================================
  // 4. Bread Mix & Powders (5 SKUs)
  // ==========================================
  {
    sku: 'RAIS-BRD-01',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'VKL Extra Hot & Spicy Marinade',
    brand: 'VKL',
    pack: '1 kg Packet',
    hsn: '2103',
    image: '/images/products/chilli_powder.jpg',
    isFeatured: true,
    description: 'Seasoning marinade blend for commercial fried chicken.'
  },
  {
    sku: 'RAIS-BRD-02',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'VKL Crispy Cajun Breading Mix',
    brand: 'VKL',
    pack: '1 kg Packet',
    hsn: '1901',
    image: '/images/products/spices_blend.jpg',
    isFeatured: true,
    description: 'Flour breader mix producing crisp ripple crusts on fried foods.'
  },
  {
    sku: 'RAIS-BRD-03',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'VKL Peri Peri Sprinkler Powder',
    brand: 'VKL',
    pack: '250 g Packet',
    hsn: '0910',
    image: '/images/products/chilli_powder.jpg',
    description: 'Zesty chilli seasoning sprinkler for shaker fries and popcorn.'
  },
  {
    sku: 'RAIS-BRD-04',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'Oregano Mediterranean Herb Seasoning',
    brand: 'RAIS Select',
    pack: '1 kg Packet',
    hsn: '1211',
    image: '/images/products/spices_blend.jpg',
    isFeatured: true,
    description: 'Crushed oregano herb blend for pizza and pasta finishing.'
  },
  {
    sku: 'RAIS-BRD-05',
    categoryCode: 'BREADING',
    categoryName: 'Bread Mix & Powders',
    name: 'VKL Crushed Chilli Flakes Premium',
    brand: 'VKL',
    pack: '500 g Packet',
    hsn: '0904',
    image: '/images/products/chilli_powder.jpg',
    description: 'Dried crushed red pepper flakes with seeds for pizza condiments.'
  },

  // ==========================================
  // 5. Cheese & Slices (6 SKUs)
  // ==========================================
  {
    sku: 'RAIS-CHS-01',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Mozzarella Diced Cheese (2kg)',
    brand: 'Milky Mist',
    pack: '2 kg Packet',
    hsn: '0406',
    image: '/images/mozzarella_cheese.jpg',
    isFeatured: true,
    description: 'Pre-diced mozzarella cheese delivering stretch and browning on pizzas.'
  },
  {
    sku: 'RAIS-CHS-02',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Mozzarella Diced Cheese (1kg)',
    brand: 'Milky Mist',
    pack: '1 kg Packet',
    hsn: '0406',
    image: '/images/mozzarella_cheese.jpg',
    description: '1kg catering pack of free-flowing diced mozzarella cheese.'
  },
  {
    sku: 'RAIS-CHS-03',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Processed Cheese Slices',
    brand: 'Milky Mist',
    pack: '765 g Packet (48 Slices)',
    hsn: '0406',
    image: '/images/mozzarella_cheese.jpg',
    isFeatured: true,
    description: 'Wrapped melting cheese slices tailored for burgers and sandwiches.'
  },
  {
    sku: 'RAIS-CHS-04',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Fresh Paneer Diced Cubes',
    brand: 'Milky Mist',
    pack: '1 kg Packet',
    hsn: '0406',
    image: '/images/mozzarella_cheese.jpg',
    description: 'Diced fresh paneer cubes ready for curries, pizzas, and starters.'
  },
  {
    sku: 'RAIS-CHS-05',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Nutrilite Commercial Table Butter',
    brand: 'Nutrilite',
    pack: '500 g Pack',
    hsn: '0405',
    image: '/images/mozzarella_cheese.jpg',
    description: 'Salted commercial butter for toasting buns and kitchen cooking.'
  },
  {
    sku: 'RAIS-CHS-06',
    categoryCode: 'CHEESE',
    categoryName: 'Cheese & Slices',
    name: 'Milky Mist Processed Cheese Diced',
    brand: 'Milky Mist',
    pack: '1 kg Packet',
    hsn: '0406',
    image: '/images/mozzarella_cheese.jpg',
    description: 'Melting processed cheese blend for garlic bread and sandwiches.'
  },

  // ==========================================
  // 6. Pizza & Burger Boxes (9 SKUs)
  // ==========================================
  {
    sku: 'RAIS-BOX-01',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Pizza Box 8"x8" Plain Kraft',
    brand: 'Packaging Solutions',
    pack: '100 Nos',
    hsn: '4819',
    image: '/images/products/kraft_pizza_box.jpg',
    isFeatured: true,
    description: 'Corrugated Kraft fluted cardboard box preserving pizza temperature.'
  },
  {
    sku: 'RAIS-BOX-02',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Burger Box 4"x4" Plain Kraft',
    brand: 'Packaging Solutions',
    pack: '100 Nos',
    hsn: '4819',
    image: '/images/products/kraft_burger_box.jpg',
    description: 'Single burger clamshell container preventing food crushing in delivery.'
  },
  {
    sku: 'RAIS-BOX-03',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Pizza Box 8"x8" Printed Laminated',
    brand: 'Packaging Solutions',
    pack: '100 Nos',
    hsn: '4819',
    image: '/images/products/kraft_pizza_box.jpg',
    isFeatured: true,
    description: 'Printed pizza packaging box with internal greaseproof lining.'
  },
  {
    sku: 'RAIS-BOX-04',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Burger Box 4"x4" Printed Gloss',
    brand: 'Packaging Solutions',
    pack: '100 Nos',
    hsn: '4819',
    image: '/images/products/kraft_burger_box.jpg',
    description: 'Printed graphic burger box for restaurant delivery and takeaway.'
  },
  {
    sku: 'RAIS-BOX-05',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Burger Box 5"x5" Printed (Large)',
    brand: 'Packaging Solutions',
    pack: '100 Nos',
    hsn: '4819',
    image: '/images/products/kraft_burger_box.jpg',
    description: 'Large burger container for double patty stackers and loaded burgers.'
  },
  {
    sku: 'RAIS-BOX-06',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Pizza Box 9"x9" Plain Kraft',
    brand: 'Packaging Solutions',
    pack: '100 Nos',
    hsn: '4819',
    image: '/images/products/kraft_pizza_box.jpg',
    description: 'Medium 9-inch corrugated takeaway pizza box.'
  },
  {
    sku: 'RAIS-BOX-07',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Fried Chicken Bucket with Lid',
    brand: 'Packaging Solutions',
    pack: '100 Nos',
    hsn: '4819',
    image: '/images/products/chicken_bucket.jpg',
    description: 'Round greaseproof paper bucket with lid for crispy fried chicken.'
  },
  {
    sku: 'RAIS-BOX-08',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Mayonnaise Portion Cups 35mm with Lids',
    brand: 'Packaging Solutions',
    pack: '500 Nos',
    hsn: '3923',
    image: '/images/products/kraft_burger_box.jpg',
    description: 'Clear portion cups with lids for dips, garlic sauce, and mayo.'
  },
  {
    sku: 'RAIS-BOX-09',
    categoryCode: 'PACKAGING',
    categoryName: 'Pizza & Burger Boxes',
    name: 'Commercial Table Tissue Paper Pack',
    brand: 'Packaging Solutions',
    pack: '1000 Sheets Pack',
    hsn: '4818',
    image: '/images/products/kraft_pizza_box.jpg',
    description: 'Embossed table napkins for restaurant dining tables.'
  },

  // ==========================================
  // 7. Spices (5 SKUs)
  // ==========================================
  {
    sku: 'RAIS-SPC-01',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Chilly Powder No. 1 (Pickle Grade)',
    brand: 'RAIS Spices',
    pack: '1 kg Packet',
    hsn: '0904',
    image: '/images/products/chilli_powder.jpg',
    isFeatured: true,
    description: 'Natural red spice ground from selected Andhra chillies.'
  },
  {
    sku: 'RAIS-SPC-02',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Chilly Powder Regular Commercial',
    brand: 'RAIS Spices',
    pack: '1 kg Packet',
    hsn: '0904',
    image: '/images/products/chilli_powder.jpg',
    description: 'Hot commercial chilli powder for kitchen gravies and batters.'
  },
  {
    sku: 'RAIS-SPC-03',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Turmeric Powder (Pure)',
    brand: 'RAIS Spices',
    pack: '1 kg Packet',
    hsn: '0910',
    image: '/images/products/turmeric_powder.jpg',
    description: 'Golden turmeric powder without artificial colouring agents.'
  },
  {
    sku: 'RAIS-SPC-04',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Coriander Powder (Dhania)',
    brand: 'RAIS Spices',
    pack: '1 kg Packet',
    hsn: '0909',
    image: '/images/products/spices_blend.jpg',
    description: 'Freshly milled roasted coriander seeds offering earthy aroma.'
  },
  {
    sku: 'RAIS-SPC-05',
    categoryCode: 'SPICES',
    categoryName: 'Culinary Spices',
    name: 'Commercial Cumin Powder (Jeera)',
    brand: 'RAIS Spices',
    pack: '1 kg Packet',
    hsn: '0909',
    image: '/images/products/spices_blend.jpg',
    description: 'Roasted cumin powder for North and South Indian cooking.'
  },

  // ==========================================
  // 8. Mojitos & Syrups (3 SKUs)
  // ==========================================
  {
    sku: 'RAIS-MOJ-01',
    categoryCode: 'MOJITOS',
    categoryName: 'Mojitos & Syrups',
    name: 'Lime and Mint Mojito Syrup',
    brand: 'RAIS Beverages',
    pack: '1 Bottle (750ml)',
    hsn: '2106',
    image: '/images/products/mojito_lime_mint.jpg',
    isFeatured: true,
    description: 'Citrus lime and garden mint concentrated syrup for beverages.'
  },
  {
    sku: 'RAIS-MOJ-02',
    categoryCode: 'MOJITOS',
    categoryName: 'Mojitos & Syrups',
    name: 'Bluecurco (Blue Curaçao Syrup)',
    brand: 'RAIS Beverages',
    pack: '1 Bottle (750ml)',
    hsn: '2106',
    image: '/images/products/mojito_blue_curacao.jpg',
    isFeatured: true,
    description: 'Cobalt blue citrus mocktail syrup for café coolers.'
  },
  {
    sku: 'RAIS-MOJ-03',
    categoryCode: 'MOJITOS',
    categoryName: 'Mojitos & Syrups',
    name: 'Strawberry Mojito Fruit Crush',
    brand: 'RAIS Beverages',
    pack: '1 Bottle (750ml)',
    hsn: '2106',
    image: '/images/products/mojito_lime_mint.jpg',
    description: 'Strawberry beverage base syrup for milkshakes and cold drinks.'
  }
];

export const BUSINESS_INFO = {
  name: 'RAIS AGENCIES',
  tagline: 'Wholesale Frozen Food Products & Packaging Solutions',
  subtagline: 'FROZEN FOOD PRODUCTS',
  address: 'Near Reddies Colony, Rayachoty - 516269, Annamayya District, Andhra Pradesh, India',
  phones: ['9347453135', '9573261696'],
  primaryPhone: '9347453135',
  whatsappNumber: '919347453135',
  upiId: '9347453135@ybl',
  partnerBrands: [
    'McCain',
    'ITC Master Chef',
    'Milky Mist',
    'Del Monte',
    'Venky\'s',
    'Godrej',
    'VKL Seasonings',
    'Foodrite',
    'Hup Hup',
    'Signature',
    'Nutrich',
    'Amul',
    'Fresh Bakery',
    'Packaging Solutions'
  ]
};
