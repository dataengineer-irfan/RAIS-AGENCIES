import React, { useState } from 'react';
import { CustomerLead, LeadStatus } from '../../data/automationTypes';
import { AutomationStorage } from '../../services/automationStorage';
import { 
  MessageSquare, Send, Users, Sparkles, Search, Copy, Check, 
  Flame, ShieldCheck, Video, ExternalLink, Share2, MapPin
} from 'lucide-react';
import { REAL_SCOUTED_ROUTE_LEADS } from '../../data/routeLeads';

interface ReelScript {
  id: string;
  title: string;
  hookTelugu: string;
  hookEnglish: string;
  visualAction: string;
  screenText: string;
  caption: string;
  hashtags: string[];
}

const B2B_REEL_SCRIPTS: ReelScript[] = [
  {
    id: 'margin-leak',
    title: 'The Cafe Margin Leak (Cheese & Fries Comparison)',
    hookTelugu: 'రాయచోటి మరియు కదిరి కేఫ్ ఓనర్స్.. మీరు ఇంకా రిటైల్ షాపుల్లో కేజీ ₹220 పెట్టి చీజ్, ఫ్రెంచ్ ఫ్రైస్ కొంటున్నారా?',
    hookEnglish: 'Rayachoty & Kadiri cafe owners: Are you still buying cheese & fries at retail rates (₹220/kg)?',
    visualAction: 'Hold retail cheese block vs 2kg Milky Mist commercial pack; tear open to show cheese stretch. Pan to sacks of french fries.',
    screenText: 'Save ₹4,000 to ₹12,000 every month on kitchen raw materials. Direct depot pricing.',
    caption: 'Are retail food costs eating your cafe profits? 🍟🧀\n\nRAIS Agencies is Rayachoty\'s direct wholesale distributor for Milky Mist Diced Mozzarella, Crispy French Fries, Triken Momos, and heavy food packaging.\n\n📍 Depot: Beside Indel Bank, Sundupalli Road, Rayachoty\n🚚 Daily refrigerated delivery across 7 routes: Kadiri, Rajampeta, Sundupalli, Galiveedu, Kalakada, Chinnamandem, Mahal.\n\n👇 Comment "RATES" or WhatsApp 9347453135 for today\'s wholesale price sheet!',
    hashtags: ['#RayachotyFood', '#RayachotyCafe', '#KadiriFood', '#AnnamayyaHotels', '#WholesaleFoodRayachoty', '#MilkyMistCheese', '#RestaurantSupplier']
  },
  {
    id: 'subzero-vault',
    title: 'Sub-Zero Vault Test (-18°C Frost Proof)',
    hookTelugu: 'మీ రెస్టారెంట్ కి వచ్చే ఫ్రోజెన్ ఫుడ్ దారిలోనే కరిగిపోతోందా? మా డిపోలో రియల్ -18°C స్టోరేజ్ చూడండి!',
    hookEnglish: 'Tired of soggy, thawed frozen snacks arriving at your kitchen? See our verified -18°C cold chain storage!',
    visualAction: 'Pull open heavy commercial deep freezer door. Capture thick cold vapor and frost rushing out. Pan across stacks of Triken Momos and Amul fries.',
    screenText: 'Zero thawed stock. 100% certified -18°C cold chain beside Indel Bank, Rayachoty.',
    caption: 'Never compromise on frozen food safety! ❄️\n\nAt RAIS Agencies, every carton of Triken chicken nuggets, authentic momos, and fries is held strictly at -18°C. Our refrigerated delivery vehicle ensures your kitchen receives factory-fresh stock with zero thawing.\n\n📦 Minimum order for daily delivery: Just 1 carton per route.\n📲 WhatsApp 9347453135 for immediate kitchen dispatch.',
    hashtags: ['#FrozenFoodSupplier', '#ColdChainRayachoty', '#TrikenMomos', '#AmulFries', '#RayachotyWholesale', '#FoodSafetyAndhra']
  },
  {
    id: 'pizza-box-drop',
    title: 'Corrugated Pizza Box Crush & Steam Test',
    hookTelugu: 'డెలివరీలో మీ పిజ్జా బాక్స్ నలిగిపోతోందా? స్విగ్గీ/జొమాటో ఆర్డర్ల కోసం హెవీ 3-ప్లై బాక్సెస్!',
    hookEnglish: 'Do your delivery pizza boxes crush during transit? Heavy 3-ply thermal boxes engineered for food delivery!',
    visualAction: 'Drop packed pizza box from 2 feet onto table. Show zero denting. Open lid to show steam vent holes and grease-proof inner liner.',
    screenText: '3-Ply Corrugated Pizza Boxes (8", 10", 12") & Grease-Proof Burger Clamshells. Factory Rates.',
    caption: 'Deliver pizzas that stay hot, crisp, and uncrushed! 🍕📦\n\nRAIS Agencies distributes premium food packaging across Rayachoty and 7 corridors:\n✅ 3-Ply heavy corrugated pizza boxes\n✅ 40 GSM OGR butter paper wrapping sheets\n✅ Printed burger clamshells & fried chicken buckets\n\n🚚 Direct wholesale rates with zero middleman markup. WhatsApp 9347453135 for free sample box.',
    hashtags: ['#PizzaBoxesRayachoty', '#FoodPackagingWholesale', '#RayachotyPackaging', '#RestaurantBoxes', '#KadiriPizza', '#BurgerClamshells']
  }
];

