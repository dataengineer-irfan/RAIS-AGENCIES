# MOTION AND INTERACTION AUDIT: RAIS AGENCIES REFERENCE

**Target App:** `https://rais-agencies.onhercules.app/`  
**Animation Engine:** Framer Motion (`framer-motion` runtime detected in JS bundle) & CSS 3D transforms  
**Auditor:** Antigravity AI Engineering & Design Team  
**Date:** 2026-10-17  

---

## 1. Executive Motion Architecture

The reference site employs a purposeful, physically grounded motion design system rather than arbitrary decorative animations. Motion is used exclusively for three functional purposes:
1. **Focus & Hierarchy (Entrance & Stagger):** Guides the eye sequentially down the hero composition (Badge → Headline → Animated Ticker → Value Prop → Action Buttons → Metrics).
2. **Tactile Interaction & Feedback (Physical Springs):** Buttons provide spring feedback; "+ Add" buttons transform smoothly into quantity steppers; the floating order bar springs in from the bottom edge.
3. **Product Storytelling & Depth (3D Perspective & Cryo Atmosphere):** The hero food stage responds to mouse coordinates in 3D space (`perspective: 1400px`), with satellite items orbiting along elliptical paths and ice cubes reacting with subtle parallax.

---

## 2. Comprehensive Motion Registry

### Effect 1: Hero Staggered Entrance Sequence
* **Trigger:** Initial page load / DOM mount.
* **Element(s):** Hero pill badge, H1 title, subtitle ticker, description, button row, metrics grid.
* **Starting State:** `opacity: 0, y: 24px`.
* **Ending State:** `opacity: 1, y: 0px`.
* **Timing & Easing:** Duration `0.6s`, easing cubic-bezier `[0.16, 1, 0.3, 1]` (smooth deceleration).
* **Stagger Delays:**
  - Kicker Badge: `delay: 0.0s`
  - Headline H1: `delay: 0.1s`
  - Vertical Ticker: `delay: 0.2s`
  - Description: `delay: 0.26s`
  - Button Cluster: `delay: 0.36s`
  - Address: `delay: 0.44s`
  - Metrics Grid: `delay: 0.52s`
* **Implementation Status:** **Known** (extracted verbatim from bundle helper function `gA(delay)`).

---

### Effect 2: Rotating Vertical Typography Ticker
* **Trigger:** Continuous loop after mount.
* **Element:** `<motion.span>` container holding target buyer sectors (`Fast food`, `Restaurants`, `Cafes`, `Cloud kitchens`).
* **Motion Profile:** Vertical transform (`y`) cycling through discrete line heights (32px / `h-8`).
* **Duration & Easing:** Duration = `sectors.length * 2.2s`, repeat = `Infinity`, easing = `easeInOut`.
* **Purpose:** Communicates the breadth of commercial buyers served without cluttering the hero layout.
* **Implementation Status:** **Known**.

---

### Effect 3: Primary CTA Light-Sweep / Shimmer Sheen
* **Trigger:** Continuous loop on primary "Explore price list" button.
* **Element:** Skewed translucent white highlight bar (`w-1/3 skew-x-[-20deg] bg-white/50 blur-sm`).
* **Animation:** Translates from `x: "-120%"` to `x: "220%"`.
* **Timing:** Duration `2.6s`, `repeatDelay: 1.5s`, easing `easeInOut`.
* **Interactive Hover State:** Button scales slightly (`opacity-95`), and the trailing arrow icon slides right (`group-hover:translate-x-1 transition-transform`).
* **Implementation Status:** **Known**.

---

### Effect 4: Interactive 3D Perspective Food Stage Tilt
* **Trigger:** Pointer / Mouse movement over the hero viewport.
* **Element:** Stage container with `perspective: 1400px` and inner wrapper with `transformStyle: "preserve-3d"`.
* **Input:** Normalized cursor coordinates:
  - `clientX / window.innerWidth - 0.5) * 2` (range -1 to 1)
  - `clientY / window.innerHeight - 0.5) * 2` (range -1 to 1)
