import { CustomerLead } from '../data/automationTypes';
import { PRODUCTS } from '../data/catalogue';
import { AutomationStorage } from './automationStorage';

export interface IncomingMessage {
  source: 'instagram_comment' | 'instagram_dm';
  username: string;
  messageText: string;
  postId?: string;
}

export interface BotResponse {
  replyText: string;
  isPrivateReply: boolean;
  leadCaptured?: CustomerLead;
  humanHandoff: boolean;
  actionTaken: string;
}

export class EnquiryBot {
  /**
   * Standard verified company greeting response strictly adhering to RAIS operating guidelines.
   * NEVER invents prices, inventory counts, or unverified discounts.
   */
  static readonly STANDARD_VERIFIED_RESPONSE = 
    'Thank you for contacting RAIS Agencies! Please share the product name, brand, required quantity and delivery location. Our team will confirm the latest price, availability and delivery details.';

  /**
   * Processes an incoming Instagram comment or DM.
   */
  static processMessage(incoming: IncomingMessage): BotResponse {
    const raw = incoming.messageText.trim();
    const upper = raw.toUpperCase();

    // 1. Comment Automation: Keyword Triggered Responses
    if (incoming.source === 'instagram_comment') {
      const isCatalogueRequest = upper.includes('CATALOGUE') || upper.includes('CATALOG') || upper.includes('MENU') || upper.includes('LIST');
      const isPriceRequest = upper.includes('PRICE') || upper.includes('RATE') || upper.includes('COST');
      const isProductKeyword = upper.includes('FRIES') || upper.includes('MOMOS') || upper.includes('BOXES') || upper.includes('CHEESE') || upper.includes('NUGGETS');

      if (isCatalogueRequest || isPriceRequest || isProductKeyword) {
        // Create an official private reply via Instagram Graph API
        const capturedLead = AutomationStorage.addLead({
          source: 'instagram_comment',
          instagramUsername: incoming.username,
          customerName: incoming.username,
          productInterest: this.detectProductKeywords(raw) || 'Wholesale Catalogue Request',
          requiredQuantity: 'Pending customer confirmation',
          deliveryLocation: 'Rayachoty (516269)',
          status: 'New',
          lastMessageSnippet: raw,
          humanHandoffRequired: isPriceRequest,
          notes: `Comment received on Instagram Reel. Automated DM private reply triggered.`
        });

        const replyComment = `ధన్యవాదాలు @${incoming.username}! We have sent our Rayachoty wholesale details to your Direct Messages (DM). Please check your inbox! 📲`;
        
        return {
          replyText: replyComment,
          isPrivateReply: true,
          leadCaptured: capturedLead,
          humanHandoff: isPriceRequest,
          actionTaken: 'Sent public acknowledgement comment & dispatched private wholesale welcome message.'
        };
      }
    }

    // 2. Direct Message (DM) Handling
    // Check if customer asks about specific catalogue products
    const detectedProduct = this.findMatchingCatalogueProduct(raw);

    // ANTI-HALLUCINATION PRICE GUARD:
    // If the user asks for a price ("how much", "rate", "cost", "price", "discount"),
    // NEVER invent a number. Route to wholesale desk with Quote Pending status.
    const isAskingPrice = upper.includes('PRICE') || upper.includes('RATE') || upper.includes('HOW MUCH') || upper.includes('COST') || upper.includes('DISCOUNT') || upper.includes('KENTHA');

    if (isAskingPrice) {
      const capturedLead = AutomationStorage.addLead({
        source: 'instagram_dm',
        instagramUsername: incoming.username,
        customerName: incoming.username,
        productInterest: detectedProduct ? `${detectedProduct.brand} ${detectedProduct.name}` : 'General Wholesale Rate Enquiry',
        brandRequested: detectedProduct?.brand,
        requiredQuantity: this.extractQuantity(raw) || 'Quantity not specified yet',
        deliveryLocation: this.extractLocation(raw) || 'Rayachoty (516269)',
        status: 'Quote Pending',
        lastMessageSnippet: raw,
        humanHandoffRequired: true,
        notes: 'Price quotation enquiry. Routed to human wholesale desk for today\'s official rate.'
      });

      const reply = detectedProduct 
        ? `Hello! For ${detectedProduct.brand} ${detectedProduct.name} (${detectedProduct.pack}), today's wholesale carton rate depends on your required order quantity and daily delivery schedule in Rayachoty.\n\n${this.STANDARD_VERIFIED_RESPONSE}`
        : this.STANDARD_VERIFIED_RESPONSE;

      return {
        replyText: reply,
        isPrivateReply: false,
        leadCaptured: capturedLead,
        humanHandoff: true,
        actionTaken: 'Lead placed in Quote Pending status. Price calculation routed to human wholesale desk.'
      };
    }

    // 3. Location / Delivery Question
    if (upper.includes('LOCATION') || upper.includes('ADDRESS') || upper.includes('SHOP') || upper.includes('DEPOT') || upper.includes('WHERE')) {
      return {
        replyText: 'RAIS Agencies wholesale depot is located Near Reddies Colony, Rayachoty - 516269, Annamayya District, A.P.\n\nWe provide same-day town delivery across Rayachoty and direct counter pickup for local hotels, fast food centers, cafes, and bakeries. Contact our desk at +91 9347453135.',
        isPrivateReply: false,
        humanHandoff: false,
        actionTaken: 'Answered depot location & pickup FAQ.'
      };
    }

    // 4. Default Qualified Capture
    const capturedLead = AutomationStorage.addLead({
      source: incoming.source,
      instagramUsername: incoming.username,
      customerName: incoming.username,
      productInterest: detectedProduct ? `${detectedProduct.brand} ${detectedProduct.name}` : raw.substring(0, 40),
      brandRequested: detectedProduct?.brand,
      requiredQuantity: this.extractQuantity(raw) || 'Pending details',
      deliveryLocation: this.extractLocation(raw) || 'Rayachoty (516269)',
      status: 'Qualified',
      lastMessageSnippet: raw,
      humanHandoffRequired: false,
      notes: 'General enquiry received. Customer invited to specify quantity and location.'
    });

    return {
      replyText: this.STANDARD_VERIFIED_RESPONSE,
      isPrivateReply: false,
      leadCaptured: capturedLead,
      humanHandoff: false,
      actionTaken: 'Provided standard verified welcome response and created qualified lead.'
    };
  }

