import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare, MapPin, Sparkles, Box, UtensilsCrossed, Store, Phone } from 'lucide-react';
import { BUSINESS_INFO, PRODUCTS } from '../data/catalogue';
import { ThreeSubZeroCanvas } from './ThreeSubZeroCanvas';
import { HeroFoodStage } from './HeroFoodStage';
import { assetUrl } from '../utils/assetUrl';

interface HeroProps {
  onOpenQuote: () => void;
}

const SECTOR_WORDS = [
  'Fast food centers, burger & shawarma points',
  'Pizzerias, bakeries & cafe kitchens',
  'Commercial pizza boxes & burger packaging',
  'Fried chicken points & takeaway kitchens',
  'Hotels, restaurants & banquet caterers'
];

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [activeViewer, setActiveViewer] = useState<'hub' | 'triken' | 'stage'>('hub');
  const [tickerIndex, setTickerIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % SECTOR_WORDS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[#081026] text-white pt-8 sm:pt-12 pb-10 sm:pb-14 border-b border-cyan-500/20 overflow-hidden">
      {/* Background ambient lighting and particle canvas */}
      <ThreeSubZeroCanvas className="absolute inset-0 pointer-events-none z-0 opacity-40" particleCount={90} />

      {/* Subtle Cyan Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 z-0" 
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 210, 255, 0.25) 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column — High-Contrast Typography, Ticker & B2B Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">

            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-2.5"
            >
              <a
                href={BUSINESS_INFO.gmbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 py-1.5 pl-2 pr-4 text-xs font-semibold text-amber-200 backdrop-blur-md shadow-lg shadow-amber-950/40 hover:bg-amber-500/20 transition-all hover:scale-105"
              >
                <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[11px] font-black text-slate-950">
                  ★ 5.0
                </span>
                <span>Google Business Profile • Frozen Foods &amp; Packaging Hub</span>
              </a>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-white/5 py-1.5 px-3 text-xs font-semibold text-cyan-200 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Rayachoty Central Depot Hub</span>
              </span>
            </motion.div>

            {/* Display Headline — Equal Weight for Frozen Foods & Packaging */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl xl:text-[3.9rem] font-black leading-[1.08] tracking-tight text-white"
            >
              Wholesale Frozen Foods &amp;
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                Food Packaging Solutions.
              </span>
              <span className="sr-only"> — Wholesale Frozen Foods & Food Packaging Solutions in Rayachoty</span>
            </motion.h1>

            {/* Animated Sector Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-x-2.5 text-base sm:text-lg text-slate-300 font-medium"
            >
              <span className="text-slate-400">Direct wholesale supply for</span>
              <div className="relative inline-flex h-8 overflow-hidden items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tickerIndex}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="font-bold text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] whitespace-nowrap underline decoration-amber-400/50 underline-offset-4"
                  >
                    {SECTOR_WORDS[tickerIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl"
            >
              Rayachoty&apos;s direct wholesale distributor of <strong className="text-white">frozen snacks, french fries, chicken momos, burger patties, mozzarella cheese</strong>, and <strong className="text-amber-300">printed pizza boxes, burger clamshells &amp; fried chicken buckets</strong> for hotels, fast food centers &amp; cafes across Rayachoty and 7 regional routes.
            </motion.p>

            {/* CTA Button Row with Shimmer Sheen */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Primary Cyan Pill CTA with Continuous Light Sweep */}
              <a
                href="#products"
                className="group relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 text-slate-950 text-sm font-black transition-all shadow-[0_10px_35px_-8px_rgba(0,210,255,0.7)] hover:shadow-[0_15px_45px_-6px_rgba(0,210,255,0.9)] hover:scale-[1.02]"
              >
                {/* Continuous Shimmer Light Sheen */}
                <span className="absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-white/60 blur-xs animate-shimmer pointer-events-none" />
                <span className="relative z-10">View Wholesale Products</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative z-10" />
              </a>

              {/* Secondary WhatsApp Green Pill */}
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('Hello RAIS Agencies, I want to inquire about wholesale rates for my shop in Rayachoty.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-bold transition-all shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </a>

              {/* Instant Requisition Sheet Trigger */}
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-700 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-bold text-slate-200 transition-colors"
              >
                Get Wholesale Price List
              </button>
            </motion.div>

            {/* Verified Location Stamp */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-2 text-xs text-slate-400 pt-1"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Near Reddies Colony, Rayachoty, Andhra Pradesh - 516269</span>
            </motion.div>

            {/* 3-Column Glassmorphic Metrics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl w-full max-w-xl mt-2"
            >
              <div className="px-4 py-3 sm:px-5 sm:py-3.5">
                <div className="font-serif text-2xl sm:text-3xl font-black bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">
                  {PRODUCTS.length}+
                </div>
                <div className="pt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Products in Stock
                </div>
              </div>

              <div className="px-4 py-3 sm:px-5 sm:py-3.5">
                <div className="font-serif text-2xl sm:text-3xl font-black bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">
                  8+
                </div>
                <div className="pt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  National Brands
                </div>
              </div>

              <div className="px-4 py-3 sm:px-5 sm:py-3.5">
                <div className="font-serif text-2xl sm:text-3xl font-black bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">
                  -18°C
                </div>
                <div className="pt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cold-Chain Vault
                </div>
              </div>
            </motion.div>

            {/* Dedicated Regional Delivery Coverage Bar (Matching Official Poster) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52 }}
              className="mt-3 p-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-[#0f1c3f]/85 to-cyan-500/10 backdrop-blur-md shadow-xl w-full max-w-xl"
            >
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-amber-400/20">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>We Deliver to Rayachoty &amp; 7 Nearby Routes:</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  📍 Hub: 516269
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                {['Chinnamandem', 'Kalakada', 'Mahal', 'Galiveedu', 'Rajampeta', 'Sundupalli', 'Kadiri'].map((town) => (
                  <span
                    key={town}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/40 text-amber-200 font-bold"
                  >
                    <MapPin className="w-2.5 h-2.5 text-amber-400" />
                    <span>{town}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Quick Foodservice & Packaging Category Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.58 }}
              className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-semibold text-slate-400"
            >
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">Dual Stock Supply:</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-200 font-bold">🍕 Printed Pizza Boxes (8"x8", 10"x10")</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-200 font-bold">🍔 Printed Burger Clamshells (4"x4", 5"x5")</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-200 font-bold">🍗 Fried Chicken Takeaway Buckets</span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 font-bold">🥟 TRIKEN Momos</span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 font-bold">🍟 French Fries 9mm</span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 font-bold">🧀 Milky Mist Mozzarella</span>
            </motion.div>

          </div>

          {/* Right Column — Wholesale Depot Hub, 3D Food Stage & WebGL Switcher */}
          <div className="lg:col-span-5 relative flex flex-col items-center">

            {/* Visual Mode Selector */}
            <div className="mb-3 z-30 inline-flex items-center gap-1 p-1 rounded-full border border-cyan-400/30 bg-[#0f1c3f]/90 shadow-xl backdrop-blur-md">
              <button
                onClick={() => setActiveViewer('hub')}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  activeViewer === 'hub'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Wholesale Depot</span>
              </button>

              <button
                onClick={() => setActiveViewer('triken')}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  activeViewer === 'triken'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Triken Momos</span>
              </button>

              <button
                onClick={() => setActiveViewer('stage')}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  activeViewer === 'stage'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>3D Food Stage</span>
              </button>
            </div>

            {/* Viewer Display Container */}
            <div className="w-full relative min-h-[460px] flex items-center justify-center">
              {activeViewer === 'hub' ? (
                <div className="w-full max-w-[500px] rounded-2xl border border-cyan-400/40 bg-[#0f1c3f]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  {/* Ambient radial glow */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Depot Live Header */}
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-300">Rayachoty Depot Hub Active</span>
                    </div>
                    <span className="text-[11px] font-bold text-cyan-200 bg-cyan-500/15 border border-cyan-400/30 px-2.5 py-0.5 rounded-full">
                      -18°C Cold Chain
                    </span>
                  </div>

                  {/* Authentic Storefront Photo Banner */}
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-cyan-500/30 mb-3 group bg-[#081026]">
                    <img
                      src={assetUrl('/images/ref-assets/rais_storefront_official.jpg')}
                      alt="RAIS Agencies Official Rayachoty Depot Storefront"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081026] via-transparent to-transparent opacity-75" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-white drop-shadow-md">Sundupalli Road, Opp. Reddies Colony</span>
                      <a
                        href={BUSINESS_INFO.gmbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-amber-300 bg-black/70 border border-amber-400/40 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 hover:bg-black/90 transition-colors"
                      >
                        ⭐ 5.0 Google Rated
                      </a>
                    </div>
                  </div>

                  {/* Authentic Master Wholesale Products Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="rounded-xl border border-cyan-500/20 bg-[#081026]/80 p-2 text-center flex flex-col items-center">
                      <img
                        src={assetUrl('/assets/products/triken_chicken_momos_pack_details.jpg')}
                        alt="Triken Chicken Momos"
                        className="w-12 h-12 object-contain rounded-md mb-1"
                      />
                      <span className="text-[10px] font-bold text-white truncate w-full">Triken Momos</span>
                      <span className="text-[9px] text-cyan-300">IQF -18°C</span>
                    </div>
                    <div className="rounded-xl border border-cyan-500/20 bg-[#081026]/80 p-2 text-center flex flex-col items-center">
                      <img
                        src={assetUrl('/assets/products/mccain_french_fries_2_5kg.jpg')}
                        alt="McCain French Fries"
                        className="w-12 h-12 object-contain rounded-md mb-1"
                      />
                      <span className="text-[10px] font-bold text-white truncate w-full">McCain Fries</span>
                      <span className="text-[9px] text-cyan-300">2.5 KG Grade-A</span>
                    </div>
                    <div className="rounded-xl border border-cyan-500/20 bg-[#081026]/80 p-2 text-center flex flex-col items-center">
                      <img
                        src={assetUrl('/assets/products/itc_master_chef_crunchy_chicken_nuggets_1kg.jpg')}
                        alt="ITC Chicken Nuggets"
                        className="w-12 h-12 object-contain rounded-md mb-1"
                      />
                      <span className="text-[10px] font-bold text-white truncate w-full">ITC Nuggets</span>
                      <span className="text-[9px] text-cyan-300">1 KG Pack</span>
                    </div>
                    <div className="rounded-xl border border-cyan-500/20 bg-[#081026]/80 p-2 text-center flex flex-col items-center">
                      <img
                        src={assetUrl('/assets/products/milky_mist_mozzarella_2kg_pack_studio.jpg')}
                        alt="Milky Mist Mozzarella"
                        className="w-12 h-12 object-contain rounded-md mb-1"
                      />
                      <span className="text-[10px] font-bold text-white truncate w-full">Milky Mist</span>
                      <span className="text-[9px] text-cyan-300">2 KG Diced</span>
                    </div>
                  </div>

                  {/* Depot Action Footer */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <a
                      href={BUSINESS_INFO.gmbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-200 font-bold hover:bg-amber-400/30 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      <span>View on Google Maps</span>
                    </a>
                    <a
                      href={`tel:${BUSINESS_INFO.primaryPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/20 border border-cyan-400/40 text-cyan-200 font-bold hover:bg-cyan-400/30 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Call: {BUSINESS_INFO.primaryPhone}</span>
                    </a>
                  </div>
                </div>
              ) : activeViewer === 'triken' ? (
                <div className="w-full max-w-[500px] rounded-2xl border border-cyan-400/40 bg-[#0f1c3f]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  {/* Ambient radial glow */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-200">Official Brand Partner</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                      TRIKEN Chicken Momos
                    </span>
                  </div>

                  {/* Real Triken Momos Packaging Photo */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-cyan-500/30 mb-3 bg-[#081026] group">
                    <img
                      src={assetUrl('/assets/products/triken_chicken_momos_pack_details.jpg')}
                      alt="Official TRIKEN Chicken Momos Commercial Packaging - RAIS Agencies"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081026] via-transparent to-transparent opacity-70" />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      IQF -18°C Flash Frozen
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white drop-shadow-md">TRIKEN Chicken Momos</div>
                        <div className="text-[11px] text-cyan-200">Wholesale Master Pack · Ready to Steam or Fry</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                        In Stock
                      </span>
                    </div>
                  </div>

                  {/* Real Freezer Staged Photo + Specs */}
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-cyan-500/25 bg-[#081026] group">
                      <img
                        src={assetUrl('/assets/products/triken_chicken_momos_freezer_rack.jpg')}
                        alt="Triken Chicken Momos Staged in Depot Cold Chain Freezer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-slate-200">
                        Depot Freezer Stock
                      </span>
                    </div>

                    <div className="rounded-xl border border-cyan-500/20 bg-[#081026]/80 p-2.5 flex flex-col justify-center text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-[11px]">Brand: <strong>TRIKEN Foods</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-[11px]">Pack: <strong>Commercial 1 Pkt</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-[11px]">Texture: <strong>Juicy Chicken Fill</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Action Footer */}
                  <div className="pt-1">
                    <a
                      href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('Hello RAIS Agencies, I want to order TRIKEN Chicken Momos wholesale for my shop in Rayachoty.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white text-xs font-bold transition-all shadow-md hover:scale-[1.01]"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>Order TRIKEN Momos on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <HeroFoodStage />
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
