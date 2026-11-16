import React from 'react';
import { 
  LayoutDashboard, Globe, Sparkles, Calendar, MessageSquare, 
  Search, Users, BarChart3, Image, UserCheck, ShieldAlert, Settings, AlertTriangle,
  ArrowLeft, LogOut
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  killSwitchActive: boolean;
  onBackToHome?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  killSwitchActive,
  onBackToHome,
  onLogout
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'google', label: 'Google Connection', icon: Globe },
    { id: 'content', label: 'Content Studio', icon: Sparkles },
    { id: 'calendar', label: 'Publishing Calendar', icon: Calendar },
    { id: 'reviews', label: 'Reviews Inbox', icon: MessageSquare },
    { id: 'seo', label: 'Local SEO', icon: Search },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'leads', label: 'B2B Leads', icon: UserCheck },
    { id: 'automation', label: 'Automation & Safety', icon: ShieldAlert },
    { id: 'business_info', label: 'Business Profile & SKUs', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-amber-500/20">
            R
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-wider flex items-center gap-1.5">
              RAIS <span className="text-amber-400 text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">ENGINE</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Rayachoty B2B Automation</div>
          </div>
        </div>

        {/* Storefront Navigation Buttons */}
        <div className="mt-3.5 flex items-center gap-1.5">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-all"
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
          <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded px-2.5 py-1.5 flex items-center gap-2 text-red-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
            <span>KILL SWITCH ACTIVE</span>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col gap-1 bg-[#070b14]/50">
        <div className="flex justify-between items-center">
          <span>Hub:</span>
          <span className="text-slate-300 font-mono">Beside Indel Bank</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Verified Phone:</span>
          <span className="text-amber-400 font-mono font-semibold">9347453135</span>
        </div>
      </div>
    </aside>
  );
};
