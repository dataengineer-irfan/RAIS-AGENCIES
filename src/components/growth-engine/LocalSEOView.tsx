import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle2, AlertTriangle, ShieldCheck, 
  TrendingUp, RefreshCw, Check, Info, MapPin
} from 'lucide-react';
import { api, KeywordTarget, COMMERCIAL_TARGET_KEYWORDS } from '../../services/api';

const DEFAULT_QNA_LIST = [
  {
    id: 1,
    question: "What is the delivery radius for frozen food from your Rayachoty depot?",
    answer: "We deliver daily across Rayachoty town (516269) and operate scheduled route logistics to all 10 surrounding supply corridors: Sundupalli, Galiveedu, Kadiri, Chinnamandem, Kalakada, Mahal, Madanapalle, Kadapa, and Rajampet with guaranteed -18°C continuous cold chain storage.",
    category: "Cold Chain & Logistics",
    target_keywords: ["frozen food wholesale rayachoty", "refrigerated delivery annamayya district"]
  },
  {
    id: 2,
    question: "Do you supply Milky Mist mozzarella cheese and Amul French fries to cafes in bulk wholesale cartons?",
    answer: "Yes. RAIS Agencies is a commercial wholesale supplier in Rayachoty. We stock 1kg & 2kg Milky Mist diced mozzarella cheese (high stretch), Amul 6mm shoestring & Hup Hup 9mm french fries, Triken frozen chicken momos, and burger patties at direct wholesale trade rates.",
    category: "Commercial Food Products",
    target_keywords: ["milky mist cheese wholesale rayachoty", "french fries wholesale rayachoty", "triken chicken momos wholesale"]
  },
  {
    id: 3,
    question: "Where is your wholesale depot located in Rayachoty and what is your contact number?",
    answer: "Our central commercial depot is located beside Indel Money Bank, Sundupalli Road, Near Reddies Colony, Rayachoty – 516269, Annamayya District, Andhra Pradesh. For trade pricing, bulk carton orders, or kitchen delivery, WhatsApp or call 9347453135.",
    category: "Depot Location & Contact",
    target_keywords: ["frozen food supplier rayachoty", "sundupalli road rayachoty wholesale"]
  },
  {
    id: 4,
    question: "Do you sell corrugated pizza boxes and greaseproof food packaging materials?",
    answer: "Yes. We stock commercial 3-ply corrugated pizza takeaway boxes in 7, 8, 9, 10, and 12-inch sizes with ventilation flutes, kraft burger clamshell boxes, and certified 40 GSM oil and grease-resistant (OGR) butter paper wrapping sheets for shawarmas, burgers, and rolls.",
    category: "Packaging Solutions",
    target_keywords: ["pizza boxes wholesale rayachoty", "butter paper supplier rayachoty", "kraft burger boxes"]
  },
  {
    id: 5,
    question: "What are your wholesale depot operating and order dispatch hours?",
    answer: "Our depot is open Monday through Saturday from 8:00 AM to 9:30 PM, and on Sunday from 8:00 AM to 2:00 PM for commercial kitchen pickups and scheduled route dispatches.",
    category: "Operating Hours",
    target_keywords: ["rais agencies depot hours rayachoty", "wholesale food pickup rayachoty"]
  }
];