  // Helper: Match against real 64-product catalogue
  private static findMatchingCatalogueProduct(text: string) {
    const q = text.toLowerCase();
    return PRODUCTS.find(p => 
      q.includes(p.name.toLowerCase()) || 
      q.includes(p.brand.toLowerCase()) ||
      (q.includes('momos') && p.sku.includes('MOM')) ||
      (q.includes('fries') && p.sku.includes('FF')) ||
      (q.includes('nuggets') && p.sku.includes('NUG')) ||
      (q.includes('mayo') && p.sku.includes('MAY')) ||
      (q.includes('cheese') && p.sku.includes('MOZ')) ||
      (q.includes('burger box') && p.sku.includes('BB')) ||
      (q.includes('pizza box') && p.sku.includes('PB'))
    );
  }

  // Helper: Extract quantity (e.g., "5 cartons", "10 packets", "25 kg")
  private static extractQuantity(text: string): string | null {
    const match = text.match(/\b(\d+)\s*(cartons?|cases?|boxes?|pkts?|packets?|kg|kilos?|pcs|pieces?)\b/i);
    return match ? match[0] : null;
  }

  // Helper: Extract location if user mentions Rayachoty, Kadapa, Rajampet, etc.
  private static extractLocation(text: string): string | null {
    const towns = ['Rayachoty', 'Kadapa Road', 'Reddies Colony', 'Bus Stand', 'Madanapalle Road', 'Rajampet', 'Galiveedu', 'Sundupalli', '516269'];
    for (const t of towns) {
      if (text.toLowerCase().includes(t.toLowerCase())) {
        return t.includes('516269') ? 'Rayachoty (516269)' : `${t}, Rayachoty`;
      }
    }
    return null;
  }

  // Helper: Extract keywords from comment
  private static detectProductKeywords(text: string): string | null {
    const upper = text.toUpperCase();
    if (upper.includes('FRIES')) return 'French Fries (Hup Hup / McCain)';
    if (upper.includes('MOMOS')) return 'Steamed Momos (ITC Master Chef)';
    if (upper.includes('BURGER') || upper.includes('BOXES')) return 'Kraft Burger Boxes & Packaging';
    if (upper.includes('PIZZA')) return 'Corrugated Pizza Boxes & Cheese';
    if (upper.includes('NUGGETS')) return 'Chicken Nuggets & Popcorn';
    if (upper.includes('CHEESE')) return 'Milky Mist Mozzarella Cheese';
    return null;
  }
}
