const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    console.log('Navigating to Reel...');
    await page.goto('https://www.instagram.com/reel/DfaSjTiu6sb/', { waitUntil: 'networkidle', timeout: 25000 });
    
    const title = await page.title();
    console.log('Page Title:', title);
    
    // Check page text or caption
    const text = await page.innerText('body');
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    console.log('\n--- Page Content Snippets ---');
    console.log(lines.slice(0, 15).join('\n'));
    
    // Take screenshot for visual inspection
    const scPath = 'C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683/scraped_reel_preview.png';
    await page.screenshot({ path: scPath, fullPage: false });
    console.log('\nScreenshot saved to:', scPath);
    
    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
