import React from 'react';
import { CATEGORIES, PRODUCTS } from '../data/catalogue';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (categoryCode: string) => void;
}

const CATEGORY_PLINTH_IMAGES: Record<string, { image: string; isNew?: boolean }> = {
  CHK: { image: '/images/ref-assets/cat_chicken_ice.png' },
  VEG: { image: '/images/ref-assets/cat_veg_ice.png' },
  SAU: { image: '/images/ref-assets/cat_sauces_ice.png' },
  BRD: { image: '/images/ref-assets/cat_breadmix_ice.png' },
  CHE: { image: '/images/ref-assets/cat_cheese_ice.png' },
  SPI: { image: '/images/ref-assets/cat_spices_ice.png', isNew: true },
  PKG: { image: '/images/ref-assets/cat_packaging_ice.png' },
  MOJ: { image: '/images/ref-assets/cat_mojitos_ice.png' }
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <section id="categories" className="pt-8 pb-12 sm:pb-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative overflow-hidden">
      {/* Background radial blue ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">
            Shop By Category
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white">
            Everything your{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
              kitchen
            </span>{' '}
            needs
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Select a commercial category to view product specifications, pack sizes, and add to your wholesale quotation sheet.
          </p>
        </div>

        {/* Category Grid — 4 Columns on Desktop, 2 on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategory === cat.code;
            const assetInfo = CATEGORY_PLINTH_IMAGES[cat.code] || { image: cat.image };

            return (
              <motion.div
                key={cat.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
                onClick={() => {
                  onSelectCategory(cat.code);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group cursor-pointer rounded-2xl border bg-[#0f1c3f]/80 p-3 sm:p-4 shadow-xl backdrop-blur-md transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_35px_rgba(0,210,255,0.45)]'
                    : 'border-cyan-500/25 hover:border-cyan-400/80 hover:shadow-[0_15px_40px_-15px_rgba(0,210,255,0.4)]'
                }`}
              >
                {/* Visual Image Banner with Ice Plinth & Rising Vapor */}
                <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-[#081026] mb-3">
                  <img
                    src={assetInfo.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                  />
                  {/* Subtle Sub-Zero Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c3f] via-transparent to-transparent opacity-60" />

                  {/* Optional NEW badge */}
                  {assetInfo.isNew && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      NEW
                    </div>
                  )}

                  {/* Active Selection Tag */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      Active
                    </div>
                  )}
                </div>

                {/* Content & Action Arrow */}
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 pt-0.5">
                      {cat.itemCount} products
                    </p>
                  </div>

                  {/* Circular Arrow Button (Reference Signature) */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-400/30 group-hover:bg-cyan-300 group-hover:scale-110 transition-all">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Reset Button if a filter is active */}
        {selectedCategory !== 'ALL' && (
          <div className="mt-8 text-center">
            <button
              onClick={() => onSelectCategory('ALL')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/40 bg-white/5 hover:bg-white/10 text-xs font-bold text-cyan-200 transition-colors"
            >
              <span>Show All Products ({PRODUCTS.length})</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
