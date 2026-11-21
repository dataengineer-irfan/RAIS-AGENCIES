import json
import re
import os
import shutil

# 1. Load existing products from public/catalogue.html
with open('public/catalogue.html', 'r', encoding='utf-8') as f:
    orig_text = f.read()

m = re.search(r'const products = (\[.*?\]);', orig_text, re.DOTALL)
if not m:
    print("Could not find products array!")
    exit(1)

products = json.loads(m.group(1))
print(f"Loaded {len(products)} products from catalogue.html")

# 2. Load catalogue.ts for exact SKU codes
with open('src/data/catalogue.ts', 'r', encoding='utf-8') as f:
    ts_text = f.read()

skus = re.findall(r"sku:\s*'([^']+)'", ts_text)

# 3. Enrich products
brands_set = set()
for i, p in enumerate(products):
    if i < len(skus):
        p['sku'] = skus[i]
    else:
        p['sku'] = f"SKU-{i+1:03d}"
    
    # Extract pack
    pack_match = re.search(r'\(([^)]+)\)', p['product_name'])
    if pack_match:
        p['pack'] = pack_match.group(1)
    else:
        p['pack'] = "Commercial Pack"

    # Category short name
    cat_parts = p['category'].split('. ')
    p['cat_short'] = cat_parts[1] if len(cat_parts) > 1 else p['category']

    # Clean brand name
    brand = p.get('brand', 'RAIS Verified').strip()
    p['brand'] = brand
    brands_set.add(brand)

sorted_brands = sorted(list(brands_set))
print(f"Enriched {len(products)} products with SKUs and packs. {len(sorted_brands)} unique brands.")

# Brand badge colors
brand_colors = {
    'TRIKEN': {'bg': '#fff7ed', 'border': '#fdba74', 'text': '#c2410c'},
    'Master Chef': {'bg': '#eff6ff', 'border': '#93c5fd', 'text': '#1d4ed8'},
    'ITC Master Chef': {'bg': '#eff6ff', 'border': '#93c5fd', 'text': '#1d4ed8'},
    'RAIS Master': {'bg': '#f0fdf4', 'border': '#86efac', 'text': '#15803d'},
    'Nutrich': {'bg': '#fef2f2', 'border': '#fca5a5', 'text': '#b91c1c'},
    'AMUL': {'bg': '#fff7ed', 'border': '#fdba74', 'text': '#c2410c'},
    'Amul': {'bg': '#fff7ed', 'border': '#fdba74', 'text': '#c2410c'},
    'Del Monte': {'bg': '#fdf2f8', 'border': '#f472b6', 'text': '#9d174d'},
    'Milky Mist': {'bg': '#ecfdf5', 'border': '#6ee7b7', 'text': '#047857'},
    'Godrej': {'bg': '#f0fdf4', 'border': '#86efac', 'text': '#166534'},
    'Foodrite': {'bg': '#fef2f2', 'border': '#fca5a5', 'text': '#991b1b'},
    'MANAMA': {'bg': '#f0f9ff', 'border': '#7dd3fc', 'text': '#0369a1'},
    'Bake Fresh': {'bg': '#fffbeb', 'border': '#fcd34d', 'text': '#b45309'},
    'Pure Spices': {'bg': '#fff1f2', 'border': '#fda4af', 'text': '#be123c'},
    'Packaging Solutions': {'bg': '#f8fafc', 'border': '#cbd5e1', 'text': '#334155'}
}

