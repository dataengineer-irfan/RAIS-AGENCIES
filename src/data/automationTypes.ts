export type ReelTheme = 
  | 'frozen_products'       // Chicken momos, French fries, nuggets, patties
  | 'packaging_supplies'    // Kraft burger clamshells, pizza boxes
  | 'product_education'     // IQF freezing vs regular, frying temperatures
  | 'storage_guidance'      // -18°C deep freeze rules, no thaw-refreeze
  | 'wholesale_enquiries'   // Trade pricing, COD/UPI, carton margins
  | 'business_intro';       // Rayachoty depot walk-in, Reddies Colony

export type ReelStatus = 'draft' | 'approved' | 'scheduled' | 'published' | 'failed';

export type LeadStatus = 'New' | 'Qualified' | 'Quote Pending' | 'Quoted' | 'Ordered' | 'Closed';

export interface ReelCalendarItem {
  id: string;
  dayNumber: number; // 1 to 30
  scheduledDate: string; // YYYY-MM-DD
  theme: ReelTheme;
  title: string;
  targetAudience: string; // e.g. "Fast Food & Burger Point Owners in Rayachoty"
  
  // Real Catalogue Product Binding
  productSku: string;
  productName: string;
  brand: string;
  packSize: string;
  productImage: string;
  
  // Scripts & Captions
  hookTelugu: string; // High-energy opening hook
  scriptTelugu: string; // Full Telugu script with English product names
  scriptEnglishBrief: string; // Translation & intention
  caption: string; // Caption with CTA
  hashtags: string[];
  ctaKeyword: string; // e.g. 'CATALOGUE', 'PRICE', 'FRIES'
  
  // Visual & Audio Specs (9:16 Vertical)
    videoSpecs: {
    aspectRatio: '9:16';
    resolution: '1080x1920';
    durationSeconds: number; // 15 to 45s
    presenterName: string; // "Ayesha"
    presenterAttire: string; // "Modest Turquoise/Mint Hijab & Pastel Attire"
    audioMood: string; // "Professional commercial, upbeat Rayalaseema rhythm"
    mediaUrl?: string; // Compiled MP4 video URL
  };
  
  // Publishing Tracking
  status: ReelStatus;
  approvedBy?: string;
  approvedAt?: string;
  scheduledTime?: string; // HH:mm
  publishedAt?: string;
  instagramPostId?: string;
  instagramMediaUrl?: string;
  lastErrorMessage?: string;
  retryCount: number;
}

export interface CustomerLead {
  id: string;
  createdAt: string;
  source: 'instagram_comment' | 'instagram_dm' | 'whatsapp_direct' | 'website_quote' | 'whatsapp';
  instagramUsername?: string;
  customerName: string;
  businessName?: string;
  businessType?: 'Fast Food Center' | 'Hotel / Restaurant' | 'Bakery' | 'Cafe' | 'Catering' | 'Shop';
  productInterest: string;
  brandRequested?: string;
  requiredQuantity: string;
  deliveryLocation: string; // Town or PIN code (e.g. "Rayachoty (516269)")
  phone?: string;
  status: LeadStatus;
  lastMessageSnippet: string;
  humanHandoffRequired: boolean;
  assignedStaff?: string;
  quoteAmount?: number;
  followUpDate?: string;
  notes?: string;
}

export interface IntegrationStatus {
  service: 'instagram_graph_api' | 'whatsapp_order_desk' | 'cold_storage_depot' | 'manychat' | 'heygen_presenter';
  name: string;
  connectionState: 'NOT_CONNECTED' | 'AWAITING_AUTHORIZATION' | 'SIMULATED_TEST_MODE' | 'LIVE_CONNECTED';
  accountName?: string;
  accountId?: string;
  hasValidToken: boolean;
  tokenExpiresAt?: string;
  lastVerifiedAt?: string;
  rateLimitStatus?: {
    used: number;
    total: number;
    resetsAt: string;
  };
  details: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'CONTENT' | 'PUBLISHING' | 'ENQUIRY' | 'SECURITY';
  action: string;
  actor: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}
