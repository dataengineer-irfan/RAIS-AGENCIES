import React, { useState } from 'react';
import { 
  Image as ImageIcon, CheckCircle2, ShieldCheck, 
  Upload, Tag, Eye, Info, Camera
} from 'lucide-react';

interface MediaItem {
  id: number;
  title: string;
  category: string;
  filename: string;
  description: string;
  is_verified_genuine: boolean;
  uploaded_to_gbp: boolean;
}

export const MediaLibraryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const mediaAssets: MediaItem[] = [
    {
      id: 1,
      title: 'RAIS Shop Signboard & Exterior',
      category: 'Shop & Hub',
      filename: 'rais_shop_exterior_sundupalli.jpg',
      description: 'Physical landmark signboard beside Indel Money Bank on Sundupalli Road Hub.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    },
    {
      id: 2,
      title: 'Commercial Deep Freezer Inventory',
      category: 'Cold Storage',
      filename: 'rais_deep_freezers_coldchain.jpg',
      description: '-18°C cold-chain deep freezers holding verified Milky Mist & fries inventory.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    },
    {
      id: 3,
      title: 'Milky Mist Diced Mozzarella (1kg pack)',
      category: 'Dairy Products',
      filename: 'milky_mist_mozzarella_1kg_case.jpg',
      description: 'Authentic 1kg shredded mozzarella cheese pouches ready for pizza and cafe supply.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    },
    {
      id: 4,
      title: 'Golden Crispy French Fries (2.5kg Case)',
      category: 'Frozen Foods',
      filename: 'french_fries_commercial_case.jpg',
      description: 'Grade-A 6mm & 9mm commercial french fries for QSR deep frying.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    },
    {
      id: 5,
      title: 'Chicken Nuggets & Finger Snacks Shelf',
      category: 'Snacks',
      filename: 'chicken_nuggets_snacks_pack.jpg',
      description: 'Chicken popcorn, nuggets, and patties stored in sub-zero warehouse racks.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    },
    {
      id: 6,
      title: '40 GSM Food-Grade Butter Paper Rolls',
      category: 'Packaging',
      filename: 'butter_paper_40gsm_shawarma.jpg',
      description: 'Greaseproof wrapping paper rolls for shawarma, kathi rolls, and burgers.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    },
    {
      id: 7,
      title: '8.5 & 10 Inch Stone Pizza Bases',
      category: 'Bakery',
      filename: 'pizza_bases_8_and_10_inch.jpg',
      description: 'Freshly packed vacuum-sealed commercial pizza crusts for bakeries & cafes.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    },
    {
      id: 8,
      title: 'Burger Cartons & Pizza Corrugated Boxes',
      category: 'Packaging',
      filename: 'burger_pizza_boxes_bulk.jpg',
      description: 'Sturdy food delivery takeaway boxes with thermal steam vents.',
      is_verified_genuine: true,
      uploaded_to_gbp: true
    }
  ];

  const categories = ['ALL', 'Shop & Hub', 'Cold Storage', 'Dairy Products', 'Frozen Foods', 'Snacks', 'Bakery', 'Packaging'];

  const filteredAssets = selectedCategory === 'ALL' 
    ? mediaAssets 
    : mediaAssets.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Authentic Photo & Media Asset Library</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Google Business Profile ranks listings higher when authentic real photos of the store, freezers, and products are published. Strict zero-stock-photo compliance policy.
          </p>
        </div>

        <div>
          <button
            onClick={() => alert('Simulated Photo Upload: In production, upload your authentic shop photos directly here to sync with Google Business Profile.')}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Real Shop Photo</span>
          </button>
        </div>
      </div>

      {/* Compliance Callout */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-300">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
        <span>
          <strong>Policy Notice:</strong> Only genuine photographs taken at the RAIS Agencies shop, warehouse, or cold storage on Sundupalli Road are approved. Artificial stock graphics are prohibited to prevent Google trust score degradation.
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredAssets.map((asset) => (
          <div 
            key={asset.id}
            className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Thumbnail Placeholder */}
            <div className="h-36 bg-[#070b14] border-b border-slate-800 flex flex-col items-center justify-center p-4 relative group">
              <Camera className="w-8 h-8 text-amber-400/80 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] text-slate-400 font-mono text-center truncate w-full px-2">
                {asset.filename}
              </div>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>AUTHENTIC</span>
                </span>
              </div>
            </div>

            {/* Asset Details */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {asset.category}
                </span>
                {asset.uploaded_to_gbp && (
                  <span className="text-[10px] text-slate-400">Live on GBP</span>
                )}
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{asset.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {asset.description}
              </p>
            </div>

            <div className="p-3 bg-[#0a0f1d] border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Location: Rayachoty Hub</span>
              <span className="text-emerald-400 font-medium">Ready for Posts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};