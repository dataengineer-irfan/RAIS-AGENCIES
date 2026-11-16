import React from 'react';
import { 
  Calendar, MessageSquare, UserCheck, TrendingUp, 
  ShieldCheck, AlertCircle, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';

interface OverviewProps {
  onNavigate: (tab: string) => void;
  stats: {
    totalCampaigns: number;
    pendingReviews: number;
    totalLeads: number;
    seoScore: number;
    killSwitchActive: boolean;
  };
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate, stats }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#0f172a] border border-amber-500/20 rounded-xl p-6 relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Local Growth Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            RAIS Agencies — Google Business Profile Center
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Automating scheduled B2B marketing, verified review responses, local SEO, and restaurant inquiries across Rayachoty and the 50km commercial corridor.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('calendar')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <span>Review 30-Day Campaign</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('business_info')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-all"
            >
              Edit Business Info & SKUs
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">30-Day Launch Blueprint</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">30 Posts</div>
          <div className="text-[11px] text-amber-400/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
            <span>Ready in DRAFT (Approval Required)</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Review Approval Queue</span>
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
            <span className="text-xs font-medium">B2B Leads Pipeline</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalLeads} Inquiries</div>
          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Cafes & Fast Food Outlets</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Local SEO Completeness</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.seoScore}%</div>
          <div className="text-[11px] text-purple-400/90 flex items-center gap-1">
            <span>Primary: Wholesale food store</span>
          </div>
        </div>
      </div>

      {/* Safety & Compliance Status Box */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Google Business Profile Compliance Engine</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Public Price Leaks</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic validator actively blocks specific purchase prices in public copy to protect cafe retail margins.
            </p>
          </div>
          <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Human Approval Gate</span>
            </div>
            <p className="text-[11px] text-slate-400">
              In strict accordance with Google policy, AI-generated review responses cannot be published without manual administrator authorization.
            </p>
          </div>
          <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Catalog SKU Reconciliation</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Every post must reference a verified SKU in the approved 66-item RAIS sourcing catalog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
