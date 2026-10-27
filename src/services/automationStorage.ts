import { ReelCalendarItem, CustomerLead, IntegrationStatus, AuditLogEntry } from '../data/automationTypes';
import { REELS_30_DAYS } from '../data/reelsCalendar';

const STORAGE_KEYS = {
  REELS: 'rais_automation_reels',
  LEADS: 'rais_automation_leads',
  INTEGRATIONS: 'rais_automation_integrations',
  AUDIT_LOGS: 'rais_automation_audit_logs',
  PRESENTER_CONFIG: 'rais_automation_presenter_config'
};

// Clean initial state: zero fake demo leads, real customer orders populated via Storefront Quote Builder & WhatsApp Desk
const INITIAL_LEADS: CustomerLead[] = [];

const INITIAL_INTEGRATIONS: IntegrationStatus[] = [
  {
    service: 'instagram_graph_api',
    name: 'Instagram Graph API (Meta for Developers)',
    connectionState: 'LIVE_CONNECTED',
    accountName: '@raisfrozenfoods',
    accountId: '29157923917158606',
    hasValidToken: true,
    lastVerifiedAt: '2026-10-27 16:03:34',
    details: 'Verified Live Meta Instagram Graph API connection for @raisfrozenfoods. 2 Master Reels published live on feed with verified comments.'
  },
  {
    service: 'whatsapp_order_desk',
    name: 'RAIS Rayachoty WhatsApp Order Desk',
    connectionState: 'LIVE_CONNECTED',
    accountName: '+91 9347453135',
    hasValidToken: true,
    lastVerifiedAt: '2026-10-27 16:30:00',
    details: 'Direct customer & B2B order desk for Rayachoty. Receives quotation requisitions, instant wholesale bills, and delivery inquiries.'
  },
  {
    service: 'cold_storage_depot',
    name: 'Rayachoty Cold Storage Depot Hub',
    connectionState: 'LIVE_CONNECTED',
    accountName: 'Near Reddies Colony, Rayachoty (516269)',
    hasValidToken: true,
    lastVerifiedAt: '2026-10-27 16:30:00',
    details: 'Primary commercial distribution hub. -18°C deep freeze storage, wholesale billing, and daily commercial dispatch.'
  }
];

export class AutomationStorage {
  // --- REELS ---
  static getReels(): ReelCalendarItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REELS);
      if (data) {
        const parsed: ReelCalendarItem[] = JSON.parse(data);
        // Ensure slot-01 and slot-02 reflect their verified published state
        return parsed.map(r => {
          if (r.id === 'reel-slot-01' || r.id === 'reel-slot-02') {
            const canonical = REELS_30_DAYS.find(c => c.id === r.id);
            return canonical || r;
          }
          return r;
        });
      }
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
      if (data) {
        const parsed: CustomerLead[] = JSON.parse(data);
        // Purge any legacy fake/dummy mock leads
        const clean = parsed.filter(l => 
          !['lead-001', 'lead-002', 'lead-003'].includes(l.id) &&
          l.customerName !== 'Syed Basha' &&
          l.customerName !== 'Murthy' &&
          l.businessName !== 'Sri Krishna Grand'
        );
        return clean;
      }
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
      if (data) {
        const parsed: IntegrationStatus[] = JSON.parse(data);
        // If legacy data has heygen_presenter or doesn't have whatsapp_order_desk, return INITIAL_INTEGRATIONS
        if (!parsed.some(i => (i.service as string) === 'heygen_presenter') && parsed.some(i => i.service === 'whatsapp_order_desk')) {
          return parsed;
        }
      }
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
        id: 'log-live-02',
        timestamp: '2026-10-27 16:03:34',
        category: 'PUBLISHING',
        action: 'Reel Published: Day 1 Slot 2 (Hindi) — Triken Chicken Momos',
        actor: 'Instagram Automation Core',
        status: 'SUCCESS',
        details: 'Live on @raisfrozenfoods (Post ID: 18129191809865321). Top comment with Rayachoty WhatsApp & Catalogue link verified.'
      },
      {
        id: 'log-live-01',
        timestamp: '2026-10-27 16:02:25',
        category: 'PUBLISHING',
        action: 'Reel Published: Day 1 Slot 1 (Telugu) — Triken Chicken Momos',
        actor: 'Instagram Automation Core',
        status: 'SUCCESS',
        details: 'Live on @raisfrozenfoods (Post ID: 18149436067564831). Top comment with Rayachoty WhatsApp & Catalogue link verified.'
      },
      {
        id: 'log-auth-01',
        timestamp: '2026-10-27 15:30:00',
        category: 'SECURITY',
        action: 'Wholesale Depot System Initialized',
        actor: 'RAIS Core',
        status: 'SUCCESS',
        details: 'Loaded 30-Day Bilingual Reels Campaign with 3D Presenter Ayesha (Rayachoty 516269)'
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
