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

  console.log('1. Capturing Cold-Chain Telemetry HUD...');
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const el = document.getElementById('cold-chain-hud');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'preview_cold_chain_hud.png'), fullPage: false });

  console.log('2. Capturing Packaging Solutions Grid on Products Page...');
  await page.goto('http://localhost:3001/#/products', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Select PACKAGING
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const select of selects) {
      for (const option of select.options) {
        if (option.value === 'PACKAGING') {
          select.value = 'PACKAGING';
          select.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
    window.scrollTo(0, 200);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'preview_packaging_grid.png'), fullPage: false });

  console.log('3. Capturing Veg Items Grid on Products Page...');
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const select of selects) {
      for (const option of select.options) {
        if (option.value === 'VEG') {
          select.value = 'VEG';
          select.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
    window.scrollTo(0, 200);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'preview_veg_grid.png'), fullPage: false });

  console.log('4. Capturing Culinary Spices Grid on Products Page...');
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const select of selects) {
      for (const option of select.options) {
        if (option.value === 'SPICES') {
          select.value = 'SPICES';
          select.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
    window.scrollTo(0, 200);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'preview_spices_grid.png'), fullPage: false });

  console.log('5. Capturing Syrups Grid on Products Page...');
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const select of selects) {
      for (const option of select.options) {
        if (option.value === 'SYRUPS') {
          select.value = 'SYRUPS';
          select.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
    window.scrollTo(0, 200);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'preview_syrups_grid.png'), fullPage: false });

  await browser.close();
  console.log('Targeted screenshots captured!');
}

run().catch(err => {
  console.error('Error running capture:', err);
  process.exit(1);
});
