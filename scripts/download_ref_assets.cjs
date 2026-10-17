const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'images', 'ref-assets');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const ASSETS = {
  // Category plinth headers
  'cat_chicken_ice.png': 'https://hercules-cdn.com/file_AQfRXARzDJnyrwE7bhTpAlHE',
  'cat_veg_ice.png': 'https://hercules-cdn.com/file_qFnf0WjCWt2YUdhuAyzMIbBG',
  'cat_sauces_ice.png': 'https://hercules-cdn.com/file_RhBaPwqJc1gkOQImSm5fm17w',
  'cat_breadmix_ice.png': 'https://hercules-cdn.com/file_dZ9QwZYO1GKVU6zgT7L8xGAx',
  'cat_cheese_ice.png': 'https://hercules-cdn.com/file_ICLhCB9thOkhPvJ7GKtzTKLm',
  'cat_spices_ice.png': 'https://hercules-cdn.com/file_afBIqj3PIp858gx31Y7ndJkT',
  'cat_packaging_ice.png': 'https://hercules-cdn.com/file_y9q7Z61Xbx4Fi0etQDHkMjFY',
  'cat_mojitos_ice.png': 'https://hercules-cdn.com/file_qaxNAk22GGrmlsVr6KKJ7D1e',

  // Hero cutout food items
  'hero_burger_stack.png': 'https://hercules-cdn.com/file_3v7dX8FijUSUzBsB1riU0d13',
  'hero_fries_cutout.png': 'https://hercules-cdn.com/file_f4PyJ279tvi9zCtae7w90QAo',
  'hero_popcorn_cutout.png': 'https://hercules-cdn.com/file_SwXS6aUtj6fKZRHTkNItGGhJ',
  'hero_cheese_cutout.png': 'https://hercules-cdn.com/file_AFVXa2s1XzHMRCuTZRT7wVW5',
  'hero_momos_cutout.png': 'https://hercules-cdn.com/file_JMBvY94j1XXjYSm8J7YmO12t',
  'hero_butter_cutout.png': 'https://hercules-cdn.com/file_lO9SoFLf2UbD8QURFUrLorVN',
  'rais_logo_icon.png': 'https://hercules-cdn.com/file_0QcwGMamu6jl6CT1NRADF7eQ'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        console.log(`Saved ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', reject);
  });
}

(async () => {
  for (const [name, url] of Object.entries(ASSETS)) {
    const dest = path.join(TARGET_DIR, name);
    try {
      await download(url, dest);
    } catch(e) {
      console.error(`Failed ${name}:`, e.message);
    }
  }
  console.log('All reference assets saved to public/images/ref-assets/');
})();
