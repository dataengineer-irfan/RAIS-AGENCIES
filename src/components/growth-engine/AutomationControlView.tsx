import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, AlertTriangle, ShieldCheck, CheckCircle2, 
  Lock, RefreshCw, Activity, Clock, Shield
} from 'lucide-react';
import { api, AutomationSettings, AuditLogItem } from '../../services/api';
import { AuthService } from '../../services/authService';

interface AutomationProps {
  killSwitchActive: boolean;
  setKillSwitchActive: (val: boolean) => void;
}

export const AutomationControlView: React.FC<AutomationProps> = ({ 
  killSwitchActive, 
  setKillSwitchActive 
}) => {
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggling, setToggling] = useState<boolean>(false);
  const [curPasskey, setCurPasskey] = useState<string>('');
  const [newPasskey, setNewPasskey] = useState<string>('');
  const [passMsg, setPassMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [savingPass, setSavingPass] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, aData] = await Promise.all([
        api.getAutomationSettings(),
        api.getAuditLogs()
      ]);
      setSettings(sData);
      setKillSwitchActive(sData.emergency_kill_switch);
      setAuditLogs(aData);
    } catch (err) {
      console.error('Failed to load automation settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleKillSwitch = async () => {
    if (!settings) return;
    try {
      setToggling(true);
      const nextState = !killSwitchActive;
      const res = await api.toggleKillSwitch(nextState);
      setKillSwitchActive(res.emergency_kill_switch);
      if (settings) {
        setSettings({ ...settings, emergency_kill_switch: res.emergency_kill_switch });
      }
      // Reload audit logs to show the kill switch event
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to toggle kill switch', err);
    } finally {
      setToggling(false);
    }
  };

  const handleUpdatePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPass(true);
    setPassMsg(null);
    const res = await AuthService.changePasskey(curPasskey, newPasskey);
    setSavingPass(false);
    setPassMsg({ text: res.message, ok: res.success });
    if (res.success) {
      setCurPasskey('');
      setNewPasskey('');
      api.getAuditLogs().then(setAuditLogs).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Automation Safety & Governance Center</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Hard safety bounds, emergency kill switch control, and real-time immutable audit trail. AI operates strictly as an assistant under human supervision.
          </p>
        </div>

        <div>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>Refresh Audit Logs</span>
          </button>
        </div>
      </div>

      {!loading && !settings && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>
            <strong>Backend Unreachable:</strong> Live safety settings and audit logs cannot be loaded while the backend service is offline.
          </span>
        </div>
      )}

      {/* EMERGENCY KILL SWITCH PANEL */}
      <div className={`p-6 rounded-xl border transition-all ${
        killSwitchActive 
          ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/10' 
          : 'bg-[#0f172a] border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                !settings ? 'bg-slate-500' : killSwitchActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
              }`}></span>
              <h2 className="text-base font-bold text-white">
                Master Emergency Kill Switch: {!settings ? 'UNKNOWN (BACKEND OFFLINE)' : killSwitchActive ? 'ENGAGED (SYSTEM HALTED)' : 'DISENGAGED (SYSTEM ARMED)'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Engaging this switch instantly halts all background scheduled publishing, AI auto-generation, and Google Business Profile API write operations.
            </p>
          </div>

          <button
            onClick={handleToggleKillSwitch}
            disabled={toggling || !settings}
            className={`px-5 py-2.5 rounded-lg text-xs font-black tracking-wide uppercase transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
              killSwitchActive
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
            }`}
          >
            {toggling ? 'Updating...' : killSwitchActive ? 'Disengage Kill Switch' : 'Engage Emergency Halt'}
          </button>
        </div>
      </div>

      {/* Safety Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guardrails */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Active Safety Guardrails</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Campaign Approval Gate</div>
                <div className="text-[11px] text-slate-400">Posts cannot publish without explicit admin approval</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                ENFORCED
              </span>
            </div>

            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Review Moderation Gate</div>
                <div className="text-[11px] text-slate-400">Zero automated review replies permitted without human click</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                ENFORCED
              </span>
            </div>

            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Price Leak Protection</div>
                <div className="text-[11px] text-slate-400">Blocks specific wholesale rates in public social text</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                ENFORCED
              </span>
            </div>

            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Verified Phone Filter</div>
                <div className="text-[11px] text-slate-400">Enforces 9347453135 (secondary phone blocked)</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                ENFORCED
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Config */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Publishing Rhythm & Cadence</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg">
              <span className="text-slate-400 block mb-1">Recommended Posting Frequency</span>
              <div className="text-sm font-bold text-white">
                {settings?.posting_frequency_days || '—'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Aligns with restaurant kitchen inventory restocking cycles before weekends.
              </p>
            </div>

            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg">
              <span className="text-slate-400 block mb-1">Optimal Publishing Window</span>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {settings?.preferred_post_time || '—'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Catches cafe owners and QSR chefs before lunch service preparation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Passkey Rotation (Neon Postgres Server-Side) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Cloud Admin Passkey Rotation (Neon Postgres bcrypt)</span>
        </h3>
        <form onSubmit={handleUpdatePasskey} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Current Passkey</label>
            <input
              type="password"
              required
              value={curPasskey}
              onChange={(e) => setCurPasskey(e.target.value)}
              placeholder="Current passkey"
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">New Passkey (min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPasskey}
              onChange={(e) => setNewPasskey(e.target.value)}
              placeholder="New strong passkey"
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={savingPass}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            {savingPass ? 'Updating...' : 'Rotate Passkey in Neon'}
          </button>
        </form>
        {passMsg && (
          <div className={`text-xs font-medium px-3 py-2 rounded-lg border ${
            passMsg.ok ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}>
            {passMsg.text}
          </div>
        )}
      </div>

      {/* Real-time Immutable Audit Log Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Immutable Security Audit Log</span>
          </h2>
          <span className="text-xs text-slate-400">Cryptographically verifiable log trace</span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 border-b border-slate-800 sticky top-0">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Security Action</th>
                <th className="py-2.5 px-4 font-semibold">Actor</th>
                <th className="py-2.5 px-4 font-semibold">Resource</th>
                <th className="py-2.5 px-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 font-sans">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-amber-300 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">{log.actor}</td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {log.resource_type} {log.resource_id ? `#${log.resource_id}` : ''}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 max-w-xs truncate font-sans text-xs">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};