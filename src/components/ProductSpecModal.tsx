import React from 'react';
import { X, Thermometer, Package, Box, ShieldCheck, MessageSquare, Plus, Minus, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { ProductItem, BUSINESS_INFO } from '../data/catalogue';

interface ProductSpecModalProps {
  product: ProductItem | null;
  isOpen?: boolean;
  onClose: () => void;
  onAddToQuote: (product: ProductItem) => void;
  onUpdateQty?: (sku: string, delta: number) => void;
  currentQty?: number;
  onOpenFullQuote?: () => void;
}

export const ProductSpecModal: React.FC<ProductSpecModalProps> = ({
  product,
  isOpen = true,
  onClose,
  onAddToQuote,
  onUpdateQty,
  currentQty = 0,
  onOpenFullQuote
}) => {
  if (!isOpen || !product) return null;

  // Determine factual storage protocol based on verified product category
  const getStorageClassification = (p: ProductItem) => {
    switch (p.categoryCode) {
      case 'CHICKEN':
      case 'VEG':
        return {
          type: 'Frozen Cold Storage (-18°C)',
          detail: 'Keep frozen until use. Sub-zero commercial warehouse storage.'
        };
      case 'CHEESE':
        if (p.name.toLowerCase().includes('mozzarella')) {
          return {
            type: 'Frozen Storage (-18°C)',
            detail: 'Sub-zero frozen storage to maintain free-flowing diced shred.'
          };
        }
        return {
          type: 'Chilled Storage (2°C - 4°C)',
          detail: 'Commercial refrigeration. Keep chilled in sealed dairy storage.'
        };
      case 'SAUCES':
        return {
          type: 'Ambient Dry Goods',
          detail: 'Cool, dry storage. Refrigerate after opening.'
        };
      case 'BREADING':
      case 'SPICES':
        return {
          type: 'Dry Ambient Storage',
          detail: 'Store in dry airtight containers away from heat and direct sunlight.'
        };
      case 'PACKAGING':
        return {
          type: 'Dry Pallet Storage',
          detail: 'Food-grade dry ambient storage. Keep away from moisture.'
        };
      case 'MOJITOS':
        return {
          type: 'Ambient Beverage Storage',
          detail: 'Store in a cool, shaded environment.'
        };
      default:
        return {
          type: 'Standard Commercial Storage',
          detail: 'Follow manufacturer package guidelines.'
        };
    }
  };

  const storage = getStorageClassification(product);

  const handleWhatsAppProduct = () => {
    let msg = `*PRODUCT ENQUIRY — RAIS AGENCIES*\n`;
    msg += `──────────────────\n`;
    msg += `I am enquiring about wholesale supply for:\n`;
    msg += `*${product.name}*\n`;
    msg += `• SKU: ${product.sku}\n`;
    msg += `• Brand: ${product.brand}\n`;
    msg += `• Pack Size: ${product.pack}\n`;
    msg += `• HSN Code: ${product.hsn}\n`;
    if (currentQty > 0) msg += `• Required Quantity: *${currentQty} units/cartons*\n`;
    msg += `──────────────────\n`;
    msg += `Please provide trade availability and dispatch schedule from the Rayachoty depot.`;

    const encoded = encodeURI(msg);
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950">
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {product.sku}
              </span>
              <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                HSN {product.hsn}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              {product.name}
            </h2>
            <p className="text-xs text-slate-400">
              {product.categoryName} • Commercial Foodservice Distribution
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Visual Showcase */}
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center">
            {product.image ? (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[10px] font-bold text-amber-400">
                  Verified Official Photography
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto">
                  <Package className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Commercial Product Spec
                </div>
                <div className="text-[11px] text-slate-400">
                  Official packshot scan in progress
                </div>
              </div>
            )}
          </div>

          {/* Factual Product Description */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Commercial Product Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Verified Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* 1. Storage Classification */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                <Thermometer className="w-4 h-4" />
                <span>Storage Requirement</span>
              </div>
              <div className="text-xs font-bold text-white">{storage.type}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{storage.detail}</div>
            </div>

            {/* 2. Packaging Unit */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <Box className="w-4 h-4" />
                <span>Packaging Unit</span>
              </div>
              <div className="text-xs font-bold text-white">{product.pack}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Commercial wholesale packaging</div>
            </div>

            {/* 3. Distribution Hub */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <Building2 className="w-4 h-4" />
                <span>Depot Location</span>
              </div>
              <div className="text-xs font-bold text-white">Rayachoty Commercial Depot</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Direct warehouse pickup & regional transport</div>
            </div>

            {/* 4. Brand Verification */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Brand Verification</span>
              </div>
              <div className="text-xs font-bold text-white">{product.brand}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Authentic manufacturer stock</div>
            </div>

          </div>

          {/* Trade Requisition Note */}
          <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/15 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-white">Commercial Trade Quotation:</strong> Select your required quantity and submit to receive customized wholesale trade terms without obligation. Pricing is based on commercial volume and order frequency.
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-slate-400">Requisition Units:</span>
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => onUpdateQty?.(product.sku, -1)}
                disabled={currentQty <= 0}
                aria-label="Decrease quantity"
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-bold text-white min-w-8 text-center">
                {currentQty}
              </span>
              <button
                onClick={() => onAddToQuote(product)}
                aria-label="Increase quantity"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleWhatsAppProduct}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Enquiry</span>
            </button>

            {currentQty > 0 ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullQuote?.();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <span>In Enquiry ({currentQty})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onAddToQuote(product)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add to Enquiry</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
