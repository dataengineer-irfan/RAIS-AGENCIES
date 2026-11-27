import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Film, FolderSync, RefreshCw, Send, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

const STATUS_FILTERS = ['ALL', 'DRAFT', 'AWAITING_APPROVAL', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED'];

export const ReelsStudioView: React.FC = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadReels = async (st: string = statusFilter) => {
    setLoading(true);
    try {
      const data = await api.listReels(st);
      setReels(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReels(statusFilter);
  }, [statusFilter]);

  const handleSyncDrive = async () => {
    setSyncing(true);
    setNotice(null);
    try {
      const res = await api.syncReelsFromDrive();
      setNotice(`Synced from Drive Queue: ${res.imported} imported, ${res.updated} updated in Neon Postgres.`);
      await loadReels(statusFilter);
    } finally {
      setSyncing(false);
    }
  };

  const handleApprove = async (id: number) => {
    await api.approveReel(id);
    setNotice(`Reel #${id} approved.`);
    await loadReels(statusFilter);
  };

  const handlePublish = async (id: number) => {
    setNotice(null);
    try {
      const res = await api.publishReel(id);
      setNotice(`Reel #${id} processed: status=${res.reel?.status}`);
      await loadReels(statusFilter);
    } catch (err: any) {
      setNotice(`Publish failed: ${err.message}`);
      await loadReels(statusFilter);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteReel(id);
    await loadReels(statusFilter);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span>Reels Video Studio (PostgreSQL Backed)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persistent Drive-synced video records with real Meta/YouTube publication URLs, aspect ratio metadata, and human approval workflow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncDrive}
            disabled={syncing}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>{syncing ? 'Syncing...' : 'Import from Drive Queue'}</span>
          </button>
          <button
            onClick={() => loadReels(statusFilter)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs">{notice}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === st
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-[#0f172a] text-slate-300 border border-slate-800'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-500 text-xs">Loading reels from Neon Postgres...</div>
      ) : reels.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs bg-[#0f172a] border border-slate-800 rounded-xl">
          No reels in this status. Click <strong>Import from Drive Queue</strong> to sync real Google Drive video assets.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reels.map((r) => (
            <div key={r.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{r.title}</h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {r.resolution} · {r.aspect_ratio} · SKU: {r.product_sku || 'General'}
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  r.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' :
                  r.status === 'FAILED' ? 'bg-rose-500/20 text-rose-300' :
                  'bg-amber-500/20 text-amber-300'
                }`}>
                  {r.status}
                </span>
              </div>

              {r.caption_english && (
                <p className="text-xs text-slate-300 line-clamp-3 bg-[#070b14] p-2.5 rounded border border-slate-800">
                  {r.caption_english}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                {r.status !== 'PUBLISHED' && (
                  <>
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handlePublish(r.id)}
                      className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish</span>
                    </button>
                  </>
                )}
                {r.published_url && (
                  <a
                    href={r.published_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Published</span>
                  </a>
                )}
                <button
                  onClick={() => handleDelete(r.id)}
                  className="ml-auto p-1.5 rounded bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
