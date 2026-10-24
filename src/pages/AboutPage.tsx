import React from 'react';
import { BUSINESS_INFO, PRODUCTS } from '../data/catalogue';
import { MapPin, Snowflake, Award, ShieldCheck, Truck, Users, ArrowRight } from 'lucide-react';
import { RaisLogo } from '../components/RaisLogo';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-[#081026] text-white min-h-screen relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 left-1/3 w-[650px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[400px] bg-blue-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <Award className="size-4 text-cyan-400" />
            <span>Wholesale Agency & Cold Storage Depot</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            About{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
              RAIS Agencies
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            Rayachoty's direct wholesale agency for frozen foods, fast food ingredients, and takeaway packaging for hotels, fast food centers, cafes, and bakeries across Rayachoty (516269) and Annamayya district.
          </p>
        </div>

        {/* Brand Authority Card */}
        <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-8 sm:p-12 mb-16 shadow-[0_20px_50px_-20px_rgba(0,210,255,0.25)] backdrop-blur-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-cyan-500/20">
            <RaisLogo size="lg" />
            <div className="text-xs text-slate-400 sm:text-right font-mono">
              <span className="text-cyan-300 font-bold block uppercase tracking-wider">Depot & Cold Storage</span>
              Near Reddies Colony, Rayachoty - 516269, A.P.
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white font-semibold">RAIS Agencies</strong> is Rayachoty's dedicated wholesale agency supplying frozen foods, bakery ingredients, pizza & burger items, sauces, and restaurant packaging materials. Located near Reddies Colony, Rayachoty (516269), we supply local fast food centers, hotels, dhabas, cafes, bakeries, shawarma counters, and event caterers with fresh, brand-certified stock at direct depot wholesale rates.
            </p>
            <p>
              Unlike ordinary shops, RAIS Agencies operates dedicated <strong className="text-cyan-300 font-semibold">-18°C deep freezers</strong> so your french fries, chicken nuggets, momos, burger patties, and pizza cheese never melt, spoil, or lose their taste. We bring genuine stock directly from India's trusted brands like <strong className="text-white font-semibold">ITC Master Chef</strong>, <strong className="text-white font-semibold">Milky Mist</strong>, <strong className="text-white font-semibold">Del Monte</strong>, <strong className="text-white font-semibold">McCain</strong>, <strong className="text-white font-semibold">Foodrite</strong>, and <strong className="text-white font-semibold">Godrej</strong>.
            </p>
          </div>

          {/* Operational Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-cyan-500/20">
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">{PRODUCTS.length}+</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Wholesale Items</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">8+</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">National Brands</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">-18°C</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Deep Freezers</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">100%</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Original Brand Stock</div>
            </div>
          </div>
        </div>

        {/* 4 Core Operational Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Snowflake className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">Continuous -18°C Deep Freezing</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              French fries, chicken nuggets, momos, burger patties, and mozzarella cheese stay at strictly maintained -18°C so your food fries up crisp with zero soggy ice buildup.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">100% Genuine Brand Cartons</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Directly sourced, factory-sealed master cartons from India's top brands. No loose repacking, no low-grade duplicates, only 100% genuine quality.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Truck className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">Same-Day Delivery & Counter Pickup</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instant pickup from our Rayachoty depot or same-day town delivery right to your shop or hotel counter so you never run out during evening rush hours.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Users className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">Clear Wholesale Billing & GST Invoices</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Proper wholesale tax bills with clear rates and GST classification. Complete transparency with no hidden charges for Rayachoty business owners.
            </p>
          </div>
        </div>

        {/* Physical Hub Location Box */}
        <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-r from-[#0f1c3f] to-[#081026] p-8 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
              <MapPin className="size-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Visit Our Rayachoty Wholesale Depot</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{BUSINESS_INFO.address}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%20RAIS%20Agencies,%20I%20would%20like%20directions%20to%20your%20hub.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] transition-all shrink-0 flex items-center gap-2"
          >
            <span>Get Directions on WhatsApp</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
