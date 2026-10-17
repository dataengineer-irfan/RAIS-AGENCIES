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

  console.log('Navigating to http://localhost:3001/#/products ...');
  await page.goto('http://localhost:3001/#/products', { waitUntil: 'networkidle0' });

  // Click "+ Add to Enquiry" on the first product
  console.log('Adding first product to enquiry...');
  const addButtons = await page.$$('button');
  for (const btn of addButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('+ Add to Enquiry')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 600));

  // Click Quote trigger in navbar (the button with Quote / items count)
  console.log('Opening Quote Modal...');
  const navButtons = await page.$$('nav button, header button');
  for (const btn of navButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Quote') || text.includes('Enquiry') || text.includes('1')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing Quote Modal screenshot...');
  const quoteModalPath = path.join(targetDir, 'preview_quote_modal.png');
  await page.screenshot({ path: quoteModalPath, fullPage: false });
  console.log('Quote Modal captured:', quoteModalPath);

  await browser.close();
  console.log('Interaction capture complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
