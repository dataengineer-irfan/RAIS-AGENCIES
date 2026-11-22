import React, { useState } from 'react';
import { CustomerLead, LeadStatus } from '../../data/automationTypes';
import { AutomationStorage } from '../../services/automationStorage';
import { EnquiryBot } from '../../services/enquiryBot';
import { MessageSquare, Send, Users, Phone, Check, ShieldAlert, Sparkles, Filter, Search } from 'lucide-react';

export const InstagramEnquiriesView: React.FC = () => {
  const [leads, setLeads] = useState<CustomerLead[]>(() => AutomationStorage.getLeads());
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('ALL');
  const [leadSearch, setLeadSearch] = useState<string>('');

  // Interactive Message Simulator State
  const [simText, setSimText] = useState<string>('Price for 5 cartons of Hup Hup fries in Rayachoty?');
  const [simSource, setSimSource] = useState<'instagram_comment' | 'instagram_dm'>('instagram_dm');
  const [simUsername, setSimUsername] = useState<string>('rayachoty_fastfood_king');
  const [simResult, setSimResult] = useState<{ action: string; reply: string; handoff: boolean } | null>(null);

  const loadLeads = () => {
    setLeads(AutomationStorage.getLeads());
  };

  const handleRunSimulation = () => {
    if (!simText.trim()) return;
    const res = EnquiryBot.processMessage({
      source: simSource,
      username: simUsername,
      messageText: simText
    });
    setSimResult({
      action: res.actionTaken,
      reply: res.replyText,
      handoff: res.humanHandoff
    });
    loadLeads();
  };

  const handleUpdateLeadStatus = (lead: CustomerLead, newStatus: LeadStatus) => {
    const updated: CustomerLead = {
      ...lead,
      status: newStatus,
      humanHandoffRequired: newStatus === 'Quote Pending' ? true : lead.humanHandoffRequired
    };
    AutomationStorage.updateLead(updated);
    loadLeads();
  };

  const filteredLeads = leads.filter(l => {
    const matchesFilter = leadStatusFilter === 'ALL' || l.status === leadStatusFilter;
    const query = leadSearch.toLowerCase();
    const matchesSearch = !leadSearch || 
      l.customerName.toLowerCase().includes(query) ||
      l.productInterest.toLowerCase().includes(query) ||
      (l.businessName && l.businessName.toLowerCase().includes(query)) ||
      (l.deliveryLocation && l.deliveryLocation.toLowerCase().includes(query)) ||
      (l.instagramUsername && l.instagramUsername.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const quotePendingCount = leads.filter(l => l.status === 'Quote Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d162d] to-[#121d3b] border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20 flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Instagram Enquiries Bot &amp; Leads CRM</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                Active 24/7
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated comment &amp; DM responder that intercepts price inquiries, prevents hallucinations, and captures Rayachoty buyer leads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <span className="text-slate-400 font-mono">Pending Quotes:</span>{' '}
            <strong className="text-amber-400 font-mono text-sm">{quotePendingCount}</strong>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <span className="text-slate-400 font-mono">Total Pipeline:</span>{' '}
            <strong className="text-emerald-400 font-mono text-sm">{leads.length}</strong>
          </div>
        </div>
      </div>

      {/* Interactive Comment / DM Simulator Card */}
      <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Instagram Comment &amp; DM Automation Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live test bench: Verify how our AI safeguards wholesale margins and routes Rayachoty cafe leads to human WhatsApp
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Margin Shield Armed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Customer Instagram Handle
            </label>
            <input
              type="text"
              value={simUsername}
              onChange={(e) => setSimUsername(e.target.value)}
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Channel Source
            </label>
            <select
              value={simSource}
              onChange={(e) => setSimSource(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="instagram_dm">Direct Message (DM)</option>
              <option value="instagram_comment">Reel Comment (e.g. CATALOGUE, PRICE)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Quick Test Templates
            </label>
            <select
              onChange={(e) => setSimText(e.target.value)}
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Price for 5 cartons of Hup Hup fries in Rayachoty?">Price for 5 cartons of Hup Hup fries in Rayachoty?</option>
              <option value="CATALOGUE">Comment: "CATALOGUE"</option>
              <option value="Do you have TRIKEN chicken momos in Rayachoty depot?">Do you have TRIKEN chicken momos in Rayachoty depot?</option>
              <option value="Where is your wholesale depot located?">Where is your wholesale depot located?</option>
              <option value="Give me 20% discount on mozzarella cheese">Give me 20% discount on mozzarella cheese</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Simulated Customer Message
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={simText}
              onChange={(e) => setSimText(e.target.value)}
              placeholder="Type any enquiry..."
              className="flex-1 px-4 py-2.5 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleRunSimulation}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Run Bot Test</span>
            </button>
          </div>
        </div>

        {simResult && (
          <div className="p-4 rounded-xl bg-[#070b14] border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-emerald-400">
                Action: {simResult.action}
              </span>
              {simResult.handoff ? (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase font-mono">
                  Human Handoff Required
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase font-mono">
                  Fully Automated
                </span>
              )}
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-wrap font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              "{simResult.reply}"
            </div>
          </div>
        )}
      </div>

      {/* Lead Management CRM Table & Filters */}
      <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Rayachoty Wholesale Leads Pipeline CRM</span>
            </h3>
            <p className="text-xs text-slate-400">
              Commercial restaurant inquiries captured from Instagram Reels, Storefront Quotes, and WhatsApp
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search leads, product, town..."
                className="pl-8 pr-3 py-1.5 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52"
              />
            </div>

            <select
              value={leadStatusFilter}
              onChange={(e) => setLeadStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Statuses ({leads.length})</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Quote Pending">Quote Pending</option>
              <option value="Quoted">Quoted</option>
              <option value="Ordered">Ordered</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="py-12 px-6 text-center rounded-xl bg-[#070b14] border border-dashed border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No Leads Match Current Filter</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              New customer inquiries submitted via the quotation builder, incoming WhatsApp (+91 9347453135), or test messages from the bot simulator will be captured here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f172a] text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Customer / Handle</th>
                  <th className="py-3 px-4">Business &amp; Town</th>
                  <th className="py-3 px-4">Product Interest &amp; Qty</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4">Human Handoff</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 bg-[#070b14]/50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{lead.customerName}</div>
                      <div className="text-[11px] text-pink-400 font-mono">
                        @{lead.instagramUsername || 'direct_buyer'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{lead.businessName || lead.businessType || 'Food Service'}</div>
                      <div className="text-[11px] text-slate-400">{lead.deliveryLocation}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-cyan-200">{lead.productInterest}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{lead.requiredQuantity}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border font-mono focus:outline-none ${
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
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase font-mono">
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-all shadow"
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
        )}
      </div>
    </div>
  );
};
