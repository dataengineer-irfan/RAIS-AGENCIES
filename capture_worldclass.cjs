const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = 'C:\\Users\\affra\\.gemini\\antigravity\\brain\\483395d4-8829-4550-8a6a-7ddd35200683';

async function run() {
  console.log('Launching Chrome with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Desktop Homepage
  console.log('1. Capturing Desktop Homepage (1440x900)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'desktop_preview.png'), fullPage: false });

  // 2. Mobile Homepage
  console.log('2. Capturing Mobile Homepage (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'mobile_preview.png'), fullPage: false });

  // Reset to Desktop for subpages
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // 3. Products Page with Requisition Tally
  console.log('3. Capturing Products Page...');
  await page.goto('http://localhost:3001/#/products', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  
  // Click "+ Enquiry" on the first product to activate Requisition Bar
  const enquiryButtons = await page.$$('button');
  for (const btn of enquiryButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('+ Enquiry')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(targetDir, 'preview_products.png'), fullPage: false });

  // 4. Product Spec Modal (TPJ-Style Specification)
  console.log('4. Capturing Product Spec Modal...');
  const specButtons = await page.$$('button');
  for (const btn of specButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Spec')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'preview_product_spec.png'), fullPage: false });

  // Close spec modal by clicking the X button or pressing Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 5. Category Detail Page
  console.log('5. Capturing Category Detail Page (Chicken)...');
  await page.goto('http://localhost:3001/#/category/chicken', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(targetDir, 'preview_category.png'), fullPage: false });

  // 6. Quote Modal
  console.log('6. Capturing B2B Quotation Modal...');
  const navButtons = await page.$$('nav button, header button, aside button');
  for (const btn of navButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Review Enquiry') || text.includes('Quote') || text.includes('Request Quote')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(targetDir, 'preview_quote_modal.png'), fullPage: false });

  // 7. Kühne + Heitz Trade Standards (Homepage scroll)
  console.log('7. Capturing Trade Standards on Homepage...');
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    window.scrollBy(0, 1650);
  });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(targetDir, 'preview_trade_standards.png'), fullPage: false });

  await browser.close();
  console.log('All world-class screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
