import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle2, AlertTriangle, ShieldCheck, 
  TrendingUp, RefreshCw, Check, Info, MapPin
} from 'lucide-react';
import { api, KeywordTarget } from '../../services/api';

export const LocalSEOView: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordTarget[]>([]);
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'keywords' | 'audit' | 'guidelines'>('keywords');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [kwData, auditData] = await Promise.all([
        api.listKeywords(),
        api.getSeoAudit()
      ]);
      setKeywords(kwData);
      setAudit(auditData);
    } catch (err) {
      console.error('Failed to load SEO data', err);
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
            <Search className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Rayachoty Local SEO & Blueprint Strategy</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Optimized for high-intent B2B search terms across Rayachoty, Annamayya District, and regional commercial corridors. Grounded strictly in documented Google ranking factors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs flex items-center gap-2">
            <span className="text-slate-400">SEO Completeness:</span>
            <span className="font-bold text-emerald-400">{audit?.completeness_score || 95}%</span>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'keywords', label: `Target Keywords (${keywords.length})` },
          { id: 'audit', label: 'GBP Profile Audit' },
          { id: 'guidelines', label: 'Documented Ranking Factors vs Myths' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === t.id
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Keywords Table */}
      {activeTab === 'keywords' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Rayachoty Commercial Search Matrix</span>
            </h2>
            <span className="text-xs text-slate-400">Prioritized by local B2B commercial intent</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0a0f1d] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Keyword Phrase</th>
                  <th className="py-3 px-4 font-semibold">Intent</th>
                  <th className="py-3 px-4 font-semibold">Geography</th>
                  <th className="py-3 px-4 font-semibold">Language</th>
                  <th className="py-3 px-4 font-semibold text-center">Relevance</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {keywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{kw.keyword}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium text-[11px] border border-amber-500/20">
                        {kw.intent}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>Rayachoty & Corridor</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 uppercase text-[10px]">{kw.language}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-emerald-400">{kw.relevance_score}/100</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                        <Check className="w-3 h-3" />
                        <span>Active Target</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Profile Audit */}
      {activeTab === 'audit' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Google Business Profile Completeness Audit</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against Google local ranking guidelines and RAIS blueprint requirements.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">{audit?.completeness_score || 95}%</span>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Profile Health</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audit?.audit_items?.map((item: any, idx: number) => (
              <div 
                key={idx}
                className="p-3.5 bg-[#070b14] border border-slate-800 rounded-lg flex items-start gap-3"
              >
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-white">{item.check}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Impact: <span className="font-semibold text-slate-300">{item.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reality vs Myths */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Documented Google Ranking Factors</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Precise Category Selection:</strong> Primary category <code>Wholesale food store</code> matched to real business license and activity.
              </li>
              <li>
                <strong>NAP Consistency:</strong> Name strictly <code>RAIS Agencies</code> (no keyword stuffing like 'RAIS Cheese Rayachoty' which risks immediate suspension).
              </li>
              <li>
                <strong>Prominence & Authentic Reviews:</strong> Real reviews mentioning mozzarella, fries, and butter paper with owner responses.
              </li>
              <li>
                <strong>Physical Proximity & Landmark:</strong> 'Beside Indel Money Bank' assists customer navigation and Google pin validation.
              </li>
              <li>
                <strong>Direct Contact Link:</strong> Single verified WhatsApp phone <code>9347453135</code>.
              </li>
            </ul>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Disproven Myths & Excluded Tactics</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Keyword Stuffing Business Title:</strong> Forbidden by Google guidelines; leads to hard profile suspension.
              </li>
              <li>
                <strong>EXIF / Geo-tagging Images:</strong> Google strips EXIF metadata on upload; does not impact local 3-pack rank.
              </li>
              <li>
                <strong>Daily Spam Posting:</strong> Frequency does not equal rank. Quality B2B stock announcements 2–3 times a week is optimal.
              </li>
              <li>
                <strong>Fake or Incentivized Reviews:</strong> Google's AI detection flags review rings and deletes fraudulent accounts.
              </li>
              <li>
                <strong>Price Wars in Public Posts:</strong> Exposing wholesale pricing publicly harms cafe margins and client trust.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};