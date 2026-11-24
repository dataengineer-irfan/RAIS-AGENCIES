import React, { useState, useEffect } from 'react';
import { Header, NavPage } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { WhoWeServePage } from './pages/WhoWeServePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AutomationDashboardPage } from './pages/AutomationDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AuthService } from './services/authService';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { RequisitionBar } from './components/RequisitionBar';
import { ProductItem, CATEGORIES } from './data/catalogue';
import { AnalyticsService } from './services/analyticsService';

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'chicken': 'CHICKEN',
  'frozen-nonveg-snacks': 'CHICKEN',
  'non-veg': 'CHICKEN',
  'veg': 'VEG',
  'frozen-veg-snacks': 'VEG',
  'french-fries': 'VEG',
  'french-fries-specialty-potatoes': 'VEG',
  'dairy': 'DAIRY',
  'commercial-dairy-cheese': 'DAIRY',
  'cheese': 'DAIRY',
  'mozzarella': 'DAIRY',
  'bakery': 'BAKERY',
  'bakery-pizza-bases': 'BAKERY',
  'pizza-bases': 'BAKERY',
  'sauces': 'SAUCES',
  'sauces-mayo-condiments': 'SAUCES',
  'mayo': 'SAUCES',
  'syrups': 'SYRUPS',
  'beverage-crushes-syrups': 'SYRUPS',
  'crushes': 'SYRUPS',
  'spices': 'SPICES',
  'seasonings': 'SPICES',
  'packaging': 'PACKAGING',
  'packaging-disposables': 'PACKAGING',
  'boxes': 'PACKAGING'
};

