import React, { useState } from 'react';
import { ThermometerSnowflake, ShieldCheck, Truck, Layers, Activity, ChevronRight, MapPin } from 'lucide-react';

interface StorageZone {
  id: string;
  name: string;
  temp: string;
  targetRange: string;
  status: 'Optimal' | 'Active';
  color: string;
  badgeColor: string;
  categories: string[];
  protocol: string;
  monitoring: string;
}

const STORAGE_ZONES: StorageZone[] = [
  {
    id: 'frozen',
    name: 'Sub-Zero Deep Freeze Vault',
    temp: '-18.4°C',
    targetRange: '-18°C to -22°C',
    status: 'Optimal',
    color: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    categories: ['Chicken Items', 'Veg Snacks', 'French Fries', 'Momos'],
    protocol: 'Continuous cryogenic compression cycle with backup diesel generator synchronization.',
    monitoring: 'Dual digital NTC temperature telemetry logged at 15-minute intervals.'
  },
  {
    id: 'chilled',
    name: 'Chilled Dairy & Cheese Chamber',
    temp: '+2.8°C',
    targetRange: '0°C to +4°C',
    status: 'Optimal',
    color: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    categories: ['Mozzarella Diced', 'Cheese Slices', 'Table Butter', 'Fresh Paneer'],
    protocol: 'Micro-climate air circulation preventing moisture condensation on dairy packaging.',
    monitoring: 'Constant dew-point monitoring to safeguard melt characteristics and shelf-life.'
  },
  {
    id: 'ambient',
    name: 'Controlled Ambient Warehouse',
    temp: '+21.5°C',
    targetRange: '+18°C to +25°C',
    status: 'Active',
    color: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    categories: ['Ketchup & Sauces', 'Kraft Pizza Boxes', 'Breading Mix', 'Spices'],
    protocol: 'Relative humidity below 65% preserving carton flute compression strength and powder dryness.',
    monitoring: 'Hygrometer logging protecting corrugated cardboard structural integrity.'
  }
];

export const ColdChainHUD: React.FC = () => {
  const [activeZoneId, setActiveZoneId] = useState<string>('frozen');
  const activeZone = STORAGE_ZONES.find(z => z.id === activeZoneId) || STORAGE_ZONES[0];

  return (
    <section id="cold-chain-hud" className="relative py-16 bg-[#0B0F17] border-y border-stone-800/80 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-900/10 via-amber-900/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-stone-800/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
              <Activity className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>Depot Telemetry & Logistics Discipline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              Operational Cold-Chain Standards & Storage Regimes
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5" />
              Rayachoty Central Depot Active
            </span>
            <span className="text-stone-700">|</span>
            <span className="font-mono text-stone-400">HSN & FSSAI Compliant</span>
          </div>
        </div>

        {/* Interactive Zone Switcher & Telemetry Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: 3 Temperature Zones Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {STORAGE_ZONES.map((zone) => {
              const isSelected = zone.id === activeZoneId;
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZoneId(zone.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-stone-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-900/40 hover:border-stone-700/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <ThermometerSnowflake className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                        <span className={`text-sm font-semibold tracking-wide ${isSelected ? 'text-white' : 'text-stone-300'}`}>
                          {zone.name}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-mono">
                        Target: {zone.targetRange}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                        {zone.temp}
                      </div>
                      <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-mono uppercase tracking-wider border ${zone.badgeColor}`}>
                        {zone.status}
                      </span>
                    </div>
                  </div>

                  {/* Selection indicator rail */}
                  {isSelected && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l transition-all duration-300"
                    />
                  )}
                </button>
              );
            })}

            {/* Regional Transport Corridor Strip */}
            <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/60 mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mb-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Daily Consolidated Delivery Corridors</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Rayachoty Hub', 'Kadapa Route', 'Rajampet Corridor', 'Madanapalle Line', 'Kalakada Store'].map((corridor, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 text-[11px] font-mono text-stone-400 border border-stone-800"
                  >
                    <MapPin className="w-3 h-3 text-amber-500/70" />
                    {corridor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: In-Depth Operational Specs for Selected Zone */}
          <div className="lg:col-span-7">
            <div
              key={activeZone.id}
              className="h-full rounded-2xl bg-gradient-to-br from-stone-900/90 via-stone-950/80 to-[#0B0F17] border border-amber-500/20 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300"
            >
              {/* Subtle top glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${activeZone.color} blur-[80px] pointer-events-none`} />

              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-800">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90">
                      Operational Zone Specification
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-white mt-0.5">
                      {activeZone.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900/90 border border-stone-700/60 font-mono text-xs text-stone-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>FSSAI Cold Chain Standard</span>
                  </div>
                </div>

                {/* Stocked Category Coverage */}
                <div className="mt-6">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Associated Wholesale Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeZone.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-md bg-stone-900/80 text-xs font-medium text-stone-200 border border-stone-800/80"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Protocol & Handling Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/60">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                      Handling Protocol
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {activeZone.protocol}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/60">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                      Sensor Telemetry Log
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {activeZone.monitoring}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Assurance Banner */}
              <div className="mt-8 pt-5 border-t border-stone-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Protected transit via insulated PUF containers & eutectic cooling.</span>
                </div>
                <a
                  href="#/who-we-serve"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  <span>View Delivery Schedules</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
