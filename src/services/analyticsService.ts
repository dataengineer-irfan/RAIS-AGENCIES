/**
 * RAIS Agencies — Traffic, Page Views & Instagram Engagement Analytics Engine
 * 
 * Provides:
 * 1. Global Multi-Device Page Hit Tracking (via privacy-friendly hits.sh cloud ping)
 * 2. Real-time Route & Referral Source Detection (Instagram Bio, WhatsApp, Direct Search)
 * 3. Product-Level Interaction Logging (SKU clicks, Quote additions, WhatsApp inquiries)
 * 4. Instagram Reel View & Play Counts Tracker
 * 5. Google Analytics 4 (GA4) Plug-and-Play Integration
 */

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'PAGE_VIEW' | 'PRODUCT_VIEW' | 'WHATSAPP_CLICK' | 'CATALOGUE_OPEN' | 'QUOTE_ADD' | 'BROCHURE_DOWNLOAD';
  path: string;
  source: 'Instagram' | 'WhatsApp' | 'Google / Direct' | 'Catalogue Link' | 'Internal';
  details?: string;
  sku?: string;
  productName?: string;
}

export interface ReelPerformanceRecord {
  reelId: string;
  title: string;
  language: 'Telugu' | 'Hindi';
  dayNumber: number;
  productName: string;
  views: number;
  likes: number;
  comments: number;
  inquiries: number;
  lastUpdated: string;
}

const STORAGE_KEYS = {
  EVENTS: 'rais_analytics_events',
  REEL_STATS: 'rais_analytics_reel_stats',
  GA4_ID: 'rais_ga4_measurement_id',
  VISITOR_ID: 'rais_visitor_anon_id'
};

export class AnalyticsService {
  /**
   * Initializes anonymous visitor ID and records page view.
   */
  static init(): void {
    if (typeof window === 'undefined') return;

    // Check or generate anonymous visitor ID
    if (!localStorage.getItem(STORAGE_KEYS.VISITOR_ID)) {
      const anonId = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, anonId);
    }

    // Initialize GA4 if ID is stored
    this.initGA4();

