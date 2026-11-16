import time
import json
import urllib.request
import urllib.error
import os

res_path = 'rais-website/scratch/agent_connect_res.json'
with open(res_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

device_code = data['device_code']
# Remove scratch file
try:
    os.remove(res_path)
except:
    pass

url = 'https://fal.ai/api/agent-connect/token'
payload = json.dumps({'device_code': device_code}).encode('utf-8')
env_paths = ['rais-website/.env', '.env']

start_time = time.time()
timeout = 600 # 10 minutes

while time.time() - start_time < timeout:
    req = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            status_code = resp.getcode()
            body = resp.read().decode('utf-8')
            if status_code == 200:
                # Key returned: format is usually FAL_KEY='...'
                for ep in env_paths:
                    with open(ep, 'a', encoding='utf-8') as ef:
                        ef.write(body.strip() + '\n')
                print('STATUS: 200')
                break
    except urllib.error.HTTPError as e:
        status_code = e.code
        if status_code in (202, 429) or (500 <= status_code < 600):
            time.sleep(3)
            continue
        elif status_code == 410:
            print('STATUS: 410 (Denied or Expired)')
            break
        else:
            print(f'STATUS: {status_code}')
            break
    except Exception as e:
        # Network retry
        time.sleep(3)
        continue
