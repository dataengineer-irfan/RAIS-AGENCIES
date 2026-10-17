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
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1.5 });

  console.log('Capturing Syrups...');
  await page.goto('http://localhost:3001/#/products', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.select('select', 'SYRUPS');
  await page.evaluate(() => window.scrollTo(0, 200));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(targetDir, 'preview_syrups_grid.png'), fullPage: false });

  console.log('Capturing Cheese & Dairy...');
  await page.select('select', 'CHEESE');
  await page.evaluate(() => window.scrollTo(0, 200));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(targetDir, 'preview_cheese_grid.png'), fullPage: false });

  await browser.close();
  console.log('Syrups and Cheese captured!');
}

run().catch(err => {
  console.error('Error running capture:', err);
  process.exit(1);
});