# 4. Generate Enhanced HTML
html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RAIS Agencies — Wholesale Food Service Master Catalogue | Rayachoty Hub</title>
<meta name="description" content="Explore 90+ verified commercial food service SKUs from RAIS Agencies Rayachoty: Frozen Chicken & Veg Snacks, Dairy, Gourmet Sauces, Syrups & Food Packaging. Direct depot pickup & cold-chain delivery.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root {{
    --navy-950: #030712;
    --navy-900: #0b1329;
    --navy-800: #0f1c3f;
    --navy-700: #1e3a8a;
    --blue-600: #2563eb;
    --blue-500: #3b82f6;
    --cyan-400: #38bdf8;
    --cyan-500: #06b6d4;
    --gold-400: #fbbf24;
    --gold-500: #f59e0b;
    --green-500: #22c55e;
    --green-600: #16a34a;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    --card-bg: #ffffff;
    --border-color: #e2e8f0;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 16px -2px rgba(15,23,42,0.06);
    --shadow-lg: 0 12px 28px -4px rgba(15,23,42,0.1);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-full: 9999px;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #f8fafc;
    color: var(--slate-900);
    line-height: 1.5;
    padding-bottom: 90px;
    -webkit-font-smoothing: antialiased;
  }}

  a {{
    text-decoration: none;
    color: inherit;
  }}

  .container {{
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 16px;
  }}

  /* HEADER */
  .main-header {{
    background: linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 45%, var(--navy-800) 100%);
    color: #ffffff;
    padding: 36px 0 28px;
    border-bottom: 3px solid var(--gold-500);
    position: relative;
    overflow: hidden;
  }}

  .main-header::before {{
    content: '';
    position: absolute;
    top: 0;
    left: 15%;
    width: 600px;
    height: 100%;
    background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%);
    pointer-events: none;
  }}

  .header-content {{
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }}

  .brand-pill {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 6px 18px;
    border-radius: var(--radius-full);
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--gold-400);
    margin-bottom: 14px;
  }}

  .brand-pill .sparkle {{
    color: var(--cyan-400);
  }}

  .header-title {{
    font-size: 32px;
    font-weight: 900;
    letter-spacing: -0.7px;
    line-height: 1.2;
    margin-bottom: 8px;
    color: #ffffff;
  }}

  .header-title span {{
    background: linear-gradient(135deg, var(--cyan-400) 0%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}

  .header-tagline {{
    font-size: 14.5px;
    color: var(--slate-300);
    max-width: 820px;
    margin-bottom: 14px;
    font-weight: 500;
  }}

  .depot-location {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 6px 16px;
    border-radius: var(--radius-full);
    font-size: 12.5px;
    color: var(--slate-300);
    margin-bottom: 20px;
  }}

  .depot-location strong {{
    color: #ffffff;
  }}

  /* HEADER VALUE PROPS */
  .header-props {{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-bottom: 22px;
  }}

  .prop-item {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 600;
    color: #e2e8f0;
  }}

  /* HEADER ACTION BUTTONS */
  .header-buttons {{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }}

  .h-btn {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }}

  .h-btn-wa {{
    background: var(--green-500);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
  }}

  .h-btn-wa:hover {{
    background: var(--green-600);
    transform: translateY(-2px);
  }}

  .h-btn-qr {{
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  }}

  .h-btn-qr:hover {{
    background: #0284c7;
    transform: translateY(-2px);
  }}

  .h-btn-print {{
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }}

  .h-btn-print:hover {{
    background: rgba(255, 255, 255, 0.2);
  }}

  .h-btn-web {{
    background: rgba(255, 255, 255, 0.08);
    color: var(--cyan-400);
    border: 1px solid rgba(56, 189, 248, 0.3);
  }}

  .h-btn-web:hover {{
    background: rgba(56, 189, 248, 0.15);
  }}

  /* CONTROLS BAR (STICKY) */
  .controls-wrapper {{
    position: sticky;
    top: 0;
    z-index: 40;
    background: #f8fafc;
    padding: 16px 0 12px;
    transition: all 0.2s ease;
  }}

  .controls-card {{
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 16px 20px;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }}

  .search-filter-row {{
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }}

  .search-wrap {{
    position: relative;
    flex: 1;
    min-width: 280px;
  }}

  .search-icon {{
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--slate-400);
    pointer-events: none;
    font-size: 16px;
  }}

  .search-input {{
    width: 100%;
    padding: 12px 40px 12px 42px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--slate-200);
    font-size: 14px;
    font-family: inherit;
    outline: none;
    background: #f8fafc;
    transition: all 0.2s ease;
  }}

  .search-input:focus {{
    border-color: var(--cyan-500);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
  }}

  .clear-btn {{
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--slate-400);
    cursor: pointer;
    font-size: 16px;
    display: none;
  }}

  .brand-select {{
    padding: 12px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--slate-200);
    font-size: 13.5px;
    font-weight: 600;
    font-family: inherit;
    background: #f8fafc;
    color: var(--slate-700);
    outline: none;
    cursor: pointer;
    min-width: 180px;
  }}

  .brand-select:focus {{
    border-color: var(--cyan-500);
  }}

  .view-toggles {{
    display: flex;
    gap: 4px;
    background: var(--slate-100);
    padding: 4px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--slate-200);
  }}

  .view-btn {{
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    background: none;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--slate-600);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }}

  .view-btn.active {{
    background: #ffffff;
    color: var(--navy-900);
    box-shadow: var(--shadow-sm);
  }}

  /* CATEGORY SCROLL BAR */
  .category-scroll {{
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;
  }}

  .category-scroll::-webkit-scrollbar {{
    height: 5px;
  }}
  .category-scroll::-webkit-scrollbar-thumb {{
    background: var(--slate-300);
    border-radius: 4px;
  }}

  .cat-btn {{
    padding: 7px 16px;
    border-radius: var(--radius-full);
    background: var(--slate-100);
    color: var(--slate-700);
    border: 1px solid var(--slate-200);
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }}

  .cat-btn:hover {{
    background: var(--slate-200);
    color: var(--slate-900);
  }}

  .cat-btn.active {{
    background: var(--navy-900);
    color: #ffffff;
    border-color: var(--navy-900);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
  }}

  .cat-count {{
    background: rgba(0, 0, 0, 0.08);
    font-size: 11px;
    padding: 1px 7px;
    border-radius: var(--radius-full);
  }}

  .cat-btn.active .cat-count {{
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }}

  /* STATS ROW */
  .stats-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--slate-500);
    margin: 12px 4px 18px;
  }}

  .stats-count strong {{
    color: var(--navy-900);
  }}

  .cold-chain-indicator {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #0284c7;
    background: #e0f2fe;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 700;
  }}

  /* GRID VIEW */
  .product-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }}

  .card {{
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--shadow-sm);
    position: relative;
  }}

  .card:hover {{
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: #cbd5e1;
  }}

  .card-img-wrap {{
    height: 190px;
    background: #f8fafc;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--slate-100);
  }}

  .card-img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }}

  .card:hover .card-img {{
    transform: scale(1.06);
  }}

  .cat-badge {{
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(15, 23, 42, 0.88);
    backdrop-filter: blur(6px);
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 2;
  }}

  .sku-badge {{
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(6px);
    color: var(--slate-700);
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid var(--slate-200);
    font-family: monospace;
    z-index: 2;
  }}

  .card-body {{
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
  }}

  .brand-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }}

  .brand-tag {{
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 2px 8px;
    border-radius: 4px;
    background: #f1f5f9;
    color: var(--slate-700);
  }}

  .pack-tag {{
    font-size: 11px;
    font-weight: 700;
    color: var(--slate-500);
    background: var(--slate-100);
    padding: 2px 7px;
    border-radius: 4px;
  }}

  .prod-name {{
    font-size: 14.5px;
    font-weight: 800;
    color: var(--slate-900);
    line-height: 1.35;
    margin-bottom: 12px;
    flex: 1;
  }}

  .card-meta {{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-size: 11.5px;
    font-weight: 600;
  }}

  .stock-pill {{
    color: var(--green-600);
    background: #dcfce7;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
  }}

  .card-actions {{
    display: flex;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--slate-100);
  }}

  .btn-add-po {{
    flex: 1;
    background: var(--slate-100);
    color: var(--slate-700);
    border: 1px solid var(--slate-200);
    font-size: 12px;
    font-weight: 700;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.2s ease;
  }}

  .btn-add-po:hover {{
    background: var(--navy-900);
    color: #ffffff;
    border-color: var(--navy-900);
  }}

  .btn-add-po.added {{
    background: #0284c7;
    color: #ffffff;
    border-color: #0284c7;
  }}

  .btn-wa-single {{
    background: var(--green-500);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: background 0.2s;
    white-space: nowrap;
  }}

  .btn-wa-single:hover {{
    background: var(--green-600);
  }}

  /* TABLE VIEW */
  .table-container {{
    display: none;
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow-x: auto;
    box-shadow: var(--shadow-sm);
  }}

  .b2b-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }}

  .b2b-table th {{
    background: var(--slate-900);
    color: #ffffff;
    padding: 12px 16px;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }}

  .b2b-table td {{
    padding: 12px 16px;
    border-bottom: 1px solid var(--slate-100);
    vertical-align: middle;
  }}

  .b2b-table tr:hover td {{
    background: var(--slate-50);
  }}

  .table-thumb {{
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--slate-200);
  }}

  /* FLOATING WHOLESALE ORDER BAR */
  .floating-po-bar {{
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(120px);
    z-index: 50;
    background: linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%);
    color: #ffffff;
    padding: 12px 24px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--cyan-400);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }}

  .floating-po-bar.visible {{
    transform: translateX(-50%) translateY(0);
  }}

  .po-count-badge {{
    background: var(--gold-500);
    color: var(--navy-950);
    font-size: 12px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-full);
  }}

  .po-text {{
    font-size: 13.5px;
    font-weight: 700;
  }}

  .btn-open-po {{
    background: var(--green-500);
    color: #ffffff;
    border: none;
    padding: 8px 18px;
    border-radius: var(--radius-full);
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
  }}

  .btn-open-po:hover {{
    background: var(--green-600);
    transform: scale(1.03);
  }}

  /* MODALS */
  .modal-overlay {{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(3, 7, 18, 0.75);
    backdrop-filter: blur(8px);
    z-index: 100;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }}

  .modal-overlay.active {{
    display: flex;
  }}

  .modal-card {{
    background: #ffffff;
    border-radius: var(--radius-lg);
    max-width: 560px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    border: 1px solid var(--slate-200);
    position: relative;
    padding: 24px;
    animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }}

  @keyframes modalIn {{
    from {{ opacity: 0; transform: scale(0.96) translateY(10px); }}
    to {{ opacity: 1; transform: scale(1) translateY(0); }}
  }}

  .modal-close {{
    position: absolute;
    top: 18px;
    right: 18px;
    background: var(--slate-100);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    font-size: 16px;
    font-weight: 700;
    color: var(--slate-600);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }}

  .modal-close:hover {{
    background: var(--slate-200);
    color: var(--slate-900);
  }}

  .modal-title {{
    font-size: 20px;
    font-weight: 800;
    color: var(--navy-900);
    margin-bottom: 6px;
  }}

  .modal-desc {{
    font-size: 13px;
    color: var(--slate-500);
    margin-bottom: 18px;
  }}

  /* QR MODAL DETAILS */
  .qr-box {{
    background: var(--slate-50);
    border: 2px dashed var(--slate-200);
    border-radius: var(--radius-md);
    padding: 20px;
    text-align: center;
    margin-bottom: 18px;
  }}

  .qr-img {{
    width: 220px;
    height: 220px;
    display: block;
    margin: 0 auto 12px;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
  }}

  .qr-url {{
    font-size: 12px;
    font-family: monospace;
    color: var(--slate-600);
    word-break: break-all;
    background: #ffffff;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--slate-200);
  }}

  .qr-downloads {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-top: 16px;
  }}

  .qr-dl-btn {{
    background: var(--slate-100);
    color: var(--slate-700);
    border: 1px solid var(--slate-200);
    padding: 10px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }}

  .qr-dl-btn:hover {{
    background: var(--navy-900);
    color: #ffffff;
    border-color: var(--navy-900);
  }}

  .qr-dl-btn.standee {{
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: #ffffff;
    border-color: #0284c7;
    grid-column: 1 / -1;
  }}

  /* PO DRAWER DETAILS */
  .po-items-list {{
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 16px;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-sm);
  }}

  .po-item-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid var(--slate-100);
    font-size: 13px;
  }}

  .po-item-row:last-child {{
    border-bottom: none;
  }}

  .po-item-info {{
    flex: 1;
  }}

  .po-item-name {{
    font-weight: 700;
    color: var(--slate-900);
  }}

  .po-item-pack {{
    font-size: 11px;
    color: var(--slate-500);
  }}

  .po-qty-ctrl {{
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 12px;
  }}

  .qty-btn {{
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid var(--slate-300);
    background: var(--slate-100);
    cursor: pointer;
    font-weight: 800;
    font-size: 14px;
  }}

  .qty-btn:hover {{
    background: var(--slate-200);
  }}

  .qty-val {{
    font-weight: 700;
    min-width: 20px;
    text-align: center;
  }}

  .po-form-group {{
    margin-bottom: 14px;
  }}

  .po-form-label {{
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: var(--slate-700);
    margin-bottom: 4px;
  }}

  .po-form-input {{
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--slate-200);
    font-size: 13px;
    font-family: inherit;
    outline: none;
  }}

  .po-form-input:focus {{
    border-color: var(--cyan-500);
  }}

  .po-submit-btn {{
    width: 100%;
    background: var(--green-500);
    color: #ffffff;
    border: none;
    padding: 14px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
  }}

  .po-submit-btn:hover {{
    background: var(--green-600);
  }}

  /* FOOTER */
  .page-footer {{
    background: var(--slate-900);
    color: var(--slate-400);
    padding: 40px 0 32px;
    margin-top: 60px;
    font-size: 13px;
    text-align: center;
    border-top: 1px solid var(--slate-800);
  }}

  .footer-links {{
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }}

  .footer-links a {{
    color: var(--cyan-400);
    font-weight: 600;
  }}

  /* PRINT STYLES */
  @media print {{
    body {{
      background: #ffffff !important;
      color: #000000 !important;
      padding-bottom: 0 !important;
    }}
    .main-header {{
      background: none !important;
      color: #000000 !important;
      padding: 10px 0 !important;
      border-bottom: 2px solid #000000 !important;
    }}
    .main-header::before,
    .controls-wrapper,
    .header-buttons,
    .floating-po-bar,
    .modal-overlay,
    .card-actions,
    .cat-badge,
    .sku-badge,
    .page-footer {{
      display: none !important;
    }}
    .header-title {{
      color: #000000 !important;
      font-size: 22px !important;
    }}
    .header-title span {{
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }}
    .header-tagline, .depot-location {{
      color: #333333 !important;
      font-size: 11px !important;
      border: none !important;
      background: none !important;
    }}
    .table-container {{
      display: block !important;
      border: 1px solid #000000 !important;
    }}
    .product-grid {{
      display: none !important;
    }}
    .b2b-table th {{
      background: #f1f5f9 !important;
      color: #000000 !important;
      border-bottom: 1px solid #000000 !important;
    }}
    .b2b-table td {{
      color: #000000 !important;
      border-bottom: 1px solid #cccccc !important;
      padding: 6px 8px !important;
      font-size: 11px !important;
    }}
    .table-thumb {{
      display: none !important;
    }}
  }}
