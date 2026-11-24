import os
import time
import subprocess
from playwright.sync_api import sync_playwright

def run_tests():
    server = subprocess.Popen(
        ["npx", "vite", "preview", "--port", "4174"],
        cwd="rais-website",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=True
    )
    time.sleep(3)

    out_dir = r"C:\Users\affra\.gemini\antigravity\brain\483395d4-8829-4550-8a6a-7ddd35200683"
    base_url = "http://localhost:4174/RAIS-AGENCIES"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 1. Search for Soya Sauce
        page.goto(f"{base_url}/#products")
        page.wait_for_timeout(2500)

        search_input = page.locator("input[placeholder*='Search']").first
        search_input.fill("soya sause")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(out_dir, "verify_live_soya_sauce_real_photo.png"))
        print("Captured verify_live_soya_sauce_real_photo.png")

        # 2. Search for Green Chilli Sauce
        search_input.fill("")
        search_input.fill("green chilli")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(out_dir, "verify_live_green_chilli_real_photo.png"))
        print("Captured verify_live_green_chilli_real_photo.png")

        # 3. Search for Panko
        search_input.fill("")
        search_input.fill("panko")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(out_dir, "verify_live_panko_real_photo.png"))
        print("Captured verify_live_panko_real_photo.png")

        browser.close()

    server.terminate()
    print("Verification completed successfully!")

if __name__ == "__main__":
    run_tests()
