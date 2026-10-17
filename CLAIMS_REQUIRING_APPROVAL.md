# RAIS AGENCIES — REGISTER OF BUSINESS CLAIMS REQUIRING OWNER SIGN-OFF

**Document Version:** 2.0 (Post-Design Reset)  
**Classification:** Pre-Production Legal & Commercial Verification Register  
**Target Entity:** RAIS Agencies Management & Legal Stakeholders  
**Status:** **PENDING WRITTEN SIGN-OFF** prior to production DNS / live deployment  

---

## 1. Executive Notice

To ensure 100% legal compliance, advertising standards compliance, and truth in B2B commercial representation, this register identifies every factual statement, operational specification, geographic corridor, contact channel, and commercial assumption currently active on the RAIS Agencies website (`rais-website`).

Any claim marked with ⚠️ **REQUIRES VERIFICATION** must be reviewed and officially confirmed or amended by the business owner before public launch. Statements marked ✅ **STANDARDIZED FACTUAL** have been toned down from marketing superlatives into factual operational descriptions.

---

## 2. Register of Commercial & Operational Claims

### A. Geography, Depot Facility & Service Corridors

| Item ID | Claim / Content on Website | Current Location in Code | Stated Fact / Parameter | Verification Status | Action Required from Business Owner |
|:---:|:---|:---|:---|:---:|:---|
| **CLM-GEO-01** | Central Wholesale Depot Location | `Footer.tsx`, `ContactPage.tsx`, `TradeStandards.tsx` | "Near Reddies Colony, Rayachoty, Annamayya District, Andhra Pradesh - 516269" | ⚠️ **REQUIRES VERIFICATION** | Confirm exact physical address, landmark, and building/door number for billing and pickup. |
| **CLM-GEO-02** | Primary Distribution Corridors | `TradeStandards.tsx`, `WhoWeServe.tsx` | "Rayachoty $\to$ Kadapa, Rajampet, Madanapalle, and Kalakada daily distribution corridors." | ⚠️ **REQUIRES VERIFICATION** | Confirm whether daily delivery runs cover all 4 peripheral towns or if delivery is schedule-based (e.g. bi-weekly). |
| **CLM-GEO-03** | Order Cutoff for Same-Day / Next-Day Dispatch | `TradeStandards.tsx` | "Daily route consolidation departing Rayachoty depot. Orders submitted by 18:00 dispatched next-day cycle." | ⚠️ **REQUIRES VERIFICATION** | Confirm the actual evening order cutoff cutoff hour for kitchen supply dispatches. |

---

### B. Cold Chain & Temperature Operations

| Item ID | Claim / Content on Website | Current Location in Code | Stated Fact / Parameter | Verification Status | Action Required from Business Owner |
|:---:|:---|:---|:---|:---:|:---|
| **CLM-COLD-01** | Frozen Food Core Temperature Standard | `Hero.tsx`, `CategoryDetailPage.tsx`, `TradeStandards.tsx` | "-18°C Deep Frozen Storage standard maintained from depot freezers to delivery." | ✅ **STANDARDIZED FACTUAL** | Confirmed standard for commercial frozen poultry, snacks, and IQF vegetables. Replaced previous "100% Cold Chain Guarantee" with operational standard. |
| **CLM-COLD-02** | Chilled Dairy Temperature Standard | `CategoryDetailPage.tsx`, `TradeStandards.tsx` | "0°C to +4°C chilled cold storage for mozzarella, butter, and processed cheeses." | ✅ **STANDARDIZED FACTUAL** | Standard FSSAI chilled dairy protocol. Confirm depot walk-in chiller temperature settings. |
| **CLM-COLD-03** | Active Cold-Chain Vehicle Fleet | `TradeStandards.tsx` | "Insulated thermal delivery containers and refrigerated transport transit." | ⚠️ **REQUIRES VERIFICATION** | Confirm vehicle types used: fully refrigerated trucks vs. insulated puff-insulated thermal boxes with eutectic gel pads. |

---

### C. Commercial Brand Partnerships & Authorized Sourcing

| Item ID | Claim / Content on Website | Current Location in Code | Stated Fact / Parameter | Verification Status | Action Required from Business Owner |
|:---:|:---|:---|:---|:---:|:---|
| **CLM-BRD-01** | Authorized Brands Displayed | `FeaturedBrands.tsx`, `Hero.tsx`, `catalogue.ts` | ITC Master Chef, McCain India, Milky Mist, Del Monte India, Foodrite India, Godrej Yummiez, VKL Food Solutions. | ⚠️ **REQUIRES VERIFICATION** | Confirm active wholesale distributorship / authorized trade dealer status with each named brand. |
| **CLM-BRD-02** | Brand Logo Usage Rights | `FeaturedBrands.tsx` | Manufacturer brandmarks rendered in monochromatic grayscale for trade identification. | ⚠️ **REQUIRES VERIFICATION** | Confirm formal trade authorization or OEM distributor agreement allows web portfolio display. |
| **CLM-BRD-03** | Private Label / In-House Pack Lines | `catalogue.ts` | "RAIS Fresh" (Sweet Corn), "RAIS Select" (Oregano, Chilli Flakes), "RAIS Spices" (Turmeric, Chilly, Coriander, Jeera), "RAIS Beverages" (Mojito Syrups). | ⚠️ **REQUIRES VERIFICATION** | Confirm registered trade name or trademark status for RAIS-branded product packaging. |

