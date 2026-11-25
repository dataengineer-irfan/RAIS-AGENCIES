import React from 'react';
import { 
  LayoutDashboard, Globe, Sparkles, MessageSquare, 
  Search, Users, BarChart3, Image, UserCheck, ShieldAlert, Settings, AlertTriangle,
  ArrowLeft, LogOut, Film, Send, CheckCircle2, Video
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  killSwitchActive: boolean;
  googleConnected?: boolean;
  totalReelsCount?: number;
  onBackToHome?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  killSwitchActive,
  googleConnected = false,
  totalReelsCount = 30,
  onBackToHome,
  onLogout
}) => {
  const sections = [
    {
      heading: 'GOOGLE BUSINESS SUITE',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'google', label: 'Google Business Profile', icon: Globe, badge: googleConnected ? 'Connected' : 'Setup' },
        { id: 'reviews', label: 'Google Reviews Inbox', icon: MessageSquare },
        { id: 'seo', label: 'Local SEO & Keywords', icon: Search },
        { id: 'competitors', label: 'Competitor Tracker', icon: Users },
        { id: 'analytics', label: 'GMB Maps Telemetry', icon: BarChart3 },
        { id: 'ga4_traffic', label: 'Google Analytics (GA4)', icon: CheckCircle2, badge: 'G-LX7011WRHR' }
      ]
    },
    {
      heading: 'VIDEO & OUTREACH TOOLS',
      items: [
        { id: 'reels', label: 'Reels Video Studio', icon: Film, badge: `${totalReelsCount} MP4s` },
        { id: 'meta_publishing', label: 'Instagram & FB Dispatch', icon: Send, badge: '@raisfrozenfoods' },
        { id: 'youtube_drive', label: 'Drive -> YT, IG & FB', icon: Video, badge: 'Multi-Post' },
        { id: 'enquiries', label: 'WhatsApp B2B Outreach', icon: MessageSquare },
        { id: 'content', label: 'Content Studio & Promos', icon: Sparkles }
      ]
    },
    {
      heading: 'B2B DEPOT MANAGEMENT',
      items: [
        { id: 'leads', label: 'B2B Leads CRM', icon: UserCheck },
        { id: 'media', label: 'Media Library', icon: Image },
        { id: 'business_info', label: 'Store Info & 90 SKUs', icon: Settings },
        { id: 'automation', label: 'System Safety & Logs', icon: ShieldAlert }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-[#0a0f1d] border-r border-slate-800 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-amber-500/20 flex-shrink-0">
            R
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wider flex items-center gap-1.5">
              RAIS <span className="text-amber-400 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">ENGINE</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Rayachoty B2B Automation Suite</div>
          </div>
        </div>

        {/* Storefront Navigation Buttons */}
        <div className="mt-3 flex items-center gap-1.5">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-all shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-semibold border border-rose-500/20 transition-all"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {killSwitchActive && (
          <div className="mt-2.5 bg-red-500/10 border border-red-500/30 rounded px-2 py-1 flex items-center gap-2 text-red-400 text-[11px] font-semibold">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 animate-pulse" />
            <span>KILL SWITCH ACTIVE</span>
          </div>
        )}
      </div>

      {/* Nav List Grouped by Suite */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[9px] font-mono font-bold text-slate-400 tracking-wider">
              {section.heading}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                      item.badge === 'Connected' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      item.badge === 'Setup' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      item.badge.includes('MP4') ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800 text-[10px] text-slate-400 flex flex-col gap-1 bg-[#070b14]/50">
        <div className="flex justify-between items-center">
          <span>Depot Hub:</span>
          <span className="text-slate-300 font-mono">Beside Indel Bank</span>
        </div>
        <div className="flex justify-between items-center">
          <span>WhatsApp Line:</span>
          <span className="text-amber-400 font-mono font-semibold">9347453135</span>
        </div>
      </div>
    </aside>
  );
};
