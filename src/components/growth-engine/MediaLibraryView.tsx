import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, CheckCircle2, ShieldCheck, 
  Upload, Eye, Download, Camera, Check, Copy, Sparkles
} from 'lucide-react';
import { assetUrl } from '../../utils/assetUrl';

interface MediaItem {
  id: number;
  title: string;
  category: string;
  filename: string;
  imageUrl: string;
  description: string;
  is_verified_genuine: boolean;
  uploaded_to_gbp: boolean;
}

const INITIAL_MEDIA_ASSETS: MediaItem[] = [
  {
    id: 1,
    title: 'Commercial Deep Freezer Inventory',
    category: 'Cold Storage',
    filename: 'triken_chicken_momos_freezer_rack.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/01_Frozen_Chicken/triken_chicken_momos_freezer_rack.jpg'),
    description: '-18°C cold-chain deep freezers holding verified Triken momos & french fries inventory.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 2,
    title: 'Milky Mist Diced Mozzarella (1kg & 2kg)',
    category: 'Dairy Products',
    filename: 'milky_mist_mozzarella.jpg',
    imageUrl: assetUrl('/assets/products/milky_mist_mozzarella.jpg'),
    description: 'Authentic high-stretch mozzarella cheese pouches ready for pizza and cafe supply.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 3,
    title: 'Golden Crispy French Fries (6mm & 9mm)',
    category: 'Frozen Foods',
    filename: 'amul_french_fries.jpg',
    imageUrl: assetUrl('/assets/products/amul_french_fries.jpg'),
    description: 'Grade-A 6mm shoestring & 9mm regular commercial fries for QSR kitchens.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 4,
    title: 'Triken Chicken Momos & Nuggets',
    category: 'Snacks',
    filename: 'triken_chicken_momos.jpg',
    imageUrl: assetUrl('/assets/products/triken_chicken_momos.jpg'),
    description: 'Authentic thin-wrapper chicken momos and crispy nuggets stored in sub-zero freezers.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 5,
    title: 'Printed Pizza Takeaway Boxes (10 Inch)',
    category: 'Packaging',
    filename: 'pizza_boxes_corrugated.jpg',
    imageUrl: assetUrl('/assets/products/pizza_boxes_corrugated.jpg'),
    description: 'Heavy 3-ply corrugated thermal pizza delivery boxes that retain heat during transit.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 6,
    title: 'Food-Grade OGR Butter Paper 40 GSM',
    category: 'Packaging',
    filename: 'butter_paper_40gsm.jpg',
    imageUrl: assetUrl('/assets/products/butter_paper_40gsm.jpg'),
    description: 'Greaseproof wrapping paper sheets for burgers, shawarmas, and fried chicken.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 7,
    title: 'Commercial Pizza Bases (8.5 & 10 Inch)',
    category: 'Bakery',
    filename: 'pizza_base_commercial.jpg',
    imageUrl: assetUrl('/assets/products/pizza_base_commercial.jpg'),
    description: 'Double-proofed commercial pizza crusts for fast-food cafes & pizzerias.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 8,
    title: 'Burger Clamshell & Pastry Boxes',
    category: 'Packaging',
    filename: 'burger_boxes_takeaway.jpg',
    imageUrl: assetUrl('/assets/products/burger_boxes_takeaway.jpg'),
    description: 'Authentic printed 4x4 burger boxes and pastry packaging for local takeaway cafes.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  }
];

export const MediaLibraryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem('rais_custom_media_assets');
      if (stored) {
        return [...JSON.parse(stored), ...INITIAL_MEDIA_ASSETS];
      }
    } catch {}
    return INITIAL_MEDIA_ASSETS;
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['ALL', 'Cold Storage', 'Dairy Products', 'Frozen Foods', 'Snacks', 'Bakery', 'Packaging'];

  const filteredAssets = selectedCategory === 'ALL' 
    ? mediaList 
    : mediaList.filter(m => m.category === selectedCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newAsset: MediaItem = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        category: 'Cold Storage',
        filename: file.name,
        imageUrl: reader.result as string,
        description: 'Uploaded depot photo ready for Google Maps & Instagram Reels publishing.',
        is_verified_genuine: true,
        uploaded_to_gbp: false
      };

      const updated = [newAsset, ...mediaList];
      setMediaList(updated);
      try {
        const customOnly = updated.filter(a => a.id > 100);
        localStorage.setItem('rais_custom_media_assets', JSON.stringify(customOnly));
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Authentic Photo &amp; Media Asset Library</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real high-resolution photographs of RAIS Agencies deep freezers, commercial cheese, Triken momos, and printed packaging for Google Maps and Instagram Reels.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Real Depot Photo</span>
          </button>
        </div>
      </div>

      {/* Compliance Callout */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-300">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
        <span>
          <strong>Zero Stock Photo Guarantee:</strong> All media assets below are authentic depot photos or supplier product photography. Use these directly in your Google Maps updates and Instagram posts.
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 custom-scrollbar">
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
            className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-lg"
          >
            {/* Real Image Preview */}
            <div className="h-44 bg-[#070b14] border-b border-slate-800 relative overflow-hidden flex items-center justify-center">
              <img 
                src={asset.imageUrl} 
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 backdrop-blur-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>GENUINE</span>
                </span>
              </div>
            </div>

            {/* Asset Details */}
            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider font-mono">
                    {asset.category}
                  </span>
                  {asset.uploaded_to_gbp && (
                    <span className="text-[10px] text-emerald-400 font-mono">Synced to Maps</span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{asset.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {asset.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => copyUrl(asset.id, asset.imageUrl)}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                </button>
                <a
                  href={asset.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-all"
                  title="View Full Resolution"
                >
                  <Eye className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
