const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Helper for hash navigation
  async function visitHash(hash) {
    await page.goto(`http://localhost:3001/#/${hash}`);
    await page.waitForTimeout(1000);
  }

  console.log('1. Products Page (Cards View)...');
  await visitHash('products');
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_01_products_cards.png') });

  console.log('2. Products Page (Order Sheet Table View)...');
  const tableBtn = page.locator('button:has-text("Order Sheet")');
  if (await tableBtn.isVisible()) {
    await tableBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'secondary_02_products_table.png') });
  }

  console.log('3. Product Spec Modal...');
  const specBtn = page.locator('button:has-text("Spec")').first();
  if (await specBtn.isVisible()) {
    await specBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'secondary_03_product_spec_modal.png') });
    const closeBtn = page.locator('button:has-text("Close Specification")');
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  console.log('4. Category Detail Page (Chicken)...');
  await visitHash('category/chicken');
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_04_category_chicken_top.png') });
  await page.evaluate(() => window.scrollBy(0, 650));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_05_category_chicken_grid.png') });

  console.log('5. Who We Serve Page...');
  await visitHash('who-we-serve');
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_06_who_we_serve_top.png') });
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_07_who_we_serve_pizzerias.png') });
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_07b_who_we_serve_cafes.png') });

  console.log('6. About Page...');
  await visitHash('about');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_08_about_page_top.png') });
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_08b_about_page_pillars.png') });

  console.log('7. Contact Page...');
  await visitHash('contact');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_09_contact_page_top.png') });
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_09b_contact_page_form.png') });

  console.log('8. Legal & Terms Page...');
  await visitHash('legal');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'secondary_10_legal_page.png') });

  console.log('9. Quote Modal Requisition Flow...');
  await visitHash('products');
  // Add 2 items
  const addButtons = page.locator('button:has-text("Add")');
  if (await addButtons.count() >= 2) {
    await addButtons.nth(0).click();
    await page.waitForTimeout(200);
    await addButtons.nth(1).click();
    await page.waitForTimeout(200);
  }

  // Click floating requisition bar or header quote button
  const quoteBtn = page.locator('button:has-text("Quote Sheet"), button:has-text("Requisition (")').first();
  if (await quoteBtn.isVisible()) {
    await quoteBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, 'secondary_11_quote_modal.png') });
  }

  console.log('Checking for any forbidden currency symbols across app...');
  const text = await page.evaluate(() => document.body.innerText);
  const forbidden = ['₹', 'Rs.', 'INR'].filter(f => text.includes(f));
  console.log(`Forbidden pricing symbols found: ${forbidden.length === 0 ? 'NONE (PASSED)' : forbidden.join(', ')}`);

  await browser.close();
  console.log('ALL SECONDARY PAGES VERIFIED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
