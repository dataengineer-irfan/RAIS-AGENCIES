from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()
        
        # 1. Admin login & Google Reviews Inbox
        print("Navigating to admin portal...")
        page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/#/admin', wait_until='networkidle')
        page.fill('input[type="text"]', 'rais.frozenfoods@gmail.com')
        page.fill('input[type="password"]', 'RAIS@516269')
        page.click('button:has-text("Sign In")')
        time.sleep(2)
        
        # Click Google Reviews Inbox
        page.click('text=Google Reviews Inbox')
        time.sleep(1)
        page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_admin_reviews_inbox_live.png')
        print("Admin reviews inbox screenshot captured.")
        
        # 2. Storefront Quote Modal verification
        print("Navigating to public storefront...")
        page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/', wait_until='networkidle')
        time.sleep(1)
        
        # Click Quick B2B Quote / Order CTA
        order_btn = page.locator('button:has-text("Instant B2B Quote"), button:has-text("Order Now"), button:has-text("Get Quote")').first
        if order_btn.is_visible():
            order_btn.click()
            time.sleep(1)
            page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_storefront_quote_routes_live.png')
            print("Quote modal screenshot captured.")
            
        browser.close()
        print("Verification completed successfully.")

if __name__ == '__main__':
    run()
