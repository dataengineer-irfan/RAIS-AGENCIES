import React, { useState } from 'react';
import { Box, Layers, Sparkles, Sun, Snowflake, CheckCircle2, ArrowRight, ShieldCheck, ZoomIn, ZoomOut, Flame, RotateCw } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

interface Interactive3DShowcaseProps {
  onOpenQuote?: () => void;
}

type ModelType = 'momo' | 'nugget' | 'fries' | 'carton' | 'burger_box' | 'bucket' | 'cryo_pod';
type LightingMode = 'studio' | 'cold_vault' | 'depot_warm';

interface ShowcaseItem {
  image: string;
  name: string;
  tag: string;
  badge: string;
  alt: string;
  categoryLabel: string;
}

const SHOWCASE_ITEMS: Record<ModelType, ShowcaseItem> = {
  momo: {
    image: assetUrl('/assets/products/triken_chicken_momos_pack_details.jpg'),
    name: 'TRIKEN Chicken Momos (IQF -18°C)',
    tag: 'Official Wholesale TRIKEN Commercial Packaging with Frozen Quality Lock',
    badge: 'TRIKEN · IQF -18°C',
    alt: 'Authentic TRIKEN Chicken Momos Commercial Wholesale Supply - RAIS Agencies',
    categoryLabel: 'FROZEN CHICKEN SNACKS · TRIKEN AUTHORISED SUPPLY'
  },
  nugget: {
    image: assetUrl('/assets/products/itc_master_chef_crunchy_chicken_nuggets_1kg.jpg'),
    name: 'ITC Master Chef Crunchy Chicken Nuggets',
    tag: '1 KG Commercial Wholesale Packaging with Cold-Chain Lock',
    badge: 'ITC Master Chef · 1 KG',
    alt: 'ITC Master Chef Crunchy Chicken Nuggets 1KG Commercial Packshot',
    categoryLabel: 'CHICKEN SNACKS · FAST FOOD STAPLE'
  },
  fries: {
    image: assetUrl('/assets/products/mccain_french_fries_2_5kg.jpg'),
    name: 'McCain / Amul French Fries (2.5 KG)',
    tag: 'Grade-A Shoestring Commercial Case Packshot',
    badge: 'McCain / Amul · 2.5 KG',
    alt: 'McCain and Amul Commercial French Fries 2.5kg Wholesale Supply',
    categoryLabel: 'FRENCH FRIES · FAST FOOD MUST-HAVE'
  },
  carton: {
    image: assetUrl('/images/rais_authentic_pizza_delivery_boxes.jpg'),
    name: '8"×8" & 10"×10" Printed Pizza Delivery Boxes ("Pizza: Hot & Delicious")',
    tag: 'Authentic Food-Grade Printed Pizza Delivery Boxes with Steam Flute & Toppings Guide',
    badge: '8"×8" & 10"×10" · Heat-Lock Flute',
    alt: 'RAIS Agencies Authentic 8x8 Pizza Delivery Boxes Wholesale Supply Rayachoty',
    categoryLabel: 'COMMERCIAL FOOD PACKAGING · MASTER PIZZA BOXES'
  },
  burger_box: {
    image: assetUrl('/images/rais_authentic_burger_boxes_clamshells.jpg'),
    name: '4"×4" & 5"×5" Printed Burger & Pastry Clamshell Boxes ("Wow Tasty" & "Burger & Pastries")',
    tag: 'Authentic Heavy-Duty Printed Clamshell Boxes with Food-Grade Greaseproof Coating',
    badge: '4"×4" & 5"×5" · 320 GSM',
    alt: 'RAIS Agencies Authentic Printed Burger Clamshell Takeaway Packaging Boxes',
    categoryLabel: 'FAST FOOD PACKAGING · HIGH GREASE RESISTANCE'
  },
  bucket: {
    image: assetUrl('/images/rais_authentic_fried_chicken_buckets.jpg'),
    name: 'Commercial Fried Chicken Takeaway Buckets (KFC-Style · 34 Pcs Sleeves)',
    tag: 'Authentic Heavy-Duty Printed Fried Chicken Takeaway Buckets in Sealed Wholesale Sleeves',
    badge: '34 Pcs Sleeve · Oil-Resistant',
    alt: 'RAIS Agencies Authentic Fried Chicken Takeaway Buckets Wholesale Supply Rayachoty',
    categoryLabel: 'COMMERCIAL FOOD PACKAGING · FRIED CHICKEN BUCKETS'
  },
  cryo_pod: {
    image: assetUrl('/assets/products/depot_real_deep_freezer.jpg'),
    name: 'RAIS Depot Authentic Commercial Deep Freezer (-18°C)',
    tag: 'Continuous -18°C Deep Freeze Preserving Chill Fill, McCain, Triken & Veg Snacks',
    badge: '-18°C Continuous · Zero Melt',
    alt: 'RAIS Agencies Authentic Rayachoty Depot Deep Freezer Sub-Zero Cold Storage',
    categoryLabel: 'COLD-CHAIN DEPOT · ZERO QUALITY BREAK'
  }
};

