# REFERENCE DESIGN AUDIT: RAIS AGENCIES (HERCULES LIVE REFERENCE)

**Reference Target:** `https://rais-agencies.onhercules.app/` & `https://rais-agencies.onhercules.app/#products`  
**Audit Date:** 2026-10-17  
**Technology Detected:** React 18, Vite, Tailwind CSS (v4/v3 with OKLCH tokens), Framer Motion, Lucide React, Google Maps Embed.  
**Auditor:** Antigravity AI Engineering & Design Team  

---

## 1. Executive Summary & Core Art Direction

The reference website presents a modern, high-contrast, deep cryogenic blue B2B aesthetic (`oklch(16% .075 262)` / `#081026`) paired with electric cyan accent lighting (`oklch(83% .16 205)` / `#00d2ff`), clean typography (`Sora` for headlines, `Manrope` for body), and commercial frozen food photography displayed on frosted ice plinths with sub-zero atmospheric vapor.

Unlike generic corporate templates or purely abstract 3D experiments, the reference website achieves instant relevance by centering on **authentic, appetizing commercial food stacks and frozen categories** within the first 600ms of viewing.

---

## 2. Section-by-Section Visual & Architectural Analysis

### Section 1: Sticky Navigation & Header
* **Screenshot Evidence:** `ref_01_desktop_hero.png` (Top bar)
* **Observed:**
  - `header` container is `sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl`.
  - Left: Official RAIS logo badge (rounded square, gold diamond monogram, ring border) + Wordmark `"RAIS Agencies"` with `"RAIS"` in bold white serif/sans and `"Agencies"` in light cyan (`text-primary`), followed by `"FROZEN FOOD PRODUCTS"` in 9px tracking-widest uppercase.
  - Center: Minimal navigation links (`Products`, `Brands`, `Contact`) with subtle hover color transition to primary cyan.
  - Right: Direct desk telephone (`📞 9347453135`) + rounded cyan pill CTA button (`Order on WhatsApp`).
* **Inferred:** Built with Tailwind `backdrop-blur-xl` and `bg-background/70` to maintain legibility when scrolling over bright product cards.
* **Unknown:** Exact analytics event tracking on header phone click.

---

### Section 2: First Viewport / Hero Experience
* **Screenshot Evidence:** `ref_01_desktop_hero.png` (Desktop 1440x900) & `ref_06_mobile_hero.png` (Mobile 390x844)
* **Layout Composition:** Asymmetric 2-column grid (`lg:grid-cols-[1.15fr_1fr]`), max-w-7xl, pt-16 pb-20.
* **Left Column (Typography & Action Engine):**
  1. *Category Kicker Pill:* `border border-cyan-300/30 bg-white/5 backdrop-blur-md` with `★ No.1` gradient badge + `"Frozen food distributor in Rayachoty"`.
  2. *Main Headline:* `font-serif text-5xl sm:text-6xl xl:text-[4.1rem] font-bold leading-[1.04] text-foreground`:
     - Line 1: `"Frozen at its peak."` (Crisp solid white)
     - Line 2: `<span className="bg-gradient-to-r from-cyan-200 via-cyan-400 to-sky-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]">Delivered at its best.</span>`
  3. *Animated Typewriter / Rotating Vertical Ticker:*
     - `"Wholesale supply for "` + animated `<motion.span>` vertically cycling between: `Fast food`, `Restaurants`, `Cafes`, `Cloud kitchens` in vibrant cyan.
  4. *Concise B2B Value Proposition:*
     - `"Premium frozen foods, sauces, cheese, spices and packaging, kept cold from our freezer to your kitchen. Order in seconds on WhatsApp."`
  5. *Dual CTA Cluster:*
     - Primary Button: Cyan pill `bg-gradient-to-r from-cyan-300 to-sky-400 shadow-[0_10px_40px_-8px_rgba(34,211,238,0.8)]` with continuous animated light shimmer sweep (`skew-x-[-20deg] blur-sm`) and hover arrow nudge (`Explore price list →`).
     - Secondary Button: Bright green WhatsApp pill (`#25D366`) with WhatsApp chat icon (`Order on WhatsApp`).
  6. *Geo-Location Anchor:* `📍 Near Reddies Colony, Rayachoty - 516269`.
  7. *Commercial Metrics Card:* Glassmorphic 3-column pill card (`50+ PRODUCTS IN STOCK`, `8+ NATIONAL BRANDS`, `-18°C COLD-CHAIN STORAGE`) with subtle vertical dividers.
