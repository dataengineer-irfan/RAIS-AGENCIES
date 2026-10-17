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

  // 1. Sauces catalogue view (shows Del Monte Tomato Ketchup, Foodrite Mayo, etc.)
  console.log('Capturing Sauces catalogue view...');
  await page.goto('http://localhost:3001/#/products', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Sauces') || text.includes('Ketchup')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(targetDir, 'preview_sauces_catalogue.png'), fullPage: false });

  // 2. Chicken catalogue view (shows ITC Chicken Nuggets)
  console.log('Capturing Chicken catalogue view...');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Chicken Items') || text.includes('Chicken')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(targetDir, 'preview_chicken_catalogue.png'), fullPage: false });

  await browser.close();
  console.log('Catalogue category views captured successfully!');
}

run();
