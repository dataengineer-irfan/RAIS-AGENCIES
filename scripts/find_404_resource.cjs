const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log('Failed request:', resp.status(), resp.url());
    }
  });

  await page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/#admin', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'RAIS@516269');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  await browser.close();
})();
