const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OVERLAYS_TE = [
  {
    id: 1,
    badge: "AYESHA • RAIS 3D VIRTUAL PRESENTER",
    primary: "బయట చల్లని వర్షం... వేడి వేడిగా, క్రిస్పీగా ఏదైనా తినాలనిపిస్తుందా?",
    sub: "Pleasant rainy weather & craving something crispy?"
  },
  {
    id: 2,
    badge: "GENUINE CATALOGUE ITEM • ITC MASTER CHEF | SKU: RAIS-CHK-04",
    primary: "ట్రై చేయండి రుచికరమైన ITC Master Chef Chicken Momos!",
    sub: "Try delicious ITC Master Chef Chicken Momos — authentic restaurant taste!"
  },
  {
    id: 3,
    badge: "AUTHENTIC FOOD & PACKAGING SUPPLIES | SKUs: RAIS-VEG-01 • RAIS-BOX-02",
    primary: "గోల్డెన్ క్రిస్పీ French Fries మరియు Kraft ప్యాకేజింగ్ బాక్సెస్!",
    sub: "Golden crispy French Fries & Kraft packaging boxes!"
  }
];

async function generateTeluguOverlays() {
  const outDir = path.resolve('public/images/overlays_te');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });

  for (const item of OVERLAYS_TE) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Gautami&family=Inter:wght@400;600;700;800&display=swap');
      body {
        margin: 0;
        padding: 0;
        background: transparent;
        width: 1080px;
        height: 1920px;
        font-family: 'Inter', sans-serif;
        position: relative;
        overflow: hidden;
      }
      .top-pill {
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 15, 26, 0.94);
        border: 2px solid rgba(212, 175, 55, 0.9);
        border-radius: 28px;
        padding: 14px 44px;
        color: #d4af37;
        font-weight: 700;
        font-size: 24px;
        letter-spacing: 1.5px;
        text-align: center;
        box-shadow: 0 8px 24px rgba(0,0,0,0.6);
      }
      .lower-card {
        position: absolute;
        bottom: 170px;
        left: 50px;
        right: 50px;
        background: rgba(8, 12, 22, 0.95);
        border: 3px solid rgba(212, 175, 55, 0.88);
        border-radius: 28px;
        padding: 24px 36px 30px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.85);
        text-align: center;
      }
      .badge-tag {
        color: #d4af37;
        font-size: 21px;
        font-weight: 700;
        letter-spacing: 1.2px;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(212, 175, 55, 0.4);
      }
      .primary-text {
        font-family: 'Nirmala UI', 'Gautami', sans-serif;
        color: #ffffff;
        font-size: 34px;
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 8px;
        text-shadow: 0 2px 8px rgba(0,0,0,0.8);
      }
      .sub-text {
        color: #e5c07b;
        font-size: 24px;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    </style>
    </head>
    <body>
      <div class="top-pill">RAIS AGENCIES • RAYACHOTY • WHOLESALE</div>
      <div class="lower-card">
        <div class="badge-tag">${item.badge}</div>
        <div class="primary-text">${item.primary}</div>
        <div class="sub-text">${item.sub}</div>
      </div>
    </body>
    </html>
    `;

    await page.setContent(html);
    const dest = path.join(outDir, `overlay_sc1_shot_${item.id}.png`);
    await page.screenshot({ path: dest, omitBackground: true });
    console.log(`[TELUGU OVERLAY] Rendered: ${dest}`);
  }

  await browser.close();
  console.log('Telugu overlays generated successfully.');
}

generateTeluguOverlays();
