import React, { useEffect, useState } from 'react';
import {
  Activity, CheckCircle2, Clock, Pause, Play, RefreshCw,
  RotateCcw, ShieldCheck, XCircle, Eye, AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';

export const WorkflowsCenterView: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [selectedExec, setSelectedExec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [w, e, a] = await Promise.all([
        api.listWorkflows(),
        api.listExecutions(40),
        api.listApprovals('PENDING'),
      ]);
      setWorkflows(w);
      setExecutions(e);
      setApprovals(a);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleRun = async (id: number) => {
    try {
      const ex = await api.runWorkflow(id, {});
      flash(`Workflow executed (${ex.status}) — ID: ${ex.execution_uid}`);
      await loadAll();
    } catch (err: any) {
      flash(`Error: ${err.message}`);
    }
  };

  const handleTogglePause = async (wf: any) => {
    if (wf.is_paused) await api.resumeWorkflow(wf.id);
    else await api.pauseWorkflow(wf.id);
    await loadAll();
  };

  const handleRetry = async (exId: number) => {
    try {
      await api.retryExecution(exId);
      flash('Execution retried.');
      await loadAll();
    } catch (err: any) {
      flash(`Retry blocked: ${err.message}`);
    }
  };

  const handleCancel = async (exId: number) => {
    await api.cancelExecution(exId);
    flash('Execution cancelled.');
    await loadAll();
  };

  const handleApprove = async (apId: number) => {
    await api.approveWorkflowStep(apId, 'Approved via Automation Control Centre');
    flash('Approval granted and workflow resumed.');
    await loadAll();
  };

  const handleReject = async (apId: number) => {
    await api.rejectWorkflowStep(apId, 'Rejected via Automation Control Centre');
    flash('Approval rejected and execution cancelled.');
    await loadAll();
  };

  const handleViewDetails = async (exId: number) => {
    const detail = await api.getExecutionDetail(exId);
    setSelectedExec(detail);
  };

  const activeCount = workflows.filter((w) => w.is_active && !w.is_paused).length;
  const pausedCount = workflows.filter((w) => w.is_paused).length;
  const succeededCount = executions.filter((e) => e.status === 'SUCCEEDED').length;
  const failedCount = executions.filter((e) => e.status === 'FAILED').length;

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>Automation Control Centre</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persistent PostgreSQL-backed workflow definitions, execution history, idempotency locks, retries &amp; human approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              const res = await api.triggerSchedulerTick();
              flash(`Scheduler tick complete: ${res.executed_count} scheduled run(s), ${res.recovered_stale} stale recovered.`);
              await loadAll();
            }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Run Scheduler Tick</span>
          </button>
          <button
            onClick={loadAll}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-medium">
          {notice}
        </div>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Active Workflows</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Paused Workflows</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{pausedCount}</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Succeeded Runs</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{succeededCount}</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Failed Runs</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{failedCount}</div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400">Pending Approvals</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{approvals.length}</div>
        </div>
      </div>

      {/* Pending Approvals Queue */}
      {approvals.length > 0 && (
        <div className="bg-[#0f172a] border border-purple-500/30 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Pending Human Approvals ({approvals.length})</span>
          </h2>
          <div className="space-y-2.5">
            {approvals.map((ap) => (
              <div key={ap.id} className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">{ap.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{ap.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(ap.id)}
                    className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(ap.id)}
                    className="px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflows Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">Configured Workflows</h2>
        </div>
        <div className="divide-y divide-slate-800/70">
          {workflows.map((wf) => (
            <div key={wf.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{wf.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    trigger: {wf.trigger_type}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    wf.is_paused ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {wf.is_paused ? 'PAUSED' : 'ACTIVE'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{wf.description}</p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Steps: {wf.actions?.length || 0} · Last Run: {wf.last_run_at ? new Date(wf.last_run_at).toLocaleString() : 'Never'}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleRun(wf.id)}
                  disabled={wf.is_paused}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Now</span>
                </button>
                <button
                  onClick={() => handleTogglePause(wf)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  {wf.is_paused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{wf.is_paused ? 'Resume' : 'Pause'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution History */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Recent Execution Logs</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Execution UID</th>
                <th className="py-2.5 px-4">Workflow</th>
                <th className="py-2.5 px-4">Trigger</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Attempts</th>
                <th className="py-2.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No workflow executions recorded yet.</td>
                </tr>
              ) : (
                executions.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-300">{ex.execution_uid.slice(0, 12)}...</td>
                    <td className="py-2.5 px-4 text-white font-semibold">{ex.workflow_name || `Workflow #${ex.workflow_id}`}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-cyan-300">{ex.trigger_type}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ex.status === 'SUCCEEDED' ? 'bg-emerald-500/20 text-emerald-300' :
                        ex.status === 'FAILED' ? 'bg-rose-500/20 text-rose-300' :
                        ex.status === 'AWAITING_APPROVAL' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {ex.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-400">{ex.attempt_count}/{ex.max_attempts}</td>
                    <td className="py-2.5 px-4 flex items-center gap-1.5">
                      <button
                        onClick={() => handleViewDetails(ex.id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                      {ex.status === 'FAILED' && (
                        <button
                          onClick={() => handleRetry(ex.id)}
                          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      )}
                      {(ex.status === 'RUNNING' || ex.status === 'AWAITING_APPROVAL') && (
                        <button
                          onClick={() => handleCancel(ex.id)}
                          className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Execution Detail Drawer */}
      {selectedExec && (
        <div className="bg-[#0f172a] border border-cyan-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Execution Trace: {selectedExec.execution_uid}
            </h3>
            <button onClick={() => setSelectedExec(null)} className="text-xs text-slate-400 hover:text-white">
              Close
            </button>
          </div>
          {selectedExec.error_message && (
            <div className="p-2.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{selectedExec.error_message}</span>
            </div>
          )}
          <div className="space-y-2">
            {(selectedExec.steps || []).map((st: any) => (
              <div key={st.id} className="p-3 rounded-lg bg-[#070b14] border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    Step {st.step_index + 1}: {st.step_name} ({st.action_type})
                  </span>
                  <span className="font-mono text-[10px] text-cyan-300">{st.status}</span>
                </div>
                <pre className="mt-1.5 text-[11px] text-slate-400 overflow-x-auto">
                  {JSON.stringify(st.output, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
