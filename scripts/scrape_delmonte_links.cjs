const https = require('https');

const options = {
  hostname: 'www.madewithdelmonte.in',
  path: '/product/sauces-dips-and-spreads',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

https.get(options, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const regex = /href=["'](https?:\/\/www\.madewithdelmonte\.in\/product\/[^"']+)["']/gi;
    let m;
    const links = new Set();
    while ((m = regex.exec(data)) !== null) {
      links.add(m[1]);
    }
    console.log('Product links:', Array.from(links));
  });
});
