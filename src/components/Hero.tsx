import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare, MapPin, Sparkles, Box, UtensilsCrossed } from 'lucide-react';
import { BUSINESS_INFO, PRODUCTS } from '../data/catalogue';
import { ThreeSubZeroCanvas } from './ThreeSubZeroCanvas';
import { HeroFoodStage } from './HeroFoodStage';
import { ThreeHeroFoodViewer } from './ThreeHeroFoodViewer';

interface HeroProps {
  onOpenQuote: () => void;
}

const SECTOR_WORDS = [
  'Fast food outlets',
  'Quick-service restaurants',
  'Pizzerias & Burger bars',
  'Cafés & Juice hubs',
  'Banquet caterers & Cloud kitchens'
];

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [activeViewer, setActiveViewer] = useState<'stage' | 'webgl'>('stage');
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
              className="flex w-fit items-center gap-2.5 rounded-full border border-cyan-400/30 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-cyan-200 backdrop-blur-md shadow-lg shadow-cyan-950/40"
            >
              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-2.5 py-0.5 text-[11px] font-black text-slate-950">
                <Sparkles className="w-3 h-3 fill-current" />
                No.1
              </span>
              <span>Frozen Food Distributor in Rayachoty</span>
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl xl:text-[4.2rem] font-black leading-[1.05] tracking-tight text-white"
            >
              Frozen at its peak.
              <br />
              <span className="bg-gradient-to-r from-cyan-200 via-cyan-400 to-sky-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,210,255,0.4)]">
                Delivered at its best.
              </span>
            </motion.h1>

            {/* Animated Sector Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-x-2.5 text-base sm:text-lg text-slate-300 font-medium"
            >
              <span className="text-slate-400">Wholesale commercial supply for</span>
              <div className="relative inline-flex h-8 overflow-hidden items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tickerIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="font-bold text-cyan-300 whitespace-nowrap underline decoration-cyan-400/40 underline-offset-4"
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
              Premium frozen appetizers, momos, french fries, burger patties, dairy cheese, sauces, spices and heavy-duty packaging. Kept at continuous -18°C cold chain from our Rayachoty depot straight to your kitchen.
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
                <span className="relative z-10">Explore Product Catalogue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative z-10" />
              </a>

              {/* Secondary WhatsApp Green Pill */}
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('Hello RAIS Agencies, I would like to request wholesale product quotation and terms.')}`}
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
                Request Custom Quote
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

            {/* Quick Foodservice Category Tags — Eliminates Void Below Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-400"
            >
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">Stock Lines:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-cyan-500/20 text-cyan-200">IQF Momos</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-cyan-500/20 text-cyan-200">French Fries 6mm/9mm</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-cyan-500/20 text-cyan-200">Burger Patties & Clamshells</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-cyan-500/20 text-cyan-200">Milky Mist Mozzarella</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-cyan-500/20 text-cyan-200">Del Monte Sauces</span>
            </motion.div>

          </div>

          {/* Right Column — 3D Food Stage with Satellite Orbit & WebGL Switcher */}
          <div className="lg:col-span-5 relative flex flex-col items-center">

            {/* Visual Mode Selector (Interactive Food Stage vs 3D WebGL Mesh Inspector) */}
            <div className="mb-3 z-30 inline-flex items-center gap-1 p-1 rounded-full border border-cyan-400/30 bg-[#0f1c3f]/90 shadow-xl backdrop-blur-md">
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

              <button
                onClick={() => setActiveViewer('webgl')}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  activeViewer === 'webgl'
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Model Mesh</span>
              </button>
            </div>

            {/* Viewer Display Container */}
            <div className="w-full relative min-h-[460px] flex items-center justify-center">
              {activeViewer === 'stage' ? (
                <HeroFoodStage />
              ) : (
                <div className="w-full max-w-[500px] h-[440px] rounded-2xl border border-cyan-400/30 bg-[#0f1c3f]/80 p-4 shadow-2xl backdrop-blur-xl">
                  <ThreeHeroFoodViewer modelType="momo" />
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
