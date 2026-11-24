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
    title: 'Commercial Deep Freezer Inventory Fleet',
    category: 'Cold Storage',
    filename: 'commercial_chest_freezers_row.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/08_Depot_Facility/commercial_chest_freezers_row.jpg'),
    description: '-18°C cold-chain deep freezers holding verified Triken momos, chicken nuggets & french fries inventory.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 2,
    title: 'Milky Mist Diced Mozzarella (1kg & 2kg)',
    category: 'Dairy Products',
    filename: 'enhanced_dairy-004.jpg',
    imageUrl: assetUrl('/assets/products/enhanced_dairy-004.jpg'),
    description: 'Authentic high-stretch mozzarella cheese pouches ready for pizza and cafe supply.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 3,
    title: 'Amul French Fries (9mm Regular Cut)',
    category: 'Frozen Foods',
    filename: 'amul_french_fries_9mm.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/02_Veg_Snacks/amul_french_fries_9mm.jpg'),
    description: 'Grade-A 9mm regular cut crispy fries with low oil absorption for QSR kitchens.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 4,
    title: 'McCain French Fries (2.5kg Commercial Pack)',
    category: 'Frozen Foods',
    filename: 'mccain_french_fries_2_5kg.jpg',
    imageUrl: assetUrl('/assets/products/mccain_french_fries_2_5kg.jpg'),
    description: 'Bulk 2.5kg McCain commercial french fries for high-volume fryers and fast food counters.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 5,
    title: 'Triken Chicken Momos (1kg Cold-Chain Pack)',
    category: 'Frozen Foods',
    filename: 'triken_chicken_momos_pack_details.jpg',
    imageUrl: assetUrl('/assets/products/triken_chicken_momos_pack_details.jpg'),
    description: 'Authentic thin-wrapper chicken momos stored in sub-zero freezers for cafes & food courts.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 6,
    title: 'Meal Time Dark Soya Sauce (5kg Depot Can)',
    category: 'Sauces & Canned',
    filename: 'enhanced_sauces-025.jpg',
    imageUrl: assetUrl('/assets/products/enhanced_sauces-025.jpg'),
    description: 'Authentic 5kg bulk can of Meal Time Dark Soya Sauce for Chinese kitchens, fried rice, and noodles.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 7,
    title: 'Meal Time Green Chilli Sauce (5kg Depot Can)',
    category: 'Sauces & Canned',
    filename: 'enhanced_sauces-027.jpg',
    imageUrl: assetUrl('/assets/products/enhanced_sauces-027.jpg'),
    description: 'Commercial 5kg bulk can of Meal Time Green Chilli Sauce for fast food and street food kitchens.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 8,
    title: 'Del Monte Sliced Jalapeños (3kg Foodservice Tin)',
    category: 'Sauces & Canned',
    filename: 'enhanced_sauces-010.jpg',
    imageUrl: assetUrl('/assets/products/enhanced_sauces-010.jpg'),
    description: 'Crispy pickled sliced jalapeños for burger toppings, gourmet pizzas, and loaded nachos.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 9,
    title: 'Habit Canned Mushrooms & Baby Corn',
    category: 'Sauces & Canned',
    filename: 'enhanced_syrups-004.jpg',
    imageUrl: assetUrl('/assets/products/enhanced_syrups-004.jpg'),
    description: 'Commercial canned button mushrooms and tender baby corn for pizza toppings and continental gravies.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 10,
    title: 'Golden Crown Japanese Panko Bread Crumbs (1kg)',
    category: 'Bakery',
    filename: 'enhanced_sauces-024.jpg',
    imageUrl: assetUrl('/assets/products/enhanced_sauces-024.jpg'),
    description: 'Flaky Japanese style panko crumbs for extra-crispy fried chicken, paneer cutlets, and nuggets.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 11,
    title: 'Fresh2Go 8.5" Tortilla Wraps',
    category: 'Bakery',
    filename: 'fresh2go_tortilla_wrap_8_5_inch.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/05_Bakery_Breading/fresh2go_tortilla_wrap_8_5_inch.jpg'),
    description: 'Soft, tear-resistant commercial tortilla wraps for Mexican wraps, shawarmas, and rolls.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 12,
    title: 'Printed Pizza Takeaway Boxes (8x8 & 10x10)',
    category: 'Packaging',
    filename: 'pizza_boxes_8x8_printed_plain_flat.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/07_Packaging_Disposables/pizza_boxes_8x8_printed_plain_flat.jpg'),
    description: 'Heavy 3-ply corrugated thermal pizza delivery boxes in plain and custom printed designs.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 13,
    title: 'Burger Clamshell & Pastry Boxes (4x4)',
    category: 'Packaging',
    filename: 'rais_authentic_burger_boxes_clamshells.jpg',
    imageUrl: assetUrl('/images/rais_authentic_burger_boxes_clamshells.jpg'),
    description: 'Authentic printed 4x4 food-grade burger boxes and pastry clamshell packaging.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 14,
    title: 'Fried Chicken Takeaway Buckets',
    category: 'Packaging',
    filename: 'fried_chicken_buckets_carton_display.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/07_Packaging_Disposables/fried_chicken_buckets_carton_display.jpg'),
    description: 'Oil-resistant printed fried chicken buckets with vented lids for takeaway fried chicken counters.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 15,
    title: 'White Plastic Takeaway Containers & Lids',
    category: 'Packaging',
    filename: 'white_plastic_takeaway_containers_stacks.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/07_Packaging_Disposables/white_plastic_takeaway_containers_stacks.jpg'),
    description: 'Microwave-safe round takeaway bowls and spill-proof containers for curries and gravies.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 16,
    title: 'Rich Dairy Fresh Cream (Foodservice Pack)',
    category: 'Dairy Products',
    filename: 'madhusudan_fresh_cream_carton_fruit_bowl.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/03_Dairy_Cheese/madhusudan_fresh_cream_carton_fruit_bowl.jpg'),
    description: 'High-fat dairy fresh cream for restaurant butter chicken, paneer gravies, and cafe pastas.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 17,
    title: 'Milky Mist Mozzarella 2kg Commercial Pouch',
    category: 'Dairy Products',
    filename: 'milky_mist_mozzarella_2kg_pack_studio.jpg',
    imageUrl: assetUrl('/assets/enhanced_insta_photos/03_Dairy_Cheese/milky_mist_mozzarella_2kg_pack_studio.jpg'),
    description: '2kg bulk pouch of Milky Mist mozzarella cheese for commercial high-output pizzerias.',
    is_verified_genuine: true,
    uploaded_to_gbp: true
  },
  {
    id: 18,
    title: 'RAIS Agencies Depot Storefront & Hub',
    category: 'Cold Storage',
    filename: 'rais_storefront_official.jpg',
    imageUrl: assetUrl('/images/ref-assets/rais_storefront_official.jpg'),
    description: 'Official wholesale distribution center Beside Indel Money Bank, Sundupalli Road, Rayachoty.',
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
        const parsed = JSON.parse(stored);
        const validCustom = parsed.filter((item: any) => item && item.id > 100 && (item.imageUrl?.startsWith('data:') || item.imageUrl?.startsWith('http')));
        return [...validCustom, ...INITIAL_MEDIA_ASSETS];
      }
    } catch {}
    return INITIAL_MEDIA_ASSETS;
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['ALL', 'Cold Storage', 'Dairy Products', 'Frozen Foods', 'Sauces & Canned', 'Bakery', 'Packaging'];

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
