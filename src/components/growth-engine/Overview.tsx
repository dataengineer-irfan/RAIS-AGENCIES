import React from 'react';
import { 
  Calendar, MessageSquare, UserCheck, TrendingUp, 
  ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Film, Send, Globe, ExternalLink
} from 'lucide-react';

export interface OverviewStats {
  totalCampaigns: number;
  pendingReviews: number;
  totalLeads: number;
  seoScore: number | null;
  killSwitchActive: boolean;
  googleConnected: boolean;
  googleStatusMode: string;
  publishedReelsCount: number;
  totalReelsCount: number;
  ytPublishedCount: number;
  igPublishedCount: number;
  fbPublishedCount: number;
  queuedVideosCount: number;
  metaConnected: boolean;
  metaUsername: string;
  autoPilotEnabled: boolean;
  geminiConnected: boolean;
}

interface OverviewProps {
  onNavigate: (tab: string) => void;
  stats: OverviewStats;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate, stats }) => {
  const igHandle = stats.metaUsername || 'rais_agencies_frozen_foods';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#0f172a] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Production Cloud Automation (Neon Postgres + Render + Cron)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            RAIS Agencies — Wholesale Automation &amp; Growth Command Center
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Unified B2B operations console automating Google Drive video ingestion, Gemini Vision hooks, YouTube Shorts, Instagram Reels (@{igHandle}), Facebook Page Reels, and Neon Postgres B2B lead &amp; telemetry tracking.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('youtube_drive')}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-pink-500/20 flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video Auto-Pilot Queue ({stats.totalReelsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('google')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <Globe className={`w-3.5 h-3.5 ${stats.googleConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>Google Business Profile ({stats.googleConnected ? 'Connected' : 'Setup / API Pending'})</span>
            </button>
            <button
              onClick={() => onNavigate('meta_publishing')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-pink-400" />
              <span>Meta Graph API ({stats.metaConnected ? 'Live' : 'Connect Token'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Engine Pillars: Google + Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pillar 1: Google Business Suite */}
        <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-cyan-500/20 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Business Profile &amp; Local SEO</h3>
                <p className="text-[11px] text-slate-400">Rayachoty Wholesale Hub (locations/17901714523973178723)</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
              stats.googleConnected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {stats.googleConnected ? 'Connected' : stats.googleStatusMode}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">SEO Audit</div>
              <div className="text-base font-bold text-cyan-400 mt-0.5">
                {stats.seoScore !== null ? `${stats.seoScore}%` : '—'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Reviews Queue</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">{stats.pendingReviews} Pending</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Campaigns</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{stats.totalCampaigns}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onNavigate('reviews')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Moderate Reviews Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('seo')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
            >
              <span>Keywords &amp; Competitors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pillar 2: Live Drive -> YT + IG + FB Auto-Pilot */}
        <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-pink-500/20 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Drive -&gt; YouTube, Instagram &amp; FB Auto-Pilot</h3>
                <p className="text-[11px] text-slate-400">Live Channel: @{igHandle} · Gemini AI: {stats.geminiConnected ? 'ACTIVE' : 'Fallback'}</p>
              </div>
            </div>
            <a
              href={`https://www.instagram.com/${igHandle}/`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${
                stats.metaConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              <span>@{igHandle}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Published Live</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">YT {stats.ytPublishedCount} · IG {stats.igPublishedCount} · FB {stats.fbPublishedCount}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Drive Queue</div>
              <div className="text-base font-bold text-amber-300 mt-0.5">{stats.queuedVideosCount} Pending</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Pipeline Mode</div>
              <div className={`text-sm font-bold mt-0.5 ${stats.killSwitchActive ? 'text-rose-400' : 'text-cyan-300'}`}>
                {stats.killSwitchActive ? 'Halted' : stats.autoPilotEnabled ? 'Cloud Auto-Pilot' : 'Daily IST'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onNavigate('youtube_drive')}
              className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
            >
              <span>Open Video Pipeline Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('ga4_traffic')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
            >
              <span>Live Views &amp; Social Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Cloud Video Pipeline</span>
            <Film className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalReelsCount} Synced Clips</div>
          <div className="text-[11px] text-pink-400/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>{stats.igPublishedCount} IG · {stats.ytPublishedCount} YT · {stats.queuedVideosCount} Queued</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Google Review Approval Queue</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.pendingReviews} Pending</div>
          <div className="text-[11px] text-cyan-400/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
            <span>Mandatory 1-Click Human Approval</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Wholesale Leads CRM</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalLeads} Inquiries</div>
          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Captured from Backend &amp; Quote Form</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Local SEO Completeness</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.seoScore !== null ? `${stats.seoScore}%` : '—'}
          </div>
          <div className="text-[11px] text-purple-400/90 flex items-center gap-1">
            <span>{stats.seoScore !== null ? 'Verified via Backend Audit' : 'Backend Audit Unavailable'}</span>
          </div>
        </div>
      </div>

      {/* Safety & Compliance Status Box */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Dual Platform Compliance &amp; Margin Protection Engine</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Public Price Leaks</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic validator actively blocks specific purchase prices in public copy &amp; comments to protect cafe retail margins.
            </p>
          </div>
          <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Human Approval Gate</span>
            </div>
            <p className="text-[11px] text-slate-400">
              In strict accordance with Google &amp; Meta policy, AI-generated review responses and Reel dispatches require manual authorization.
            </p>
          </div>
          <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Catalog SKU Reconciliation</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Every post and automated reply strictly references verified products in the official 90-SKU RAIS sourcing catalog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
