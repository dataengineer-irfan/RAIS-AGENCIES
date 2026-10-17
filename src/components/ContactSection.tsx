import React from 'react';
import { Phone, MapPin, MessageSquare, Navigation, ExternalLink } from 'lucide-react';
import { BUSINESS_INFO } from '../data/catalogue';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-12 sm:py-14 scroll-mt-28 bg-[#081026] text-white border-b border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Outer Split Card Container */}
        <div className="overflow-hidden rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/90 shadow-[0_20px_60px_-25px_rgba(0,210,255,0.3)] backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12">

          {/* Left Details Panel */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-2">
                Visit or Call
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white">
                Get in{' '}
                <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  touch
                </span>
              </h2>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Direct wholesale inquiries, trade terms, and daily kitchen replenishment for Rayachoty and Rayalaseema.
              </p>

              {/* Contact Entries */}
              <div className="mt-6 space-y-3.5">
                <a
                  href={`tel:${BUSINESS_INFO.phones[0]}`}
                  className="flex items-center gap-4 text-slate-200 hover:text-cyan-300 transition-colors group"
                >
                  <div className="size-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Direct Desk</div>
                    <div className="text-sm sm:text-base font-bold font-mono text-white">{BUSINESS_INFO.phones[0]}</div>
                  </div>
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.phones[1]}`}
                  className="flex items-center gap-4 text-slate-200 hover:text-cyan-300 transition-colors group"
                >
                  <div className="size-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Secondary Logistics</div>
                    <div className="text-sm sm:text-base font-bold font-mono text-white">{BUSINESS_INFO.phones[1]}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-slate-200">
                  <div className="size-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-bold shrink-0">
                    <MapPin className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Cold Chain Depot</div>
                    <div className="text-xs sm:text-sm font-semibold text-white">{BUSINESS_INFO.address}</div>
                  </div>
                </div>

                {/* Operating Hours & UPI Settlement — Eliminates Left Box Void */}
                <div className="pt-2 grid grid-cols-2 gap-3 text-xs border-t border-cyan-500/15">
                  <div className="p-2.5 rounded-xl bg-[#081026]/70 border border-cyan-500/20">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Daily Operations</div>
                    <div className="text-white font-semibold text-[11px] pt-0.5">6:00 AM – 9:00 PM</div>
                    <div className="text-slate-400 text-[10px]">Commercial Delivery Routes</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#081026]/70 border border-cyan-500/20">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Direct Settlement</div>
                    <div className="text-white font-mono font-bold text-[11px] pt-0.5">{BUSINESS_INFO.upiId}</div>
                    <div className="text-slate-400 text-[10px]">Instant Bank UPI Billing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-cyan-500/15">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('Hello RAIS Agencies, I would like to enquire about wholesale supplies.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp us</span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Reddies+Colony+Rayachoty+516269"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-200 font-bold text-sm transition-all hover:scale-[1.02]"
              >
                <Navigation className="w-4 h-4 text-cyan-300" />
                <span>Get directions</span>
              </a>
            </div>
          </div>

          {/* Right Embedded Interactive Map */}
          <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[460px] bg-[#081026] border-t lg:border-t-0 lg:border-l border-cyan-500/20">
            <iframe
              title="RAIS Agencies Hub Location"
              src="https://www.google.com/maps?q=Reddies+Colony,+Rayachoty,+516269&output=embed"
              className="absolute inset-0 w-full h-full border-0 filter brightness-90 contrast-110"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Open in Maps Overlay Button */}
            <div className="absolute top-4 left-4 z-10">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Reddies+Colony+Rayachoty+516269"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#081026]/90 border border-cyan-400/40 text-xs font-bold text-white shadow-lg backdrop-blur-md hover:bg-cyan-400 hover:text-slate-950 transition-colors"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
