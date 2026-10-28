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
import { ProductItem } from './data/catalogue';
import { AnalyticsService } from './services/analyticsService';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>('ALL');
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [quoteItems, setQuoteItems] = useState<{ [sku: string]: number }>({});
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => AuthService.checkAuth());

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
        const cat = hash.replace('category/', '').toUpperCase();
        setSelectedCategoryCode(cat);
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
      } else if (hash === 'automation' || hash === 'dashboard' || hash === 'reels' || hash === 'admin') {
        setCurrentPage('automation');
        setSelectedCategoryCode(null);
      }
      AnalyticsService.trackPageView(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
        ) : currentPage === 'automation' ? (
          isAdminAuthenticated ? (
            <AutomationDashboardPage 
              onBackToHome={() => handleNavigate('home')}
              onLogout={() => {
                AuthService.logout();
                setIsAdminAuthenticated(false);
                handleNavigate('home');
              }}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => setIsAdminAuthenticated(true)}
              onBackToHome={() => handleNavigate('home')}
            />
          )
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
