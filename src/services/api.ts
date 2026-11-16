const API_HOST = (import.meta as any).env?.VITE_GROWTH_ENGINE_API_URL || 'https://rais-growth-backend.onrender.com';
const BASE_URL = `${API_HOST.replace(/\/$/, '')}/api/v1`;

export interface BusinessProfile {
  id: number;
  business_name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  primary_phone: string;
  secondary_phone?: string;
  whatsapp_number: string;
  website_url: string;
  catalogue_url: string;
  google_maps_url?: string;
  primary_category: string;
  secondary_categories: string;
  description?: string;
}

export interface CatalogSKU {
  id: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  pack_size: string;
  in_stock: boolean;
  is_commercial_focus: boolean;
  description?: string;
  verification_status: string;
}

export interface ServiceArea {
  id: number;
  area_name: string;
  is_primary: boolean;
  delivery_frequency: string;
  notes?: string;
  verification_status: string;
}

export interface PublishCycleResult {
  status: string;
  published_count: number;
  simulated_count: number;
  failed_count: number;
  skipped_count: number;
  message?: string;
}

export interface CampaignPost {
  id: number;
  campaign_id: number;
  day_number?: number;
  headline: string;
  content_english: string;
  content_telugu?: string;
  call_to_action: string;
  target_product_sku?: string;
  status: 'DRAFT' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'PAUSED';
  scheduled_for?: string;
  published_at?: string;
  verification_status: string;
}

export interface Campaign {
  id: number;
  title: string;
  objective: string;
  theme?: string;
  status: string;
  is_approved_by_user: boolean;
  approved_at?: string;
  posts: CampaignPost[];
}

export interface ReviewReplyDraft {
  id: number;
  reply_english: string;
  reply_telugu?: string;
  is_approved: boolean;
  status: string;
  approved_by?: string;
}

export interface Review {
  id: number;
  google_review_id: string;
  author_name: string;
  rating: number;
  comment?: string;
  create_time: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  is_complaint: boolean;
  has_replied: boolean;
  origin?: 'GOOGLE_AUTHENTIC' | 'LOCAL_DIRECT' | 'SIMULATED_DEMO';
  reply_drafts: ReviewReplyDraft[];
}

export interface KeywordTarget {
  id: number;
  keyword: string;
  intent: string;
  relevance_score: number;
  is_target: boolean;
  language: string;
}

export interface Competitor {
  id: number;
  competitor_name: string;
  location_area: string;
  public_category?: string;
  rating?: number;
  review_count: number;
  verified_status: string;
  notes?: string;
}

export interface B2BLead {
  id: number;
  business_name: string;
  contact_person?: string;
  phone: string;
  business_type: string;
  location: string;
  product_interest?: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'LOST';
  created_at: string;
}

export interface AutomationSettings {
  id: number;
  scheduled_publishing_enabled: boolean;
  emergency_kill_switch: boolean;
  posting_frequency_days: string;
  preferred_post_time: string;
  auto_generate_drafts: boolean;
  require_explicit_campaign_approval: boolean;
  require_explicit_review_approval: boolean;
}

export interface AuditLogItem {
  id: number;
  action: string;
  actor: string;
  resource_type: string;
  resource_id?: string;
  details?: string;
  timestamp: string;
}

