const https = require('https');

https.get('https://www.madewithdelmonte.in/product/sauces-dips-and-spreads/del-monte-tandoori-mayo', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let m;
    const imgs = [];
    while ((m = regex.exec(data)) !== null) {
      imgs.push(m[1]);
    }
    console.log(imgs);
  });
});
