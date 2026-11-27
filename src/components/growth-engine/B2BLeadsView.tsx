import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Plus, MessageCircle, FileSpreadsheet,
  MapPin, CheckCircle2, RefreshCw, X, ExternalLink, Clock, FileText
} from 'lucide-react';
import { api, B2BLead, CatalogSKU } from '../../services/api';

const LEAD_STATUS_OPTIONS = [
  'NEW',
  'QUALIFIED',
  'CONTACTED',
  'INTERESTED',
  'QUOTATION_REQUESTED',
  'QUOTED',
  'CONVERTED',
  'FOLLOW_UP_REQUIRED',
  'NOT_INTERESTED',
  'LOST',
];

export const B2BLeadsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'enquiries'>('leads');
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [skus, setSkus] = useState<CatalogSKU[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<B2BLead | null>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notice, setNotice] = useState<string | null>(null);
  
  const [newLead, setNewLead] = useState<Partial<B2BLead>>({
    business_name: '',
    contact_person: '',
    phone: '',
    business_type: 'Cafe',
    location: 'Rayachoty',
    product_interest: 'Milky Mist Diced Mozzarella & French Fries',
    status: 'NEW'
  });

  const [newEnquiry, setNewEnquiry] = useState({
    customer_name: '',
    phone: '',
    channel: 'MANUAL',
    product_sku: 'RAIS-MM-MOZZ',
    quantity_text: '',
    notes: '',
    linked_order_ref: ''
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [crmData, enqData, skuData] = await Promise.all([
        api.listCrmLeads(),
        api.listEnquiries(),
        api.listSkus().catch(() => [])
      ]);
      setLeads(crmData);
      setEnquiries(enqData);
      setSkus(skuData);
    } catch (err) {
      console.error('Failed to load CRM data', err);
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.business_name || !newLead.phone) return;
    try {
      await api.createLead(newLead);
      setIsModalOpen(false);
      setNewLead({
        business_name: '',
        contact_person: '',
        phone: '',
        business_type: 'Cafe',
        location: 'Rayachoty',
        product_interest: '',
        status: 'NEW'
      });
      flash('Lead created and queued in qualification automation.');
      await loadAll();
    } catch (err) {
      console.error('Failed to create lead', err);
    }
  };

  const handleStatusChange = async (id: number, newStatus: any) => {
    await api.updateLead(id, { status: newStatus });
    await loadAll();
  };

  const handleOpenInteractions = async (lead: B2BLead) => {
    setSelectedLead(lead);
    const items = await api.listLeadInteractions(lead.id);
    setInteractions(items);
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteInput.trim()) return;
    await api.addLeadInteraction(selectedLead.id, noteInput.trim(), 'CRM');
    setNoteInput('');
    setInteractions(await api.listLeadInteractions(selectedLead.id));
    await loadAll();
  };

  const handleExportCsv = async () => {
    const csvText = await api.downloadLeadsCsv();
    const blob = new Blob([csvText], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rais_b2b_leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createEnquiry(newEnquiry);
    setIsEnquiryModalOpen(false);
    setNewEnquiry({ customer_name: '', phone: '', channel: 'MANUAL', product_sku: 'RAIS-MM-MOZZ', quantity_text: '', notes: '', linked_order_ref: '' });
    flash('Customer enquiry recorded and triaged.');
    await loadAll();
  };

  const handleBuildQuotation = async (enquiryId: number) => {
    const q = await api.buildQuotation(enquiryId);
    flash(`Quotation prepared for ${q.product_name}: ${q.price_note}`);
    await loadAll();
  };

  const handleConfirmEnquiry = async (enquiryId: number) => {
    await api.confirmEnquiry(enquiryId);
    flash(`Enquiry #${enquiryId} confirmed and logged in customer interactions.`);
    await loadAll();
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (searchQuery.trim() && !`${l.business_name} ${l.phone} ${l.location} ${l.product_interest || ''}`.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">AI-Powered B2B CRM &amp; Sales Enquiries</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Scored B2B accounts, interaction timelines, CSV export, inbound enquiries, and verified catalogue quotation workflows backed by Neon Postgres.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => activeTab === 'leads' ? setIsModalOpen(true) : setIsEnquiryModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'leads' ? 'Add B2B Lead' : 'Record Enquiry'}</span>
          </button>
          <button
            onClick={loadAll}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs">{notice}</div>
      )}

      {/* Main Domain Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
            activeTab === 'leads' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          CRM Leads ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
            activeTab === 'enquiries' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Customer Enquiries &amp; Quotations ({enquiries.length})
        </button>
      </div>

      {activeTab === 'leads' ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'NEW', 'QUALIFIED', 'CONTACTED', 'QUOTED', 'CONVERTED', 'FOLLOW_UP_REQUIRED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 bg-[#0f172a] border border-slate-800'
                  }`}
                >
                  {st} ({st === 'ALL' ? leads.length : leads.filter(l => l.status === st).length})
                </button>
              ))}
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business, phone, location..."
              className="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-slate-800 text-xs text-white w-64"
            />
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0a0f1d] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Business / Outlet</th>
                    <th className="py-3 px-4 font-semibold">Score &amp; Segment</th>
                    <th className="py-3 px-4 font-semibold">Product Interest</th>
                    <th className="py-3 px-4 font-semibold">Phone</th>
                    <th className="py-3 px-4 font-semibold">Pipeline Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">Loading B2B CRM...</td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">No leads match current filter.</td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{lead.business_name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{lead.business_type} · {lead.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold">
                            {lead.lead_score ?? 50}/100 · {lead.segment || 'General B2B'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                          <div className="line-clamp-2 text-[11px]">{lead.product_interest || 'Wholesale supply inquiry'}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold">
                          {lead.phone}
                          {lead.opted_out_whatsapp && <span className="ml-1 text-[10px] text-rose-400">(OPT-OUT)</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="text-[11px] font-bold px-2 py-1 rounded border bg-[#070b14] border-slate-700 text-amber-300"
                          >
                            {LEAD_STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenInteractions(lead)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[11px] font-semibold border border-slate-700"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Timeline</span>
                          </button>
                          <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(`${lead.business_name} ${lead.location}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={`https://wa.me/91${lead.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Namaste ${lead.contact_person || lead.business_name}! This is RAIS Agencies Rayachoty (9347453135).`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-[#0f172a] border border-slate-800 rounded-xl">
              No enquiries recorded yet. Inbound WhatsApp messages and manual/website enquiries appear here automatically.
            </div>
          ) : (
            enquiries.map((enq) => (
              <div key={enq.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-white text-sm">{enq.customer_name}</span>
                    <span className="ml-2 font-mono text-amber-300">{enq.phone}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-mono">{enq.channel}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">{enq.status}</span>
                </div>
                <div className="text-slate-300">
                  <strong>Product:</strong> {enq.product_name || enq.product_sku || 'Unspecified'} · <strong>Qty:</strong> {enq.quantity_text || 'TBD'} · <strong>Order Ref:</strong> {enq.linked_order_ref || '—'}
                </div>
                {enq.prepared_response && (
                  <div className="p-2.5 rounded bg-[#070b14] border border-slate-800 text-slate-300">
                    <strong>Draft Response:</strong> {enq.prepared_response}
                  </div>
                )}
                {enq.quotation && (
                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                    <strong>Verified Quotation:</strong> {enq.quotation.product_name} ({enq.quotation.pack_size}) — {enq.quotation.price_note}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleBuildQuotation(enq.id)}
                    className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prepare Catalogue Quotation</span>
                  </button>
                  {enq.requires_confirmation && (
                    <button
                      onClick={() => handleConfirmEnquiry(enq.id)}
                      className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Log Interaction</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Interaction Timeline Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Interactions — {selectedLead.business_name}</h2>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              {interactions.length === 0 ? (
                <div className="text-slate-500">No interactions recorded yet.</div>
              ) : (
                interactions.map((i) => (
                  <div key={i.id} className="p-2.5 rounded bg-[#070b14] border border-slate-800">
                    <div className="text-[10px] font-mono text-cyan-300">{i.channel} · {i.direction} · {new Date(i.created_at).toLocaleString()}</div>
                    <div className="text-slate-200 mt-0.5">{i.summary}</div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleAddInteraction} className="flex gap-2 text-xs">
              <input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Log call/visit/follow-up note..."
                className="flex-1 px-3 py-2 rounded bg-[#070b14] border border-slate-700 text-white"
              />
              <button type="submit" className="px-4 py-2 rounded bg-amber-500 text-slate-950 font-bold">Add</button>
            </form>
          </div>
        </div>
      )}

      {/* Record Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Record Customer Enquiry</h2>
              <button onClick={() => setIsEnquiryModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateEnquiry} className="space-y-3 text-xs">
              <input required placeholder="Customer / Business Name *" value={newEnquiry.customer_name} onChange={(e) => setNewEnquiry({ ...newEnquiry, customer_name: e.target.value })} className="w-full px-3 py-2 rounded bg-[#070b14] border border-slate-800 text-white" />
              <input required placeholder="Phone *" value={newEnquiry.phone} onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })} className="w-full px-3 py-2 rounded bg-[#070b14] border border-slate-800 text-white font-mono" />
              <select value={newEnquiry.product_sku} onChange={(e) => setNewEnquiry({ ...newEnquiry, product_sku: e.target.value })} className="w-full px-3 py-2 rounded bg-[#070b14] border border-slate-800 text-white">
                <option value="">-- Select Verified SKU --</option>
                {skus.map((s) => <option key={s.id} value={s.sku}>[{s.brand}] {s.name} ({s.sku})</option>)}
              </select>
              <input placeholder="Quantity (e.g. 5 cartons)" value={newEnquiry.quantity_text} onChange={(e) => setNewEnquiry({ ...newEnquiry, quantity_text: e.target.value })} className="w-full px-3 py-2 rounded bg-[#070b14] border border-slate-800 text-white" />
              <input placeholder="Linked Order Ref (optional)" value={newEnquiry.linked_order_ref} onChange={(e) => setNewEnquiry({ ...newEnquiry, linked_order_ref: e.target.value })} className="w-full px-3 py-2 rounded bg-[#070b14] border border-slate-800 text-white" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEnquiryModalOpen(false)} className="px-3 py-2 bg-slate-800 text-slate-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded">Save Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Record New B2B Lead</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Outlet / Business Name *</label>
                <input
                  type="text"
                  required
                  value={newLead.business_name}
                  onChange={(e) => setNewLead({ ...newLead, business_name: e.target.value })}
                  placeholder="e.g. Royal Cafe & Bakers"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newLead.contact_person}
                    onChange={(e) => setNewLead({ ...newLead, contact_person: e.target.value })}
                    placeholder="e.g. Imran Bhai"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="e.g. 9848022338"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Business Type</label>
                  <select
                    value={newLead.business_type}
                    onChange={(e) => setNewLead({ ...newLead, business_type: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Cafe">Cafe</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Fast Food / QSR">Fast Food / QSR</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Retailer">Retailer</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLead.location}
                    onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                    placeholder="Rayachoty / Kadapa"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Product Requirement</label>
                <textarea
                  rows={2}
                  value={newLead.product_interest}
                  onChange={(e) => setNewLead({ ...newLead, product_interest: e.target.value })}
                  placeholder="e.g. Milky Mist Mozzarella 5kg/week, French fries, Shawarma butter paper"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};