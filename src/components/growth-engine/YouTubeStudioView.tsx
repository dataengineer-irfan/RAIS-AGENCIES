import React, { useState, useEffect } from 'react';
import { 
  Video, FolderSync, Play, CheckCircle2, Clock, AlertCircle, 
  ExternalLink, Sparkles, HelpCircle, RefreshCw, Key, ShieldCheck,
  ChevronDown, ChevronUp, Copy, Check, Send, Trash2,
  Instagram, Facebook, Share2
} from 'lucide-react';
import { growthEngineApi as api, MetaStatus, YouTubeDriveSetting, YouTubeQueueItem } from '../../services/api';
import { shareOrDownloadForWhatsAppStatus } from '../../utils/whatsappShare';
import { MetaConnectCard } from './MetaConnectCard';

export const YouTubeStudioView: React.FC = () => {
  const [settings, setSettings] = useState<YouTubeDriveSetting>({
    folder_id: '1Bm_WjSGQb_KQSRz6i08DSsp2mtzOborn',
    folder_name: 'RAIS_Daily_Promotion_Videos',
    auto_publish_daily: false,
    auto_publish_instagram: true,
    auto_publish_facebook: true,
    daily_publish_hour: 10,
    is_connected: false,
    oauth_connected: false
  });
  const [metaStatus, setMetaStatus] = useState<MetaStatus | null>(null);
  const [queue, setQueue] = useState<YouTubeQueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [folderInput, setFolderInput] = useState<string>('https://drive.google.com/drive/folders/1Bm_WjSGQb_KQSRz6i08DSsp2mtzOborn');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [expandedDescId, setExpandedDescId] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const showNotice = (text: string, type: 'success' | 'error' | 'info') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 6000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stg, q, meta] = await Promise.all([
        api.getYouTubeSettings(),
        api.listYouTubeQueue(),
        api.getMetaStatus()
      ]);
      setSettings(stg);
      setMetaStatus(meta);
      const activeFolder = stg.folder_id || '1Bm_WjSGQb_KQSRz6i08DSsp2mtzOborn';
      setFolderInput(`https://drive.google.com/drive/folders/${activeFolder}`);
      setQueue(q || []);
    } catch (err) {
      console.error('Failed to load YouTube automation data', err);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearQueue = async () => {
    try {
      const res = await api.clearYouTubeQueue();
      setQueue([]);
      showNotice(res.message || 'Queue cleared.', 'info');
    } catch (err: any) {
      showNotice(err?.message || 'Failed to clear queue on backend.', 'error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const updated = await api.updateYouTubeSettings({
        folder_id: folderInput,
        folder_name: settings.folder_name,
        auto_publish_daily: settings.auto_publish_daily,
        auto_publish_instagram: settings.auto_publish_instagram ?? true,
        auto_publish_facebook: settings.auto_publish_facebook ?? true
      });
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      showNotice('Drive & multi-platform settings saved.', 'success');
    } catch (err: any) {
      showNotice(err?.message || 'Failed to save Drive folder settings.', 'error');
    }
  };

  const handleSyncDrive = async () => {
    setSyncing(true);
    try {
      const res = await api.syncGoogleDrive();
      const updatedQueue = await api.listYouTubeQueue();
      setQueue(updatedQueue);
      showNotice(res.message, res.status === 'OAUTH_REQUIRED' || res.status === 'ERROR' ? 'error' : 'success');
    } catch (err: any) {
      showNotice(err?.message || 'Drive sync failed.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handlePublishNext = async () => {
    setPublishing(true);
    try {
      const res = await api.publishNextYouTubeVideo();
      const updatedQueue = await api.listYouTubeQueue();
      setQueue(updatedQueue);
      showNotice(res.message, res.status === 'SUCCESS' ? 'success' : 'error');
    } catch (err: any) {
      showNotice(err?.message || 'Publish next failed.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handlePublishItem = async (id: number) => {
    setPublishingId(id);
    try {
      const res = await api.publishYouTubeItem(id);
      const updatedQueue = await api.listYouTubeQueue();
      setQueue(updatedQueue);
      showNotice(res.message, res.status === 'SUCCESS' ? 'success' : 'error');
    } catch (err: any) {
      showNotice(err?.message || 'Publish item failed.', 'error');
    } finally {
      setPublishingId(null);
    }
  };

  const handlePublishMeta = async (id: number, platforms: string[] = ['instagram', 'facebook']) => {
    setPublishingId(id);
    try {
      const res = await api.publishMetaDriveItem(id, platforms);
      const updatedQueue = await api.listYouTubeQueue();
      setQueue(updatedQueue);
      if (res.status === 'PARTIAL') {
        showNotice(`Partial Meta publish: ${res.errors.join(' | ')}`, 'info');
      } else {
        showNotice(`Published to ${Object.keys(res.results).join(' & ')} successfully!`, 'success');
      }
    } catch (err: any) {
      await loadData();
      showNotice(err?.message || 'Meta IG/FB publishing failed.', 'error');
    } finally {
      setPublishingId(null);
    }
  };

  const handlePublishMulti = async (id: number) => {
    setPublishingId(id);
    try {
      const res = await api.publishMultiPlatformItem(id);
      const updatedQueue = await api.listYouTubeQueue();
      setQueue(updatedQueue);
      const okChannels = Object.keys(res.results || {});
      if (res.errors?.length) {
        showNotice(`Published to [${okChannels.join(', ') || 'none'}]. Warnings: ${res.errors.join(' | ')}`, okChannels.length ? 'info' : 'error');
      } else {
        showNotice(`Auto-posted cleanly across ${okChannels.join(', ').toUpperCase()}!`, 'success');
      }
    } catch (err: any) {
      await loadData();
      showNotice(err?.message || 'Multi-platform publish failed.', 'error');
    } finally {
      setPublishingId(null);
    }
  };

  const handleShareWhatsAppStatus = async (item: YouTubeQueueItem) => {
    if (!item.drive_file_id) {
      showNotice('Sync this item from Google Drive first before sharing to WhatsApp Status.', 'error');
      return;
    }
    setSharingId(item.id);
    try {
      const caption = `${item.video_title}\n\n${item.description}\n\nWhatsApp Order: 9347453135 | RAIS Agencies Rayachoty`;
      const outcome = await shareOrDownloadForWhatsAppStatus({
        videoUrl: api.getDriveDownloadUrl(item.drive_file_id),
        filename: item.file_name,
        captionText: caption,
      });
      if (outcome.method !== 'cancelled') {
        showNotice(outcome.message, 'success');
      }
    } catch (err: any) {
      showNotice(err?.message || 'Could not download MP4 for WhatsApp Status share.', 'error');
    } finally {
      setSharingId(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const publishedCount = queue.filter(q => q.status === 'PUBLISHED').length;
  const igPublishedCount = queue.filter(q => q.ig_status === 'PUBLISHED').length;
  const fbPublishedCount = queue.filter(q => q.fb_status === 'PUBLISHED').length;
  const queuedCount = queue.filter(q => q.status === 'QUEUED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                Unified Drive -&gt; YouTube, Instagram, Facebook &amp; WA Share
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Auto-Sync Pipeline
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Unified Video Distribution Pipeline (Drive to YT + IG + FB)
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Upload one product MP4 into Google Drive. Publish cleanly to YouTube Shorts, Instagram Reels (<span className="text-pink-400 font-mono">@raisfrozenfoods</span>),
              and your linked Facebook Page, or share safely to WhatsApp Status in 1 tap.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>{showGuide ? 'Hide Setup Guide' : 'Setup Guide & Keys'}</span>
            </button>

            {!settings.oauth_connected && (
              <button
                onClick={async () => {
                  try {
                    const res = await api.getGoogleAuthorizeUrl(true);
                    if (res.authorization_url) window.location.href = res.authorization_url;
                  } catch (err: any) {
                    showNotice(err?.message || 'Could not start Google OAuth flow on backend.', 'error');
                  }
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
              >
                <Key className="w-4 h-4" />
                <span>Authorize Drive &amp; YouTube</span>
              </button>
            )}

            <button
              onClick={handleSyncDrive}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Scanning Drive...' : 'Sync Drive Now'}</span>
            </button>

            {queue.length > 0 && (
              <button
                onClick={handleClearQueue}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all shadow"
                title="Wipe queue items"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Clear Queue</span>
              </button>
            )}

            <button
              onClick={handlePublishNext}
              disabled={publishing || queuedCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${publishing ? 'animate-bounce' : ''}`} />
              <span>{publishing ? 'Publishing...' : 'Publish Next Video'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-slate-400 text-xs font-medium">Drive Sync Folder</div>
            <div className="text-white font-bold text-sm mt-1 truncate">
              {settings.folder_name || 'RAIS_Daily_Promotion_Videos'}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${
                settings.backend_offline ? 'bg-rose-400' : settings.oauth_connected ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="text-[11px] text-slate-400">
                {settings.backend_offline
                  ? 'Backend YouTube API Unavailable'
                  : settings.oauth_connected
                  ? 'Google OAuth + Folder Linked'
                  : settings.is_connected
                  ? 'Folder Linked (Google OAuth Needed)'
                  : 'Not Configured'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-slate-400 text-xs font-medium">Daily Release Cadence</div>
            <div className="text-white font-bold text-sm mt-1">1 Video / Day</div>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Auto-fires at 10:00 AM IST
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-slate-400 text-xs font-medium">In Queue (Scheduled)</div>
            <div className="text-amber-400 font-extrabold text-lg mt-0.5">{queuedCount} Videos</div>
            <div className="text-[11px] text-slate-400 mt-1">Automated sequential pipeline</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-slate-400 text-xs font-medium">Published Across Channels</div>
            <div className="text-emerald-400 font-extrabold text-sm mt-1">
              YT {publishedCount} · IG {igPublishedCount} · FB {fbPublishedCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {metaStatus?.connected ? `Meta Live: @${metaStatus.ig_username || 'Linked'}` : 'Meta Token Needed for IG + FB'}
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 border ${
          notice.type === 'success'
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            : notice.type === 'error'
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
        }`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{notice.text}</span>
        </div>
      )}

      {!loading && settings.backend_offline && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <span>
            <strong>Backend YouTube Endpoints Unavailable:</strong> The live Render backend has not deployed the YouTube &amp; Drive API endpoints yet (or is offline). Deploy backend v1.0.4+ on Render and authorize Google OAuth with Drive &amp; YouTube scopes to enable live syncing.
          </span>
        </div>
      )}

      {/* Setup Guide Accordion */}
      {showGuide && (
        <div className="bg-slate-900/95 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <Key className="w-5 h-5" />
              <span>Step-by-Step Google Cloud Console & Drive Setup Guide</span>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Guide ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Step 1 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-black">1</span>
                <span>Enable Google APIs</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Log into <strong className="text-slate-200">Google Cloud Console</strong> using the same Google Account that owns your Google Business Profile:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-red-400 underline">console.cloud.google.com</a></li>
                <li>Select your RAIS project in the top header.</li>
                <li>Navigate to <strong>APIs & Services ➔ Library</strong>.</li>
                <li>Search & click <strong>Enable</strong> for:
                  <ul className="list-disc list-inside pl-3 mt-1 text-slate-400">
                    <li><strong className="text-emerald-400">Google Drive API</strong></li>
                    <li><strong className="text-emerald-400">YouTube Data API v3</strong></li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black">2</span>
                <span>Get Google Drive Folder ID</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Organize your video files in Google Drive:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Open <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">drive.google.com</a>.</li>
                <li>Create a folder named <code className="text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded">RAIS_Daily_Promotion_Videos</code>.</li>
                <li>Open the folder and look at the browser URL:
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded text-[11px] text-slate-300 break-all font-mono mt-1">
                    drive.google.com/drive/folders/<span className="text-amber-400 font-bold">1a2B3c4D5e6F7g8H9i0J</span>
                  </div>
                </li>
                <li>Copy the folder URL or the characters after <code className="text-amber-300">folders/</code> and paste it in the box below!</li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black">3</span>
                <span>OAuth Redirect URI</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Under <strong>APIs & Services ➔ Credentials</strong>, verify your OAuth 2.0 Web Client contains this exact Authorized redirect URI:
              </p>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded text-[11px] text-slate-300 break-all font-mono flex items-center justify-between gap-1">
                <span>https://rais-growth-backend.onrender.com/api/v1/google/callback</span>
                <button
                  onClick={() => copyToClipboard('https://rais-growth-backend.onrender.com/api/v1/google/callback', 'redirect')}
                  className="p-1 hover:text-white"
                  title="Copy URI"
                >
                  {copiedText === 'redirect' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                Since your Google Auth is already active for GBP, enabling Drive and YouTube grants instant access without extra apps.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Drive Connection Settings Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Google Drive Folder Integration</h2>
              <p className="text-xs text-slate-400">
                Specify the Google Drive folder where your promotion clips are stored.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
            >
              Save Folder Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Google Drive Folder ID or Link:
            </label>
            <input
              type="text"
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="e.g. 1a2B3c4D5e6F7g8H9i0J or full drive folder URL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Paste the entire Drive link or just the folder ID. We automatically parse it.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Folder Name / Label:
            </label>
            <input
              type="text"
              value={settings.folder_name}
              onChange={(e) => setSettings({ ...settings, folder_name: e.target.value })}
              placeholder="RAIS_Daily_Promotion_Videos"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
            />
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto-daily"
                  checked={settings.auto_publish_daily}
                  onChange={(e) => setSettings({ ...settings, auto_publish_daily: e.target.checked })}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <label htmlFor="auto-daily" className="text-xs text-slate-300 cursor-pointer">
                  YouTube Shorts (Daily)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto-ig"
                  checked={settings.auto_publish_instagram ?? true}
                  onChange={(e) => setSettings({ ...settings, auto_publish_instagram: e.target.checked })}
                  className="rounded border-slate-700 text-pink-600 focus:ring-0"
                />
                <label htmlFor="auto-ig" className="text-xs text-pink-300 cursor-pointer">
                  Instagram Reels
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto-fb"
                  checked={settings.auto_publish_facebook ?? true}
                  onChange={(e) => setSettings({ ...settings, auto_publish_facebook: e.target.checked })}
                  className="rounded border-slate-700 text-blue-500 focus:ring-0"
                />
                <label htmlFor="auto-fb" className="text-xs text-blue-300 cursor-pointer">
                  Facebook Page
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Meta (Instagram + Facebook Page) Token Connection Panel */}
      <MetaConnectCard
        metaStatus={metaStatus}
        onStatusChanged={setMetaStatus}
        onNotice={showNotice}
      />

      {/* Video Release Queue & Scheduled Inventory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-red-500 fill-red-500" />
              Daily YouTube Video Queue & Product Metadata Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Videos are sequenced chronologically. Each video automatically includes commercial B2B specs, 
              direct WhatsApp order links (+91 9347453135), and Rayachoty depot address.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            {queue.length} items total
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Loading scheduled videos...
          </div>
        ) : queue.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No videos enqueued. Drop MP4 videos in your Drive folder and click 'Sync Drive Now'.
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item, idx) => {
              const isPublished = item.status === 'PUBLISHED';
              const isExpanded = expandedDescId === item.id;
              const isBeingPublished = publishingId === item.id;

              return (
                <div 
                  key={item.id}
                  className={`border rounded-xl p-4 transition-all ${
                    isPublished 
                      ? 'bg-emerald-950/10 border-emerald-500/20 hover:border-emerald-500/40' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                        isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        <Video className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-white font-bold text-sm tracking-tight">
                            {item.video_title}
                          </span>
                          {item.product_sku && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              {item.product_sku}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPublished 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="font-mono text-slate-500">File: {item.file_name}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-medium">Product: {item.product_name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {isPublished 
                              ? `Published: ${item.published_at ? new Date(item.published_at).toLocaleDateString('en-IN') : 'Live'}`
                              : `Scheduled: Day ${idx + 1} (${new Date(item.scheduled_for).toLocaleDateString('en-IN')})`}
                          </span>
                        </div>

                        {/* Cross-Platform Status Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {item.youtube_url ? (
                            <a
                              href={item.youtube_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                            >
                              <Video className="w-3 h-3" /> YT Live <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                              YT: {item.status}
                            </span>
                          )}

                          {item.ig_url ? (
                            <a
                              href={item.ig_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 hover:bg-pink-500/25"
                            >
                              <Instagram className="w-3 h-3" /> IG Live <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span
                              title={item.ig_error || ''}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                item.ig_status === 'FAILED'
                                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              IG: {item.ig_status || 'PENDING'}
                            </span>
                          )}

                          {item.fb_url ? (
                            <a
                              href={item.fb_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25"
                            >
                              <Facebook className="w-3 h-3" /> FB Live <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span
                              title={item.fb_error || ''}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                item.fb_status === 'FAILED'
                                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              FB: {item.fb_status || 'PENDING'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-auto flex-shrink-0">
                      <button
                        onClick={() => setExpandedDescId(isExpanded ? null : item.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <span>Description</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {item.drive_file_id && (
                        <button
                          onClick={() => handleShareWhatsAppStatus(item)}
                          disabled={sharingId === item.id}
                          title="Safe 1-Tap WhatsApp Status share (mobile Web Share / MP4 download + caption)"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{sharingId === item.id ? 'Loading MP4...' : 'WA Status'}</span>
                        </button>
                      )}

                      {(item.ig_status !== 'PUBLISHED' || item.fb_status !== 'PUBLISHED') && (
                        <button
                          onClick={() => handlePublishMeta(item.id, ['instagram', 'facebook'])}
                          disabled={isBeingPublished}
                          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-blue-600 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          <span>{isBeingPublished ? 'Posting...' : 'IG + FB'}</span>
                        </button>
                      )}

                      {(!isPublished || item.ig_status !== 'PUBLISHED' || item.fb_status !== 'PUBLISHED') && (
                        <button
                          onClick={() => handlePublishMulti(item.id)}
                          disabled={isBeingPublished}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1 transition-all shadow disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isBeingPublished ? 'Publishing...' : 'Post All'}</span>
                        </button>
                      )}

                      {!isPublished && (
                        <button
                          onClick={() => handlePublishItem(item.id)}
                          disabled={isBeingPublished}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20 disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{isBeingPublished ? 'Publishing...' : 'YT Only'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Description Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs animate-in fade-in duration-150">
                      <div className="text-slate-400 font-semibold">Auto-Generated YouTube Description:</div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-slate-300 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                        {item.description}
                      </div>
                      {item.tags && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-slate-500 text-[11px] font-semibold">Tags:</span>
                          {item.tags.split(',').map((tag, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