---

### D. Regulatory, FSSAI & Quality Certifications

| Item ID | Claim / Content on Website | Current Location in Code | Stated Fact / Parameter | Verification Status | Action Required from Business Owner |
|:---:|:---|:---|:---|:---:|:---|
| **CLM-REG-01** | FSSAI Compliance Statement | `TradeStandards.tsx`, `Footer.tsx` | "FSSAI Food Safety Standards Compliant wholesale distribution depot." | ⚠️ **REQUIRES VERIFICATION** | Provide the official 14-digit FSSAI wholesale license number for display in the footer. |
| **CLM-REG-02** | GST Registration & Invoice Compliance | `TradeStandards.tsx`, `ProductSpecModal.tsx` | "Standard 100% GST compliant B2B tax invoicing on all commercial shipments." | ✅ **STANDARDIZED FACTUAL** | Replaced any pricing or tax calculation with tax-compliant invoice generation notice. Owner to confirm GSTIN number. |
| **CLM-REG-03** | Zero Fabricated Longevity / Trust Superlatives | Across entire codebase | Removed "30 Years of Unbroken Trust", "100% Quality Guaranteed", "South India's #1 Distributor". | ✅ **STANDARDIZED FACTUAL** | All unverifiable marketing slogans successfully expunged. Tone is strictly restrained, factual, and professional. |

---

### E. Customer Channels & Contact Points

| Item ID | Claim / Content on Website | Current Location in Code | Stated Fact / Parameter | Verification Status | Action Required from Business Owner |
|:---:|:---|:---|:---|:---:|:---|
| **CLM-CTC-01** | Primary Order Desk Phone Numbers | `Navbar.tsx`, `Footer.tsx`, `ContactPage.tsx` | `+91 94402 85852` & `+91 98492 85852` | ⚠️ **REQUIRES VERIFICATION** | Confirm both numbers are monitored by order desk operators during commercial hours (09:00 - 18:00). |
| **CLM-CTC-02** | WhatsApp Wholesale Enquiry Routing | `whatsapp.ts`, `ProductSpecModal.tsx`, `QuoteModal.tsx` | `https://wa.me/919440285852` | ⚠️ **REQUIRES VERIFICATION** | Confirm `919440285852` is the active WhatsApp Business account configured for wholesale order desk queries. |
| **CLM-CTC-03** | Commercial Email Inquiries | `Footer.tsx`, `ContactPage.tsx` | `orders@raisagencies.com` / `contact@raisagencies.com` | ⚠️ **REQUIRES VERIFICATION** | Confirm corporate domain mailboxes are provisioned and routed to depot management. |

---

### F. Commercial Invoicing & Quotation Policies

| Item ID | Claim / Content on Website | Current Location in Code | Stated Fact / Parameter | Verification Status | Action Required from Business Owner |
|:---:|:---|:---|:---|:---:|:---|
| **CLM-PRC-01** | Zero Public Product Pricing Policy | Entire Site (`QuoteModal`, `catalogue`, `ProductCard`) | "Institutional rates provided exclusively on formal quote request. No public pricing displayed." | ✅ **STANDARDIZED FACTUAL** | All rupee symbols, price tags, cart subtotals, and GST estimates completely removed. |
| **CLM-PRC-02** | Minimum Order Quantity (MOQ) Requirements | `ProductSpecModal.tsx`, `TradeStandards.tsx` | "Standard carton / bundle pack MOQ applied per category for wholesale dispatch." | ⚠️ **REQUIRES VERIFICATION** | Confirm whether minimum order limits apply per category (e.g. 1 carton vs loose 1 packet). |
| **CLM-PRC-03** | Cold Chain Credit & Return Policy | `TradeStandards.tsx` | "Perishable frozen products inspected at unloading dock. Damage/defrost claims must be logged within 2 hours of delivery." | ⚠️ **REQUIRES VERIFICATION** | Confirm exact warehouse policy on thawed transit returns and credit note issuance. |

---

## 3. Sign-off Authorization Form

```markdown
I, ________________________________________________, Proprietor / Director of RAIS Agencies,
hereby confirm that I have reviewed the statements, service corridors, contact information,
and brand representations documented in this register.

[ ] I approve all claims as currently stated.
[ ] I have indicated corrections on specific items listed above.

Signature: _________________________________________
Date:      _________________________________________
Designation: ______________________________________
```