    // Track current page
    this.trackPageView(window.location.hash || '#/');
  }

  /**
   * Detects the referrer source (Instagram, WhatsApp, Direct).
   */
  static detectSource(): 'Instagram' | 'WhatsApp' | 'Google / Direct' | 'Catalogue Link' | 'Internal' {
    if (typeof window === 'undefined') return 'Google / Direct';

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = (urlParams.get('utm_source') || '').toLowerCase();
    const referrer = (document.referrer || '').toLowerCase();

    if (utmSource.includes('instagram') || referrer.includes('instagram.com') || referrer.includes('ig.me')) {
      return 'Instagram';
    }
    if (utmSource.includes('whatsapp') || referrer.includes('whatsapp.com') || referrer.includes('wa.me')) {
      return 'WhatsApp';
    }
    if (referrer.includes('catalogue.html')) {
      return 'Catalogue Link';
    }
    if (referrer.includes(window.location.hostname)) {
      return 'Internal';
    }
    return 'Google / Direct';
  }

  /**
   * Tracks a page or hash view and silently pings the cloud counter.
   */
  static trackPageView(path: string): void {
    const source = this.detectSource();
    
    // Silently ping cloud counter for multi-device cross-user counting
    this.pingCloudCounter(path);

    this.logEvent({
      type: 'PAGE_VIEW',
      path,
      source,
      details: `Visited ${path} via ${source}`
    });

    // Notify GA4 if configured
    this.sendGA4Event('page_view', { page_path: path, traffic_source: source });
  }

  /**
   * Tracks when a product modal or details are viewed.
   */
  static trackProductView(sku: string, productName: string): void {
    this.logEvent({
      type: 'PRODUCT_VIEW',
      path: window.location.hash || '#/products',
      source: this.detectSource(),
      sku,
      productName,
      details: `Viewed specifications for ${productName} (${sku})`
    });

    this.sendGA4Event('view_item', { item_id: sku, item_name: productName });
  }

  /**
   * Tracks when a user clicks a WhatsApp rate/inquiry button.
   */
  static trackWhatsAppInquiry(sku?: string, productName?: string): void {
    this.logEvent({
      type: 'WHATSAPP_CLICK',
      path: window.location.hash || '#/contact',
      source: this.detectSource(),
      sku,
      productName,
      details: sku ? `Clicked WhatsApp Inquire for ${productName} (${sku})` : 'Clicked General WhatsApp Inquiry'
    });

    this.sendGA4Event('generate_lead', {
      item_id: sku || 'GENERAL_INQUIRY',
      item_name: productName || 'Rayachoty Wholesale Inquiry'
    });
  }

  /**
   * Tracks when a product is added to the quote sheet.
   */
  static trackAddToQuote(sku: string, productName: string): void {
    this.logEvent({
      type: 'QUOTE_ADD',
      path: window.location.hash || '#/products',
      source: this.detectSource(),
      sku,
      productName,
      details: `Added ${productName} (${sku}) to Wholesale Requisition`
    });

    this.sendGA4Event('add_to_cart', { item_id: sku, item_name: productName });
  }

  /**
   * Tracks opening of the full 66-SKU HTML catalogue.
   */
  static trackCatalogueOpen(): void {
    this.logEvent({
      type: 'CATALOGUE_OPEN',
      path: '/catalogue.html',
      source: this.detectSource(),
      details: 'Opened Full 66-SKU Wholesale Product Catalogue'
    });

    this.sendGA4Event('view_catalogue', { catalogue_type: '66_SKU_HTML' });
  }

  /**
   * Pings cloud hit counter so real multi-device counts are preserved.
   */
  private static pingCloudCounter(path: string): void {
    try {
      if (typeof window === 'undefined') return;
      // Do not ping when in localhost development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

      const subpath = path.replace(/[^a-zA-Z0-9_-]/g, '_');
      const img = new Image();
      img.src = `https://hits.sh/dataengineer-irfan.github.io/RAIS-AGENCIES/${subpath}.svg?style=flat&r=${Date.now()}`;
    } catch {
      // Ignore background image load errors
    }
  }

  /**
   * Fetches the current live multi-device hit count from hits.sh.
   */
  static async fetchCloudHitCount(): Promise<{ totalHits: number; catalogueHits: number }> {
    let totalHits = 0;
    let catalogueHits = 0;

    try {
      const resp = await fetch('https://hits.sh/dataengineer-irfan.github.io/RAIS-AGENCIES.svg?nocache=' + Date.now());
      if (resp.ok) {
        const svg = await resp.text();
        const matches = svg.match(/>([0-9,]+)</g);
        if (matches && matches.length > 0) {
          const numStr = matches[matches.length - 1].replace(/[>,<]/g, '').replace(/,/g, '');
          totalHits = parseInt(numStr, 10) || 0;
        }
      }
    } catch {
      // Fallback to local count if offline
    }

    try {
      const resp = await fetch('https://hits.sh/dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue_html.svg?nocache=' + Date.now());
      if (resp.ok) {
        const svg = await resp.text();
        const matches = svg.match(/>([0-9,]+)</g);
        if (matches && matches.length > 0) {
          const numStr = matches[matches.length - 1].replace(/[>,<]/g, '').replace(/,/g, '');
          catalogueHits = parseInt(numStr, 10) || 0;
        }
      }
    } catch {
      // Fallback
    }

    return { totalHits, catalogueHits };
  }

  /**
   * Appends an event to localStorage.
   */
  private static logEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    try {
      const existing = this.getEvents();
      const newEvent: AnalyticsEvent = {
        ...event,
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString()
      };
      existing.unshift(newEvent);
      // Keep last 300 events
      const trimmed = existing.slice(0, 300);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Could not record analytics event', e);
    }
  }

  /**
   * Retrieves all recorded analytics events.
   */
  static getEvents(): AnalyticsEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clears event logs.
   */
  static clearEvents(): void {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
  }

  // --- INSTAGRAM REEL VIEWS & ENGAGEMENT TRACKER ---

  /**
   * Retrieves reel performance stats (views, likes, comments, inquiries).
   */
  static getReelStats(): Record<string, ReelPerformanceRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REEL_STATS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Updates or logs view count and metrics for a specific Reel.
   */
  static updateReelMetric(
    reelId: string,
    updates: Partial<Omit<ReelPerformanceRecord, 'reelId' | 'lastUpdated'>>
  ): void {
    const existing = this.getReelStats();
    const current = existing[reelId] || {
      reelId,
      title: updates.title || reelId,
      language: updates.language || 'Telugu',
      dayNumber: updates.dayNumber || 1,
      productName: updates.productName || 'Wholesale Product',
      views: 0,
      likes: 0,
      comments: 0,
      inquiries: 0,
      lastUpdated: new Date().toISOString()
    };

    existing[reelId] = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.REEL_STATS, JSON.stringify(existing));
  }

  // --- GOOGLE ANALYTICS 4 (GA4) INTEGRATION ---

  static getGA4MeasurementId(): string {
    return localStorage.getItem(STORAGE_KEYS.GA4_ID) || 'G-LX7011WRHR';
  }

  static setGA4MeasurementId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.GA4_ID, id.trim());
    this.initGA4();
  }

  private static initGA4(): void {
    const ga4Id = this.getGA4MeasurementId();
    if (!ga4Id || typeof window === 'undefined') return;

    if (document.getElementById('rais-ga4-script')) return;

    const script = document.createElement('script');
    script.id = 'rais-ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(script);

    // Setup gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', ga4Id);
  }

  private static sendGA4Event(eventName: string, params: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  }
}
