const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = 'C:\\Users\\affra\\.gemini\\antigravity\\brain\\483395d4-8829-4550-8a6a-7ddd35200683';

async function run() {
  console.log('Launching Chrome with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Desktop Screenshot
  console.log('Capturing Desktop 1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  const desktopFile = path.join(targetDir, 'desktop_preview.png');
  await page.screenshot({ path: desktopFile, fullPage: false });
  console.log('Desktop saved:', desktopFile);

  // 2. Mobile Screenshot (390x844)
  console.log('Capturing Mobile 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  const mobileFile = path.join(targetDir, 'mobile_preview.png');
  await page.screenshot({ path: mobileFile, fullPage: false });
  console.log('Mobile saved:', mobileFile);

  await browser.close();
  console.log('Done capturing screenshots!');
}

run().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