const PAGE_SEO: Record<string, { title: string; description: string }> = {
  home: {
    title: 'RAIS Agencies | Wholesale Frozen Foods & Packaging Solutions — Rayachoty',
    description: 'B2B wholesale supplier of frozen food products, packaging solutions, dairy, gourmet sauces, and beverage syrups in Rayachoty, Andhra Pradesh.'
  },
  products: {
    title: 'Wholesale Products Catalog (90+ SKUs) | RAIS Agencies Rayachoty',
    description: 'Explore commercial wholesale pricing on Milky Mist mozzarella, Amul french fries, Triken momos, pizza boxes, and Del Monte sauces in Rayachoty.'
  },
  'who-we-serve': {
    title: 'Who We Serve | Food Service Supply for Cafes & QSRs — RAIS Agencies',
    description: 'Dedicated cold-chain food distribution for restaurants, cafes, pizza kitchens, and caterers across Rayachoty and Annamayya district.'
  },
  about: {
    title: 'About RAIS Agencies | Cold Chain Infrastructure & Depot Hub — Rayachoty',
    description: 'Rayachoty’s premier commercial food distributor beside Indel Money Bank, Sundupalli Road. Guaranteed -18°C cold chain storage and daily delivery.'
  },
  contact: {
    title: 'Contact RAIS Agencies | Sundupalli Road Depot & WhatsApp Ordering — Rayachoty',
    description: 'Connect with RAIS Agencies wholesale depot in Rayachoty. WhatsApp 9347453135 for catalog, quotations, and commercial kitchen supplies.'
  },
  legal: {
    title: 'Terms of Wholesale Supply & Cold Chain Quality Guarantee | RAIS Agencies',
    description: 'Wholesale terms, HACCP-standard cold-chain storage parameters (-18°C), and return policies for RAIS Agencies Rayachoty commercial partners.'
  },
  automation: {
    title: 'RAIS Growth Engine | B2B Wholesale CRM & Social Studio — Rayachoty',
    description: 'Google Business Profile growth engine, AI review response gate, Meta Instagram studio, and B2B leads CRM for RAIS Agencies.'
  }
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>('ALL');
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [quoteItems, setQuoteItems] = useState<{ [sku: string]: number }>({});
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google_auth') === 'success') {
      AuthService.setDirectSession('admin (Google Verified)');
      return true;
    }
    return AuthService.checkAuth();
  });

  useEffect(() => {
    AnalyticsService.init();
  }, []);

  // Hash-based URL routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (!hash || hash === 'home') {
        setCurrentPage('home');
        setSelectedCategoryCode(null);
      } else if (hash === 'products') {
        setCurrentPage('products');
        setSelectedCategoryCode(null);
      } else if (hash.startsWith('category/')) {
        const catSlug = hash.replace('category/', '').toLowerCase();
        const mappedCode = CATEGORY_SLUG_MAP[catSlug] || catSlug.toUpperCase();
        setSelectedCategoryCode(mappedCode);
      } else if (hash === 'who-we-serve') {
        setCurrentPage('who-we-serve');
        setSelectedCategoryCode(null);
      } else if (hash === 'about') {
        setCurrentPage('about');
        setSelectedCategoryCode(null);
      } else if (hash === 'contact') {
        setCurrentPage('contact');
        setSelectedCategoryCode(null);
      } else if (hash === 'legal' || hash === 'terms') {
        setCurrentPage('legal');
        setSelectedCategoryCode(null);
      } else if (hash === 'automation' || hash === 'dashboard' || hash === 'reels' || hash.startsWith('admin')) {
        setCurrentPage('automation');
        setSelectedCategoryCode(null);
      }
      AnalyticsService.trackPageView(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dynamic Page-by-Page SEO Synchronization (Title, Meta Description, OpenGraph)
  useEffect(() => {
    let title = PAGE_SEO[currentPage]?.title || PAGE_SEO.home.title;
    let description = PAGE_SEO[currentPage]?.description || PAGE_SEO.home.description;

    if (selectedCategoryCode) {
      const cat = CATEGORIES.find(c => c.code.toUpperCase() === selectedCategoryCode.toUpperCase());
      if (cat) {
        title = `${cat.name} Wholesale Supply | RAIS Agencies Rayachoty`;
        description = `Wholesale bulk supplier of ${cat.name} in Rayachoty, Andhra Pradesh. Guaranteed cold chain delivery (-18°C) for cafes, QSRs, and food businesses.`;
      }
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }, [currentPage, selectedCategoryCode]);

  const handleNavigate = (page: NavPage, categoryCode?: string) => {
    if (categoryCode) {
      setSelectedCategoryCode(categoryCode);
      window.location.hash = `/category/${categoryCode.toLowerCase()}`;
    } else {
      setSelectedCategoryCode(null);
      setCurrentPage(page);
      window.location.hash = page === 'home' ? '/' : `/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToQuote = (product: ProductItem) => {
    AnalyticsService.trackAddToQuote(product.sku, product.name);
    setQuoteItems((prev) => ({
      ...prev,
      [product.sku]: (prev[product.sku] || 0) + 1
    }));
  };

  const handleUpdateQty = (sku: string, delta: number) => {
    setQuoteItems((prev) => {
      const current = prev[sku] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[sku];
        return copy;
      }
      return { ...prev, [sku]: next };
    });
  };

  const handleRemoveItem = (sku: string) => {
    setQuoteItems((prev) => {
      const copy = { ...prev };
      delete copy[sku];
      return copy;
    });
  };

  const handleClearQuote = () => {
    setQuoteItems({});
  };

  const totalQuoteCount = Object.values(quoteItems).reduce((sum, qty) => sum + qty, 0);
  const distinctProductCount = Object.keys(quoteItems).filter((sku) => quoteItems[sku] > 0).length;

  // Dedicated Full-Screen Standalone Web Application for Wholesale Admin Portal
  if (currentPage === 'automation') {
    if (isAdminAuthenticated) {
      return (
        <AutomationDashboardPage 
          onBackToHome={() => handleNavigate('home')}
          onLogout={() => {
            AuthService.logout();
            setIsAdminAuthenticated(false);
            handleNavigate('home');
          }}
        />
      );
    }
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center font-sans">
        <AdminLoginPage
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToHome={() => handleNavigate('home')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081026] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-slate-950 pb-20 sm:pb-0">
      
      {/* 1. Header with Brand Identity & Multi-page Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenQuote={() => setIsQuoteOpen(true)}
        quoteCount={totalQuoteCount}
      />

      {/* 2. Main Viewport Router */}
      <main className="flex-1">
        {selectedCategoryCode ? (
          <CategoryDetailPage
            categoryCode={selectedCategoryCode}
            onBack={() => {
              setSelectedCategoryCode(null);
              window.location.hash = '/';
            }}
            onSelectCategory={(code) => handleNavigate('home', code)}
            onAddToQuote={handleAddToQuote}
            onUpdateQty={handleUpdateQty}
            quoteItems={quoteItems}
            onOpenFullQuote={() => setIsQuoteOpen(true)}
          />
        ) : currentPage === 'products' ? (
          <ProductsPage
            onAddToQuote={handleAddToQuote}
            onUpdateQty={handleUpdateQty}
            quoteItems={quoteItems}
            onOpenFullQuote={() => setIsQuoteOpen(true)}
          />
        ) : currentPage === 'who-we-serve' ? (
          <WhoWeServePage
            onOpenQuote={() => setIsQuoteOpen(true)}
          />
        ) : currentPage === 'about' ? (
          <AboutPage />
        ) : currentPage === 'contact' ? (
          <ContactPage />
        ) : currentPage === 'legal' ? (
          <LegalPage />
        ) : (
          <HomePage
            onOpenQuote={() => setIsQuoteOpen(true)}
            selectedCategory={homeCategoryFilter}
            onSelectCategory={setHomeCategoryFilter}
            onAddToQuote={handleAddToQuote}
            onUpdateQty={handleUpdateQty}
            quoteItems={quoteItems}
          />
        )}
      </main>

      {/* 3. Official Rayachoty Hub Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. Reference-Style Persistent Requisition Floating Dock */}
      <RequisitionBar
        quoteCount={totalQuoteCount}
        distinctProductCount={distinctProductCount}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onClearQuote={handleClearQuote}
        quoteItems={quoteItems}
      />

      {/* 5. Mobile Floating Quick-Action Bar */}
      <MobileQuickBar
        onOpenQuote={() => setIsQuoteOpen(true)}
        quoteCount={totalQuoteCount}
      />

      {/* 6. Interactive B2B Quotation Builder Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        quoteItems={quoteItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearQuote={handleClearQuote}
      />

    </div>
  );
};

export default App;
