import React, { useEffect, useState } from 'react';
import { GitBranch, Plus, Save, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export const WorkflowBuilderView: React.FC = () => {
  const [triggers, setTriggers] = useState<string[]>([]);
  const [availableActions, setAvailableActions] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('new_lead');
  const [conditions, setConditions] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([
    { type: 'score_lead', name: 'Score Lead' },
    { type: 'prepare_whatsapp_draft', name: 'Prepare WhatsApp Draft' },
  ]);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    api.getWorkflowTriggersMeta().then((meta) => {
      setTriggers(meta.triggers || []);
      setAvailableActions(meta.actions || []);
    });
  }, []);

  const addCondition = () => {
    setConditions([...conditions, { field: 'business_type', operator: 'contains', value: 'Cafe' }]);
  };

  const addAction = (type: string) => {
    const found = availableActions.find((a) => a.type === type);
    setActions([...actions, { type, name: found?.label || type }]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const finalSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const created = await api.createWorkflow({
        slug: finalSlug,
        name,
        description,
        trigger_type: triggerType,
        conditions,
        actions,
        approval_required: approvalRequired,
      });
      setMsg({ text: `Workflow "${created.name}" saved to PostgreSQL and active.`, ok: true });
      setName('');
      setSlug('');
      setDescription('');
    } catch (err: any) {
      setMsg({ text: err.message || 'Failed to save workflow', ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-amber-400" />
          <span>Visual Workflow Builder</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Trigger -&gt; Condition -&gt; Action -&gt; Approval workflows persisted directly in Neon PostgreSQL.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Workflow Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cafe Lead Auto-Qualification"
              className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Trigger Event *</label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white"
            >
              {(triggers.length ? triggers : ['new_lead', 'new_enquiry', 'stock_arrival', 'manual_execution']).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Approval Gate</label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={approvalRequired}
                onChange={(e) => setApprovalRequired(e.target.checked)}
              />
              <span>Require human approval</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-300 font-semibold block mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this workflow automates..."
            className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white text-xs"
          />
        </div>

        {/* Conditions */}
        <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase">Condition Blocks</span>
            <button type="button" onClick={addCondition} className="px-2.5 py-1 rounded bg-slate-800 text-xs text-white flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Condition
            </button>
          </div>
          {conditions.length === 0 ? (
            <div className="text-xs text-slate-500">No conditions (runs on every matching trigger).</div>
          ) : (
            conditions.map((c, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 text-xs">
                <input
                  value={c.field}
                  onChange={(e) => {
                    const copy = [...conditions];
                    copy[idx].field = e.target.value;
                    setConditions(copy);
                  }}
                  placeholder="field"
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
                <select
                  value={c.operator}
                  onChange={(e) => {
                    const copy = [...conditions];
                    copy[idx].operator = e.target.value;
                    setConditions(copy);
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="exists">exists</option>
                </select>
                <input
                  value={c.value}
                  onChange={(e) => {
                    const copy = [...conditions];
                    copy[idx].value = e.target.value;
                    setConditions(copy);
                  }}
                  placeholder="value"
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
                <button
                  type="button"
                  onClick={() => setConditions(conditions.filter((_, i) => i !== idx))}
                  className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-xs"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Action Blocks */}
        <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-300 uppercase">Action Sequence</span>
            <div className="flex flex-wrap gap-1.5">
              {availableActions.map((act) => (
                <button
                  key={act.type}
                  type="button"
                  onClick={() => addAction(act.type)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700"
                >
                  + {act.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {actions.map((act, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-amber-400 mr-2">#{idx + 1}</span>
                  <span className="font-bold text-white">{act.name}</span>
                  <span className="text-slate-500 ml-2 font-mono">({act.type})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActions(actions.filter((_, i) => i !== idx))}
                  className="p-1 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-lg text-xs border ${
            msg.ok ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}>
            {msg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || actions.length === 0}
          className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Executable Workflow'}</span>
        </button>
      </form>
    </div>
  );
};