</style>
</head>
<body>

<!-- MAIN HEADER -->
<header class="main-header">
  <div class="container header-content">
    <div class="brand-pill">
      <span>🦁 RAIS AGENCIES</span>
      <span class="sparkle">✦</span>
      <span>Rayachoty Wholesale Hub</span>
    </div>
    <h1 class="header-title">
      Wholesale Food Service <span>Master Catalogue</span>
    </h1>
    <p class="header-tagline">
      Complete commercial supply for Rayachoty & Annamayya District Cafes, Fast Food Centers, Bakeries, Restaurants & Cloud Kitchens.
    </p>
    <div class="depot-location">
      📍 Depot: <strong>Beside Indel Money Bank, Sundupalli Road, Near Reddies Colony, Rayachoti – 516269</strong>
    </div>

    <div class="header-props">
      <div class="prop-item">❄️ -18°C Deep Freeze Cold-Chain Fleet</div>
      <div class="prop-item">⚡ Direct Depot Pickup & Fleet Dispatch</div>
      <div class="prop-item">📦 90 Commercial Food Service SKUs</div>
      <div class="prop-item">🤝 Amul • Del Monte • Milky Mist • ITC • Triken</div>
    </div>

    <div class="header-buttons">
      <a class="h-btn h-btn-wa" href="https://wa.me/919347453135?text=Hello%20RAIS%20Agencies,%20I%20would%20like%20to%20enquire%20about%20commercial%20wholesale%20rates%20for%20my%20outlet." target="_blank">
        💬 WhatsApp Wholesale Rates (+91 93474 53135)
      </a>
      <button class="h-btn h-btn-qr" onclick="openQrModal()">
        📱 Scan / Download QR Code
      </button>
      <button class="h-btn h-btn-print" onclick="window.print()">
        🖨️ Print Price Sheet / PDF
      </button>
      <a class="h-btn h-btn-web" href="./index.html">
        🌐 Back to Main Website
      </a>
    </div>
  </div>
