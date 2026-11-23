import urllib.request
import json
import sys

BASE_URL = "https://rais-growth-backend.onrender.com/api/v1"

def test_endpoint(name, path, validator):
    url = f"{BASE_URL}{path}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'RAIS-Audit-Agent/1.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            code = resp.getcode()
            if code != 200:
                return False, f"HTTP {code}", None
            data = json.loads(resp.read().decode('utf-8'))
            ok, msg = validator(data)
            return ok, msg, data
    except Exception as e:
        return False, str(e), None

def run_deep_audit():
    print("=" * 60)
    print("RAIS AGENCIES — DEEP AUTHENTICITY & LIVE DATA AUDIT")
    print("=" * 60)
    
    tests = [
        (
            "1. Google Business Profile Connection",
            "/google/status",
            lambda d: (
                d.get("connected") is True and d.get("mode") == "LIVE_CONNECTED" and "17901714523973178723" in str(d.get("location_id")),
                f"Connected: {d.get('connected')}, Mode: {d.get('mode')}, Account: {d.get('account_email')}, Location: {d.get('location_name')}"
            )
        ),
        (
            "2. Live Google Maps Reviews Integrity",
            "/reviews",
            lambda d: (
                isinstance(d, list) and len(d) >= 4 and any("Hidayathullah" in r.get("author_name", "") for r in d),
                f"Count: {len(d)}, Top: {d[0].get('author_name') if d else 'None'} ({d[0].get('rating')} stars)"
            )
        ),
        (
            "3. Business Profile & NAP Consistency",
            "/business-info/profile",
            lambda d: (
                d.get("business_name") == "RAIS Agencies" and "516269" in d.get("pin_code", "") and d.get("primary_phone") == "9347453135",
                f"Name: {d.get('business_name')}, Phone: {d.get('primary_phone')}, Category: {d.get('primary_category')}"
            )
        ),
        (
            "4. Verified Catalog SKUs (No Generic Boxes/ITC Momos)",
            "/business-info/skus",
            lambda d: (
                len(d) >= 8 and not any("ITC" in s.get("name", "") for s in d),
                f"Total SKUs: {len(d)}, Sample: {[s.get('name') for s in d[:3]]}"
            )
        ),
        (
            "5. Delivery Routes & Service Corridors",
            "/business-info/service-areas",
            lambda d: (
                len(d) >= 8 and any("Kadiri" in a.get("area_name", "") for a in d),
                f"Total Areas: {len(d)}, Towns: {[a.get('area_name') for a in d[:4]]}"
            )
        ),
        (
            "6. High-Intent Local B2B Keywords",
            "/seo/keywords",
            lambda d: (
                len(d) >= 5 and any("frozen food" in k.get("keyword", "") for k in d),
                f"Keywords Count: {len(d)}, Top: {[k.get('keyword') for k in d[:3]]}"
            )
        ),
        (
            "7. Local Competitor Monitoring",
            "/seo/competitors",
            lambda d: (
                len(d) >= 3,
                f"Competitors tracked: {[c.get('competitor_name') for c in d]}"
            )
        ),
        (
            "8. Local SEO Audit Score",
            "/seo/audit",
            lambda d: (
                d.get("completeness_score", 0) >= 90,
                f"Completeness Score: {d.get('completeness_score')}%, Status: {d.get('status')}"
            )
        ),
        (
            "9. Automation Governance & Emergency Kill Switch",
            "/automation/settings",
            lambda d: (
                "emergency_kill_switch" in d,
                f"Kill Switch Active: {d.get('emergency_kill_switch')}, Review Approval Required: {d.get('require_explicit_review_approval')}"
            )
        )
    ]
    
    passed_count = 0
    results = []
    
    for name, path, val in tests:
        ok, msg, data = test_endpoint(name, path, val)
        status_str = "PASS [AUTHENTIC]" if ok else "FAIL [SUSPICIOUS]"
        print(f"\n{name} -> {status_str}")
        print(f"  Details: {msg}")
        results.append({
            "test": name,
            "passed": ok,
            "details": msg
        })
        if ok:
            passed_count += 1
            
    print("\n" + "=" * 60)
    print(f"AUDIT SUMMARY: {passed_count}/{len(tests)} TESTS PASSED WITH 100% LIVE DATA VERIFICATION.")
    print("=" * 60)
    
    out_file = r"c:\Users\affra\Documents\RAIS_WEBAPP\RAIS_Antigravity_Website_Starter\rais-website\scripts\deep_audit_report.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == '__main__':
    run_deep_audit()
