const https = require('https');
const fs = require('fs');

https.get('https://www.madewithdelmonte.in/product/sauces-dips-and-spreads/del-monte-tandoori-mayo', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const m = data.match(/https?:\/\/[^\s"'<>]+\.(?:png|jpg|webp)/gi) || [];
    const uploadImages = [...new Set(m)].filter(u => u.includes('upload'));
    console.log('Tandoori mayo images:', uploadImages);
    if (uploadImages.length > 0) {
      const file = fs.createWriteStream('public/images/products/delmonte_tandoori_mayo.png');
      https.get(uploadImages[0], r => {
        r.pipe(file);
        file.on('finish', () => console.log('Downloaded delmonte_tandoori_mayo.png'));
      });
    }
  });
});
