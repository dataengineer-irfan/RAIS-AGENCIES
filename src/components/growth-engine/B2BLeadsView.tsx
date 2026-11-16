import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Plus, MessageCircle, Phone, 
  MapPin, CheckCircle2, RefreshCw, X, AlertCircle
} from 'lucide-react';
import { api, B2BLead } from '../../services/api';

export const B2BLeadsView: React.FC = () => {
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // New Lead form state
  const [newLead, setNewLead] = useState<Partial<B2BLead>>({
    business_name: '',
    contact_person: '',
    phone: '',
    business_type: 'Cafe',
    location: 'Rayachoty',
    product_interest: 'Milky Mist Diced Mozzarella & French Fries',
    status: 'NEW'
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.listLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads', err);
    } finally {
      setLoading(false);
    }
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
      await loadLeads();
    } catch (err) {
      console.error('Failed to create lead', err);
    }
  };

  const handleStatusChange = async (id: number, newStatus: any) => {
    try {
      await api.updateLead(id, { status: newStatus });
      await loadLeads();
    } catch (err) {
      console.error('Failed to update lead status', err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Commercial B2B Lead Management</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Inbound wholesale inquiries generated from Google Maps, Google Search, and WhatsApp for Rayachoty cafes, restaurants, bakeries, and QSRs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add B2B Lead</span>
          </button>
          <button
            onClick={loadLeads}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'CONVERTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === st
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st} ({st === 'ALL' ? leads.length : leads.filter(l => l.status === st).length})
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Business / Outlet</th>
                <th className="py-3 px-4 font-semibold">Type & Area</th>
                <th className="py-3 px-4 font-semibold">Product Interest</th>
                <th className="py-3 px-4 font-semibold">Phone / WhatsApp</th>
                <th className="py-3 px-4 font-semibold">Pipeline Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading B2B inquiries...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No inquiries found for status {statusFilter}.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{lead.business_name}</div>
                      <div className="text-[11px] text-slate-400">{lead.contact_person || 'Owner / Chef'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{lead.business_type}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{lead.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                      <div className="line-clamp-2 text-[11px]">
                        {lead.product_interest || 'General frozen food catalog inquiry'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold">
                      {lead.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded border bg-[#070b14] focus:outline-none ${
                          lead.status === 'CONVERTED'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : lead.status === 'QUOTED'
                            ? 'text-purple-400 border-purple-500/40'
                            : lead.status === 'CONTACTED'
                            ? 'text-blue-400 border-blue-500/40'
                            : 'text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUOTED">QUOTED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.contact_person || lead.business_name}, this is RAIS Agencies Rayachoty (Wholesale Frozen Foods & Packaging). How can we help your kitchen today?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition-all shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
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