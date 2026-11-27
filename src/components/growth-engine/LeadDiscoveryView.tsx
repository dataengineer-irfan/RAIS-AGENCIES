import React, { useEffect, useState } from 'react';
import { Compass, ExternalLink, MapPin, Plus, RefreshCw, Search, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const LeadDiscoveryView: React.FC = () => {
  const [category, setCategory] = useState('cafe');
  const [location, setLocation] = useState('Rayachoty, Andhra Pradesh');
  const [apiConfigured, setApiConfigured] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadExisting = async () => {
    setLoading(true);
    try {
      const res = await api.listDiscoveries();
      setApiConfigured(Boolean(res.api_configured));
      setResults(res.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExisting();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setNotice(null);
    try {
      const res = await api.searchGooglePlaces(category, location);
      setApiConfigured(Boolean(res.api_configured));
      if (res.status === 'NOT_CONFIGURED' || res.status === 'PERMISSION_MISSING') {
        setNotice(res.message);
      } else {
        setNotice(`Discovered ${res.discovered_count} businesses from Google Places API.`);
        await loadExisting();
      }
    } catch (err: any) {
      setNotice(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleConvert = async (id: number) => {
    const res = await api.convertDiscoveryToCrm(id);
    setNotice(res.duplicate ? `Duplicate detected — matched existing CRM Lead #${res.lead_id}.` : `Added to B2B CRM as Lead #${res.lead_id} & triggered qualification workflow.`);
    await loadExisting();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>B2B Lead Discovery (Google Places API)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Google Places API (New) discovery for cafes, bakeries, hotels, restaurants &amp; QSRs with CRM deduplication.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
          apiConfigured ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        }`}>
          {apiConfigured ? 'Places API Key Configured' : 'API Key Required'}
        </span>
      </div>

      {!apiConfigured && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Authorization Boundary:</strong> Set <code>GOOGLE_PLACES_API_KEY</code> on the backend (Render) to enable live Google Places API (New) discovery. No hardcoded or fabricated leads are shown.
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-end text-xs">
        <div>
          <label className="text-slate-300 font-semibold block mb-1">Business Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white"
          >
            <option value="cafe">Cafes</option>
            <option value="restaurant">Restaurants</option>
            <option value="bakery">Bakeries</option>
            <option value="hotel">Hotels</option>
            <option value="fast food restaurant">Fast Food / QSR</option>
            <option value="pizza restaurant">Pizza Outlets</option>
            <option value="burger restaurant">Burger Outlets</option>
            <option value="catering">Catering Businesses</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-slate-300 font-semibold block mb-1">Target Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{searching ? 'Searching...' : 'Discover Businesses'}</span>
        </button>
      </form>

      {notice && (
        <div className="p-3 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs">{notice}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-10 text-center text-slate-500 text-xs">Loading discoveries...</div>
        ) : results.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-[#0f172a] border border-slate-800 rounded-xl">
            No discovered businesses persisted yet. Run a live Google Places search once <code>GOOGLE_PLACES_API_KEY</code> is set.
          </div>
        ) : (
          results.map((r) => (
            <div key={r.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-white">{r.business_name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                    Score {r.lead_score}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-300">{r.category}</div>
                <div className="text-[11px] text-slate-400 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{r.address || r.location_query}</span>
                </div>
                {r.phone && <div className="text-[11px] font-mono text-amber-300">{r.phone}</div>}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleConvert(r.id)}
                  className="flex-1 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{r.converted_lead_id ? `In CRM (#${r.converted_lead_id})` : 'Add to B2B CRM'}</span>
                </button>
                {r.maps_url && (
                  <a href={r.maps_url} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-slate-800 text-slate-300">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