* **Right Column (3D Interactive Food Stage & Cryo Plinth):**
  - Mouse-responsive 3D perspective stage (`[perspective:1400px]` with `useSpring` and `useTransform` tilting `rotateX` and `rotateY` up to 14 degrees based on pointer position).
  - Overhead conical cyan spotlight beam (`blur-2xl clip-path:polygon(...)`).
  - Elliptical glowing frozen platform with double concentric rings (one solid cyan with inner glow, one outer dashed orbit).
  - Centerpiece: Apppetizing high-definition commercial food stack (Juicy sesame burger with melting cheese, crisp fries, and cubed paneer blocks).
  - Orbiting satellites: French fries, chicken popcorn, steamed momo, mozzarella cheese floating with smooth trigonometric animation (`useAnimationFrame`).
  - Floating ice cubes with specular lighting reacting to cursor movement.
  - Floating frosted glass badges:
    - Top Right: `TRUSTED BRANDS: McCain · ITC Master Chef · Ayamas`
    - Bottom Left: `🟢 In stock · Same-day dispatch` (pulsing green radar dot).

---

### Section 3: Category Grid ("Shop By Category")
* **Screenshot Evidence:** `ref_05_scroll_1.png` and `ref_05_scroll_2.png`
* **Header:**
  - Kicker: `SHOP BY CATEGORY` in cyan-300 tracking-widest uppercase.
  - Headline: `"Everything your kitchen needs"` with `"kitchen"` highlighted in cyan gradient.
* **Layout:** 4x2 grid (8 category tiles) on desktop, 2x4 on tablet, 2x4 on mobile.
* **Card Design:**
  - Rounded 2xl border with glassmorphic background (`bg-card/70 border-border shadow-[0_20px_60px_-30px] shadow-primary/30`).
  - Header image: 3D/photographic composite of authentic food items resting on a frosted blue ice block with cold vapor rising:
    1. `Chicken Items` (6 products) — Golden crispy chicken bites on ice with vapor.
    2. `Veg Items` (9 products) — Crinkle fries, potato pops, veg burger patty.
    3. `Ketchup & Sauces` (9 products) — Ramekins of red ketchup, mayo, mustard with blue underglow.
    4. `Bread Mix & Powders` (4 products) — Cajun breading dredge and fried tenders.
    5. `Cheese & Slices` (4 products) — Fresh malai paneer cubes and mozzarella shavings.
    6. `Spices` (4 products, marked with `NEW` badge) — 4 spice bowls (chilli, turmeric, coriander).
    7. `Pizza & Burger Boxes` (5 products) — Kraft takeaway boxes on frozen stone.
    8. `Mojitos` (2 products) — Tall iced mint and blue curacao mocktail coolers.
  - Card Footer: Category title, product count (`6 products`), and circular cyan hover button with arrow `↗`.

---

### Section 4: Product Catalogue & Instant Requisition Engine
* **Screenshot Evidence:** `ref_03_desktop_products.png`, `ref_09_after_add_items.png`, `ref_11_search_momo.png`
* **Header Controls:**
  - Kicker: `PRICE LIST` / `PRODUCT CATALOGUE`
  - Headline: `"Our Products"` with `"Products"` in electric cyan.
  - Subtitle: `"Tap 'Add' to build your order, then send it to us on WhatsApp."`
  - Right: Instant search input with search icon (`🔍 Search e.g. nuggets, mayo, momos`).
* **Category Filter Bar:**
  - Horizontal pill strip with smooth scroll overflow on mobile.
  - Active tab: Solid cyan background (`bg-primary text-primary-foreground`).
  - Inactive tabs: Dark card surface with subtle border, hover lightening.
* **Catalogue Presentation Format:**
  - Two-column grid of category panels on desktop.
  - Each panel features an image banner with category title and optional `NEW` badge.
  - Product list inside each panel with subtle row dividers:
    - *Brand Avatar:* Circular monogram badge with brand color (e.g. `ITC` in blue `#1d4ed8`, `NU` in red `#dc2626`, `HH` in amber `#f59e0b`, `MM` in cyan `#0284c7`, `SG` in teal `#0f766e`).
    - *Product Title:* Bold, clear product name.
    - *Subtitle:* Brand name + Commercial pack size (`ITC Master Chef · 1 Packet`, `Hup Hup · 2.5 KG Packet`).
    - *Wholesale Action:* `+ Add` button.
