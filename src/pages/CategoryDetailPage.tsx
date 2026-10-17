import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS, ProductItem } from '../data/catalogue';
import { Snowflake, ArrowLeft, Plus, Minus, ShieldCheck, Thermometer, LayoutGrid, List, Info } from 'lucide-react';
import { ProductSpecModal } from '../components/ProductSpecModal';
import { assetUrl } from '../utils/assetUrl';

interface CategoryDetailPageProps {
  categoryCode: string;
  onBack: () => void;
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

const BRAND_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  'ITC Master Chef': { bg: '#1e3a8a', text: '#93c5fd', label: 'ITC' },
  'Milky Mist': { bg: '#065f46', text: '#6ee7b7', label: 'MM' },
  'Del Monte': { bg: '#831843', text: '#fbcfe8', label: 'DM' },
  'Amul': { bg: '#9a3412', text: '#fed7aa', label: 'AM' },
  'McCain': { bg: '#78350f', text: '#fde68a', label: 'MC' },
  'Foodrite': { bg: '#b91c1c', text: '#fecaca', label: 'FR' },
  'VKL': { bg: '#581c87', text: '#e9d5ff', label: 'VKL' },
  'Nutrich': { bg: '#991b1b', text: '#fca5a5', label: 'NU' },
  'Signature': { bg: '#0f766e', text: '#99f6e4', label: 'SG' },
  'Hup Hup': { bg: '#c2410c', text: '#fed7aa', label: 'HH' },
  'Godrej': { bg: '#15803d', text: '#bbf7d0', label: 'GY' },
  'Chilli Fill': { bg: '#be123c', text: '#fecdd3', label: 'CF' }
};

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categoryCode,
  onBack,
  onSelectCategory,
  onAddToQuote,
  onUpdateQty,
  quoteItems,
  onOpenFullQuote
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [specProduct, setSpecProduct] = useState<ProductItem | null>(null);

  const category =
    CATEGORIES.find((c) => c.code.toUpperCase() === categoryCode.toUpperCase()) ||
    CATEGORIES[0];
  const products: ProductItem[] = PRODUCTS.filter(
    (p) => p.categoryCode.toUpperCase() === category.code.toUpperCase()
  );

  const handleUpdate = (sku: string, delta: number) => {
    if (onUpdateQty) {
      onUpdateQty(sku, delta);
    } else if (delta > 0) {
      const item = PRODUCTS.find((p) => p.sku === sku);
      if (item) onAddToQuote(item);
    }
  };

  const getBrandBadge = (brandName: string) => {
    if (BRAND_BADGES[brandName]) return BRAND_BADGES[brandName];
    const words = brandName.split(' ');
    const code = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : brandName.slice(0, 2).toUpperCase();
    return { bg: '#1e293b', text: '#38bdf8', label: code };
  };

  const getCategoryApplicationGuide = (code: string) => {
    switch (code.toUpperCase()) {
      case 'CHICKEN':
      case 'CHK':
        return {
          focus: 'Quick-service restaurant menus, poultry patties, nuggets, momos, and wrap stations.',
          storage: 'Sub-Zero Cold Chain Storage (-18°C). Maintain frozen until preparation.',
          cartonRules: 'Shipped in heavy-duty commercial master cartons with moisture-barrier liners.'
        };
      case 'VEG':
        return {
          focus: 'Vegetarian side orders, fries, burger patties, paneer pops, and par-baked pizza bases.',
          storage: 'Sub-Zero Cold Chain Storage (-18°C). Keep frozen; do not refreeze after thawing.',
          cartonRules: 'Master cases: 4 x 2.5kg for commercial fries; 10 x 1kg for patties & appetizers.'
        };
      case 'SAUCES':
      case 'SAU':
        return {
          focus: 'Commercial condiments, burger and wrap dressings, table sauces, and high-volume dips.',
          storage: 'Cool, dry ambient storage. Refrigerate below 4°C once opened.',
          cartonRules: 'Commercial cartons: 12 x 1kg barrier pouches / 2 x 5kg foodservice jars & buckets.'
        };
      case 'BREADING':
      case 'BRD':
        return {
          focus: 'Crispy fried chicken dredge mixes, spicy marinades, and dry spice sprinkling.',
          storage: 'Airtight dry storage away from moisture. Re-seal bag tightly after each service.',
          cartonRules: 'Wholesale master cartons: 10 x 1kg sealed pouches.'
        };
      case 'CHEESE':
      case 'CHE':
        return {
          focus: 'High-stretch mozzarella pizza topping, burger slice assembly, and malai paneer gravies.',
          storage: 'Chilled dairy cold storage (2°C to 4°C) / Deep freeze (-18°C) for frozen paneer.',
          cartonRules: 'Shipped in insulated cold boxes: 12 x 1kg / 6 x 2kg commercial packs.'
        };
      case 'PACKAGING':
      case 'PKG':
        return {
          focus: 'QSR burger clamshell packaging, hot pizza takeaway delivery, and fry carry-packs.',
          storage: 'Clean, dry elevated warehouse staging. Keep away from direct water spray.',
          cartonRules: 'Heavy corrugated bundles: 100 to 500 pcs per strapping.'
        };
      case 'SPICES':
      case 'SPI':
        return {
          focus: 'Commercial Indian curry bases, tandoori marinades, and restaurant culinary seasoning.',
          storage: 'Cool & dry pantry storage protected from sunlight and humidity.',
          cartonRules: 'Airtight commercial master cartons: 10 x 1kg sealed packs.'
        };
      case 'MOJITOS':
      case 'MOJ':
        return {
          focus: 'Beverage bar mocktails, fruit sodas, and café beverage flavoring.',
          storage: 'Ambient dry storage. Keep bottle caps tightly sealed away from direct sunlight.',
          cartonRules: 'Wholesale master cartons: 12 x 750ml shatterproof commercial bottles.'
        };
      default:
        return {
          focus: 'Commercial foodservice culinary applications.',
          storage: 'Sub-Zero Cold Chain Storage (-18°C) or Climate Controlled Hub.',
          cartonRules: 'Standard wholesale shipping cases.'
        };
    }
  };

  const appGuide = getCategoryApplicationGuide(category.code);
  const heroImage = CATEGORY_PLINTH_IMAGES[category.code] || category.image || assetUrl('/images/products/chicken_momos.jpg');

  return (
    <div className="py-10 sm:py-16 bg-[#081026] text-white min-h-screen relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-cyan-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Breadcrumb Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Categories</span>
        </button>

        {/* Category Hero Banner with Ice Plinth Artwork */}
        <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 shadow-[0_20px_50px_-20px_rgba(0,210,255,0.25)] backdrop-blur-xl mb-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

            {/* Left Content */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-wider uppercase">
                  <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{products.length} Commercial SKUs · Verified Wholesale Allocation</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {category.name}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Commercial Storage Specification Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-cyan-500/20">
                <div className="p-4 rounded-xl bg-[#081026]/80 border border-cyan-400/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      Storage Protocol
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white block">{appGuide.storage}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Rayachoty central cold hub staged.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#081026]/80 border border-cyan-400/20">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                      Fulfilment Origin
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white block">Original Factory-Sealed Packs</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Authorised distributor allocations.</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 min-h-[260px] lg:min-h-full relative overflow-hidden bg-[#081026]">
              <img
                src={heroImage}
                alt={category.name}
                className="w-full h-full object-cover object-center filter drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c3f] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0f1c3f] lg:via-transparent lg:to-transparent" />
            </div>

          </div>
        </div>

        {/* View Switcher & Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/20">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Available SKUs ({products.length})
            </h2>
            <p className="text-xs text-slate-400 pt-0.5">
              Wholesale trade requisitions directly dispatched to Rayachoty kitchens.
            </p>
          </div>

          <div className="inline-flex items-center p-0.5 rounded-lg border border-cyan-400/30 bg-[#0f1c3f]">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const count = quoteItems[product.sku] || 0;
              const inQuote = count > 0;
              const badge = getBrandBadge(product.brand);

              return (
                <div
                  key={product.sku}
                  onClick={() => setSpecProduct(product)}
                  className="group relative flex flex-col justify-between rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_15px_35px_-10px_rgba(0,210,255,0.3)] cursor-pointer transition-all duration-200 overflow-hidden backdrop-blur-md"
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-[#081026]">
                    <img
                      src={product.image || heroImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c3f] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-[10px] font-bold text-cyan-300 backdrop-blur-md">
                      <Snowflake className="w-2.5 h-2.5" />
                      <span>-18°C</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: badge.bg, color: badge.text }}
                          className="size-6 rounded-full text-[10px] font-bold flex items-center justify-center uppercase tracking-wider"
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs font-semibold text-slate-300">
                          {product.brand}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-cyan-400/80">
                        {product.sku}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <div className="text-xs text-slate-400 pt-0.5">
                      Pack: <span className="font-semibold text-slate-200">{product.pack}</span>
                      {product.hsn && (
                        <>
                          <span className="mx-1.5 text-cyan-500/40">·</span>
                          <span className="font-mono text-[11px] text-cyan-300/80">HSN {product.hsn}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 border-t border-cyan-500/15 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSpecProduct(product); }}
                      className="px-2.5 py-1.5 rounded-lg border border-cyan-400/30 bg-white/5 text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Spec</span>
                    </button>

                    {inQuote ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center rounded-lg border border-cyan-400 bg-cyan-400/20 text-cyan-200 text-xs font-bold"
                      >
                        <button
                          onClick={() => handleUpdate(product.sku, -1)}
                          className="px-2.5 py-1.5 hover:bg-cyan-400/30 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-white min-w-6 text-center">{count}</span>
                        <button
                          onClick={() => handleUpdate(product.sku, 1)}
                          className="px-2.5 py-1.5 hover:bg-cyan-400/30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); onAddToQuote(product); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-md hover:scale-[1.02]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-cyan-500/25 bg-[#0f1c3f]/90 shadow-xl backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081026] border-b border-cyan-500/20 text-cyan-300 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-mono font-bold">SKU</th>
                  <th className="py-3.5 px-4 font-semibold">Product Name</th>
                  <th className="py-3.5 px-4 font-semibold">Brand</th>
                  <th className="py-3.5 px-4 font-semibold">Pack Size</th>
                  <th className="py-3.5 px-4 font-mono font-semibold">HSN</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Requisition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/15 text-slate-300">
                {products.map((product) => {
                  const count = quoteItems[product.sku] || 0;
                  const inQuote = count > 0;

                  return (
                    <tr key={product.sku} className="hover:bg-cyan-400/[0.04] transition-colors group">
                      <td className="py-3.5 px-4 font-mono text-cyan-300 font-bold">{product.sku}</td>
                      <td className="py-3.5 px-4 font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {product.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{product.brand}</td>
                      <td className="py-3.5 px-4 text-white font-medium">{product.pack}</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400/80">{product.hsn || '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        {inQuote ? (
                          <div className="inline-flex items-center rounded-lg border border-cyan-400 bg-cyan-400/20 text-cyan-200 text-xs font-bold">
                            <button onClick={() => handleUpdate(product.sku, -1)} className="px-2 py-1 hover:bg-cyan-400/30">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-white min-w-5 text-center">{count}</span>
                            <button onClick={() => handleUpdate(product.sku, 1)} className="px-2 py-1 hover:bg-cyan-400/30">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToQuote(product)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors shadow-sm"
                          >
                            + Add
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Other Categories Explorer */}
        <div className="mt-16 pt-10 border-t border-cyan-500/20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-4 text-center">
            Explore Other Commercial Categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.code}
                onClick={() => onSelectCategory(cat.code)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  cat.code.toUpperCase() === category.code.toUpperCase()
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'bg-[#0f1c3f] border border-cyan-500/25 text-slate-300 hover:text-white hover:border-cyan-400'
                }`}
              >
                {cat.name} ({cat.itemCount})
              </button>
            ))}
          </div>
        </div>

      </div>

      <ProductSpecModal
        product={specProduct}
        isOpen={Boolean(specProduct)}
        onClose={() => setSpecProduct(null)}
        onAddToQuote={onAddToQuote}
        onUpdateQty={handleUpdate}
        currentQty={specProduct ? quoteItems[specProduct.sku] || 0 : 0}
        onOpenFullQuote={() => {
          setSpecProduct(null);
          if (onOpenFullQuote) onOpenFullQuote();
        }}
      />
    </div>
  );
};
