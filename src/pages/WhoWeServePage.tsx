import React from 'react';
import { Utensils, Pizza, Coffee, Store, ShieldCheck, CheckCircle2, ArrowRight, MessageSquare, Phone, Snowflake, Truck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/catalogue';
import { assetUrl } from '../utils/assetUrl';

interface WhoWeServePageProps {
  onOpenQuote: () => void;
}

export const WhoWeServePage: React.FC<WhoWeServePageProps> = ({ onOpenQuote }) => {
  const segments = [
    {
      icon: Utensils,
      title: 'Fast-Food & Burger Hubs',
      subtitle: 'QSRs, Snack Counters & Food Trucks',
      image: assetUrl('/images/products/kraft_burger_box.jpg'),
      tag: 'Fryer & Griddle Staples',
      challenge: 'High turnover during peak evening hours requires rapid cooking times, consistent patty size, and leak-proof packaging.',
      solution: 'Pre-portioned frozen 9mm/6mm French fries that fry crisp in 3 minutes, seasoned Nutrich chicken & veg patties, and heavy-gauge corrugated kraft clamshell burger boxes.',
      recommended: [
        'Hup Hup French Fries 9mm (2.5kg)',
        'Nutrich Chicken Burger Patty (1kg)',
        'Burger Box 4"x4" & 5"x5" Kraft Clamshell',
        'Del Monte Tandoori Mayo (1kg)',
        'Foodrite Bulk Ketchup (1kg)'
      ]
    },
    {
      icon: Pizza,
      title: 'Pizzerias & Italian Bistros',
      subtitle: 'Wood-fired & Commercial Deck Pizzerias',
      image: assetUrl('/images/products/kraft_pizza_box.jpg'),
      tag: 'High-Stretch Pizza Melt',
      challenge: 'Consistent mozzarella melt, stretch, and browning without excess oil separation, plus heat-retaining delivery boxes.',
      solution: 'Milky Mist 100% Mozzarella Diced Cheese (1kg & 2kg) with high stretch tolerance, seasoned Del Monte pizza-pasta sauce, and heavy-duty 8"x8" plain/printed corrugated pizza boxes.',
      recommended: [
        'Milky Mist Mozzarella Diced (2kg)',
        'Pizza Box 8"x8" Heavy Kraft (100 Nos)',
        'Del Monte Pizza Pasta Sauce (1kg)',
        'Par-Baked 8-inch Commercial Pizza Bases',
        'RAIS Select Oregano Seasoning (1kg)'
      ]
    },
    {
      icon: Coffee,
      title: 'Cafés & Beverage Lounges',
      subtitle: 'Mocktail Bars, Tea Lounges & Cafés',
      image: assetUrl('/images/products/mojito_lime_mint.jpg'),
      tag: 'Speed-Pour Syrups & Finger Foods',
      challenge: 'High beverage margin requires standardized mocktail syrup ratios, plus grab-and-go finger snacks that require zero kitchen prep.',
      solution: 'High-concentration lime-mint and blue curacao syrups, commercial fruit crushes, pliable tortilla wraps for rolls, and ITC cheesy corn triangles.',
      recommended: [
        'Lime and Mint Mojito Syrup (750ml)',
        'Blue Curacao Mojito Syrup (750ml)',
        'Strawberry Mojito Fruit Crush (750ml)',
        'Signature Tortillah 8.5 Inches (10 Nos)',
        'ITC Cheesy Corn Triangles (1kg)'
      ]
    },
    {
      icon: Store,
      title: 'Hotels, Banquets & Caterers',
      subtitle: 'Event Catering, Buffets & Institutional Messes',
      image: assetUrl('/images/products/chicken_momos.jpg'),
      tag: 'Bulk Staging & High-Volume IQF',
      challenge: 'Serving 500+ guests simultaneously requires zero-prep appetizers, consistent paneer quality, and bulk condiments.',
      solution: 'ITC handcrafted frozen momos, Godrej paneer pops & tandoori nuggets, Milky Mist paneer cubes, and 8g single-serve condiment sachets for sanitized banquet service.',
      recommended: [
        'I.T.C Veg & Chicken Momos (1 Packet / 500g)',
        'Godrej Paneer Pops (1kg)',
        'Milky Mist Fresh Paneer Cubes (1kg)',
        'Del Monte Ketchup (8g Sachets × 1000)',
        'Foodrite Mayonnaise (8g Sachets × 1000)'
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-[#081026] text-white min-h-screen relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[400px] bg-blue-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Dedicated Commercial Foodservice Partnerships</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Commercial Wholesale Solutions Built for{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
              Your Kitchen
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            From single-counter street cafés to high-volume banquet halls across Rayachoty and Rayalaseema, we support commercial kitchens with dedicated cold-storage inventory and direct wholesale terms.
          </p>
        </div>

        {/* Detailed Segments List */}
        <div className="space-y-10 mb-20">
          {segments.map((seg, idx) => {
            const Icon = seg.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/85 p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(0,210,255,0.25)] backdrop-blur-xl transition-all hover:border-cyan-400/50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                  {/* Left Column: Image with Tag */}
                  <div className="lg:col-span-5 relative overflow-hidden rounded-2xl aspect-[4/3] bg-[#081026] border border-cyan-400/20">
                    <img
                      src={seg.image}
                      alt={seg.title}
                      className="w-full h-full object-cover object-center filter drop-shadow-md"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081026] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-[#081026]/90 border border-cyan-400/40 text-[10px] font-bold text-cyan-300 backdrop-blur-md uppercase tracking-wider">
                        {seg.tag}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Overview & Tailored Essentials */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-md">
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                          {seg.subtitle}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                          {seg.title}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                      <div>
                        <strong className="text-cyan-200 block mb-1 font-semibold">Operational Demand:</strong>
                        <p className="leading-relaxed text-slate-300">{seg.challenge}</p>
                      </div>
                      <div>
                        <strong className="text-cyan-200 block mb-1 font-semibold">RAIS Wholesale Advantage:</strong>
                        <p className="leading-relaxed text-slate-300">{seg.solution}</p>
                      </div>
                    </div>

                    {/* Curated Essentials */}
                    <div className="p-4 rounded-2xl bg-[#081026]/80 border border-cyan-500/20 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-300 pb-2 border-b border-cyan-500/15">
                        <span>Curated Stock Essentials</span>
                        <span className="font-mono text-[10px] text-slate-400">Rayachoty Allocation</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {seg.recommended.map((item, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-2 text-xs text-slate-200">
                            <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello RAIS Agencies, I run a ${seg.title} and want to discuss wholesale pricing and daily kitchen supply.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 text-xs font-black shadow-md hover:scale-[1.02] transition-all"
                      >
                        <MessageSquare className="size-3.5 fill-current" />
                        <span>Request Segment Pack Quote</span>
                      </a>

                      <button
                        onClick={onOpenQuote}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-cyan-400/30 text-xs font-semibold text-cyan-200 hover:text-white hover:border-cyan-400 transition-colors"
                      >
                        <span>Build Custom Sheet</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Cold-Chain Operations Guarantee Strip */}
        <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-r from-[#0f1c3f] to-[#081026] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-center">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="size-14 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Snowflake className="size-7" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white">-18°C Deep Freeze</h4>
                <p className="text-xs text-slate-400">Continuous sub-zero depot vault staging.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="size-14 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Truck className="size-7" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white">Same-Day Replenishment</h4>
                <p className="text-xs text-slate-400">Scheduled delivery across Rayachoty kitchens.</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <a
                href={`tel:${BUSINESS_INFO.phones[0]}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] transition-all"
              >
                <Phone className="size-4" />
                <span>Call Dispatch: {BUSINESS_INFO.phones[0]}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
