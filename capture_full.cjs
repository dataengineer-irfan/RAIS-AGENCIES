const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = 'C:\\Users\\affra\\.gemini\\antigravity\\brain\\483395d4-8829-4550-8a6a-7ddd35200683';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Desktop Full Page
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  const desktopFull = path.join(targetDir, 'desktop_fullpage.png');
  await page.screenshot({ path: desktopFull, fullPage: true });

  // Mobile Full Page
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  const mobileFull = path.join(targetDir, 'mobile_fullpage.png');
  await page.screenshot({ path: mobileFull, fullPage: true });

  await browser.close();
  console.log('Fullpage screenshots captured!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
