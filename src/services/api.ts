import { GBPStorage } from './gbpStorage';

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

export interface YouTubeDriveSetting {
  id?: number;
  folder_id: string | null;
  folder_name: string;
  auto_publish_daily: boolean;
  auto_publish_instagram?: boolean;
  auto_publish_facebook?: boolean;
  auto_post_immediately?: boolean;
  auto_first_comment?: boolean;
  gemini_connected?: boolean;
  gemini_api_key?: string;
  daily_publish_hour: number;
  is_connected: boolean;
  oauth_connected?: boolean;
  last_synced_at?: string | null;
  backend_offline?: boolean;
}

export interface YouTubeQueueItem {
  id: number;
  drive_file_id?: string | null;
  file_name: string;
  product_sku?: string | null;
  product_name: string;
  video_title: string;
  description: string;
  first_comment?: string | null;
  ig_comment_id?: string | null;
  fb_comment_id?: string | null;
  ai_analyzed?: boolean;
  tags?: string | null;
  status: 'QUEUED' | 'UPLOADING' | 'PUBLISHED' | 'FAILED';
  scheduled_for: string;
  published_at?: string | null;
  youtube_video_id?: string | null;
  youtube_url?: string | null;
  ig_status?: 'PENDING' | 'PUBLISHED' | 'FAILED' | string;
  ig_media_id?: string | null;
  ig_url?: string | null;
  ig_published_at?: string | null;
  ig_error?: string | null;
  fb_status?: 'PENDING' | 'PUBLISHED' | 'FAILED' | string;
  fb_video_id?: string | null;
  fb_url?: string | null;
  fb_published_at?: string | null;
  fb_error?: string | null;
  created_at?: string;
}

export interface MetaStatus {
  status: 'NOT_CONNECTED' | 'CONNECTED' | 'TOKEN_INVALID' | string;
  connected: boolean;
  page_id?: string | null;
  page_name?: string | null;
  ig_user_id?: string | null;
  ig_username?: string | null;
  source: string;
  message: string;
  token_verified_at?: string | null;
}

export interface MultiPublishResult {
  status: 'SUCCESS' | 'PARTIAL' | 'ERROR' | string;
  item_id: number;
  results: Record<string, any>;
  errors: string[];
  item?: YouTubeQueueItem;
}

export interface YouTubeSyncResult {
  status: string;
  new_videos_found: number;
  total_queued: number;
  message: string;
}

