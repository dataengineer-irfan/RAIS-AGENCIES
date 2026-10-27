import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/catalogue';
import { MapPin, Phone, MessageSquare, Clock, Send, CheckCircle2, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `*COMMERCIAL CONTACT INQUIRY — RAIS AGENCIES*\n` +
      `👤 *Name:* ${name || 'N/A'}\n` +
      `🏢 *Business:* ${business || 'N/A'}\n` +
      `📞 *Phone:* ${phone || 'N/A'}\n` +
      `💬 *Message:* ${message || 'Inquiring about product catalogue and wholesale delivery schedule.'}`;
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-20 bg-[#081026] text-white min-h-screen relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[400px] bg-blue-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <MessageSquare className="size-4 text-cyan-400" />
            <span>Direct Commercial Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Contact &{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
              Distribution Hub
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            Reach out for immediate wholesale orders, product availability confirmation, or to establish a recurring restaurant delivery schedule across Rayachoty and Rayalaseema.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">

          {/* Left Column: Direct channels and location */}
          <div className="lg:col-span-5 space-y-5">

            {/* Phone Card */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 shadow-xl backdrop-blur-xl flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                <Phone className="size-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Direct Phone Lines
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily Order Desk & Commercial Logistics:
                </p>
                <div className="mt-2 space-y-1">
                  <a
                    href={`tel:${BUSINESS_INFO.phones[0]}`}
                    className="text-base font-bold font-mono text-white hover:text-cyan-300 transition-colors block"
                  >
                    +91 {BUSINESS_INFO.phones[0]}
                  </a>
                  <a
                    href={`tel:${BUSINESS_INFO.phones[1]}`}
                    className="text-base font-bold font-mono text-white hover:text-cyan-300 transition-colors block"
                  >
                    +91 {BUSINESS_INFO.phones[1]}
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 shadow-xl backdrop-blur-xl flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageSquare className="size-5 fill-current" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#25D366] uppercase tracking-wider">
                  WhatsApp Ordering Desk
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant stock checks & route booking:
                </p>
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-cyan-300 hover:text-white transition-colors"
                >
                  <span>Chat on WhatsApp (+91 {BUSINESS_INFO.phones[0]})</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Instagram DM Card */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/85 border border-pink-500/25 shadow-xl backdrop-blur-xl flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0">
                <Send className="size-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  Instagram Direct Message (DM)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Message @raisfrozenfoods for instant catalogue & wholesale rates:
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <a
                    href="https://ig.me/m/raisfrozenfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-300 hover:text-white transition-colors"
                  >
                    <span>Send Instagram DM</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                  <span className="text-slate-600">•</span>
                  <a
                    href="https://instagram.com/raisfrozenfoods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-300 hover:text-pink-300 transition-colors"
                  >
                    @raisfrozenfoods
                  </a>
                </div>
              </div>
            </div>

            {/* Digital Catalogue Card */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/85 border border-amber-500/25 shadow-xl backdrop-blur-xl flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                <ExternalLink className="size-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Official 66-SKU Catalogue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View complete product list, pack sizes & specifications online:
                </p>
                <a
                  href="/RAIS-AGENCIES/catalogue.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                >
                  <span>Open Full Digital Catalogue (HTML)</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Warehouse Location Card */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 shadow-xl backdrop-blur-xl flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                <MapPin className="size-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Warehouse Location
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {BUSINESS_INFO.address}
                </p>
                <div className="mt-3 p-2.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-[11px] font-mono text-slate-400">
                  <span>UPI Payment ID: </span>
                  <strong className="text-white">{BUSINESS_INFO.upiId}</strong>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-5 rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/25 flex items-center gap-3 text-xs text-slate-300">
              <Clock className="size-4 text-cyan-300 shrink-0" />
              <span>Monday – Sunday: <strong className="text-white">6:00 AM – 9:00 PM</strong> (Commercial Deliveries)</span>
            </div>

          </div>

          {/* Right Column: Contact & Dispatch Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-[#0f1c3f]/90 border border-cyan-500/25 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold font-serif text-white mb-1">
              Send a Commercial Message
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Our Rayachoty desk manager will respond with current wholesale rates, carton specifications, and delivery schedules.
            </p>

            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="size-14 rounded-2xl bg-cyan-400/20 text-cyan-300 mx-auto flex items-center justify-center border border-cyan-400/40">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white">Inquiry Transmitted</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. Your message has been logged for commercial follow-up. For instant dispatch, confirm directly via WhatsApp.
                </p>
                <button
                  onClick={handleWhatsAppDirect}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] transition-all"
                >
                  Confirm on WhatsApp Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chef Rajesh"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                      Business / Kitchen Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      placeholder="e.g. Royal Burger Hub, Rayachoty"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                    Phone Number (Calling / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9347453135"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                    Items of Interest & Estimated Volumes
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Inquiring about weekly 20kg French fries (9mm), 10 cases of Momos, and 500 burger clamshell boxes..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl bg-[#081026] border border-cyan-400/40 hover:border-cyan-300 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-cyan-400/10"
                  >
                    <Send className="size-3.5 text-cyan-300" />
                    <span>Submit Inquiry</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="flex-1 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                  >
                    <MessageSquare className="size-3.5 fill-current" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center pt-2">
                  🔒 Strictly B2B commercial terms. No retail pricing or spam.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Live Rayachoty Google Maps Embed */}
        <div className="rounded-3xl border border-cyan-500/25 bg-[#0f1c3f]/90 overflow-hidden shadow-2xl relative">
          <div className="p-6 border-b border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Rayachoty Central Distribution Hub Map
              </h3>
              <p className="text-xs text-slate-400 pt-0.5">
                Near Reddies Colony, Rayachoty - 516269, Annamayya District, Andhra Pradesh
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Reddies+Colony,+Rayachoty,+Andhra+Pradesh+516269"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold hover:bg-cyan-400 hover:text-slate-950 transition-all shrink-0"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          <div className="w-full h-[400px] relative bg-[#081026]">
            <iframe
              title="RAIS Agencies Rayachoty Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15474.34963503144!2d78.7428807!3d14.0538965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb3b4733d744d01%3A0x6e26b1509a76d1e!2sRayachoty%2C%20Andhra%20Pradesh%20516269!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 filter contrast-105"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