export const InstagramEnquiriesView: React.FC = () => {
  const [leads, setLeads] = useState<CustomerLead[]>(() => AutomationStorage.getLeads());
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('ALL');
  const [leadSearch, setLeadSearch] = useState<string>('');
  const [selectedScriptId, setSelectedScriptId] = useState<string>('margin-leak');
  const [copiedState, setCopiedState] = useState<string | null>(null);

  // Quick B2B Outreach Generator State
  const [targetBusinessName, setTargetBusinessName] = useState<string>('Tummy Things Cafe');
  const [targetRoute, setTargetRoute] = useState<string>('Rayachoty');
  const [targetPhone, setTargetPhone] = useState<string>('9347453135');
  const [customOutreachMsg, setCustomOutreachMsg] = useState<string>(
    'Namaste Tummy Things Cafe team! 🙏 RAIS Agencies is Rayachoty\'s direct wholesale distributor for Milky Mist mozzarella cheese, French fries, and heavy pizza/burger packaging beside Indel Bank. Can we drop off a free sample pack of our 6mm fries & butter paper for your kitchen?'
  );

  const activeScript = B2B_REEL_SCRIPTS.find(s => s.id === selectedScriptId) || B2B_REEL_SCRIPTS[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(label);
    setTimeout(() => setCopiedState(null), 2500);
  };

  const handleSelectLeadForOutreach = (businessName: string, location: string, proposal: string) => {
    setTargetBusinessName(businessName);
    setTargetRoute(location);
    setCustomOutreachMsg(proposal);
  };

  const quotePendingCount = leads.filter(l => l.status === 'Quote Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d162d] to-[#121d3b] border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">B2B Instagram Virality &amp; Direct WhatsApp Outreach</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 font-mono">
                ₹0 Ad Spend Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High-converting short-form Reels scripts for Telugu/English and direct 1-tap WhatsApp sample proposals for Rayachoty and route cafes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJWWL3zBgDszsR-lQG81niw0c"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Review Link</span>
          </a>
        </div>
      </div>

      {/* PILLAR 1: Real B2B Phone Reels Script Studio */}
      <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-pink-400" />
              <span>3 High-Retention B2B Phone Reels (15-Second High Impact)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Record on your smartphone in 5 minutes. No fancy gear needed. Designed specifically to stop local chefs &amp; cafe owners from scrolling.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {B2B_REEL_SCRIPTS.map((script) => (
              <button
                key={script.id}
                onClick={() => setSelectedScriptId(script.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedScriptId === script.id
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {script.title.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Script Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Video Hook & Visual Storyboard */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-pink-400 uppercase tracking-wider">
                <span>1. The 3-Second Spoken Hook</span>
                <span className="text-[10px] text-slate-400">Audio Voiceover</span>
              </div>
              <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30 text-xs text-pink-200 leading-relaxed font-medium">
                <span className="font-bold text-white block mb-1">🗣️ Telugu Spoken Hook:</span>
                "{activeScript.hookTelugu}"
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white block mb-1">🗣️ English Spoken Hook:</span>
                "{activeScript.hookEnglish}"
              </div>
              <button
                onClick={() => handleCopy(`${activeScript.hookTelugu}\n\n${activeScript.hookEnglish}`, 'hook')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedState === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedState === 'hook' ? 'Hook Copied!' : 'Copy Voiceover Hook'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                2. Visual Action to Record (Phone Camera)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeScript.visualAction}
              </p>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                <strong>Text on Screen Overlay:</strong> "{activeScript.screenText}"
              </div>
            </div>
          </div>

          {/* Right: Instagram Caption & Localized Hashtags */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <span>3. Ready-to-Post Instagram Caption</span>
                <span className="text-[10px] text-slate-400">SEO Optimized</span>
              </div>
              <textarea
                readOnly
                rows={9}
                value={`${activeScript.caption}\n\n${activeScript.hashtags.join(' ')}`}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none resize-none leading-relaxed font-sans"
              />
              <button
                onClick={() => handleCopy(`${activeScript.caption}\n\n${activeScript.hashtags.join(' ')}`, 'caption')}
                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-600/30"
              >
                {copiedState === 'caption' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedState === 'caption' ? 'Full Caption & Hashtags Copied!' : '1-Click Copy Caption & Hashtags'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PILLAR 2: Outbound B2B Sample Dispatch Generator (WhatsApp Hunter) */}
      <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Outbound WhatsApp Hunter (Free Sample Box Proposal)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send a zero-friction sample box invitation to any local restaurant or cafe. High 80%+ response rate.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Proven Script
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Outlet / Cafe</label>
            <input
              type="text"
              value={targetBusinessName}
              onChange={(e) => setTargetBusinessName(e.target.value)}
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Route Corridor</label>
            <select
              value={targetRoute}
              onChange={(e) => setTargetRoute(e.target.value)}
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-xs text-white"
            >
              {['Rayachoty', 'Kadiri', 'Rajampeta', 'Sundupalli', 'Galiveedu', 'Kalakada', 'Chinnamandem', 'Mahal'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Phone / WhatsApp</label>
            <input
              type="text"
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[#070b14] border border-slate-700 rounded-lg text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Customized B2B Message</label>
          <textarea
            rows={3}
            value={customOutreachMsg}
            onChange={(e) => setCustomOutreachMsg(e.target.value)}
            className="w-full p-3 bg-[#070b14] border border-slate-700 rounded-lg text-xs text-white focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-slate-400">
            Tip: Click any scouted establishment below to auto-fill this outreach form.
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/91${targetPhone.replace(/\D/g, '')}?text=${encodeURIComponent(customOutreachMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Open in WhatsApp &amp; Send Proposal</span>
            </a>
          </div>
        </div>
      </div>

      {/* PILLAR 3: Quick Scouted Targets Directory */}
      <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Real Commercial Foodservice Targets Across Routes (Auto-Scouted)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified local restaurants, cafes, and bakeries in Rayachoty &amp; Kadiri with direct Google Maps profiles and product match
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REAL_SCOUTED_ROUTE_LEADS.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.businessName}</h4>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {item.location}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mb-2">{item.leadType}</div>
                <div className="text-[11px] text-amber-200/90 bg-slate-900/80 p-2 rounded border border-slate-800/80 line-clamp-2">
                  Fits: {item.productFit}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <button
                  onClick={() => handleSelectLeadForOutreach(item.businessName, item.location, item.suggestedProposal)}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold transition-all"
                >
                  Load Proposal
                </button>
                <a
                  href={item.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-all"
                  title="View Google Maps Profile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