* **Interaction / State Transformation:**
  - When `+ Add` is clicked, the button smoothly transitions into an inline stepper (`−  1  +`).
  - The floating order bar immediately animates up from the bottom of the screen (`fixed inset-x-0 bottom-4 z-50 px-4`).
  - Floating bar shows:
    - Basket icon in cyan square.
    - Total items count (`2 items in your order`).
    - Requisition action: Green WhatsApp button (`💬 Send on WhatsApp`).
    - Clear button (`✕`).

---

### Section 5: Four-Step Cold Chain Order Workflow
* **Screenshot Evidence:** `ref_05_scroll_3.png` & `ref_05_scroll_4.png`
* **Header:**
  - Kicker: `HOW ORDERING WORKS`
  - Title: `"From our freezer to your kitchen in four simple steps"`
* **Process Track:**
  - 4 interconnected circular step nodes on an illuminated track:
    1. `Pick your products` (Checklist icon): Browse catalogue and add items.
    2. `Send on WhatsApp` (WhatsApp chat icon): Order transmitted with exact quantities.
    3. `Packed frozen` (Snowflake icon): Freezers picked to maintain -18°C cold chain.
    4. `Delivered fast` (Delivery box truck icon): Same-day dispatch to Rayachoty kitchens.

---

### Section 6: Brand Marquee & Value Pillars
* **Screenshot Evidence:** `ref_05_scroll_4.png`
* **Brand Carousel:**
  - Horizontal ticker pills featuring verified foodservice brands: `McCain`, `ITC Master Chef`, `Ayamas`, `Venky's`, `Milky Mist`, `Mrs. Bector's Cremica`, `Dr. Oetker FunFoods`, `Wingreens Farms`.
* **Value Proposition Cards (4 Grid):**
  1. `100% Quality Assured`: Only genuine products from trusted national brands.
  2. `Frozen & Fresh`: Stored and handled in continuous sub-zero cold chain.
  3. `On Time Delivery`: Reliable daily delivery so kitchen service never stops.
  4. `Direct Trade Terms`: Transparent B2B wholesale supply for restaurants and cafes.

---

### Section 7: Contact, Location & Google Maps Embed
* **Screenshot Evidence:** `ref_05_scroll_5.png`
* **Layout:** Dual-column split card (`VISIT OR CALL: Get in touch`):
  - Left: Phone numbers (`9347453135`, `9573261696`), physical depot address (`Near Reddies Colony, Rayachoty - 516269`), green `WhatsApp us` button, blue `Get directions` button.
  - Right: Embedded live Google Maps frame centered on Reddies Colony, Rayachoty with `Open in Maps ↗` button.

---

## 3. Reference Observations Matrix (Observed / Inferred / Unknown)

| Feature | Classification | Evidence & Technical Notes |
| :--- | :--- | :--- |
| **Color System** | **Observed** | Background: `oklch(16% .075 262)` (Dark navy `#081026`), Primary: `oklch(83% .16 205)` (Electric cyan `#00d2ff`), Card: `oklch(22% .085 260)` (Deep navy `#0f1c3f`), Border: `oklch(83% .12 215 / 0.2)` |
| **Typography** | **Observed** | Headings in `Sora` / modern geometric serif-sans, body in `Manrope`, numeric metrics in `Geist Mono`. |
| **Motion Library** | **Observed** | `framer-motion` bundle present; uses `motion.div`, `whileInView`, `useSpring`, `useTransform`, `AnimatePresence`. |
| **Hero 3D Stage** | **Observed** | CSS 3D perspective (`[perspective:1400px]`) with cursor tilt (`rotateX`, `rotateY`) + trigonometric orbit animation (`Math.cos`, `Math.sin`). |
| **Category Plinths** | **Observed** | 8 high-resolution 3D food composites resting on translucent ice blocks with blue cryogenic lighting and mist. |
| **Brand Monograms** | **Observed** | Dynamic avatar mapper (`Uv`) assigning colored initial pills to products by brand pattern match. |
| **Order Floating Bar**| **Observed** | `fixed inset-x-0 bottom-4 z-50` with spring transition (`stiffness: 260, damping: 26`) tracking accumulated quantities. |
| **Zero-Pricing Compliance** | **Observed** | Reference site displays consumer ₹ prices, BUT RAIS brief strictly requires **quote-only / zero-pricing**. We adapt the UX to display Pack/Weight + `+ Add to Enquiry` without monetary figures. |
| **Performance / Bundle** | **Inferred** | Built with Vite; CSS extracted to single stylesheet with Tailwind utilities; assets served from high-speed CDN. |
| **Backend State** | **Unknown** | Whether WhatsApp orders are mirrored to a database or entirely client-side URL encoding (appears client-side). |
