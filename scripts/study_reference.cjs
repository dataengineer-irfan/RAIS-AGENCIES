const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683';
const REF_URL = 'https://rais-agencies.onhercules.app';

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('Launching headless browser to study reference website:', REF_URL);
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Context (1440 x 900)
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await desktopCtx.newPage();

  // Capture console logs & network requests
  const networkRequests = [];
  page.on('request', req => {
    networkRequests.push({ url: req.url(), resourceType: req.resourceType() });
  });

  console.log('Navigating to reference homepage...');
  await page.goto(REF_URL, { waitUntil: 'networkidle', timeout: 35000 });
  await sleep(3000); // Allow any entrance animations to settle

  // First fold screenshot
  await page.screenshot({ path: path.join(OUT_DIR, 'ref_01_desktop_hero.png') });
  console.log('Saved ref_01_desktop_hero.png');

  // Full page desktop screenshot
  await page.screenshot({ path: path.join(OUT_DIR, 'ref_02_desktop_fullpage.png'), fullPage: true });
  console.log('Saved ref_02_desktop_fullpage.png');

  // Extract DOM analysis
  const domInfo = await page.evaluate(() => {
    const root = document.getElementById('root');
    const sections = Array.from(document.querySelectorAll('section, header, footer, nav, [id]')).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: el.className,
      textPreview: el.innerText ? el.innerText.substring(0, 100).replace(/\n/g, ' ') : ''
    }));

    // Extract colors & typography computed styles
    const elementsToSample = document.querySelectorAll('h1, h2, h3, p, button, a, nav, card, [class*="card"], [class*="badge"]');
    const stylesSample = Array.from(elementsToSample).slice(0, 30).map(el => {
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className,
        text: el.innerText ? el.innerText.substring(0, 40) : '',
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderColor: cs.borderColor,
        boxShadow: cs.boxShadow
      };
    });

    // Check for products
    const productCards = Array.from(document.querySelectorAll('[class*="product"], [class*="card"], [data-testid*="product"]')).map(el => ({
      className: el.className,
      text: el.innerText ? el.innerText.replace(/\n/g, ' | ') : '',
      images: Array.from(el.querySelectorAll('img')).map(img => img.src)
    }));

    // Check all buttons and links
    const interactiveElements = Array.from(document.querySelectorAll('button, a, input, select')).map(el => ({
      tag: el.tagName,
      text: el.innerText || el.getAttribute('aria-label') || el.value || '',
      href: el.getAttribute('href'),
      className: el.className
    }));

    return {
      title: document.title,
      sections,
      stylesSample,
      productCards: productCards.slice(0, 20),
      interactiveElements: interactiveElements.slice(0, 40),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      bodyColor: window.getComputedStyle(document.body).color,
      htmlInner: root ? root.innerHTML.substring(0, 5000) : ''
    };
  });

  fs.writeFileSync(path.join(OUT_DIR, 'ref_dom_info.json'), JSON.stringify(domInfo, null, 2));
  console.log('Saved ref_dom_info.json');

  // Navigate to #products
  console.log('Navigating to #products...');
  await page.goto(REF_URL + '/#products', { waitUntil: 'networkidle', timeout: 20000 });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT_DIR, 'ref_03_desktop_products.png') });
  console.log('Saved ref_03_desktop_products.png');

  // Let's test interaction: hover on a product card or category button
  const categoryBtns = await page.$$('button, [role="tab"], [class*="tab"]');
  console.log(`Found ${categoryBtns.length} buttons/tabs`);
  if (categoryBtns.length > 2) {
    // Click a category button
    try {
      await categoryBtns[2].click();
      await sleep(1500);
      await page.screenshot({ path: path.join(OUT_DIR, 'ref_04_desktop_category_click.png') });
      console.log('Saved ref_04_desktop_category_click.png');
    } catch(e) {
      console.log('Could not click category btn:', e.message);
    }
  }

  // Let's scroll down and take screenshots of different sections
  const scrollSteps = [600, 1400, 2200, 3200, 4200];
  for (let i = 0; i < scrollSteps.length; i++) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), scrollSteps[i]);
    await sleep(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `ref_05_scroll_${i+1}.png`) });
    console.log(`Saved ref_05_scroll_${i+1}.png at y=${scrollSteps[i]}`);
  }

  await desktopCtx.close();

  // 2. Mobile Context (iPhone 14 / modern mobile 390x844)
  console.log('Opening mobile viewport (390x844)...');
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileCtx.newPage();

  await mobilePage.goto(REF_URL, { waitUntil: 'networkidle', timeout: 35000 });
  await sleep(2500);
  await mobilePage.screenshot({ path: path.join(OUT_DIR, 'ref_06_mobile_hero.png') });
  console.log('Saved ref_06_mobile_hero.png');

  await mobilePage.goto(REF_URL + '/#products', { waitUntil: 'networkidle', timeout: 20000 });
  await sleep(2000);
  await mobilePage.screenshot({ path: path.join(OUT_DIR, 'ref_07_mobile_products.png') });
  console.log('Saved ref_07_mobile_products.png');

  await mobilePage.screenshot({ path: path.join(OUT_DIR, 'ref_08_mobile_fullpage.png'), fullPage: true });
  console.log('Saved ref_08_mobile_fullpage.png');

  await mobileCtx.close();
  await browser.close();

  // Save network assets list
  fs.writeFileSync(path.join(OUT_DIR, 'ref_network_requests.json'), JSON.stringify(networkRequests, null, 2));
  console.log('=== REFERENCE STUDY CAPTURE COMPLETE ===');
})().catch(err => {
  console.error('Study failed:', err);
  process.exit(1);
});
