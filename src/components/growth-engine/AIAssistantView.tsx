import React, { useState } from 'react';
import { Bot, Send, Database } from 'lucide-react';
import { api } from '../../services/api';

const QUICK_QUESTIONS = [
  'Which leads need follow-up today?',
  'Which cafes have shown interest?',
  'Which products generated the most enquiries?',
  'Which automations failed or need approval?',
  'Which reviews need responses?',
];

export const AIAssistantView: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const ask = async (qText: string) => {
    if (!qText.trim()) return;
    setLoading(true);
    try {
      const res = await api.askBusinessIntelligence(qText);
      setHistory((prev) => [res, ...prev]);
      setQuestion('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-amber-400" />
          <span>RAIS AI Business Intelligence</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Queries live Neon PostgreSQL tables (leads, enquiries, reviews, catalogue SKUs, workflows) and cites exact source records.
        </p>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="px-3 py-1.5 rounded-lg bg-[#070b14] hover:bg-slate-800 border border-slate-700 text-xs text-slate-300"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex gap-2"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about leads, enquiries, reviews, stock, or automations..."
            className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-700 text-xs text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Querying DB...' : 'Ask AI'}</span>
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {history.map((item, idx) => (
          <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-white">{item.question}</div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Engine: {item.provider}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{item.answer}</p>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Sources: {(item.sources || []).join(', ')}</span>
            </div>
            {item.supporting_records?.length > 0 && (
              <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800 max-h-48 overflow-y-auto">
                <pre className="text-[11px] text-slate-300">{JSON.stringify(item.supporting_records, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
