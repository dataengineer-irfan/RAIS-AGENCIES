import os
import time
from playwright.sync_api import sync_playwright

def run_tests():
    out_dir = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"
    base_url = "http://localhost:4173/RAIS-AGENCIES"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Test 1: Storefront Search Bar on Products Page
        print("Testing storefront search...")
        page.goto(f"{base_url}/#products")
        page.wait_for_timeout(2500)

        queries = [
            ("jalapeno", "Jalapenos"),
            ("baby cor", "Baby Corn"),
            ("musroom", "Button Mushroom"),
            ("soya sause", "Soya Sauce"),
            ("veniger", "Vinegar"),
            ("sudarshan", "Sudarshan Fresh Cream"),
            ("delmonte", "Del Monte"),
            ("foodcraft", "Foodcraft"),
            ("spics", "Spic's")
        ]

        for q, expected_match in queries:
            search_input = page.locator("input[placeholder*='Search']").first
            search_input.fill("")
            search_input.fill(q)
            page.wait_for_timeout(500)
            
            # Count product card titles
            titles = page.locator("h3.font-serif.font-bold").all_inner_texts()
            matching = [t for t in titles if t != "Product Catalogue QR Code" and t != "No products match your criteria"]
            print(f"Query: '{q}' -> Found {len(matching)} products: {matching[:3]}")
            
            if q == "jalapeno":
                page.screenshot(path=os.path.join(out_dir, "verify_search_jalapeno.png"))
            elif q == "baby cor":
                page.screenshot(path=os.path.join(out_dir, "verify_search_baby_corn.png"))
            elif q == "soya sause":
                page.screenshot(path=os.path.join(out_dir, "verify_search_soya_sause.png"))
            elif q == "sudarshan":
                page.screenshot(path=os.path.join(out_dir, "verify_search_sudarshan.png"))

        # Test 2: Admin Rayachoty Commercial Search Matrix (Local SEO tab)
        print("Testing Admin Local SEO tab...")
        page.goto(f"{base_url}/?google_auth=success#admin")
        page.wait_for_timeout(2500)
        
        # Click on Local SEO & Keywords tab
        page.locator("text=Local SEO & Keywords").first.click()
        page.wait_for_timeout(1500)
        
        # Check tab text
        tab_btn = page.locator("button:has-text('Target Keywords')").first
        tab_text = tab_btn.inner_text()
        print(f"SEO Tab text: {tab_text}")
        
        # Count rows in the Rayachoty Commercial Search Matrix table
        row_count = page.locator("tbody tr").count()
        print(f"Keywords Table Rows Count: {row_count}")
        
        page.screenshot(path=os.path.join(out_dir, "verify_admin_seo_matrix_18.png"))

        # Test 3: Admin Google Reviews Inbox
        print("Testing Admin Google Reviews Inbox...")
        page.locator("text=Google Reviews Inbox").first.click()
        page.wait_for_timeout(1500)
        
        # Check first review author
        first_author = page.locator(".text-sm.font-bold.text-white span").first.inner_text()
        print(f"Top Review Author in Inbox: {first_author}")
        page.screenshot(path=os.path.join(out_dir, "verify_admin_reviews_inbox_top.png"))

        browser.close()

    print("Verification script completed successfully!")

if __name__ == "__main__":
    run_tests()