export interface YouTubePublishResult {
  status: string;
  video_id?: number | null;
  youtube_video_id?: string | null;
  youtube_url?: string | null;
  video_title?: string | null;
  message: string;
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
  origin?: 'GOOGLE_AUTHENTIC' | 'LOCAL_DIRECT';
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

// Targeted Commercial Keywords for Rayachoty and Corridors
export const COMMERCIAL_TARGET_KEYWORDS: KeywordTarget[] = [
  { id: 1, keyword: "frozen food wholesale rayachoty", intent: "Commercial B2B", relevance_score: 98, is_target: true, language: "en" },
  { id: 2, keyword: "sudarshan fresh cream wholesale rayachoty", intent: "Commercial B2B", relevance_score: 96, is_target: true, language: "en" },
  { id: 3, keyword: "habit baby corn button mushroom wholesale rayachoty", intent: "Commercial B2B", relevance_score: 95, is_target: true, language: "en" },
  { id: 4, keyword: "french fries wholesale rayachoty", intent: "Commercial B2B", relevance_score: 95, is_target: true, language: "en" },
  { id: 5, keyword: "milky mist cheese wholesale rayachoty", intent: "Commercial B2B", relevance_score: 94, is_target: true, language: "en" },
  { id: 6, keyword: "meal time dark soya sauce red chilli sauce rayachoty", intent: "Commercial B2B", relevance_score: 94, is_target: true, language: "en" },
  { id: 7, keyword: "sliced jalapenos wholesale rayachoty", intent: "Commercial B2B", relevance_score: 93, is_target: true, language: "en" },
  { id: 8, keyword: "delmonte foodcraft chocolate syrup rayachoty", intent: "Commercial B2B", relevance_score: 92, is_target: true, language: "en" },
  { id: 9, keyword: "mozzarella cheese supplier rayachoty", intent: "Commercial B2B", relevance_score: 92, is_target: true, language: "en" },
  { id: 10, keyword: "green chilli sauce culinary sauce wholesale rayachoty", intent: "Commercial B2B", relevance_score: 91, is_target: true, language: "en" },
  { id: 11, keyword: "butter paper wholesale rayachoty", intent: "Commercial B2B", relevance_score: 90, is_target: true, language: "en" },
  { id: 12, keyword: "spic culinary sauce distributor rayachoty", intent: "Commercial B2B", relevance_score: 90, is_target: true, language: "en" },
  { id: 13, keyword: "rayachoti frozen foods agency", intent: "Local Direct", relevance_score: 89, is_target: true, language: "te-en" },
  { id: 14, keyword: "pizza base wholesale rayachoty", intent: "Commercial B2B", relevance_score: 88, is_target: true, language: "en" },
  { id: 15, keyword: "commercial white vinegar wholesale rayachoty", intent: "Commercial B2B", relevance_score: 88, is_target: true, language: "en" },
  { id: 16, keyword: "restaurant supplies rayachoty", intent: "Commercial B2B", relevance_score: 85, is_target: true, language: "en" },
  { id: 17, keyword: "chicken nuggets bulk rayachoty", intent: "Commercial B2B", relevance_score: 84, is_target: true, language: "en" },
  { id: 18, keyword: "butter paper kilo rate rayachoty", intent: "Commercial B2B", relevance_score: 82, is_target: true, language: "te-en" }
];

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
    let remoteReviews: Review[] = [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${BASE_URL}/reviews`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) remoteReviews = data;
      }
    } catch {}
    
    // Always load local authentic GBP storage containing all 5 verified Google Maps reviews
    const localReviews = GBPStorage.getReviews();
    const formattedLocal: Review[] = localReviews.map((r, i) => {
      const uniqueId = (r.id || 0) + 100;
      return {
        id: uniqueId,
        google_review_id: `gmb_${uniqueId}`,
        author_name: r.reviewerName,
        rating: r.rating,
        comment: r.comment,
        create_time: r.date || 'Recent',
        sentiment: (r.sentiment as any) || 'POSITIVE',
        is_complaint: false,
        has_replied: r.hasReplied,
        origin: 'GOOGLE_AUTHENTIC' as const,
        reply_drafts: [
          {
            id: uniqueId,
            reply_english: r.replyEnglish || '',
            reply_telugu: r.replyTelugu || '',
            is_approved: r.isApproved,
            status: r.isApproved ? 'PUBLISHED_TO_GOOGLE' : 'PENDING_APPROVAL',
            approved_by: r.approvedBy || 'RAIS Admin'
          }
        ]
      };
    });

    if (remoteReviews.length === 0) return formattedLocal;

    // Guarantee Hidayathullah H is ALWAYS present and placed at the top (index 0)
    const hIdx = remoteReviews.findIndex(r => r.author_name.toLowerCase().includes('hidayathullah'));
    if (hIdx > 0) {
      const [hRev] = remoteReviews.splice(hIdx, 1);
      return [hRev, ...remoteReviews];
    } else if (hIdx === -1) {
      const hidayathullah = formattedLocal.find(r => r.author_name.toLowerCase().includes('hidayathullah'));
      if (hidayathullah) {
        return [hidayathullah, ...remoteReviews];
      }
    }
    return remoteReviews;
  },
  syncReviews: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/reviews/sync`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP ${res.status}: Failed to sync reviews with Google`);
    }
    return await res.json();
  },
  createTestReview: async (authorName?: string, rating?: number, comment?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (authorName) params.append('author_name', authorName);
    if (rating) params.append('rating', rating.toString());
    if (comment) params.append('comment', comment);
    const res = await fetch(`${BASE_URL}/reviews/test-review?${params.toString()}`, { method: 'POST' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Backend failed to create review draft`);
    }
    return await res.json();
  },
  approveReviewReply: async (draftId: number, replyText: string, approverName: string = 'Admin'): Promise<any> => {
    GBPStorage.approveReviewReply(draftId, replyText, approverName);
    try {
      const res = await fetch(`${BASE_URL}/reviews/reply/${draftId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_text: replyText, approver_name: approverName })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch {
      return {
        status: 'APPROVED_NOT_PUBLISHED',
        is_published_to_google: false,
        message: 'Saved local draft approval only. Backend unreachable — NOT published to Google Business Profile.'
      };
    }
  },
  getGoogleStatus: async (): Promise<any> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${BASE_URL}/google/status`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return {
      status: 'API_ERROR',
      connected: false,
      mode: 'BACKEND_UNREACHABLE',
      is_verified: false,
      is_live: false,
      is_simulated: false,
      account_id: null,
      location_id: null,
      account_email: null,
      location_name: null,
      message: 'Backend service is unreachable. Cannot verify Google Business Profile connection.'
    };
  },
  getGoogleAuthorizeUrl: async (includeYoutube: boolean = false): Promise<{ authorization_url: string; state: string }> => {
    const query = includeYoutube ? '?include_youtube=true' : '';
    const res = await fetch(`${BASE_URL}/google/authorize${query}`);
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
      const data = await res.json();
      // Reject unverified static mock numbers from legacy backend versions (<1.0.4)
      if (
        !data.api_verified &&
        data.metrics &&
        data.metrics.search_impressions_mobile === 140 &&
        data.metrics.maps_impressions_mobile === 210 &&
        data.metrics.website_clicks === 42
      ) {
        return {
          status: 'NOT_CONNECTED',
          is_live: false,
          is_simulated: false,
          metrics: null,
          search_keywords_top: [],
          source: 'None (Google Business Profile Performance API Not Verified)',
          date_range: 'Past 30 Days',
          notice: 'Live Google Performance API metrics require an active OAuth session with businessprofileperformance.googleapis.com enabled.',
          actionable_instruction: 'Enable Google Business Profile Performance API in Google Cloud Console and re-authorize Google OAuth.'
        };
      }
      return data;
    } catch (err: any) {
      return { status: 'API_ERROR', is_live: false, metrics: null, error_message: err.message || 'Backend service unreachable' };
    }
  },
  listKeywords: async (): Promise<KeywordTarget[]> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${BASE_URL}/seo/keywords`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length >= 18) {
          return data;
        } else if (Array.isArray(data) && data.length > 0) {
          const existing = new Set(data.map((k: any) => (k.keyword || '').toLowerCase()));
          const missing = COMMERCIAL_TARGET_KEYWORDS.filter(k => !existing.has(k.keyword.toLowerCase()));
          return [...data, ...missing].sort((a, b) => b.relevance_score - a.relevance_score);
        }
      }
    } catch {}
    return COMMERCIAL_TARGET_KEYWORDS;
  },
  listCompetitors: async (): Promise<Competitor[]> => {
    try {
      const res = await fetch(`${BASE_URL}/seo/competitors`);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },
  createCompetitor: async (payload: {
    competitor_name: string;
    location_area: string;
    public_category?: string;
    rating?: number | null;
    review_count?: number;
    notes?: string;
  }): Promise<Competitor> => {
    const res = await fetch(`${BASE_URL}/seo/competitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP ${res.status}: Failed to save competitor`);
    }
    return res.json();
  },
  deleteCompetitor: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/seo/competitors/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to delete competitor`);
    }
  },
  getSeoAudit: async (): Promise<any> => {
    try {
      const res = await fetch(`${BASE_URL}/seo/audit`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      status: 'BACKEND_OFFLINE',
      completeness_score: null,
      audit_items: []
    };
  },
  listLeads: async (): Promise<B2BLead[]> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${BASE_URL}/leads`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    return [];
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
  },
  generateReviewRequest: async (payload: {
    customer_name: string;
    cafe_name: string;
    mandal_town: string;
    phone_number?: string;
    products?: string[];
  }): Promise<any> => {
    const res = await fetch(`${BASE_URL}/reviews/generate-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getReviewTemplates: async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/reviews/request-templates`);
    return res.json();
  },
  getGoogleQnA: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/seo/qna`);
    return res.json();
  },
  seedGoogleQnA: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/seo/qna/seed`, { method: 'POST' });
    return res.json();
  },
  publishPostNow: async (postId: number): Promise<any> => {
    const res = await fetch(`${BASE_URL}/campaigns/posts/${postId}/publish-now`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Failed to publish post to Google Business Profile`);
    }
    return data;
  },
  getYouTubeSettings: async (): Promise<YouTubeDriveSetting> => {
    try {
      const res = await fetch(`${BASE_URL}/youtube/settings`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("YouTube settings fetch error", e);
    }
    return {
      folder_id: "1Bm_WjSGQb_KQSRz6i08DSsp2mtzOborn",
      folder_name: "RAIS_Daily_Promotion_Videos",
      auto_publish_daily: false,
      daily_publish_hour: 10,
      is_connected: false,
      oauth_connected: false,
      backend_offline: true
    };
  },
  updateYouTubeSettings: async (payload: Partial<YouTubeDriveSetting>): Promise<YouTubeDriveSetting> => {
    const res = await fetch(`${BASE_URL}/youtube/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Failed to save YouTube Drive settings`);
    }
    return data;
  },
  listYouTubeQueue: async (): Promise<YouTubeQueueItem[]> => {
    try {
      const res = await fetch(`${BASE_URL}/youtube/queue`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("YouTube queue fetch error", e);
    }
    return [];
  },
  syncGoogleDrive: async (): Promise<YouTubeSyncResult> => {
    const res = await fetch(`${BASE_URL}/youtube/sync-drive`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Drive sync endpoint unavailable on backend`);
    }
    return data;
  },
  publishNextYouTubeVideo: async (): Promise<YouTubePublishResult> => {
    const res = await fetch(`${BASE_URL}/youtube/publish-next`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Failed to publish video to YouTube`);
    }
    return data;
  },
  publishYouTubeItem: async (itemId: number): Promise<YouTubePublishResult> => {
    const res = await fetch(`${BASE_URL}/youtube/publish-item/${itemId}`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Failed to publish queued video`);
    }
    return data;
  },
  clearYouTubeQueue: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/youtube/queue/clear`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Failed to clear queue`);
    }
    return data;
  },
  getYouTubeSetupGuide: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/youtube/setup-guide`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to load setup guide`);
    }
    return res.json();
  },
  getMetaStatus: async (): Promise<MetaStatus> => {
    try {
      const res = await fetch(`${BASE_URL}/meta/status`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Meta status fetch error", e);
    }
    return {
      status: 'NOT_CONNECTED',
      connected: false,
      page_id: null,
      page_name: null,
      ig_user_id: null,
      ig_username: null,
      source: 'none',
      message: 'Backend unavailable or Meta Page Access Token not connected yet.',
      token_verified_at: null
    };
  },
  connectMeta: async (payload: { access_token: string; page_id?: string; ig_user_id?: string }): Promise<MetaStatus> => {
    const res = await fetch(`${BASE_URL}/meta/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Meta connection verification failed`);
    }
    return data;
  },
  disconnectMeta: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/meta/disconnect`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Failed to disconnect Meta account`);
    }
    return data;
  },
  getMetaSetupGuide: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/meta/setup-guide`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to load Meta setup guide`);
    }
    return res.json();
  },
  publishMetaDriveItem: async (
    itemId: number,
    platforms: string[] = ['instagram', 'facebook']
  ): Promise<MultiPublishResult> => {
    const res = await fetch(`${BASE_URL}/meta/publish-item/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platforms })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Meta publishing failed`);
    }
    return data;
  },
  publishMultiPlatformItem: async (
    itemId: number,
    platforms?: string[]
  ): Promise<MultiPublishResult> => {
    const res = await fetch(`${BASE_URL}/youtube/publish-multi/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: platforms ? JSON.stringify({ platforms }) : JSON.stringify({ platforms: ['youtube', 'instagram', 'facebook'] })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Multi-platform publishing failed`);
    }
    return data;
  },
  getDriveDownloadUrl: (driveFileId: string): string => {
    return `${BASE_URL}/youtube/download-drive/${encodeURIComponent(driveFileId)}`;
  },
  runYouTubeAutoPilot: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/youtube/auto-run`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Auto-Pilot run failed`);
    }
    return data;
  },
  analyzeYouTubeQueueItem: async (itemId: number): Promise<YouTubeQueueItem> => {
    const res = await fetch(`${BASE_URL}/youtube/queue/${itemId}/analyze`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Video analysis failed`);
    }
    return data;
  }
};

export const growthEngineApi = api;
export default api;
