import React from 'react';
import { ShoppingBag, X, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUSINESS_INFO, PRODUCTS } from '../data/catalogue';

interface RequisitionBarProps {
  quoteCount: number;
  distinctProductCount: number;
  onOpenQuote: () => void;
  onClearQuote: () => void;
  quoteItems?: { [sku: string]: number };
}

export const RequisitionBar: React.FC<RequisitionBarProps> = ({
  quoteCount,
  distinctProductCount,
  onOpenQuote,
  onClearQuote,
  quoteItems = {}
}) => {
  // Build WhatsApp text payload with selected SKUs & quantities (Zero-Pricing Rule Compliant)
  const buildWhatsAppUrl = () => {
    const itemsList = Object.entries(quoteItems)
      .filter(([_, qty]) => qty > 0)
      .map(([sku, qty]) => {
        const prod = PRODUCTS.find((p) => p.sku === sku);
        return `• ${prod ? prod.name : sku} (${prod ? prod.pack : ''}) — ${qty} Unit${qty > 1 ? 's' : ''}`;
      })
      .join('\n');

    const message = `Hello RAIS Agencies, I would like to request wholesale quotation and supply availability for our commercial kitchen:\n\n${itemsList}\n\nTotal Items: ${quoteCount} units across ${distinctProductCount} products.\nPlease share wholesale terms and delivery schedule for Rayachoty.`;

    return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <AnimatePresence>
      {quoteCount > 0 && (
        <motion.aside
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          aria-label="Active Wholesale Requisition Dock"
          className="fixed inset-x-0 bottom-4 z-50 px-4 pointer-events-none"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-cyan-400/40 bg-[#0f1c3f]/95 p-3 sm:p-3.5 shadow-2xl shadow-black/80 backdrop-blur-xl pointer-events-auto">
            
            {/* Cyan Shopping Basket Icon */}
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/30">
              <ShoppingBag className="size-5" />
            </div>

            {/* Requisition Status & Count */}
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white">{distinctProductCount}</span> product{distinctProductCount > 1 ? 's' : ''} ({quoteCount} total units)
              </div>
              <div className="font-serif text-sm sm:text-base font-bold text-cyan-300 truncate">
                Wholesale Requisition Ready
              </div>
            </div>

            {/* Clear Button */}
            <button
              onClick={onClearQuote}
              title="Clear Requisition"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Review Requisition Sheet Modal Action */}
            <button
              onClick={onOpenQuote}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-colors"
            >
              <span>Review Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* WhatsApp Send Action (Green Button - Signature Reference Feature) */}
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-11 px-4 sm:px-5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/60 transition-transform active:scale-95 shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span className="whitespace-nowrap">Send on WhatsApp</span>
            </a>

          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