export const Interactive3DShowcase: React.FC<Interactive3DShowcaseProps> = ({ onOpenQuote }) => {
  const [activeModel, setActiveModel] = useState<ModelType>('momo');
  const [lightingMode, setLightingMode] = useState<LightingMode>('studio');
  const [isMacroZoom, setIsMacroZoom] = useState(false);
  const [stageTilt, setStageTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStageTilt({ x: -y * 12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setStageTilt({ x: 0, y: 0 });
  };

  const resetTilt = () => {
    setStageTilt({ x: 0, y: 0 });
  };

  const currentItem = SHOWCASE_ITEMS[activeModel];

  return (
    <section id="packaging-3d" className="py-12 sm:py-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-2">
              <span className="block w-6 h-px bg-cyan-400" />
              <span>Rayachoty Wholesale Depot · Product & Packaging Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Wholesale Products & Packaging Inspection
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Inspect genuine product photos, commercial takeaway packaging, and depot cold-chain facilities available at direct wholesale rates from our Rayachoty depot near Reddies Colony.
            </p>
          </div>

          {/* Model Switcher Tabs: Frozen Food & Packaging */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0f1c3f]/90 p-1.5 rounded-xl border border-cyan-500/30">
            {/* Frozen Food Lines */}
            <button
              onClick={() => { setActiveModel('momo'); resetTilt(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'momo'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🥟 TRIKEN Momos</span>
            </button>
            <button
              onClick={() => { setActiveModel('nugget'); resetTilt(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'nugget'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🍗 Crunchy Nuggets</span>
            </button>
            <button
              onClick={() => { setActiveModel('fries'); resetTilt(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'fries'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🍟 Shoestring Fries</span>
            </button>

            <span className="text-cyan-500/40 px-1 hidden sm:inline">|</span>

            {/* Commercial Packaging & Logistics */}
            <button
              onClick={() => { setActiveModel('carton'); resetTilt(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'carton'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-amber-300" />
              <span>🍕 Pizza Boxes</span>
            </button>
            <button
              onClick={() => { setActiveModel('burger_box'); resetTilt(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'burger_box'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>🍔 Burger Boxes</span>
            </button>
            <button
              onClick={() => { setActiveModel('bucket'); resetTilt(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'bucket'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>🍗 KFC Buckets</span>
            </button>
            <button
              onClick={() => { setActiveModel('cryo_pod'); resetTilt(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${
                activeModel === 'cryo_pod'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-300" />
              <span>❄️ 3D Cold Storage</span>
            </button>
          </div>
        </div>

        {/* Main Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Interactive 3D Perspective Photo Stage */}
          <div className="lg:col-span-8 bg-gradient-to-b from-[#0f1c3f] to-[#081026] border-2 border-cyan-500/30 rounded-2xl shadow-2xl relative min-h-[460px] sm:min-h-[540px] flex flex-col justify-between overflow-hidden">

            {/* Interactive Tilt Mount Area */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 select-none overflow-hidden cursor-crosshair z-10"
            >
              {/* Ambience glow based on lightingMode */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                  lightingMode === 'cold_vault'
                    ? 'bg-gradient-to-tr from-cyan-900/40 via-sky-600/10 to-transparent'
                    : lightingMode === 'depot_warm'
                    ? 'bg-gradient-to-tr from-amber-900/40 via-orange-600/10 to-transparent'
                    : 'bg-gradient-to-tr from-cyan-950/40 via-slate-900/20 to-transparent'
                }`}
              />

              {/* 3D Tilted Photo Stage */}
              <div
                style={{
                  transform: `perspective(1000px) rotateX(${stageTilt.x}deg) rotateY(${stageTilt.y}deg) scale(${isMacroZoom ? 1.25 : 1.0})`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-400/40 bg-slate-950 group"
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.alt}
                  className={`w-full h-[320px] sm:h-[400px] object-cover transition-all duration-500 ${
                    lightingMode === 'cold_vault'
                      ? 'brightness-95 contrast-105 saturate-95 hue-rotate-15'
                      : lightingMode === 'depot_warm'
                      ? 'brightness-105 saturate-110'
                      : 'brightness-100 saturate-100'
                  }`}
                />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <span className="bg-slate-950/90 backdrop-blur-md text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-400/40 shadow-lg flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    {currentItem.badge}
                  </span>
                  <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/40 shadow-lg flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" />
                    Authentic Depot Shot
                  </span>
                </div>

                {/* Bottom Card Caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent p-4 sm:p-5 text-left pointer-events-none">
                  <div className="text-[10px] sm:text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
                    {currentItem.categoryLabel}
                  </div>
                  <div className="text-white font-bold text-sm sm:text-base mt-1">
                    {currentItem.tag}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Toolbar Overlay */}
            <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 bg-[#081026]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-400/40 shadow-lg text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Move Mouse for 3D Perspective Tilt · Toggle Macro Zoom</span>
              </div>

              {/* Lighting Switcher */}
              <div className="pointer-events-auto flex items-center gap-1 bg-[#081026]/90 backdrop-blur-md p-1 rounded-full border border-cyan-400/40 shadow-lg">
                <button
                  onClick={() => setLightingMode('studio')}
                  title="Studio Neutral 5000K"
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    lightingMode === 'studio' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLightingMode('cold_vault')}
                  title="Sub-Zero Vault -18°C Blue"
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    lightingMode === 'cold_vault' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Snowflake className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLightingMode('depot_warm')}
                  title="Rayachoty Depot Warm 3000K"
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    lightingMode === 'depot_warm' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  onClick={() => setIsMacroZoom(!isMacroZoom)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                    isMacroZoom
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-[#081026]/90 text-white hover:bg-[#0f1c3f] border border-cyan-400/40'
                  }`}
                >
                  {isMacroZoom ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5 text-cyan-300" />}
                  <span>{isMacroZoom ? 'Reset View (1.0x)' : 'Macro Texture Zoom (1.25x)'}</span>
                </button>

                <button
                  onClick={resetTilt}
                  className="p-2 rounded-xl text-xs font-bold transition-all shadow border border-cyan-400/40 bg-[#081026]/90 text-slate-300 hover:text-white"
                  title="Recenter 3D Tilt"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pointer-events-auto bg-[#081026]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-400/40 text-[11px] text-cyan-300 font-mono font-bold shadow-md">
                Authentic Depot & Product Photography · 3D Tilt Active
              </div>
            </div>

          </div>

          {/* Commercial Technical Specifications Sidebar */}
          <div className="lg:col-span-4 bg-[#0f1c3f]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              {/* Active Asset Badge */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
                <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  {activeModel === 'momo' && 'FROZEN MOMOS · BULK WHOLESALE'}
                  {activeModel === 'nugget' && 'CHICKEN NUGGETS · FAST FOOD STAPLE'}
                  {activeModel === 'fries' && 'FRENCH FRIES · FAST FOOD MUST-HAVE'}
                  {activeModel === 'carton' && 'COMMERCIAL PIZZA DELIVERY BOXES'}
                  {activeModel === 'burger_box' && 'PRINTED BURGER CLAMSHELL BOXES'}
                  {activeModel === 'bucket' && 'FRIED CHICKEN TAKEAWAY BUCKETS'}
                  {activeModel === 'cryo_pod' && 'DEPOT DEEP FREEZER (-18°C)'}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full">
                  {activeModel === 'carton' || activeModel === 'burger_box' || activeModel === 'bucket' ? 'Food-Grade Certified' : 'FSSAI Certified'}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {activeModel === 'momo' && 'TRIKEN Handcrafted Chicken Momos'}
                {activeModel === 'nugget' && 'ITC Master Chef Crunchy Chicken Nuggets'}
                {activeModel === 'fries' && 'Grade-A Shoestring French Fries (9mm)'}
                {activeModel === 'carton' && '8"×8" & 10"×10" Printed Pizza Delivery Boxes'}
                {activeModel === 'burger_box' && '4"×4" & 5"×5" Printed Burger Clamshell Boxes'}
                {activeModel === 'bucket' && 'Commercial Fried Chicken Takeaway Buckets (KFC-Style)'}
                {activeModel === 'cryo_pod' && 'Rayachoty -18°C Cold Storage Depot'}
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeModel === 'momo' &&
                  'Authentic TRIKEN handcrafted chicken momos with genuine commercial wholesale packaging. Flash-frozen at -18°C so pleats stay intact and never break during steaming or deep frying. Highest seller for Rayachoty fast food stalls, cafes & dhabas.'}
                {activeModel === 'nugget' &&
                  'Crispy golden tempura chicken nuggets and popcorn. Stays hot and super crunchy after frying. Perfect portion control and high profit margins for fast food centers and cafes.'}
                {activeModel === 'fries' &&
                  'Grade-A shoestring french fries (6mm / 9mm). Absorbs very little oil, fries in under 3 minutes, and stays crispy. Best wholesale case rates in Rayachoty.'}
                {activeModel === 'carton' &&
                  'Heavy-duty food-grade printed corrugated pizza boxes ("Pizza: Hot & Delicious"). Specially engineered for Rayachoty pizzerias, cafes & bakers to lock in heat without sogginess. Available in printed full-colour wholesale bundles.'}
                {activeModel === 'burger_box' &&
                  'Heavy-duty food-grade printed clamshell boxes ("Wow Tasty" & "Burger & Pastries") with built-in steam vents. Keeps burgers hot and fresh without making buns soggy. 100% food grade certified.'}
                {activeModel === 'bucket' &&
                  'Heavy-duty food-grade printed fried chicken takeaway buckets in factory-sealed sleeves. High oil and grease resistance with snug takeaway lids. Perfect for fried chicken joints and fast food counters.'}
                {activeModel === 'cryo_pod' &&
                  'Commercial deep freezer cold storage right at our Rayachoty depot. Every product stays completely frozen and fresh with zero melting before reaching your kitchen.'}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="mt-5 space-y-2.5">
                <div className="p-3 bg-[#081026]/80 border border-cyan-500/20 rounded-xl">
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kitchen Preparation / Packaging Spec:</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 pl-5">
                    {activeModel === 'momo' && 'Steam for 6–8 mins or Deep Fry for 3 mins directly without thawing'}
                    {activeModel === 'nugget' && 'Deep fry straight from freezer in hot oil (180°C) for 3.5 mins until golden brown'}
                    {activeModel === 'fries' && 'Deep fry directly from frozen at 175°C–180°C for 2.5–3 minutes'}
                    {activeModel === 'carton' && 'Heavy-duty 3-ply B-Flute corrugated board with moisture-lock barrier. Withstands stacking of 10+ boxes.'}
                    {activeModel === 'burger_box' && '320 GSM Virgin Food-Grade Kraft Paperboard with greaseproof inner lining'}
                    {activeModel === 'bucket' && 'Virgin food-grade poly-coated board with grease barrier. Stamped with "Fried Chicken" graphics.'}
                    {activeModel === 'cryo_pod' && 'Continuous -18°C to -22°C commercial deep freezer holding'}
                  </div>
                </div>

                <div className="p-3 bg-[#081026]/80 border border-cyan-500/20 rounded-xl">
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cold Chain & Storage Protocol:</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 pl-5">
                    {activeModel === 'momo' && 'Store at continuous -18°C deep freezer. 100% fresh, zero ice crystals. 12 months shelf life.'}
                    {activeModel === 'nugget' && 'Sub-zero IQF holding at -18°C. Cook directly from frozen state.'}
                    {activeModel === 'fries' && 'Maintain at -18°C or below in deep freezer. Fast cooking directly from frozen.'}
                    {activeModel === 'carton' && 'Store in clean dry depot racks. Heat retention tested stable up to 90°C hot pizza delivery.'}
                    {activeModel === 'burger_box' && 'Heat tolerant up to 105°C; oil & grease resistant'}
                    {activeModel === 'bucket' && 'Store in dry depot racks. Stackable sleeves protect bucket rims from deformation.'}
                    {activeModel === 'cryo_pod' && 'Zero cold-chain break from factory to Rayachoty depot'}
                  </div>
                </div>

                <div className="p-3 bg-[#081026]/80 border border-cyan-500/20 rounded-xl">
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Wholesale Unit Packaging:</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 pl-5">
                    {activeModel === 'momo' && '500g commercial packs (approx. 25 pcs) · Master carton of 20 packs'}
                    {activeModel === 'nugget' && '1kg heavy-gauge commercial pack · 10 packs per master carton'}
                    {activeModel === 'fries' && '2.5kg commercial foodservice bags · 4 bags (10kg) per wholesale case'}
                    {activeModel === 'carton' && 'Bundles of 100 units / Master cases of 500 units. 8"×8" and 10"×10" sizes.'}
                    {activeModel === 'burger_box' && 'Bundled in packs of 100 Nos / Master bundle 600 Nos'}
                    {activeModel === 'bucket' && '34 pieces per sealed sleeve / Master cartons of 340 pieces'}
                    {activeModel === 'cryo_pod' && 'Daily dispatch to Rayachoty hotels & shops or instant counter pickup'}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Commercial Requisition CTA */}
            <div className="pt-5 border-t border-cyan-500/20 mt-6">
              <button
                onClick={onOpenQuote}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-cyan-400/25 active:scale-95"
              >
                <span>Get Today&apos;s Wholesale Price List</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Direct wholesale depot rates for Rayachoty business owners. Best margin guaranteed.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