export const LocalSEOView: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordTarget[]>(COMMERCIAL_TARGET_KEYWORDS);
  const [audit, setAudit] = useState<any>(null);
  const [qnaData, setQnaData] = useState<any>(null);
  const [gscData, setGscData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'keywords' | 'gsc' | 'audit' | 'guidelines' | 'qna'>('keywords');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const qnaList = qnaData?.qna_list && Array.isArray(qnaData.qna_list) && qnaData.qna_list.length > 0
    ? qnaData.qna_list
    : DEFAULT_QNA_LIST;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [kwData, auditData, qnaRes, gscRes] = await Promise.all([
        api.listKeywords(),
        api.getSeoAudit(),
        api.getGoogleQnA().catch(() => null),
        api.getSearchConsoleData().catch(() => null)
      ]);
      setKeywords(kwData);
      setAudit(auditData);
      setQnaData(qnaRes);
      setGscData(gscRes);
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
            <span className="text-slate-400">Internal DB Check:</span>
            <span className={`font-bold ${typeof audit?.completeness_score === 'number' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {typeof audit?.completeness_score === 'number' ? `${audit.completeness_score}%` : 'Unavailable'}
            </span>
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
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 flex-wrap">
        {[
          { id: 'keywords', label: `Target Keywords (${keywords.length})` },
          { id: 'gsc', label: 'Google Search Console (Live)' },
          { id: 'audit', label: 'Internal Readiness Check' },
          { id: 'qna', label: `Website Schema FAQPage (${qnaList.length})` },
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
              <span className={`text-2xl font-black ${typeof audit?.completeness_score === 'number' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {typeof audit?.completeness_score === 'number' ? `${audit.completeness_score}%` : '—'}
              </span>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {typeof audit?.completeness_score === 'number' ? 'Profile Health' : 'Backend Audit Offline'}
              </div>
            </div>
          </div>

          {!audit?.audit_items || audit.audit_items.length === 0 ? (
            <div className="p-6 bg-[#070b14] border border-slate-800 rounded-lg text-center text-xs text-slate-400">
              Live SEO profile audit is unavailable while the backend API is unreachable. Click Refresh once the backend service is awake.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audit.audit_items.map((item: any, idx: number) => (
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
          )}
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

      {/* Tab 4: Google Q&A Pre-seeding Engine ("Ask Maps" AI) */}
      {activeTab === 'qna' && (
        <div className="space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Google Maps Q&A & Conversational AI Knowledge Graph</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Google's Gemini and "Ask Maps" AI index GBP Questions &amp; Answers and website Schema.org <code>FAQPage</code> to answer voice and conversational queries from cafe owners.
              </p>
            </div>
              <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Website Schema FAQPage Only (Maps Q&amp;A API Separate)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {qnaList.map((q: any) => (
              <div key={q.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {q.category}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Q: ${q.question}\nA: ${q.answer}`);
                      setCopiedId(q.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-[#070b14] border border-slate-800 transition-colors flex items-center gap-1"
                  >
                    {copiedId === q.id ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                    <span>{copiedId === q.id ? 'Copied' : 'Copy Q&A'}</span>
                  </button>
                </div>

                <div className="text-sm font-bold text-white">
                  Q: {q.question}
                </div>

                <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  A: {q.answer}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {q.target_keywords?.map((kw: string, kidx: number) => (
                    <span key={kidx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/40">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Google Search Console Live Data */}
      {activeTab === 'gsc' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Google Search Console Performance (28d)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Site: {gscData?.site_url || 'https://dataengineer-irfan.github.io/RAIS-AGENCIES/'}</p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
              {gscData?.status || 'UNAVAILABLE'}
            </span>
          </div>

          {gscData?.rows?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0a0f1d] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Query</th>
                    <th className="py-2.5 px-3 text-right">Clicks</th>
                    <th className="py-2.5 px-3 text-right">Impressions</th>
                    <th className="py-2.5 px-3 text-right">CTR</th>
                    <th className="py-2.5 px-3 text-right">Avg Pos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {gscData.rows.map((r: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 text-white font-semibold">{(r.keys || []).join(' ')}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{r.clicks}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-cyan-300">{r.impressions}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-300">{((r.ctr || 0) * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">{Number(r.position || 0).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#070b14] border border-amber-500/30 text-xs text-amber-300">
              Search Console query data unavailable ({gscData?.message || 'Grant webmasters.readonly OAuth scope to stream Search Console impressions & clicks'}).
            </div>
          )}
        </div>
      )}
    </div>
  );
};