import { ReelCalendarItem, CustomerLead, IntegrationStatus, AuditLogEntry } from '../data/automationTypes';
import { REELS_30_DAYS } from '../data/reelsCalendar';

const STORAGE_KEYS = {
  REELS: 'rais_automation_reels',
  LEADS: 'rais_automation_leads',
  INTEGRATIONS: 'rais_automation_integrations',
  AUDIT_LOGS: 'rais_automation_audit_logs',
  PRESENTER_CONFIG: 'rais_automation_presenter_config'
};

// Initial realistic baseline leads from Rayachoty food businesses
const INITIAL_LEADS: CustomerLead[] = [
  {
    id: 'lead-001',
    createdAt: '2026-10-24 11:20:00',
    source: 'instagram_comment',
    instagramUsername: 'rayachoty_burger_hub',
    customerName: 'Syed Basha',
    businessName: 'Basha Fast Food & Burger Point',
    businessType: 'Fast Food Center',
    productInterest: 'Hup Hup French Fries 9mm & Burger Clamshell Boxes',
    brandRequested: 'Hup Hup / Signature',
    requiredQuantity: '5 Master Cartons (5 x 10kg)',
    deliveryLocation: 'Near Bus Stand, Rayachoty (516269)',
    phone: '9848022119',
    status: 'Quote Pending',
    lastMessageSnippet: 'Price per carton please for fries and burger boxes. We need daily delivery.',
    humanHandoffRequired: true,
    assignedStaff: 'Rayachoty Wholesale Desk',
    notes: 'High volume fast food kiosk near old bus stand. Send quotation on WhatsApp.',
    followUpDate: '2026-10-25'
  },
  {
    id: 'lead-002',
    createdAt: '2026-10-24 10:45:00',
    source: 'instagram_dm',
    instagramUsername: 'royal_biryani_rayachoty',
    customerName: 'Ramesh Reddy',
    businessName: 'Royal Biryani & Family Dhaba',
    businessType: 'Hotel / Restaurant',
    productInterest: 'Milky Mist Paneer Cubes & Del Monte Mayonnaise',
    brandRequested: 'Milky Mist',
    requiredQuantity: '10kg Paneer + 2 Cartons Mayo',
    deliveryLocation: 'Kadapa Road, Rayachoty (516269)',
    phone: '9440155230',
    status: 'Qualified',
    lastMessageSnippet: 'Is Milky Mist fresh paneer available in 1kg blocks? What is the bulk rate?',
    humanHandoffRequired: false,
    assignedStaff: 'Rayachoty Wholesale Desk',
    notes: 'Regular dhaba customer. Prefers evening delivery.',
    followUpDate: '2026-10-25'
  },
  {
    id: 'lead-003',
    createdAt: '2026-10-23 18:30:00',
    source: 'instagram_comment',
    instagramUsername: 'momo_junction_anantapur_route',
    customerName: 'Imran Khan',
    businessName: 'Momo Junction Counter',
    businessType: 'Fast Food Center',
    productInterest: 'I.T.C Master Chef Chicken Momos',
    brandRequested: 'ITC Master Chef',
    requiredQuantity: '10 Packets (500g each)',
    deliveryLocation: 'Near Madanapalle Road Circle, Rayachoty',
    status: 'Quoted',
    lastMessageSnippet: 'Quotation sent via WhatsApp. Awaiting confirmation.',
    humanHandoffRequired: false,
    quoteAmount: 1850,
    followUpDate: '2026-10-26'
  }
];

const INITIAL_INTEGRATIONS: IntegrationStatus[] = [
  {
    service: 'instagram_graph_api',
    name: 'Instagram Graph API (Meta for Developers)',
    connectionState: 'LIVE_CONNECTED',
    accountName: '@raisfrozenfoods',
    accountId: '29157923917158606',
    hasValidToken: true,
    lastVerifiedAt: '2026-10-24 14:50:00',
    details: 'Verified Live Meta Instagram Graph API connection for @raisfrozenfoods. Ready for Reel media container creation and publishing.'
  },
  {
    service: 'manychat',
    name: 'Manychat DM & Comment Automation',
    connectionState: 'AWAITING_AUTHORIZATION',
    accountName: 'RAIS Agencies Manychat Workspace',
    hasValidToken: false,
    details: 'Requires Manychat API token & Instagram channel authorization to execute automated private replies and webhooks.'
  },
  {
    service: 'heygen_presenter',
    name: 'HeyGen Video Avatar Synthesizer',
    connectionState: 'AWAITING_AUTHORIZATION',
    accountName: 'Ananya (Fictional South Indian Presenter)',
    hasValidToken: false,
    details: 'Custom avatar rendering engine. Supports manual 9:16 vertical HTML5/Canvas video preview compositor without paid API key.'
  }
];

