const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Loading Homepage...');
  await page.goto('http://localhost:3001/#/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Measure sections on page 1
  const sectionsData = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section, main > div, footer'));
    return sections.map((s, idx) => {
      const rect = s.getBoundingClientRect();
      const style = window.getComputedStyle(s);
      return {
        idx,
        tag: s.tagName,
        id: s.id || s.className.slice(0, 40),
        top: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
      };
    });
  });
  console.log('Page 1 Sections:', JSON.stringify(sectionsData, null, 2));

  // Take segmented screenshots down the homepage
  // 1. Hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_01_hero.png') });

  // 2. Categories
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_02_categories.png') });

  // 3. Products Top
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_03_products_top.png') });

  // 4. Products Panels
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_04_products_panels.png') });

  // 5. Workflow / Cold Chain
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_05_workflow.png') });

  // 6. Brands / Pillars
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_06_brands_pillars.png') });

  // 7. 3D Inspector
  await page.evaluate(() => window.scrollTo(0, 4800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_07_inspector.png') });

  // 8. Who We Serve & Footer
  await page.evaluate(() => window.scrollTo(0, 5600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'page1_gap_08_footer.png') });

  await browser.close();
  console.log('Done capturing page 1 screenshots');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
