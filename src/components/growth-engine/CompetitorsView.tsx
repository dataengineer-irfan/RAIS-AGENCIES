import React, { useState, useEffect } from 'react';
import { 
  Users, AlertTriangle, ShieldCheck, Plus, Trash2, X,
  RefreshCw, MapPin, Star, Info, ExternalLink
} from 'lucide-react';
import { api, Competitor } from '../../services/api';

export const CompetitorsView: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    competitor_name: '',
    location_area: 'Rayachoty',
    public_category: 'Wholesale / Food Supplies',
    rating: '',
    review_count: '',
    website_url: '',
    notes: ''
  });

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await api.listCompetitors();
      setCompetitors(data);
    } catch (err: any) {
      console.error('Failed to load competitors', err);
      setErrorMsg(err?.message || 'Failed to load competitors from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.competitor_name.trim() || !formState.location_area.trim()) return;
    try {
      setSaving(true);
      setErrorMsg(null);
      await api.createCompetitor({
        competitor_name: formState.competitor_name.trim(),
        location_area: formState.location_area.trim(),
        public_category: formState.public_category.trim() || undefined,
        rating: formState.rating ? parseFloat(formState.rating) : null,
        review_count: formState.review_count ? parseInt(formState.review_count, 10) : 0,
        website_url: formState.website_url.trim() || undefined,
        notes: formState.notes.trim() || undefined
      });
      setIsModalOpen(false);
      setFormState({ competitor_name: '', location_area: 'Rayachoty', public_category: 'Wholesale / Food Supplies', rating: '', review_count: '', website_url: '', notes: '' });
      await loadCompetitors();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not save competitor to backend.');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckSite = async (id: number) => {
    setCheckingId(id);
    setErrorMsg(null);
    try {
      await api.checkCompetitorSite(id);
      await loadCompetitors();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Public site check failed.');
    } finally {
      setCheckingId(null);
    }
  };

  const handleDeleteCompetitor = async (id: number) => {
    try {
      await api.deleteCompetitor(id);
      setCompetitors(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not remove competitor.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Local Competitor Intelligence & Benchmarks</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Manually tracked regional traders across Rayachoty and surrounding towns. Add only field-verified traders and verify ratings directly on Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Competitor</span>
          </button>
          <button
            onClick={loadCompetitors}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Mandatory Compliance Notice */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-300">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
        <span>
          <strong>Strict Verification Policy:</strong> Competitor pricing, stock estimates, and weaknesses are manual field observations unless verified on Google Maps. Never use unverified claims in public marketing.
        </span>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
            Loading competitor snapshots...
          </div>
        ) : competitors.length === 0 ? (
          <div className="col-span-3 p-10 bg-[#0f172a] border border-slate-800 rounded-xl text-center space-y-2">
            <p className="text-sm font-bold text-white">No Competitor Snapshots Recorded</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Backend database returned 0 competitors (or backend is currently unreachable). Click &ldquo;Add Competitor&rdquo; above to log a real local supplier observed on Google Maps.
            </p>
          </div>
        ) : (
          competitors.map((comp) => (
            <div 
              key={comp.id}
              className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-sm font-bold text-white">{comp.competitor_name}</h2>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{comp.location_area}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {comp.verified_status === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED'}
                    </span>
                    <button
                      onClick={() => handleDeleteCompetitor(comp.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove competitor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Public Category:</span>
                    <span className="text-slate-200 font-medium">{comp.public_category || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Observed Rating:</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>
                        {comp.rating != null ? `${comp.rating}` : '—'} ({comp.review_count != null ? comp.review_count : '—'})
                      </span>
                    </span>
                  </div>
                </div>

                {comp.public_offers && (
                  <div className="mt-2 p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200">
                    <span className="font-bold">Observed Title/Offers:</span> {comp.public_offers}
                  </div>
                )}

                {comp.notes && (
                  <div className="mt-3 text-[11px] text-slate-400 leading-relaxed italic">
                    &ldquo;{comp.notes}&rdquo;
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>
                    {comp.last_checked_at
                      ? `Checked ${new Date(comp.last_checked_at).toLocaleDateString()} (${comp.confidence || 'MANUAL'})`
                      : 'Periodic manual check'}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  {comp.website_url && (
                    <button
                      type="button"
                      onClick={() => handleCheckSite(comp.id)}
                      disabled={checkingId === comp.id}
                      className="px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-semibold"
                    >
                      {checkingId === comp.id ? 'Checking...' : 'Check Public Site'}
                    </button>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(`${comp.competitor_name} ${comp.location_area}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Verify on Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Competitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Add Real Competitor Observation</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCompetitor} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={formState.competitor_name}
                  onChange={(e) => setFormState({ ...formState, competitor_name: e.target.value })}
                  placeholder="Exact Google Maps business title"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Area *</label>
                  <input
                    type="text"
                    required
                    value={formState.location_area}
                    onChange={(e) => setFormState({ ...formState, location_area: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Category</label>
                  <input
                    type="text"
                    value={formState.public_category}
                    onChange={(e) => setFormState({ ...formState, public_category: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Google Maps Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formState.rating}
                    onChange={(e) => setFormState({ ...formState, rating: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Review Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.review_count}
                    onChange={(e) => setFormState({ ...formState, review_count: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Public Website URL (for HTTP monitoring)</label>
                <input
                  type="url"
                  value={formState.website_url}
                  onChange={(e) => setFormState({ ...formState, website_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-2 text-white resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold">
                  {saving ? 'Saving...' : 'Save Competitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RAIS Differentiator Box */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RAIS Agencies Verified Differentiators</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg">
            <div className="font-bold text-white mb-1">Local Rayachoty Hub</div>
            <p className="text-[11px] text-slate-400">
              Beside Indel Money Bank on Sundupalli Road enables immediate pickup and same-day delivery without waiting for Bangalore/Kadapa transit.
            </p>
          </div>
          <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg">
            <div className="font-bold text-white mb-1">Authentic Milky Mist Sourcing</div>
            <p className="text-[11px] text-slate-400">
              Genuine cold-chain mozzarella diced cheese, paneer, and butter sourced through authorized distributor channels.
            </p>
          </div>
          <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg">
            <div className="font-bold text-white mb-1">Low MOQ for Cafes</div>
            <p className="text-[11px] text-slate-400">
              Single carton/case order flexibility allows small cafes and QSRs to maintain fresh inventory without tying up working capital.
            </p>
          </div>
          <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg">
            <div className="font-bold text-white mb-1">Integrated Packaging</div>
            <p className="text-[11px] border-slate-800 text-slate-400">
              One-stop supply combining frozen foods with 40 GSM butter paper, burger boxes, and pizza containers for streamlined restaurant billing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};