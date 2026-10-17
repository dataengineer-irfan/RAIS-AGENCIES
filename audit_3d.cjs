const { chromium } = require('playwright');

const OUT = 'C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683';
const BASE = 'http://localhost:3001';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('Loading page for 3D verification...');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(2000);

  // 1. Click "3D Box" toggle in Hero card
  const boxToggle = page.locator('button', { hasText: '3D Box' }).first();
  if (await boxToggle.isVisible()) {
    await boxToggle.click();
    await sleep(1500);
    await page.screenshot({ path: OUT + '/3d_01_hero_card_3d.png' });
    console.log('Captured 3d_01_hero_card_3d');
  }

  // 2. Scroll to 3D Packaging Inspector section
  await page.evaluate(() => {
    const el = document.getElementById('packaging-3d');
    if (el) el.scrollIntoView();
  });
  await sleep(1500);
  await page.screenshot({ path: OUT + '/3d_02_inspector_carton.png' });
  console.log('Captured 3d_02_inspector_carton');

  // 3. Click "Unbox & Open Lid in 3D"
  const unboxBtn = page.locator('button', { hasText: 'Unbox & Open Lid in 3D' }).first();
  if (await unboxBtn.isVisible()) {
    await unboxBtn.click();
    await sleep(1200);
    await page.screenshot({ path: OUT + '/3d_03_inspector_unboxed.png' });
    console.log('Captured 3d_03_inspector_unboxed');
  }

  // 4. Switch to "Kraft Burger Clamshell"
  const burgerTab = page.locator('button', { hasText: 'Kraft Burger Clamshell' }).first();
  if (await burgerTab.isVisible()) {
    await burgerTab.click();
    await sleep(1200);
    await page.screenshot({ path: OUT + '/3d_04_inspector_burger.png' });
    console.log('Captured 3d_04_inspector_burger');
  }

  // 5. Switch to "Sub-Zero Vault Pod" and Cold Vault lighting
  const podTab = page.locator('button', { hasText: 'Sub-Zero Vault Pod' }).first();
  if (await podTab.isVisible()) {
    await podTab.click();
    await sleep(1200);
    await page.screenshot({ path: OUT + '/3d_05_inspector_pod.png' });
    console.log('Captured 3d_05_inspector_pod');
  }

  await ctx.close();
  await browser.close();
  console.log('=== 3D PLAYWRIGHT VERIFICATION FINISHED ===');
})().catch(e => {
  console.error('3D Playwright Error:', e.message);
  process.exit(1);
});
