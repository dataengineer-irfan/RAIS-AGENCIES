const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');

async function testLive() {
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

  console.log('Navigating to live GitHub Pages...');
  try {
    const response = await page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('Page HTTP status:', response.status());
  } catch (err) {
    console.error('Navigation error:', err.message);
  }

  await page.waitForTimeout(2000);

  // Capture live page screenshot
  await page.screenshot({ path: path.join(OUT_DIR, 'live_github_pages_01_hero.png') });

  // Scroll to Categories
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'live_github_pages_02_categories.png') });

  // Scroll to Products
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'live_github_pages_03_products.png') });

  // Check broken images in DOM
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

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total images checked: ${imageAudit.length}`);
  console.log(`Broken images (naturalWidth === 0): ${brokenImages.length}`);
  console.log(`Failed HTTP requests (4xx/5xx): ${failedRequests.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);

  console.log('\n--- FAILED REQUESTS ---');
  failedRequests.forEach(r => console.log(`[${r.status}] ${r.url}`));

  console.log('\n--- BROKEN IMAGES ---');
  brokenImages.forEach(b => console.log(`BROKEN: src="${b.src}" alt="${b.alt}"`));

  console.log('\n--- CONSOLE ERRORS ---');
  consoleErrors.forEach(e => console.log(`ERROR: ${e}`));

  fs.writeFileSync(
    path.join(OUT_DIR, 'live_audit_report.json'),
    JSON.stringify({ failedRequests, brokenImages, consoleErrors }, null, 2)
  );

  await browser.close();
  console.log('Audit completed.');
}

testLive().catch(console.error);