* **Spring Dynamics:** `useSpring(motionValue, { stiffness: 50, damping: 15 })`.
* **Transform Output:**
  - `rotateY: [-14deg, 14deg]`
  - `rotateX: [10deg, -10deg]`
* **Purpose:** Creates real physical depth and tangible presence for the hero food products.
* **Implementation Status:** **Known** (extracted from function `sA()`).

---

### Effect 5: Satellite Food Orbit & Ice Float
* **Trigger:** Continuous frame loop (`useAnimationFrame`).
* **Elements:** French fries, chicken popcorn, steamed momo, mozzarella cheese satellites orbiting around the central burger stack.
* **Motion Mechanics:** Angle increments smoothly (`e / 2600`).
* **Position Function:**
  - `x = Math.cos(angle + offset) * radius`
  - `y = Math.sin(angle + offset) * (radius * 0.35)` (elliptical perspective projection)
* **Z-Index Switching:** Items behind the burger plinth get lower z-index and slight blur, items in front get full sharpness and higher z-index.
* **Ice Cubes:** Float vertically with `animate: { y: [0, -10, 0] }` over 4s to 6s with distinct phase offsets.
* **Implementation Status:** **Known**.

---

### Effect 6: 3D Perspective Scroll Reveal on Product Panels
* **Trigger:** Scroll position reaches viewport threshold (`whileInView`, `viewport: { once: true, margin: "-40px" }`).
* **Element:** Product Category Panels.
* **Starting State:** `opacity: 0, y: 40px, rotateX: 12deg`.
* **Ending State:** `opacity: 1, y: 0px, rotateX: 0deg`.
* **Perspective Context:** `style={{ transformPerspective: 1000 }}`.
* **Duration & Stagger:** `duration: 0.6s, delay: (n % 2) * 0.1s, ease: "easeOut"`.
* **Purpose:** Gives each catalogue section a solid physical landing as the user scrolls into view.
* **Implementation Status:** **Known**.

---

### Effect 7: "+ Add" to Stepper Interactive State Transition
* **Trigger:** Click on "+ Add" button.
* **Starting State:** Pill button with label "+ Add".
* **Ending State:** Compact inline quantity stepper (`−  1  +`) with smooth width expansion.
* **Interaction Feedback:** Immediate count update, cyan pill border glow, and increment/decrement button triggers.
* **Implementation Status:** **Known**.

---

### Effect 8: Floating Order Requisition Bar Entrance
* **Trigger:** Order item count changes from `0` to `>= 1`.
* **Container:** `<AnimatePresence>` wrapping `<motion.div className="fixed inset-x-0 bottom-4 z-50 px-4">`.
* **Starting State:** `y: 120px, opacity: 0`.
* **Ending State:** `y: 0px, opacity: 1`.
* **Exit State:** `y: 120px, opacity: 0` (when order cleared).
* **Physics Spring:** `type: "spring", stiffness: 260, damping: 26`.
* **Visual Polish:** `backdrop-blur-xl`, `border border-primary/40`, `shadow-2xl shadow-black/50`.
* **Implementation Status:** **Known**.

---

### Effect 9: Instant Live Filter Transition
* **Trigger:** Keystroke in search box or click on category pill.
* **Behavior:** Framer Motion layout transition (`layout` prop) smoothly repacks the product cards without layout pop.
* **Empty State:** If query yields 0 results, an animated empty state card fades in: `"No products found. Try a different word, or ask us on WhatsApp."`
* **Implementation Status:** **Known**.

---

## 3. Accessibility & Performance Guardrails
1. **Reduced Motion Compliance:**
   - All continuous loops (shimmer, orbital satellites, ticker) and spring entrance animations must respect `prefers-reduced-motion: reduce`.
   - In reduced-motion mode, elements snap directly to `opacity: 1, y: 0, rotate: 0` with zero delay.
2. **Hardware Acceleration:**
   - All motion properties strictly use `transform` (`translate3d`, `scale3d`, `rotate3d`) and `opacity` to avoid layout reflows (forced synchronous layouts).
   - Will-change hints applied selectively on active animated wrappers.
