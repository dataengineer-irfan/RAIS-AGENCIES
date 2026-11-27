import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Plug } from 'lucide-react';
import { api } from '../../services/api';

export const IntegrationsHealthView: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const res = await api.getIntegrationsHealth();
      setIntegrations(res.integrations || []);
      setCheckedAt(res.checked_at || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Plug className="w-5 h-5 text-amber-400" />
            <span>Production Integration Health Monitor</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live verification of Neon PostgreSQL, Google APIs, Meta Graph API, WhatsApp Cloud API, Gemini AI, and background workers.
            {checkedAt ? ` Last checked: ${new Date(checkedAt).toLocaleString()}` : ''}
          </p>
        </div>
        <button
          onClick={loadHealth}
          disabled={loading}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Run Health Check</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => {
          const isOk = item.status === 'CONNECTED';
          const isWarn = item.status === 'PERMISSION_MISSING' || item.status === 'RATE_LIMITED';
          return (
            <div key={item.name} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{item.name}</span>
                {isOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isWarn ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${
                isOk
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : isWarn
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                {item.status}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
