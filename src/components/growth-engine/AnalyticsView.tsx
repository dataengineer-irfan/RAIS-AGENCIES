import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Phone, Navigation, Globe, 
  Search, Eye, RefreshCw, Calendar, AlertCircle, CheckCircle2, ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

type TelemetryState = 'NOT_CONNECTED' | 'CONNECTED_BUT_NO_DATA' | 'LIVE_DATA_AVAILABLE' | 'API_ERROR' | 'API_ACCESS_NOT_APPROVED';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      setLoading(true);
      const [perfRes] = await Promise.allSettled([
        api.getGooglePerformance()
      ]);

      let res = perfRes.status === 'fulfilled' ? perfRes.value : null;

      // Pure authenticity: strictly NO fake or mock fallback metrics
      if (!res || !res.metrics || res.status === 'NOT_CONNECTED') {
        res = {
          status: 'NOT_CONNECTED',
          is_live: false,
          is_simulated: false,
          source: 'Google Business Profile API (Pending OAuth Connection)',
          date_range: 'Past 30 Days',
          metrics: null,
          search_keywords_top: [],
          notice: 'Google Cloud OAuth credentials not authorized. Telemetry metrics remain unavailable (—) until connected. Zero mock data is presented as genuine.',
          actionable_instruction: 'Connect your Google Cloud OAuth credentials to stream real Google Maps performance.'
        };
      }

      setData(res);
    } catch (err: any) {
      console.error('Failed to load performance metrics', err);
      setData({
        status: 'NOT_CONNECTED',
        metrics: null,
        error_message: err.message || 'Google Business Profile API not connected.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine explicit telemetry state (Strict 4-state authenticity model + restricted API access state)
  const currentState: TelemetryState = 
    data?.status === 'LIVE_DATA_AVAILABLE' ? 'LIVE_DATA_AVAILABLE' :
    data?.status === 'CONNECTED_BUT_NO_DATA' ? 'CONNECTED_BUT_NO_DATA' :
    data?.status === 'API_ACCESS_NOT_APPROVED' ? 'API_ACCESS_NOT_APPROVED' :
    data?.status === 'API_ERROR' ? 'API_ERROR' :
    'NOT_CONNECTED';

  const metrics = data?.metrics;

  // Total views calculated ONLY if metrics exist, otherwise null
  const totalViews: number | null = metrics ? (
    (metrics.search_impressions_mobile || 0) + 
    (metrics.search_impressions_desktop || 0) + 
    (metrics.maps_impressions_mobile || 0) + 
    (metrics.maps_impressions_desktop || 0)
  ) : null;

  // Strict metric formatter: Unavailable states render '—', genuine zero renders '0'
  const formatMetric = (val: number | null | undefined, unit: string = ''): string => {
    if (currentState === 'NOT_CONNECTED' || currentState === 'API_ERROR' || currentState === 'API_ACCESS_NOT_APPROVED' || val === null || val === undefined) {
      return '—';
    }
    return `${val.toLocaleString()}${unit ? ' ' + unit : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Explicit Data Provenance */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Google Business Profile Performance Telemetry</h1>
            
            {/* Status Badge */}
            {currentState === 'NOT_CONNECTED' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>NOT CONNECTED</span>
              </span>
            )}
            {currentState === 'CONNECTED_BUT_NO_DATA' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>CONNECTED (ZERO INTERACTIONS)</span>
              </span>
            )}
            {currentState === 'LIVE_DATA_AVAILABLE' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>LIVE AUTHENTICATED DATA</span>
              </span>
            )}
            {currentState === 'API_ACCESS_NOT_APPROVED' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>API ACCESS PENDING GOOGLE APPROVAL</span>
              </span>
            )}
            {currentState === 'API_ERROR' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>API ERROR</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {currentState === 'NOT_CONNECTED' && (
              <span>Google Cloud OAuth credentials not authorized. Telemetry metrics remain unavailable (<span className="font-mono text-slate-300">—</span>) until connected. No mock data is presented as genuine.</span>
            )}
            {currentState === 'CONNECTED_BUT_NO_DATA' && (
              <span>Authenticated Google Business Profile API connection active. Google reports zero customer interactions during this reporting window.</span>
            )}
            {currentState === 'LIVE_DATA_AVAILABLE' && (
              <span>Verified performance telemetry powered directly by official Google Business Profile Performance API.</span>
            )}
            {currentState === 'API_ACCESS_NOT_APPROVED' && (
              <span className="text-amber-300">Google Business Profile API access is restricted and awaiting Google approval (~14 business days). See docs/GOOGLE_BUSINESS_PROFILE_API_ACCESS_APPLICATION.md. Telemetry counters remain unavailable (<span className="font-mono text-slate-300">—</span>).</span>
            )}
            {currentState === 'API_ERROR' && (
              <span className="text-rose-300">API Error: {data?.error_message || 'Failed to retrieve telemetry from Google API. Check network and OAuth permissions.'}</span>
            )}
          </p>

          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <span>Provenance: <strong className="text-slate-400">{data?.source || 'Unconnected'}</strong></span>
            <span>•</span>
            <span>Reporting: <strong className="text-slate-400">{data?.date_range || 'Past 30 Days'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Past 30 Days</span>
          </div>
          <button
            onClick={loadPerformance}
            disabled={loading}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row — Strict Unavailable vs Zero Rendering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Search & Map Views */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Search & Map Views</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatMetric(totalViews)}</div>
          <div className="text-[11px] text-slate-500 mt-2">
            {currentState === 'NOT_CONNECTED' && 'Unavailable (OAuth Not Connected)'}
            {currentState === 'API_ERROR' && 'Unavailable (API Error)'}
            {currentState === 'CONNECTED_BUT_NO_DATA' && '0 views reported by Google'}
            {currentState === 'LIVE_DATA_AVAILABLE' && 'Verified views across Search & Maps'}
          </div>
        </div>

        {/* KPI 2: Phone Calls */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Phone Calls to 9347453135</span>
            <Phone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatMetric(metrics?.call_clicks, 'Calls')}</div>
          <div className="text-[11px] text-slate-500 mt-2">
            {currentState === 'NOT_CONNECTED' && 'Unavailable (OAuth Not Connected)'}
            {currentState === 'API_ERROR' && 'Unavailable (API Error)'}
            {currentState === 'CONNECTED_BUT_NO_DATA' && '0 call clicks reported by Google'}
            {currentState === 'LIVE_DATA_AVAILABLE' && 'Customer call clicks from profile'}
          </div>
        </div>

        {/* KPI 3: Direction Requests */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Store Direction Requests</span>
            <Navigation className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatMetric(metrics?.direction_requests, 'Visits')}</div>
          <div className="text-[11px] text-slate-500 mt-2">
            {currentState === 'NOT_CONNECTED' && 'Unavailable (OAuth Not Connected)'}
            {currentState === 'API_ERROR' && 'Unavailable (API Error)'}
            {currentState === 'CONNECTED_BUT_NO_DATA' && '0 directions requested from Google Maps'}
            {currentState === 'LIVE_DATA_AVAILABLE' && 'Customer navigation requests to hub'}
          </div>
        </div>

        {/* KPI 4: Catalog & Web Clicks */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Catalog & Web Clicks</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatMetric(metrics?.website_clicks, 'Clicks')}</div>
          <div className="text-[11px] text-slate-500 mt-2">
            {currentState === 'NOT_CONNECTED' && 'Unavailable (OAuth Not Connected)'}
            {currentState === 'API_ERROR' && 'Unavailable (API Error)'}
            {currentState === 'CONNECTED_BUT_NO_DATA' && '0 web clicks reported by Google'}
            {currentState === 'LIVE_DATA_AVAILABLE' && 'Clicks to dataengineer-irfan.github.io'}
          </div>
        </div>
      </div>

      {/* Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search breakdown */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Top Search Terms Driving Profile Views</span>
          </h2>

          <div className="space-y-3">
            {currentState === 'LIVE_DATA_AVAILABLE' && data?.search_keywords_top && data.search_keywords_top.length > 0 ? (
              data.search_keywords_top.map((item: any, idx: number) => {
                const max = data.search_keywords_top[0]?.impressions || 100;
                const pct = Math.round((item.impressions / max) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">{item.term}</span>
                      <span className="font-mono text-amber-400">{item.impressions} queries</span>
                    </div>
                    <div className="w-full bg-[#070b14] rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 bg-[#070b14] border border-slate-800/80 rounded-lg text-xs text-slate-500">
                {currentState === 'NOT_CONNECTED' && 'Search query telemetry unavailable. Connect Google Business Profile API to view keywords.'}
                {currentState === 'CONNECTED_BUT_NO_DATA' && 'Zero search query records reported by Google for this 30-day reporting window.'}
                {currentState === 'API_ERROR' && 'Search query telemetry unavailable due to API error.'}
              </div>
            )}
          </div>
        </div>

        {/* Device & Platform Breakdown */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Platform & Channel Distribution</span>
          </h2>

          <div className="space-y-4">
            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Google Maps (Mobile Devices):</span>
                <span className="font-mono font-bold text-white">{formatMetric(metrics?.maps_impressions_mobile)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Google Search (Mobile Devices):</span>
                <span className="font-mono font-bold text-white">{formatMetric(metrics?.search_impressions_mobile)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Google Search (Desktop):</span>
                <span className="font-mono font-bold text-white">{formatMetric(metrics?.search_impressions_desktop)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Google Maps (Desktop):</span>
                <span className="font-mono font-bold text-white">{formatMetric(metrics?.maps_impressions_desktop)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed">
              {currentState === 'NOT_CONNECTED' && (
                <span><strong>Status:</strong> Not connected to Google API. Device breakdown counters will record customer platform origin once Google OAuth is configured.</span>
              )}
              {currentState === 'CONNECTED_BUT_NO_DATA' && (
                <span><strong>Status:</strong> Connected. Google API reports zero platform interactions during this reporting window.</span>
              )}
              {currentState === 'LIVE_DATA_AVAILABLE' && (
                <span><strong>Live Telemetry:</strong> Customer platform impressions verified from official Google Performance API.</span>
              )}
              {currentState === 'API_ERROR' && (
                <span className="text-rose-300"><strong>Status:</strong> API connection failure. Telemetry counters disabled.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Setup Card when Not Connected */}
      {currentState === 'NOT_CONNECTED' && (
        <div className="bg-[#0f172a] border border-amber-500/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">How to Stream Genuine Google Maps Telemetry for RAIS Agencies</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All telemetry metrics above strictly display <span className="font-mono text-amber-400 font-bold">—</span> because we adhere to a zero mock data guarantee. To stream genuine metrics directly from Google Maps into this dashboard:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 bg-[#070b14] border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center font-mono">1</span>
                <span>Enable Google API</span>
              </div>
              <p className="text-[11px] text-slate-400">
                In Google Cloud Console (project <strong className="text-slate-300">RAIS Growth Engine</strong>), search for and enable <strong className="text-slate-300">Google Business Profile Performance API</strong>.
              </p>
            </div>
            <div className="p-3.5 bg-[#070b14] border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center font-mono">2</span>
                <span>Connect Google Account</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authorize the Google Account that manages the listing <code className="text-amber-300">locations/17901714523973178723</code> in your Growth Engine Admin settings.
              </p>
            </div>
            <div className="p-3.5 bg-[#070b14] border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center font-mono">3</span>
                <span>Live Data Sync</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Google will automatically sync real search queries, direction requests, and phone calls to 9347453135 with daily refreshes.
              </p>
            </div>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://console.cloud.google.com/apis/library/businessprofileperformance.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>Enable Business Profile Performance API in Google Cloud</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-xs text-slate-400">
              Listing: <strong className="text-slate-200">RAIS Agencies Rayachoty (Beside Indel Money Bank)</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