</header>

<!-- CONTROLS BAR -->
<div class="controls-wrapper">
  <div class="container">
    <div class="controls-card">
      <div class="search-filter-row">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="searchInput" class="search-input" placeholder="Search 90 SKUs (e.g. 'fries', 'mozzarella', 'mayo', 'crush', 'momos', 'burger box')..." onkeyup="handleSearch()" />
          <button id="clearSearchBtn" class="clear-btn" onclick="clearSearch()">✕</button>
        </div>

        <select id="brandSelect" class="brand-select" onchange="filterProducts()">
          <option value="ALL">All Brands (30+ Partners)</option>
          {''.join([f'<option value="{b}">{b}</option>' for b in sorted_brands])}
        </select>

        <div class="view-toggles">
          <button id="gridBtn" class="view-btn active" onclick="setViewMode('grid')">
            🔲 Grid
          </button>
          <button id="tableBtn" class="view-btn" onclick="setViewMode('table')">
            📋 Table
          </button>
        </div>
      </div>

      <!-- CATEGORY TABS -->
      <div class="category-scroll" id="catTabs">
        <button class="cat-btn active" onclick="setCategory('ALL')">
          All Products <span class="cat-count">90</span>
        </button>
        <button class="cat-btn" onclick="setCategory('1. Frozen Non-Veg Snacks (Chicken)')">
          🍗 Chicken Snacks <span class="cat-count">6</span>
        </button>
        <button class="cat-btn" onclick="setCategory('2. Frozen Veg Snacks & Fries')">
          🍟 Veg Snacks & Fries <span class="cat-count">14</span>
        </button>
        <button class="cat-btn" onclick="setCategory('3. Dairy Essentials & Sweet Corn')">
          🧀 Dairy Essentials <span class="cat-count">8</span>
        </button>
        <button class="cat-btn" onclick="setCategory('4. Bakery, Buns & Pizza Bases')">
          🍔 Bakery & Bases <span class="cat-count">5</span>
        </button>
        <button class="cat-btn" onclick="setCategory('5. Gourmet Sauces, Mayonnaise & Condiments')">
          🥫 Sauces & Condiments <span class="cat-count">24</span>
        </button>
        <button class="cat-btn" onclick="setCategory('6. Mojito Syrups, Fruit Crushes & Dessert Dressings')">
          🍹 Mojitos & Crushes <span class="cat-count">12</span>
        </button>
        <button class="cat-btn" onclick="setCategory('7. Spices, Seasonings & Breading')">
          🌶️ Spices & Seasonings <span class="cat-count">9</span>
        </button>
        <button class="cat-btn" onclick="setCategory('8. Food Packaging & Disposables')">
          📦 Food Packaging <span class="cat-count">12</span>
        </button>
      </div>
    </div>

    <!-- STATS BAR -->
    <div class="stats-bar">
      <div class="stats-count" id="statsCount">Showing <strong>90 of 90</strong> products</div>
      <div class="cold-chain-indicator">❄️ Guaranteed Sub-Zero Cold-Chain Direct to Outlet</div>
    </div>
  </div>
