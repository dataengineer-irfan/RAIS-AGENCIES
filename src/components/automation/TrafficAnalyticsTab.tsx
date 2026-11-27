import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import { api } from '../../services/api';
import {
  Eye, TrendingUp, Globe,
  Instagram, MessageCircle, BarChart3, ArrowUpRight,
  Check, Save, RefreshCw, ShieldCheck, Video, Facebook, ExternalLink
} from 'lucide-react';

export const TrafficAnalyticsTab: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [social, setSocial] = useState<any>(null);
  const [ga4Data, setGa4Data] = useState<any>(null);
  const [gscData, setGscData] = useState<any>(null);
  const [ga4Input, setGa4Input] = useState<string>('');
  const [ga4Saved, setGa4Saved] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadData();
    setGa4Input(AnalyticsService.getGA4MeasurementId());
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [dbSummary, socialRes, ga4Res, gscRes] = await Promise.all([
        api.getAnalyticsSummary(30).catch(() => null),
        api.getSocialAnalytics().catch(() => null),
        api.getGa4Analytics(30).catch(() => null),
        api.getSearchConsoleData().catch(() => null),
      ]);
      setSummary(dbSummary);
      setSocial(socialRes);
      setGa4Data(ga4Res);
      setGscData(gscRes);
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalPageViews: number | null = summary ? (summary.page_views ?? 0) : null;
  const uniqueVisitors: number | null = summary ? (summary.unique_visitors ?? 0) : null;
  const catalogueOpens: number | null = summary ? (summary.catalogue_opens ?? 0) : null;
  const whatsappClicks: number | null = summary ? (summary.whatsapp_clicks ?? 0) : null;
  const quoteAdds: number | null = summary ? (summary.quote_adds ?? 0) : null;
  const sourceMap: Record<string, number> = summary?.sources || {};
  const totalEvents = summary?.total_events || 0;
  const topProducts: Array<{ name: string; count: number }> = summary?.top_products || [];
  const socialSummary = social?.summary || null;
  const socialVideos: any[] = social?.videos || [];

  const handleSaveGA4 = () => {
    AnalyticsService.setGA4MeasurementId(ga4Input);
    setGa4Saved(true);
    setTimeout(() => setGa4Saved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* TOP HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-1.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Neon Cloud Telemetry + Live YouTube &amp; Meta Graph Stats</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">
            Multi-Device Storefront Traffic &amp; Published Video Performance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregates real storefront visitor interactions persisted in Neon Postgres alongside live views, likes &amp; comments fetched directly from YouTube Data API v3 and Meta Graph API v21.0.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f1c3f] border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Live API Metrics</span>
        </button>
      </div>

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Page Views (30d DB)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {totalPageViews !== null ? totalPageViews.toLocaleString() : '—'}
          </div>
          <p className="text-[11px] text-cyan-300/80 mt-1 font-semibold">
            {uniqueVisitors !== null ? `${uniqueVisitors} unique visitor(s)` : 'Backend summary unavailable'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-amber-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalogue Opens</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {catalogueOpens !== null ? catalogueOpens.toLocaleString() : '—'}
          </div>
          <p className="text-[11px] text-amber-300/80 mt-1 font-semibold">
            {summary ? 'Multi-device Neon event log' : 'Backend unavailable'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-pink-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Video Engagement</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
              <Instagram className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {socialSummary ? (
              <>
                {(socialSummary.youtube_views + socialSummary.facebook_views).toLocaleString()}{' '}
                <span className="text-sm font-normal text-slate-400">views</span>
              </>
            ) : '—'}
          </div>
          <p className="text-[11px] text-pink-300/80 mt-1 font-semibold">
            {socialSummary
              ? `IG Likes: ${socialSummary.instagram_likes} · Comments: ${socialSummary.instagram_comments}`
              : 'YouTube & Meta API unavailable'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-emerald-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp &amp; Quote Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {whatsappClicks !== null && quoteAdds !== null ? (whatsappClicks + quoteAdds).toLocaleString() : '—'}
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1 font-semibold">
            {whatsappClicks !== null ? `${whatsappClicks} WA inquiries · ${quoteAdds || 0} quote adds` : 'Backend unavailable'}
          </p>
        </div>
      </div>

      {/* GA4 & SEARCH CONSOLE API STATUS PROVENANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1c3f]/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Google Analytics 4 (Data API v1beta)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
              {ga4Data?.status || 'UNAVAILABLE'}
            </span>
          </div>
          {ga4Data?.metrics ? (
            <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-white">
              <div><div className="text-[10px] text-slate-400">Sessions</div>{ga4Data.metrics.sessions}</div>
              <div><div className="text-[10px] text-slate-400">Users</div>{ga4Data.metrics.users}</div>
              <div><div className="text-[10px] text-slate-400">Views</div>{ga4Data.metrics.page_views}</div>
              <div><div className="text-[10px] text-slate-400">Conv</div>{ga4Data.metrics.conversions}</div>
            </div>
          ) : (
            <p className="text-[11px] text-amber-300">
              Metrics: — ({ga4Data?.message || 'GA4 Data API awaiting property ID / OAuth authorization.'})
            </p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-[#0f1c3f]/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Google Search Console (Search Analytics)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
              {gscData?.status || 'UNAVAILABLE'}
            </span>
          </div>
          {gscData?.rows?.length > 0 ? (
            <div className="text-[11px] text-emerald-300">
              {gscData.rows.length} search queries indexed from Search Console.
            </div>
          ) : (
            <p className="text-[11px] text-amber-300">
              Metrics: — ({gscData?.message || 'Search Console webmasters.readonly OAuth scope required.'})
            </p>
          )}
        </div>
      </div>

      {/* TWO COLUMN GRID: TRAFFIC SOURCES & TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Visitor Acquisition Channel (30d)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Neon Postgres Log</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Instagram Bio / Reel Traffic', count: sourceMap['Instagram'] || 0, color: 'bg-pink-500', icon: '📸' },
              { label: 'WhatsApp Broadcasts & Direct Shares', count: sourceMap['WhatsApp'] || 0, color: 'bg-emerald-500', icon: '💬' },
              { label: 'Catalogue HTML Backlinks', count: sourceMap['Catalogue Link'] || 0, color: 'bg-amber-500', icon: '📄' },
              { label: 'Direct Search / QR Codes', count: sourceMap['Google / Direct'] || 0, color: 'bg-blue-500', icon: '🔍' },
            ].map((src, i) => {
              const max = Math.max(totalEvents, 1);
              const pct = Math.min(100, Math.round((src.count / max) * 100));
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-semibold flex items-center gap-2">
                      <span>{src.icon}</span>
                      <span>{src.label}</span>
                    </span>
                    <span className="text-white font-mono font-bold">
                      {summary ? `${src.count} events (${pct}%)` : '—'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className={`h-full ${src.color} rounded-full transition-all duration-500`} style={{ width: `${src.count > 0 ? Math.max(pct, 4) : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Highest Viewed Wholesale SKUs (30d)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Cross-Device Top Demand</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {topProducts.length > 0 ? (
              topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-[10px]">
                      #{i + 1}
                    </span>
                    <span className="font-bold text-white">{p.name}</span>
                  </div>
                  <span className="text-cyan-300 font-mono font-black">{p.count} interactions</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="text-slate-500 text-sm font-semibold">No cross-device SKU clicks logged yet</div>
                <div className="text-slate-600 text-xs">Real customer SKU views &amp; quote additions appear here automatically.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIVE PUBLISHED SOCIAL TELEMETRY TABLE (AUTO-FETCHED FROM YT + IG + FB APIS) */}
      <div className="p-6 rounded-2xl bg-[#0f1c3f]/90 border border-pink-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-pink-500/20">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-pink-400" />
              <span>Live Multi-Platform Video Stats (YT Shorts + IG Reels + FB Page)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically fetched via YouTube Data API v3 and Meta Graph API v21.0 — zero manual entry.
              {social?.yt_telemetry_note ? ` (${social.yt_telemetry_note})` : ''}
            </p>
          </div>
          <span className="text-xs text-pink-300 font-mono bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/30">
            @rais_agencies_frozen_foods
          </span>
        </div>

        {socialVideos.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-700 rounded-xl">
            No published Drive videos found yet. Publish a clip in <strong>Drive -&gt; YT, IG &amp; FB</strong> to see live API view counts here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Published Video</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-right">YT Shorts</th>
                  <th className="py-2.5 px-3 text-right">IG Reel</th>
                  <th className="py-2.5 px-3 text-right">FB Reel</th>
                  <th className="py-2.5 px-3 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {socialVideos.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-200 max-w-[240px] truncate">{v.video_title}</td>
                    <td className="py-3 px-3 text-slate-400">{v.product_name || '—'}</td>
                    <td className="py-3 px-3 text-right font-mono text-red-300">
                      {v.youtube ? `${v.youtube.views} views · ${v.youtube.likes} ❤` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-pink-300">
                      {v.instagram
                        ? `${v.instagram.plays !== null ? `${v.instagram.plays} plays · ` : ''}${v.instagram.likes} ❤ · ${v.instagram.comments} 💬`
                        : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-blue-300">
                      {v.facebook ? `${v.facebook.views} views · ${v.facebook.likes} ❤` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {v.youtube_url && (
                          <a href={v.youtube_url} target="_blank" rel="noreferrer" className="text-red-300 hover:underline flex items-center gap-0.5">
                            YT <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {v.ig_url && (
                          <a href={v.ig_url} target="_blank" rel="noreferrer" className="text-pink-300 hover:underline flex items-center gap-0.5">
                            IG <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {v.fb_url && (
                          <a href={v.fb_url} target="_blank" rel="noreferrer" className="text-blue-300 hover:underline flex items-center gap-0.5">
                            <Facebook className="w-3 h-3" /> <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* GOOGLE ANALYTICS 4 (GA4) INTEGRATION CARD */}
      <div className="p-6 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Official Google Analytics (GA4) Tag</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Connected GA4 stream for city-level (Rayachoty, Kadapa, Annamayya) and device breakdowns.
            </p>
          </div>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-300 hover:text-white underline font-bold whitespace-nowrap inline-flex items-center gap-1"
          >
            <span>Open Google Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <input
            type="text"
            value={ga4Input}
            onChange={(e) => setGa4Input(e.target.value)}
            placeholder="e.g. G-XXXXXXXXXX"
            className="w-full sm:w-80 px-4 py-2.5 bg-[#081026] border border-cyan-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            onClick={handleSaveGA4}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            {ga4Saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{ga4Saved ? 'Connected & Active!' : 'Save & Connect GA4'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
