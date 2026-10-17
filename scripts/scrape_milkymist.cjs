const https = require('https');

function checkMilkymist(path) {
  const options = {
    hostname: 'www.milkymist.com',
    path: path,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  };
  https.get(options, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const regex = /<img[^>]+src=["']([^"']+)["']/gi;
      let m;
      const imgs = [];
      while ((m = regex.exec(data)) !== null) {
        if (m[1].includes('cdn') || m[1].includes('product') || m[1].includes('upload')) {
          imgs.push(m[1]);
        }
      }
      console.log('Milky Mist ' + path + ':', imgs.slice(0, 10));
    });
  }).on('error', e => console.error(e.message));
}

checkMilkymist('/cheese');
checkMilkymist('/paneer');
