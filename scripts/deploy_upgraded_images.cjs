const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const filesToCopy = [
  // Momos
  {
    src: path.join(ARTIFACT_DIR, 'chicken_momos_1792222747248.jpg'),
    dests: [
      path.join(PUBLIC_DIR, 'images/products/chicken_momos.jpg'),
      path.join(PUBLIC_DIR, 'images/products/veg_momos.jpg'),
      path.join(PUBLIC_DIR, 'images/products/momos_steamed.jpg')
    ]
  },
  // Burger Boxes
  {
    src: path.join(ARTIFACT_DIR, 'kraft_burger_box_1792222744560.jpg'),
    dests: [
      path.join(PUBLIC_DIR, 'images/products/kraft_burger_box.jpg'),
      path.join(PUBLIC_DIR, 'images/burger_boxes.jpg')
    ]
  },
  // Pizza Boxes
  {
    src: path.join(ARTIFACT_DIR, 'kraft_pizza_box_stacked_1792222767512.jpg'),
    dests: [
      path.join(PUBLIC_DIR, 'images/products/kraft_pizza_box.jpg')
    ]
  },
  // French Fries
  {
    src: path.join(ARTIFACT_DIR, 'french_fries_basket_1792222742237.jpg'),
    dests: [
      path.join(PUBLIC_DIR, 'images/products/french_fries_basket.jpg'),
      path.join(PUBLIC_DIR, 'images/french_fries.jpg')
    ]
  },
  // Chicken Nuggets
  {
    src: path.join(ARTIFACT_DIR, 'chicken_nuggets_1792222746605.jpg'),
    dests: [
      path.join(PUBLIC_DIR, 'images/products/chicken_nuggets.jpg'),
      path.join(PUBLIC_DIR, 'images/chicken_nuggets.jpg')
    ]
  }
];

filesToCopy.forEach(item => {
  if (fs.existsSync(item.src)) {
    item.dests.forEach(dest => {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(item.src, dest);
      console.log(`Copied ${path.basename(item.src)} -> ${dest.replace(PUBLIC_DIR, 'public')}`);
    });
  } else {
    console.error(`Source missing: ${item.src}`);
  }
});

console.log('Finished deploying upgraded commercial product images!');
