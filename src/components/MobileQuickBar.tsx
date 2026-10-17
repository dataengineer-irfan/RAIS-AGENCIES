import React from 'react';
import { Phone, MessageSquare, FileText } from 'lucide-react';
import { BUSINESS_INFO } from '../data/catalogue';

interface MobileQuickBarProps {
  onOpenQuote: () => void;
  quoteCount: number;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onOpenQuote,
  quoteCount
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 p-2.5 flex items-center justify-between gap-2 shadow-2xl">
      {/* 1. Direct Phone Call */}
      <a
        href={`tel:${BUSINESS_INFO.primaryPhone}`}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 active:scale-95 transition-transform"
      >
        <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
        <span className="text-[10px] font-bold">Call Desk</span>
      </a>

      {/* 2. Direct WhatsApp Order */}
      <a
        href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%20RAIS%20Agencies,%20I%20would%20like%20to%20order%20wholesale%20items.`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 active:scale-95 transition-transform"
      >
        <MessageSquare className="w-4 h-4 text-emerald-400 mb-0.5" />
        <span className="text-[10px] font-bold">WhatsApp</span>
      </a>

      {/* 3. Review Quote */}
      <button
        onClick={onOpenQuote}
        className="flex-[1.2] relative flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
      >
        {quoteCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">
            {quoteCount}
          </span>
        )}
        <FileText className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-black">Quote ({quoteCount})</span>
      </button>
    </div>
  );
};