// API methods
export const api = {
  getProfile: async (): Promise<BusinessProfile> => {
    const res = await fetch(`${BASE_URL}/business-info/profile`);
    return res.json();
  },
  updateProfile: async (data: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    const res = await fetch(`${BASE_URL}/business-info/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  listSkus: async (): Promise<CatalogSKU[]> => {
    const res = await fetch(`${BASE_URL}/business-info/skus`);
    return res.json();
  },
  updateSku: async (id: number, data: Partial<CatalogSKU>): Promise<CatalogSKU> => {
    const res = await fetch(`${BASE_URL}/business-info/skus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  listServiceAreas: async (): Promise<ServiceArea[]> => {
    const res = await fetch(`${BASE_URL}/business-info/service-areas`);
    return res.json();
  },
  listCampaigns: async (): Promise<Campaign[]> => {
    const res = await fetch(`${BASE_URL}/campaigns`);
    return res.json();
  },
  approveCampaign: async (id: number): Promise<any> => {
    const res = await fetch(`${BASE_URL}/campaigns/${id}/approve`, { method: 'POST' });
    return res.json();
  },
  generatePost: async (theme: string, target_sku?: string, language_mode: string = 'bilingual'): Promise<any> => {
    const res = await fetch(`${BASE_URL}/campaigns/generate-post?theme=${encodeURIComponent(theme)}&target_sku=${target_sku || ''}&language_mode=${language_mode}`, { method: 'POST' });
    return res.json();
  },
  triggerPublishCycle: async (): Promise<PublishCycleResult> => {
    const res = await fetch(`${BASE_URL}/campaigns/trigger-publish-cycle`, { method: 'POST' });
    return res.json();
  },
  listReviews: async (): Promise<Review[]> => {
    const res = await fetch(`${BASE_URL}/reviews`);
    return res.json();
  },
  syncReviews: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/reviews/sync`, { method: 'POST' });
    return res.json();
  },
  approveReviewReply: async (draftId: number, replyText: string, approverName: string = 'Admin'): Promise<any> => {
    const res = await fetch(`${BASE_URL}/reviews/reply/${draftId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply_text: replyText, approver_name: approverName })
    });
    return res.json();
  },
  getGoogleStatus: async (): Promise<any> => {
    try {
      const res = await fetch(`${BASE_URL}/google/status`);
      if (!res.ok) {
        return { status: 'API_ERROR', connected: false, error_message: `HTTP ${res.status}: ${res.statusText}` };
      }
      return await res.json();
    } catch (err: any) {
      return { status: 'API_ERROR', connected: false, error_message: err.message || 'Network request failed' };
    }
  },
  getGoogleAuthorizeUrl: async (): Promise<{ authorization_url: string; state: string }> => {
    const res = await fetch(`${BASE_URL}/google/authorize`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP ${res.status}: Failed to get Google authorization URL`);
    }
    return res.json();
  },
  getGooglePerformance: async (forceState?: string): Promise<any> => {
    try {
      const query = forceState ? `?force_state=${encodeURIComponent(forceState)}` : '';
      const res = await fetch(`${BASE_URL}/google/performance${query}`);
      if (!res.ok) {
        return { status: 'API_ERROR', is_live: false, metrics: null, error_message: `HTTP ${res.status}: ${res.statusText}` };
      }
      return await res.json();
    } catch (err: any) {
      return { status: 'API_ERROR', is_live: false, metrics: null, error_message: err.message || 'Backend service unreachable' };
    }
  },
  listKeywords: async (): Promise<KeywordTarget[]> => {
    const res = await fetch(`${BASE_URL}/seo/keywords`);
    return res.json();
  },
  listCompetitors: async (): Promise<Competitor[]> => {
    const res = await fetch(`${BASE_URL}/seo/competitors`);
    return res.json();
  },
  getSeoAudit: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/seo/audit`);
    return res.json();
  },
  listLeads: async (): Promise<B2BLead[]> => {
    const res = await fetch(`${BASE_URL}/leads`);
    return res.json();
  },
  createLead: async (data: Partial<B2BLead>): Promise<B2BLead> => {
    const res = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateLead: async (id: number, data: Partial<B2BLead>): Promise<B2BLead> => {
    const res = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getAutomationSettings: async (): Promise<AutomationSettings> => {
    const res = await fetch(`${BASE_URL}/automation/settings`);
    return res.json();
  },
  toggleKillSwitch: async (active: boolean): Promise<any> => {
    const res = await fetch(`${BASE_URL}/automation/kill-switch?active=${active}`, { method: 'POST' });
    return res.json();
  },
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    const res = await fetch(`${BASE_URL}/automation/audit-logs`);
    return res.json();
  }
};
