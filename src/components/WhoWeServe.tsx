import React, { useState } from 'react';
import { ArrowRight, Utensils, Pizza, Coffee, Store, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assetUrl } from '../utils/assetUrl';

interface WhoWeServeProps {
  onOpenQuote: () => void;
}

export const WhoWeServe: React.FC<WhoWeServeProps> = ({ onOpenQuote }) => {
  const [activeTab, setActiveTab] = useState(0);

  const segments = [
    {
      id: 'qsr',
      title: 'Quick-Service & Burger Hubs',
      subtitle: 'QSRs · Food Trucks · Fast-Food Counters',
      icon: Utensils,
      image: assetUrl('/images/burger_boxes.jpg'),
      tag: 'Fryer & Griddle Staples',
      description:
        'Pre-portioned commercial frozen fries with high heat retention, paired with seasoned poultry patties, premium condiments, and heavy-gauge corrugated kraft clamshells. Standardises kitchen assembly during high-turnover peak hours.',
      stockItems: [
        'Hup Hup French Fries 9mm (2.5kg)',
        'Nutrich Chicken Burger Patty (1kg)',
        'Chilli Fill Veg Burger Patty (1.2kg)',
        'Del Monte Tandoori Mayo (1kg)',
        'Kraft Burger Clamshell Boxes (100 Nos)'
      ]
    },
    {
      id: 'pizzeria',
      title: 'Pizzerias & Italian Bistros',
      subtitle: 'Deck Oven & Conveyor Pizzerias',
      icon: Pizza,
      image: assetUrl('/images/mozzarella_cheese.jpg'),
      tag: 'High-Stretch Pizza Melt',
      description:
        'High-performance mozzarella with uniform shred melt and stringy stretch. Paired with rich herb-infused pizza pasta sauces and durable corrugated takeaway boxes to protect crust integrity during transit.',
      stockItems: [
        'Milky Mist Mozzarella Diced (2kg)',
        'Par-Baked 8-inch Pizza Bases',
        'Del Monte Pizza Pasta Sauce (1kg)',
        'Kraft Fluted Pizza Boxes (100 Nos)',
        'Oregano & Chilli Flake Seasoning (1kg)'
      ]
    },
    {
      id: 'cafe',
      title: 'Cafés & Beverage Lounges',
      subtitle: 'Beverage Bars · Tea Lounges · Bakeries',
      icon: Coffee,
      image: assetUrl('/images/products/mojito_lime_mint.jpg'),
      tag: 'Bar Syrups & Finger Foods',
      description:
        'Concentrated mocktail syrup bases for speed-pour bar service, paired with quick-fry cheese appetisers and pliable commercial tortilla wraps for toasted paninis, rolls, and shawarmas.',
      stockItems: [
        'Lime & Mint Mojito Syrup (750ml)',
        'Blue Curacao Mocktail Syrup (750ml)',
        'Strawberry Fruit Crush (750ml)',
        'ITC Cheesy Corn Triangles (1kg)',
        'Signature Tortilla 8.5" (10 Nos Pack)'
      ]
    },
    {
      id: 'cloud-kitchen',
      title: 'Cloud Kitchens & Caterers',
      subtitle: 'Multi-Brand Delivery & Banquets',
      icon: Store,
      image: assetUrl('/images/chicken_nuggets.jpg'),
      tag: 'Bulk Staging & High-Volume IQF',
      description:
        'Institutional volume cases for centralized preparation. Predictable portion costs, single-vendor consolidated logistics, and sub-zero temperature integrity for zero batch wastage.',
      stockItems: [
        'ITC Master Chef Chicken Nuggets (1kg)',
        'ITC Handcrafted Pleated Momos (500g)',
        'Milky Mist Fresh Paneer Cubes (1kg)',
        'Del Monte Ketchup Sachets (8g × 1000)',
        'Commercial Table Cups & Napkins'
      ]
    }
  ];

  const current = segments[activeTab];
  const CurrentIcon = current.icon;

  return (
    <section id="who-we-serve" className="py-12 sm:py-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">
            Commercial Culinary Segments
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white">
            Supplying Rayachoty Kitchens{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              by Trade
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Curated product bundles and commercial packaging calibrated for specific foodservice kitchen workflows.
          </p>
        </div>

        {/* Segment Selection Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8 p-1.5 rounded-2xl border border-cyan-500/25 bg-[#0f1c3f]/90 shadow-xl backdrop-blur-md">
          {segments.map((seg, idx) => {
            const Icon = seg.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={seg.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span className="truncate">{seg.title.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Segment Solution Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 shadow-[0_20px_60px_-25px_rgba(0,210,255,0.3)] backdrop-blur-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

              {/* Left Column: Visual Showcase */}
              <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[360px] bg-[#081026] overflow-hidden">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-all duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c3f] via-transparent to-transparent opacity-85" />
                <div className="absolute top-4 left-4 rounded-full bg-cyan-400 text-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-md">
                  {current.tag}
                </div>
                <div className="absolute bottom-5 left-6 right-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
                    Segment Focus
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-white">{current.title}</div>
                </div>
              </div>

              {/* Middle Column: Kitchen Context & Value */}
              <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between border-y lg:border-y-0 lg:border-r border-cyan-500/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    <CurrentIcon className="w-4 h-4" />
                    <span>{current.subtitle}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-black text-white leading-snug">
                    {current.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#081026]/80 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Commercial Fulfilment Standard:</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Factory-sealed packaging, sub-zero cold chain staging, and consolidated daily delivery directly from our Rayachoty depot.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={onOpenQuote}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-md shadow-cyan-400/25"
                  >
                    <span>Request {current.title.split('&')[0].trim()} Pack Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Key Commercial Stock Lines */}
              <div className="lg:col-span-3 p-6 sm:p-8 bg-[#081026]/60 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4">
                    Essential Stock Lines
                  </p>

                  <div className="space-y-2.5">
                    {current.stockItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#0f1c3f]/90 border border-cyan-500/20 text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-200 text-xs leading-tight">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 text-[11px] text-slate-400 border-t border-cyan-500/15 mt-4">
                  Available in wholesale master cases and institutional packs directly from Rayachoty depot.
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