</div>

<!-- PRODUCTS CONTAINER -->
<main class="container">
  <!-- GRID VIEW -->
  <div class="product-grid" id="productGrid"></div>

  <!-- TABLE VIEW -->
  <div class="table-container" id="tableContainer">
    <table class="b2b-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>SKU</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Pack Spec</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
  </div>
</main>

<!-- FLOATING WHOLESALE ORDER BAR -->
<div class="floating-po-bar" id="floatingPoBar">
  <span class="po-count-badge" id="poBadgeCount">0</span>
  <span class="po-text">Items in Wholesale Enquiry</span>
  <button class="btn-open-po" onclick="openPoModal()">
    <span>📋 Review & WhatsApp PO</span>
  </button>
</div>

<!-- QR CODE MODAL -->
<div class="modal-overlay" id="qrModal" onclick="closeModalOnBg(event, 'qrModal')">
  <div class="modal-card">
    <button class="modal-close" onclick="closeQrModal()">✕</button>
    <h3 class="modal-title">📱 Product Catalogue QR Code</h3>
    <p class="modal-desc">
      Scan with any smartphone camera to open the live 90-SKU wholesale catalogue, or download ready-to-print flyers for your counter.
    </p>

    <div class="qr-box">
      <img src="images/catalogue_qr_code.png" alt="RAIS Agencies Catalogue QR Code" class="qr-img" />
      <div class="qr-url">https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html</div>
    </div>

    <div class="qr-downloads">
      <a href="images/catalogue_qr_code.png" download="RAIS-Agencies-Catalogue-QR.png" class="qr-dl-btn">
        <span>📥 Download QR PNG</span>
        <small style="color:var(--slate-400);">High-Res 300 DPI</small>
      </a>
      <a href="images/catalogue_qr_code.svg" download="RAIS-Agencies-Catalogue-QR.svg" class="qr-dl-btn">
        <span>📐 Download Vector SVG</span>
        <small style="color:var(--slate-400);">Infinite Scale Print</small>
      </a>
      <a href="images/catalogue_qr_standee_card.png" download="RAIS-Agencies-Catalogue-Standee.png" class="qr-dl-btn standee">
        <span>🪧 Download Counter Standee Card (Flyer)</span>
        <small style="color:#e0f2fe;">1200x1600px Ready to Print & Display</small>
      </a>
    </div>
  </div>
