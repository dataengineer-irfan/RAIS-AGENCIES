from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/#/admin', wait_until='networkidle')
    time.sleep(1)
    page.fill('input[type="text"]', 'rais.frozenfoods@gmail.com')
    page.fill('input[type="password"]', 'RAIS@516269')
    page.click('button:has-text("Sign In")')
    time.sleep(2)
    
    # Click Google Analytics (GA4) in sidebar
    page.click('text=Google Analytics (GA4)')
    time.sleep(2)
    page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_live_ga4_hub.png')
    print('GA4 screenshot captured successfully!')
    browser.close()
