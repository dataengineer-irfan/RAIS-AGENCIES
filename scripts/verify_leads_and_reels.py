from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()
        
        # 1. Login to admin
        print("Logging in to Admin portal...")
        page.goto('https://dataengineer-irfan.github.io/RAIS-AGENCIES/#/admin', wait_until='networkidle')
        time.sleep(1)
        page.fill('input[type="text"]', 'rais.frozenfoods@gmail.com')
        page.fill('input[type="password"]', 'RAIS@516269')
        page.click('button:has-text("Sign In")')
        time.sleep(2)
        
        # 2. Check Instagram Enquiries / B2B Reels Hunter
        print("Inspecting Instagram Enquiries / Reels Hunter...")
        page.click('text=Instagram Enquiries Bot')
        time.sleep(2)
        page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_live_reels_hunter.png')
        
        # 3. Check B2B Leads CRM
        print("Inspecting B2B Leads CRM...")
        page.click('text=B2B Leads CRM')
        time.sleep(2)
        page.screenshot(path=r'c:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683\verify_live_b2b_leads.png')
        
        browser.close()
        print("Live verifications completed successfully.")

if __name__ == '__main__':
    run()
