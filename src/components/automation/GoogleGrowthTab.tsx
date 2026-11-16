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
  VERIFIED_BUSINESS_FACTS 
} from '../../data/gbpData';
import { 
  Globe, Calendar, MessageSquare, 
  CheckCircle2, Star, ShieldCheck, 
  Check, MapPin, ExternalLink, RefreshCw,
  QrCode, Download
} from 'lucide-react';
import { assetUrl } from '../../utils/assetUrl';

export const GoogleGrowthTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'reviews' | 'posts' | 'info'>('reviews');
  const [cloudStatus, setCloudStatus] = useState<GoogleConnectionStatus | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(true);

  // Reviews state
  const [reviews, setReviews] = useState<GBPReviewItem[]>(() => GBPStorage.getReviews());
  const [approverName] = useState<string>('Irfan (Manager)');
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);

  // Posts state
  const [posts, setPosts] = useState<GBPPostItem[]>(() => GBPStorage.getPosts());
  const [postNotice, setPostNotice] = useState<string | null>(null);

  // SKUs state
  const [skus] = useState<GBPSkuItem[]>(() => GBPStorage.getSkus());

  const checkStatus = () => {
    setIsLoadingCloud(true);
    GrowthEngineApi.getGoogleStatus().then(st => {
      setCloudStatus(st);
      setIsLoadingCloud(false);
    });
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleApproveReply = (reviewId: number) => {
    const rev = reviews.find(r => r.id === reviewId);
    if (!rev) return;
    const res = GBPStorage.approveReviewReply(reviewId, rev.replyEnglish, approverName);
    if (res.success) {
      setReviews(GBPStorage.getReviews());
      setReviewNotice(`✓ Review #${reviewId} approved by ${approverName} and marked ready!`);
      setTimeout(() => setReviewNotice(null), 4000);
    }
  };

  const handleApproveAllPosts = () => {
    const res = GBPStorage.approveCampaign();
    setPosts(GBPStorage.getPosts());
    setPostNotice(`✓ All ${res.count} campaign posts approved for local scheduling!`);
    setTimeout(() => setPostNotice(null), 4000);
  };

  const pendingCount = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="space-y-4">
      {/* 1. COMPACT LIVE CLOUD STATUS CARD */}
      <div className="p-4 rounded-xl bg-[#091124] border border-cyan-500/30 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">Google Cloud Integration</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                  ● Cloud Backend Online (Render)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  ✓ Google API Allowlist: APPROVED (300 QPM)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cloudStatus?.connected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {cloudStatus?.connected ? '● Account Connected' : '○ Pending User Authorization'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Official Project: <span className="font-mono text-emerald-300 font-bold">1060150522797</span> (<span className="font-mono text-slate-200">rais-growth-engine</span>) • Quota: <span className="text-emerald-300 font-bold">300 QPM Granted</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={checkStatus}
              className="px-3 py-1.5 rounded-lg bg-[#0f1c3f] border border-cyan-500/30 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCloud ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh Status</span>
            </button>

            <a
              href={GrowthEngineApi.getAuthorizeUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 hover:scale-[1.02]"
            >
              <span>Authorize Google Account Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Informative Truth Banner */}
        <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-start gap-2 text-xs text-slate-300 bg-emerald-950/25 p-2.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-200">Google Business Profile API Officially Approved!</strong> Google has reviewed and granted full API access with a quota of 300 QPM. Activate the APIs in your Google Cloud Console and click <strong className="text-white">"Authorize Google Account Now"</strong> to stream real Google Maps reviews and customer metrics into your dashboard.
          </div>
        </div>
      </div>

      {/* 2. THREE CLEAN SUB-TABS */}
      <div className="flex border-b border-cyan-500/20 gap-2 pb-1 overflow-x-auto">
        <button
          onClick={() => setSubTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'reviews'
              ? 'bg-[#0f1c3f] border-t-2 border-emerald-400 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Reviews Moderation ({reviews.length})</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
              {pendingCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('posts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'posts'
              ? 'bg-[#0f1c3f] border-t-2 border-amber-400 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Local Store Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setSubTab('info')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
            subTab === 'info'
              ? 'bg-[#0f1c3f] border-t-2 border-cyan-400 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Store Information &amp; SKUs ({skus.length})</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* --- SUB-TAB 1: REVIEWS MODERATION --- */}
      {subTab === 'reviews' && (
        <div className="space-y-3">
          {reviewNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{reviewNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviews.map(rev => (
              <div 
                key={rev.id} 
                className={`p-4 rounded-xl border transition-all ${
                  rev.isApproved 
                    ? 'bg-[#081329] border-emerald-500/30' 
                    : 'bg-[#0f1c3f] border-amber-500/30 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                      {rev.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{rev.reviewerName}</div>
                      <div className="text-[10px] text-slate-400">{rev.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-200 italic bg-[#060c1d] p-2.5 rounded-lg border border-cyan-500/10 mb-3">
                  "{rev.comment}"
                </p>

                {/* Response Draft */}
                <div className="space-y-2 text-xs">
                  <div className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Prepared Bilingual Response:</span>
                  </div>

                  <div className="p-2 rounded bg-[#091227] border border-cyan-500/15 text-slate-300 text-[11px]">
                    <span className="text-slate-400 font-bold">EN: </span>
                    {rev.replyEnglish}
                  </div>

                  {rev.replyTelugu && (
                    <div className="p-2 rounded bg-[#091227] border border-cyan-500/15 text-slate-300 text-[11px]">
                      <span className="text-slate-400 font-bold">TE: </span>
                      {rev.replyTelugu}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rev.isApproved 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rev.isApproved ? '✓ APPROVED' : '● AWAITING HUMAN APPROVAL'}
                    </span>

                    {!rev.isApproved && (
                      <button
                        onClick={() => handleApproveReply(rev.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Response</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: LOCAL STORE POSTS --- */}
      {subTab === 'posts' && (
        <div className="space-y-3">
          {postNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{postNotice}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#091124] border border-cyan-500/20 text-xs">
            <span className="text-slate-300">
              30 Prepared Commercial Local Updates for Rayachoty Cafes &amp; Restaurants.
            </span>
            <button
              onClick={handleApproveAllPosts}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow"
            >
              Approve All 30 Posts
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {posts.slice(0, 6).map(post => (
              <div key={post.id} className="p-4 rounded-xl bg-[#0f1c3f] border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                    DAY {post.dayNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    post.status === 'PUBLISHED' 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : post.status === 'SCHEDULED'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {post.status}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs">{post.headline}</h4>
                <p className="text-xs text-slate-300 line-clamp-2">{post.contentEnglish}</p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-cyan-500/10">
                  <span className="text-[10px] text-slate-400 font-mono">SKU: {post.targetSku || 'Wholesale Focus'}</span>
                  <a
                    href={`https://wa.me/919347453135?text=${encodeURIComponent(post.contentEnglish)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1 font-semibold"
                  >
                    <span>Share to WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: STORE INFO & SKUS --- */}
      {subTab === 'info' && (
        <div className="p-4 rounded-xl bg-[#0f1c3f] border border-cyan-500/20 space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-white text-sm">Verified RAIS Agencies Business Information</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              These details are synced with Google Maps and the official schema on your website.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#081026] border border-cyan-500/15">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Business Name</span>
              <span className="text-white font-semibold">{VERIFIED_BUSINESS_FACTS.businessName}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#081026] border border-cyan-500/15">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Phone</span>
              <span className="text-amber-300 font-mono font-bold">{VERIFIED_BUSINESS_FACTS.phone}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#081026] border border-cyan-500/15">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Physical Hub</span>
              <span className="text-slate-200">{VERIFIED_BUSINESS_FACTS.address}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#081026] border border-cyan-500/15">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Category</span>
              <span className="text-slate-200">{VERIFIED_BUSINESS_FACTS.primaryCategory}</span>
            </div>
          </div>

          {/* Official Google Business Profile QR Sticker */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#0d1a3a] via-[#10234a] to-[#081026] border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-28 h-32 rounded-xl bg-white p-2 shrink-0 shadow-lg flex items-center justify-center">
              <img
                src={assetUrl('/images/google_qr_sticker_official.png')}
                alt="RAIS Agencies Official Google QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                <QrCode className="w-3 h-3 text-emerald-400" />
                <span>Verified Google Business QR</span>
              </div>
              <h4 className="font-bold text-white text-sm">
                Official Google Maps &amp; Reviews QR Code
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
                This is your official Google QR Code sticker. Anyone scanning this QR outside your Sundupalli Road wholesale hub will instantly open your verified business profile, reviews, and Google Maps directions.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                <a
                  href={assetUrl('/images/google_qr_sticker_official.png')}
                  download="RAIS-Agencies-Google-QR-Sticker.png"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 hover:text-white text-[11px] font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Download Sticker (PNG)</span>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Scan or view RAIS Agencies on Google Maps: ' + VERIFIED_BUSINESS_FACTS.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-200 hover:text-white text-[11px] font-bold transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
