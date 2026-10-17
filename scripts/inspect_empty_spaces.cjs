const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');
const BASE_URL = 'http://localhost:3001';

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('Starting Playwright Empty Space Audit...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const failedImages = [];
  page.on('response', resp => {
    if (resp.request().resourceType() === 'image' && resp.status() >= 400) {
      failedImages.push({ url: resp.url(), status: resp.status() });
    }
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2500);

  // 1. Hero Viewport
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_01_hero.png') });
  console.log('Captured audit_01_hero.png');

  // 2. Categories
  const catEl = await page.$('#categories');
  if (catEl) await catEl.scrollIntoViewIfNeeded();
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_02_categories.png') });
  console.log('Captured audit_02_categories.png');

  // 3. Products Top & Filters
  const prodEl = await page.$('#products');
  if (prodEl) await prodEl.scrollIntoViewIfNeeded();
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_03_products_top.png') });
  console.log('Captured audit_03_products_top.png');

  // 4. Products Panels (Scroll down 400px into products)
  await page.evaluate(() => window.scrollBy(0, 450));
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_04_products_panels_scroll1.png') });
  console.log('Captured audit_04_products_panels_scroll1.png');

  // Scroll another 600px into products
  await page.evaluate(() => window.scrollBy(0, 600));
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_05_products_panels_scroll2.png') });
  console.log('Captured audit_05_products_panels_scroll2.png');

  // 5. Workflow
  const wfEl = await page.$('#workflow');
  if (wfEl) await wfEl.scrollIntoViewIfNeeded();
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_06_workflow.png') });
  console.log('Captured audit_06_workflow.png');

  // 6. Brands & Value Pillars
  const brEl = await page.$('#brands');
  if (brEl) await brEl.scrollIntoViewIfNeeded();
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_07_brands_pillars.png') });
  console.log('Captured audit_07_brands_pillars.png');

  // 7. 3D Inspector
  const threeEl = await page.$('#packaging-3d');
  if (threeEl) await threeEl.scrollIntoViewIfNeeded();
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_08_3d_inspector.png') });
  console.log('Captured audit_08_3d_inspector.png');

  // 8. Who We Serve
  const wsEl = await page.$('#who-we-serve');
  if (wsEl) await wsEl.scrollIntoViewIfNeeded();
  await sleep(1200);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_09_who_we_serve.png') });
  console.log('Captured audit_09_who_we_serve.png');

  // 9. Contact & Maps
  const ctEl = await page.$('#contact');
  if (ctEl) await ctEl.scrollIntoViewIfNeeded();
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, 'audit_10_contact_maps.png') });
  console.log('Captured audit_10_contact_maps.png');

  // Check broken images in DOM
  const brokenImagesInDOM = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter(img => img.naturalWidth === 0 && img.src)
      .map(img => ({ src: img.src, alt: img.alt, class: img.className }));
  });

  // Check card height mismatches in products section
  const cardStats = await page.evaluate(() => {
    const panels = Array.from(document.querySelectorAll('#products .grid > div'));
    return panels.map((p, idx) => {
      const title = p.querySelector('h3')?.textContent?.trim();
      const ul = p.querySelector('ul');
      const banner = p.querySelector('div.relative.h-28');
      const rect = p.getBoundingClientRect();
      const bannerRect = banner ? banner.getBoundingClientRect() : null;
      const ulRect = ul ? ul.getBoundingClientRect() : null;
      const gap = (ulRect && bannerRect) ? (ulRect.top - bannerRect.bottom) : 0;
      return {
        idx,
        title,
        cardHeight: rect.height,
        gapBetweenBannerAndList: gap,
        itemsCount: ul ? ul.children.length : 0
      };
    });
  });

  console.log('=== BROKEN IMAGES ===', brokenImagesInDOM);
  console.log('=== CARD STATS & GAPS ===', JSON.stringify(cardStats, null, 2));
  console.log('=== FAILED NETWORK IMAGES ===', failedImages);

  await browser.close();
  console.log('Done auditing empty spaces.');
})();
