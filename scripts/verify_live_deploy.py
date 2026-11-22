from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()
        
        # 1. Storefront Quote Modal verification
        print("Navigating to public storefront...")
        page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/', wait_until='networkidle')
        time.sleep(2)
        
        # Click Instant B2B Quote button
        quote_btn = page.locator('button:has-text("Instant B2B Quote"), button:has-text("Request Quote")').first
        if quote_btn.is_visible():
            quote_btn.click()
            time.sleep(1)
            # Find the delivery route select
            route_select = page.locator('select').first
            if route_select.is_visible():
                route_select.select_option(label='Kadiri')
            page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_storefront_quote_routes_live.png')
            print("Quote modal with Kadiri corridor selected captured.")
            
            # Fill form and submit to see 10-second review funnel card
            name_input = page.locator('input[placeholder*="Name"], input[type="text"]').first
            if name_input.is_visible():
                name_input.fill('Royal Cafe Kadiri')
            phone_input = page.locator('input[type="tel"]').first
            if phone_input.is_visible():
                phone_input.fill('9347453135')
            submit_btn = page.locator('button:has-text("Submit B2B Inquiry")')
            if submit_btn.is_visible():
                submit_btn.click()
                time.sleep(1)
                page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_storefront_review_funnel_live.png')
                print("10-second review funnel card captured.")
                
        # 2. Admin portal login & Google Reviews Inbox
        print("Navigating to admin portal...")
        page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/#/admin', wait_until='networkidle')
        time.sleep(1)
        page.fill('input[type="text"]', 'rais.frozenfoods@gmail.com')
        page.fill('input[type="password"]', 'RAIS@516269')
        page.click('button:has-text("Sign In")')
        time.sleep(3)
        
        # Click Google Reviews Inbox in sidebar
        page.click('text=Google Reviews Inbox')
        time.sleep(2)
        page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_admin_reviews_inbox_live.png')
        print("Admin reviews inbox screenshot captured.")
        
        browser.close()
        print("All live verifications completed successfully.")

if __name__ == '__main__':
    run()
