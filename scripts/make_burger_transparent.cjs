const { chromium } = require('playwright');
const fs = require('fs');
const https = require('https');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

(async () => {
  const imgPath = path.resolve(__dirname, '../public/images/ref-assets/hero_burger_stack.png');
  console.log('Re-fetching original burger image...');
  await download('https://hercules-cdn.com/file_3v7dX8FijUSUzBsB1riU0d13', imgPath);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const imgBuffer = fs.readFileSync(imgPath);
  const dataUri = `data:image/png;base64,${imgBuffer.toString('base64')}`;

  const transparentPngBase64 = await page.evaluate(async (uri) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;

        // BFS Flood Fill from the 4 outer boundary edges
        const visited = new Uint8Array(w * h);
        const queue = [];

        function isBg(idx) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          // Background is very dark blue-black
          return (r < 25 && g < 32 && b < 45);
        }

        // Enqueue border pixels that match background
        for (let x = 0; x < w; x++) {
          const topIdx = (0 * w + x) * 4;
          if (isBg(topIdx)) { queue.push(x, 0); visited[0 * w + x] = 1; }
          const botIdx = ((h - 1) * w + x) * 4;
          if (isBg(botIdx)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
        }
        for (let y = 0; y < h; y++) {
          const leftIdx = (y * w + 0) * 4;
          if (isBg(leftIdx) && !visited[y * w]) { queue.push(0, y); visited[y * w] = 1; }
          const rightIdx = (y * w + (w - 1)) * 4;
          if (isBg(rightIdx) && !visited[y * w + (w - 1)]) { queue.push(w - 1, y); visited[y * w + (w - 1)] = 1; }
        }

        let head = 0;
        while (head < queue.length) {
          const cx = queue[head++];
          const cy = queue[head++];
          const pIdx = (cy * w + cx) * 4;
          data[pIdx + 3] = 0; // Make transparent

          // Check 4 neighbors
          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nVisIdx = ny * w + nx;
              if (!visited[nVisIdx]) {
                visited[nVisIdx] = 1;
                const nIdx = nVisIdx * 4;
                if (isBg(nIdx)) {
                  queue.push(nx, ny);
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png').split(',')[1]);
      };
      img.src = uri;
    });
  }, dataUri);

  await browser.close();

  fs.writeFileSync(imgPath, Buffer.from(transparentPngBase64, 'base64'));
  console.log('Successfully completed outer-edge BFS flood fill transparency!');
})();
