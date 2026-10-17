import React from 'react';
import { BUSINESS_INFO } from '../data/catalogue';
import { ShieldCheck, Snowflake, Truck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const VALUE_PILLARS = [
  {
    icon: ShieldCheck,
    title: '100% Quality Assured',
    description: 'Only genuine products sourced directly from authorized manufacturer distribution depots.'
  },
  {
    icon: Snowflake,
    title: 'Frozen & Fresh',
    description: 'Continuous -18°C sub-zero storage and thermal logistics to ensure zero ice crystallization.'
  },
  {
    icon: Truck,
    title: 'On Time Delivery',
    description: 'Consistent, predictable route delivery schedules so your commercial fryers never run dry.'
  },
  {
    icon: Award,
    title: 'Best Wholesale Rates',
    description: 'Direct institutional trade pricing and credit terms tailored for high-volume foodservice operations.'
  }
];

export const BrandMarquee: React.FC = () => {
  return (
    <section id="brands" className="py-12 sm:py-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Kicker & Brand Marquee */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-4">
            Authorised Institutional Distribution Partners
          </p>

          <div className="relative overflow-hidden w-full max-w-6xl mx-auto py-2">
            {/* Left and right edge gradient fades */}
            <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-[#081026] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-[#081026] to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
              className="flex items-center gap-3 sm:gap-4 w-max"
            >
              {[...BUSINESS_INFO.partnerBrands, ...BUSINESS_INFO.partnerBrands].map((brand, idx) => (
                <div
                  key={idx}
                  className="px-5 py-2.5 rounded-xl border border-cyan-500/25 bg-[#0f1c3f]/90 text-xs sm:text-sm font-bold text-white shadow-md backdrop-blur-md hover:border-cyan-400 hover:text-cyan-200 transition-colors shrink-0 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{brand}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 4 Value Proposition Cards (Direct Reference Match) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0f1c3f]/70 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-cyan-400/50 transition-colors"
              >
                <div>
                  <div className="size-12 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-bold mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
