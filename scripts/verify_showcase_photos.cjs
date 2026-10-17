const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const failedRequests = [];
  const consoleErrors = [];

  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to local preview at http://localhost:3001/RAIS-AGENCIES/ ...');
  await page.goto('http://localhost:3001/RAIS-AGENCIES/', { waitUntil: 'networkidle', timeout: 30000 });

  const artifactDir = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');

  // Scroll to #packaging-3d
  const section = page.locator('#packaging-3d');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // 1. Momo view screenshot
  console.log('Taking screenshot of authentic Momo showcase...');
  await page.screenshot({ path: path.join(artifactDir, 'showcase_momo_verified.png'), fullPage: false });

  // Verify momo image is loaded
  const momoImg = page.locator('#packaging-3d img[alt*="Momo"]').first();
  const isMomoVisible = await momoImg.isVisible();
  const momoNaturalWidth = await momoImg.evaluate((img) => img.naturalWidth);
  console.log(`Momo Image Visible: ${isMomoVisible}, Natural Width: ${momoNaturalWidth}px`);

  // 2. Click Crunchy Nuggets
  console.log('Switching to Crunchy Nuggets...');
  await page.locator('#packaging-3d button:has-text("Crunchy Nuggets")').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'showcase_nugget_verified.png'), fullPage: false });

  // 3. Click Shoestring Fries
  console.log('Switching to Shoestring Fries...');
  await page.locator('#packaging-3d button:has-text("Shoestring Fries")').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'showcase_fries_verified.png'), fullPage: false });

  // 4. Click 3D Master Case (Three.js 3D Packaging)
  console.log('Switching to 3D Master Case...');
  await page.locator('#packaging-3d button:has-text("3D Master Case")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'showcase_carton_verified.png'), fullPage: false });

  // 5. Click 3D Burger Box and test unboxing
  console.log('Switching to 3D Burger Box...');
  await page.locator('#packaging-3d button:has-text("3D Burger Box")').click();
  await page.waitForTimeout(800);
  await page.locator('#packaging-3d button:has-text("Unbox & Open Lid in 3D")').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'showcase_burger_unboxed.png'), fullPage: false });

  // 6. Return to Momo and test Macro Texture Zoom
  console.log('Returning to Handcrafted Momos and toggling Macro Zoom...');
  await page.locator('#packaging-3d button:has-text("Handcrafted Momos")').click();
  await page.waitForTimeout(500);
  await page.locator('#packaging-3d button:has-text("Macro Texture Zoom")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactDir, 'showcase_momo_macro_zoom.png'), fullPage: false });

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log(`Failed HTTP requests: ${failedRequests.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  if (failedRequests.length > 0) {
    console.log('Failed requests:', JSON.stringify(failedRequests, null, 2));
  }
  if (consoleErrors.length > 0) {
    console.log('Console errors:', JSON.stringify(consoleErrors, null, 2));
  }

  await browser.close();
})();
