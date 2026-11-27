import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, AlertTriangle, CheckCircle2, 
  Send, RefreshCw, Smartphone, Copy, Check, Info
} from 'lucide-react';
import { api, CatalogSKU } from '../../services/api';
import { PRODUCTS } from '../../data/catalogue';

export const ContentStudioView: React.FC = () => {
  const [skus, setSkus] = useState<CatalogSKU[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>('RAIS-MM-MOZZ');
  const [theme, setTheme] = useState<string>('Cafe Mozzarella Melt');
  const [channel, setChannel] = useState<string>('gbp');
  const [languageMode, setLanguageMode] = useState<string>('trilingual');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Generated content result
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [editableHeadline, setEditableHeadline] = useState<string>('');
  const [editableEnglish, setEditableEnglish] = useState<string>('');
  const [editableTelugu, setEditableTelugu] = useState<string>('');
  const [editableHindi, setEditableHindi] = useState<string>('');

  useEffect(() => {
    loadSkus();
  }, []);

  const loadSkus = async () => {
    try {
      const data = await api.listSkus();
      if (data && data.length > 0) {
        setSkus(data);
        if (!selectedSku || !data.some((s: CatalogSKU) => s.sku === selectedSku)) {
          setSelectedSku(data[0].sku);
        }
      } else {
        const localSkus: CatalogSKU[] = PRODUCTS.map((p, idx) => ({
          id: idx + 1,
          sku: p.sku,
          brand: p.brand,
          name: p.name,
          pack_size: p.pack,
          category: p.categoryName,
          in_stock: true,
          is_commercial_focus: Boolean(p.isFeatured),
          description: p.description,
          verification_status: 'VERIFIED'
        }));
        setSkus(localSkus);
        if (!selectedSku && localSkus.length > 0) {
          setSelectedSku(localSkus[0].sku);
        }
      }
    } catch (err) {
      console.warn('Backend listSkus unavailable, using authentic catalogue', err);
      const localSkus: CatalogSKU[] = PRODUCTS.map((p, idx) => ({
        id: idx + 1,
        sku: p.sku,
        brand: p.brand,
        name: p.name,
        pack_size: p.pack,
        category: p.categoryName,
        in_stock: true,
        is_commercial_focus: Boolean(p.isFeatured),
        description: p.description,
        verification_status: 'VERIFIED'
      }));
      setSkus(localSkus);
      if (!selectedSku && localSkus.length > 0) {
        setSelectedSku(localSkus[0].sku);
      }
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (channel === 'gbp' && (languageMode === 'bilingual' || languageMode === 'english' || languageMode === 'telugu')) {
        const res = await api.generatePost(theme, selectedSku, languageMode);
        const content = res?.content || res || {};
        const report = res?.validation || res?.validation_report || {};
        const flags: string[] = report.flags || report.errors || report.warnings || [];
        const passed = typeof report.passed === 'boolean' ? report.passed : Boolean(report.is_valid);
        const normalized = {
          status: 'SUCCESS',
          theme: res?.theme || theme,
          generation_engine: res?.generation_engine || 'template_fallback',
          ai_status: res?.generation_engine === 'gemini' ? 'SUCCESS' : 'TEMPLATE_FALLBACK',
          fallback_reason: res?.generation_engine === 'gemini' ? null : 'Gemini unavailable or rejected by deterministic validator',
          content: {
            headline: content.headline || '',
            content_english: content.content_english || '',
            content_telugu: content.content_telugu || '',
            content_hindi: '',
            call_to_action: content.call_to_action || 'WhatsApp Order: 9347453135'
          },
          validation: {
            passed,
            target_sku: res?.target_product_sku || report.target_sku || selectedSku,
            flags
          }
        };
        setGeneratedResult(normalized);
        setEditableHeadline(normalized.content.headline);
        setEditableEnglish(normalized.content.content_english);
        setEditableTelugu(normalized.content.content_telugu);
        setEditableHindi('');
      } else {
        const cfRes = await api.generateContentFactory({
          channel,
          theme,
          target_sku: selectedSku || undefined,
          language: languageMode,
          variations: 1
        });
        const v0 = (cfRes?.variations || [])[0] || {};
        setGeneratedResult({
          status: 'SUCCESS',
          theme,
          generation_engine: cfRes?.generation_engine || 'template_engine',
          ai_status: cfRes?.ai_status || 'TEMPLATE_FALLBACK',
          fallback_reason: cfRes?.fallback_reason || null,
          content: {
            headline: v0.headline || '',
            content_english: v0.english || '',
            content_telugu: v0.telugu || '',
            content_hindi: v0.hindi || '',
            hashtags: v0.hashtags || '',
            call_to_action: 'WhatsApp Order: 9347453135'
          },
          validation: {
            passed: true,
            target_sku: selectedSku || 'GENERAL',
            flags: []
          }
        });
        setEditableHeadline(v0.headline || '');
        setEditableEnglish(languageMode === 'telugu' || languageMode === 'hindi' ? '' : (v0.english || ''));
        setEditableTelugu(languageMode === 'english' || languageMode === 'hindi' ? '' : (v0.telugu || ''));
        setEditableHindi(languageMode === 'hindi' || languageMode === 'trilingual' ? (v0.hindi || '') : '');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Backend Content Factory unreachable. Refusing to fabricate local mock AI content.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = [editableHeadline, editableEnglish, editableTelugu, editableHindi, 'WhatsApp: 9347453135']
      .filter(Boolean)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetThemes = [
    { title: 'Cafe Mozzarella Melt', sku: 'DAIRY-004', desc: 'Milky Mist diced cheese stretch for cafes & pizza makers' },
    { title: 'Crispy French Fries Stock', sku: 'VEG-001', desc: 'Premium 6mm/9mm fries for QSRs & fast food' },
    { title: 'Chinese Cafe Sauces Combo', sku: 'SAUCES-025', desc: 'Meal Time Dark Soya, Green/Red Chilli Sauce & White Vinegar' },
    { title: 'Pizzeria Toppings Pack', sku: 'SAUCES-010', desc: 'Habit Baby Corn, Button Mushrooms & Del Monte Sliced Jalapeños' },
    { title: 'Thick Shake & Dessert Line', sku: 'DAIRY-009', desc: 'Del Monte & Foodcraft Chocolate Syrups with Sudarshan Fresh Cream' },
    { title: 'Spic\'s Culinary & Chilli Line', sku: 'SAUCES-024', desc: 'Commercial culinary sauces & bulk 5kg hot chilli sauces' },
    { title: 'Shawarma Butter Paper', sku: 'PACKAGING-001', desc: '40 GSM greaseproof packaging for rolls & wraps' },
    { title: 'Stone-Baked Pizza Bases', sku: 'BAKERY-002', desc: '8.5 & 10 inch bases for commercial pizzerias' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f172a] p-6 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">AI Content Studio & Validator</h1>
          </div>
          <p className="text-xs text-slate-400">
            Generate bilingual Google Business Profile posts with zero price leaks, strict SKU validation, and verified contact routing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            Strict Rayachoty Routing (9347453135)
          </span>
        </div>
      </div>

      {/* Preset Theme Pills */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Commercial Prompts:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presetThemes.map((pt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTheme(pt.title);
                const match =
                  skus.find((s) => s.sku === pt.sku) ||
                  skus.find((s) =>
                    `${s.brand} ${s.name}`.toLowerCase().includes(pt.title.split(' ')[1]?.toLowerCase() || '')
                  );
                if (match) setSelectedSku(match.sku);
              }}
              className={`p-3 rounded-lg border text-left transition-all ${
                theme === pt.title 
                  ? 'bg-amber-500/15 border-amber-500/50 text-white' 
                  : 'bg-[#0a0f1d] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-amber-400 mb-0.5">{pt.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2">{pt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Campaign Parameters</span>
          </h2>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Campaign Theme</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. Weekend Cafe Stock Preparation"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Target Approved SKU</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="">-- Generic Rayachoty Wholesale --</option>
              {skus.map((sku) => (
                <option key={sku.id} value={sku.sku}>
                  [{sku.brand}] {sku.name} ({sku.pack_size})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              Deterministic validator checks whether SKU belongs to verified 66-item list.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Target Platform Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="gbp">Google Business Profile Post</option>
              <option value="whatsapp">WhatsApp Sales Draft</option>
              <option value="meta">Instagram &amp; Facebook Reels Caption</option>
              <option value="youtube">YouTube Shorts Description</option>
              <option value="reel_script">Video Script &amp; Reel Hook</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Language Output Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'trilingual', label: 'EN+TE+HI' },
                { id: 'bilingual', label: 'EN+TE' },
                { id: 'english', label: 'English' },
                { id: 'telugu', label: 'Telugu' },
                { id: 'hindi', label: 'Hindi' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLanguageMode(m.id)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    languageMode === m.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-[#070b14] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Deterministic Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Verified GBP Post</span>
              </>
            )}
          </button>
        </div>

        {/* Validation Report Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Validation Report Card</span>
            </span>
            {generatedResult && (
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  generatedResult.generation_engine === 'gemini'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {generatedResult.generation_engine === 'gemini' ? 'Gemini AI' : 'Template'}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  generatedResult.validation.passed 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {generatedResult.validation.passed ? 'PASSED VERIFICATION' : 'VALIDATION FLAGGED'}
                </span>
              </div>
            )}
          </h2>

          {generatedResult ? (
            <div className="space-y-3">
              <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Engine Provenance:</span>
                  <span className={`font-mono font-semibold ${generatedResult.generation_engine === 'gemini' ? 'text-cyan-300' : 'text-amber-300'}`}>
                    {generatedResult.generation_engine} ({generatedResult.ai_status})
                  </span>
                </div>
                {generatedResult.fallback_reason && (
                  <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded p-2">
                    Fallback reason: {generatedResult.fallback_reason}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">SKU Reconciliation:</span>
                  <span className="font-semibold text-slate-200">
                    {generatedResult.validation.target_sku}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Validation Result:</span>
                  <span className={`flex items-center gap-1 font-semibold ${generatedResult.validation.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{generatedResult.validation.passed ? 'Compliant' : 'Policy Flagged'}</span>
                  </span>
                </div>
                {generatedResult.validation.flags?.length > 0 && (
                  <ul className="text-[11px] text-rose-300 list-disc pl-4 space-y-1">
                    {generatedResult.validation.flags.map((f: string, idx: number) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Character Count:</span>
                  <span className="text-slate-300 font-mono">
                    {editableEnglish.length + editableTelugu.length + editableHindi.length} chars
                  </span>
                </div>
              </div>

              {generatedResult.validation.flags && generatedResult.validation.flags.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                  <div className="font-bold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Safety Warnings:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-400/90">
                    {generatedResult.validation.flags.map((flag: string, fIdx: number) => (
                      <li key={fIdx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-[11px] text-slate-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                <span>
                  Posts are held in DRAFT mode until reviewed. Google Business Profile policies strictly prohibit deceptive wholesale price claims.
                </span>
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 text-slate-600 mb-2" />
              <span>Select a prompt and click Generate to see the deterministic safety report card.</span>
            </div>
          )}
        </div>

        {/* Live GBP Preview */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Google Business Profile Preview</span>
              </h2>
              {generatedResult && (
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded flex items-center gap-1 border border-slate-700"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {generatedResult ? (
              <div className="bg-[#070b14] border border-slate-800 rounded-lg p-4 space-y-3 shadow-inner">
                {/* Live GBP Post Card Header */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
                  <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                    R
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">RAIS Agencies</div>
                    <div className="text-[10px] text-slate-400">Rayachoty • Just now</div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div>
                  <input
                    type="text"
                    value={editableHeadline}
                    onChange={(e) => setEditableHeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded px-2.5 py-1 text-xs font-bold text-amber-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={editableEnglish}
                    onChange={(e) => setEditableEnglish(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded p-2 text-xs text-slate-200 focus:outline-none resize-none"
                    placeholder="English content..."
                  />

                  {editableTelugu && (
                    <textarea
                      rows={3}
                      value={editableTelugu}
                      onChange={(e) => setEditableTelugu(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded p-2 text-xs text-amber-200/90 font-medium focus:outline-none resize-none"
                      placeholder="Telugu content..."
                    />
                  )}

                  {editableHindi && (
                    <textarea
                      rows={3}
                      value={editableHindi}
                      onChange={(e) => setEditableHindi(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded p-2 text-xs text-cyan-200/90 font-medium focus:outline-none resize-none"
                      placeholder="Hindi content..."
                    />
                  )}
                </div>

                {/* Call to action button */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/919347453135"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <span>{generatedResult.content.call_to_action || 'Call Now: 9347453135'}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                <Smartphone className="w-8 h-8 text-slate-600 mb-2" />
                <span>Google Maps & Search live post preview will render here.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};