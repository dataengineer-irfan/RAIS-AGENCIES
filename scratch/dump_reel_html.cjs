const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  await page.goto('https://www.instagram.com/reel/DfaSjTiu6sb/', { waitUntil: 'networkidle', timeout: 25000 });
  const content = await page.content();
  fs.writeFileSync('scratch/reel_full_html.html', content, 'utf-8');
  console.log('Saved full HTML, size:', content.length);
  await browser.close();
})();
