import React, { useState, useEffect } from 'react';
import { ReelCalendarItem } from '../../data/automationTypes';
import { AutomationStorage } from '../../services/automationStorage';
import { InstagramPublisher } from '../../services/instagramPublisher';
import { Film, Check, ExternalLink, Send, Download, AlertCircle, Copy, Instagram, Facebook, Share2, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { api, MetaStatus, YouTubeQueueItem } from '../../services/api';
import { MetaConnectCard } from './MetaConnectCard';
import { shareOrDownloadForWhatsAppStatus } from '../../utils/whatsappShare';

export const MetaPublishingView: React.FC = () => {
  const [reels, setReels] = useState<ReelCalendarItem[]>(() => AutomationStorage.getReels());
  const [metaStatus, setMetaStatus] = useState<MetaStatus | null>(null);
  const [driveQueue, setDriveQueue] = useState<YouTubeQueueItem[]>([]);
  const [publishingMetaId, setPublishingMetaId] = useState<number | null>(null);
  const [sharingWaId, setSharingWaId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [manualPublishReel, setManualPublishReel] = useState<ReelCalendarItem | null>(null);
  const [manualReelUrl, setManualReelUrl] = useState<string>('');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [showLegacyArchive, setShowLegacyArchive] = useState(false);

  const igHandle = metaStatus?.ig_username || 'rais_agencies_frozen_foods';
  const igProfileUrl = `https://www.instagram.com/${igHandle}/`;

  const showNotice = (text: string, type: 'success' | 'error' | 'info') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 6000);
  };

  const loadData = async () => {
    setReels(AutomationStorage.getReels());
    try {
      const [meta, queue] = await Promise.all([
        api.getMetaStatus(),
        api.listYouTubeQueue(),
      ]);
      setMetaStatus(meta);
      setDriveQueue(queue || []);
    } catch {
      // Keep local reels functional even if backend offline
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

  const handleShareCompiledReelWa = async (reel: ReelCalendarItem) => {
    const mediaUrl = reel.videoSpecs?.mediaUrl;
    if (!mediaUrl) return;
    setSharingWaId(`reel-${reel.id}`);
    try {
      const res = await shareOrDownloadForWhatsAppStatus({
        videoUrl: mediaUrl,
        filename: `RAIS_Reel_${reel.id}.mp4`,
        captionText: `${reel.caption}\n\n${reel.hashtags.join(' ')}`,
      });
      if (res.method !== 'cancelled') showNotice(res.message, 'success');
    } catch (err: any) {
      showNotice(err?.message || 'WhatsApp Status share failed.', 'error');
    } finally {
      setSharingWaId(null);
    }
  };

  const openPublishPack = (reel: ReelCalendarItem) => {
    setManualPublishReel(reel);
    setManualReelUrl(reel.instagramMediaUrl || '');
  };

  const handleConfirmManualPublish = async (reel: ReelCalendarItem) => {
    await InstagramPublisher.publishReel(reel, true, manualReelUrl);
    setManualPublishReel(null);
    setManualReelUrl('');
    loadData();
  };

  const copyCaptionToClipboard = (reel: ReelCalendarItem) => {
    const fullText = `${reel.caption}\n\n${reel.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const publishedCount = reels.filter(r => r.status === 'published').length;
  const pendingCount = reels.filter(r => r.status !== 'published').length;

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
              Automated Meta Graph API v21.0 publishing for Instagram handle <span className="text-pink-400 font-semibold font-mono">@{igHandle}</span> &amp; your linked Facebook Page
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={igProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs shadow transition-all"
          >
            <span>@{igHandle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://business.facebook.com/creatorstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            <span>Meta Business Suite</span>
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

      {/* Collapsible Optional Pre-Rendered Local Reels Templates (Legacy Archive) */}
      <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Film className="w-4 h-4 text-slate-400" />
              <span>Pre-Rendered Local MP4 Promo Archive ({reels.length} Templates)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Optional offline template MP4 downloads for manual WhatsApp Status sharing (automated Drive clips above handle Graph API auto-posting).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLegacyArchive(!showLegacyArchive)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 self-start sm:self-auto"
          >
            {showLegacyArchive ? 'Hide Local Archive' : `Show Local Archive (${pendingCount} Pending)`}
          </button>
        </div>

        {showLegacyArchive && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f172a] text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Title &amp; Product</th>
                  <th className="py-3 px-4">Theme</th>
                  <th className="py-3 px-4">CTA Keyword</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 bg-[#070b14]/50">
                {reels.map((reel) => (
                  <tr key={reel.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">Day {reel.dayNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{reel.title}</div>
                      <div className="text-[11px] text-slate-400">{reel.brand} · {reel.productName}</div>
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-mono text-cyan-300">{reel.theme}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">"{reel.ctaKeyword}"</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 font-mono ${
                        reel.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        reel.status === 'approved' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {reel.status === 'published' && <Check className="w-3 h-3 inline" />}
                        <span>{reel.status === 'published' ? 'Published Live' : reel.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {reel.instagramMediaUrl ? (
                        <a
                          href={reel.instagramMediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white font-bold text-[11px] transition-all shadow"
                        >
                          <span>View Live Reel</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          onClick={() => openPublishPack(reel)}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-all shadow hover:scale-[1.02]"
                        >
                          Download / Pack
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANUAL PUBLISHING WIZARD MODAL */}
      {manualPublishReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d162d] border border-cyan-400/60 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Manual Publishing Pack · Day {manualPublishReel.dayNumber}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{manualPublishReel.title}</h3>
              </div>
              <button 
                onClick={() => setManualPublishReel(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#070b14] border border-cyan-500/20 space-y-2">
                <span className="font-bold text-cyan-300 block uppercase tracking-wider text-[11px]">
                  Dispatch Instructions:
                </span>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 leading-relaxed">
                  <li>Download the 9:16 vertical video asset or copy the high-res poster below.</li>
                  <li>Copy the pre-formatted Telugu caption with hashtags.</li>
                  <li>Open Instagram (<strong className="text-white">@raisfrozenfoods</strong>) or Meta Business Suite.</li>
                  <li>Upload video, paste caption, and publish as a vertical Reel.</li>
                  <li>Click <strong className="text-emerald-400">"Confirm Published"</strong> below to record this dispatch in the immutable system audit log.</li>
                </ol>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-300 uppercase text-[11px] font-mono">Pre-Formatted Caption &amp; Hashtags:</span>
                  <button
                    onClick={() => copyCaptionToClipboard(manualPublishReel)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={`${manualPublishReel.caption}\n\n${manualPublishReel.hashtags.join(' ')}`}
                  className="w-full p-3 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Audio Track:</div>
                  <div className="font-semibold text-white">{manualPublishReel.videoSpecs?.audioMood || 'Rayalaseema Upbeat Rhythm'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-mono">Call to Action:</div>
                  <div className="font-bold text-amber-400 font-mono">"{manualPublishReel.ctaKeyword}"</div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase text-[11px] font-mono block mb-1.5">
                  Published Instagram Reel URL (Optional — Paste after posting):
                </label>
                <input
                  type="url"
                  value={manualReelUrl}
                  onChange={(e) => setManualReelUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full p-2.5 bg-[#070b14] border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  {manualPublishReel.videoSpecs?.mediaUrl && (
                    <>
                      <a
                        href={manualPublishReel.videoSpecs.mediaUrl}
                        download={`RAIS_Reel_${manualPublishReel.id}.mp4`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download MP4</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleShareCompiledReelWa(manualPublishReel)}
                        disabled={sharingWaId === `reel-${manualPublishReel.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow disabled:opacity-50"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{sharingWaId === `reel-${manualPublishReel.id}` ? 'Preparing...' : 'Share WhatsApp Status'}</span>
                      </button>
                    </>
                  )}
                  <a
                    href="https://business.facebook.com/creatorstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Meta Creator Studio</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setManualPublishReel(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmManualPublish(manualPublishReel)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Published</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
