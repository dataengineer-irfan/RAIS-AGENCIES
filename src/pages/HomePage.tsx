import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { OrderingWorkflow } from '../components/OrderingWorkflow';
import { BrandMarquee } from '../components/BrandMarquee';
import { Interactive3DShowcase } from '../components/Interactive3DShowcase';
import { WhoWeServe } from '../components/WhoWeServe';
import { ContactSection } from '../components/ContactSection';
import { ProductItem } from '../data/catalogue';

interface HomePageProps {
  onOpenQuote: () => void;
  selectedCategory: string;
  onSelectCategory: (code: string) => void;
  onAddToQuote: (product: ProductItem) => void;
  onUpdateQty?: (sku: string, delta: number) => void;
  quoteItems: { [sku: string]: number };
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenQuote,
  selectedCategory,
  onSelectCategory,
  onAddToQuote,
  onUpdateQty,
  quoteItems
}) => {
  return (
    <>
      {/* 1. Hero Experience — 3D Food Stage, Live Sector Ticker, Cyan Accents */}
      <Hero onOpenQuote={onOpenQuote} />

      {/* 2. Shop By Category — 8 High-Impact Ice Plinth Cards */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(code) => {
          onSelectCategory(code);
          const el = document.getElementById('products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Full 64-SKU Commercial Catalogue & Instant Requisition Panels */}
      <FeaturedProducts
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onAddToQuote={onAddToQuote}
        onUpdateQty={onUpdateQty}
        quoteItems={quoteItems}
        onOpenFullQuote={onOpenQuote}
      />

      {/* 4. Four-Step Cold Chain Order Workflow */}
      <OrderingWorkflow />

      {/* 5. Authorised Brand Partner Row & 4 Core Value Propositions */}
      <BrandMarquee />

      {/* 6. Interactive 3D Cold-Chain & Food Inspector (Momo, Nugget, Fries, Master Carton) */}
      <Interactive3DShowcase onOpenQuote={onOpenQuote} />

      {/* 7. Who We Serve — Commercial Foodservice Sectors */}
      <WhoWeServe onOpenQuote={onOpenQuote} />

      {/* 8. Visit or Call — Contact & Embedded Google Map */}
      <ContactSection />
    </>
  );
};
