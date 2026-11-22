import React from 'react';
import { Snowflake, Building2, FileCheck2, Truck, ShieldCheck, MapPin, ChevronRight, Navigation } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

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
    {
      hub: 'Rayachoty Town (516269)',
      distance: 'Depot Hub',
      type: 'Primary Depot Hub',
      note: 'Immediate counter handover, depot pickup & local cafe delivery',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Rayachoty+Andhra+Pradesh+516269&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Sundupalli Corridor',
      distance: '18 km',
      type: 'Daily Supply Route',
      note: 'Daily dairy, frozen fries, and packaging drops along Sundupalli Highway',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Sundupalli+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Galiveedu Highway',
      distance: '24 km',
      type: 'Daily / Alternate Day',
      note: 'Direct wholesale supply for fast food centers, shawarmas & bakeries',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Galiveedu+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Kadiri Sector',
      distance: '52 km',
      type: 'Scheduled Route',
      note: 'Commercial food kitchens, cafes, and bulk frozen carton delivery',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Kadiri+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Chinnamandem Route',
      distance: '15 km',
      type: 'Daily Route',
      note: 'Direct kitchen drops of french fries, nuggets, and kraft boxes',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Chinnamandem+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Kalakada Sector',
      distance: '28 km',
      type: 'Scheduled Delivery',
      note: 'Scheduled supply drops for bakeries, pizzerias & food points',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Kalakada+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Mahal Cross Sector',
      distance: '38 km',
      type: 'Scheduled Delivery',
      note: 'Mahal Cross eateries, highway food stalls & dhaba kitchen supply',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Mahal+Cross+Kalakada+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Madanapalle Highway',
      distance: '54 km',
      type: 'Regional Corridor',
      note: 'Bulk frozen carton dispatch for cafes, pizzerias & restaurants',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Madanapalle+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Kadapa Sector Corridor',
      distance: '52 km',
      type: 'Regional Route',
      note: 'Wholesale frozen snacks and pizza packaging supply for QSRs',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Kadapa+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    },
    {
      hub: 'Rajampet Sector Link',
      distance: '45 km',
      type: 'Regional Route',
      note: 'Direct foodservice supply, catering events & dining establishments',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Rajampet+Andhra+Pradesh&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c'
    }
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

        {/* Official Delivery Route Fleet Poster Banner (Matching Rayachoty Depot Poster) */}
        <div className="mb-14 rounded-3xl overflow-hidden border-2 border-[#C8900A]/40 bg-gradient-to-r from-[#241a14] via-[#1C1410] to-[#0f1c3f]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#C8900A]/40 shadow-xl group bg-black">
              <img
                src={assetUrl('/images/rais_delivery_routes_poster.jpg')}
                alt="We Deliver to Rayachoty and 7 Nearby Areas - RAIS Agencies Delivery Fleet"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <span className="bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#C8900A] border border-[#C8900A]/40">
                  📍 Rayachoty Hub + 7 Regional Routes
                </span>
                <span className="bg-emerald-950/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-emerald-300 border border-emerald-400/40">
                  ❄️ -18°C Cold Chain Fleet
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8900A]/15 border border-[#C8900A]/40 text-[#C8900A] text-xs font-bold uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 text-[#C8900A]" />
                <span>Refrigerated Delivery Fleet Dispatch</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
                We Deliver to Rayachoty &amp; 7 Nearby Regional Towns
              </h3>

              <p className="text-sm text-[#A89880] leading-relaxed">
                Operating daily &amp; scheduled refrigerated route logistics from our Sundupalli Road depot directly to restaurant, hotel, pizzeria and fast food kitchens across Annamayya District.
              </p>

              {/* The 7 Official Routes from Poster */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  { name: 'Chinnamandem', dist: '15 km' },
                  { name: 'Kalakada', dist: '28 km' },
                  { name: 'Mahal', dist: '38 km' },
                  { name: 'Galiveedu', dist: '24 km' },
                  { name: 'Rajampeta', dist: '45 km' },
                  { name: 'Sundupalli', dist: '18 km' },
                  { name: 'Kadiri', dist: '52 km' },
                  { name: 'Rayachoty (Hub)', dist: '516269' }
                ].map((t) => (
                  <div key={t.name} className="p-2.5 rounded-xl bg-black/40 border border-[#C8900A]/25 flex flex-col justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C8900A] shrink-0" />
                      <span className="truncate">{t.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#C8900A] mt-1">{t.dist}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={`https://wa.me/919347453135?text=${encodeURIComponent('Hello RAIS Agencies, I want to inquire about route delivery to my shop.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#C8900A] to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#C8900A]/30 transition-all hover:scale-102"
                >
                  Book Route Delivery: 9347453135
                </a>
              </div>
            </div>
          </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
            {distributionRoutes.map((r, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-[#241a14]/60 border border-[#2E2418] hover:border-[#C8900A]/40 transition-all flex flex-col justify-between space-y-3 group">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#C8900A] uppercase tracking-wider block">
                      {r.type}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#C8900A]/10 text-[#C8900A] border border-[#C8900A]/20">
                      {r.distance}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-[#C8900A] transition-colors">{r.hub}</div>
                  <p className="text-[11px] text-[#A89880] leading-snug">{r.note}</p>
                </div>

                <a
                  href={r.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded bg-[#1C1410] hover:bg-[#C8900A] text-[#C8900A] hover:text-white border border-[#C8900A]/30 text-[10px] font-bold transition-all shadow-sm"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Google Route</span>
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
