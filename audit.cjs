const { chromium } = require('playwright');

const OUT = 'C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683';
const BASE = 'http://localhost:3001';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ---- DESKTOP 1440x900 ----
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('Loading homepage...');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(1500);

  // 1. Hero
  await page.screenshot({ path: OUT + '/pw_01_hero.png' });
  console.log('01 hero');

  // 2. Trust + Brands
  await page.evaluate(() => document.getElementById('brands') && document.getElementById('brands').scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: OUT + '/pw_02_brands.png' });
  console.log('02 brands');

  // 3. Categories Grid
  await page.evaluate(() => document.getElementById('categories') && document.getElementById('categories').scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: OUT + '/pw_03_categories.png' });
  console.log('03 categories');

  // 4. Products Grid
  await page.evaluate(() => document.getElementById('products') && document.getElementById('products').scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: OUT + '/pw_04_products.png' });
  console.log('04 products');

  // 5. Trade Standards
  await page.evaluate(() => document.getElementById('trade-standards') && document.getElementById('trade-standards').scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: OUT + '/pw_05_trade.png' });
  console.log('05 trade');

  // 6. Who We Serve Showcase
  await page.evaluate(() => document.getElementById('who-we-serve') && document.getElementById('who-we-serve').scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: OUT + '/pw_06_who.png' });
  console.log('06 who we serve');

  // 7. Full Homepage Scroll
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(1000);
  await page.screenshot({ path: OUT + '/pw_07_homepage_full.png', fullPage: true });
  console.log('07 full homepage');

  // 8. Products Page
  await page.locator('nav button', { hasText: 'Products & Catalogue' }).first().click();
  await sleep(1200);
  await page.screenshot({ path: OUT + '/pw_08_products_page.png' });
  console.log('08 products page');

  // 9. Who We Serve Page
  await page.locator('nav button', { hasText: 'Who We Serve' }).first().click();
  await sleep(1200);
  await page.screenshot({ path: OUT + '/pw_09_who_we_serve_page.png' });
  console.log('09 who we serve page');

  // 10. About Page
  await page.locator('nav button', { hasText: 'About RAIS' }).first().click();
  await sleep(1200);
  await page.screenshot({ path: OUT + '/pw_10_about_page.png' });
  console.log('10 about page');

  // 11. Contact Page
  await page.locator('nav button', { hasText: 'Contact & Hub' }).first().click();
  await sleep(1200);
  await page.screenshot({ path: OUT + '/pw_11_contact_page.png' });
  console.log('11 contact page');

  // 12. Category Detail Page
  await page.goto(BASE + '#/category/chicken', { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(1200);
  await page.screenshot({ path: OUT + '/pw_12_category_detail.png' });
  console.log('12 category detail');

  await ctx.close();

  // ---- MOBILE 390x844 ----
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mp = await mctx.newPage();

  await mp.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(1500);
  await mp.screenshot({ path: OUT + '/pw_13_mobile_hero.png' });
  console.log('13 mobile hero');

  await mp.evaluate(() => window.scrollBy(0, 750));
  await sleep(600);
  await mp.screenshot({ path: OUT + '/pw_14_mobile_trust_brands.png' });
  console.log('14 mobile trust brands');

  await mp.evaluate(() => document.getElementById('who-we-serve') && document.getElementById('who-we-serve').scrollIntoView());
  await sleep(600);
  await mp.screenshot({ path: OUT + '/pw_15_mobile_who.png' });
  console.log('15 mobile who');

  await mp.screenshot({ path: OUT + '/pw_16_mobile_full.png', fullPage: true });
  console.log('16 mobile full page');

  await mctx.close();
  await browser.close();
  console.log('=== ALL SCREENSHOTS COMPLETED SUCCESSFULLY ===');
})().catch(e => {
  console.error('PLAYWRIGHT AUDIT ERROR:', e.message);
  process.exit(1);
});
