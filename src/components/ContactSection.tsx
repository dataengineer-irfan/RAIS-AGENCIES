import React from 'react';
import { Phone, MapPin, MessageSquare, Navigation, ExternalLink, Instagram } from 'lucide-react';
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
                Direct wholesale inquiries, best trade prices, and daily stock supply for Rayachoty hotels, fast food centers, cafes &amp; dhabas.
              </p>

              {/* Contact Entries */}
              <div className="mt-6 space-y-3.5">
                <a
                  href={`tel:${BUSINESS_INFO.primaryPhone}`}
                  className="flex items-center gap-4 text-slate-200 hover:text-cyan-300 transition-colors group"
                >
                  <div className="size-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Direct Wholesale Hotline & WhatsApp</div>
                    <div className="text-sm sm:text-base font-bold font-mono text-white">{BUSINESS_INFO.primaryPhone}</div>
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
                    <div className="text-slate-400 text-[10px]">Rayachoty Town Supply</div>
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
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('Hello RAIS Agencies, I want to inquire about wholesale frozen food and packaging supplies for my shop in Rayachoty.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp us</span>
              </a>

              <a
                href="https://instagram.com/raisfrozenfoods"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-bold text-sm transition-all hover:scale-[1.02]"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </a>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=RAIS+Agencies+Sundupalli+Road+Rayachoty&destination_place_id=ChIJWWL3zBgDszsR-lQG81niw0c"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-200 font-bold text-sm transition-all hover:scale-[1.02]"
              >
                <Navigation className="w-4 h-4 text-cyan-300" />
                <span>Directions (Google Maps)</span>
              </a>
            </div>
          </div>

          {/* Right Embedded Interactive Map */}
          <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[460px] bg-[#081026] border-t lg:border-t-0 lg:border-l border-cyan-500/20">
            <iframe
              title="RAIS Agencies Hub Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.873294371908!2d78.75682707578768!3d14.05935898636652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb30318ccf76259%3A0x47c3e259f30654fa!2sRAIS%20Agencies!5e0!3m2!1sen!2sin!4v1731600000000!5m2!1sen!2sin"
              className="absolute inset-0 w-full h-full border-0 filter brightness-90 contrast-110"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Open in Maps Overlay Button */}
            <div className="absolute top-4 left-4 z-10">
              <a
                href="https://www.google.com/maps/place/RAIS+Agencies/@14.059359,78.759402,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb30318ccf76259:0x47c3e259f30654fa!8m2!3d14.059359!4d78.759402!16s%2Fg%2F11npc8m4rr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#081026]/90 border border-cyan-400/40 text-xs font-bold text-white shadow-lg backdrop-blur-md hover:bg-cyan-400 hover:text-slate-950 transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