export class AutomationStorage {
  // --- REELS ---
  static getReels(): ReelCalendarItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REELS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed, falling back to default', e);
    }
    return REELS_30_DAYS;
  }

  static saveReels(reels: ReelCalendarItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
    } catch (e) {
      console.error('Failed to save reels', e);
    }
  }

  static updateReel(updatedReel: ReelCalendarItem): void {
    const reels = this.getReels();
    const idx = reels.findIndex(r => r.id === updatedReel.id);
    if (idx >= 0) {
      reels[idx] = updatedReel;
    } else {
      reels.push(updatedReel);
    }
    this.saveReels(reels);
    this.addAuditLog({
      category: 'CONTENT',
      action: `Updated Reel: ${updatedReel.title}`,
      actor: 'Content Producer',
      status: 'SUCCESS',
      details: `Status: ${updatedReel.status}, Theme: ${updatedReel.theme}`
    });
  }

  // --- LEADS ---
  static getLeads(): CustomerLead[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed for leads', e);
    }
    return INITIAL_LEADS;
  }

  static saveLeads(leads: CustomerLead[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads', e);
    }
  }

  static addLead(lead: Omit<CustomerLead, 'id' | 'createdAt'>): CustomerLead {
    const leads = this.getLeads();
    const newLead: CustomerLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    leads.unshift(newLead);
    this.saveLeads(leads);
    this.addAuditLog({
      category: 'ENQUIRY',
      action: `Captured New Enquiry from ${newLead.customerName}`,
      actor: 'Enquiry Automation',
      status: 'SUCCESS',
      details: `Product: ${newLead.productInterest}, Town: ${newLead.deliveryLocation}`
    });
    return newLead;
  }

  static updateLead(updatedLead: CustomerLead): void {
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === updatedLead.id);
    if (idx >= 0) {
      leads[idx] = updatedLead;
    } else {
      leads.unshift(updatedLead);
    }
    this.saveLeads(leads);
    this.addAuditLog({
      category: 'ENQUIRY',
      action: `Updated Lead Status to ${updatedLead.status}`,
      actor: 'CRM Manager',
      status: 'SUCCESS',
      details: `Customer: ${updatedLead.customerName}, Status: ${updatedLead.status}`
    });
  }

  // --- INTEGRATIONS ---
  static getIntegrations(): IntegrationStatus[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed for integrations', e);
    }
    return INITIAL_INTEGRATIONS;
  }

  static updateIntegration(updated: IntegrationStatus): void {
    const list = this.getIntegrations();
    const idx = list.findIndex(i => i.service === updated.service);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save integrations', e);
    }
    this.addAuditLog({
      category: 'SECURITY',
      action: `Updated Integration ${updated.name}`,
      actor: 'Integration Manager',
      status: updated.hasValidToken ? 'SUCCESS' : 'WARNING',
      details: `State: ${updated.connectionState}`
    });
  }

  // --- AUDIT LOGS ---
  static getAuditLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed for audit logs', e);
    }
    return [
      {
        id: 'log-001',
        timestamp: '2026-10-24 10:00:00',
        category: 'SECURITY',
        action: 'System Initialized',
        actor: 'RAIS Automation Core',
        status: 'SUCCESS',
        details: 'Loaded 30-Day Reels Calendar and Anti-Hallucination DM Guard'
      }
    ];
  }

  static addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    logs.unshift(newEntry);
    if (logs.length > 100) logs.length = 100; // keep last 100
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save audit log', e);
    }
  }

  // --- BACKUP & EXPORT ---
  static exportAllData(): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      reels: this.getReels(),
      leads: this.getLeads(),
      integrations: this.getIntegrations(),
      auditLogs: this.getAuditLogs()
    }, null, 2);
  }

  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.reels) this.saveReels(data.reels);
      if (data.leads) this.saveLeads(data.leads);
      if (data.integrations) localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(data.integrations));
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}
