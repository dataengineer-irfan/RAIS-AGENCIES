const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\affra\\Documents\\RAIS_WEBAPP\\RAIS_Antigravity_Website_Starter\\rais-website\\public\\images\\products';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const itcImages = [
  { url: 'https://itcmasterchef.com/static/img/products/crunchy-chicken-nuggets.webp', file: 'itc_chicken_nuggets.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/chicken-popcorn.webp', file: 'itc_chicken_popcorn.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/desi-style-chicken-burger-patty.webp', file: 'itc_chicken_patty.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/crispy-chicken-fries.webp', file: 'itc_chicken_fingers.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/cheesy-corn-triangles.webp', file: 'itc_cheesy_corn_triangles.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/veg-burger-patty.webp', file: 'itc_veg_burger_patty.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/crispy-french-fries.webp', file: 'itc_french_fries.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/chilli-garlic-potato-shots.webp', file: 'itc_potato_shots.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/cheese-jalapeno-nuggets.webp', file: 'itc_cheese_jalapeno_nuggets.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/crispy-cheese-fills.webp', file: 'itc_crispy_cheese_fills.webp' },
  { url: 'https://itcmasterchef.com/static/img/products/veggie-pizza-pocket.webp', file: 'itc_veggie_pizza_pocket.webp' }
];

async function downloadOne(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(targetDir, item.file);
    const fileStream = fs.createWriteStream(dest);
    https.get(item.url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed ${item.url}: Status ${response.statusCode}`);
        resolve(false);
        return;
      }
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Saved: ${item.file} (${fs.statSync(dest).size} bytes)`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.error(`Error ${item.url}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Downloading official ITC Master Chef product images...');
  for (const item of itcImages) {
    await downloadOne(item);
  }
  console.log('Done downloading ITC images!');
}

run();