</div>

<!-- WHOLESALE PO DRAWER / MODAL -->
<div class="modal-overlay" id="poModal" onclick="closeModalOnBg(event, 'poModal')">
  <div class="modal-card">
    <button class="modal-close" onclick="closePoModal()">✕</button>
    <h3 class="modal-title">📋 Multi-SKU Wholesale Quote Request</h3>
    <p class="modal-desc">
      Review your selected products and send a consolidated Purchase Order enquiry directly to RAIS Agencies wholesale team.
    </p>

    <div class="po-items-list" id="poItemsList"></div>

    <div class="po-form-group">
      <label class="po-form-label">Outlet / Business Name</label>
      <input type="text" id="outletNameInput" class="po-form-input" placeholder="e.g. Star Cafe & Fast Food / Royal Bakery" />
    </div>

    <div class="po-form-group">
      <label class="po-form-label">Location / Town</label>
      <input type="text" id="outletLocInput" class="po-form-input" placeholder="e.g. Rayachoti / Rajampet / Kadapa Road" />
    </div>

    <button class="po-submit-btn" onclick="sendConsolidatedPo()">
      <span>📲 Send Wholesale PO to WhatsApp (+91 93474 53135)</span>
    </button>
  </div>
</div>

<!-- FOOTER -->
<footer class="page-footer">
  <div class="container">
    <div class="footer-links">
      <a href="./index.html">Home</a>
      <a href="./index.html#/products">Products Page</a>
      <a href="https://wa.me/919347453135">WhatsApp Sourcing</a>
      <a href="tel:+919347453135">Hotline: 93474 53135</a>
    </div>
    <p style="margin-bottom: 8px;">
      <strong>RAIS Agencies — Wholesale Food Solutions & Cold-Chain Logistics</strong>
    </p>
    <p style="margin-bottom: 8px;">
      Beside Indel Money Bank, Sundupalli Road, Near Reddies Colony, Rayachoti – 516269 (Annamayya Dist) | Contact: +91 93474 53135
    </p>
    <p style="font-size: 11.5px; color: var(--slate-500);">
      Consolidated wholesale food service distributor serving HORECA, Cafes, Bakeries, QSRs & Fast Food Centers across Rayachoty & Annamayya District.
    </p>
  </div>
</footer>

