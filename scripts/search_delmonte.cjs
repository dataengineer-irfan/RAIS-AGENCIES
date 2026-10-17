const https = require('https');

function fetchPage(path) {
  const options = {
    hostname: 'www.madewithdelmonte.in',
    path: path,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  };
  https.get(options, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const matches = data.match(/https?:\/\/[^\s"'<>]+\.(?:png|jpg|webp)/gi) || [];
      const filtered = [...new Set(matches)].filter(u => u.includes('upload'));
      console.log('Path: ' + path);
      console.log(filtered);
    });
  });
}

fetchPage('/product/sauces-dips-and-spreads/mayonnaise');
fetchPage('/product/sauces-dips-and-spreads/tandoori-mayo');
