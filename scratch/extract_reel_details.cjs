const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  await page.goto('https://www.instagram.com/reel/DfaSjTiu6sb/', { waitUntil: 'networkidle', timeout: 20000 });
  
  // Extract all h1, span, article text
  const data = await page.evaluate(() => {
    const video = document.querySelector('video');
    const videoSrc = video ? video.src : null;
    const allSpans = Array.from(document.querySelectorAll('span, h1, div[role="button"]')).map(e => e.innerText.trim()).filter(t => t.length > 5);
    return { videoSrc, allSpans: Array.from(new Set(allSpans)) };
  });
  
  console.log('Video Source:', data.videoSrc);
  console.log('\nText Elements on Reel:');
  data.allSpans.forEach(s => console.log(' -', s.replace(/\n/g, ' ')));
  
  await browser.close();
})();
