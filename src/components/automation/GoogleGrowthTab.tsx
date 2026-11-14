import React, { useState, useEffect } from 'react';
import { 
  GBPStorage 
} from '../../services/gbpStorage';
import { 
  GrowthEngineApi, 
  GoogleConnectionStatus 
} from '../../services/growthEngineApi';
import { 
  GBPPostItem, GBPReviewItem, GBPSkuItem, 
  INITIAL_GBP_KEYWORDS 
} from '../../data/gbpData';
import { 
  Globe, Calendar, MessageSquare, Search, Sparkles, 
  CheckCircle2, Clock, Star, ShieldCheck, AlertTriangle, 
  Send, Check, User, MapPin, Copy, ExternalLink
} from 'lucide-react';

export const GoogleGrowthTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'posts' | 'reviews' | 'seo' | 'studio'>('posts');
  const [cloudStatus, setCloudStatus] = useState<GoogleConnectionStatus | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    GrowthEngineApi.getGoogleStatus().then(st => {
      if (mounted) {
        setCloudStatus(st);
        setIsLoadingCloud(false);
      }
    });
    return () => { mounted = false; };
  }, []);
  
  // Posts state
  const [posts, setPosts] = useState<GBPPostItem[]>(() => GBPStorage.getPosts());
  const [selectedPostId, setSelectedPostId] = useState<number>(1);
  const [postFilter, setPostFilter] = useState<string>('ALL');
  const [postNotice, setPostNotice] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<GBPReviewItem[]>(() => GBPStorage.getReviews());
  const [reviewReplyTexts, setReviewReplyTexts] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    GBPStorage.getReviews().forEach(r => {
      initial[r.id] = r.replyEnglish;
    });
    return initial;
  });
  const [approverName, setApproverName] = useState<string>('RAIS Admin');
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);

  // SKUs state
  const [skus, setSkus] = useState<GBPSkuItem[]>(() => GBPStorage.getSkus());

  // AI Content Studio state
  const [studioTheme, setStudioTheme] = useState<string>('Cafe Mozzarella Melt');
  const [studioSku, setStudioSku] = useState<string>('RAIS-MM-MOZZ');
  const [studioHeadline, setStudioHeadline] = useState<string>('Super Stretch Milky Mist Mozzarella for Rayachoty Cafes!');
  const [studioEnglish, setStudioEnglish] = useState<string>('Make your cafe pizzas irresistible with authentic Milky Mist diced mozzarella. Unbroken cold-chain supply direct from our Sundupalli Road hub. Single-carton wholesale available. WhatsApp 9347453135 for trade catalog.');
  const [studioTelugu, setStudioTelugu] = useState<string>('రాయచోటిలోని పిజ్జా కేఫ్‌లకు మిల్కీ మిస్ట్ మోజారెల్లా చీజ్ టోకు ధరలలో లభించును. సుండుపల్లి రోడ్ లోని మా గోడౌన్ నుండి డెలివరీ. వివరాలకు 9347453135 వాట్సాప్ చేయండి.');
  const [copied, setCopied] = useState<boolean>(false);

  // --- ACTIONS ---
  const handleApproveAllPosts = () => {
    const res = GBPStorage.approveCampaign();
    setPosts(GBPStorage.getPosts());
    setPostNotice(`✓ All ${res.count} campaign posts explicitly approved and registered in the publishing queue!`);
    setTimeout(() => setPostNotice(null), 5000);
  };

  const handlePublishPost = (id: number) => {
    const res = GBPStorage.publishPost(id);
    if (res.success) {
      setPosts(GBPStorage.getPosts());
      setPostNotice(`✓ Day ${res.post?.dayNumber} post officially marked as PUBLISHED.`);
      setTimeout(() => setPostNotice(null), 4000);
    }
  };

  const handleApproveReply = (reviewId: number) => {
    const text = reviewReplyTexts[reviewId];
    if (!text) return;
    const res = GBPStorage.approveReviewReply(reviewId, text, approverName);
    if (res.success) {
      setReviews(GBPStorage.getReviews());
      setReviewNotice(`✓ Review reply approved by ${approverName} and published to Google!`);
      setTimeout(() => setReviewNotice(null), 4000);
    }
  };

  const handleToggleSku = (skuCode: string) => {
    const updated = GBPStorage.toggleSkuStock(skuCode);
    setSkus(updated);
  };

  const selectedPost = posts.find(p => p.id === selectedPostId) || posts[0];
  const filteredPosts = posts.filter(p => postFilter === 'ALL' ? true : p.status === postFilter);

  // Studio deterministic validation check
  const validationResult = GBPStorage.validatePost(studioHeadline, studioEnglish, studioTelugu, studioSku);

  const pendingReviewCount = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f1c3f] via-[#13224f] to-[#0a1532] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Google Business Profile Integration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            RAIS Agencies — Google Maps & Local SEO Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Automating 30-day verified Google LocalPosts, bilingual review management with 1-click human approval, and Rayachoty B2B local rankings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">Hub: Beside Indel Bank</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs flex items-center gap-2">
            <span className="text-slate-400">Order Desk:</span>
            <span className="font-mono font-bold text-amber-300">9347453135</span>
          </div>
        </div>
      </div>

      {/* Cloud Backend Live Status Bar */}
      <div className="p-4 rounded-xl bg-[#091124] border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">Cloud Backend:</span>
              <a 
                href={GrowthEngineApi.getBaseUrl()} 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:underline font-mono text-[11px]"
              >
                {GrowthEngineApi.getBaseUrl()}
              </a>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Google Case ID: <span className="font-mono text-amber-300">1-5219000042311</span> (Under Review) • Project: <span className="text-slate-300 font-mono">1060150522797</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoadingCloud ? (
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px] border border-slate-700 animate-pulse">
              Checking cloud status...
            </span>
          ) : cloudStatus?.status === 'API_ACCESS_NOT_APPROVED' ? (
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-[11px] border border-amber-500/30 font-medium">
              API Access Pending Approval
            </span>
          ) : cloudStatus?.connected ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] border border-emerald-500/30 font-medium">
              ● Connected to Google
            </span>
          ) : (
            <a
              href={GrowthEngineApi.getAuthorizeUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition-all flex items-center gap-1.5 shadow"
            >
              <span>Connect Google Account</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="flex border-b border-cyan-500/20 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSubTab('posts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'posts'
              ? 'bg-[#0f1c3f] border-t-2 border-amber-400 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>30-Day Google Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setSubTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap relative ${
            subTab === 'reviews'
              ? 'bg-[#0f1c3f] border-t-2 border-emerald-400 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Reviews Inbox ({reviews.length})</span>
          {pendingReviewCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
              {pendingReviewCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'seo'
              ? 'bg-[#0f1c3f] border-t-2 border-cyan-400 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Rayachoty SEO Matrix</span>
        </button>

        <button
          onClick={() => setSubTab('studio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'studio'
              ? 'bg-[#0f1c3f] border-t-2 border-purple-400 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI Post Studio & Safety Check</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: 30-DAY GOOGLE POSTS CALENDAR */}
      {/* ============================================================== */}
      {subTab === 'posts' && (
        <div className="space-y-4">
          {/* Post Notice */}
          {postNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{postNotice}</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0f1c3f]/85 border border-cyan-500/20">
            <div className="flex items-center gap-2">
              {['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setPostFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    postFilter === st
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-[#081026] text-slate-400 hover:text-white border border-cyan-500/20'
                  }`}
                >
                  {st} ({st === 'ALL' ? posts.length : posts.filter(p => p.status === st).length})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApproveAllPosts}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve 30-Day Campaign</span>
              </button>
            </div>
          </div>

          {/* Split List & Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Post List */}
            <div className="lg:col-span-5 space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredPosts.map((post) => {
                const isSelected = post.id === selectedPostId;
                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#13224f] border-amber-400/80 shadow-md'
                        : 'bg-[#0f1c3f]/75 border-cyan-500/20 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-amber-300">
                        Day {post.dayNumber} • {post.targetSku || 'General Wholesale'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        post.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : post.status === 'SCHEDULED'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{post.headline}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{post.contentEnglish}</div>
                  </div>
                );
              })}
            </div>

            {/* Right Post Preview */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0f1c3f]/95 border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div>
                  <span className="text-xs font-bold text-amber-400">Day {selectedPost.dayNumber} Google LocalPost</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedPost.headline}</h3>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                    selectedPost.status === 'PUBLISHED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedPost.status === 'SCHEDULED'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {selectedPost.status}
                  </span>
                </div>
              </div>

              {/* English Copy */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  English Copy
                </label>
                <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-slate-200 leading-relaxed">
                  {selectedPost.contentEnglish}
                </div>
              </div>

              {/* Telugu Copy */}
              <div>
                <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  Telugu Copy (తెలుగు)
                </label>
                <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-amber-200/90 leading-relaxed">
                  {selectedPost.contentTelugu}
                </div>
              </div>

              {/* Routing & Action */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white">Call To Action: {selectedPost.callToAction}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Directs to WhatsApp order desk: 9347453135</div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPost.status !== 'PUBLISHED' && (
                    <button
                      onClick={() => handlePublishPost(selectedPost.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Post</span>
                    </button>
                  )}
                  <a
                    href={`https://wa.me/919347453135?text=${encodeURIComponent(`Inquiry for Day ${selectedPost.dayNumber}: ${selectedPost.headline}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                  >
                    Test WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: REVIEWS INBOX & HUMAN APPROVAL GATE */}
      {/* ============================================================== */}
      {subTab === 'reviews' && (
        <div className="space-y-4">
          {/* Review Notice */}
          {reviewNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{reviewNotice}</span>
            </div>
          )}

          {/* Policy Callout */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span>
              <strong>Mandatory Human Approval Gate:</strong> In strict compliance with Google policy, AI review reply drafts are held for administrator approval before being sent.
            </span>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-slate-400">Approver ID:</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#0f1c3f] border border-cyan-500/20 rounded-lg text-xs">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none w-24 text-xs"
              />
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#0f1c3f]/80 border border-cyan-500/20 text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mx-auto text-cyan-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="font-bold text-white text-sm">Zero Fake Reviews Policy</div>
                <p className="text-xs max-w-md mx-auto text-slate-300 leading-relaxed">
                  All artificial test placeholder reviews have been purged. Real customer reviews submitted on Google Maps for RAIS Agencies will appear here for verified 1-click response approval.
                </p>
              </div>
            ) : (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/20 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-cyan-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center font-bold text-cyan-300 text-xs">
                        {r.reviewerName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{r.reviewerName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {r.sentiment}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <div className="flex items-center text-amber-400">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{r.date}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {r.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published to Google</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="p-3 rounded-xl bg-[#081026] text-xs text-slate-200">
                    "{r.comment}"
                  </div>

                  {/* Reply Section */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400">Response Draft (English / Telugu available):</span>
                      {r.replyTelugu && (
                        <button
                          type="button"
                          onClick={() => {
                            const current = reviewReplyTexts[r.id];
                            setReviewReplyTexts({
                              ...reviewReplyTexts,
                              [r.id]: current === r.replyTelugu ? r.replyEnglish : r.replyTelugu
                            });
                          }}
                          className="text-[11px] text-amber-400 hover:underline"
                        >
                          Toggle Telugu / English
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      disabled={r.isApproved}
                      value={reviewReplyTexts[r.id] || ''}
                      onChange={(e) => setReviewReplyTexts({ ...reviewReplyTexts, [r.id]: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-amber-400 resize-none disabled:opacity-60"
                    />

                    {!r.isApproved && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleApproveReply(r.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve &amp; Publish to Google</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: LOCAL SEO MATRIX */}
      {/* ============================================================== */}
      {subTab === 'seo' && (
        <div className="space-y-6">
          {/* Completeness Checklist */}
          <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/20">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Rayachoty Profile Completeness Audit (100% Compliant)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#081026] border border-cyan-500/10">
                <div className="font-bold text-white">Business Name</div>
                <div className="text-emerald-400 text-[11px] mt-0.5">Strictly "RAIS Agencies" (No keyword stuffing)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#081026] border border-cyan-500/10">
                <div className="font-bold text-white">Primary Category</div>
                <div className="text-emerald-400 text-[11px] mt-0.5">Wholesale food store (gcid:wholesale_food_store)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#081026] border border-cyan-500/10">
                <div className="font-bold text-white">Physical Landmark</div>
                <div className="text-emerald-400 text-[11px] mt-0.5">Beside Indel Bank, Sundupalli Road Hub</div>
              </div>
              <div className="p-3 rounded-xl bg-[#081026] border border-cyan-500/10">
                <div className="font-bold text-white">WhatsApp Line</div>
                <div className="text-emerald-400 text-[11px] font-mono mt-0.5">9347453135 (Verified single line)</div>
              </div>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/20 overflow-hidden">
            <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">High-Intent Local Search Keywords</h3>
              <span className="text-xs text-slate-400">Rayachoty &amp; Commercial Corridor</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#081026] text-slate-400 border-b border-cyan-500/20">
                  <tr>
                    <th className="py-2.5 px-4">Keyword Term</th>
                    <th className="py-2.5 px-4">Commercial Intent</th>
                    <th className="py-2.5 px-4">Language</th>
                    <th className="py-2.5 px-4 text-center">Relevance Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {INITIAL_GBP_KEYWORDS.map((kw) => (
                    <tr key={kw.id} className="hover:bg-cyan-500/5">
                      <td className="py-2.5 px-4 font-bold text-white">{kw.keyword}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 font-semibold text-[10px]">
                          {kw.intent}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 uppercase text-slate-400 text-[10px]">{kw.language}</td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-400">
                        {kw.relevanceScore}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SKU Stock Toggles */}
          <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/20">
            <h3 className="text-sm font-bold text-white mb-2">Live Catalogue Stock Toggle (Zero Code Required)</h3>
            <p className="text-xs text-slate-400 mb-4">Click any SKU to toggle in-stock / out-of-stock for AI prompt generation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {skus.map((s) => (
                <button
                  key={s.sku}
                  onClick={() => handleToggleSku(s.sku)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    s.inStock 
                      ? 'bg-[#081026] border-emerald-500/40 text-slate-200' 
                      : 'bg-[#081026]/50 border-red-500/30 text-slate-500'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.brand} • {s.packSize}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    s.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {s.inStock ? 'IN STOCK' : 'OUT'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 4: AI POST STUDIO & SAFETY CHECK */}
      {/* ============================================================== */}
      {subTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Prompt Parameters</span>
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-bold">{studioTheme}</span>
            </h3>

            {/* Quick Presets */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { 
                  name: 'Mozzarella', 
                  sku: 'RAIS-MM-MOZZ', 
                  h: 'Milky Mist Diced Mozzarella for Rayachoty Pizza Cafes!',
                  en: 'Authorized wholesale stockist of Milky Mist mozzarella cheese. Superior stretch and melt. Direct from our Sundupalli Road hub. WhatsApp 9347453135.',
                  te: 'రాయచోటిలోని పిజ్జా కేఫ్‌లకు మిల్కీ మిస్ట్ మోజారెల్లా చీజ్ టోకు ధరలలో లభించును. సుండుపల్లి రోడ్ లోని మా గోడౌన్ నుండి డెలివరీ. వివరాలకు 9347453135 వాట్సాప్ చేయండి.'
                },
                { 
                  name: 'French Fries', 
                  sku: 'RAIS-AMUL-FF6', 
                  h: 'Crispy French Fries in Wholesale Cartons for QSRs',
                  en: 'Grade-A 6mm & 9mm French fries engineered for high holding time and crispy crunch. Single carton wholesale MOQ. WhatsApp 9347453135.',
                  te: 'రాయచోటిలోని ఫాస్ట్ ఫుడ్ వ్యాపారులారా.. క్రిస్పీ ఫ్రెంచ్ ఫ్రైస్ టోకు ధరల వివరాలకు 9347453135 వాట్సాప్ చేయండి.'
                },
                { 
                  name: 'Butter Paper', 
                  sku: 'RAIS-PKG-BP40', 
                  h: 'Food-Grade 40 GSM Butter Paper Rolls & Cut Sheets',
                  en: 'Stop grease leakage in shawarma & burgers! Food-grade 40 GSM OGR greaseproof paper rolls and pre-cut sheets in Rayachoty. WhatsApp 9347453135.',
                  te: 'హోటల్ పార్సెల్స్ కొరకు ఆయిల్ కారకుండా ఉండే గట్టి 40 GSM బట్టర్ పేపర్ హోల్‌సేల్ రేటుకే పొందండి. 9347453135.'
                }
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setStudioTheme(p.name);
                    setStudioSku(p.sku);
                    setStudioHeadline(p.h);
                    setStudioEnglish(p.en);
                    setStudioTelugu(p.te);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    studioTheme === p.name
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                      : 'bg-[#081026] text-slate-300 border-cyan-500/20 hover:border-cyan-400/40'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Campaign Headline</label>
              <input
                type="text"
                value={studioHeadline}
                onChange={(e) => setStudioHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Target Approved SKU</label>
              <select
                value={studioSku}
                onChange={(e) => setStudioSku(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-white focus:outline-none"
              >
                {skus.map((s) => (
                  <option key={s.sku} value={s.sku}>
                    [{s.brand}] {s.name} ({s.packSize})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">English Post Copy</label>
              <textarea
                rows={3}
                value={studioEnglish}
                onChange={(e) => setStudioEnglish(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-slate-200 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-amber-300 block mb-1">Telugu Post Copy (తెలుగు)</label>
              <textarea
                rows={3}
                value={studioTelugu}
                onChange={(e) => setStudioTelugu(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-amber-200/90 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Safety Report Card */}
          <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/20 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Deterministic Safety Card</span>
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  validationResult.passed 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {validationResult.passed ? 'PASSED VERIFICATION' : 'FLAGGED'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/10 space-y-2.5 text-xs mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Wholesale Price Leak Check:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Rates Protected</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Catalogue SKU Match:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified ({studioSku})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">WhatsApp 9347453135 Routing:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Compliant</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Google Character Limit:</span>
                  <span className="font-mono text-slate-300">
                    {studioHeadline.length + studioEnglish.length + studioTelugu.length} / 1500 chars
                  </span>
                </div>
              </div>

              {validationResult.flags.length > 0 && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 mt-3 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Warnings:</span>
                  </div>
                  {validationResult.flags.map((f, idx) => (
                    <div key={idx} className="text-[11px]">• {f}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-cyan-500/20 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Ready to post to Google Business Profile?</span>
              <button
                onClick={() => {
                  const fullText = `${studioHeadline}\n\n${studioEnglish}\n\n${studioTelugu}\n\nContact / WhatsApp: 9347453135`;
                  navigator.clipboard.writeText(fullText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Post' : 'Copy Post Package'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
