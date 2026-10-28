import React, { useState } from 'react';
import { RaisLogo } from './RaisLogo';
import { Phone, MessageSquare, FileText, Menu, X, MapPin, ChevronRight, Lock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/catalogue';

export type NavPage = 'home' | 'products' | 'who-we-serve' | 'about' | 'contact' | 'legal' | 'automation';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenQuote: () => void;
  quoteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenQuote,
  quoteCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: NavPage; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Products & Catalogue', page: 'products' },
    { label: 'Who We Serve', page: 'who-we-serve' },
    { label: 'About RAIS', page: 'about' },
    { label: 'Contact & Hub', page: 'contact' },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#081026]/90 border-b border-cyan-500/20 transition-all duration-300">
      {/* Top verified facts bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs bg-[#040918]/90 text-slate-300 border-b border-cyan-500/15">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Near Reddies Colony, Rayachoty - 516269, A.P.</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Desk: <strong>{BUSINESS_INFO.phones[0]}</strong> / <strong>{BUSINESS_INFO.phones[1]}</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-cyan-300 font-semibold">B2B Wholesale Commercial Food Service</span>
          <span className="text-slate-600">•</span>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%20RAIS%20Agencies,%20I%20would%20like%20to%20inquire%20about%20wholesale%20products.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Ordering</span>
          </a>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => handleNavClick('automation')}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-bold transition-all bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-0.5 rounded-full border border-amber-500/40 cursor-pointer"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1 text-left"
        >
          <RaisLogo size="md" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.page)}
              className={`text-sm font-semibold transition-colors py-1 flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded ${
                currentPage === link.page
                  ? 'text-cyan-300 border-b-2 border-cyan-400 font-bold'
                  : 'text-slate-300 hover:text-cyan-300'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${BUSINESS_INFO.phones[0]}`}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 hover:text-cyan-300 px-3 py-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>{BUSINESS_INFO.phones[0]}</span>
          </a>

          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hello%20RAIS%20Agencies,%20I%20would%20like%20to%20place%20an%20order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-md shadow-cyan-400/25"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Order on WhatsApp</span>
          </a>

          <button
            onClick={onOpenQuote}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-300" />
            <span>Quote Sheet</span>
            {quoteCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black">
                {quoteCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('automation')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
              currentPage === 'automation'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-400/25'
                : 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 hover:border-amber-400'
            }`}
            title="Authorized Wholesale Admin & Analytics Portal"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenQuote}
            className="relative p-2 rounded-lg bg-amber-400 text-slate-950"
            aria-label="View quote"
          >
            <FileText className="w-5 h-5" />
            {quoteCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                {quoteCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="space-y-1 mb-5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.page)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${
                  currentPage === link.page
                    ? 'bg-slate-900 text-amber-400 font-bold'
                    : 'text-slate-200 hover:bg-slate-900 hover:text-amber-400'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Review Quotation Request ({quoteCount} items)</span>
            </button>

            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%20RAIS%20Agencies,%20I%20would%20like%20to%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order via WhatsApp ({BUSINESS_INFO.primaryPhone})</span>
            </a>

            <button
              onClick={() => handleNavClick('automation')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-sm shadow-md"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Admin & Analytics Portal Login</span>
            </button>

            <div className="text-center text-xs text-slate-400 pt-2">
              <MapPin className="w-3.5 h-3.5 inline text-amber-400 mr-1" />
              Near Reddies Colony, Rayachoty - 516269
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