<!-- PRODUCT DATA & ENGINE -->
<script>
  const products = {json.dumps(products)};
  
  let activeCategory = 'ALL';
  let viewMode = 'grid';
  let quoteBasket = {{}}; // sku -> {{ product, qty }}

  function renderView() {{
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    const brandFilter = document.getElementById('brandSelect').value;

    const filtered = products.filter(item => {{
      const matchCat = (activeCategory === 'ALL' || item.category === activeCategory);
      const matchBrand = (brandFilter === 'ALL' || item.brand === brandFilter);
      const matchSearch = (!q || 
        item.product_name.toLowerCase().includes(q) || 
        item.brand.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q)) ||
        (item.req_name && item.req_name.toLowerCase().includes(q)) ||
        (item.pack && item.pack.toLowerCase().includes(q))
      );
      return matchCat && matchBrand && matchSearch;
    }});

    document.getElementById('statsCount').innerHTML = `Showing <strong>${{filtered.length}} of ${{products.length}}</strong> products`;

    if (viewMode === 'grid') {{
      renderCards(filtered);
    }} else {{
      renderTable(filtered);
    }}
  }}

  function renderCards(list) {{
    const grid = document.getElementById('productGrid');
    if (!list.length) {{
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 64px 20px; color: #64748b; font-size: 15px; font-weight: 600;">No products matched your search or filter. Try clearing filters.</div>';
      return;
    }}

    grid.innerHTML = list.map(item => {{
      const catShort = item.cat_short || item.category;
      const waMsg = encodeURIComponent(`Hello RAIS Agencies, I would like to enquire about wholesale pricing & stock availability for:\\n- Item: ${{item.product_name}}\\n- SKU: ${{item.sku}}\\n- Brand: ${{item.brand}}\\n- Pack: ${{item.pack}}\\nMy outlet is located in [Your Area].`);
      const isAdded = quoteBasket[item.sku] ? 'added' : '';
      const addText = quoteBasket[item.sku] ? '✓ Added' : '➕ Add to PO';

      return `
        <div class="card" id="card-${{item.sku}}">
          <div class="card-img-wrap">
            <span class="cat-badge">${{catShort}}</span>
            <span class="sku-badge">${{item.sku}}</span>
            <img class="card-img" src="${{item.b64}}" alt="${{item.product_name}}" loading="lazy" />
          </div>
          <div class="card-body">
            <div class="brand-row">
              <span class="brand-tag">${{item.brand}}</span>
              <span class="pack-tag">${{item.pack}}</span>
            </div>
            <h3 class="prod-name">${{item.product_name}}</h3>
            <div class="card-meta">
              <span class="stock-pill">✓ Ready Stock</span>
              <span style="color:#64748b; font-size:11px;">Depot Dispatch</span>
            </div>
            <div class="card-actions">
              <button class="btn-add-po ${{isAdded}}" onclick="toggleBasket('${{item.sku}}')">
                ${{addText}}
              </button>
              <a class="btn-wa-single" href="https://wa.me/919347453135?text=${{waMsg}}" target="_blank">
                💬 Request Price
              </a>
            </div>
          </div>
        </div>
      `;
    }}).join('');
  }}

  function renderTable(list) {{
    const tbody = document.getElementById('tableBody');
    if (!list.length) {{
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px; color: #64748b;">No products match your criteria.</td></tr>';
      return;
    }}

    tbody.innerHTML = list.map(item => {{
      const waMsg = encodeURIComponent(`Hello RAIS Agencies, I need wholesale rates for: ${{item.product_name}} (${{item.brand}}, Pack: ${{item.pack}}).`);
      const isAdded = quoteBasket[item.sku] ? 'added' : '';
      const addText = quoteBasket[item.sku] ? '✓ Added' : '➕ Add';

      return `
        <tr>
          <td><img src="${{item.b64}}" alt="${{item.product_name}}" class="table-thumb" /></td>
          <td><strong style="font-family:monospace; color:#0284c7;">${{item.sku}}</strong></td>
          <td><strong>${{item.product_name}}</strong></td>
          <td><span style="font-size:11.5px; color:#64748b;">${{item.cat_short || item.category}}</span></td>
          <td><span class="brand-tag">${{item.brand}}</span></td>
          <td><span class="pack-tag">${{item.pack}}</span></td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn-add-po ${{isAdded}}" style="padding:5px 8px; font-size:11px;" onclick="toggleBasket('${{item.sku}}')">
                ${{addText}}
              </button>
              <a class="btn-wa-single" style="padding:5px 8px; font-size:11px;" href="https://wa.me/919347453135?text=${{waMsg}}" target="_blank">
                💬 Price
              </a>
            </div>
          </td>
        </tr>
      `;
    }}).join('');
  }}

  function handleSearch() {{
    const q = document.getElementById('searchInput').value;
    document.getElementById('clearSearchBtn').style.display = q ? 'block' : 'none';
    renderView();
  }}

  function clearSearch() {{
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearchBtn').style.display = 'none';
    renderView();
  }}

  function filterProducts() {{
    renderView();
  }}

  function setCategory(cat) {{
    activeCategory = cat;
    const buttons = document.querySelectorAll('#catTabs button');
    buttons.forEach(btn => {{
      if (btn.getAttribute('onclick').includes(cat)) {{
        btn.classList.add('active');
      }} else {{
        btn.classList.remove('active');
      }}
    }});
    renderView();
  }}

  function setViewMode(mode) {{
    viewMode = mode;
    const gridEl = document.getElementById('productGrid');
    const tableEl = document.getElementById('tableContainer');
    const gridBtn = document.getElementById('gridBtn');
    const tableBtn = document.getElementById('tableBtn');

    if (mode === 'grid') {{
      gridEl.style.display = 'grid';
      tableEl.style.display = 'none';
      gridBtn.classList.add('active');
      tableBtn.classList.remove('active');
    }} else {{
      gridEl.style.display = 'none';
      tableEl.style.display = 'block';
      gridBtn.classList.remove('active');
      tableBtn.classList.add('active');
    }}
    renderView();
  }}

  /* BASKET / MULTI-SKU WHOLESALE ORDER ENGINE */
  function toggleBasket(sku) {{
    const prod = products.find(p => p.sku === sku);
    if (!prod) return;

    if (quoteBasket[sku]) {{
      delete quoteBasket[sku];
    }} else {{
      quoteBasket[sku] = {{ product: prod, qty: 1 }};
    }}
    updateBasketUi();
    renderView();
  }}

  function updateQty(sku, delta) {{
    if (!quoteBasket[sku]) return;
    quoteBasket[sku].qty += delta;
    if (quoteBasket[sku].qty <= 0) {{
      delete quoteBasket[sku];
    }}
    updateBasketUi();
    renderPoDrawer();
    renderView();
  }}

  function updateBasketUi() {{
    const keys = Object.keys(quoteBasket);
    const count = keys.length;
    const bar = document.getElementById('floatingPoBar');
    const badge = document.getElementById('poBadgeCount');

    badge.innerText = count;
    if (count > 0) {{
      bar.classList.add('visible');
    }} else {{
      bar.classList.remove('visible');
    }}
  }}

  function openPoModal() {{
    renderPoDrawer();
    document.getElementById('poModal').classList.add('active');
  }}

  function closePoModal() {{
    document.getElementById('poModal').classList.remove('active');
  }}

  function renderPoDrawer() {{
    const container = document.getElementById('poItemsList');
    const keys = Object.keys(quoteBasket);
    if (!keys.length) {{
      container.innerHTML = '<div style="padding: 24px; text-align: center; color: #64748b;">No products selected yet. Click "Add to PO" on items to request bulk pricing.</div>';
      return;
    }}

    container.innerHTML = keys.map(sku => {{
      const item = quoteBasket[sku];
      return `
        <div class="po-item-row">
          <div class="po-item-info">
            <div class="po-item-name">${{item.product.product_name}}</div>
            <div class="po-item-pack">${{item.product.brand}} • ${{item.product.pack}} (${{item.product.sku}})</div>
          </div>
          <div class="po-qty-ctrl">
            <button class="qty-btn" onclick="updateQty('${{sku}}', -1)">-</button>
            <span class="qty-val">${{item.qty}}</span>
            <button class="qty-btn" onclick="updateQty('${{sku}}', 1)">+</button>
          </div>
          <button style="border:none; background:none; color:#ef4444; cursor:pointer; font-size:14px;" onclick="toggleBasket('${{sku}}')">✕</button>
        </div>
      `;
    }}).join('');
  }}

  function sendConsolidatedPo() {{
    const keys = Object.keys(quoteBasket);
    if (!keys.length) {{
      alert('Please add at least one product to your wholesale quote.');
      return;
    }}

    const outlet = document.getElementById('outletNameInput').value.trim() || 'My Food Business';
    const loc = document.getElementById('outletLocInput').value.trim() || 'Rayachoti / Annamayya';

    let msg = `*RAIS AGENCIES — WHOLESALE PURCHASE ENQUIRY*\\n`;
    msg += `📍 *Outlet:* ${{outlet}}\\n`;
    msg += `🗺️ *Location:* ${{loc}}\\n`;
    msg += `📦 *Date:* ${{new Date().toLocaleDateString('en-IN')}}\\n\\n`;
    msg += `*Selected Products (${{keys.length}} SKUs):*\\n`;

    keys.forEach((sku, idx) => {{
      const it = quoteBasket[sku];
      msg += `${{idx + 1}}. *${{it.product.product_name}}* (${{it.product.brand}})\\n`;
      msg += `   └ SKU: ${{it.product.sku}} | Pack: ${{it.product.pack}} | Qty: ${{it.qty}} unit(s)\\n`;
    }});

    msg += `\\nPlease provide today's best B2B wholesale rates, invoice terms & dispatch schedule.`;

    const waUrl = `https://wa.me/919347453135?text=${{encodeURIComponent(msg)}}`;
    window.open(waUrl, '_blank');
  }}

  /* QR MODAL FUNCTIONS */
  function openQrModal() {{
    document.getElementById('qrModal').classList.add('active');
  }}

  function closeQrModal() {{
    document.getElementById('qrModal').classList.remove('active');
  }}

  function closeModalOnBg(e, id) {{
    if (e.target.id === id) {{
      document.getElementById(id).classList.remove('active');
    }}
  }}

  // Initial render
  renderView();
