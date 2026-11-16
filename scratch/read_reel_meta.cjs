const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  await page.goto('https://www.instagram.com/reel/DfaSjTiu6sb/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const data = await page.evaluate(() => {
    const tags = {};
    document.querySelectorAll('meta').forEach(m => {
      const name = m.getAttribute('name') || m.getAttribute('property');
      if (name) tags[name] = m.getAttribute('content');
    });
    const scripts = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
      scripts.push(s.innerText);
    });
    
    // Also look for post caption in HTML
    const ogDesc = tags['og:description'] || tags['description'] || '';
    const ogTitle = tags['og:title'] || '';
    
    // Check all article or section text
    const article = document.querySelector('article') ? document.querySelector('article').innerText : '';
    const main = document.querySelector('main') ? document.querySelector('main').innerText : '';
    
    return { title: document.title, tags, scripts, article, main };
  });
  
  console.log('Title:', data.title);
  console.log('Description:', data.tags['og:description']);
  console.log('og:title:', data.tags['og:title']);
  console.log('All Meta:', JSON.stringify(data.tags, null, 2));
  console.log('LD+JSON:', data.scripts);
  console.log('Article text:', data.article);
  console.log('Main text:', data.main);
  
  await browser.close();
})();
