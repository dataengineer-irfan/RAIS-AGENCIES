import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, ProductItem } from '../data/catalogue';
import { Search, Plus, Minus, FileDown, LayoutGrid, List, Info, Sparkles, Snowflake, ArrowRight } from 'lucide-react';
import { ProductSpecModal } from '../components/ProductSpecModal';
import { assetUrl } from '../utils/assetUrl';

interface ProductsPageProps {
  onAddToQuote: (product: ProductItem) => void;
  onUpdateQty?: (sku: string, delta: number) => void;
  quoteItems: { [sku: string]: number };
  onOpenFullQuote?: () => void;
}

const BRAND_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  'ITC Master Chef': { bg: '#1e3a8a', text: '#93c5fd', label: 'ITC' },
  'Milky Mist': { bg: '#065f46', text: '#6ee7b7', label: 'MM' },
  'Del Monte': { bg: '#831843', text: '#fbcfe8', label: 'DM' },
  'Amul': { bg: '#9a3412', text: '#fed7aa', label: 'AM' },
  'Foodrite': { bg: '#b91c1c', text: '#fecaca', label: 'FR' },
  'VKL': { bg: '#581c87', text: '#e9d5ff', label: 'VKL' },
  'Nutrich': { bg: '#991b1b', text: '#fca5a5', label: 'NU' },
  'Signature': { bg: '#0f766e', text: '#99f6e4', label: 'SG' },
  'Hup Hup': { bg: '#c2410c', text: '#fed7aa', label: 'HH' },
  'Godrej': { bg: '#15803d', text: '#bbf7d0', label: 'GY' },
  'Chilli Fill': { bg: '#be123c', text: '#fecdd3', label: 'CF' },
  'Triken': { bg: '#ea580c', text: '#ffedd5', label: 'TK' },
  'Mayank Gold': { bg: '#854d0e', text: '#fef08a', label: 'MG' },
  'Packaging Solutions': { bg: '#334155', text: '#cbd5e1', label: 'PK' },
  'RAIS Select': { bg: '#0369a1', text: '#bae6fd', label: 'RS' },
  'RAIS Spices': { bg: '#b45309', text: '#fde68a', label: 'SP' },
  'RAIS Beverages': { bg: '#0284c7', text: '#e0f2fe', label: 'BV' },
  'RAIS Fresh': { bg: '#047857', text: '#a7f3d0', label: 'RF' }
};

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onAddToQuote,
  onUpdateQty,
  quoteItems,
  onOpenFullQuote
}) => {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'brand'>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [specProduct, setSpecProduct] = useState<ProductItem | null>(null);

  const brands = useMemo(() => {
    const bSet = new Set(PRODUCTS.map((p) => p.brand));
    return Array.from(bSet).sort();
  }, []);

  const popularBrands = useMemo(() => {
    return ['ITC Master Chef', 'Milky Mist', 'Del Monte', 'Amul', 'Triken', 'Foodrite', 'VKL', 'Nutrich', 'Signature', 'Hup Hup'];
  }, []);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCat = selectedCat === 'ALL' || item.categoryCode === selectedCat;
      const matchBrand = selectedBrand === 'ALL' || item.brand === selectedBrand;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      return matchCat && matchBrand && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'brand') return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [selectedCat, selectedBrand, search, sortBy]);

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

  return (
    <div className="py-12 sm:py-16 bg-[#081026] text-white min-h-screen relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[400px] bg-blue-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-cyan-500/20">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <span className="block w-6 h-px bg-cyan-400" />
              <span>Rayachoty Wholesale Catalogue</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight">
              Wholesale Products &{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
                Price List
              </span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Wholesale products and bulk packs for Rayachoty hotels, fast food centers, cafes, and bakeries. Showing {filtered.length} of {PRODUCTS.length} products across 8 categories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={assetUrl('/catalogue.html')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 hover:border-amber-400 text-xs font-bold text-amber-200 hover:text-white transition-all shadow-lg backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Full 66-SKU Catalogue (HTML)</span>
            </a>

            <a
              href={assetUrl('/images/brochure.jpg')}
              download="RAIS-Agencies-Commercial-Brochure.jpg"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0f1c3f] border border-cyan-400/30 hover:border-cyan-400 text-xs font-bold text-cyan-200 hover:text-white transition-all shadow-lg backdrop-blur-md"
            >
              <FileDown className="w-4 h-4 text-cyan-300" />
              <span>Brochure (JPG)</span>
            </a>

            <button
              onClick={() => onOpenFullQuote && onOpenFullQuote()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 text-xs font-black transition-all shadow-[0_4px_20px_rgba(0,210,255,0.35)] hover:scale-[1.02]"
            >
              <span>View Wholesale Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="p-5 sm:p-6 bg-[#0f1c3f]/90 border border-cyan-500/25 rounded-2xl shadow-xl backdrop-blur-xl mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">

            {/* Real-Time Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, SKU (e.g. momos, fries, mayo)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#081026] border border-cyan-400/30 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition-all shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#081026] border border-cyan-400/30 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-300 transition-colors"
            >
              <option value="ALL">All Categories ({CATEGORIES.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.itemCount})
                </option>
              ))}
            </select>

            {/* Brand Select */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#081026] border border-cyan-400/30 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-300 transition-colors"
            >
              <option value="ALL">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-[#081026] border border-cyan-400/30 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-300 transition-colors"
            >
              <option value="name-asc">Sort: Name (A–Z)</option>
              <option value="name-desc">Sort: Name (Z–A)</option>
              <option value="brand">Sort: Brand</option>
            </select>
          </div>

          {/* Brand Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-cyan-300 font-bold uppercase tracking-wider shrink-0 mr-1 text-[11px]">
              Brands:
            </span>
            <button
              onClick={() => setSelectedBrand('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedBrand === 'ALL'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 border border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-400'
              }`}
            >
              All
            </button>
            {popularBrands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(selectedBrand === b ? 'ALL' : b)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  selectedBrand === b
                    ? 'bg-cyan-400/25 border border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-white/5 border border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Status Bar & View Toggle */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-cyan-500/20">
            <div className="flex items-center gap-4">
              <span className="font-medium text-slate-300">
                Showing <strong className="text-cyan-300">{filtered.length}</strong> of {PRODUCTS.length} commercial SKUs
              </span>

              {/* View Toggle */}
              <div className="inline-flex items-center p-0.5 rounded-lg border border-cyan-400/30 bg-[#081026]">
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
                  <span>Order Sheet</span>
                </button>
              </div>
            </div>

            {(selectedCat !== 'ALL' || selectedBrand !== 'ALL' || search) && (
              <button
                onClick={() => {
                  setSelectedCat('ALL');
                  setSelectedBrand('ALL');
                  setSearch('');
                }}
                className="text-cyan-300 hover:text-cyan-200 hover:underline font-bold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Content Listing */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-cyan-500/20 bg-[#0f1c3f]/60 p-8 max-w-md mx-auto">
            <Sparkles className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-white">No products match your criteria</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Try adjusting your category, brand, or search terms.
            </p>
            <button
              onClick={() => { setSelectedCat('ALL'); setSelectedBrand('ALL'); setSearch(''); }}
              className="mt-5 px-5 py-2 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Visual Packshot Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const count = quoteItems[product.sku] || 0;
              const inQuote = count > 0;
              const badge = getBrandBadge(product.brand);

              return (
                <div
                  key={product.sku}
                  onClick={() => setSpecProduct(product)}
                  className="group relative flex flex-col justify-between rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_15px_35px_-10px_rgba(0,210,255,0.3)] cursor-pointer transition-all duration-200 overflow-hidden backdrop-blur-md"
                >
                  {/* Photo Container */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-[#081026]">
                    <img
                      src={product.image || assetUrl('/images/products/chicken_momos.jpg')}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Deep Sub-Zero Bottom Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c3f] via-transparent to-transparent opacity-80" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#081026]/90 border border-cyan-400/40 text-[10px] font-bold text-cyan-200 backdrop-blur-md uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                    </div>

                    {/* Storage Tag */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-[10px] font-bold text-cyan-300 backdrop-blur-md">
                      <Snowflake className="w-2.5 h-2.5" />
                      <span>-18°C</span>
                    </div>
                  </div>

                  {/* Product Details */}
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

                    {product.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Row */}
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
                          title="Reduce quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-white min-w-6 text-center">{count}</span>
                        <button
                          onClick={() => handleUpdate(product.sku, 1)}
                          className="px-2.5 py-1.5 hover:bg-cyan-400/30 transition-colors"
                          title="Increase quantity"
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
          /* Wholesale Products Order Sheet Table */
          <div className="overflow-x-auto rounded-2xl border border-cyan-500/25 bg-[#0f1c3f]/90 shadow-xl backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081026] border-b border-cyan-500/20 text-cyan-300 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-mono font-bold">SKU</th>
                  <th className="py-3.5 px-4 font-semibold">Product Name</th>
                  <th className="py-3.5 px-4 font-semibold">Brand</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Pack Size</th>
                  <th className="py-3.5 px-4 font-mono font-semibold">HSN</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Wholesale Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/15 text-slate-300">
                {filtered.map((product) => {
                  const count = quoteItems[product.sku] || 0;
                  const inQuote = count > 0;
                  const badge = getBrandBadge(product.brand);

                  return (
                    <tr key={product.sku} className="hover:bg-cyan-400/[0.04] transition-colors group">
                      <td className="py-3.5 px-4 font-mono text-cyan-300 font-bold">{product.sku}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white group-hover:text-cyan-200 transition-colors">
                            {product.name}
                          </span>
                          <button
                            onClick={() => setSpecProduct(product)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-cyan-300 transition-opacity"
                            title="View specifications"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{product.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-cyan-500/20 text-[11px] font-semibold text-slate-200">
                          <span
                            style={{ backgroundColor: badge.bg, color: badge.text }}
                            className="size-3.5 rounded-full text-[8px] font-bold inline-flex items-center justify-center uppercase"
                          >
                            {badge.label[0]}
                          </span>
                          <span>{product.brand}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{product.categoryName}</td>
                      <td className="py-3.5 px-4 text-white font-medium">{product.pack}</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400/80">{product.hsn || '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        {inQuote ? (
                          <div className="inline-flex items-center rounded-lg border border-cyan-400 bg-cyan-400/20 text-cyan-200 text-xs font-bold">
                            <button
                              onClick={() => handleUpdate(product.sku, -1)}
                              className="px-2 py-1 hover:bg-cyan-400/30 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-white min-w-5 text-center">{count}</span>
                            <button
                              onClick={() => handleUpdate(product.sku, 1)}
                              className="px-2 py-1 hover:bg-cyan-400/30 transition-colors"
                            >
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
