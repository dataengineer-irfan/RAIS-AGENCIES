import React, { useState, useEffect } from 'react';
import { Film, ExternalLink, Send, AlertCircle, Instagram, Facebook, Share2, Video, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { api, MetaStatus, YouTubeQueueItem } from '../../services/api';
import { MetaConnectCard } from './MetaConnectCard';
import { shareOrDownloadForWhatsAppStatus } from '../../utils/whatsappShare';

export const MetaPublishingView: React.FC = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [metaStatus, setMetaStatus] = useState<MetaStatus | null>(null);
  const [driveQueue, setDriveQueue] = useState<YouTubeQueueItem[]>([]);
  const [publishingMetaId, setPublishingMetaId] = useState<number | null>(null);
  const [sharingWaId, setSharingWaId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loading, setLoading] = useState(true);

  const igHandle = metaStatus?.ig_username || 'rais_agencies_frozen_foods';
  const igProfileUrl = `https://www.instagram.com/${igHandle}/`;

  const showNotice = (text: string, type: 'success' | 'error' | 'info') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 6000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [meta, queue, dbReels] = await Promise.all([
        api.getMetaStatus(),
        api.listYouTubeQueue(),
        api.listReels('ALL').catch(() => []),
      ]);
      setMetaStatus(meta);
      setDriveQueue(queue || []);
      setReels(Array.isArray(dbReels) ? dbReels : []);
    } catch {
      showNotice('Backend unavailable: unable to load Meta status or Drive queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePublishDriveMeta = async (itemId: number, platforms: string[]) => {
    setPublishingMetaId(itemId);
    try {
      const res = await api.publishMetaDriveItem(itemId, platforms);
      const q = await api.listYouTubeQueue();
      setDriveQueue(q || []);
      if (res.status === 'PARTIAL') {
        showNotice(`Partial Meta publish: ${res.errors.join(' | ')}`, 'info');
      } else {
        showNotice(`Posted to ${Object.keys(res.results).join(' & ')} live!`, 'success');
      }
    } catch (err: any) {
      showNotice(err?.message || 'Meta publish failed.', 'error');
    } finally {
      setPublishingMetaId(null);
    }
  };

  const handleShareDriveWa = async (item: YouTubeQueueItem) => {
    if (!item.drive_file_id) return;
    setSharingWaId(`drv-${item.id}`);
    try {
      const res = await shareOrDownloadForWhatsAppStatus({
        videoUrl: api.getDriveDownloadUrl(item.drive_file_id),
        filename: item.file_name,
        captionText: `${item.video_title}\n\n${item.description}\n\nOrder WhatsApp: 9347453135`,
        headers: api.getAuthHeaders(),
      });
      if (res.method !== 'cancelled') showNotice(res.message, 'success');
    } catch (err: any) {
      showNotice(err?.message || 'WhatsApp share failed.', 'error');
    } finally {
      setSharingWaId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d162d] to-[#121d3b] border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white">Instagram &amp; Facebook Reels Publishing Hub</h2>
              {metaStatus?.connected ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Meta Graph API Connected ({metaStatus.page_name || metaStatus.page_id})</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  <span>Meta Token Not Connected — Connect Below</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated Meta Graph API v21.0 publishing for Instagram handle <span className="text-pink-400 font-semibold font-mono">@{igHandle}</span> &amp; your linked Facebook Page (Neon PostgreSQL backed)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href={igProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs shadow transition-all"
          >
            <span>@{igHandle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Asset & Dispatch Summary Grid (Live Neon + Graph API Counters) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0a0f1d] border border-cyan-500/20">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Target Handle</div>
          <div className="text-base font-bold text-white mt-1 truncate">@{igHandle}</div>
          <div className="text-[11px] text-pink-400 font-mono mt-0.5 truncate">IG ID: {metaStatus?.ig_user_id || 'Pending Link'}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0f1d] border border-cyan-500/20">
          <div className="text-[11px] font-mono text-slate-400 uppercase">IG Reels Auto-Posted</div>
          <div className="text-base font-bold text-emerald-400 mt-1">{driveQueue.filter(d => d.ig_status === 'PUBLISHED').length} Live Reels</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified Graph API Permalinks</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0f1d] border border-cyan-500/20">
          <div className="text-[11px] font-mono text-slate-400 uppercase">FB Page Video Reels</div>
          <div className="text-base font-bold text-blue-300 mt-1">{driveQueue.filter(d => d.fb_status === 'PUBLISHED').length} Live · {driveQueue.filter(d => d.ig_status !== 'PUBLISHED' || d.fb_status !== 'PUBLISHED').length} Pending</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{driveQueue.length} Total Drive Clips</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0f1d] border border-cyan-500/20">
          <div className="text-[11px] font-mono text-slate-400 uppercase">API Automation</div>
          <div className={`text-base font-bold mt-1 ${metaStatus?.connected ? 'text-emerald-400' : 'text-amber-300'}`}>
            {metaStatus?.connected ? 'Graph API v21.0 Live' : 'Token Required'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            {metaStatus?.connected
              ? `FB Page + @${igHandle} Linked`
              : 'Paste Meta Page Token below'}
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
              : notice.type === 'error'
              ? 'bg-rose-950/60 border-rose-500/30 text-rose-300'
              : 'bg-blue-950/60 border-blue-500/30 text-blue-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{notice.text}</span>
        </div>
      )}

      {/* Meta Token Connect Card */}
      <MetaConnectCard
        metaStatus={metaStatus}
        onStatusChanged={setMetaStatus}
        onNotice={showNotice}
      />

      {/* Google Drive Videos Ready for Auto-Publish to Instagram Reels & Facebook Page */}
      <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-pink-500/20 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-pink-400" />
              <span>Google Drive Video Cross-Posting (Instagram Reels + Facebook Page + WA Status)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Same Google Drive promotion videos auto-synced in YouTube Studio — publish straight to Instagram Reels &amp; your linked Facebook Page.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {driveQueue.length} Drive Videos
          </span>
        </div>

        {driveQueue.length === 0 ? (
          <div className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-800 rounded-xl">
            No Google Drive videos queued yet. Open <strong className="text-white">Drive -&gt; YT, IG &amp; FB</strong> and click <strong className="text-white">Sync Drive Now</strong>.
          </div>
        ) : (
          <div className="space-y-2.5">
            {driveQueue.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{item.video_title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {item.file_name} · {item.product_name}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {item.ig_url ? (
                      <a href={item.ig_url} target="_blank" rel="noreferrer" className="text-[11px] text-pink-300 underline flex items-center gap-1">
                        <Instagram className="w-3 h-3" /> IG Live <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500">IG: {item.ig_status || 'PENDING'}</span>
                    )}
                    {item.fb_url ? (
                      <a href={item.fb_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-300 underline flex items-center gap-1">
                        <Facebook className="w-3 h-3" /> FB Live <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500">FB: {item.fb_status || 'PENDING'}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {item.drive_file_id && (
                    <button
                      onClick={() => handleShareDriveWa(item)}
                      disabled={sharingWaId === `drv-${item.id}`}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{sharingWaId === `drv-${item.id}` ? 'Loading...' : 'WA Status'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handlePublishDriveMeta(item.id, ['instagram'])}
                    disabled={publishingMetaId === item.id}
                    className="px-2.5 py-1.5 rounded-lg bg-pink-600/80 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>IG Reel</span>
                  </button>
                  <button
                    onClick={() => handlePublishDriveMeta(item.id, ['facebook'])}
                    disabled={publishingMetaId === item.id}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>FB Page</span>
                  </button>
                  <button
                    onClick={() => handlePublishDriveMeta(item.id, ['instagram', 'facebook'])}
                    disabled={publishingMetaId === item.id}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-blue-600 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    {publishingMetaId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Post IG + FB</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Neon-Backed Persistent Reels Assets Summary */}
      <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Persistent Reels Studio Records ({reels.length} in Neon PostgreSQL)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              All Reel assets are stored in Neon PostgreSQL (`reels_assets`). Manage creation, approval gates, and schedules in the <strong className="text-white">Reels Studio</strong> tab.
            </p>
          </div>
        </div>
        {reels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {reels.slice(0, 6).map((r) => (
              <div key={r.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-white truncate">{r.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">{r.product_name || r.product_sku || r.theme}</div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] border border-slate-700 bg-slate-900 text-cyan-300 flex-shrink-0">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
