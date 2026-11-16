import React, { useState } from 'react';
import { ReelCalendarItem } from '../../data/automationTypes';
import { AutomationStorage } from '../../services/automationStorage';
import { ReelVideoPreview } from '../automation/ReelVideoPreview';
import { InstagramPublisher } from '../../services/instagramPublisher';
import { Film, Check } from 'lucide-react';

export const ReelsStudioView: React.FC = () => {
  const [reels, setReels] = useState<ReelCalendarItem[]>(() => AutomationStorage.getReels());
  const [selectedReelId, setSelectedReelId] = useState<string>('reel-day-01');
  const [themeFilter, setThemeFilter] = useState<string>('ALL');

  const selectedReel = reels.find(r => r.id === selectedReelId) || reels[0];

  const handleApproveReel = (reel: ReelCalendarItem) => {
    const updated: ReelCalendarItem = {
      ...reel,
      status: 'approved',
      approvedBy: 'Wholesale Depot Lead',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    AutomationStorage.updateReel(updated);
    setReels(AutomationStorage.getReels());
  };

  const handlePublishReel = async (reel: ReelCalendarItem) => {
    await InstagramPublisher.publishReel(reel);
    setReels(AutomationStorage.getReels());
  };

  const filteredReels = themeFilter === 'ALL'
    ? reels
    : reels.filter(r => r.theme === themeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span>30-Day Instagram Reels Production Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official 9:16 vertical commercial video assets produced for @raisfrozenfoods with verified Telugu audio & overlays.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 font-mono">
            30 Masters Ready
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
            {reels.filter(r => r.status === 'published').length} Published Live
          </span>
        </div>
      </div>

      {/* Theme Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0f1c3f]/80 border border-cyan-500/20">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Theme:</span>
          {[
            { id: 'ALL', label: 'All 30 Days' },
            { id: 'frozen_products', label: 'Frozen Snacks' },
            { id: 'packaging_supplies', label: 'Packaging' },
            { id: 'product_education', label: 'Education' },
            { id: 'storage_guidance', label: '-18°C Storage' },
            { id: 'wholesale_enquiries', label: 'Wholesale Trade' },
            { id: 'business_intro', label: 'Depot Intro' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setThemeFilter(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                themeFilter === t.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-[#081026] text-slate-300 hover:text-white border border-cyan-500/20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredReels.length} Reels
        </div>
      </div>

      {/* Main Studio: Reel Preview + Day List Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 30-Day Calendar Rail */}
        <div className="lg:col-span-5 max-h-[750px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
          {filteredReels.map((reel) => {
            const isSelected = selectedReel ? reel.id === selectedReel.id : false;
            return (
              <div
                key={reel.id}
                onClick={() => setSelectedReelId(reel.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#0f1c3f] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                    : 'bg-[#0f1c3f]/50 border-cyan-500/15 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono font-bold text-amber-300">DAY {reel.dayNumber} · {reel.scheduledDate}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    reel.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                    reel.status === 'approved' ? 'bg-cyan-500/20 text-cyan-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {reel.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-tight">
                  {reel.title}
                </h4>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                  <span className="font-semibold text-cyan-300">{reel.brand}</span>
                  <span className="text-slate-500">·</span>
                  <span className="truncate">{reel.productName}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Reel 9:16 Previewer & Script Details */}
        <div className="lg:col-span-7">
          {selectedReel ? (
            <ReelVideoPreview
              reel={selectedReel}
              onApprove={handleApproveReel}
              onSchedule={handlePublishReel}
            />
          ) : (
            <div className="p-8 rounded-2xl bg-[#0f1c3f]/50 border border-cyan-500/20 text-center text-slate-400">
              Select a Reel from the calendar to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
