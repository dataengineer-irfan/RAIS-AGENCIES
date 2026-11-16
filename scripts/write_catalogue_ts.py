import json

with open('scripts/formatted_66_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

ts_content = """import { assetUrl } from '../utils/assetUrl';

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
"""

for p in products:
    is_feat_str = f"\n    isFeatured: true," if p.get('isFeatured') else ""
    ts_content += f"""  {{
    sku: '{p["sku"]}',
    categoryCode: '{p["categoryCode"]}',
    categoryName: '{p["categoryName"]}',
    name: '{p["name"].replace("'", "\\'")}',
    brand: '{p["brand"].replace("'", "\\'")}',
    pack: '{p["pack"].replace("'", "\\'")}',
    hsn: '{p["hsn"]}',
    image: '{p["image"]}',{is_feat_str}
    description: '{p["description"].replace("'", "\\'")}'
  }},
"""

ts_content += """
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
"""

with open('src/data/catalogue.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f'Successfully wrote src/data/catalogue.ts with {len(products)} products!')
