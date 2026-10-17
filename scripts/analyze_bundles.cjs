const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'C:/Users/affra/.gemini/antigravity/brain/483395d4-8829-4550-8a6a-7ddd35200683';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data);
        console.log(`Saved ${dest} (${data.length} bytes)`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

(async () => {
  console.log('Downloading CSS and JS bundles for deep reverse-engineering...');
  const css = await downloadFile('https://rais-agencies.onhercules.app/assets/index-B83FQnz9.css', path.join(OUT_DIR, 'ref_bundle.css'));
  const js = await downloadFile('https://rais-agencies.onhercules.app/assets/index-D2X9AuXM.js', path.join(OUT_DIR, 'ref_bundle.js'));

  // Extract key CSS variables, root tokens, keyframes, utilities
  const cssVarMatches = css.match(/--[\w-]+:\s*[^;]+/g) || [];
  const uniqueVars = Array.from(new Set(cssVarMatches));
  fs.writeFileSync(path.join(OUT_DIR, 'ref_css_variables.json'), JSON.stringify(uniqueVars, null, 2));
  console.log(`Extracted ${uniqueVars.length} CSS variables`);

  // Extract keyframe animations
  const keyframes = css.match(/@keyframes\s+[\w-]+\s*\{[^}]+\}/g) || [];
  fs.writeFileSync(path.join(OUT_DIR, 'ref_keyframes.json'), JSON.stringify(keyframes, null, 2));
  console.log(`Extracted ${keyframes.length} keyframes`);

  // Extract product data from JS
  // Search for arrays or objects containing product names
  const productMatches = js.match(/\{[^}]*id:[^}]*name:[^}]*\}/g) || [];
  console.log(`Found ${productMatches.length} raw product object matches in JS`);

  // Check libraries used (framer-motion, lucide, tailwind, etc.)
  const hasFramerMotion = js.includes('framer-motion') || js.includes('motion.') || js.includes('AnimatePresence');
  const hasLucide = js.includes('lucide') || js.includes('lucide-react');
  const hasCanvasConfetti = js.includes('canvas-confetti');
  console.log('Library detection:');
  console.log('- Framer Motion:', hasFramerMotion);
  console.log('- Lucide Icons:', hasLucide);
  console.log('- Canvas Confetti:', hasCanvasConfetti);

  console.log('Reverse engineering extract finished.');
})().catch(console.error);
