import React, { useState, useEffect } from 'react';
import { ReelCalendarItem, CustomerLead, IntegrationStatus, AuditLogEntry, LeadStatus } from '../data/automationTypes';
import { AutomationStorage } from '../services/automationStorage';
import { InstagramPublisher } from '../services/instagramPublisher';
import { EnquiryBot } from '../services/enquiryBot';
import { ReelVideoPreview } from '../components/automation/ReelVideoPreview';
import { 
  Film, Users, AlertTriangle, Clock, RefreshCw, Send,
  ShieldCheck, Key, Phone, MessageSquare, Download,
  ExternalLink, Sparkles, Check, LogOut
} from 'lucide-react';

interface AutomationDashboardPageProps {
  onLogout?: () => void;
}

export const AutomationDashboardPage: React.FC<AutomationDashboardPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'publishing' | 'enquiries' | 'settings'>('calendar');
  const [reels, setReels] = useState<ReelCalendarItem[]>(() => AutomationStorage.getReels());
  const [leads, setLeads] = useState<CustomerLead[]>(() => AutomationStorage.getLeads());
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(() => AutomationStorage.getIntegrations());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => AutomationStorage.getAuditLogs());
  
  // Selected Reel in Calendar
  const [selectedReelId, setSelectedReelId] = useState<string>('reel-day-01');
  const [themeFilter, setThemeFilter] = useState<string>('ALL');
  
  // Lead Filter & Detail
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<CustomerLead | null>(null);
  const [leadSearch, setLeadSearch] = useState<string>('');

  // Interactive Message Simulator
  const [simText, setSimText] = useState<string>('Price for 5 cartons of Hup Hup fries in Rayachoty?');
  const [simSource, setSimSource] = useState<'instagram_comment' | 'instagram_dm'>('instagram_dm');
  const [simUsername, setSimUsername] = useState<string>('rayachoty_fastfood_king');
  const [simResult, setSimResult] = useState<string | null>(null);

  // Manual Publish Modal
  const [manualPublishReel, setManualPublishReel] = useState<ReelCalendarItem | null>(null);

  // Load from persistent storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReels(AutomationStorage.getReels());
    setLeads(AutomationStorage.getLeads());
    setIntegrations(AutomationStorage.getIntegrations());
    setAuditLogs(AutomationStorage.getAuditLogs());
  };

  const selectedReel = reels.find(r => r.id === selectedReelId) || reels[0];

  // Metrics
  const draftsCount = reels.filter(r => r.status === 'draft').length;
  const approvedCount = reels.filter(r => r.status === 'approved').length;
  const publishedCount = reels.filter(r => r.status === 'published').length;
  const quotePendingLeadsCount = leads.filter(l => l.status === 'Quote Pending').length;
  const totalLeadsCount = leads.length;

  // Reel actions
  const handleApproveReel = (reel: ReelCalendarItem) => {
    const updated: ReelCalendarItem = {
      ...reel,
      status: 'approved',
      approvedBy: 'Wholesale Depot Lead',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    AutomationStorage.updateReel(updated);
    loadData();
  };

  const handlePublishReel = async (reel: ReelCalendarItem) => {
    const result = await InstagramPublisher.publishReel(reel);
    if (result.mode === 'MANUAL_REQUIRED') {
      setManualPublishReel(reel);
    } else {
      alert(result.auditMessage);
      loadData();
    }
  };

  const handleConfirmManualPublish = async (reel: ReelCalendarItem) => {
    await InstagramPublisher.publishReel(reel, true);
    setManualPublishReel(null);
    loadData();
  };

  // Lead status updates
  const handleUpdateLeadStatus = (lead: CustomerLead, newStatus: LeadStatus) => {
    const updated: CustomerLead = {
      ...lead,
      status: newStatus,
      humanHandoffRequired: newStatus === 'Quote Pending' ? true : lead.humanHandoffRequired
    };
    AutomationStorage.updateLead(updated);
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead(updated);
    }
    loadData();
  };

  // Simulate incoming customer message / DM
  const handleRunSimulation = () => {
    if (!simText.trim()) return;
    const res = EnquiryBot.processMessage({
      source: simSource,
      username: simUsername,
      messageText: simText
    });
    setSimResult(`[${res.actionTaken}]\n\nBot Reply:\n"${res.replyText}"`);
    loadData();
  };

  // Filtered Reels
  const filteredReels = reels.filter(r => {
    if (themeFilter === 'ALL') return true;
    return r.theme === themeFilter;
  });

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchStatus = leadStatusFilter === 'ALL' || l.status === leadStatusFilter;
    const q = leadSearch.toLowerCase().trim();
    const matchSearch = !q || 
      l.customerName.toLowerCase().includes(q) ||
      (l.businessName && l.businessName.toLowerCase().includes(q)) ||
      l.productInterest.toLowerCase().includes(q) ||
      l.deliveryLocation.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="py-8 sm:py-12 bg-[#081026] text-white min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[400px] bg-amber-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* 1. TOP HEADER & KPI METRICS BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-cyan-500/20">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>RAIS Agencies · Rayachoty (516269)</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-tight">
              Instagram Reels & Customer Enquiry{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                Automation System
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Publishing daily Telugu Reels showcasing real RAIS products with Ananya (AI Presenter) and capturing wholesale enquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f1c3f] border border-cyan-400/30 text-xs font-bold text-cyan-200 hover:text-white transition-all shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh State</span>
            </button>
            <a
              href="https://instagram.com/raisfrozenfoods"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold shadow hover:scale-[1.02] transition-all"
            >
              <span>@raisfrozenfoods</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 hover:border-red-500/60 text-xs font-bold text-red-300 hover:text-white transition-all shadow"
                title="Sign out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/20 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Reel</div>
            <div className="font-serif text-2xl font-black text-amber-300 mt-1">Day {selectedReel?.dayNumber ?? 1}</div>
            <div className="text-[10px] text-cyan-300 truncate mt-0.5">{selectedReel?.productName ?? 'RAIS Catalogue'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/20 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Drafts to Review</div>
            <div className="font-serif text-2xl font-black text-white mt-1">{draftsCount}</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Awaiting Approval</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/20 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved / Scheduled</div>
            <div className="font-serif text-2xl font-black text-cyan-300 mt-1">{approvedCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Published: {publishedCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/20 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quotes Pending</div>
            <div className="font-serif text-2xl font-black text-amber-400 mt-1">{quotePendingLeadsCount}</div>
            <div className="text-[10px] text-amber-300 mt-0.5">Human Action Required</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0f1c3f]/85 border border-cyan-500/20 text-center col-span-2 sm:col-span-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</div>
            <div className="font-serif text-2xl font-black text-emerald-400 mt-1">{totalLeadsCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Rayachoty Leads</div>
          </div>
        </div>

        {/* 2. TAB NAVIGATION */}
        <div className="flex border-b border-cyan-500/20 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-[#0f1c3f] border-t-2 border-amber-400 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4 text-amber-400" />
            <span>30-Day Reels Calendar ({reels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('publishing')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'publishing'
                ? 'bg-[#0f1c3f] border-t-2 border-amber-400 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Publishing & Meta API</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap relative ${
              activeTab === 'enquiries'
                ? 'bg-[#0f1c3f] border-t-2 border-amber-400 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Customer Enquiries & CRM ({leads.length})</span>
            {quotePendingLeadsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-2 right-2" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#0f1c3f] border-t-2 border-amber-400 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-slate-400" />
            <span>Integrations & Audit Log</span>
          </button>
        </div>

        {/* 3. TAB 1: 30-DAY REELS CALENDAR & PRODUCTION STUDIO */}
        {activeTab === 'calendar' && (
          <div className="space-y-8">
            
            {/* Theme Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0f1c3f]/80 border border-cyan-500/20">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Theme:</span>
                {[
                  { id: 'ALL', label: 'All 30 Days' },
                  { id: 'frozen_products', label: 'Frozen Snacks' },
                  { id: 'packaging_supplies', label: 'Packaging' },
                  { id: 'product_education', label: 'Education' },
                  { id: 'storage_guidance', label: '-18°C Storage' },
                  { id: 'wholesale_enquiries', label: 'Wholesale Trade' },
                  { id: 'business_intro', label: 'Depot Intro' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setThemeFilter(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      themeFilter === t.id
                        ? 'bg-amber-400 text-slate-950 font-bold shadow'
                        : 'bg-[#081026] text-slate-300 hover:text-white border border-cyan-500/20'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Showing {filteredReels.length} Reels
              </div>
            </div>

            {/* Main Studio: Reel Preview + Day List Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: 30-Day Calendar Rail */}
              <div className="lg:col-span-5 max-h-[750px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                {filteredReels.map((reel) => {
                  const isSelected = selectedReel ? reel.id === selectedReel.id : false;
                  return (
                    <div
                      key={reel.id}
                      onClick={() => setSelectedReelId(reel.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0f1c3f] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                          : 'bg-[#0f1c3f]/50 border-cyan-500/15 hover:border-cyan-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-mono font-bold text-amber-300">DAY {reel.dayNumber} · {reel.scheduledDate}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          reel.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                          reel.status === 'approved' ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {reel.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-tight">
                        {reel.title}
                      </h4>

                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                        <span className="font-semibold text-cyan-300">{reel.brand}</span>
                        <span className="text-slate-500">·</span>
                        <span className="truncate">{reel.productName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active Reel 9:16 Previewer & Script Details */}
              <div className="lg:col-span-7">
                {selectedReel ? (
                  <ReelVideoPreview
                    reel={selectedReel}
                    onApprove={handleApproveReel}
                    onSchedule={handlePublishReel}
                  />
                ) : (
                  <div className="p-8 rounded-2xl bg-[#0f1c3f]/50 border border-cyan-500/20 text-center text-slate-400">
                    Select a Reel from the calendar to preview.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* 4. TAB 2: PUBLISHING & META GRAPH API */}
        {activeTab === 'publishing' && (
          <div className="space-y-8">
            
            {/* Meta Account Connection State Card */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Instagram Graph API Connection Status</h3>
                    <p className="text-xs text-slate-300">Official Meta for Developers integration for @raisfrozenfoods</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Awaiting Account Authorization</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/20">
                  <div className="text-slate-400 font-mono">Instagram Account:</div>
                  <div className="font-bold text-white mt-1">@raisfrozenfoods</div>
                  <div className="text-[11px] text-cyan-300/80 mt-0.5">Display: RAIS Frozen & Pack Rayachoty</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/20">
                  <div className="text-slate-400 font-mono">Publishing Mode:</div>
                  <div className="font-bold text-amber-300 mt-1">Manual Publishing Workflow</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">1-Click Caption Copy + Asset Download</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/20">
                  <div className="text-slate-400 font-mono">Meta Graph Endpoint:</div>
                  <div className="font-bold text-white mt-1">v20.0 /media (REELS)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">9:16 Video Container Pipeline</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <strong className="block text-amber-300 font-bold mb-1">Honest Integration Status Notice:</strong>
                Per operating principles, automated API publishing requires adding your Meta Page Access Token in the Settings tab. Until then, use the built-in <strong>Manual Publishing Pack</strong> to copy pre-formatted captions and assets directly into Instagram with zero risk of account restriction.
              </div>
            </div>

            {/* Ready to Publish Queue */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-4">
              <h3 className="text-lg font-serif font-bold text-white">Publishing Queue ({reels.filter(r => r.status !== 'published').length} pending)</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081026] text-cyan-300 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Day</th>
                      <th className="py-3 px-4">Title & Product</th>
                      <th className="py-3 px-4">Theme</th>
                      <th className="py-3 px-4">CTA Keyword</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/15 text-slate-300">
                    {reels.map((reel) => (
                      <tr key={reel.id} className="hover:bg-cyan-400/[0.04]">
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">Day {reel.dayNumber}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{reel.title}</div>
                          <div className="text-[11px] text-slate-400">{reel.brand} · {reel.productName}</div>
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-mono text-cyan-300">{reel.theme}</td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">"{reel.ctaKeyword}"</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            reel.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                            reel.status === 'approved' ? 'bg-cyan-500/20 text-cyan-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {reel.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setManualPublishReel(reel)}
                            className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-colors"
                          >
                            Publishing Pack
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 5. TAB 3: CUSTOMER ENQUIRIES & LEAD CRM */}
        {activeTab === 'enquiries' && (
          <div className="space-y-8">
            
            {/* Interactive Comment / DM Simulator Card */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    <span>Instagram Comment & DM Automation Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Test how our bot handles incoming inquiries, prevents price hallucinations, and routes quotes to humans.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Customer Username</label>
                  <input
                    type="text"
                    value={simUsername}
                    onChange={(e) => setSimUsername(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#081026] border border-cyan-500/30 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Channel Source</label>
                  <select
                    value={simSource}
                    onChange={(e) => setSimSource(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 bg-[#081026] border border-cyan-500/30 rounded-xl text-xs text-white"
                  >
                    <option value="instagram_dm">Direct Message (DM)</option>
                    <option value="instagram_comment">Reel Comment (e.g. CATALOGUE, PRICE)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Quick Test Templates</label>
                  <select
                    onChange={(e) => setSimText(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#081026] border border-cyan-500/30 rounded-xl text-xs text-white"
                  >
                    <option value="Price for 5 cartons of Hup Hup fries in Rayachoty?">Price for 5 cartons of Hup Hup fries in Rayachoty?</option>
                    <option value="CATALOGUE">Comment: "CATALOGUE"</option>
                    <option value="Do you have ITC chicken momos in Rayachoty depot?">Do you have ITC chicken momos in Rayachoty depot?</option>
                    <option value="Where is your wholesale depot located?">Where is your wholesale depot located?</option>
                    <option value="Give me 20% discount on mozzarella cheese">Give me 20% discount on mozzarella cheese</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Incoming Customer Message</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={simText}
                    onChange={(e) => setSimText(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#081026] border border-cyan-500/30 rounded-xl text-xs text-white"
                  />
                  <button
                    onClick={handleRunSimulation}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs shadow hover:scale-[1.02] transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Bot Test</span>
                  </button>
                </div>
              </div>

              {simResult && (
                <div className="p-4 rounded-xl bg-[#081026] border border-emerald-500/30 text-xs text-emerald-200 whitespace-pre-wrap font-sans">
                  {simResult}
                </div>
              )}
            </div>

            {/* Lead Management CRM Table & Filters */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Rayachoty Wholesale Leads Pipeline</h3>
                  <p className="text-xs text-slate-300">Live enquiries captured from Instagram Reels and DMs</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#081026] border border-cyan-500/30 rounded-xl text-xs text-white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Quote Pending">Quote Pending</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search leads, product, town..."
                    className="px-3 py-1.5 bg-[#081026] border border-cyan-500/30 rounded-xl text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081026] text-cyan-300 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Customer / Handle</th>
                      <th className="py-3 px-4">Business & Location</th>
                      <th className="py-3 px-4">Product Interest & Qty</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Human Handoff</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/15 text-slate-300">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-cyan-400/[0.04]">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{lead.customerName}</div>
                          <div className="text-[11px] text-amber-300">@{lead.instagramUsername || 'direct'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-white">{lead.businessName || lead.businessType || 'Food Service'}</div>
                          <div className="text-[11px] text-slate-400">{lead.deliveryLocation}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-cyan-200">{lead.productInterest}</div>
                          <div className="text-[11px] text-slate-400">{lead.requiredQuantity}</div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                              lead.status === 'Ordered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              lead.status === 'Quote Pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                              lead.status === 'Quoted' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' :
                              'bg-slate-800 text-slate-200 border-slate-700'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Quote Pending">Quote Pending</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Ordered">Ordered</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          {lead.humanHandoffRequired ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                              Required
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">Automated</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={`https://wa.me/91${lead.phone || '9347453135'}?text=${encodeURIComponent(`Hello ${lead.customerName}, this is RAIS Agencies Rayachoty regarding your inquiry for ${lead.productInterest}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 6. TAB 4: SETTINGS & INTEGRATIONS */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            
            {/* Integrations List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {integrations.map((item) => (
                <div key={item.service} className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.connectionState}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.details}
                  </p>
                  <div className="pt-2 border-t border-cyan-500/15 text-[11px] text-slate-400 font-mono">
                    Account: {item.accountName || 'Not configured'}
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Log Table */}
            <div className="p-6 rounded-3xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Automation System Audit Log</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Immutable Event History</span>
              </div>

              <div className="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081026] text-cyan-300 uppercase tracking-wider text-[11px] sticky top-0">
                    <tr>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Actor</th>
                      <th className="py-2.5 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/15 text-slate-300">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-cyan-400/[0.04]">
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-cyan-300 text-[10px]">{log.category}</td>
                        <td className="py-2.5 px-4 font-semibold text-white">{log.action}</td>
                        <td className="py-2.5 px-4 text-slate-400">{log.actor}</td>
                        <td className="py-2.5 px-4 text-slate-300">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Backup & Export Controls */}
            <div className="p-5 rounded-2xl bg-[#0f1c3f]/80 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Data Portability & Backup</h4>
                <p className="text-xs text-slate-400 mt-0.5">Export all 30-day scripts, leads, and audit history to JSON.</p>
              </div>
              <button
                onClick={() => {
                  const json = AutomationStorage.exportAllData();
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `RAIS-Agencies-Automation-Backup-${Date.now()}.json`;
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export System Data (JSON)</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* MANUAL PUBLISHING WIZARD MODAL */}
      {manualPublishReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1c3f] border border-cyan-400 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase">Manual Publishing Pack</span>
                <h3 className="text-xl font-bold font-serif text-white">{manualPublishReel.title}</h3>
              </div>
              <button 
                onClick={() => setManualPublishReel(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#081026] border border-cyan-500/20 space-y-2">
                <span className="font-bold text-cyan-300 block uppercase tracking-wider">Step-by-Step Instructions:</span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300 leading-relaxed">
                  <li>Download the 9:16 vertical video asset or preview frame below.</li>
                  <li>Copy the pre-formatted Telugu caption with hashtags.</li>
                  <li>Open Instagram (@raisfrozenfoods) or Meta Business Suite.</li>
                  <li>Create Reel, select the asset, and paste the caption.</li>
                  <li>Click "Confirm Published" below to record the event in the audit log.</li>
                </ol>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300 uppercase">Pre-Formatted Caption:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${manualPublishReel.caption}\n\n${manualPublishReel.hashtags.join(' ')}`);
                      alert('Caption copied!');
                    }}
                    className="text-xs font-bold text-cyan-300 hover:text-white"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={`${manualPublishReel.caption}\n\n${manualPublishReel.hashtags.join(' ')}`}
                  className="w-full p-3 bg-[#081026] border border-cyan-500/30 rounded-xl text-xs text-slate-200 font-mono resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://business.facebook.com/creatorstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Meta Business Suite</span>
                </a>

                <button
                  onClick={() => handleConfirmManualPublish(manualPublishReel)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Published</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
