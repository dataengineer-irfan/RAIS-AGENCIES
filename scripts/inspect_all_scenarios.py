import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
import campaign_scenarios_data as d

for k, v in d.SCENARIOS.items():
    s1 = v["shots"][0]["image"]
    s2 = v["shots"][1]["image"]
    s3 = v["shots"][2]["image"]
    s4 = v["shots"][3]["image"]
    print(f"Scenario {k:02d}: {v['title']}")
    print(f"  Shot 1 (Char): {s1}")
    print(f"  Shot 2 (Prod1): {s2}")
    print(f"  Shot 3 (Prod2): {s3}")
    print(f"  Shot 4 (End):   {s4}")
