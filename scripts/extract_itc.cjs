const https = require('https');
const fs = require('fs');

https.get('https://itcmasterchef.com/products/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    const images = [];
    while ((match = regex.exec(data)) !== null) {
      images.push(match[1]);
    }
    console.log('Total images found on ITC products page:', images.length);
    const productImgs = images.filter(img => img.includes('products') || img.includes('uploads') || img.includes('wp-content'));
    console.log(JSON.stringify(productImgs, null, 2));
  });
}).on('error', err => console.error(err));
