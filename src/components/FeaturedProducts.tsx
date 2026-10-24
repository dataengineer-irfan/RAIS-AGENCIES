import React, { useState, useMemo } from 'react';
import { PRODUCTS, ProductItem, CATEGORIES } from '../data/catalogue';
import { Search, Plus, Minus, Info, Sparkles, LayoutGrid, ListFilter } from 'lucide-react';
import { ProductSpecModal } from './ProductSpecModal';
import { motion } from 'framer-motion';
import { assetUrl } from '../utils/assetUrl';

interface FeaturedProductsProps {
  selectedCategory: string;
  onSelectCategory: (code: string) => void;
  onAddToQuote: (product: ProductItem) => void;
  onUpdateQty?: (sku: string, delta: number) => void;
  quoteItems: { [sku: string]: number };
  onOpenFullQuote?: () => void;
}

const CATEGORY_PLINTH_IMAGES: Record<string, string> = {
  CHICKEN: assetUrl('/images/ref-assets/cat_chicken_ice.png'),
  CHK: assetUrl('/images/ref-assets/cat_chicken_ice.png'),
  VEG: assetUrl('/images/ref-assets/cat_veg_ice.png'),
  SAUCES: assetUrl('/images/ref-assets/cat_sauces_ice.png'),
  SAU: assetUrl('/images/ref-assets/cat_sauces_ice.png'),
  BREADING: assetUrl('/images/ref-assets/cat_breadmix_ice.png'),
  BRD: assetUrl('/images/ref-assets/cat_breadmix_ice.png'),
  CHEESE: assetUrl('/images/ref-assets/cat_cheese_ice.png'),
  CHE: assetUrl('/images/ref-assets/cat_cheese_ice.png'),
  SPICES: assetUrl('/images/ref-assets/cat_spices_ice.png'),
  SPI: assetUrl('/images/ref-assets/cat_spices_ice.png'),
  PACKAGING: assetUrl('/images/ref-assets/cat_packaging_ice.png'),
  PKG: assetUrl('/images/ref-assets/cat_packaging_ice.png'),
  MOJITOS: assetUrl('/images/ref-assets/cat_mojitos_ice.png'),
  MOJ: assetUrl('/images/ref-assets/cat_mojitos_ice.png')
};

