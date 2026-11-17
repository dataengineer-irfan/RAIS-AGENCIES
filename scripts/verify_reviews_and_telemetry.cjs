const path = require('path');
const { chromium } = require(path.join(__dirname, '../node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to admin automation portal...');
  await page.goto('http://localhost:5173/RAIS-AGENCIES/#/automation', { waitUntil: 'networkidle', timeout: 30000 });

  // Handle Login if prompted
  const usernameInput = await page.$('input[placeholder*="username" i], input[type="text"]');
  const passwordInput = await page.$('input[placeholder*="password" i], input[type="password"]');
  if (passwordInput) {
    console.log('Logging in with admin credentials...');
    if (usernameInput) await usernameInput.fill('admin');
    await passwordInput.fill('RAIS@516269');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  }

  // 1. Verify Google Reviews Inbox
  console.log('Navigating to Google Reviews Inbox...');
  const reviewsTab = page.locator('button:has-text("Google Reviews Inbox"), button:has-text("Reviews Inbox")').first();
  await reviewsTab.click();
  await page.waitForTimeout(2000);

  const reviewsScreenshotPath = path.join('C:', 'Users', 'affra', '.gemini', 'antigravity', 'brain', '483395d4-8829-4550-8a6a-7ddd35200683', 'verified_5_reviews_inbox.png');
  await page.screenshot({ path: reviewsScreenshotPath, fullPage: true });
  console.log('Saved Reviews Inbox screenshot to:', reviewsScreenshotPath);

  // 2. Verify Performance Telemetry
  console.log('Navigating to Performance Telemetry...');
  const telemetryTab = page.locator('button:has-text("Performance Telemetry")').first();
  await telemetryTab.click();
  await page.waitForTimeout(2000);

  const telemetryScreenshotPath = path.join('C:', 'Users', 'affra', '.gemini', 'antigravity', 'brain', '483395d4-8829-4550-8a6a-7ddd35200683', 'verified_live_performance_telemetry.png');
  await page.screenshot({ path: telemetryScreenshotPath, fullPage: true });
  console.log('Saved Performance Telemetry screenshot to:', telemetryScreenshotPath);

  await browser.close();
  console.log('Verification completed successfully!');
})();
