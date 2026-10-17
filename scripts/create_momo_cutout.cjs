const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const srcImg = path.resolve('C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683/chicken_momos_1792222747248.jpg');
  const destImg = path.resolve(__dirname, '../public/images/ref-assets/hero_momos_cutout.png');
  const imgBuffer = fs.readFileSync(srcImg);
  const dataUri = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;

  const cutoutBase64 = await page.evaluate(async (uri) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // We crop the center bottom or center momo which is beautifully pleated
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        // Draw radial clip or rounded circular vignette
        ctx.beginPath();
        ctx.arc(200, 200, 190, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Source image dimensions: 1024x768 approx. Center momo is around (450, 500)
        // Draw the center momo into 400x400
        const sx = img.width * 0.32;
        const sy = img.height * 0.35;
        const sSize = img.width * 0.38;
        ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, 400, 400);

        // Add subtle sub-zero cyan rim glow to edge
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
        ctx.lineWidth = 6;
        ctx.stroke();

        resolve(canvas.toDataURL('image/png').split(',')[1]);
      };
      img.src = uri;
    });
  }, dataUri);

  await browser.close();
  fs.writeFileSync(destImg, Buffer.from(cutoutBase64, 'base64'));
  console.log('Created hero_momos_cutout.png from authentic steamed momos!');
})();
