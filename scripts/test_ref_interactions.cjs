const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683';
const REF_URL = 'https://rais-agencies.onhercules.app/#products';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('Testing reference website interactions...');
  await page.goto(REF_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);

  // 1. Find all "+ Add" buttons
  const addButtons = await page.$$('button:has-text("Add")');
  console.log(`Found ${addButtons.length} "+ Add" buttons.`);

  if (addButtons.length > 0) {
    // Click the first "+ Add" button
    await addButtons[0].click();
    await sleep(800);
    console.log('Clicked 1st Add button');

    // Click another "+ Add" button
    if (addButtons.length > 2) {
      await addButtons[2].click();
      await sleep(800);
      console.log('Clicked 2nd Add button');
    }

    // Capture screenshot after adding items
    await page.screenshot({ path: path.join(OUT_DIR, 'ref_09_after_add_items.png') });
    console.log('Saved ref_09_after_add_items.png');

    // Check if floating cart / bar appeared
    const floatingElements = await page.evaluate(() => {
      const fixedEls = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return (style.position === 'fixed' || style.position === 'sticky') && el.id !== 'h3zbjrc';
      });
      return fixedEls.map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.innerText ? el.innerText.substring(0, 150).replace(/\n/g, ' ') : ''
      }));
    });
    console.log('Fixed/Floating elements:', JSON.stringify(floatingElements, null, 2));

    // Try clicking floating bar if present
    const orderBar = await page.$('button:has-text("Order"), button:has-text("WhatsApp"), div[class*="cart"], div[class*="drawer"]');
    if (orderBar) {
      await page.screenshot({ path: path.join(OUT_DIR, 'ref_10_cart_drawer.png') });
      console.log('Saved ref_10_cart_drawer.png');
    }
  }

  // 2. Test search bar interaction
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    await searchInput.fill('Momo');
    await sleep(1000);
    await page.screenshot({ path: path.join(OUT_DIR, 'ref_11_search_momo.png') });
    console.log('Saved ref_11_search_momo.png');
  }

  await ctx.close();
  await browser.close();
  console.log('Interaction test complete.');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