</script>

</body>
</html>
"""

# Write to public/catalogue.html
with open('public/catalogue.html', 'w', encoding='utf-8') as f:
    f.write(html_template)
print("Saved to public/catalogue.html")

# Write to public/RAIS_Product_Catalogue_No_Prices.html
with open('public/RAIS_Product_Catalogue_No_Prices.html', 'w', encoding='utf-8') as f:
    f.write(html_template)
print("Saved to public/RAIS_Product_Catalogue_No_Prices.html")

# Copy to dist if dist exists
if os.path.exists('dist'):
    shutil.copy2('public/catalogue.html', 'dist/catalogue.html')
    shutil.copy2('public/RAIS_Product_Catalogue_No_Prices.html', 'dist/RAIS_Product_Catalogue_No_Prices.html')
    print("Copied to dist/")

# Copy to backend static if backend exists
backend_static = os.path.join('..', 'rais-growth-engine', 'backend', 'static')
if os.path.exists(backend_static):
    shutil.copy2('public/catalogue.html', os.path.join(backend_static, 'catalogue.html'))
    shutil.copy2('public/RAIS_Product_Catalogue_No_Prices.html', os.path.join(backend_static, 'RAIS_Product_Catalogue_No_Prices.html'))
    print("Copied to backend/static/")

print("Catalogue enhancement complete!")
