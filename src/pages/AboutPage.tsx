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
            <span>Commercial Distribution Hub</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            About{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
              RAIS Agencies
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            The authorised B2B foodservice wholesale partner for commercial kitchens across Rayachoty and the surrounding Annamayya territory.
          </p>
        </div>

        {/* Brand Authority Card */}
        <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-8 sm:p-12 mb-16 shadow-[0_20px_50px_-20px_rgba(0,210,255,0.25)] backdrop-blur-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-cyan-500/20">
            <RaisLogo size="lg" />
            <div className="text-xs text-slate-400 sm:text-right font-mono">
              <span className="text-cyan-300 font-bold block uppercase tracking-wider">Operational Cold-Chain Hub</span>
              Near Reddies Colony, Rayachoty - 516269, A.P.
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white font-semibold">RAIS Agencies</strong> is a specialised commercial food distributor engineered to bridge institutional food manufacturers with regional food service operators. Based in Rayachoty, Andhra Pradesh, we supply quick-service restaurants, pizzerias, burger counters, cafés, and banquet caterers with continuous allocations of verified foodservice inventory.
            </p>
            <p>
              Unlike general grocery wholesalers who treat frozen items as secondary shelf stock, RAIS Agencies operates with dedicated <strong className="text-cyan-300 font-semibold">-18°C sub-zero cold-chain discipline</strong>. Our vault preserves the moisture, texture, and crispness of products from nationally recognised brands like <strong className="text-white font-semibold">ITC Master Chef</strong>, <strong className="text-white font-semibold">Milky Mist</strong>, <strong className="text-white font-semibold">Del Monte</strong>, <strong className="text-white font-semibold">McCain</strong>, <strong className="text-white font-semibold">Foodrite</strong>, and <strong className="text-white font-semibold">Godrej</strong>.
            </p>
          </div>

          {/* Operational Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-cyan-500/20">
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">{PRODUCTS.length}+</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Verified SKUs</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">8+</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">National Brands</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">-18°C</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Cold-Chain Vault</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 text-center">
              <div className="font-serif text-3xl font-black text-cyan-300">100%</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">B2B Tax Invoiced</div>
            </div>
          </div>
        </div>

        {/* 4 Core Operational Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Snowflake className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">Sub-Zero Cold Chain Discipline</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All frozen French fries, chicken nuggets, momos, burger patties, and mozzarella cheese are stored at strictly monitored -18°C deep freeze conditions to prevent ice recrystallisation and culinary texture degradation.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">Genuine Brand Allocations</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We stock directly sourced, original factory-sealed commercial cartons from established manufacturers. No repackaging, unbranded substitutes, or compromise on food hygiene standards.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Truck className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">Local Rayachoty Distribution</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Direct counter pick-ups and scheduled delivery dispatches across the Rayachoty territory ensure chefs and restaurant managers never run out of critical menu items during busy weekend services.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-7 shadow-lg backdrop-blur-md space-y-4 hover:border-cyan-400/50 transition-colors">
            <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Users className="size-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">Statutory GST Commercial Billing</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Itemised commercial tax invoices detailing statutory GST classifications (5% frozen food, 12% dairy & sauces, 18% packaging) with buyer GSTIN recording for transparent commercial accounting.
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
              <h4 className="font-serif text-lg font-bold text-white">Visit Our Physical Distribution Hub</h4>
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
