import React, { useState, useEffect } from 'react';
import { 
  Users, AlertTriangle, ShieldCheck, CheckCircle2, 
  RefreshCw, MapPin, Star, Info
} from 'lucide-react';
import { api, Competitor } from '../../services/api';

export const CompetitorsView: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      const data = await api.listCompetitors();
      setCompetitors(data);
    } catch (err) {
      console.error('Failed to load competitors', err);
    } finally {
      setLoading(false);
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
            Monitored regional traders across Rayachoty and Kadapa. In accordance with system safety constraints, all external competitor claims are flagged as UNVERIFIED until audited.
          </p>
        </div>

        <div>
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

      {/* Mandatory Compliance Notice */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-300">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
        <span>
          <strong>Strict Verification Policy:</strong> Competitor pricing, stock estimates, and weaknesses are unverified third-party claims. Never use unverified competitor accusations in public marketing.
        </span>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
            Loading competitor snapshots...
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
                    UNVERIFIED
                  </span>
                </div>

                <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Public Category:</span>
                    <span className="text-slate-200 font-medium">{comp.public_category || 'General Trader'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Estimated Rating:</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{comp.rating || 4.0} ({comp.review_count || 12})</span>
                    </span>
                  </div>
                </div>

                {comp.notes && (
                  <div className="mt-3 text-[11px] text-slate-400 leading-relaxed italic">
                    "{comp.notes}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Monitored for local search positioning only.</span>
              </div>
            </div>
          ))
        )}
      </div>

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