const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');

async function testLocal() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const failedRequests = [];
  const consoleErrors = [];

  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to local preview at /RAIS-AGENCIES/...');
  const response = await page.goto('http://localhost:3001/RAIS-AGENCIES/', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  console.log('Page HTTP status:', response.status());

  await page.waitForTimeout(2000);

  // Capture preview screenshots
  await page.screenshot({ path: path.join(OUT_DIR, 'local_preview_01_hero.png') });

  // Scroll to Categories
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'local_preview_02_categories.png') });

  // Scroll to Products
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'local_preview_03_products.png') });

  // Scroll through entire page to check all lazy-loaded images
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await page.waitForTimeout(2000);

  // Check all images in DOM
  const imageAudit = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map((img) => ({
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      alt: img.alt,
      broken: img.naturalWidth === 0
    }));
  });

  const brokenImages = imageAudit.filter(img => img.broken);

  console.log('\n========================================');
  console.log('LOCAL PREVIEW AUDIT RESULTS');
  console.log('========================================');
  console.log(`Total images checked: ${imageAudit.length}`);
  console.log(`Working images: ${imageAudit.length - brokenImages.length}`);
  console.log(`Broken images: ${brokenImages.length}`);
  console.log(`Failed HTTP requests: ${failedRequests.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);

  if (failedRequests.length > 0) {
    console.log('\n--- FAILED REQUESTS ---');
    failedRequests.forEach(r => console.log(`[${r.status}] ${r.url}`));
  }

  if (brokenImages.length > 0) {
    console.log('\n--- BROKEN IMAGES ---');
    brokenImages.forEach(b => console.log(`BROKEN: src="${b.src}" alt="${b.alt}"`));
  } else {
    console.log('\n>>> SUCCESS: ZERO BROKEN IMAGES! ALL IMAGES LOADED! <<<');
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'local_audit_report.json'),
    JSON.stringify({ totalImages: imageAudit.length, brokenImages, failedRequests, consoleErrors }, null, 2)
  );

  await browser.close();
}

testLocal().catch(console.error);
