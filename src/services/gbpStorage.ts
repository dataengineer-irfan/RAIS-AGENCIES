import { 
  GBPPostItem, GBPReviewItem, GBPSkuItem, 
  INITIAL_GBP_POSTS, INITIAL_GBP_REVIEWS, INITIAL_GBP_SKUS, 
  VERIFIED_BUSINESS_FACTS 
} from '../data/gbpData';

const STORAGE_KEYS = {
  POSTS: 'rais_gbp_posts',
  REVIEWS: 'rais_gbp_reviews',
  SKUS: 'rais_gbp_skus',
  AUDIT: 'rais_gbp_audit_trail'
};

export class GBPStorage {
  // --- POSTS ---
  static getPosts(): GBPPostItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to read GBP posts from storage', e);
    }
    return INITIAL_GBP_POSTS;
  }

  static savePosts(posts: GBPPostItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('Failed to save GBP posts to storage', e);
    }
  }

  static approveCampaign(): { count: number } {
    const posts = this.getPosts();
    const updated = posts.map(p => ({
      ...p,
      status: 'SCHEDULED' as const,
      scheduledDate: new Date(Date.now() + p.dayNumber * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    this.savePosts(updated);
    return { count: updated.length };
  }

  static publishPost(id: number): { success: boolean; post?: GBPPostItem } {
    const posts = this.getPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx].status = 'PUBLISHED';
      this.savePosts(posts);
      return { success: true, post: posts[idx] };
    }
    return { success: false };
  }

  // --- REVIEWS ---
  static getReviews(): GBPReviewItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (data) {
        const parsed: GBPReviewItem[] = JSON.parse(data);
        // Purge legacy fake mock reviews if present
        const hasLegacyMock = parsed.some(r => r.reviewerName === 'Sri Krishna Cafe & Bakers');
        if (hasLegacyMock) {
          localStorage.removeItem(STORAGE_KEYS.REVIEWS);
          return [];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read GBP reviews from storage', e);
    }
    return INITIAL_GBP_REVIEWS;
  }

  static saveReviews(reviews: GBPReviewItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save GBP reviews to storage', e);
    }
  }

  static approveReviewReply(reviewId: number, replyText: string, approver: string = 'Admin'): { success: boolean } {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === reviewId);
    if (idx !== -1) {
      reviews[idx].hasReplied = true;
      reviews[idx].isApproved = true;
      reviews[idx].replyEnglish = replyText;
      reviews[idx].approvedBy = approver;
      this.saveReviews(reviews);
      return { success: true };
    }
    return { success: false };
  }

  // --- SKUS ---
  static getSkus(): GBPSkuItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SKUS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to read SKUs from storage', e);
    }
    return INITIAL_GBP_SKUS;
  }

  static toggleSkuStock(skuCode: string): GBPSkuItem[] {
    const skus = this.getSkus();
    const updated = skus.map(s => s.sku === skuCode ? { ...s, inStock: !s.inStock } : s);
    try {
      localStorage.setItem(STORAGE_KEYS.SKUS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save SKUs', e);
    }
    return updated;
  }

  // --- DETERMINISTIC SAFETY VALIDATOR ---
  static validatePost(headline: string, english: string, telugu: string, skuCode?: string): {
    passed: boolean;
    flags: string[];
    priceLeakDetected: boolean;
    skuVerified: boolean;
    phoneCompliant: boolean;
  } {
    const flags: string[] = [];
    const combined = `${headline} ${english} ${telugu}`;

    // 1. Price leak check (prohibits exact rupee rates like ₹180 or Rs 220)
    const priceRegex = /(?:₹|rs\.?|inr)\s*\d+/i;
    const priceLeakDetected = priceRegex.test(combined);
    if (priceLeakDetected) {
      flags.push('CRITICAL: Wholesale price detected in public copy. Must be routed to WhatsApp to protect cafe margins.');
    }

    // 2. Prohibited unverified claims
    const prohibitedTerms = ['authorized national sole distributor', '100% money back guarantee', 'cheapest price in india'];
    for (const term of prohibitedTerms) {
      if (combined.toLowerCase().includes(term)) {
        flags.push(`Prohibited unverified marketing claim: "${term}"`);
      }
    }

    // 3. SKU check
    let skuVerified = true;
    if (skuCode) {
      const skus = this.getSkus();
      skuVerified = skus.some(s => s.sku === skuCode);
      if (!skuVerified) {
        flags.push(`Target SKU "${skuCode}" is not found in the verified catalogue.`);
      }
    }

    // 4. Phone check
    const phoneCompliant = combined.includes(VERIFIED_BUSINESS_FACTS.phone) || combined.includes('9347453135');
    if (!phoneCompliant) {
      flags.push(`Missing verified WhatsApp contact: ${VERIFIED_BUSINESS_FACTS.phone}`);
    }

    // 5. Length check
    if (combined.length > 1500) {
      flags.push('Character limit exceeded (Google Business Profile limit is 1500 chars).');
    }

    return {
      passed: flags.length === 0,
      flags,
      priceLeakDetected,
      skuVerified,
      phoneCompliant
    };
  }
}
