const http = require('http');
const https = require('https');
const path = require('path');
const { chromium } = require(path.join(__dirname, '../node_modules/playwright'));

const BASE_LIVE_URL = 'https://dataengineer-irfan.github.io/RAIS-AGENCIES';
const BACKEND_URL = 'https://rais-growth-backend.onrender.com';

const STATIC_URLS = [
  `${BASE_LIVE_URL}/`,
  `${BASE_LIVE_URL}/index.html`,
  `${BASE_LIVE_URL}/catalogue.html`,
  `${BASE_LIVE_URL}/RAIS_Product_Catalogue_No_Prices.html`,
  `${BASE_LIVE_URL}/RAIS_End_User_Automation_Setup_Manual.html`,
  `${BASE_LIVE_URL}/RAIS_Instagram_Automation_Setup_Journey_BabySteps.html`,
  `${BASE_LIVE_URL}/RAIS_Agencies_Automation_Architecture_Presentation.html`,
  `${BACKEND_URL}/`,
  `${BACKEND_URL}/api/health`,
  `${BACKEND_URL}/api/v1/google/status`,
  `${BACKEND_URL}/api/v1/google/performance`,
  `${BACKEND_URL}/api/v1/reviews`,
  `${BACKEND_URL}/api/v1/business-info`,
  `${BACKEND_URL}/api/v1/seo/keywords`,
  `${BACKEND_URL}/docs`
];

const SPA_ROUTES = [
  { name: 'Home Showroom', hash: '#/' },
  { name: 'Full Products Catalog (90+ SKUs)', hash: '#/products' },
  { name: 'Category: Frozen Veg Snacks', hash: '#/category/frozen-veg-snacks' },
  { name: 'Category: Frozen Non-Veg Snacks', hash: '#/category/frozen-nonveg-snacks' },
  { name: 'Category: Commercial Dairy & Cheese', hash: '#/category/commercial-dairy-cheese' },
  { name: 'Category: French Fries & Specialty Potatoes', hash: '#/category/french-fries-specialty-potatoes' },
  { name: 'Category: Bakery & Pizza Bases', hash: '#/category/bakery-pizza-bases' },
  { name: 'Category: Packaging & Disposables', hash: '#/category/packaging-disposables' },
  { name: 'Category: Sauces, Mayo & Condiments', hash: '#/category/sauces-mayo-condiments' },
  { name: 'Category: Beverage Crushes & Syrups', hash: '#/category/beverage-crushes-syrups' },
  { name: 'Who We Serve (Cafes, QSRs, Hotels)', hash: '#/who-we-serve' },
  { name: 'About RAIS & Cold Chain Infra', hash: '#/about' },
  { name: 'Contact & Wholesale Depot', hash: '#/contact' },
  { name: 'Legal, Terms & Cold Chain Guarantee', hash: '#/legal' },
  { name: 'Automation Engine Dashboard', hash: '#/automation' }
];

function checkHttpStatus(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        responseTimeMs: Date.now() - start,
        contentType: res.headers['content-type'] || 'unknown'
      });
    });
    req.on('error', (err) => {
      resolve({
        url,
        statusCode: 0,
        statusMessage: err.message,
        responseTimeMs: Date.now() - start,
        contentType: 'none'
      });
    });
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({
        url,
        statusCode: 408,
        statusMessage: 'Request Timeout (15s)',
        responseTimeMs: Date.now() - start,
        contentType: 'none'
      });
    });
  });
}

(async () => {
  console.log('=== STEP 1: Programmatic HTTP Status Audit (Static & Backend Endpoints) ===');
  const httpResults = [];
  for (const url of STATIC_URLS) {
    const res = await checkHttpStatus(url);
    httpResults.push(res);
    console.log(`[HTTP ${res.statusCode}] ${res.url} (${res.responseTimeMs}ms) - ${res.contentType}`);
  }

  console.log('\n=== STEP 2: Headless Browser Deep SEO Audit (SPA Routes) ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const spaResults = [];

  for (const route of SPA_ROUTES) {
    const fullUrl = `${BASE_LIVE_URL}/${route.hash}`;
    const start = Date.now();
    let loadError = null;

    try {
      await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1000);
    } catch (e) {
      loadError = e.message;
    }

    const duration = Date.now() - start;

    const seoData = await page.evaluate(() => {
      const getMeta = (name, attr = 'name') => {
        const el = document.querySelector(`meta[${attr}="${name}"]`);
        return el ? el.getAttribute('content') : null;
      };

      const h1Els = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()).filter(Boolean);
      const h2Els = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()).filter(Boolean);
      const allImgs = Array.from(document.querySelectorAll('img'));
      const imgsWithoutAlt = allImgs.filter(img => !img.hasAttribute('alt') || !img.getAttribute('alt').trim());

      const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
        try {
          return JSON.parse(s.innerText);
        } catch (e) {
          return { error: 'Invalid JSON' };
        }
      });

      const canonicalEl = document.querySelector('link[rel="canonical"]');

      return {
        title: document.title,
        titleLength: document.title ? document.title.length : 0,
        description: getMeta('description'),
        descLength: getMeta('description') ? getMeta('description').length : 0,
        keywords: getMeta('keywords'),
        ogTitle: getMeta('og:title', 'property'),
        ogDesc: getMeta('og:description', 'property'),
        ogType: getMeta('og:type', 'property'),
        ogImage: getMeta('og:image', 'property'),
        canonical: canonicalEl ? canonicalEl.getAttribute('href') : null,
        h1Count: h1Els.length,
        h1Text: h1Els[0] || null,
        h2Count: h2Els.length,
        h2Samples: h2Els.slice(0, 4),
        totalImages: allImgs.length,
        missingAltCount: imgsWithoutAlt.length,
        jsonLdCount: jsonLdScripts.length,
        jsonLdTypes: jsonLdScripts.map(s => s['@type'] || 'Unknown')
      };
    });

    spaResults.push({
      route: route.name,
      hash: route.hash,
      fullUrl,
      durationMs: duration,
      error: loadError,
      ...seoData
    });

    console.log(`[SPA AUDITED] ${route.name} (${route.hash}) -> H1: "${seoData.h1Text || 'NONE'}", Missing Alt: ${seoData.missingAltCount}/${seoData.totalImages}, Duration: ${duration}ms`);
  }

  await browser.close();

  const auditOutput = {
    timestamp: new Date().toISOString(),
    httpEndpoints: httpResults,
    spaPages: spaResults
  };

  const fs = require('fs');
  fs.writeFileSync(
    path.join(__dirname, 'seo_audit_results.json'),
    JSON.stringify(auditOutput, null, 2)
  );

  console.log('\n=== AUDIT COMPLETE: seo_audit_results.json successfully generated! ===');
})();
