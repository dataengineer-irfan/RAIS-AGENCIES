import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, RefreshCw, AlertCircle, CheckCircle2, Key } from 'lucide-react';
import { api } from '../../services/api';

export const WhatsAppSalesView: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [phone, setPhone] = useState('');
  const [body, setBody] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadAll = async () => {
    const [st, tpls, msgs] = await Promise.all([
      api.getWhatsAppStatus(),
      api.listWhatsAppTemplates(),
      api.listWhatsAppMessages(),
    ]);
    setStatus(st);
    setTemplates(tpls);
    setMessages(msgs);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    try {
      const res = await api.connectWhatsApp({ phone_number_id: phoneNumberId, access_token: accessToken });
      setStatus(res);
      setAccessToken('');
      setNotice('WhatsApp Business Cloud API connected and verified.');
    } catch (err: any) {
      setNotice(`Connection failed: ${err.message}`);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      const res = await api.sendWhatsAppMessage({ phone, body });
      if (res.sent) {
        setNotice(`Sent via WhatsApp Cloud API (ID: ${res.wa_message_id})`);
        setBody('');
      } else {
        setNotice(`Delivery blocked (${res.status}): ${res.error}`);
      }
      await loadAll();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>WhatsApp Business Cloud API Sales</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Meta Graph API v21.0 messaging, webhook capture, opt-out compliance, and Telugu/Hindi/English templates.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
          status?.connected ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        }`}>
          {status?.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{status?.connected ? 'Cloud API Connected' : 'NOT CONNECTED'}</span>
        </span>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs">{notice}</div>
      )}

      {!status?.connected && (
        <form onSubmit={handleConnect} className="bg-[#0f172a] border border-amber-500/30 rounded-xl p-5 space-y-3 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Connect Official WhatsApp Business Cloud API</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              required
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="WhatsApp Phone Number ID"
              className="px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white"
            />
            <input
              required
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Meta Cloud API Permanent Token"
              className="px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
              Verify &amp; Save Cloud API
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSend} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">Send Official Message</h2>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Recipient Phone *</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile or 91XXXXXXXXXX"
              className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Load Verified Template (EN / TE / HI)</label>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setBody(t.body)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  {t.language.toUpperCase()}: {t.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Message Body *</label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sending ? 'Sending...' : 'Send via WhatsApp Cloud API'}</span>
          </button>
        </form>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Conversation &amp; Delivery Log ({messages.length})</h2>
            <button onClick={loadAll} className="p-1.5 rounded bg-slate-800 text-slate-300">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">No WhatsApp messages logged yet.</div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-[#070b14] border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-300">{m.direction} · {m.phone}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      m.status === 'SENT' || m.status === 'DELIVERED' || m.status === 'RECEIVED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <p className="text-slate-200">{m.body}</p>
                  {m.error_detail && <p className="text-[11px] text-rose-400">{m.error_detail}</p>}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await api.handoverWhatsApp(m.phone, 'Depot Sales Lead');
                        setNotice(`Handed over ${m.phone} to ${res.assigned_owner}.`);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 border border-slate-700"
                    >
                      Human Handover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
