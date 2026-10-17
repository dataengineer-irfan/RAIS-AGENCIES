const https = require('https');

const options = {
  hostname: 'www.madewithdelmonte.in',
  path: '/product/sauces-dips-and-spreads',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Del Monte status:', res.statusCode);
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    const images = [];
    while ((match = regex.exec(data)) !== null) {
      images.push(match[1]);
    }
    console.log('Del Monte images:', images.filter(i => i.includes('upload') || i.includes('product') || i.includes('media')));
  });
}).on('error', err => console.error('Del Monte error:', err.message));
