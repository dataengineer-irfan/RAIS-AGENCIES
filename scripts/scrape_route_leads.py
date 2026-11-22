from playwright.sync_api import sync_playwright
import json
import time
import os

ROUTES = [
    {"town": "Rayachoty", "query": "restaurants fast food cafes in Rayachoty"},
    {"town": "Kadiri", "query": "restaurants fast food cafes in Kadiri"},
    {"town": "Rajampeta", "query": "restaurants fast food cafes in Rajampet"}
]

def scrape_leads():
    all_leads = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="en-IN"
        )
        page = context.new_page()
        
        for route in ROUTES:
            town = route["town"]
            query = route["query"]
            print(f"Scouting leads for {town}...")
            url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=20000)
                time.sleep(4)
                
                # Find listing elements
                feed = page.locator('div[role="feed"]')
                if feed.count() > 0:
                    # Scroll down to load more
                    for _ in range(3):
                        feed.evaluate("el => el.scrollTop += 1500")
                        time.sleep(1.5)
                        
                # Extract listing links
                links = page.locator('a[href*="/maps/place/"]').all()
                seen = set()
                
                for link in links[:12]:
                    aria = link.get_attribute("aria-label") or ""
                    href = link.get_attribute("href") or ""
                    if aria and aria not in seen:
                        seen.add(aria)
                        all_leads.append({
                            "business_name": aria,
                            "location": town,
                            "maps_url": href,
                            "lead_type": "Cafe / Foodservice Operator",
                            "product_fit": "French Fries, Triken Momos, Milky Mist Cheese, Pizza Boxes"
                        })
            except Exception as e:
                print(f"Error scraping {town}: {e}")
                
        browser.close()
        
    print(f"Total leads found: {len(all_leads)}")
    out_path = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\src\data\scouted_route_leads.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_leads, f, indent=2, ensure_ascii=False)
        
    return all_leads

if __name__ == "__main__":
    scrape_leads()
