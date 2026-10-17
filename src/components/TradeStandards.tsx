import React from 'react';
import { Snowflake, Building2, FileCheck2, Truck, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';

interface TradeStandardsProps {
  onOpenQuote: () => void;
}

export const TradeStandards: React.FC<TradeStandardsProps> = ({ onOpenQuote }) => {
  const pillars = [
    {
      num: '01',
      icon: Snowflake,
      title: 'Sub-Zero Cold Storage',
      subtitle: '-18°C Continuous, Rayachoty Hub',
      description: 'Dedicated commercial freezer infrastructure maintaining frozen appetizers, fries, patties and mozzarella at continuous -18°C before dispatch. No cold-chain interruption.'
    },
    {
      num: '02',
      icon: Building2,
      title: 'Original Manufacturer Stock',
      subtitle: 'Factory-sealed wholesale cartons',
      description: 'Direct wholesale allocations from ITC Master Chef, Milky Mist, Del Monte, Amul, McCain, Foodrite, VKL and Nutrich. Never repackaged or adulterated.'
    },
    {
      num: '03',
      icon: FileCheck2,
      title: 'Statutory GST Invoicing',
      subtitle: 'Transparent commercial accounting',
      description: 'Itemised commercial tax invoices with proper GST classifications for frozen foods, dairy and packaging. Buyer GSTIN recorded for B2B compliance.'
    },
    {
      num: '04',
      icon: Truck,
      title: 'Rayachoty Regional Fulfilment',
      subtitle: 'Depot pickup & route dispatch',
      description: 'Central depot near Reddies Colony enables immediate counter handover or coordinated dispatch to restaurants, cafés and caterers across Annamayya & Kadapa districts.'
    }
  ];

  const distributionRoutes = [
    { hub: 'Rayachoty Central Depot', type: 'Primary Hub', note: 'Immediate counter handover & local kitchen routes' },
    { hub: 'Kadapa Sector Corridor', type: 'Regional Route', note: 'Scheduled supply drops for QSRs & hotels' },
    { hub: 'Madanapalle Highway', type: 'Regional Route', note: 'Bulk frozen carton dispatch for bakeries & cafés' },
    { hub: 'Rajampet Sector Link', type: 'Regional Route', note: 'Direct foodservice supply, catering & dining' }
  ];

  return (
    /* One dark-background section for contrast rhythm — intentional */
    <section id="trade-standards" className="py-12 sm:py-16 bg-[#1C1410] border-b border-[#2E2418]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C8900A] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Operational Standards
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            The RAIS Distribution Standard
          </h2>
          <p className="text-sm sm:text-base text-[#A89880] mt-3 leading-relaxed">
            Wholesale food service requires uncompromising cold-chain discipline, authentic brand provenance, and transparent B2B commercial terms.
          </p>
        </div>

        {/* 4 Pillars — numbered list style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#2E2418] mb-14">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                className={`p-6 sm:p-8 flex flex-col gap-4 border-[#2E2418] ${
                  idx < 3 ? 'border-b md:border-b-0 md:border-r' : ''
                } ${idx === 1 ? 'border-b lg:border-b-0' : ''} ${idx === 2 ? 'border-b lg:border-b-0' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-3xl font-black text-[#C8900A]/35 leading-none select-none">
                    {p.num}
                  </span>
                  <Icon className="w-5 h-5 text-[#C8900A]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white leading-snug">
                    {p.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#C8900A] block mt-0.5 mb-3">
                    {p.subtitle}
                  </span>
                  <p className="text-xs text-[#A89880] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regional Distribution Strip */}
        <div className="border border-[#2E2418] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2E2418]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#C8900A] mb-1">
                <MapPin className="w-4 h-4" />
                <span>Rayachoty Central Logistics Hub (516269)</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Regional Commercial Kitchen Fulfilment
              </h3>
              <p className="text-xs text-[#A89880] mt-1 max-w-xl">
                Serving restaurants, cloud kitchens, pizzerias, cafés and banquet caterers throughout Annamayya & Kadapa districts.
              </p>
            </div>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3 bg-[#C8900A] hover:bg-[#A37308] text-white font-bold text-xs flex items-center gap-2 self-start lg:self-auto transition-colors rounded-none whitespace-nowrap"
            >
              <span>Request Wholesale Terms</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {distributionRoutes.map((r, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#C8900A] uppercase tracking-wider block">
                  {r.type}
                </span>
                <div className="text-xs font-bold text-white">{r.hub}</div>
                <p className="text-[11px] text-[#A89880] leading-snug">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
