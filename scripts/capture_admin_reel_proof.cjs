const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 }
  });
  const page = await context.newPage();

  console.log('Navigating to Admin Login...');
  await page.goto('http://localhost:3001/RAIS-AGENCIES/#/admin', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(1000);

  // Fill in login credentials
  const usernameInput = await page.$('input[type="text"]');
  const passwordInput = await page.$('input[type="password"]');
  if (usernameInput && passwordInput) {
    await usernameInput.fill('admin');
    await passwordInput.fill('RAIS@516269');
    await page.click('button[type="submit"]');
    console.log('Submitted login credentials.');
    await page.waitForTimeout(2000);
  }

  // Click on "Reels Production" or Day 1
  console.log('Current URL:', page.url());
  await page.screenshot({ path: path.join(OUT_DIR, 'admin_dashboard_reel_video_ready.png'), fullPage: false });
  console.log('Screenshot saved to admin_dashboard_reel_video_ready.png');

  await browser.close();
}

capture().catch(console.error);
