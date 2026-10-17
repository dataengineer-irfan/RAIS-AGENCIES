import React from 'react';
import { RaisLogo } from './RaisLogo';
import { MapPin, Phone, MessageSquare, ShieldCheck, Snowflake } from 'lucide-react';
import { BUSINESS_INFO, CATEGORIES } from '../data/catalogue';
import { NavPage } from './Header';
import { assetUrl } from '../utils/assetUrl';

interface FooterProps {
  onNavigate: (page: NavPage, categoryCode?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper Footer: Core Hub Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button onClick={() => onNavigate('home')} className="text-left focus:outline-none">
              <RaisLogo size="lg" />
            </button>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-3">
              Authoritative commercial distributor of wholesale frozen food products, institutional dairy, gourmet condiments, and food packaging for restaurants and food businesses in Rayachoty & surrounding territories.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span>Certified Sub-Zero Cold Chain Storage</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Quality Assured Commercial Stocks</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Wholesale Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.code}>
                  <button
                    onClick={() => onNavigate('home', cat.code)}
                    className="hover:text-amber-400 transition-colors flex items-center justify-between w-full text-left"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {cat.itemCount} SKUs
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Rayachoty Office & Desk (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Distribution Hub
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">
                  Near Reddies Colony,<br />
                  Rayachoty - 516269,<br />
                  Annamayya District, Andhra Pradesh
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="text-slate-300">
                  <a href={`tel:${BUSINESS_INFO.phones[0]}`} className="hover:text-white">
                    {BUSINESS_INFO.phones[0]}
                  </a>
                  <span className="mx-1">/</span>
                  <a href={`tel:${BUSINESS_INFO.phones[1]}`} className="hover:text-white">
                    {BUSINESS_INFO.phones[1]}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  WhatsApp: +91 {BUSINESS_INFO.phones[0]}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <div className="flex items-center justify-between font-mono">
                  <span>Settlement UPI:</span>
                  <strong className="text-amber-300">{BUSINESS_INFO.upiId}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Scan to Order / Map (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Direct Orders
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold text-white">Instant WhatsApp Route Booking</p>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%20RAIS%20Agencies,%20please%20send%20current%20wholesale%20rates.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors"
              >
                Open WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Disclaimer */}
      <div className="border-t border-cyan-500/15 bg-[#030611] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <img src={assetUrl('/images/ref-assets/rais_logo_icon.png')} alt="RAIS logo" className="size-6 rounded" />
            <span>© {new Date().getFullYear()} RAIS Agencies. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('legal')}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Terms of Wholesale Supply
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('about')}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              About Hub
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('contact')}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Contact
            </button>
            <span>•</span>
            <span className="text-cyan-300 font-semibold">Frozen Food Products · Rayachoty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
