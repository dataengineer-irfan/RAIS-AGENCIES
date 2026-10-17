const { chromium } = require('playwright');

const OUT = 'C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683';
const BASE = 'http://localhost:3001';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('Loading page for 3D frozen food verification...');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(2000);

  // 1. Hero: Click "🥟 Momo"
  const momoHeroBtn = page.locator('button', { hasText: '🥟 Momo' }).first();
  if (await momoHeroBtn.isVisible()) {
    await momoHeroBtn.click();
    await sleep(1500);
    await page.screenshot({ path: OUT + '/frozen_01_hero_3d_momo.png' });
    console.log('Captured frozen_01_hero_3d_momo');
  }

  // 2. Hero: Click "🍗 Nugget"
  const nuggetHeroBtn = page.locator('button', { hasText: '🍗 Nugget' }).first();
  if (await nuggetHeroBtn.isVisible()) {
    await nuggetHeroBtn.click();
    await sleep(1500);
    await page.screenshot({ path: OUT + '/frozen_02_hero_3d_nugget.png' });
    console.log('Captured frozen_02_hero_3d_nugget');
  }

  // 3. Scroll to 3D Inspector (default is now 3D Pleated Momo)
  await page.evaluate(() => {
    const el = document.getElementById('packaging-3d');
    if (el) el.scrollIntoView();
  });
  await sleep(1500);
  await page.screenshot({ path: OUT + '/frozen_03_inspector_momo.png' });
  console.log('Captured frozen_03_inspector_momo');

  // 4. Click "🍗 Crispy Nugget" in Inspector
  const nuggetTab = page.locator('button', { hasText: '🍗 Crispy Nugget' }).first();
  if (await nuggetTab.isVisible()) {
    await nuggetTab.click();
    await sleep(1200);
    await page.screenshot({ path: OUT + '/frozen_04_inspector_nugget.png' });
    console.log('Captured frozen_04_inspector_nugget');
  }

  // 5. Click "🍟 French Fries" in Inspector
  const friesTab = page.locator('button', { hasText: '🍟 French Fries' }).first();
  if (await friesTab.isVisible()) {
    await friesTab.click();
    await sleep(1200);
    await page.screenshot({ path: OUT + '/frozen_05_inspector_fries.png' });
    console.log('Captured frozen_05_inspector_fries');
  }

  // 6. Catalogue: Search "Momo" to show real momos images in catalogue
  await page.evaluate(() => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView();
  });
  await sleep(600);
  const searchInput = page.locator('input[placeholder*="Search products"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('Momo');
    await sleep(1000);
    await page.screenshot({ path: OUT + '/frozen_06_catalogue_momos_verified.png' });
    console.log('Captured frozen_06_catalogue_momos_verified');
  }

  await ctx.close();
  await browser.close();
  console.log('=== FROZEN FOOD 3D AUDIT COMPLETE ===');
})().catch(e => {
  console.error('Audit Error:', e.message);
  process.exit(1);
});
