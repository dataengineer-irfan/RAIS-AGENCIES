import React from 'react';
import { ListChecks, MessageSquare, Snowflake, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: ListChecks,
    title: 'Pick your products',
    description: 'Browse the live commercial catalogue and add items to your wholesale requisition sheet.'
  },
  {
    step: '02',
    icon: MessageSquare,
    title: 'Send on WhatsApp',
    description: 'Your requisition is sent directly to our Rayachoty desk with exact SKU names and pack quantities.'
  },
  {
    step: '03',
    icon: Snowflake,
    title: 'Packed frozen',
    description: 'We pick from our sub-zero -18°C cold chain vault, packed with insulated protection to eliminate thaw.'
  },
  {
    step: '04',
    icon: Truck,
    title: 'Delivered fast',
    description: 'Same-day scheduled delivery across Rayachoty and Rayalaseema so your kitchen never runs out of stock.'
  }
];

export const OrderingWorkflow: React.FC = () => {
  return (
    <section id="workflow" className="py-12 sm:py-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative overflow-hidden">
      {/* Background radial cyan glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">
            How Ordering Works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            From our freezer to your kitchen in{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              four simple steps
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Engineered for high-turnover QSRs, pizzerias, and cloud kitchens requiring immediate stock turnaround.
          </p>
        </div>

        {/* 4-Node Illuminated Process Track */}
        <div className="relative">
          {/* Connecting Track Line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500/30 via-cyan-400 to-cyan-500/30 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {WORKFLOW_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border border-cyan-500/20 bg-[#0f1c3f]/70 backdrop-blur-md relative shadow-xl hover:border-cyan-400/60 transition-colors"
                >
                  {/* Illuminated Circular Node */}
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-[#0f1c3f] to-[#081026] border-2 border-cyan-400/60 text-cyan-300 flex items-center justify-center font-bold shadow-[0_0_25px_rgba(0,210,255,0.4)] mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="size-7" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    Step {step.step}
                  </span>

                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
