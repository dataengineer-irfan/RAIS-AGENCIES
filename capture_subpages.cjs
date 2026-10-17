const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = 'C:\\Users\\affra\\.gemini\\antigravity\\brain\\483395d4-8829-4550-8a6a-7ddd35200683';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const routes = [
    { url: 'http://localhost:3001/#/products', file: 'preview_products.png' },
    { url: 'http://localhost:3001/#/who-we-serve', file: 'preview_who_we_serve.png' },
    { url: 'http://localhost:3001/#/about', file: 'preview_about.png' },
    { url: 'http://localhost:3001/#/contact', file: 'preview_contact.png' },
    { url: 'http://localhost:3001/#/category/chicken', file: 'preview_category.png' }
  ];

  for (const r of routes) {
    console.log('Capturing:', r.url);
    await page.goto(r.url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(targetDir, r.file), fullPage: false });
  }

  await browser.close();
  console.log('All subpages captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
