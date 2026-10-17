const fs = require('fs');

const imageMap = {
  // Chicken (8)
  'RAIS-CHK-01': '/images/products/tortilla_wraps.jpg',
  'RAIS-CHK-02': '/images/products/tortilla_wraps.jpg',
  'RAIS-CHK-03': '/images/products/itc_chicken_popcorn.webp',
  'RAIS-CHK-04': '/images/chicken_patty.jpg',
  'RAIS-CHK-05': '/images/products/itc_chicken_nuggets.webp',
  'RAIS-CHK-06': '/images/products/itc_chicken_patty.webp',
  'RAIS-CHK-07': '/images/products/tortilla_wraps.jpg',
  'RAIS-CHK-08': '/images/products/itc_chicken_fingers.webp',

  // Veg (16)
  'RAIS-VEG-01': '/images/products/itc_french_fries.webp',
  'RAIS-VEG-02': '/images/products/french_fries_basket.jpg',
  'RAIS-VEG-03': '/images/cheesy_triangle.jpg',
  'RAIS-VEG-04': '/images/products/mccain_veggie_burger_patty.webp',
  'RAIS-VEG-05': '/images/products/paneer_pops.png',
  'RAIS-VEG-06': '/images/products/paneer_pops.png',
  'RAIS-VEG-07': '/images/products/itc_cheesy_corn_triangles.webp',
  'RAIS-VEG-08': '/images/products/sweet_corn.jpg',
  'RAIS-VEG-09': '/images/products/paneer_pops.png',
  'RAIS-VEG-10': '/images/products/french_fries_basket.jpg',
  'RAIS-VEG-11': '/images/products/mccain_smiles.png',
  'RAIS-VEG-12': '/images/products/itc_veg_burger_patty.webp',
  'RAIS-VEG-13': '/images/products/itc_veggie_pizza_pocket.webp',
  'RAIS-VEG-14': '/images/products/mccain_veggie_nuggets.png',
  'RAIS-VEG-15': '/images/products/pizza_base.jpg',
  'RAIS-VEG-16': '/images/products/pizza_base.jpg',

  // Sauces (12)
  'RAIS-SAU-01': '/images/products/delmonte_tomato_ketchup.png',
  'RAIS-SAU-02': '/images/products/foodrite_tomato_ketchup.jpg',
  'RAIS-SAU-03': '/images/products/delmonte_ketchup_sachet.png',
  'RAIS-SAU-04': '/images/products/delmonte_tandoori_mayo.png',
  'RAIS-SAU-05': '/images/gourmet_sauces.jpg',
  'RAIS-SAU-06': '/images/products/delmonte_pizza_pasta_sauce.png',
  'RAIS-SAU-07': '/images/products/delmonte_ketchup_sachet.png',
  'RAIS-SAU-08': '/images/products/foodrite_mayonnaise.jpg',
  'RAIS-SAU-09': '/images/products/foodrite_mayonnaise.jpg',
  'RAIS-SAU-10': '/images/products/delmonte_bbq_sauce.png',
  'RAIS-SAU-11': '/images/products/foodrite_tomato_ketchup.jpg',
  'RAIS-SAU-12': '/images/gourmet_sauces.jpg',

  // Breading (5)
  'RAIS-BRD-01': '/images/products/chilli_powder.jpg',
  'RAIS-BRD-02': '/images/products/spices_blend.jpg',
  'RAIS-BRD-03': '/images/products/chilli_powder.jpg',
  'RAIS-BRD-04': '/images/products/spices_blend.jpg',
  'RAIS-BRD-05': '/images/products/chilli_powder.jpg',

  // Cheese (6)
  'RAIS-CHS-01': '/images/mozzarella_cheese.jpg',
  'RAIS-CHS-02': '/images/mozzarella_cheese.jpg',
  'RAIS-CHS-03': '/images/mozzarella_cheese.jpg',
  'RAIS-CHS-04': '/images/mozzarella_cheese.jpg',
  'RAIS-CHS-05': '/images/mozzarella_cheese.jpg',
  'RAIS-CHS-06': '/images/mozzarella_cheese.jpg',

  // Packaging (9)
  'RAIS-BOX-01': '/images/products/kraft_pizza_box.jpg',
  'RAIS-BOX-02': '/images/products/kraft_burger_box.jpg',
  'RAIS-BOX-03': '/images/products/kraft_pizza_box.jpg',
  'RAIS-BOX-04': '/images/products/kraft_burger_box.jpg',
  'RAIS-BOX-05': '/images/products/kraft_burger_box.jpg',
  'RAIS-BOX-06': '/images/products/kraft_pizza_box.jpg',
  'RAIS-BOX-07': '/images/products/chicken_bucket.jpg',
  'RAIS-BOX-08': '/images/products/kraft_burger_box.jpg',
  'RAIS-BOX-09': '/images/products/kraft_pizza_box.jpg',

  // Spices (5)
  'RAIS-SPC-01': '/images/products/chilli_powder.jpg',
  'RAIS-SPC-02': '/images/products/chilli_powder.jpg',
  'RAIS-SPC-03': '/images/products/turmeric_powder.jpg',
  'RAIS-SPC-04': '/images/products/spices_blend.jpg',
  'RAIS-SPC-05': '/images/products/spices_blend.jpg',

  // Mojitos (3)
  'RAIS-MOJ-01': '/images/products/mojito_lime_mint.jpg',
  'RAIS-MOJ-02': '/images/products/mojito_blue_curacao.jpg',
  'RAIS-MOJ-03': '/images/products/mojito_lime_mint.jpg'
};

let content = fs.readFileSync('src/data/catalogue.ts', 'utf8');

// For each SKU, ensure it has image: '...'
for (const [sku, imgPath] of Object.entries(imageMap)) {
  // Check if SKU exists
  const skuRegex = new RegExp(`(sku:\\s*'${sku}'[\\s\\S]*?)(hsn:\\s*'[^']+',?)(?:\\s*image:\\s*'[^']+',?(?:\\s*//[^\\n]*)?)?`, 'g');
  content = content.replace(skuRegex, (match, p1, p2) => {
    return `${p1}${p2}\n    image: '${imgPath}',`;
  });
}

fs.writeFileSync('src/data/catalogue.ts', content, 'utf8');
console.log('Successfully updated catalogue.ts with all 64 image paths!');
