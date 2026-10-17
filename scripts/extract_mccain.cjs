const https = require('https');

const options = {
  hostname: 'www.mccainindia.com',
  path: '/products/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('McCain status:', res.statusCode);
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    const images = [];
    while ((match = regex.exec(data)) !== null) {
      images.push(match[1]);
    }
    console.log('McCain images:', images.filter(i => i.includes('products') || i.includes('media') || i.includes('upload')));
  });
}).on('error', err => console.error('McCain error:', err.message));
