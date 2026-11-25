import React, { useState } from 'react';
import {
  Instagram,
  Facebook,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Unplug,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { api, MetaStatus } from '../../services/api';

interface MetaConnectCardProps {
  metaStatus: MetaStatus | null;
  onStatusChanged: (status: MetaStatus) => void;
  onNotice?: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const MetaConnectCard: React.FC<MetaConnectCardProps> = ({
  metaStatus,
  onStatusChanged,
  onNotice,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [pageIdInput, setPageIdInput] = useState('');
  const [igIdInput, setIgIdInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isConnected = Boolean(metaStatus?.connected);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setLocalError('Paste your Meta Page Access Token (or User Token with page/IG permissions).');
      return;
    }
    setConnecting(true);
    setLocalError(null);
    try {
      const updated = await api.connectMeta({
        access_token: tokenInput.trim(),
        page_id: pageIdInput.trim() || undefined,
        ig_user_id: igIdInput.trim() || undefined,
      });
      onStatusChanged(updated);
      setTokenInput('');
      onNotice?.(updated.message || 'Meta Facebook Page & Instagram Business Account connected!', 'success');
    } catch (err: any) {
      const msg = err?.message || 'Meta Graph API rejected token.';
      setLocalError(msg);
      onNotice?.(msg, 'error');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setLocalError(null);
    try {
      await api.disconnectMeta();
      const refreshed = await api.getMetaStatus();
      onStatusChanged(refreshed);
      onNotice?.('Meta connection disconnected cleanly.', 'info');
    } catch (err: any) {
      onNotice?.(err?.message || 'Failed to disconnect Meta.', 'error');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-pink-500/20 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-pink-500/30 flex items-center gap-1.5">
            <Instagram className="w-4 h-4 text-pink-400" />
            <Facebook className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white">
                Meta Graph API Connection (Instagram Reels + Facebook Page)
              </h2>
              {isConnected ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>LIVE CONNECTED</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>NOT CONNECTED</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Because your Facebook Page is already linked with Instagram (<span className="text-pink-400 font-mono">@raisfrozenfoods</span>), one Page Access Token posts Drive videos to both automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowSteps(!showSteps)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showSteps ? 'Hide Token Steps' : 'How to Get Token'}</span>
          </button>

          {isConnected && (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {disconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unplug className="w-3.5 h-3.5" />}
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {isConnected && metaStatus && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-xs">
          <div>
            <div className="text-slate-400 text-[11px] uppercase font-mono">Facebook Page</div>
            <div className="text-white font-bold mt-0.5">{metaStatus.page_name || 'Verified Page'}</div>
            <div className="text-blue-300 font-mono text-[11px]">ID: {metaStatus.page_id || 'Auto'}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] uppercase font-mono">Linked Instagram</div>
            <div className="text-white font-bold mt-0.5">
              {metaStatus.ig_username ? `@${metaStatus.ig_username}` : 'Linked IG Business'}
            </div>
            <div className="text-pink-300 font-mono text-[11px]">IG ID: {metaStatus.ig_user_id || 'Pending Link'}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] uppercase font-mono">Token Storage</div>
            <div className="text-emerald-300 font-bold mt-0.5 uppercase">{metaStatus.source} (Encrypted)</div>
            <div className="text-slate-400 text-[11px]">Graph API v21.0 Verified</div>
          </div>
        </div>
      )}

      {showSteps && (
        <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/25 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <strong className="text-amber-300 font-bold">Generate Meta Page Access Token (2 Minutes):</strong>
            <a
              href="https://developers.facebook.com/tools/explorer/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>Open Meta Graph API Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Open <strong className="text-slate-200">Meta Graph API Explorer</strong> &amp; select your Business App (or create a Business App on <code className="text-amber-300">developers.facebook.com/apps</code>).</li>
            <li>Click <strong className="text-slate-200">Get Token -&gt; Get Page Access Token</strong> and approve these 5 permissions: <code className="text-cyan-300">pages_show_list, pages_read_engagement, pages_manage_posts, instagram_basic, instagram_content_publish</code>.</li>
            <li>Select your RAIS Agencies Facebook Page (already connected to <code className="text-pink-300">@raisfrozenfoods</code>).</li>
            <li>Paste the token below — we validate it live against Meta and auto-detect both accounts. (Tip: extend it to 60 days in Meta Access Token Debugger.)</li>
          </ol>
        </div>
      )}

      <form onSubmit={handleConnect} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder={isConnected ? 'Paste new Meta Token to rotate/refresh...' : 'Paste Meta Page Access Token (EAA...)'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={connecting}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-blue-600 hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-50"
          >
            {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{connecting ? 'Verifying with Meta...' : isConnected ? 'Update Token' : 'Connect FB & IG'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="hover:text-slate-200 underline"
          >
            {showAdvanced ? 'Hide optional Page / IG ID overrides' : 'Optional: Specify Page ID / IG Business ID manually'}
          </button>
          <span className="text-slate-500">WhatsApp Status uses safe 1-tap Mobile Share (no ban-risk bots)</span>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <input
              type="text"
              value={pageIdInput}
              onChange={(e) => setPageIdInput(e.target.value)}
              placeholder="Optional Facebook Page ID"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 font-mono"
            />
            <input
              type="text"
              value={igIdInput}
              onChange={(e) => setIgIdInput(e.target.value)}
              placeholder="Optional IG Business User ID (e.g. 17841...)"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 font-mono"
            />
          </div>
        )}

        {localError && (
          <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300">
            {localError}
          </div>
        )}
      </form>
    </div>
  );
};