export function getBrandBadge(brand: string, name: string): { label: string; bg: string; text: string } {
  const combined = `${brand} ${name}`.toLowerCase();
  if (combined.includes('itc')) return { label: 'ITC', bg: '#1d4ed8', text: '#ffffff' };
  if (combined.includes('nutrich')) return { label: 'NU', bg: '#dc2626', text: '#ffffff' };
  if (combined.includes('godrej')) return { label: 'GY', bg: '#16a34a', text: '#ffffff' };
  if (combined.includes('hup hup')) return { label: 'HH', bg: '#f59e0b', text: '#ffffff' };
  if (combined.includes('del monte') || combined.includes('delmont')) return { label: 'DM', bg: '#dc2626', text: '#ffffff' };
  if (combined.includes('foodrite')) return { label: 'FR', bg: '#ea580c', text: '#ffffff' };
  if (combined.includes('mayank')) return { label: 'MG', bg: '#ca8a04', text: '#ffffff' };
  if (combined.includes('milky mist')) return { label: 'MM', bg: '#0284c7', text: '#ffffff' };
  if (combined.includes('vkl')) return { label: 'VKL', bg: '#9333ea', text: '#ffffff' };
  if (combined.includes('signature')) return { label: 'SG', bg: '#0f766e', text: '#ffffff' };
  if (combined.includes('chilli fill')) return { label: 'CF', bg: '#e11d48', text: '#ffffff' };
  if (combined.includes('amul')) return { label: 'AM', bg: '#2563eb', text: '#ffffff' };
  if (combined.includes('mccain')) return { label: 'MC', bg: '#b45309', text: '#ffffff' };
  return { label: 'R', bg: '#0e7490', text: '#ffffff' };
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  selectedCategory,
  onSelectCategory,
  onAddToQuote,
  onUpdateQty,
  quoteItems
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [specProduct, setSpecProduct] = useState<ProductItem | null>(null);
  const [viewMode, setViewMode] = useState<'panels' | 'packshots'>('panels');

  const popularBrands = useMemo(() => {
    return ['ITC Master Chef', 'Milky Mist', 'Del Monte', 'Amul', 'McCain', 'Foodrite', 'VKL', 'Nutrich', 'Signature'];
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.categoryCode === selectedCategory;
      const matchesBrand = selectedBrand === 'ALL' || item.brand.toLowerCase().includes(selectedBrand.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [selectedCategory, selectedBrand, searchQuery]);

  // Group products by category for panels view
  const activeCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      if (selectedCategory !== 'ALL' && cat.code !== selectedCategory) return false;
      // Has at least one product matching current search & brand
      return filteredProducts.some((p) => p.categoryCode === cat.code);
    });
  }, [selectedCategory, filteredProducts]);

  // Balance categories across two continuous columns to eliminate uneven grid row gaps
  const [col1Categories, col2Categories] = useMemo(() => {
    if (activeCategories.length <= 1) {
      return [activeCategories, []];
    }
    const c1: typeof activeCategories = [];
    const c2: typeof activeCategories = [];
    let count1 = 0;
    let count2 = 0;

    activeCategories.forEach((cat) => {
      const pCount = filteredProducts.filter((p) => p.categoryCode === cat.code).length;
      if (count1 <= count2) {
        c1.push(cat);
        count1 += pCount + 4; // weight header and padding
      } else {
        c2.push(cat);
        count2 += pCount + 4;
      }
    });

    return [c1, c2];
  }, [activeCategories, filteredProducts]);

  const handleUpdate = (sku: string, delta: number) => {
    if (onUpdateQty) {
      onUpdateQty(sku, delta);
    } else if (delta > 0) {
      const item = PRODUCTS.find((p) => p.sku === sku);
      if (item) onAddToQuote(item);
    }
  };

  const renderCategoryPanel = (cat: (typeof CATEGORIES)[0], catIdx: number) => {
    const catProducts = filteredProducts.filter((p) => p.categoryCode === cat.code);
    const headerImg = CATEGORY_PLINTH_IMAGES[cat.code] || cat.image;

    return (
      <motion.div
        key={cat.code}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: (catIdx % 2) * 0.08, ease: 'easeOut' }}
        className="overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#0f1c3f]/85 shadow-[0_20px_50px_-25px_rgba(0,210,255,0.25)] backdrop-blur-md flex flex-col justify-start"
      >
        {/* Category Header Banner with Ice Plinth Artwork */}
        <div className="relative h-28 overflow-hidden">
          <img
            src={headerImg}
            alt={cat.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center filter drop-shadow-md"
          />
          {/* Deep Sub-Zero Horizontal Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1c3f] via-[#0f1c3f]/85 to-transparent" />

          <div className="relative flex h-full items-center justify-between px-6 z-10">
            <div>
              <h3 className="font-serif font-bold text-2xl text-white tracking-tight">
                {cat.name}
              </h3>
              <p className="text-xs text-cyan-300 pt-0.5">
                {catProducts.length} verified commercial SKUs
              </p>
            </div>

            {cat.code === 'SPI' && (
              <span className="rounded-full bg-cyan-400 px-2.5 py-0.5 text-xs font-black text-slate-950 uppercase tracking-wider shadow-md">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Product Rows List */}
        <ul className="divide-y divide-cyan-500/15">
          {catProducts.map((product) => {
            const qty = quoteItems[product.sku] || 0;
            const badge = getBrandBadge(product.brand, product.name);

            return (
              <li
                key={product.sku}
                className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-cyan-400/[0.06] group"
              >
                {/* Brand Monogram Avatar Disc */}
                <div
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                  className="size-10 shrink-0 rounded-full font-serif font-bold text-xs flex items-center justify-center shadow-md uppercase tracking-wider"
                >
                  {badge.label}
                </div>

                {/* Product Info */}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors">
                    {product.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                    <span>{product.brand}</span>
                    <span>·</span>
                    <span className="text-slate-300 font-medium">{product.pack}</span>
                    {product.hsn && (
                      <>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline text-[11px] text-cyan-400/80">HSN {product.hsn}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Spec Action Trigger */}
                <button
                  onClick={() => setSpecProduct(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                  title="Inspect Commercial Kitchen Spec"
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* Interactive Wholesale Requisition Action */}
                <div className="shrink-0">
                  {qty === 0 ? (
                    <button
                      onClick={() => handleUpdate(product.sku, 1)}
                      className="px-3.5 py-1.5 rounded-full bg-cyan-400/15 hover:bg-cyan-400 text-cyan-200 hover:text-slate-950 border border-cyan-400/40 text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-cyan-400/25 border border-cyan-400/60 rounded-full px-2 py-0.5 shadow-sm">
                      <button
                        onClick={() => handleUpdate(product.sku, -1)}
                        className="w-5 h-5 rounded-full bg-cyan-400/40 hover:bg-cyan-400 hover:text-slate-950 text-cyan-200 flex items-center justify-center font-bold text-xs transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-1 min-w-[16px] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleUpdate(product.sku, 1)}
                        className="w-5 h-5 rounded-full bg-cyan-400/40 hover:bg-cyan-400 hover:text-slate-950 text-cyan-200 flex items-center justify-center font-bold text-xs transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>
    );
  };

  return (
    <section id="products" className="py-12 sm:py-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Search and Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">
              Direct Wholesale Products & Rates
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white">
              Our{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
                Products
              </span>
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
              Tap &quot;+ Add&quot; to build your wholesale order list, then send it directly to our Rayachoty WhatsApp desk for today&apos;s best rates.
            </p>
          </div>

          {/* Search Box + View Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[280px] sm:min-w-[320px]">
              <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search e.g. momos, nuggets, fries, mayo..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0f1c3f]/90 border border-cyan-400/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Layout Toggle (Reference Category Panels vs Grid Packshots) */}
            <div className="inline-flex items-center p-1 rounded-xl border border-cyan-400/25 bg-[#0f1c3f]">
              <button
                onClick={() => setViewMode('panels')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'panels'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Reference Category Panels"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Panels</span>
              </button>
              <button
                onClick={() => setViewMode('packshots')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'packshots'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Visual Packshot Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Packshots</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Category Pill Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => onSelectCategory('ALL')}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                : 'border-cyan-500/25 bg-[#0f1c3f]/80 text-slate-300 hover:border-cyan-400/60 hover:text-white'
            }`}
          >
            All Products ({PRODUCTS.length})
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.code;
            return (
              <button
                key={cat.code}
                onClick={() => onSelectCategory(cat.code)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                    : 'border-cyan-500/25 bg-[#0f1c3f]/80 text-slate-300 hover:border-cyan-400/60 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Brand Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider shrink-0 text-[11px]">Brand:</span>
          <button
            onClick={() => setSelectedBrand('ALL')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors shrink-0 ${
              selectedBrand === 'ALL'
                ? 'bg-white/20 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All Brands
          </button>
          {popularBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors shrink-0 ${
                selectedBrand === brand
                  ? 'bg-cyan-400/25 border border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-cyan-500/20 bg-[#0f1c3f]/60 p-8 max-w-md mx-auto">
            <Sparkles className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-white">No products found</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Try searching with another keyword or ask our direct WhatsApp desk. We may have unlisted stock.
            </p>
            <button
              onClick={() => { setSearchQuery(''); onSelectCategory('ALL'); setSelectedBrand('ALL'); }}
              className="mt-5 px-5 py-2 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'panels' ? (
          /* =========================================================
             MODE A: BALANCED CONTINUOUS CATEGORY COLUMNS (Zero Dead Space)
             ========================================================= */
          col2Categories.length === 0 ? (
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
              {col1Categories.map((cat, idx) => renderCategoryPanel(cat, idx))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Continuous Column */}
              <div className="flex flex-col gap-8">
                {col1Categories.map((cat, idx) => renderCategoryPanel(cat, idx))}
              </div>

              {/* Right Continuous Column */}
              <div className="flex flex-col gap-8">
                {col2Categories.map((cat, idx) => renderCategoryPanel(cat, idx + col1Categories.length))}
              </div>
            </div>
          )
        ) : (
          /* =========================================================
             MODE B: VISUAL PACKSHOT GRID (Verified Food Photography)
             ========================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const qty = quoteItems[product.sku] || 0;
              const badge = getBrandBadge(product.brand, product.name);

              return (
                <div
                  key={product.sku}
                  className="rounded-2xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-4 shadow-xl backdrop-blur-md flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300"
                >
                  <div>
                    {/* Visual Packshot Container */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#081026] mb-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                          Commercial Pack
                        </div>
                      )}
                      
                      {/* Brand Pill Badge */}
                      <div
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full font-serif font-bold text-[10px] shadow-md uppercase tracking-wider"
                      >
                        {badge.label}
                      </div>

                      {qty > 0 && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                          {qty} in quote
                        </div>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {product.brand} · <span className="text-slate-300">{product.pack}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 mt-3 border-t border-cyan-500/15 flex items-center justify-between">
                    <button
                      onClick={() => setSpecProduct(product)}
                      className="text-xs text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Kitchen Spec</span>
                    </button>

                    <div>
                      {qty === 0 ? (
                        <button
                          onClick={() => handleUpdate(product.sku, 1)}
                          className="px-3.5 py-1.5 rounded-full bg-cyan-400/15 hover:bg-cyan-400 text-cyan-200 hover:text-slate-950 border border-cyan-400/40 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Quote</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-cyan-400/25 border border-cyan-400/60 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => handleUpdate(product.sku, -1)}
                            className="w-5 h-5 rounded-full bg-cyan-400/40 hover:bg-cyan-400 hover:text-slate-950 text-cyan-200 flex items-center justify-center font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1 min-w-[16px] text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleUpdate(product.sku, 1)}
                            className="w-5 h-5 rounded-full bg-cyan-400/40 hover:bg-cyan-400 hover:text-slate-950 text-cyan-200 flex items-center justify-center font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Commercial Specification Modal */}
      {specProduct && (
        <ProductSpecModal
          product={specProduct}
          onClose={() => setSpecProduct(null)}
          onAddToQuote={() => {
            handleUpdate(specProduct.sku, 1);
            setSpecProduct(null);
          }}
        />
      )}
    </section>
  );
};
